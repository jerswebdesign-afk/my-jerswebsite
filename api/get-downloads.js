import { supabase, TIERS, resolveTier, listAllFilePaths, createSignedUrlsInBatches } from './_lib/vault.js';

// Vercel Serverless Function. Auth-less by design: access is granted purely
// by proving a matching row exists in public.purchases, verified here with
// the service-role key. The browser never talks to Supabase directly.

const MIN_RESPONSE_MS = 350; // floors response time so success/failure can't be timed apart

const RATE_LIMIT_MAX_ATTEMPTS = 8;
const RATE_LIMIT_WINDOW_MINUTES = 15;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function normalizeEmail(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return isValid ? trimmed : null;
}

// Sliding-window rate limit backed by Postgres (the only durable store this
// stateless serverless function has access to - an in-memory counter would
// reset on every cold start and wouldn't be shared across instances).
async function checkRateLimit(ip) {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  // Bound table growth: drop this IP's own stale attempts before counting.
  await supabase.from('access_lookup_attempts').delete().eq('ip', ip).lt('created_at', windowStart);

  const { count, error } = await supabase
    .from('access_lookup_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', windowStart);

  if (error) {
    // Fail open on infra errors so a Supabase hiccup doesn't lock everyone
    // out - but this also means rate limiting is temporarily blind, so log it.
    console.error('Rate limit check failed, allowing request:', error);
    return { limited: false };
  }

  if ((count ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { limited: true, retryAfterSeconds: RATE_LIMIT_WINDOW_MINUTES * 60 };
  }

  await supabase.from('access_lookup_attempts').insert({ ip });
  return { limited: false };
}

async function resolveAccess(email) {
  const { data: purchases, error: purchaseError } = await supabase
    .from('purchases')
    .select('product')
    .eq('email', email); // exact match only - email is already normalized, and .eq() never treats input as a pattern

  if (purchaseError) {
    console.error('Failed to look up purchases:', purchaseError);
    return { status: 500, body: { error: 'Something went wrong. Try again shortly.' } };
  }

  if (!purchases || purchases.length === 0) {
    // Same response shape as the real "no files yet" case below - callers
    // can't distinguish "unknown email" from "known but empty" beyond this flag.
    return { status: 200, body: { access: false } };
  }

  const tier = resolveTier(purchases.map((p) => p.product)) || TIERS.LOWER;

  let paths;
  try {
    paths = await listAllFilePaths(tier.bucket);
  } catch (err) {
    console.error(`Failed to list files in bucket "${tier.bucket}":`, err.message);
    return { status: 500, body: { error: 'Something went wrong. Try again shortly.' } };
  }

  if (paths.length === 0) {
    return { status: 200, body: { access: true, tier: tier.label, files: [] } };
  }

  let signed;
  try {
    signed = await createSignedUrlsInBatches(tier.bucket, paths);
  } catch (err) {
    console.error('Failed to create signed URLs:', err.message);
    return { status: 500, body: { error: 'Something went wrong. Try again shortly.' } };
  }

  const files = signed
    .filter((item) => !item.error && item.signedUrl)
    .map((item) => ({
      path: item.path,
      name: item.path.split('/').pop(),
      url: item.signedUrl,
    }));

  return { status: 200, body: { access: true, tier: tier.label, files } };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(ip);
    if (rateLimit.limited) {
      res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many requests. Try again in a few minutes.' });
    }

    const email = normalizeEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    // Floor the response time so a valid email (purchases lookup + Storage
    // list + sign) can't be distinguished from an invalid one (single query)
    // purely by how long the request takes.
    const [result] = await Promise.all([resolveAccess(email), sleep(MIN_RESPONSE_MS)]);

    return res.status(result.status).json(result.body);
  } catch (err) {
    // Last-resort net: e.g. checkRateLimit()'s delete() isn't individually
    // guarded, so a Supabase connection problem there would otherwise crash
    // the whole invocation (FUNCTION_INVOCATION_FAILED) instead of returning
    // a normal response.
    console.error('get-downloads crashed:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Try again shortly.' });
  }
}

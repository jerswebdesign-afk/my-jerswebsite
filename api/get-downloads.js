import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function. Auth-less by design: access is granted purely
// by proving a matching row exists in public.purchases, verified here with
// the service-role key. The browser never talks to Supabase directly.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour
const LIST_PAGE_SIZE = 1000;
const SIGN_BATCH_SIZE = 100;
const MIN_RESPONSE_MS = 350; // floors response time so success/failure can't be timed apart

const RATE_LIMIT_MAX_ATTEMPTS = 8;
const RATE_LIMIT_WINDOW_MINUTES = 15;

// Product/tier structure as recorded by api/stripe-webhook.js. Ranked so a
// customer who bought both is served the higher one, and an unrecognized
// product value fails closed to the lower tier rather than the higher one.
const TIERS = {
  LOWER: { label: 'The JER Method', bucket: 'Story-one', rank: 1 },
  HIGHER: { label: 'The Reselling Engine', bucket: 'resel-ma', rank: 2 },
};

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

function resolveTier(products) {
  let best = null;
  for (const product of products) {
    const tier =
      product === TIERS.HIGHER.label ? TIERS.HIGHER :
      product === TIERS.LOWER.label ? TIERS.LOWER :
      null;
    if (tier && (!best || tier.rank > best.rank)) best = tier;
  }
  return best;
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

// Supabase Storage's list() only returns one directory level (up to
// LIST_PAGE_SIZE entries) at a time, so folders (entries with id: null) are
// walked recursively, and each level is paged in case it holds more than
// LIST_PAGE_SIZE files, to flatten the whole tree into file paths.
async function listAllFilePaths(bucket, prefix = '') {
  let paths = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: LIST_PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const entry of data) {
      const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) {
        paths = paths.concat(await listAllFilePaths(bucket, fullPath));
      } else {
        paths.push(fullPath);
      }
    }

    if (data.length < LIST_PAGE_SIZE) break;
    offset += LIST_PAGE_SIZE;
  }

  return paths;
}

async function createSignedUrlsInBatches(bucket, paths) {
  const results = [];
  for (let i = 0; i < paths.length; i += SIGN_BATCH_SIZE) {
    const batch = paths.slice(i, i + SIGN_BATCH_SIZE);
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(batch, SIGNED_URL_TTL_SECONDS);
    if (error) throw error;
    results.push(...(data ?? []));
  }
  return results;
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
}

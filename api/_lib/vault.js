import { createClient } from '@supabase/supabase-js';

// Shared service-role Supabase client for server-side /api functions that
// need to read Postgres or Storage directly. Never import this into
// frontend code and never send this key to the browser.
//
// URL falls back to VITE_SUPABASE_URL: it's the same project URL either way
// (not a secret), and Vercel exposes every configured env var to serverless
// functions regardless of the VITE_ prefix - that prefix only controls what
// Vite inlines into the browser bundle. Two independently-set variables that
// must always hold the identical value is a needless way for this to break;
// this fallback removes that failure mode entirely. There is no equivalent
// fallback for the service-role key - it must never exist under a VITE_ name.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // createClient() throws synchronously if the URL is missing. This module
  // is imported at the top of every /api file that touches Postgres or
  // Storage, so an uncaught throw here crashes EVERY one of those requests
  // with a raw FUNCTION_INVOCATION_FAILED 500, not just the one that
  // happened to need it. Log clearly and fall back to a placeholder client
  // instead, so a missing env var turns into a normal caught error on the
  // specific request (handlers below already catch and report these).
  console.error(
    '[api/_lib/vault] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are missing. ' +
    'Set them in Vercel -> Project Settings -> Environment Variables (Production) and redeploy.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseServiceRoleKey || 'placeholder-service-role-key'
);

const LIST_PAGE_SIZE = 1000;
const SIGN_BATCH_SIZE = 100;
export const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

// Product/tier structure as recorded by api/stripe-webhook.js. Ranked so a
// customer who bought both is served the higher one, and an unrecognized
// product value fails closed to the lower tier rather than the higher one.
export const TIERS = {
  LOWER: { label: 'The JER Method', bucket: 'Story-one', rank: 1 },
  HIGHER: { label: 'The Reselling Engine', bucket: 'resel-ma', rank: 2 },
};

export function resolveTier(products) {
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

// Supabase Storage's list() only returns one directory level (up to
// LIST_PAGE_SIZE entries) at a time, so folders (entries with id: null) are
// walked recursively, and each level is paged in case it holds more than
// LIST_PAGE_SIZE files, to flatten the whole tree into file paths.
export async function listAllFilePaths(bucket, prefix = '') {
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

export async function createSignedUrlsInBatches(bucket, paths) {
  const results = [];
  for (let i = 0; i < paths.length; i += SIGN_BATCH_SIZE) {
    const batch = paths.slice(i, i + SIGN_BATCH_SIZE);
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(batch, SIGNED_URL_TTL_SECONDS);
    if (error) throw error;
    results.push(...(data ?? []));
  }
  return results;
}

import { createClient } from '@supabase/supabase-js';

// Shared service-role Supabase client for server-side /api functions that
// need to read Postgres or Storage directly. Never import this into
// frontend code and never send this key to the browser.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

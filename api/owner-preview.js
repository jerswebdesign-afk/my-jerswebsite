import { resolveOwner } from './_lib/owner.js';
import { TIERS, listAllFilePaths, createSignedUrlsInBatches } from './_lib/vault.js';

// Vercel Serverless Function, owner/dev only. Lets a verified admins-table
// account preview either tier's real vault files without needing a row in
// public.purchases - existing customers still go through api/get-downloads.js
// unchanged. Every request re-verifies the caller's session server-side.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { isOwner } = await resolveOwner(req);
  if (!isOwner) {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const tierKey = req.body?.tier === 'lower' ? 'LOWER' : req.body?.tier === 'higher' ? 'HIGHER' : null;
  if (!tierKey) {
    return res.status(400).json({ error: 'tier must be "lower" or "higher".' });
  }
  const tier = TIERS[tierKey];

  try {
    const paths = await listAllFilePaths(tier.bucket);
    const files = paths.length === 0
      ? []
      : (await createSignedUrlsInBatches(tier.bucket, paths))
          .filter((item) => !item.error && item.signedUrl)
          .map((item) => ({ path: item.path, name: item.path.split('/').pop(), url: item.signedUrl }));

    return res.status(200).json({ tier: tier.label, files });
  } catch (err) {
    console.error(`Owner preview failed for bucket "${tier.bucket}":`, err.message);
    // Unlike api/get-downloads.js (public, unauthenticated), this endpoint is
    // already gated on a verified owner above - safe to return the real
    // Storage error instead of a generic message, since only that owner
    // audience ever sees this response, and it's exactly what a dev needs to
    // tell "wrong bucket/path" apart from "bad credentials" apart from "no
    // storage policy" without reading server logs.
    return res.status(500).json({ error: `Storage error for bucket "${tier.bucket}": ${err.message}` });
  }
}

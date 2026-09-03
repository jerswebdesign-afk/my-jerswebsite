import { resolveOwner } from './_lib/owner.js';

// Vercel Serverless Function. Tells the frontend whether the calling
// browser's current Supabase session belongs to an account listed in
// public.admins. The decision is made entirely here, server-side, against
// a verified session token - the client cannot influence the result by
// sending an email, a flag, or anything else in the request body.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { isOwner } = await resolveOwner(req);
  return res.status(200).json({ isOwner });
}

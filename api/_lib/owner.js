import { createClient } from '@supabase/supabase-js';

export function getBearerToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

// Verifies owner/dev status by calling public.is_owner() AS the caller -
// this client is built with the caller's own access token, not the
// service-role key, so it can never see more than that one request's own
// identity. is_owner() is a security-definer Postgres function that only
// ever answers "is the currently authenticated JWT's email in
// public.admins" - it takes no arguments, so it cannot be used to probe
// any other account, and RLS on admins is never touched or bypassed by a
// broad key here. An invalid, missing, or expired token simply makes the
// RPC call itself fail (PostgREST rejects it before is_owner() ever runs),
// so this fails closed for both unauthenticated and forged requests.
export async function resolveOwner(req) {
  const token = getBearerToken(req);
  if (!token) return { isOwner: false, reason: 'no-session' };

  try {
    const asCaller = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await asCaller.rpc('is_owner');
    if (error) {
      console.error('Owner check failed:', error.message);
      // error.message here is a Supabase/Postgres error string (e.g. "Invalid
      // API key", "permission denied for function is_owner") - never the key
      // itself - safe to relay so a misconfigured env var is diagnosable
      // without server log access, instead of looking identical to a real
      // "not an admin" result.
      return { isOwner: false, reason: `rpc-error: ${error.message}` };
    }

    return { isOwner: data === true, reason: 'ok' };
  } catch (err) {
    // A missing/misconfigured SUPABASE_URL or VITE_SUPABASE_ANON_KEY makes
    // createClient() throw synchronously - catch it here so that fails
    // closed to "not an owner" instead of crashing the whole function
    // invocation (FUNCTION_INVOCATION_FAILED / 500) for every caller.
    console.error('Owner check crashed:', err.message);
    return { isOwner: false, reason: `crashed: ${err.message}` };
  }
}

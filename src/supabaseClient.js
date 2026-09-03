import { createClient } from '@supabase/supabase-js';

// Public/publishable key only - safe to expose in the browser. It cannot
// read purchases, admins, or any other table: those all have RLS enabled
// with no policies, so only the service-role key (server-side only, under
// /api) can touch them. This client exists solely to run owner/dev sign-in.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // createClient() throws synchronously if either arg is missing. This file
  // is imported (via useOwnerAccess.js) from every route component, and
  // main.jsx loads all routes eagerly - so an uncaught throw here blanks the
  // entire site, including the marketing/pricing pages that never touch
  // Supabase at all. Log loudly instead and fall through to a harmless
  // placeholder client: the owner/dev sign-in and tier-check calls that
  // actually use it already handle their own errors.
  console.error(
    '[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing. ' +
    'Owner/dev sign-in and tier checks are disabled until they are added in ' +
    'Vercel -> Project Settings -> Environment Variables and the site is redeployed.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseAnonKey || 'placeholder-anon-key'
);

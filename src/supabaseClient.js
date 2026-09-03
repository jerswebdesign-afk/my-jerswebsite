import { createClient } from '@supabase/supabase-js';

// Public/publishable key only - safe to expose in the browser. It cannot
// read purchases, admins, or any other table: those all have RLS enabled
// with no policies, so only the service-role key (server-side only, under
// /api) can touch them. This client exists solely to run owner/dev sign-in.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

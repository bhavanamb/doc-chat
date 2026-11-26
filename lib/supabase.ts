// Server-side Supabase client using the service role key.
// NEVER import this file in browser code or in components marked "use client".
// The service role key bypasses Row Level Security — keep it on the server only.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
  );
}

// createClient is called once at module load time (singleton pattern).
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

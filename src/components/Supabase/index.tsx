import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_KEY is not defined in the environment."
  );
}

export const Supabase = createClient(supabaseUrl, supabaseKey);



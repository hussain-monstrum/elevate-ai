import { createClient, SupabaseClient } from "@supabase/supabase-js";

export let supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Missing Supabase env variables");
    }

    supabase = createClient(url, key);
  }
  return supabase;
}

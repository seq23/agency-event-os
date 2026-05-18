import { createClient } from "@supabase/supabase-js";
import { getEnv, isSupabaseConfigured } from "@/lib/env";

export function createServerSupabaseClient() {
  const env = getEnv();

  if (!isSupabaseConfigured(env)) {
    throw new Error("Supabase server client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

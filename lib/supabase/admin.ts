import { createClient } from "@supabase/supabase-js";
import { getEnv, isSupabaseAdminConfigured } from "@/lib/env";

export function createSupabaseAdminClient() {
  const env = getEnv();

  if (!isSupabaseAdminConfigured(env)) {
    throw new Error("Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

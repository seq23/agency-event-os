import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { PermissionUser } from "@/types/permissions";
import { getAuthCookiePayload } from "./sessionCookie";
import { resolvePermissionUserForSupabaseUser } from "./authService";

export async function getCurrentUser(): Promise<PermissionUser | null> {
  if (!isSupabaseConfigured()) return null;

  const session = getAuthCookiePayload();
  if (!session?.accessToken) return null;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(session.accessToken);

  if (error || !data.user) return null;
  return resolvePermissionUserForSupabaseUser(data.user.id);
}

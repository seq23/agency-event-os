import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { PermissionUser } from "@/types/permissions";
import { getAuthCookiePayload } from "./sessionCookie";
import { resolvePermissionUserForSupabaseUser } from "./authService";

function getLocalPlaywrightGauntletUser(sessionAccessToken?: string): PermissionUser | null {
  if (process.env.LOCAL_PLAYWRIGHT_GAUNTLET_AUTH !== "true") return null;
  if (process.env.NODE_ENV !== "production") return null;
  if (sessionAccessToken !== "local-playwright-gauntlet-session") return null;

  return {
    id: "local-playwright-gauntlet-agency-user",
    name: "Local Playwright Producer",
    email: "local-playwright@westpeek.live",
    roles: ["agency_owner", "executive_producer", "producer"],
    agencyIds: ["00000000-0000-0000-0000-000000000001"],
    clientIds: ["00000000-0000-0000-0000-000000000101"],
    eventIds: ["demo", "event-summit"],
  };
}

export async function getCurrentUser(): Promise<PermissionUser | null> {
  const session = getAuthCookiePayload();
  const localGauntletUser = getLocalPlaywrightGauntletUser(session?.accessToken);
  if (localGauntletUser) return localGauntletUser;

  if (!isSupabaseConfigured()) return null;
  if (!session?.accessToken) return null;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(session.accessToken);

  if (error || !data.user) return null;
  return resolvePermissionUserForSupabaseUser(data.user.id);
}

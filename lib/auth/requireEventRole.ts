import { cookies } from "next/headers";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import type { V4SpecialGuestRole } from "@/types/v4";

export async function requireEventRole(eventId: string, role: V4SpecialGuestRole) {
  const env = getEnv();
  const names = getV5AccessCookieNames(env);
  const cookieValue = cookies().get(names.specialGuestCookieName)?.value;
  const payload = await readV5AccessCookie(cookieValue, getV5AccessCookieSecret(env));
  if (!payload || payload.kind !== "special_guest" || payload.eventId !== eventId || payload.role !== role) {
    throw new Error(`Forbidden event role: ${role}`);
  }
  return payload;
}

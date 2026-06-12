import { cookies } from "next/headers";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import type { V4SpecialGuestRole } from "@/types/v4";

export async function requireEventRole(eventId: string, role: V4SpecialGuestRole) {
  const env = getEnv();
  const names = getV5AccessCookieNames(env);
  const secret = getV5AccessCookieSecret(env);
  const cookieStore = cookies();

  const ownerPayload = await readV5AccessCookie(cookieStore.get(names.ownerCookieName)?.value, secret);
  if (ownerPayload?.kind === "owner") return ownerPayload;

  const payload = await readV5AccessCookie(cookieStore.get(names.specialGuestCookieName)?.value, secret);
  if (!payload || payload.kind !== "special_guest" || payload.eventId !== eventId || payload.role !== role) {
    throw new Error(`Forbidden event role: ${role}`);
  }
  return payload;
}

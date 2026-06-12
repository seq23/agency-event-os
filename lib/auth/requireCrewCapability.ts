import { cookies } from "next/headers";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { assertCanPerformCrewAction } from "@/lib/auth/v5RouteAuthorization";

export async function requireCrewCapability(action: string, eventId?: string) {
  const env = getEnv();
  const names = getV5AccessCookieNames(env);
  const secret = getV5AccessCookieSecret(env);
  const cookieStore = cookies();

  const ownerPayload = await readV5AccessCookie(cookieStore.get(names.ownerCookieName)?.value, secret);
  if (ownerPayload?.kind === "owner") return ownerPayload;

  const crewPayload = await readV5AccessCookie(cookieStore.get(names.crewCookieName)?.value, secret);
  assertCanPerformCrewAction(crewPayload, action, eventId);
  return crewPayload;
}

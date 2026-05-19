import { cookies } from "next/headers";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { assertCanPerformCrewAction } from "@/lib/auth/v5RouteAuthorization";

export async function requireCrewCapability(action: string, eventId?: string) {
  const env = getEnv();
  const names = getV5AccessCookieNames(env);
  const cookieValue = cookies().get(names.crewCookieName)?.value;
  const payload = await readV5AccessCookie(cookieValue, getV5AccessCookieSecret(env));
  assertCanPerformCrewAction(payload, action, eventId);
  return payload;
}

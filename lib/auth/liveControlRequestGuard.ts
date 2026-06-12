import { cookies } from "next/headers";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";

export async function requireLiveEventControlAccessForRequest(eventId?: string) {
  const env = getEnv();
  const names = getV5AccessCookieNames(env);
  const secret = getV5AccessCookieSecret(env);
  const cookieStore = cookies();
  const [operator, owner, crew] = await Promise.all([
    readV5AccessCookie(cookieStore.get(names.operatorCookieName)?.value, secret),
    readV5AccessCookie(cookieStore.get(names.ownerCookieName)?.value, secret),
    readV5AccessCookie(cookieStore.get(names.crewCookieName)?.value, secret),
  ]);
  if (owner?.kind === "owner") return { ok: true as const, actorRole: "owner" as const, payload: owner };
  if (operator?.kind === "operator" && (!operator.eventId || !eventId || operator.eventId === eventId)) return { ok: true as const, actorRole: "operator" as const, payload: operator };
  if (crew?.kind === "crew" && (!crew.eventId || !eventId || crew.eventId === eventId)) return { ok: true as const, actorRole: "crew" as const, payload: crew };
  return { ok: false as const, error: "Owner, showrunner/operator, or crew access required." };
}

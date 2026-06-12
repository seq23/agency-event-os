import { cookies } from "next/headers";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";

export async function requireOperatorAccessForRequest() {
  const env = getEnv();
  const { operatorCookieName, ownerCookieName } = getV5AccessCookieNames(env);
  const secret = getV5AccessCookieSecret(env);
  const cookieStore = cookies();
  const owner = await readV5AccessCookie(cookieStore.get(ownerCookieName)?.value, secret);
  if (owner?.kind === "owner") {
    return { ok: true as const, payload: owner, actorRole: "owner" as const };
  }
  const operator = await readV5AccessCookie(cookieStore.get(operatorCookieName)?.value, secret);
  if (!operator || operator.kind !== "operator") {
    return { ok: false as const, error: "Operator access required." };
  }
  return { ok: true as const, payload: operator, actorRole: "operator" as const };
}

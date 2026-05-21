import { cookies } from "next/headers";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";

export async function requireOperatorAccessForRequest() {
  const env = getEnv();
  const { operatorCookieName } = getV5AccessCookieNames(env);
  const payload = await readV5AccessCookie(cookies().get(operatorCookieName)?.value, getV5AccessCookieSecret(env));
  if (!payload || payload.kind !== "operator") {
    return { ok: false as const, error: "Operator access required." };
  }
  return { ok: true as const, payload };
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createV5AccessCookie, getV5CookieOptions } from "@/lib/auth/productionAccess";
import { getEnv, getOwnerMasterPassword, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { logAccessAttempt } from "@/services/access/accessAuditService";

function safeRedirectTarget(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/app";
}

export async function grantOwnerOverrideIfMatched(input: {
  password: string;
  route: string;
  next?: string;
}) {
  const env = getEnv();

  if (!input.password || input.password !== getOwnerMasterPassword(env)) {
    return false;
  }

  const { ownerCookieName } = getV5AccessCookieNames(env);
  const cookie = await createV5AccessCookie({
    kind: "owner",
    role: "owner",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  }, getV5AccessCookieSecret(env));

  await logAccessAttempt({
    status: "access_granted",
    accessKind: "owner",
    role: "owner",
    reason: "owner_master_override",
    route: input.route,
  });

  (await cookies()).set(ownerCookieName, cookie, getV5CookieOptions(60 * 60 * 12));
  redirect(safeRedirectTarget(input.next || "/app"));
}

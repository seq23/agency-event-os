import { NextResponse, type NextRequest } from "next/server";
import { createV5AccessCookie, getV5CookieOptions } from "@/lib/auth/productionAccess";
import { getEnv, getOwnerMasterPassword, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { redirectTo, safeAccessRedirectTarget } from "@/lib/auth/accessGateResponse";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const safeNext = safeAccessRedirectTarget(String(formData.get("next") ?? "/app"), "/app");
  const env = getEnv();

  if (password !== getOwnerMasterPassword(env)) {
    return redirectTo(request, "/production-access/owner?error=invalid");
  }

  const { ownerCookieName } = getV5AccessCookieNames(env);
  const cookie = await createV5AccessCookie({
    kind: "owner",
    role: "owner",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  }, getV5AccessCookieSecret(env));

  const response = redirectTo(request, safeNext);
  response.cookies.set(ownerCookieName, cookie, getV5CookieOptions(60 * 60 * 12));
  return response;
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/production-access/owner", request.url), 303);
}

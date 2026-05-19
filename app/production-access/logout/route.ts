import { NextResponse } from "next/server";
import { safeAccessCookieNames } from "@/lib/env/safeEnv";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { crewCookieName, specialGuestCookieName } = safeAccessCookieNames();
  const response = NextResponse.redirect(new URL("/production-access", request.url));
  response.cookies.delete(crewCookieName);
  response.cookies.delete(specialGuestCookieName);
  return response;
}

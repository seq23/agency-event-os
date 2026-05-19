import { NextResponse } from "next/server";
import { getV5AccessCookieNames } from "@/lib/env";

export async function GET(request: Request) {
  const { crewCookieName, specialGuestCookieName } = getV5AccessCookieNames();
  const response = NextResponse.redirect(new URL("/production-access", request.url));
  response.cookies.delete(crewCookieName);
  response.cookies.delete(specialGuestCookieName);
  return response;
}

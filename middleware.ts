import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieName } from "@/lib/env";
import { isProtectedPath } from "@/lib/auth/routeAccess";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const sessionCookie = request.cookies.get(getAuthCookieName())?.value;
  if (sessionCookie) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app/:path*", "/client/:path*", "/crew/:path*", "/speaker/:path*", "/sponsor/:path*"],
};

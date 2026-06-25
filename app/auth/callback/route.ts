import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { setAuthCookie } from "@/lib/auth/sessionCookie";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  if (!code) return NextResponse.redirect(new URL("/login?error=auth_callback_failed", url.origin));

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) return NextResponse.redirect(new URL("/login?error=auth_callback_failed", url.origin));

  await setAuthCookie({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  });

  return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/app", url.origin));
}

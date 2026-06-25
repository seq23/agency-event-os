"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getEnv } from "@/lib/env";
import { clearAuthCookie, setAuthCookie } from "./sessionCookie";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getRedirectPath(formData: FormData, fallback = "/app") {
  const next = getFormString(formData, "next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}

export async function loginWithPassword(formData: FormData) {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  const next = getRedirectPath(formData);

  if (!email || !password) redirect(`/login?error=missing_credentials&next=${encodeURIComponent(next)}`);

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) redirect(`/login?error=invalid_login&next=${encodeURIComponent(next)}`);

  await setAuthCookie({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  });

  redirect(next);
}

export async function signupWithPassword(formData: FormData) {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  const fullName = getFormString(formData, "full_name");

  if (!email || !password) redirect("/signup?error=missing_credentials");

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || email },
      emailRedirectTo: `${getEnv().NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/login?notice=check_email");
}

export async function requestPasswordReset(formData: FormData) {
  const email = getFormString(formData, "email");
  if (!email) redirect("/forgot-password?error=missing_email");

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getEnv().NEXT_PUBLIC_APP_URL}/auth/callback`,
  });

  if (error) redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect("/login?notice=password_reset_sent");
}

export async function logout() {
  await clearAuthCookie();
  redirect("/login");
}

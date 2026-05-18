import { cookies } from "next/headers";
import { getAuthCookieName } from "@/lib/env";
import type { AuthCookiePayload } from "./authTypes";

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function encodePayload(payload: AuthCookiePayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string): AuthCookiePayload | null {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as Partial<AuthCookiePayload>;
    if (!payload.accessToken || typeof payload.accessToken !== "string") return null;
    return {
      accessToken: payload.accessToken,
      refreshToken: typeof payload.refreshToken === "string" ? payload.refreshToken : undefined,
      expiresAt: typeof payload.expiresAt === "number" ? payload.expiresAt : undefined,
    };
  } catch {
    return null;
  }
}

export function getAuthCookiePayload(): AuthCookiePayload | null {
  try {
    const value = cookies().get(getAuthCookieName())?.value;
    if (!value) return null;
    return decodePayload(value);
  } catch {
    return null;
  }
}

export function setAuthCookie(payload: AuthCookiePayload) {
  cookies().set(getAuthCookieName(), encodePayload(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK_SECONDS,
  });
}

export function clearAuthCookie() {
  cookies().delete(getAuthCookieName());
}

export const authCookieTestUtils = {
  encodePayload,
  decodePayload,
};

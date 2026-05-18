import { describe, expect, it } from "vitest";
import { isSupabaseConfigured } from "@/lib/env";

describe("auth action prerequisites", () => {
  it("treats Supabase URL and anon key as required for real auth", () => {
    expect(
      isSupabaseConfigured({
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: "service",
        AUTH_SESSION_COOKIE_NAME: "agency_event_os_session",
        RESEND_API_KEY: "",
        EMAIL_FROM: "",
        VIDEO_PROVIDER: "mock",
      }),
    ).toBe(true);
  });
});

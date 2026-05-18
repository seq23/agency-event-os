import { describe, expect, it } from "vitest";
import { isResendConfigured, isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";

describe("env helpers", () => {
  it("detects missing Supabase config", () => {
    expect(
      isSupabaseConfigured({
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
        RESEND_API_KEY: "",
        EMAIL_FROM: "",
        VIDEO_PROVIDER: "mock",
      }),
    ).toBe(false);
  });

  it("detects configured Supabase public keys", () => {
    expect(
      isSupabaseConfigured({
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: "",
        RESEND_API_KEY: "",
        EMAIL_FROM: "",
        VIDEO_PROVIDER: "mock",
      }),
    ).toBe(true);
  });

  it("detects admin and email config independently", () => {
    const env = {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service",
      RESEND_API_KEY: "re_test",
      EMAIL_FROM: "events@example.com",
      VIDEO_PROVIDER: "mock" as const,
    };

    expect(isSupabaseAdminConfigured(env)).toBe(true);
    expect(isResendConfigured(env)).toBe(true);
  });
});

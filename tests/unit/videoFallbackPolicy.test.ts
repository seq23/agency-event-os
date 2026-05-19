import { describe, expect, it } from "vitest";
import { getNextVideoFallbackProvider, getVideoFallbackPolicy } from "@/services/video";

const baseEnv = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  AUTH_SESSION_COOKIE_NAME: "agency_event_os_session",
  RESEND_API_KEY: "re_test",
  EMAIL_FROM: "notifications@events.westpeek.live",
  EMAIL_REPLY_TO: "hello@westpeek.live",
  VIDEO_PROVIDER: "livekit" as const,
  DAILY_API_KEY: "daily-key",
  DAILY_API_BASE_URL: "https://api.daily.co/v1",
  DAILY_DOMAIN: "westpeeklive.daily.co",
};

describe("video fallback policy", () => {
  it("places Daily between LiveKit and Zoom when enabled", () => {
    const policy = getVideoFallbackPolicy({ ...baseEnv, DAILY_FALLBACK_ENABLED: "true" });

    expect(policy.order).toEqual(["livekit", "daily", "zoom_sdk", "google_meet"]);
    expect(policy.dailyAutomaticFallbackEnabled).toBe(true);
    expect(policy.producerPermissionRequiredForDaily).toBe(false);
    expect(getNextVideoFallbackProvider("livekit", { ...baseEnv, DAILY_FALLBACK_ENABLED: "true" })).toBe("daily");
  });

  it("skips Daily when the backend toggle is disabled", () => {
    const policy = getVideoFallbackPolicy({ ...baseEnv, DAILY_FALLBACK_ENABLED: "false" });

    expect(policy.order).toEqual(["livekit", "zoom_sdk", "google_meet"]);
    expect(policy.dailyAutomaticFallbackEnabled).toBe(false);
    expect(getNextVideoFallbackProvider("livekit", { ...baseEnv, DAILY_FALLBACK_ENABLED: "false" })).toBe("zoom_sdk");
  });
});

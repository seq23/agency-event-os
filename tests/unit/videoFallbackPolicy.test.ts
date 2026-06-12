import { describe, expect, it } from "vitest";
import { getNextVideoFallbackProvider, getVideoFallbackPolicy } from "@/services/video/videoFallbackPolicy";

const baseEnv = {
  DAILY_API_KEY: "daily-key",
  DAILY_API_BASE_URL: "https://api.daily.co/v1",
  DAILY_DOMAIN: "westpeeklive.daily.co",
  DAILY_FALLBACK_ENABLED: "true" as const,
};

describe("video fallback policy", () => {
  it("places Cloudflare Stream between LiveKit/StreamYard and Daily", () => {
    const policy = getVideoFallbackPolicy({ ...baseEnv, DAILY_FALLBACK_ENABLED: "true" });
    expect(policy.order).toEqual(["livekit", "cloudflare_stream", "daily", "zoom_sdk", "google_meet"]);
    expect(policy.producerPermissionRequiredForDaily).toBe(false);
    expect(getNextVideoFallbackProvider("livekit", { ...baseEnv, DAILY_FALLBACK_ENABLED: "true" })).toBe("cloudflare_stream");
    expect(getNextVideoFallbackProvider("cloudflare_stream", { ...baseEnv, DAILY_FALLBACK_ENABLED: "true" })).toBe("daily");
  });

  it("skips Daily when the backend toggle is disabled but keeps Cloudflare Stream before Zoom", () => {
    const policy = getVideoFallbackPolicy({ ...baseEnv, DAILY_FALLBACK_ENABLED: "false" });
    expect(policy.order).toEqual(["livekit", "cloudflare_stream", "zoom_sdk", "google_meet"]);
    expect(getNextVideoFallbackProvider("cloudflare_stream", { ...baseEnv, DAILY_FALLBACK_ENABLED: "false" })).toBe("zoom_sdk");
  });
});

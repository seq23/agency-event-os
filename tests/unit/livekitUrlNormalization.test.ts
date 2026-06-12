import { describe, expect, it } from "vitest";
import { normalizeLiveKitApiBaseUrl } from "@/services/video/livekitIngressService";

describe("LiveKit Twirp URL normalization", () => {
  it("converts websocket LiveKit URLs to HTTP API URLs for server-side Twirp fetch", () => {
    expect(normalizeLiveKitApiBaseUrl("wss://agency-event-os-q8euz085.livekit.cloud/")).toBe("https://agency-event-os-q8euz085.livekit.cloud");
    expect(normalizeLiveKitApiBaseUrl("ws://localhost:7880")).toBe("http://localhost:7880");
  });

  it("preserves existing HTTP API URLs", () => {
    expect(normalizeLiveKitApiBaseUrl("https://agency-event-os-q8euz085.livekit.cloud/")).toBe("https://agency-event-os-q8euz085.livekit.cloud");
  });
});

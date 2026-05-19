import { describe, expect, it, vi } from "vitest";
import { generateZoomMeetingSdkSignature, isZoomEmbeddedFallbackConfigured } from "@/services/video/zoomMeetingSdkAuth";

describe("zoomMeetingSdkAuth", () => {
  it("reports configuration availability", () => {
    const oldKey = process.env.ZOOM_MEETING_SDK_KEY;
    const oldSecret = process.env.ZOOM_MEETING_SDK_SECRET;

    process.env.ZOOM_MEETING_SDK_KEY = "sdk_key";
    process.env.ZOOM_MEETING_SDK_SECRET = "sdk_secret";

    expect(isZoomEmbeddedFallbackConfigured()).toBe(true);

    process.env.ZOOM_MEETING_SDK_KEY = oldKey;
    process.env.ZOOM_MEETING_SDK_SECRET = oldSecret;
  });

  it("generates a three-part JWT signature", () => {
    const oldKey = process.env.ZOOM_MEETING_SDK_KEY;
    const oldSecret = process.env.ZOOM_MEETING_SDK_SECRET;

    process.env.ZOOM_MEETING_SDK_KEY = "sdk_key";
    process.env.ZOOM_MEETING_SDK_SECRET = "sdk_secret";

    const result = generateZoomMeetingSdkSignature({ meetingNumber: "12345678901", role: 0 });

    expect(result.sdkKey).toBe("sdk_key");
    expect(result.meetingNumber).toBe("12345678901");
    expect(result.role).toBe(0);
    expect(result.signature.split(".")).toHaveLength(3);

    process.env.ZOOM_MEETING_SDK_KEY = oldKey;
    process.env.ZOOM_MEETING_SDK_SECRET = oldSecret;
  });

  it("fails closed if Zoom SDK credentials are missing", () => {
    const oldKey = process.env.ZOOM_MEETING_SDK_KEY;
    const oldSecret = process.env.ZOOM_MEETING_SDK_SECRET;

    delete process.env.ZOOM_MEETING_SDK_KEY;
    delete process.env.ZOOM_MEETING_SDK_SECRET;

    expect(() => generateZoomMeetingSdkSignature({ meetingNumber: "12345678901", role: 0 })).toThrow(
      "Zoom embedded room is not configured."
    );

    process.env.ZOOM_MEETING_SDK_KEY = oldKey;
    process.env.ZOOM_MEETING_SDK_SECRET = oldSecret;
  });
});

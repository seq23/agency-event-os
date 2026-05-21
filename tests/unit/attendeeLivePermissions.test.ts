import { describe, expect, it } from "vitest";
import { defaultLiveControlState } from "@/services/venue/attendeeLivePermissionService";

describe("attendee live permission defaults", () => {
  it("keeps main stage attendee publishing off/request-based by default", () => {
    const state = defaultLiveControlState("event-summit", "main_stage", "main-stage");
    expect(state.globalCameraEnabled).toBe(false);
    expect(state.globalMicrophoneEnabled).toBe(false);
    expect(state.requestRequired).toBe(true);
  });

  it("allows breakout camera and microphone by room policy while screen share stays off", () => {
    const state = defaultLiveControlState("event-summit", "breakout", "general-breakout");
    expect(state.globalCameraEnabled).toBe(true);
    expect(state.globalMicrophoneEnabled).toBe(true);
    expect(state.globalScreenShareEnabled).toBe(false);
  });
});

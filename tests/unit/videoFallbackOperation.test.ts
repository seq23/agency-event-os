import { describe, expect, it } from "vitest";
import { clearV5RuntimeStateForTests } from "@/services/runtime/v5RuntimeStateStore";
import { clearRoomFallbackOverride, getRoomFallbackState, switchRoomFallback } from "@/services/video/roomFallbackService";

describe("video fallback operation", () => {
  it("requires crew confirmation for Zoom", async () => {
    clearV5RuntimeStateForTests();
    const state = await getRoomFallbackState("event-summit", "main_stage");
    await expect(switchRoomFallback({ state, provider: "zoom", confirmedByCrew: false })).rejects.toThrow(/confirmation/);
  });

  it("switches and rolls back when confirmed", async () => {
    clearV5RuntimeStateForTests();
    const state = await getRoomFallbackState("event-summit", "main_stage");
    const switched = await switchRoomFallback({ state, provider: "zoom", confirmedByCrew: true });
    expect(switched.activeProvider).toBe("zoom");
    const rolledBack = await clearRoomFallbackOverride(switched);
    expect(rolledBack.activeProvider).toBe("livekit");
  });
});

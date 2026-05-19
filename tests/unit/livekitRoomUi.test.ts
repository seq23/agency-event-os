import { describe, expect, it } from "vitest";
import { buildLiveKitRoomLabel, buildLiveKitRoomUiState, mapRoomSurfaceToVideoRoomType } from "@/services/video/livekitRoomUiService";

describe("LiveKit room UI service", () => {
  it("maps room surfaces to provider-neutral room types", () => {
    expect(mapRoomSurfaceToVideoRoomType("main_stage")).toBe("main_stage");
    expect(mapRoomSurfaceToVideoRoomType("green_room")).toBe("green_room");
    expect(mapRoomSurfaceToVideoRoomType("speed_networking")).toBe("speed_networking");
  });

  it("builds room labels and permission-aware UI state", () => {
    expect(buildLiveKitRoomLabel({ eventId: "event-1", roomType: "green_room" })).toBe("event-1 green room");

    const state = buildLiveKitRoomUiState({
      eventId: "event-1",
      roomId: "room-1",
      roomType: "main_stage",
      role: "host",
    });

    expect(state.canPublishAudio).toBe(true);
    expect(state.canShareScreen).toBe(true);
    expect(state.connectionState).toBe("not_connected");
  });
});

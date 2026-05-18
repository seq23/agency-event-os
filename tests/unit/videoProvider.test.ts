import { describe, expect, it } from "vitest";
import {
  buildDefaultTokenPermissions,
  closeVideoRoom,
  createVideoRoom,
  createVideoRoomToken,
  getVideoProvider,
  getVideoRoomProviderReadiness,
  isProductionCriticalRoom,
  listVideoProviders,
  startRoomRecording,
  stopRoomRecording,
} from "@/services/video";

describe("video provider abstraction", () => {
  it("registers the mock provider", () => {
    expect(listVideoProviders()).toContain("mock");
    expect(getVideoProvider("mock").key).toBe("mock");
  });

  it("creates and closes provider-neutral rooms", async () => {
    const room = await createVideoRoom({
      agencyId: "agency-1",
      eventId: "event-1",
      roomType: "green_room",
      label: "Speaker Green Room",
      recordingEnabled: true,
    });

    expect(room.provider).toBe("mock");
    expect(room.status).toBe("provisioned");
    expect(isProductionCriticalRoom(room.roomType)).toBe(true);

    await expect(closeVideoRoom(room)).resolves.toMatchObject({
      status: "closed",
    });
  });

  it("creates participant tokens with role permissions", async () => {
    const permissions = buildDefaultTokenPermissions("speaker");

    expect(permissions.canPublishAudio).toBe(true);
    expect(permissions.canPublishVideo).toBe(true);

    const token = await createVideoRoomToken("mock", {
      roomId: "room-1",
      eventId: "event-1",
      displayName: "Jane Speaker",
      role: "speaker",
      expiresInSeconds: 3600,
      ...permissions,
    });

    expect(token.provider).toBe("mock");
    expect(token.token).toContain("mock-token");
  });

  it("supports health checks and recording hooks", async () => {
    const room = await createVideoRoom({
      agencyId: "agency-1",
      eventId: "event-1",
      roomType: "main_stage",
      label: "Main Stage",
      recordingEnabled: true,
    });

    await expect(getVideoRoomProviderReadiness(room)).resolves.toMatchObject({
      ok: true,
      provider: "mock",
    });

    const start = await startRoomRecording(room);
    expect(start.ok).toBe(true);
    expect(start.recordingId).toContain("mock-recording");

    await expect(stopRoomRecording(room, start.recordingId ?? "recording-1")).resolves.toMatchObject({
      ok: true,
    });
  });
});

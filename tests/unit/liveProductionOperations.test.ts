import { describe, expect, it } from "vitest";
import { applyRoomStatusChange, buildBackupRoomActivation, buildLiveProductionStateEvent } from "@/services/production/liveProductionStateService";

describe("live production operations", () => {
  it("builds production state and room transitions", () => {
    const event = buildLiveProductionStateEvent({
      agencyId: "agency-1",
      eventId: "event-1",
      stateType: "stage",
      stateValue: "live",
    });

    expect(event.stateType).toBe("stage");

    const room = applyRoomStatusChange({
      agencyId: "agency-1",
      eventId: "event-1",
      roomType: "main_stage",
      roomId: "room-1",
      status: "closed",
      activeParticipantCount: 0,
      lastChangedAt: "2026-01-01T00:00:00.000Z",
    }, "live", 42);

    expect(room.status).toBe("live");
    expect(room.activeParticipantCount).toBe(42);

    expect(buildBackupRoomActivation({
      agencyId: "agency-1",
      eventId: "event-1",
      provider: "zoom",
      backupUrl: "https://zoom.example.com",
      reason: "Emergency backup",
    }).provider).toBe("zoom");
  });
});

import { describe, expect, it } from "vitest";
import {
  activateWhiteLabelBackupRoomAction,
  createIncidentLogAction,
  markRunOfShowSegmentLiveAction,
} from "@/lib/actions/productionWorkflowActions";

describe("production workflow actions", () => {
  it("creates action responses for ROS and incidents", async () => {
    await expect(
      markRunOfShowSegmentLiveAction({
        eventId: "event-1",
        segmentId: "segment-1",
        producerProfileId: "profile-1",
      }),
    ).resolves.toMatchObject({ ok: true, auditEvent: "run_of_show.segment_marked_live" });

    await expect(
      createIncidentLogAction({
        eventId: "event-1",
        title: "Mic failed",
        severity: "high",
      }),
    ).resolves.toMatchObject({ ok: true, auditEvent: "incident.created" });
  });

  it("requires producer approval for backup room activation", async () => {
    await expect(
      activateWhiteLabelBackupRoomAction({
        eventId: "event-1",
        backupRoomId: "backup-1",
        producerApproved: false,
      }),
    ).resolves.toMatchObject({ ok: false });

    await expect(
      activateWhiteLabelBackupRoomAction({
        eventId: "event-1",
        backupRoomId: "backup-1",
        producerApproved: true,
      }),
    ).resolves.toMatchObject({ ok: true, auditEvent: "backup_room.activated" });
  });
});

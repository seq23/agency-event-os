import { describe, expect, it } from "vitest";
import {
  canActivateWhiteLabelBackupRoom,
  mapIncidentLogRecord,
  mapProductionTaskRecord,
  mapRunOfShowSegmentRecord,
  mapWhiteLabelBackupRoomRecord,
  summarizeProductionWorkflow,
} from "@/services/production-workflow";

describe("production workflow persistence", () => {
  it("maps production records", () => {
    const segment = mapRunOfShowSegmentRecord({
      id: "segment-1",
      agency_id: "agency-1",
      client_id: "client-1",
      event_id: "event-1",
      sort_order: 1,
      title: "Keynote",
      public_title: "Opening Keynote",
      duration_minutes: 30,
      readiness_status: "ready",
      live_status: "scheduled",
    });

    const task = mapProductionTaskRecord({
      id: "task-1",
      agency_id: "agency-1",
      event_id: "event-1",
      title: "Check deck",
      status: "todo",
      priority: "high",
      blocking_event_readiness: true,
    });

    expect(segment.publicTitle).toBe("Opening Keynote");
    expect(task.blockingEventReadiness).toBe(true);
  });

  it("summarizes workflow state", () => {
    const incident = mapIncidentLogRecord({
      id: "incident-1",
      agency_id: "agency-1",
      event_id: "event-1",
      severity: "high",
      status: "open",
      title: "Mic failed",
    });

    const room = mapWhiteLabelBackupRoomRecord({
      id: "backup-1",
      agency_id: "agency-1",
      event_id: "event-1",
      provider: "zoom",
      label: "Client Backup Room",
      join_url: "https://example.com/backup",
      activation_requires_producer_approval: true,
      status: "configured",
    });

    const summary = summarizeProductionWorkflow({
      tasks: [],
      incidents: [incident],
      backupRooms: [room],
    });

    expect(summary.openIncidents).toBe(1);
    expect(summary.configuredBackupRooms).toBe(1);
    expect(canActivateWhiteLabelBackupRoom(room, false)).toBe(false);
    expect(canActivateWhiteLabelBackupRoom(room, true)).toBe(true);
  });
});

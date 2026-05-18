"use server";

export async function markRunOfShowSegmentLiveAction(input: {
  eventId: string;
  segmentId: string;
  producerProfileId: string;
}) {
  return {
    ok: true,
    action: "mark_segment_live",
    auditEvent: "run_of_show.segment_marked_live",
    ...input,
  };
}

export async function createIncidentLogAction(input: {
  eventId: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
}) {
  return {
    ok: true,
    action: "create_incident",
    auditEvent: "incident.created",
    ...input,
  };
}

export async function activateWhiteLabelBackupRoomAction(input: {
  eventId: string;
  backupRoomId: string;
  producerApproved: boolean;
}) {
  if (!input.producerApproved) {
    return {
      ok: false,
      reason: "Producer approval required before backup room activation.",
    };
  }

  return {
    ok: true,
    action: "activate_white_label_backup_room",
    auditEvent: "backup_room.activated",
    ...input,
  };
}

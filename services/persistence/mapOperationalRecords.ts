import type { EventApprovalItem } from "@/types/approvalOps";
import type { LastMinuteChangeRequest } from "@/types/changeControl";
import type { ProductionInboxItem } from "@/types/eventIntake";
import type { DbApprovalRequestRecord, DbLastMinuteChangeRequestRecord, DbProductionInboxItemRecord } from "@/types/persistence";

function ownerFromAssignedRole(role?: string | null): EventApprovalItem["currentOwner"] {
  if (role === "client_reviewer") return "client";
  if (role === "speaker") return "speaker";
  if (role === "sponsor") return "sponsor";
  return "agency";
}

function blockingScope(resourceType: string): EventApprovalItem["blockingScope"] {
  if (resourceType.includes("speaker")) return "speaker";
  if (resourceType.includes("sponsor")) return "sponsor";
  if (resourceType.includes("run_of_show")) return "run_of_show";
  if (resourceType.includes("venue")) return "venue";
  if (resourceType.includes("report")) return "reporting";
  return "event";
}

export function mapApprovalRequestRecord(record: DbApprovalRequestRecord): EventApprovalItem {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id,
    eventId: record.event_id,
    itemType: record.approval_type as EventApprovalItem["itemType"],
    title: record.title,
    submittedByName: record.requested_by_user_id ? "Submitted user" : "System",
    relatedRunOfShowSegmentId: record.resource_type === "run_of_show_segment" ? record.resource_id ?? undefined : undefined,
    status: record.status as EventApprovalItem["status"],
    dueAt: record.due_at ?? record.updated_at ?? record.created_at ?? new Date(0).toISOString(),
    currentOwner: ownerFromAssignedRole(record.assigned_role),
    clientApprovalRequired: record.client_visible,
    producerApprovalRequired: true,
    blockingScope: record.locked ? "none" : blockingScope(record.resource_type),
    lastComment: record.description ?? "No comment yet.",
    nextAction: record.locked ? "Locked for show." : record.status === "needs_client_review" ? "Client review required." : "Producer review required.",
  };
}

export function mapProductionInboxRecord(record: DbProductionInboxItemRecord): ProductionInboxItem {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? "",
    eventId: record.event_id ?? "",
    eventCode: record.event_code,
    sourceChannel: record.source_channel as ProductionInboxItem["sourceChannel"],
    status: record.status as ProductionInboxItem["status"],
    senderName: record.sender_name,
    senderEmail: record.sender_email,
    subject: record.subject,
    summary: record.summary ?? "No summary provided.",
    possibleMatchType: record.possible_match_type as ProductionInboxItem["possibleMatchType"],
    possibleMatchId: record.possible_match_id ?? undefined,
    receivedAt: record.received_at,
    nextAction: record.next_action ?? "Review and match this item.",
  };
}

export function mapLastMinuteChangeRecord(record: DbLastMinuteChangeRequestRecord): LastMinuteChangeRequest {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id,
    eventId: record.event_id,
    speakerId: record.speaker_id ?? undefined,
    sponsorId: record.sponsor_id ?? undefined,
    runOfShowSegmentId: record.run_of_show_segment_id ?? undefined,
    changeType: record.change_type as LastMinuteChangeRequest["changeType"],
    urgency: record.urgency as LastMinuteChangeRequest["urgency"],
    risk: record.risk as LastMinuteChangeRequest["risk"],
    status: record.status as LastMinuteChangeRequest["status"],
    title: record.title,
    oldVersionLabel: record.old_version_label ?? "Previous approved version",
    newVersionLabel: record.new_version_label ?? "Submitted version",
    diffSummary: record.diff_summary ?? "No diff summary supplied.",
    affectsTiming: record.affects_timing,
    affectsSponsorMention: record.affects_sponsor_mention,
    affectsClientApprovedCopy: record.affects_client_approved_copy,
    submittedAt: record.submitted_at,
    minutesUntilSegment: record.minutes_until_segment,
    recommendedAction: record.recommended_action ?? "Producer review required.",
  };
}

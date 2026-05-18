export type AuditAction =
  | "event_created"
  | "event_status_changed"
  | "role_assigned"
  | "role_revoked"
  | "client_approval_requested"
  | "client_approved_item"
  | "client_requested_changes"
  | "run_of_show_segment_created"
  | "run_of_show_segment_edited"
  | "run_of_show_segment_deleted"
  | "speaker_readiness_changed"
  | "sponsor_booth_changed"
  | "contractor_assigned"
  | "vendor_assigned"
  | "asset_uploaded"
  | "asset_approved"
  | "production_note_added"
  | "incident_logged"
  | "report_exported"
  | "video_room_created"
  | "networking_report_submitted";

export interface CreateAuditLogInput {
  agencyId: string;
  clientId?: string;
  eventId?: string;
  actorUserId: string;
  actorRole: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  previousValue?: unknown;
  newValue?: unknown;
  visibility?: "internal_agency" | "client_visible_summary" | "system_only";
}

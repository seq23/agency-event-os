export type AuditVisibility = "internal_agency" | "client_visible_summary" | "system_only";

export interface AuditEntry {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId?: string;
  actorUserId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousValue?: unknown;
  newValue?: unknown;
  visibility: AuditVisibility;
  createdAt: string;
}

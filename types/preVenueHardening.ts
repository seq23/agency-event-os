export type CrudSurfaceStatus = "ready" | "empty" | "needs_attention";
export type DiagnosticPersistenceStatus = "saved" | "linked_to_incident" | "needs_review";
export type ReportCenterStatus = "draft" | "ready" | "published" | "needs_update";

export interface DashboardCrudCard {
  surface: "clients" | "events" | "assets" | "reports" | "production";
  label: string;
  status: CrudSurfaceStatus;
  href: string;
  summary: string;
}

export interface DiagnosticIncidentLinkDraft {
  agencyId: string;
  eventId: string;
  diagnosticRunId?: string;
  diagnosticResultId?: string;
  incidentId: string;
  linkReason: string;
}

export interface AssetReviewActionDraft {
  agencyId: string;
  eventId?: string;
  assetRecordId: string;
  actorProfileId?: string;
  action: "approved" | "changes_requested" | "locked" | "made_live" | "archived";
  notes?: string;
}

export interface ActivityFeedItem {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId?: string;
  sourceType: string;
  sourceId?: string;
  title: string;
  body?: string;
  visibility: "internal_agency" | "client_visible_summary" | "system_only";
  createdAt: string;
}

export interface ReportCenterItem {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  reportId?: string;
  label: string;
  reportType: string;
  status: ReportCenterStatus;
  lastGeneratedAt?: string;
}

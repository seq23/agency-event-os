import type { AuditLog } from "@/types/core";
import type { V4AnalyticsEvent, V4RoomFallbackState, V4VideoProvider } from "@/types/v4";

export interface V5AccessAttemptRuntimeEvent {
  id: string;
  status: "access_attempted" | "access_granted" | "access_denied" | "access_expired" | "access_revoked";
  accessKind: "attendee" | "crew" | "special_guest";
  eventId?: string;
  role?: string;
  route?: string;
  reason?: string;
  ipHash?: string;
  userAgentHash?: string;
  createdAt: string;
}

export interface V5FallbackRuntimeEvent {
  id: string;
  eventId: string;
  roomId: string;
  roomType: string;
  provider: V4VideoProvider;
  action: "auto_switch" | "manual_switch" | "rollback" | "health_check";
  actorRole?: string;
  reason?: string;
  createdAt: string;
}

export interface V6IncidentRuntimeEvent {
  id: string;
  eventId: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "monitoring" | "resolved";
  ownerRole: string;
  details: string;
  createdAt: string;
}

export interface V6SupportRequestRuntimeEvent {
  id: string;
  eventId: string;
  attendeeId?: string;
  subject: string;
  status: "open" | "triaged" | "resolved";
  createdAt: string;
}

export interface V6EmailRuntimeEvent {
  id: string;
  eventId: string;
  templateKey: string;
  recipientSegment: string;
  status: "queued" | "sent" | "blocked" | "failed";
  providerMessageId?: string;
  reason?: string;
  createdAt: string;
}

export interface V6RegistrationRuntimeEvent {
  id: string;
  eventId: string;
  attendeeEmailHash: string;
  status: "submitted" | "confirmed" | "cancelled";
  displayName?: string;
  company?: string;
  title?: string;
  personalWebsite?: string;
  socialLinks?: string[];
  reasonForAttending?: string;
  interestingFact?: string;
  createdAt: string;
}

export interface V6RunOfShowRuntimeEvent {
  id: string;
  eventId: string;
  segmentId: string;
  action: "mark_ready" | "mark_live" | "mark_complete" | "skip" | "delay" | "note";
  actorRole: string;
  createdAt: string;
}

export interface V6RuntimeSnapshot {
  auditLogs: AuditLog[];
  accessAttempts: V5AccessAttemptRuntimeEvent[];
  analyticsEvents: V4AnalyticsEvent[];
  fallbackEvents: V5FallbackRuntimeEvent[];
  fallbackStates: V4RoomFallbackState[];
  incidentEvents: V6IncidentRuntimeEvent[];
  supportRequests: V6SupportRequestRuntimeEvent[];
  emailEvents: V6EmailRuntimeEvent[];
  registrations: V6RegistrationRuntimeEvent[];
  runOfShowEvents: V6RunOfShowRuntimeEvent[];
}

export interface RuntimeStore {
  appendAuditLog(log: AuditLog): Promise<AuditLog>;
  appendAccessAttempt(event: V5AccessAttemptRuntimeEvent): Promise<V5AccessAttemptRuntimeEvent>;
  appendAnalyticsEvent(event: V4AnalyticsEvent): Promise<V4AnalyticsEvent>;
  appendFallbackEvent(event: V5FallbackRuntimeEvent): Promise<V5FallbackRuntimeEvent>;
  getFallbackState(key: string): Promise<V4RoomFallbackState | undefined>;
  setFallbackState(key: string, state: V4RoomFallbackState): Promise<V4RoomFallbackState>;
  appendIncident(event: V6IncidentRuntimeEvent): Promise<V6IncidentRuntimeEvent>;
  appendSupportRequest(event: V6SupportRequestRuntimeEvent): Promise<V6SupportRequestRuntimeEvent>;
  appendEmailEvent(event: V6EmailRuntimeEvent): Promise<V6EmailRuntimeEvent>;
  appendRegistration(event: V6RegistrationRuntimeEvent): Promise<V6RegistrationRuntimeEvent>;
  appendRunOfShowEvent(event: V6RunOfShowRuntimeEvent): Promise<V6RunOfShowRuntimeEvent>;
  readSnapshot(): Promise<V6RuntimeSnapshot>;
}

export function emptyRuntimeSnapshot(): V6RuntimeSnapshot {
  return {
    auditLogs: [],
    accessAttempts: [],
    analyticsEvents: [],
    fallbackEvents: [],
    fallbackStates: [],
    incidentEvents: [],
    supportRequests: [],
    emailEvents: [],
    registrations: [],
    runOfShowEvents: [],
  };
}

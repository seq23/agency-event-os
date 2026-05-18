export type ProductionTaskStatus = "todo" | "in_progress" | "blocked" | "done" | "cancelled";
export type ProductionPriority = "low" | "medium" | "high" | "critical";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export interface PersistentRunOfShowSegment {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  sortOrder: number;
  title: string;
  publicTitle: string;
  startAt?: string;
  endAt?: string;
  durationMinutes: number;
  roomLabel?: string;
  readinessStatus: string;
  liveStatus: string;
  producerNotes?: string;
  technicalCues?: string;
  backupPlan?: string;
}

export interface ProductionTaskRecord {
  id: string;
  agencyId: string;
  eventId: string;
  title: string;
  description?: string;
  status: ProductionTaskStatus;
  priority: ProductionPriority;
  dueAt?: string;
  assignedProfileId?: string;
  blockingEventReadiness: boolean;
}

export interface IncidentLogRecord {
  id: string;
  agencyId: string;
  eventId: string;
  severity: IncidentSeverity;
  status: "open" | "monitoring" | "resolved" | "archived";
  title: string;
  description?: string;
  resolution?: string;
}

export interface WhiteLabelBackupRoomRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  provider: "zoom" | "google_meet" | "custom_embed" | "phone_bridge";
  label: string;
  joinUrl: string;
  activationRequiresProducerApproval: boolean;
  status: "configured" | "tested" | "activated" | "retired";
}

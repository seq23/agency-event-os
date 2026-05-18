import type {
  IncidentLogRecord,
  PersistentRunOfShowSegment,
  ProductionTaskRecord,
  WhiteLabelBackupRoomRecord,
} from "@/types/productionPersistence";

export function mapRunOfShowSegmentRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  sort_order: number;
  title: string;
  public_title: string;
  start_at?: string | null;
  end_at?: string | null;
  duration_minutes: number;
  room_label?: string | null;
  readiness_status: string;
  live_status: string;
  producer_notes?: string | null;
  technical_cues?: string | null;
  backup_plan?: string | null;
}): PersistentRunOfShowSegment {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    sortOrder: record.sort_order,
    title: record.title,
    publicTitle: record.public_title,
    startAt: record.start_at ?? undefined,
    endAt: record.end_at ?? undefined,
    durationMinutes: record.duration_minutes,
    roomLabel: record.room_label ?? undefined,
    readinessStatus: record.readiness_status,
    liveStatus: record.live_status,
    producerNotes: record.producer_notes ?? undefined,
    technicalCues: record.technical_cues ?? undefined,
    backupPlan: record.backup_plan ?? undefined,
  };
}

export function mapProductionTaskRecord(record: {
  id: string;
  agency_id: string;
  event_id: string;
  title: string;
  description?: string | null;
  status: ProductionTaskRecord["status"];
  priority: ProductionTaskRecord["priority"];
  due_at?: string | null;
  assigned_profile_id?: string | null;
  blocking_event_readiness: boolean;
}): ProductionTaskRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    eventId: record.event_id,
    title: record.title,
    description: record.description ?? undefined,
    status: record.status,
    priority: record.priority,
    dueAt: record.due_at ?? undefined,
    assignedProfileId: record.assigned_profile_id ?? undefined,
    blockingEventReadiness: record.blocking_event_readiness,
  };
}

export function mapIncidentLogRecord(record: {
  id: string;
  agency_id: string;
  event_id: string;
  severity: IncidentLogRecord["severity"];
  status: IncidentLogRecord["status"];
  title: string;
  description?: string | null;
  resolution?: string | null;
}): IncidentLogRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    eventId: record.event_id,
    severity: record.severity,
    status: record.status,
    title: record.title,
    description: record.description ?? undefined,
    resolution: record.resolution ?? undefined,
  };
}

export function mapWhiteLabelBackupRoomRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  provider: WhiteLabelBackupRoomRecord["provider"];
  label: string;
  join_url: string;
  activation_requires_producer_approval: boolean;
  status: WhiteLabelBackupRoomRecord["status"];
}): WhiteLabelBackupRoomRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    provider: record.provider,
    label: record.label,
    joinUrl: record.join_url,
    activationRequiresProducerApproval: record.activation_requires_producer_approval,
    status: record.status,
  };
}

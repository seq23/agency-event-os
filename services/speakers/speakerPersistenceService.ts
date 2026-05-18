import type { SpeakerGreenRoomSnapshot, SpeakerScriptVersion } from "@/types/speakerOps";

export interface SpeakerRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  displayName: string;
  email: string;
  title?: string;
  organization?: string;
  readinessStatus: string;
  techCheckStatus: string;
}

export function mapSpeakerRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  display_name: string;
  email: string;
  title?: string | null;
  organization?: string | null;
  readiness_status: string;
  tech_check_status: string;
}): SpeakerRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    displayName: record.display_name,
    email: record.email,
    title: record.title ?? undefined,
    organization: record.organization ?? undefined,
    readinessStatus: record.readiness_status,
    techCheckStatus: record.tech_check_status,
  };
}

export function mapSpeakerScriptRecord(record: {
  id: string;
  speaker_id: string;
  event_id: string;
  run_of_show_segment_id?: string | null;
  version_number: number;
  title: string;
  script_text: string;
  talking_points: string[] | unknown;
  status: SpeakerScriptVersion["status"];
  submitted_at: string;
  approved_by_profile_id?: string | null;
  approved_at?: string | null;
  is_live_version: boolean;
  rollback_available: boolean;
}): SpeakerScriptVersion {
  return {
    id: record.id,
    speakerId: record.speaker_id,
    eventId: record.event_id,
    runOfShowSegmentId: record.run_of_show_segment_id ?? undefined,
    versionNumber: record.version_number,
    title: record.title,
    scriptText: record.script_text,
    talkingPoints: Array.isArray(record.talking_points) ? record.talking_points.map(String) : [],
    status: record.status,
    submittedAt: record.submitted_at,
    submittedByUserId: record.approved_by_profile_id ?? "unknown",
    approvedByUserId: record.approved_by_profile_id ?? undefined,
    approvedAt: record.approved_at ?? undefined,
    isLiveVersion: record.is_live_version,
    rollbackAvailable: record.rollback_available,
  };
}

export function buildSpeakerGreenRoomReadModel(input: {
  speaker: SpeakerRecord;
  approvedScript?: SpeakerScriptVersion;
  pendingScript?: SpeakerScriptVersion;
}): Pick<SpeakerGreenRoomSnapshot, "speakerName" | "status" | "approvedScriptVersion" | "pendingScriptVersion"> {
  return {
    speakerName: input.speaker.displayName,
    status: input.speaker.readinessStatus as SpeakerGreenRoomSnapshot["status"],
    approvedScriptVersion: input.approvedScript,
    pendingScriptVersion: input.pendingScript,
  };
}

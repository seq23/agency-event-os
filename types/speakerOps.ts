import type { ID } from "@/types/core";

export type SpeakerGreenRoomStatus =
  | "not_invited"
  | "invited"
  | "profile_incomplete"
  | "assets_missing"
  | "script_missing"
  | "tech_check_needed"
  | "tech_check_failed"
  | "ready_for_rehearsal"
  | "ready_for_live"
  | "live_now"
  | "completed";

export type SpeakerScriptStatus = "draft" | "submitted" | "needs_review" | "changes_requested" | "approved" | "locked" | "used_live" | "archived";

export interface SpeakerScriptVersion {
  id: ID;
  speakerId: ID;
  eventId: ID;
  runOfShowSegmentId?: ID;
  versionNumber: number;
  title: string;
  scriptText: string;
  talkingPoints: string[];
  status: SpeakerScriptStatus;
  submittedAt: string;
  submittedByUserId: ID;
  approvedByUserId?: ID;
  approvedAt?: string;
  isLiveVersion: boolean;
  rollbackAvailable: boolean;
}

export interface SpeakerOpsReadiness {
  speakerId: ID;
  eventId: ID;
  status: SpeakerGreenRoomStatus;
  callTimeAt: string;
  segmentStartsAt: string;
  backstageJoinUrl: string;
  rehearsalJoinUrl: string;
  checklist: Array<{
    id: string;
    label: string;
    status: "missing" | "submitted" | "needs_review" | "approved" | "failed" | "complete";
    blocking: boolean;
  }>;
  producerMessage?: string;
}

export interface SpeakerGreenRoomSnapshot {
  speakerId: ID;
  eventId: ID;
  speakerName: string;
  sessionTitle: string;
  status: SpeakerGreenRoomStatus;
  minutesUntilLive: number;
  approvedScriptVersion?: SpeakerScriptVersion;
  pendingScriptVersion?: SpeakerScriptVersion;
  readiness: SpeakerOpsReadiness;
}

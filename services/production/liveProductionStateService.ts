import type { LiveProductionStateEvent, LiveProductionStateType, LiveProductionStateValue, LiveRoomStatus } from "@/types/liveProductionOperations";

export function buildLiveProductionStateEvent(input: {
  agencyId: string;
  eventId: string;
  actorProfileId?: string;
  stateType: LiveProductionStateType;
  stateValue: LiveProductionStateValue;
  targetType?: string;
  targetId?: string;
  notes?: string;
}): LiveProductionStateEvent {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}

export function applyRoomStatusChange(room: LiveRoomStatus, status: LiveRoomStatus["status"], activeParticipantCount = room.activeParticipantCount): LiveRoomStatus {
  return {
    ...room,
    status,
    activeParticipantCount,
    lastChangedAt: new Date().toISOString(),
  };
}

export function buildBackupRoomActivation(input: {
  agencyId: string;
  eventId: string;
  provider: "zoom" | "google_meet";
  backupUrl: string;
  reason: string;
  activatedByProfileId?: string;
}) {
  return {
    ...input,
    activatedAt: new Date().toISOString(),
  };
}

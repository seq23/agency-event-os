export type LiveProductionStateType =
  | "stage"
  | "session"
  | "breakout"
  | "networking"
  | "incident"
  | "replay"
  | "report"
  | "backup_room";

export type LiveProductionStateValue =
  | "open"
  | "closed"
  | "live"
  | "paused"
  | "ended"
  | "triaged"
  | "published"
  | "activated"
  | "deactivated";

export interface LiveProductionStateEvent {
  agencyId: string;
  eventId: string;
  actorProfileId?: string;
  stateType: LiveProductionStateType;
  stateValue: LiveProductionStateValue;
  targetType?: string;
  targetId?: string;
  notes?: string;
  createdAt: string;
}

export interface LiveRoomStatus {
  agencyId: string;
  eventId: string;
  roomType: string;
  roomId: string;
  status: "open" | "closed" | "live" | "paused";
  activeParticipantCount: number;
  lastChangedAt: string;
}

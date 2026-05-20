export type SpeedNetworkingQueueStatus = "draft" | "open" | "paused" | "closed";
export type SpeedNetworkingEntryStatus = "waiting" | "matched" | "skipped" | "left" | "blocked";
export type SpeedNetworkingMatchStatus = "created" | "active" | "ended" | "expired" | "reported";

export interface SpeedNetworkingEntry {
  id: string;
  agencyId: string;
  eventId: string;
  queueId: string;
  attendeeId?: string;
  displayName: string;
  status: SpeedNetworkingEntryStatus;
  joinedQueueAt: string;
  lastMatchedAt?: string;
}

export interface SpeedNetworkingPairHistory {
  eventId: string;
  normalizedPairKey: string;
  attendeeAId: string;
  attendeeBId: string;
  firstMatchedAt: string;
  matchId: string;
}

export interface SpeedNetworkingMatch {
  id: string;
  agencyId: string;
  eventId: string;
  queueId: string;
  participantAEntryId: string;
  participantBEntryId: string;
  normalizedPairKey: string;
  videoRoomId?: string;
  status: SpeedNetworkingMatchStatus;
  startsAt: string;
  expiresAt: string;
  endsAt?: string;
  endedReason?: string;
}

export interface SpeedNetworkingProducerSummary {
  eventId: string;
  queueId: string;
  waitingCount: number;
  activeMatchCount: number;
  reportCount: number;
  averageMatchDurationSeconds: number;
}

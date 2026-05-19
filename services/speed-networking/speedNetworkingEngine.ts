import type { SpeedNetworkingEntry, SpeedNetworkingMatch, SpeedNetworkingProducerSummary } from "@/types/speedNetworkingEngine";
import { createVideoRoom } from "@/services/video";

export function canMatchEntries(input: {
  first: SpeedNetworkingEntry;
  second: SpeedNetworkingEntry;
  recentPairs?: Array<[string, string]>;
}) {
  if (input.first.id === input.second.id) return false;
  if (input.first.status !== "waiting" || input.second.status !== "waiting") return false;

  const pairKey = [input.first.id, input.second.id].sort().join(":");
  return !(input.recentPairs ?? []).some((pair) => pair.sort().join(":") === pairKey);
}

export function selectNextSpeedNetworkingPair(entries: SpeedNetworkingEntry[], recentPairs: Array<[string, string]> = []) {
  const waiting = entries.filter((entry) => entry.status === "waiting");
  for (let i = 0; i < waiting.length; i += 1) {
    for (let j = i + 1; j < waiting.length; j += 1) {
      if (canMatchEntries({ first: waiting[i], second: waiting[j], recentPairs })) {
        return [waiting[i], waiting[j]] as const;
      }
    }
  }
  return null;
}

export async function createSpeedNetworkingMatch(input: {
  agencyId: string;
  eventId: string;
  queueId: string;
  participantA: SpeedNetworkingEntry;
  participantB: SpeedNetworkingEntry;
  matchDurationSeconds?: number;
}): Promise<SpeedNetworkingMatch> {
  const room = await createVideoRoom({
    agencyId: input.agencyId,
    eventId: input.eventId,
    provider: "livekit",
    roomType: "speed_networking",
    label: `Speed match ${input.participantA.displayName} + ${input.participantB.displayName}`,
    recordingEnabled: false,
  });

  const now = new Date();
  const expires = new Date(now.getTime() + (input.matchDurationSeconds ?? 180) * 1000);

  return {
    id: `match-${input.participantA.id}-${input.participantB.id}`,
    agencyId: input.agencyId,
    eventId: input.eventId,
    queueId: input.queueId,
    participantAEntryId: input.participantA.id,
    participantBEntryId: input.participantB.id,
    videoRoomId: room.id,
    status: "created",
    startsAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
}

export function endSpeedNetworkingMatch(match: SpeedNetworkingMatch, reason: string): SpeedNetworkingMatch {
  return {
    ...match,
    status: reason === "expired" ? "expired" : "ended",
    endsAt: new Date().toISOString(),
    endedReason: reason,
  };
}

export function buildSpeedNetworkingProducerSummary(input: {
  eventId: string;
  queueId: string;
  entries: SpeedNetworkingEntry[];
  matches: SpeedNetworkingMatch[];
  reportCount?: number;
}): SpeedNetworkingProducerSummary {
  const activeMatches = input.matches.filter((match) => match.status === "created" || match.status === "active");

  return {
    eventId: input.eventId,
    queueId: input.queueId,
    waitingCount: input.entries.filter((entry) => entry.status === "waiting").length,
    activeMatchCount: activeMatches.length,
    reportCount: input.reportCount ?? 0,
    averageMatchDurationSeconds: 180,
  };
}

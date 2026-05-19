import type { LiveKitEgressJob, ReplayPublicationEvent } from "@/types/livekitEgress";

export function buildLiveKitEgressRequest(input: {
  agencyId: string;
  eventId: string;
  roomId?: string;
  sessionId?: string;
  storageBucket: string;
  storagePath: string;
}): LiveKitEgressJob {
  return {
    id: `egress-${input.eventId}-${Date.now()}`,
    agencyId: input.agencyId,
    eventId: input.eventId,
    roomId: input.roomId,
    sessionId: input.sessionId,
    provider: "livekit",
    status: "requested",
    storageBucket: input.storageBucket,
    storagePath: input.storagePath,
  };
}

export function markEgressStarted(job: LiveKitEgressJob, providerEgressId: string): LiveKitEgressJob {
  return {
    ...job,
    providerEgressId,
    status: "active",
    startedAt: new Date().toISOString(),
  };
}

export function markEgressCompleted(job: LiveKitEgressJob): LiveKitEgressJob {
  return {
    ...job,
    status: "completed",
    stoppedAt: new Date().toISOString(),
  };
}

export function markEgressFailed(job: LiveKitEgressJob, failureReason: string): LiveKitEgressJob {
  return {
    ...job,
    status: "failed",
    failureReason,
    stoppedAt: new Date().toISOString(),
  };
}

export function buildReplayPublicationEvent(input: Omit<ReplayPublicationEvent, "createdAt">): ReplayPublicationEvent {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}

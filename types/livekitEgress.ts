export type LiveKitEgressStatus = "requested" | "starting" | "active" | "stopping" | "completed" | "failed";

export interface LiveKitEgressJob {
  id: string;
  agencyId: string;
  eventId: string;
  roomId?: string;
  sessionId?: string;
  provider: "livekit";
  providerEgressId?: string;
  status: LiveKitEgressStatus;
  storageBucket?: string;
  storagePath?: string;
  startedAt?: string;
  stoppedAt?: string;
  failureReason?: string;
}

export interface ReplayPublicationEvent {
  agencyId: string;
  eventId: string;
  replayAssetId: string;
  actorProfileId?: string;
  status: "processing" | "available" | "restricted" | "failed";
  notes?: string;
  createdAt: string;
}

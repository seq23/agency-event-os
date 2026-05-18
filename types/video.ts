export type VideoProviderKey = "mock" | "livekit" | "daily" | "agora" | "twilio" | "zoom_sdk" | "custom";

export type VideoRoomType =
  | "main_stage"
  | "green_room"
  | "backstage"
  | "breakout"
  | "sponsor_booth"
  | "rehearsal"
  | "testing"
  | "speed_networking"
  | "white_label_backup";

export type VideoRoomStatus =
  | "draft"
  | "scheduled"
  | "provisioned"
  | "open"
  | "closed"
  | "failed"
  | "archived";

export type VideoParticipantRole =
  | "producer"
  | "host"
  | "speaker"
  | "sponsor"
  | "attendee"
  | "contractor"
  | "client"
  | "observer";

export interface VideoRoom {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  provider: VideoProviderKey;
  providerRoomId?: string;
  roomType: VideoRoomType;
  label: string;
  status: VideoRoomStatus;
  joinUrl?: string;
  backstageUrl?: string;
  startsAt?: string;
  endsAt?: string;
  recordingEnabled: boolean;
  metadata: Record<string, unknown>;
}

export interface VideoRoomTokenRequest {
  roomId: string;
  eventId: string;
  profileId?: string;
  displayName: string;
  role: VideoParticipantRole;
  canPublishAudio: boolean;
  canPublishVideo: boolean;
  canShareScreen: boolean;
  expiresInSeconds: number;
}

export interface VideoRoomToken {
  token: string;
  provider: VideoProviderKey;
  roomId: string;
  participantIdentity: string;
  expiresAt: string;
}

export interface VideoProviderHealth {
  provider: VideoProviderKey;
  ok: boolean;
  latencyMs?: number;
  details: string[];
}

export interface CreateVideoRoomInput {
  agencyId: string;
  clientId?: string;
  eventId: string;
  provider?: VideoProviderKey;
  roomType: VideoRoomType;
  label: string;
  startsAt?: string;
  endsAt?: string;
  recordingEnabled?: boolean;
  metadata?: Record<string, unknown>;
}

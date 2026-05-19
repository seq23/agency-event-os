import type { VideoParticipantRole, VideoRoom, VideoRoomToken } from "@/types/video";

export type LiveKitRoomSurface =
  | "main_stage"
  | "green_room"
  | "backstage"
  | "testing"
  | "breakout"
  | "sponsor_booth"
  | "speed_networking";

export type LiveKitConnectionState =
  | "not_connected"
  | "requesting_token"
  | "token_ready"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "failed";

export interface LiveKitJoinRequest {
  agencyId?: string;
  eventId: string;
  roomId: string;
  roomType: LiveKitRoomSurface;
  displayName: string;
  role: VideoParticipantRole;
  profileId?: string;
}

export interface LiveKitJoinResult {
  room: VideoRoom;
  token: VideoRoomToken;
  livekitUrl?: string;
  connectionState: LiveKitConnectionState;
}

export interface LiveKitRoomUiState {
  roomId: string;
  eventId: string;
  roomType: LiveKitRoomSurface;
  connectionState: LiveKitConnectionState;
  reconnectAttempts: number;
  activeParticipantCount: number;
  canPublishAudio: boolean;
  canPublishVideo: boolean;
  canShareScreen: boolean;
  producerNotes?: string;
}

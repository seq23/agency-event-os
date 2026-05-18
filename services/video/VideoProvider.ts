import type {
  CreateVideoRoomInput,
  VideoProviderHealth,
  VideoRoom,
  VideoRoomToken,
  VideoRoomTokenRequest,
} from "@/types/video";

export interface VideoProvider {
  readonly key: string;

  createRoom(input: CreateVideoRoomInput): Promise<VideoRoom>;

  closeRoom(room: VideoRoom): Promise<VideoRoom>;

  createParticipantToken(request: VideoRoomTokenRequest): Promise<VideoRoomToken>;

  getRoomHealth(room: VideoRoom): Promise<VideoProviderHealth>;

  startRecording?(room: VideoRoom): Promise<{ ok: boolean; recordingId?: string; reason?: string }>;

  stopRecording?(room: VideoRoom, recordingId: string): Promise<{ ok: boolean; reason?: string }>;
}

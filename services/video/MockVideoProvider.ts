import type { VideoProvider } from "./VideoProvider";
import type {
  CreateVideoRoomInput,
  VideoProviderHealth,
  VideoRoom,
  VideoRoomToken,
  VideoRoomTokenRequest,
} from "@/types/video";

function stableId(...parts: string[]) {
  return parts.join("-").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
}

export class MockVideoProvider implements VideoProvider {
  readonly key = "mock";

  async createRoom(input: CreateVideoRoomInput): Promise<VideoRoom> {
    const roomId = stableId("mock-room", input.eventId, input.roomType, input.label);

    return {
      id: roomId,
      agencyId: input.agencyId,
      clientId: input.clientId,
      eventId: input.eventId,
      provider: "mock",
      providerRoomId: roomId,
      roomType: input.roomType,
      label: input.label,
      status: "provisioned",
      joinUrl: `/mock-video/${roomId}`,
      backstageUrl: `/mock-video/${roomId}/backstage`,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      recordingEnabled: input.recordingEnabled ?? false,
      metadata: input.metadata ?? {},
    };
  }

  async closeRoom(room: VideoRoom): Promise<VideoRoom> {
    return {
      ...room,
      status: "closed",
    };
  }

  async createParticipantToken(request: VideoRoomTokenRequest): Promise<VideoRoomToken> {
    const expiresAt = new Date(Date.now() + request.expiresInSeconds * 1000).toISOString();

    return {
      token: `mock-token:${request.roomId}:${request.displayName}:${request.role}`,
      provider: "mock",
      roomId: request.roomId,
      participantIdentity: request.profileId ?? stableId(request.displayName, request.role),
      expiresAt,
    };
  }

  async getRoomHealth(room: VideoRoom): Promise<VideoProviderHealth> {
    return {
      provider: room.provider,
      ok: room.status !== "failed",
      latencyMs: 24,
      details: [`Mock provider room ${room.id} is reachable.`],
    };
  }

  async startRecording(room: VideoRoom) {
    if (!room.recordingEnabled) {
      return { ok: false, reason: "Recording is disabled for this room." };
    }

    return { ok: true, recordingId: `mock-recording-${room.id}` };
  }

  async stopRecording(_room: VideoRoom, _recordingId: string) {
    return { ok: true };
  }
}

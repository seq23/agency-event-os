import type { VideoProvider } from "./VideoProvider";
import type {
  CreateVideoRoomInput,
  VideoProviderHealth,
  VideoRoom,
  VideoRoomToken,
  VideoRoomTokenRequest,
} from "@/types/video";
import { createLiveKitAccessToken } from "./livekitToken";

export interface LiveKitVideoProviderConfig {
  livekitUrl: string;
  apiKey: string;
  apiSecret: string;
}

function stableRoomName(input: Pick<CreateVideoRoomInput, "eventId" | "roomType" | "label">) {
  return `${input.eventId}-${input.roomType}-${input.label}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export class LiveKitVideoProvider implements VideoProvider {
  readonly key = "livekit";

  constructor(private readonly config: LiveKitVideoProviderConfig) {
    if (!config.livekitUrl.startsWith("wss://")) {
      throw new Error("LIVEKIT_URL must start with wss://");
    }
  }

  async createRoom(input: CreateVideoRoomInput): Promise<VideoRoom> {
    const providerRoomId = stableRoomName(input);

    return {
      id: providerRoomId,
      agencyId: input.agencyId,
      clientId: input.clientId,
      eventId: input.eventId,
      provider: "livekit",
      providerRoomId,
      roomType: input.roomType,
      label: input.label,
      status: "provisioned",
      joinUrl: `${this.config.livekitUrl.replace("wss://", "https://")}/rooms/${providerRoomId}`,
      backstageUrl: `${this.config.livekitUrl.replace("wss://", "https://")}/rooms/${providerRoomId}/backstage`,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      recordingEnabled: input.recordingEnabled ?? false,
      metadata: {
        ...(input.metadata ?? {}),
        livekitUrl: this.config.livekitUrl,
      },
    };
  }

  async closeRoom(room: VideoRoom): Promise<VideoRoom> {
    return {
      ...room,
      status: "closed",
    };
  }

  async createParticipantToken(request: VideoRoomTokenRequest): Promise<VideoRoomToken> {
    const roomName = request.roomId;
    const token = createLiveKitAccessToken({
      env: {
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret,
      },
      request,
      roomName,
    });

    return {
      token: token.token,
      provider: "livekit",
      roomId: request.roomId,
      participantIdentity: token.participantIdentity,
      expiresAt: token.expiresAt,
    };
  }

  async getRoomHealth(room: VideoRoom): Promise<VideoProviderHealth> {
    return {
      provider: "livekit",
      ok: Boolean(this.config.livekitUrl && this.config.apiKey && this.config.apiSecret && room.provider === "livekit"),
      details: [
        "LiveKit provider configuration is present.",
        "Room health confirms server-side LiveKit runtime configuration and room identity are available.",
      ],
    };
  }

  async startRecording(room: VideoRoom) {
    if (!room.recordingEnabled) {
      return {
        ok: false,
        reason: "Recording is disabled for this room.",
      };
    }

    return {
      ok: false,
      reason: "LiveKit recording requires egress credentials and storage policy before activation.",
    };
  }

  async stopRecording() {
    return {
      ok: false,
      reason: "LiveKit recording stop requires an active egress recording identifier.",
    };
  }
}

export function createLiveKitProviderFromEnv(env = process.env) {
  const livekitUrl = env.LIVEKIT_URL;
  const apiKey = env.LIVEKIT_API_KEY;
  const apiSecret = env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !apiKey || !apiSecret) {
    return null;
  }

  return new LiveKitVideoProvider({
    livekitUrl,
    apiKey,
    apiSecret,
  });
}

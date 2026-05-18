import type { VideoRoomTokenRequest } from "@/types/video";
import { getVideoProvider } from "./videoProviderRegistry";

export async function createVideoRoomToken(providerKey: string, request: VideoRoomTokenRequest) {
  const provider = getVideoProvider(providerKey);
  return provider.createParticipantToken(request);
}

export function buildDefaultTokenPermissions(role: VideoRoomTokenRequest["role"]) {
  if (role === "attendee" || role === "observer") {
    return {
      canPublishAudio: false,
      canPublishVideo: false,
      canShareScreen: false,
    };
  }

  if (role === "speaker" || role === "host" || role === "producer") {
    return {
      canPublishAudio: true,
      canPublishVideo: true,
      canShareScreen: true,
    };
  }

  return {
    canPublishAudio: true,
    canPublishVideo: true,
    canShareScreen: false,
  };
}

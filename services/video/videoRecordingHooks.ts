import type { VideoRoom } from "@/types/video";
import { getVideoProvider } from "./videoProviderRegistry";

export async function startRoomRecording(room: VideoRoom) {
  const provider = getVideoProvider(room.provider);

  if (!provider.startRecording) {
    return {
      ok: false,
      reason: `Provider ${room.provider} does not implement recording yet.`,
    };
  }

  return provider.startRecording(room);
}

export async function stopRoomRecording(room: VideoRoom, recordingId: string) {
  const provider = getVideoProvider(room.provider);

  if (!provider.stopRecording) {
    return {
      ok: false,
      reason: `Provider ${room.provider} does not implement recording yet.`,
    };
  }

  return provider.stopRecording(room, recordingId);
}

import type { VideoRoom } from "@/types/video";
import { getVideoProvider } from "./videoProviderRegistry";

export async function getVideoRoomProviderReadiness(room: VideoRoom) {
  const provider = getVideoProvider(room.provider);
  const health = await provider.getRoomHealth(room);

  return {
    roomId: room.id,
    provider: room.provider,
    ok: health.ok,
    severity: health.ok ? "pass" : "fail",
    summary: health.ok ? "Video provider is reachable." : "Video provider is not ready.",
    details: health.details,
    latencyMs: health.latencyMs,
  };
}

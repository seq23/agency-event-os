import { createVideoRoom, createVideoRoomToken, getVideoFallbackPolicy } from "@/services/video";
import { buildLiveKitRoomLabel, mapRoomSurfaceToVideoRoomType } from "@/services/video/livekitRoomUiService";
import type { LiveKitJoinRequest } from "@/types/livekitRoomUi";

export async function createDailyStageFallbackToken(input: LiveKitJoinRequest) {
  const policy = getVideoFallbackPolicy();
  if (!policy.dailyAutomaticFallbackEnabled) throw new Error("Daily fallback is disabled by backend policy.");
  const room = await createVideoRoom({
    agencyId: input.agencyId || `event-${input.eventId}-agency`,
    eventId: input.eventId,
    provider: "daily",
    roomType: mapRoomSurfaceToVideoRoomType(input.roomType),
    label: buildLiveKitRoomLabel({ eventId: input.eventId, roomType: input.roomType }),
    recordingEnabled: false,
    metadata: { fallbackFrom: "livekit_ingress", tokenRequired: true, privateStageFallback: true },
  });
  const token = await createVideoRoomToken("daily", {
    roomId: room.providerRoomId || room.id,
    eventId: input.eventId,
    displayName: input.displayName,
    profileId: input.profileId,
    role: input.role,
    canPublishAudio: false,
    canPublishVideo: false,
    canShareScreen: false,
    expiresInSeconds: 60 * 60,
  });
  if (!room.joinUrl) throw new Error("Daily room URL was not returned by provider.");
  return { room, token, dailyUrl: `${room.joinUrl}${room.joinUrl.includes("?") ? "&" : "?"}t=${encodeURIComponent(token.token)}` };
}

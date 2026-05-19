import type { LiveKitJoinRequest, LiveKitJoinResult, LiveKitRoomUiState } from "@/types/livekitRoomUi";
import type { VideoRoomType } from "@/types/video";
import { buildDefaultTokenPermissions, createVideoRoom, createVideoRoomToken } from "@/services/video";

export function mapRoomSurfaceToVideoRoomType(surface: LiveKitJoinRequest["roomType"]): VideoRoomType {
  if (surface === "main_stage") return "main_stage";
  if (surface === "green_room") return "green_room";
  if (surface === "backstage") return "backstage";
  if (surface === "testing") return "testing";
  if (surface === "breakout") return "breakout";
  if (surface === "sponsor_booth") return "sponsor_booth";
  return "speed_networking";
}

export function buildLiveKitRoomLabel(input: Pick<LiveKitJoinRequest, "roomType" | "eventId">) {
  return `${input.eventId} ${input.roomType.replace(/_/g, " ")}`;
}

export async function buildLiveKitJoinResult(input: LiveKitJoinRequest): Promise<LiveKitJoinResult> {
  const permissions = buildDefaultTokenPermissions(input.role);
  const room = await createVideoRoom({
    agencyId: input.agencyId ?? `event-${input.eventId}-agency`,
    eventId: input.eventId,
    provider: "livekit",
    roomType: mapRoomSurfaceToVideoRoomType(input.roomType),
    label: buildLiveKitRoomLabel(input),
    recordingEnabled: input.roomType === "main_stage",
  });

  const token = await createVideoRoomToken("livekit", {
    roomId: room.providerRoomId ?? room.id,
    eventId: input.eventId,
    displayName: input.displayName,
    profileId: input.profileId,
    role: input.role,
    expiresInSeconds: 60 * 60,
    ...permissions,
  });

  return {
    room,
    token,
    livekitUrl: typeof room.metadata.livekitUrl === "string" ? room.metadata.livekitUrl : undefined,
    connectionState: "token_ready",
  };
}

export function buildLiveKitRoomUiState(input: {
  eventId: string;
  roomId: string;
  roomType: LiveKitJoinRequest["roomType"];
  role: LiveKitJoinRequest["role"];
  activeParticipantCount?: number;
  reconnectAttempts?: number;
}): LiveKitRoomUiState {
  const permissions = buildDefaultTokenPermissions(input.role);

  return {
    eventId: input.eventId,
    roomId: input.roomId,
    roomType: input.roomType,
    connectionState: "not_connected",
    activeParticipantCount: input.activeParticipantCount ?? 0,
    reconnectAttempts: input.reconnectAttempts ?? 0,
    ...permissions,
  };
}

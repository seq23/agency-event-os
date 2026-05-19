import type { CreateVideoRoomInput, VideoRoom } from "@/types/video";
import { getVideoProvider } from "./videoProviderRegistry";

export async function createVideoRoom(input: CreateVideoRoomInput): Promise<VideoRoom> {
  const provider = getVideoProvider(input.provider);
  return provider.createRoom(input);
}

export async function closeVideoRoom(room: VideoRoom): Promise<VideoRoom> {
  const provider = getVideoProvider(room.provider);
  return provider.closeRoom(room);
}

export function isProductionCriticalRoom(roomType: CreateVideoRoomInput["roomType"]) {
  return ["main_stage", "green_room", "backstage", "testing", "white_label_backup"].includes(roomType);
}

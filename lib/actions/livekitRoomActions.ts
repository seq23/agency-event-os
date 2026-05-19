"use server";

import { buildLiveKitJoinResult } from "@/services/video/livekitRoomUiService";
import type { LiveKitJoinRequest } from "@/types/livekitRoomUi";

export async function issueLiveKitRoomTokenAction(input: LiveKitJoinRequest) {
  return buildLiveKitJoinResult(input);
}

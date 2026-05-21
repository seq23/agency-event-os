import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { LiveChatMessage, LiveChatRoomKind } from "@/types/liveChat";

export async function listLiveRoomChatMessages(eventId: string, roomKind: LiveChatRoomKind, roomId: string) {
  return getRuntimeStore().listLiveChatMessages(eventId, roomKind, roomId);
}

export async function appendLiveRoomChatMessage(input: Omit<LiveChatMessage, "id" | "moderationStatus" | "createdAt">) {
  const message: LiveChatMessage = {
    ...input,
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    moderationStatus: "visible",
    createdAt: new Date().toISOString(),
  };
  return getRuntimeStore().appendLiveChatMessage(message);
}

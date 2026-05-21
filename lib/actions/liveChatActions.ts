"use server";
import { revalidatePath } from "next/cache";
import { appendLiveRoomChatMessage } from "@/services/venue/liveChatService";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";
import type { LiveChatRoomKind } from "@/types/liveChat";

export async function sendLiveRoomChatMessage(formData: FormData) {
  const eventId = String(formData.get("eventId") || "").trim();
  const roomKind = String(formData.get("roomKind") || "main_stage") as LiveChatRoomKind;
  const roomId = String(formData.get("roomId") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!eventId || !roomId || !message) return;
  const identity = await getCurrentAttendeeIdentity(eventId);
  if (!identity) return;
  await appendLiveRoomChatMessage({ eventId, roomKind, roomId, attendeeId: identity.attendeeId, displayName: identity.displayName, company: identity.company, message });
  revalidatePath(`/venue/${eventId}/stage`);
  revalidatePath(`/venue/${eventId}/breakouts`);
  revalidatePath(`/venue/${eventId}/sessions/${roomId}`);
}

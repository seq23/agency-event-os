"use server";

import { revalidatePath } from "next/cache";
import { requireCrewCapability } from "@/lib/auth/requireCrewCapability";
import { clearRoomFallbackOverride, getRoomFallbackState, runRoomHealthCheck, switchRoomFallback } from "@/services/video/roomFallbackService";
import type { V4RoomType, V4VideoProvider } from "@/types/v4";

export async function runVideoHealthCheckAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomType = String(formData.get("roomType") || "main_stage") as V4RoomType;
  await requireCrewCapability("run_video_health_check", eventId);
  await runRoomHealthCheck(eventId, roomType, "technical_director");
  revalidatePath(`/app/events/${eventId}/video-health`);
}

export async function switchRoomFallbackAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomType = String(formData.get("roomType") || "main_stage") as V4RoomType;
  const provider = String(formData.get("provider") || "daily") as V4VideoProvider;
  const confirmedByCrew = String(formData.get("confirmedByCrew") || "") === "true";
  await requireCrewCapability("switch_video_fallback", eventId);
  const state = await getRoomFallbackState(eventId, roomType);
  await switchRoomFallback({ state, provider, confirmedByCrew, actorRole: "technical_director", reason: `operator_requested_${provider}` });
  revalidatePath(`/app/events/${eventId}/video-health`);
}

export async function clearRoomFallbackOverrideAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomType = String(formData.get("roomType") || "main_stage") as V4RoomType;
  await requireCrewCapability("clear_video_fallback", eventId);
  const state = await getRoomFallbackState(eventId, roomType);
  await clearRoomFallbackOverride(state, "technical_director");
  revalidatePath(`/app/events/${eventId}/video-health`);
}

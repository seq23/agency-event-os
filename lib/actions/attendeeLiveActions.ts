"use server";
import { revalidatePath } from "next/cache";
import { setAttendeeLiveCapability, setAttendeeLiveControlState } from "@/services/venue/attendeeLivePermissionService";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";
import type { AttendeeLiveRoomKind } from "@/types/attendeeLive";

function bool(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

export async function updateAttendeeLiveControl(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomKind = String(formData.get("roomKind") || "main_stage") as AttendeeLiveRoomKind;
  const roomId = String(formData.get("roomId") || "main-stage");
  await setAttendeeLiveControlState({ eventId, roomKind, roomId, globalCameraEnabled: bool(formData.get("globalCameraEnabled")), globalMicrophoneEnabled: bool(formData.get("globalMicrophoneEnabled")), globalScreenShareEnabled: bool(formData.get("globalScreenShareEnabled")), requestRequired: bool(formData.get("requestRequired")), emergencyPublishingDisabled: bool(formData.get("emergencyPublishingDisabled")), updatedAt: new Date().toISOString() });
  revalidatePath(`/admin/testing/${eventId}`);
}

export async function requestAttendeeStageAccess(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomKind = String(formData.get("roomKind") || "main_stage") as AttendeeLiveRoomKind;
  const roomId = String(formData.get("roomId") || "main-stage");
  const identity = await getCurrentAttendeeIdentity(eventId);
  if (!identity) return;
  const attendeeId = identity.attendeeId;
  await setAttendeeLiveCapability({ eventId, roomKind, roomId, attendeeId, canPublishCamera: false, canPublishMicrophone: false, canShareScreen: false, approvedForStage: false, revoked: false, updatedAt: new Date().toISOString() });
  revalidatePath(`/venue/${eventId}/stage`);
}

export async function setAttendeeLiveApproval(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomKind = String(formData.get("roomKind") || "main_stage") as AttendeeLiveRoomKind;
  const roomId = String(formData.get("roomId") || "main-stage");
  const attendeeId = String(formData.get("attendeeId") || "");
  if (!attendeeId) return;
  const revoked = bool(formData.get("revoked"));
  await setAttendeeLiveCapability({ eventId, roomKind, roomId, attendeeId, canPublishCamera: !revoked && bool(formData.get("canPublishCamera")), canPublishMicrophone: !revoked && bool(formData.get("canPublishMicrophone")), canShareScreen: !revoked && bool(formData.get("canShareScreen")), approvedForStage: !revoked && bool(formData.get("approvedForStage")), revoked, revokedReason: revoked ? String(formData.get("revokedReason") || "Crew revoked live participation.") : undefined, updatedBy: "operator", updatedAt: new Date().toISOString() });
  revalidatePath(`/admin/testing/${eventId}`);
}

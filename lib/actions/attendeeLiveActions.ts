"use server";
import { revalidatePath } from "next/cache";
import { randomId } from "@/lib/security/portableCrypto";
import { requireLiveEventControlAccessForRequest } from "@/lib/auth/liveControlRequestGuard";
import { setAttendeeLiveCapability, setAttendeeLiveControlState } from "@/services/venue/attendeeLivePermissionService";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { removeLiveKitParticipantFromMainStage } from "@/services/video/livekitParticipantAdmin";
import type { AttendeeLiveRoomKind } from "@/types/attendeeLive";

function bool(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

async function requireControl(eventId: string) {
  const auth = await requireLiveEventControlAccessForRequest(eventId);
  if (!auth.ok) throw new Error(auth.error);
  return auth;
}

async function recordAttendeeLiveDecision(input: { eventId: string; roomId: string; actorRole: string; action: string; attendeeId?: string; reason?: string }) {
  await getRuntimeStore().appendStageStreamEvent({
    id: randomId("attendee-live-action"),
    eventId: input.eventId,
    stageId: input.roomId,
    signal: "attendee_access_decision",
    nextSource: "LIVEKIT_INGRESS",
    failurePlane: "NONE",
    message: `${input.actorRole} ${input.action}${input.attendeeId ? ` attendee ${input.attendeeId}` : ""}${input.reason ? `: ${input.reason}` : ""}`,
    createdAt: new Date().toISOString(),
  }).catch(() => undefined);
}

export async function updateAttendeeLiveControl(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomKind = String(formData.get("roomKind") || "main_stage") as AttendeeLiveRoomKind;
  const roomId = String(formData.get("roomId") || "main-stage");
  const auth = await requireControl(eventId);
  await setAttendeeLiveControlState({ eventId, roomKind, roomId, globalCameraEnabled: bool(formData.get("globalCameraEnabled")), globalMicrophoneEnabled: bool(formData.get("globalMicrophoneEnabled")), globalScreenShareEnabled: bool(formData.get("globalScreenShareEnabled")), requestRequired: bool(formData.get("requestRequired")), attendeeJoinRequiresApproval: bool(formData.get("attendeeJoinRequiresApproval")), emergencyPublishingDisabled: bool(formData.get("emergencyPublishingDisabled")), updatedAt: new Date().toISOString() });
  await recordAttendeeLiveDecision({ eventId, roomId, actorRole: auth.actorRole, action: `updated ${roomKind} live control state` });
  revalidatePath(`/admin/testing/${eventId}`);
}

export async function requestAttendeeStageAccess(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomKind = String(formData.get("roomKind") || "main_stage") as AttendeeLiveRoomKind;
  const roomId = String(formData.get("roomId") || "main-stage");
  const identity = await getCurrentAttendeeIdentity(eventId);
  if (!identity) return;
  const attendeeId = identity.attendeeId;
  await setAttendeeLiveCapability({ eventId, roomKind, roomId, attendeeId, canJoinLiveStream: false, canPublishCamera: false, canPublishMicrophone: false, canShareScreen: false, approvedForStage: false, revoked: false, updatedAt: new Date().toISOString() });
  await recordAttendeeLiveDecision({ eventId, roomId, actorRole: "attendee", action: "requested live stage access for", attendeeId });
  revalidatePath(`/venue/${eventId}/stage`);
}

export async function setAttendeeLiveApproval(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const roomKind = String(formData.get("roomKind") || "main_stage") as AttendeeLiveRoomKind;
  const roomId = String(formData.get("roomId") || "main-stage");
  const attendeeId = String(formData.get("attendeeId") || "");
  if (!attendeeId) return;
  const auth = await requireControl(eventId);
  const revoked = bool(formData.get("revoked"));
  await setAttendeeLiveCapability({ eventId, roomKind, roomId, attendeeId, canJoinLiveStream: !revoked && bool(formData.get("canJoinLiveStream")), canPublishCamera: !revoked && bool(formData.get("canPublishCamera")), canPublishMicrophone: !revoked && bool(formData.get("canPublishMicrophone")), canShareScreen: !revoked && bool(formData.get("canShareScreen")), approvedForStage: !revoked && bool(formData.get("approvedForStage")), revoked, revokedReason: revoked ? String(formData.get("revokedReason") || "Crew revoked live-event access.") : undefined, updatedBy: auth.actorRole, updatedAt: new Date().toISOString() });
  const livekitParticipantRemoval = revoked && roomKind === "main_stage" ? await removeLiveKitParticipantFromMainStage({ eventId, stageId: roomId, attendeeId }).catch(() => ({ status: "failed" as const })) : undefined;
  await recordAttendeeLiveDecision({ eventId, roomId, actorRole: auth.actorRole, action: revoked ? "revoked live access for" : "permitted live access for", attendeeId, reason: revoked ? `${String(formData.get("revokedReason") || "Crew revoked live-event access.")} LiveKit removal: ${livekitParticipantRemoval?.status || "not_needed"}` : undefined });
  revalidatePath(`/admin/testing/${eventId}`);
}

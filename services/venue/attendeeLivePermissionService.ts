import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { AttendeeLiveCapability, AttendeeLiveControlState, AttendeeLiveRoomKind } from "@/types/attendeeLive";

export function attendeeLiveCapabilityKey(eventId: string, roomKind: AttendeeLiveRoomKind, roomId: string, attendeeId: string) {
  return `${eventId}:${roomKind}:${roomId}:${attendeeId}`;
}

export function attendeeLiveControlKey(eventId: string, roomKind: AttendeeLiveRoomKind, roomId: string) {
  return `${eventId}:${roomKind}:${roomId}`;
}

export function defaultLiveControlState(eventId: string, roomKind: AttendeeLiveRoomKind, roomId: string): AttendeeLiveControlState {
  return {
    eventId,
    roomKind,
    roomId,
    globalCameraEnabled: roomKind !== "main_stage",
    globalMicrophoneEnabled: roomKind !== "main_stage",
    globalScreenShareEnabled: false,
    requestRequired: roomKind === "main_stage",
    emergencyPublishingDisabled: false,
    updatedAt: new Date().toISOString(),
  };
}

export async function getAttendeeLiveControlState(eventId: string, roomKind: AttendeeLiveRoomKind, roomId: string) {
  const key = attendeeLiveControlKey(eventId, roomKind, roomId);
  const existing = await getRuntimeStore().getAttendeeLiveControlState(key).catch(() => undefined);
  return existing || defaultLiveControlState(eventId, roomKind, roomId);
}

export async function setAttendeeLiveControlState(state: AttendeeLiveControlState) {
  return getRuntimeStore().setAttendeeLiveControlState(attendeeLiveControlKey(state.eventId, state.roomKind, state.roomId), { ...state, updatedAt: new Date().toISOString() });
}

export async function getAttendeeLiveCapability(eventId: string, roomKind: AttendeeLiveRoomKind, roomId: string, attendeeId: string) {
  const key = attendeeLiveCapabilityKey(eventId, roomKind, roomId, attendeeId);
  return getRuntimeStore().getAttendeeLiveCapability(key);
}

export async function setAttendeeLiveCapability(capability: AttendeeLiveCapability) {
  return getRuntimeStore().setAttendeeLiveCapability(attendeeLiveCapabilityKey(capability.eventId, capability.roomKind, capability.roomId, capability.attendeeId), { ...capability, updatedAt: new Date().toISOString() });
}

export async function canAttendeePublishLive(input: { eventId: string; roomKind: AttendeeLiveRoomKind; roomId: string; attendeeId: string }) {
  const [control, capability] = await Promise.all([
    getAttendeeLiveControlState(input.eventId, input.roomKind, input.roomId),
    getAttendeeLiveCapability(input.eventId, input.roomKind, input.roomId, input.attendeeId),
  ]);
  if (control.emergencyPublishingDisabled) return { canPublishAudio: false, canPublishVideo: false, canShareScreen: false, reason: "Crew disabled attendee publishing during live operations." };
  if (capability?.revoked) return { canPublishAudio: false, canPublishVideo: false, canShareScreen: false, reason: capability.revokedReason || "Crew revoked live participation." };
  if (input.roomKind === "main_stage" && !capability?.approvedForStage) return { canPublishAudio: false, canPublishVideo: false, canShareScreen: false, reason: "Main stage publishing requires crew approval." };
  return {
    canPublishAudio: control.globalMicrophoneEnabled && Boolean(capability?.canPublishMicrophone || input.roomKind !== "main_stage"),
    canPublishVideo: control.globalCameraEnabled && Boolean(capability?.canPublishCamera || input.roomKind !== "main_stage"),
    canShareScreen: control.globalScreenShareEnabled && Boolean(capability?.canShareScreen),
    reason: "Publishing allowed by crew controls.",
  };
}

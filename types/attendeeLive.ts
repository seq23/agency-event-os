export type AttendeeLiveRoomKind = "main_stage" | "breakout" | "session";
export type AttendeeLiveRequestStatus = "disabled" | "available" | "requested" | "approved" | "live" | "revoked";

export interface AttendeeLiveCapability {
  eventId: string;
  attendeeId: string;
  roomKind: AttendeeLiveRoomKind;
  roomId: string;
  canPublishCamera: boolean;
  canPublishMicrophone: boolean;
  canShareScreen: boolean;
  approvedForStage: boolean;
  revoked: boolean;
  revokedReason?: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface AttendeeLiveControlState {
  eventId: string;
  roomKind: AttendeeLiveRoomKind;
  roomId: string;
  globalCameraEnabled: boolean;
  globalMicrophoneEnabled: boolean;
  globalScreenShareEnabled: boolean;
  requestRequired: boolean;
  emergencyPublishingDisabled: boolean;
  updatedAt: string;
}

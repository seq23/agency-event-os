export type WhiteLabelVideoProviderMode =
  | "livekit_native"
  | "zoom_embedded"
  | "external_backup_link";

export type WhiteLabelRoomKind =
  | "stage"
  | "session"
  | "breakout"
  | "networking"
  | "speaker_green_room"
  | "sponsor_ready_room"
  | "testing";

export type WhiteLabelVideoRoomConfig = {
  providerMode: WhiteLabelVideoProviderMode;
  roomKind: WhiteLabelRoomKind;
  roomLabel: string;
  displayName: string;
  livekitRoomName?: string;
  livekitRoomId?: string;
  livekitRoomType?: "main_stage" | "green_room" | "backstage" | "testing" | "breakout" | "sponsor_booth" | "speed_networking";
  livekitRole?: "producer" | "host" | "speaker" | "sponsor" | "attendee" | "contractor" | "client" | "observer";
  zoomMeetingNumber?: string;
  zoomMeetingPassword?: string;
  externalRoomUrl?: string;
  attendeeSafeStatus: "ready" | "opening" | "ended" | "unavailable";
};

export type ZoomMeetingSdkSignatureRequest = {
  meetingNumber: string;
  role: 0 | 1;
};

export type ZoomMeetingSdkSignatureResponse = {
  sdkKey: string;
  signature: string;
  meetingNumber: string;
  role: 0 | 1;
};

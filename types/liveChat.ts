export type LiveChatRoomKind = "main_stage" | "breakout" | "session";
export type LiveChatModerationStatus = "visible" | "hidden" | "flagged";

export interface LiveChatMessage {
  id: string;
  eventId: string;
  roomKind: LiveChatRoomKind;
  roomId: string;
  attendeeId?: string;
  displayName: string;
  company?: string;
  message: string;
  moderationStatus: LiveChatModerationStatus;
  createdAt: string;
}

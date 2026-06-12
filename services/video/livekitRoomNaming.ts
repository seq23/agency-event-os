export function normalizeLiveKitRoomName(eventId: string, roomId: string) {
  return `${eventId}-${roomId}`.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
}

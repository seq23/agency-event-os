import type { VirtualVenueBreakout } from "@/types/virtualVenue";

export function getBreakoutAvailability(room: VirtualVenueBreakout) {
  const remaining = Math.max(room.capacity - room.currentCount, 0);
  return {
    remaining,
    isFull: remaining === 0,
    label: remaining === 0 ? "Full" : `${remaining} seats left`,
  };
}

export function sortBreakouts(rooms: VirtualVenueBreakout[]) {
  return [...rooms].sort((a, b) => a.currentCount - b.currentCount);
}

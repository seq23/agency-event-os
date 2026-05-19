import type { VirtualVenueReplay } from "@/types/virtualVenue";

export function groupReplaysByStatus(replays: VirtualVenueReplay[]) {
  return {
    available: replays.filter((replay) => replay.status === "available"),
    processing: replays.filter((replay) => replay.status === "processing"),
    restricted: replays.filter((replay) => replay.status === "restricted"),
    notAvailable: replays.filter((replay) => replay.status === "not_available"),
  };
}

export function formatReplayDuration(seconds?: number) {
  if (!seconds) return "Duration pending";
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

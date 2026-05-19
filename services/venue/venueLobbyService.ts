import type { VirtualVenueModel } from "@/types/virtualVenue";

export function buildVenueLobbySections(model: VirtualVenueModel) {
  return {
    heroCta: model.liveNow[0]?.roomHref ?? `/venue/${model.eventId}/stage`,
    liveNow: model.liveNow,
    upNext: model.upNext,
    breakouts: model.breakouts.slice(0, 3),
    booths: model.booths.slice(0, 4),
    peoplePreview: model.people.slice(0, 6),
    replayPreview: model.replays.slice(0, 3),
  };
}

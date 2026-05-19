import { getEvent, getSessionsForEvent, getSponsorBoothsForEvent, getRuntimeData } from "@/lib/runtime/getRuntimeData";
import type {
  VenueNavItem,
  VirtualVenueBooth,
  VirtualVenueBreakout,
  VirtualVenueModel,
  VirtualVenuePerson,
  VirtualVenueReplay,
  VirtualVenueSession,
} from "@/types/virtualVenue";

function nav(eventId: string): VenueNavItem[] {
  const base = `/venue/${eventId}`;
  return [
    ["lobby", "Lobby", `${base}/lobby`, "open"],
    ["stage", "Stage", `${base}/stage`, "live"],
    ["sessions", "Sessions", `${base}/sessions`, "open"],
    ["breakouts", "Breakouts", `${base}/breakouts`, "open"],
    ["expo", "Expo", `${base}/expo`, "open"],
    ["networking", "Networking", `${base}/networking`, "available"],
    ["people", "People", `${base}/people`, "available"],
    ["replay", "Replay", `${base}/replay`, "processing"],
    ["help", "Help", `${base}/help`, "available"],
  ].map(([surface, label, href, status]) => ({ surface, label, href, status })) as VenueNavItem[];
}

export function buildVirtualVenueModel(eventId: string): VirtualVenueModel {
  const event = getEvent(eventId);
  const data = getRuntimeData();
  const sessions: VirtualVenueSession[] = getSessionsForEvent(event.id).map((session, index) => ({
    id: session.id,
    title: session.name,
    description: session.description,
    startsAt: session.startAt,
    endsAt: session.endAt,
    status: index === 0 ? "live" : index < 3 ? "upcoming" : "completed",
    roomHref: `/venue/${event.id}/sessions/${session.id}`,
    speakerNames: data.speakers.filter((speaker) => speaker.eventId === event.id).slice(0, 2).map((speaker) => speaker.name),
  }));

  const booths: VirtualVenueBooth[] = getSponsorBoothsForEvent(event.id).map((booth) => ({
    id: booth.id,
    name: booth.name,
    headline: booth.name,
    description: booth.description,
    href: `/venue/${event.id}/expo/${booth.id}`,
    ctaLabel: "Visit booth",
  }));

  const people: VirtualVenuePerson[] = data.speakers
    .filter((speaker) => speaker.eventId === event.id)
    .map((speaker) => ({
      id: speaker.id,
      displayName: speaker.name,
      company: speaker.company,
      title: speaker.title,
      networkingOptIn: true,
    }));

  const breakouts: VirtualVenueBreakout[] = sessions.slice(0, 3).map((session, index) => ({
    id: `breakout-${session.id}`,
    title: `${session.title} discussion`,
    description: "Small-group room for attendee conversation and moderated discussion.",
    hostName: session.speakerNames[0] ?? "Event host",
    capacity: 25,
    currentCount: 6 + index * 3,
    status: "open",
    href: `/venue/${event.id}/breakouts?room=breakout-${session.id}`,
  }));

  const replays: VirtualVenueReplay[] = sessions.slice(0, 4).map((session, index) => ({
    id: `replay-${session.id}`,
    title: session.title,
    status: index === 0 ? "processing" : "available",
    durationSeconds: 1800 + index * 300,
    href: `/venue/${event.id}/replay#replay-${session.id}`,
  }));

  return {
    eventId: event.id,
    eventName: event.name,
    nav: nav(event.id),
    liveNow: sessions.filter((session) => session.status === "live"),
    upNext: sessions.filter((session) => session.status === "upcoming"),
    sessions,
    breakouts,
    booths,
    people,
    replays,
    helpTopics: ["Video/audio issue", "Cannot join room", "Schedule question", "Sponsor/expo issue", "Networking issue", "Accessibility request", "Other"],
  };
}

export function getVenueSurface(model: VirtualVenueModel, surface: VenueNavItem["surface"]) {
  return model.nav.find((item) => item.surface === surface);
}

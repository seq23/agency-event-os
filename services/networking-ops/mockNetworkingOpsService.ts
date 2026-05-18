import type { BreakoutRoom, SpeedNetworkingMatch, SpeedNetworkingSettings } from "@/types/networkingOps";

export const mockBreakoutRooms: BreakoutRoom[] = [
  {
    id: "breakout-founder-roundtable",
    eventId: "event-summit",
    title: "Founder Roundtable",
    description: "Small-group breakout for founder operating questions.",
    roomType: "roundtable_room",
    hostName: "Maya Producer",
    status: "live",
    capacity: 40,
    cameraOnLimit: 12,
    watcherLimit: 100,
    chatEnabled: true,
    qAndAEnabled: true,
    pollsEnabled: true,
    recordingEnabled: true,
    startsAt: "2026-06-12T16:00:00.000Z",
    endsAt: "2026-06-12T16:45:00.000Z",
  },
  {
    id: "breakout-sponsor-session",
    eventId: "event-summit",
    title: "Clarity AI Sponsor Session",
    description: "Sponsor-hosted demo and live Q&A.",
    roomType: "sponsor_session",
    hostName: "Riley Sponsor",
    status: "scheduled",
    capacity: 80,
    cameraOnLimit: 6,
    watcherLimit: 200,
    chatEnabled: true,
    qAndAEnabled: true,
    pollsEnabled: false,
    recordingEnabled: true,
    startsAt: "2026-06-12T17:00:00.000Z",
    endsAt: "2026-06-12T17:30:00.000Z",
  },
];

export const mockSpeedNetworkingSettings: SpeedNetworkingSettings = {
  eventId: "event-summit",
  durationSeconds: 180,
  matchingMode: "random",
  queueOpen: true,
  maxMatchesPerAttendee: 12,
  cooldownSeconds: 10,
  reportEnabled: true,
};

export const mockSpeedNetworkingMatches: SpeedNetworkingMatch[] = [
  {
    id: "match-sam-jordan",
    eventId: "event-summit",
    attendeeAName: "Sam Attendee",
    attendeeBName: "Jordan Founder",
    status: "in_call",
    startedAt: "2026-06-12T16:12:00.000Z",
    expiresAt: "2026-06-12T16:15:00.000Z",
    secondsRemaining: 73,
  },
  {
    id: "match-lee-rivera",
    eventId: "event-summit",
    attendeeAName: "Lee Investor",
    attendeeBName: "Rivera Founder",
    status: "completed",
    secondsRemaining: 0,
  },
];

export function getBreakoutRooms(eventId: string) {
  return mockBreakoutRooms.filter((room) => room.eventId === eventId);
}

export function getSpeedNetworkingSettings(eventId: string) {
  return { ...mockSpeedNetworkingSettings, eventId };
}

export function getSpeedNetworkingMatches(eventId: string) {
  return mockSpeedNetworkingMatches.filter((match) => match.eventId === eventId);
}

export function getNetworkingHealth(eventId: string) {
  const matches = getSpeedNetworkingMatches(eventId);
  return {
    eventId,
    activeMatches: matches.filter((match) => match.status === "in_call").length,
    completedMatches: matches.filter((match) => match.status === "completed").length,
    reportedMatches: matches.filter((match) => match.status === "reported").length,
    queueStatus: getSpeedNetworkingSettings(eventId).queueOpen ? "open" : "closed",
  };
}

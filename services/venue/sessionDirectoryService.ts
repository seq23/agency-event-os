import type { VirtualVenueSession } from "@/types/virtualVenue";

export function groupSessionsByStatus(sessions: VirtualVenueSession[]) {
  return {
    live: sessions.filter((session) => session.status === "live"),
    upcoming: sessions.filter((session) => session.status === "upcoming"),
    completed: sessions.filter((session) => session.status === "completed"),
  };
}

export function findSession(sessions: VirtualVenueSession[], sessionId: string) {
  return sessions.find((session) => session.id === sessionId) ?? sessions[0];
}

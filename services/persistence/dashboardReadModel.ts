import type { Client, Event } from "@/types/core";

export interface AgencyDashboardReadModel {
  agencyId: string;
  clientCount: number;
  eventCount: number;
  upcomingEventCount: number;
  readinessAverage: number;
}

export function buildAgencyDashboardReadModel(input: {
  agencyId: string;
  clients: Client[];
  events: Event[];
}): AgencyDashboardReadModel {
  const readinessAverage =
    input.events.length === 0
      ? 0
      : Math.round(input.events.reduce((sum, event) => sum + 0, 0) / input.events.length);

  return {
    agencyId: input.agencyId,
    clientCount: input.clients.length,
    eventCount: input.events.length,
    upcomingEventCount: input.events.filter((event) => !["ended", "archived"].includes(event.status)).length,
    readinessAverage,
  };
}

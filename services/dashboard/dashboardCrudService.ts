import type { DashboardCrudCard } from "@/types/preVenueHardening";

export function buildDashboardCrudCards(input: {
  clientCount: number;
  eventCount: number;
  assetCount: number;
  reportCount: number;
  openProductionItemCount: number;
}): DashboardCrudCard[] {
  return [
    {
      surface: "clients",
      label: "Clients",
      status: input.clientCount > 0 ? "ready" : "empty",
      href: "/app/clients",
      summary: `${input.clientCount} client records available`,
    },
    {
      surface: "events",
      label: "Events",
      status: input.eventCount > 0 ? "ready" : "empty",
      href: "/app/events",
      summary: `${input.eventCount} events available`,
    },
    {
      surface: "assets",
      label: "Assets",
      status: input.assetCount > 0 ? "ready" : "empty",
      href: "/app/assets",
      summary: `${input.assetCount} tracked assets`,
    },
    {
      surface: "reports",
      label: "Reports",
      status: input.reportCount > 0 ? "ready" : "empty",
      href: "/app/reports",
      summary: `${input.reportCount} report center items`,
    },
    {
      surface: "production",
      label: "Production",
      status: input.openProductionItemCount > 0 ? "needs_attention" : "ready",
      href: "/app/events",
      summary: `${input.openProductionItemCount} production items need attention`,
    },
  ];
}

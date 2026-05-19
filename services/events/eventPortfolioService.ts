import { getRuntimeData } from "@/lib/runtime/getRuntimeData";
import { calculateEventReadiness } from "@/lib/readiness/calculateEventReadiness";
import { getSetupCompletion } from "@/services/events/eventSetupCompletionService";
import { getRoomFallbackState, recommendFallbackProvider } from "@/services/video/roomFallbackService";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { EventStatus } from "@/types/core";

export type EventPortfolioTab = "Live Now" | "Upcoming" | "Drafts" | "Needs Review" | "Past" | "Archived" | "All";

export interface EventPortfolioCard {
  id: string;
  name: string;
  client: string;
  status: EventStatus;
  tab: EventPortfolioTab;
  startAt: string;
  timezone: string;
  readinessScore: number;
  setupCompletion: number;
  accessReadiness: string;
  speakerReadiness: string;
  sponsorReadiness: string;
  assetReadiness: string;
  runOfShowStatus: string;
  videoHealth: string;
  publishStatus: string;
  lastSmokeResult: string;
  incidentCount: number;
  reportingStatus: string;
  currentSegment: string;
  nextSegment: string;
  fallbackRecommendation: string;
}

function tabForStatus(status: EventStatus): EventPortfolioTab {
  if (status === "live") return "Live Now";
  if (status === "draft") return "Drafts";
  if (status === "published" || status === "registration_open" || status === "pre_event") return "Upcoming";
  if (status === "ended" || status === "replay_available") return "Past";
  if (status === "archived") return "Archived";
  return "Needs Review";
}

export async function getEventPortfolioCards(): Promise<EventPortfolioCard[]> {
  const data = getRuntimeData();
  const runtime = await getRuntimeStore().readSnapshot();
  const cards: EventPortfolioCard[] = [];
  for (const event of data.events) {
    const client = data.clients.find((item) => item.id === event.clientId);
    const readiness = calculateEventReadiness(data, event.id);
    const setup = getSetupCompletion(event.id);
    const fallback = await getRoomFallbackState(event.id, "main_stage");
    const incidents = runtime.incidentEvents.filter((incident) => incident.eventId === event.id && incident.status !== "resolved");
    const segments = data.runOfShowSegments.filter((segment) => segment.eventId === event.id);
    cards.push({
      id: event.id,
      name: event.name,
      client: client?.name || "Unassigned client",
      status: event.status,
      tab: tabForStatus(event.status),
      startAt: event.startAt,
      timezone: event.timezone,
      readinessScore: readiness.overallScore,
      setupCompletion: setup.score,
      accessReadiness: setup.sections.find((section) => section.key === "access")?.complete ? "ready" : "blocked",
      speakerReadiness: data.speakers.some((speaker) => speaker.eventId === event.id) ? "ready" : "missing speakers",
      sponsorReadiness: data.sponsors.some((sponsor) => sponsor.eventId === event.id) ? "ready" : "missing sponsors",
      assetReadiness: data.assets.some((asset) => asset.eventId === event.id) ? "ready" : "needs assets",
      runOfShowStatus: segments.length > 0 ? "configured" : "missing",
      videoHealth: fallback.health.livekit === "healthy" ? "healthy" : fallback.health.livekit,
      publishStatus: event.status === "draft" ? "draft" : "published path configured",
      lastSmokeResult: "pending local smoke",
      incidentCount: incidents.length,
      reportingStatus: event.reportingEnabled ? "enabled" : "disabled",
      currentSegment: segments[0]?.publicTitle || segments[0]?.segmentTitle || "No segment live",
      nextSegment: segments[1]?.publicTitle || segments[1]?.segmentTitle || "No next segment queued",
      fallbackRecommendation: recommendFallbackProvider(fallback),
    });
  }
  return cards;
}

export async function groupEventPortfolioCards(cards?: EventPortfolioCard[]) {
  const resolvedCards = cards ?? await getEventPortfolioCards();
  const tabs: EventPortfolioTab[] = ["Live Now", "Upcoming", "Drafts", "Needs Review", "Past", "Archived", "All"];
  return tabs.map((tab) => ({ tab, cards: tab === "All" ? resolvedCards : resolvedCards.filter((card) => card.tab === tab) }));
}

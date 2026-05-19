import { randomUUID } from "crypto";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { V4AnalyticsEvent } from "@/types/v4";

export function buildAnalyticsEvent(input: Omit<V4AnalyticsEvent, "id" | "createdAt">): V4AnalyticsEvent {
  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
}

export async function recordAnalyticsEvent(input: Omit<V4AnalyticsEvent, "id" | "createdAt">): Promise<V4AnalyticsEvent> {
  const event = buildAnalyticsEvent(input);
  return getRuntimeStore().appendAnalyticsEvent(event);
}

export const requiredV4AnalyticsEvents: V4AnalyticsEvent["kind"][] = [
  "attendee_joined_lobby",
  "attendee_joined_session",
  "sponsor_cta_clicked",
  "support_requested",
  "replay_watched",
  "networking_joined",
];

import type { ActivityFeedItem } from "@/types/preVenueHardening";
import type { AuditEntry } from "@/types/audit";

export function mapAuditToActivityFeedItem(entry: AuditEntry): ActivityFeedItem {
  return {
    id: `activity-${entry.id}`,
    agencyId: entry.agencyId,
    clientId: entry.clientId,
    eventId: entry.eventId,
    sourceType: entry.resourceType,
    sourceId: entry.resourceId,
    title: entry.action.replace(/_/g, " "),
    body: `${entry.actorRole} updated ${entry.resourceType}`,
    visibility: entry.visibility,
    createdAt: entry.createdAt,
  };
}

export function sortActivityFeed(items: ActivityFeedItem[]) {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

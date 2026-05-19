import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";

export async function markSetupSectionComplete(input: { eventId: string; sectionKey: string; actorRole: string }) {
  const createdAt = new Date().toISOString();
  const store = getRuntimeStore();
  await store.appendAuditLog({
    id: `audit-setup-${input.eventId}-${input.sectionKey}-${Date.now()}`,
    agencyId: "west-peek-live",
    eventId: input.eventId,
    actorUserId: "setup-operator",
    actorRole: input.actorRole,
    action: "setup_section_completed",
    resourceType: "event_setup_section",
    resourceId: input.sectionKey,
    createdAt,
    visibility: "internal_agency",
  });
  return store.appendRunOfShowEvent({
    id: `setup-${input.eventId}-${input.sectionKey}-${Date.now()}`,
    eventId: input.eventId,
    segmentId: input.sectionKey,
    action: "note",
    actorRole: input.actorRole,
    createdAt,
  });
}

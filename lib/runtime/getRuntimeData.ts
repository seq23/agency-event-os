import { mockData as runtimeSeedData, mockUsers as runtimeSeedUsers } from "@/lib/mock/mockData";

export function getRuntimeData() {
  return runtimeSeedData;
}

export function getCurrentRuntimeUser() {
  return runtimeSeedUsers[0];
}

export function getRuntimeUsers() {
  return runtimeSeedUsers;
}

export function getEvent(eventId: string) {
  const normalizedEventId = eventId === "demo" ? "event-summit" : eventId;
  return runtimeSeedData.events.find((event) => event.id === normalizedEventId || event.slug === normalizedEventId) ?? runtimeSeedData.events[0];
}

export function getClient(clientId: string) {
  return runtimeSeedData.clients.find((client) => client.id === clientId) ?? runtimeSeedData.clients[0];
}

export function getEventClient(eventId: string) {
  const event = getEvent(eventId);
  return getClient(event.clientId);
}

export function getClientBySlug(slug: string) {
  return runtimeSeedData.clients.find((client) => client.slug === slug) ?? runtimeSeedData.clients[0];
}

export function getEventBySlug(slug: string) {
  return runtimeSeedData.events.find((event) => event.slug === slug) ?? runtimeSeedData.events[0];
}

export function getTasksForEvent(eventId: string) {
  return runtimeSeedData.tasks.filter((task) => task.eventId === eventId);
}

export function getRunOfShowForEvent(eventId: string) {
  const normalizedEventId = eventId === "demo" ? "event-summit" : eventId;
  return runtimeSeedData.runOfShowSegments
    .filter((segment) => segment.eventId === normalizedEventId)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function getApprovalsForEvent(eventId: string) {
  return runtimeSeedData.approvals.filter((approval) => approval.eventId === eventId);
}

export function getAssetsForEvent(eventId: string) {
  return runtimeSeedData.assets.filter((asset) => asset.eventId === eventId || !asset.eventId);
}

export function getSpeakersForEvent(eventId: string) {
  return runtimeSeedData.speakers.filter((speaker) => speaker.eventId === eventId);
}

export function getSponsorsForEvent(eventId: string) {
  return runtimeSeedData.sponsors.filter((sponsor) => sponsor.eventId === eventId);
}

export function getSponsorBoothsForEvent(eventId: string) {
  return runtimeSeedData.sponsorBooths.filter((booth) => booth.eventId === eventId);
}

export function getSessionsForEvent(eventId: string) {
  return runtimeSeedData.sessions.filter((session) => session.eventId === eventId);
}

export function getContractorAssignmentsForEvent(eventId: string) {
  return runtimeSeedData.contractorAssignments.filter((assignment) => assignment.eventId === eventId);
}

export function getVendorAssignmentsForEvent(eventId: string) {
  return runtimeSeedData.vendorAssignments.filter((assignment) => assignment.eventId === eventId);
}

export function getAnalyticsForEvent(eventId: string) {
  return runtimeSeedData.analyticsEvents.filter((event) => event.eventId === eventId);
}

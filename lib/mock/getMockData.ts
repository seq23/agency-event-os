import { mockData, mockUsers } from "./mockData";

export function getMockData() {
  return mockData;
}

export function getCurrentUser() {
  return mockUsers[0];
}

export function getMockUsers() {
  return mockUsers;
}

export function getEvent(eventId: string) {
  return mockData.events.find((event) => event.id === eventId) ?? mockData.events[0];
}

export function getClient(clientId: string) {
  return mockData.clients.find((client) => client.id === clientId) ?? mockData.clients[0];
}

export function getEventClient(eventId: string) {
  const event = getEvent(eventId);
  return getClient(event.clientId);
}

export function getClientBySlug(slug: string) {
  return mockData.clients.find((client) => client.slug === slug) ?? mockData.clients[0];
}

export function getEventBySlug(slug: string) {
  return mockData.events.find((event) => event.slug === slug) ?? mockData.events[0];
}

export function getTasksForEvent(eventId: string) {
  return mockData.tasks.filter((task) => task.eventId === eventId);
}

export function getRunOfShowForEvent(eventId: string) {
  return mockData.runOfShowSegments
    .filter((segment) => segment.eventId === eventId)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function getApprovalsForEvent(eventId: string) {
  return mockData.approvals.filter((approval) => approval.eventId === eventId);
}

export function getAssetsForEvent(eventId: string) {
  return mockData.assets.filter((asset) => asset.eventId === eventId || !asset.eventId);
}

export function getSpeakersForEvent(eventId: string) {
  return mockData.speakers.filter((speaker) => speaker.eventId === eventId);
}

export function getSponsorsForEvent(eventId: string) {
  return mockData.sponsors.filter((sponsor) => sponsor.eventId === eventId);
}

export function getSponsorBoothsForEvent(eventId: string) {
  return mockData.sponsorBooths.filter((booth) => booth.eventId === eventId);
}

export function getSessionsForEvent(eventId: string) {
  return mockData.sessions.filter((session) => session.eventId === eventId);
}

export function getContractorAssignmentsForEvent(eventId: string) {
  return mockData.contractorAssignments.filter((assignment) => assignment.eventId === eventId);
}

export function getVendorAssignmentsForEvent(eventId: string) {
  return mockData.vendorAssignments.filter((assignment) => assignment.eventId === eventId);
}

export function getAnalyticsForEvent(eventId: string) {
  return mockData.analyticsEvents.filter((event) => event.eventId === eventId);
}

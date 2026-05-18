import type { EventMagicLink, ProductionInboxItem } from "@/types/eventIntake";

export const mockEventMagicLinks: EventMagicLink[] = [
  {
    id: "magic-speaker-nova",
    eventId: "event-summit",
    eventCode: "NOVA-2026-SUMMIT",
    role: "speaker",
    label: "Speaker upload link",
    url: "/submit/NOVA-2026-SUMMIT/speaker",
    status: "active",
  },
  {
    id: "magic-sponsor-nova",
    eventId: "event-summit",
    eventCode: "NOVA-2026-SUMMIT",
    role: "sponsor",
    label: "Sponsor setup link",
    url: "/submit/NOVA-2026-SUMMIT/sponsor",
    status: "active",
  },
];

export const mockProductionInboxItems: ProductionInboxItem[] = [
  {
    id: "inbox-speaker-email-deck",
    agencyId: "agency-wpp",
    clientId: "client-nova",
    eventId: "event-summit",
    eventCode: "NOVA-2026-SUMMIT",
    sourceChannel: "email_attachment",
    status: "needs_matching",
    senderName: "Drake Speaker",
    senderEmail: "drake@example.com",
    subject: "[NOVA-2026-SUMMIT] Speaker deck final-final",
    summary: "Speaker emailed a revised deck attachment. Needs matching to Drake Speaker and keynote segment.",
    possibleMatchType: "speaker",
    possibleMatchId: "speaker-drake",
    receivedAt: "2026-06-12T14:38:00.000Z",
    nextAction: "Match attachment to speaker deck v3 and send to change control.",
  },
  {
    id: "inbox-sponsor-cta",
    agencyId: "agency-wpp",
    clientId: "client-nova",
    eventId: "event-summit",
    eventCode: "NOVA-2026-SUMMIT",
    sourceChannel: "portal_upload",
    status: "needs_review",
    senderName: "Riley Sponsor",
    senderEmail: "riley@example.com",
    subject: "Updated booth CTA",
    summary: "Sponsor submitted a new CTA URL and offer copy through sponsor setup.",
    possibleMatchType: "sponsor",
    possibleMatchId: "sponsor-clarity",
    receivedAt: "2026-06-10T16:00:00.000Z",
    nextAction: "Review sponsor CTA and mark whether client approval is required.",
  },
];

export function getMagicLinksForEvent(eventId: string) {
  return mockEventMagicLinks.filter((link) => link.eventId === eventId);
}

export function getProductionInboxItems(eventId: string) {
  return mockProductionInboxItems.filter((item) => item.eventId === eventId);
}

export function getInboxSummary(eventId: string) {
  const items = getProductionInboxItems(eventId);
  return {
    eventId,
    total: items.length,
    needsMatching: items.filter((item) => item.status === "needs_matching").length,
    needsReview: items.filter((item) => item.status === "needs_review").length,
  };
}

import type { VirtualVenueBooth } from "@/types/virtualVenue";

export function findBooth(booths: VirtualVenueBooth[], boothId: string) {
  return booths.find((booth) => booth.id === boothId) ?? booths[0];
}

export function buildSponsorLeadDraft(input: {
  agencyId: string;
  eventId: string;
  boothId: string;
  name: string;
  email: string;
  company?: string;
  interest?: string;
}) {
  return {
    ...input,
    consentToShare: true,
    createdAt: new Date().toISOString(),
  };
}

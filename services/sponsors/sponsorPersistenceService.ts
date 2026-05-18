import type { SponsorPackage, SponsorReadyRoomSnapshot } from "@/types/sponsorOps";

export interface SponsorRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId: string;
  name: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  boothStatus: string;
  readyRoomStatus: string;
}

export function mapSponsorRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  name: string;
  primary_contact_name?: string | null;
  primary_contact_email?: string | null;
  booth_status: string;
  ready_room_status: string;
}): SponsorRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    name: record.name,
    primaryContactName: record.primary_contact_name ?? undefined,
    primaryContactEmail: record.primary_contact_email ?? undefined,
    boothStatus: record.booth_status,
    readyRoomStatus: record.ready_room_status,
  };
}

export function mapSponsorPackageRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  sponsor_id: string;
  tier_key: SponsorPackage["tier"];
  tier_name: string;
  price_cents?: number | null;
  status: SponsorPackage["status"];
  booth_enabled: boolean;
  session_enabled: boolean;
  ros_mentions_allowed: number;
  lead_access_level: SponsorPackage["leadAccessLevel"];
  reporting_level: SponsorPackage["reportingLevel"];
}): SponsorPackage {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? "",
    eventId: record.event_id,
    sponsorId: record.sponsor_id,
    tier: record.tier_key,
    tierName: record.tier_name,
    price: record.price_cents ? record.price_cents / 100 : undefined,
    status: record.status,
    boothEnabled: record.booth_enabled,
    sessionEnabled: record.session_enabled,
    rosMentionsAllowed: record.ros_mentions_allowed,
    leadAccessLevel: record.lead_access_level,
    reportingLevel: record.reporting_level,
    deliverables: [],
  };
}

export function buildSponsorReadyRoomReadModel(input: {
  sponsor: SponsorRecord;
}): Pick<SponsorReadyRoomSnapshot, "sponsorName" | "boothStatus"> {
  return {
    sponsorName: input.sponsor.name,
    boothStatus: input.sponsor.boothStatus as SponsorReadyRoomSnapshot["boothStatus"],
  };
}

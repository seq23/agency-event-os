import type { AttendeeRecord, EventSessionRecord, ExpoBoothRecord, VenueReadModel } from "@/types/venuePersistence";

export function mapAttendeeRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  display_name: string;
  email: string;
  company?: string | null;
  title?: string | null;
  registration_status: AttendeeRecord["registrationStatus"];
  attendee_type: string;
  networking_opt_in: boolean;
}): AttendeeRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    displayName: record.display_name,
    email: record.email,
    company: record.company ?? undefined,
    title: record.title ?? undefined,
    registrationStatus: record.registration_status,
    attendeeType: record.attendee_type,
    networkingOptIn: record.networking_opt_in,
  };
}

export function mapEventSessionRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  video_room_id?: string | null;
  title: string;
  description?: string | null;
  session_type: string;
  starts_at?: string | null;
  ends_at?: string | null;
  visibility: EventSessionRecord["visibility"];
  status: EventSessionRecord["status"];
  sort_order: number;
}): EventSessionRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    videoRoomId: record.video_room_id ?? undefined,
    title: record.title,
    description: record.description ?? undefined,
    sessionType: record.session_type,
    startsAt: record.starts_at ?? undefined,
    endsAt: record.ends_at ?? undefined,
    visibility: record.visibility,
    status: record.status,
    sortOrder: record.sort_order,
  };
}

export function mapExpoBoothRecord(record: {
  id: string;
  agency_id: string;
  client_id?: string | null;
  event_id: string;
  sponsor_id?: string | null;
  video_room_id?: string | null;
  name: string;
  headline?: string | null;
  description?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  sort_order: number;
  status: ExpoBoothRecord["status"];
}): ExpoBoothRecord {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id ?? undefined,
    eventId: record.event_id,
    sponsorId: record.sponsor_id ?? undefined,
    videoRoomId: record.video_room_id ?? undefined,
    name: record.name,
    headline: record.headline ?? undefined,
    description: record.description ?? undefined,
    ctaLabel: record.cta_label ?? undefined,
    ctaUrl: record.cta_url ?? undefined,
    sortOrder: record.sort_order,
    status: record.status,
  };
}

export function buildVenueReadModel(input: {
  eventId: string;
  attendees: AttendeeRecord[];
  sessions: EventSessionRecord[];
  expoBooths: ExpoBoothRecord[];
  replayCount?: number;
  qAndACount?: number;
  pollCount?: number;
}): VenueReadModel {
  return {
    eventId: input.eventId,
    attendees: input.attendees,
    sessions: [...input.sessions].sort((a, b) => a.sortOrder - b.sortOrder),
    expoBooths: [...input.expoBooths].sort((a, b) => a.sortOrder - b.sortOrder),
    replayCount: input.replayCount ?? 0,
    qAndACount: input.qAndACount ?? 0,
    pollCount: input.pollCount ?? 0,
  };
}

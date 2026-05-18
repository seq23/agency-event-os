import type { Agency, Client, Event } from "@/types/core";
import type { DbAgencyRecord, DbClientRecord, DbEventRecord } from "@/types/persistence";

export function mapAgencyRecord(record: DbAgencyRecord): Agency {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    ownerUserId: record.owner_user_id ?? "",
    status: record.status === "deleted" ? "archived" : record.status,
  };
}

export function mapClientRecord(record: DbClientRecord): Client {
  return {
    id: record.id,
    agencyId: record.agency_id,
    name: record.name,
    slug: record.slug,
    industry: record.industry ?? "",
    status: record.status === "deleted" ? "archived" : record.status,
    primaryContactName: record.primary_contact_name ?? "",
    primaryContactEmail: record.primary_contact_email ?? "",
    logoUrl: record.logo_url ?? undefined,
  };
}

export function mapEventRecord(record: DbEventRecord): Event {
  return {
    id: record.id,
    agencyId: record.agency_id,
    clientId: record.client_id,
    name: record.name,
    slug: record.slug,
    eventType: record.event_type as Event["eventType"],
    status: record.status as Event["status"],
    startAt: record.start_at ?? "",
    endAt: record.end_at ?? "",
    timezone: record.timezone,
    description: record.description ?? "",
    internalGoal: record.internal_goal ?? "",
    clientFacingGoal: record.client_facing_goal ?? "",
    primaryProducerUserId: record.primary_producer_user_id ?? "",
    projectManagerUserId: record.project_manager_user_id ?? "",
    registrationEnabled: Boolean(record.registration_enabled),
    venueEnabled: Boolean(record.venue_enabled),
    replayEnabled: Boolean(record.replay_enabled),
    reportingEnabled: Boolean(record.reporting_enabled),
  };
}

import type { ID, EventStatus, EventType } from "@/types/core";

export interface DbAgencyRecord {
  id: ID;
  name: string;
  slug: string;
  legal_name?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  owner_user_id?: ID | null;
  status: "active" | "paused" | "archived" | "deleted";
  created_at?: string;
  updated_at?: string;
}

export interface DbClientRecord {
  id: ID;
  agency_id: ID;
  name: string;
  slug: string;
  industry?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  primary_contact_name?: string | null;
  primary_contact_email?: string | null;
  status: "active" | "prospect" | "paused" | "archived" | "deleted";
  internal_notes?: string | null;
  created_by_user_id?: ID | null;
  updated_by_user_id?: ID | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbEventRecord {
  id: ID;
  agency_id: ID;
  client_id: ID;
  name: string;
  slug: string;
  event_type: EventType | string;
  status: EventStatus | string;
  start_at?: string | null;
  end_at?: string | null;
  timezone: string;
  description?: string | null;
  internal_goal?: string | null;
  client_facing_goal?: string | null;
  primary_producer_user_id?: ID | null;
  project_manager_user_id?: ID | null;
  registration_enabled: boolean;
  venue_enabled: boolean;
  replay_enabled: boolean;
  reporting_enabled: boolean;
  created_by_user_id?: ID | null;
  updated_by_user_id?: ID | null;
  created_at?: string;
  updated_at?: string;
}

export interface AgencyDashboardRecordSet {
  agencies: DbAgencyRecord[];
  clients: DbClientRecord[];
  events: DbEventRecord[];
}

export interface PersistenceResult<T> {
  data?: T;
  error?: string;
}

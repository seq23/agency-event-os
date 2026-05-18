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


export interface DbApprovalRequestRecord {
  id: ID;
  agency_id: ID;
  client_id: ID;
  event_id: ID;
  approval_type: string;
  title: string;
  description?: string | null;
  status: string;
  resource_type: string;
  resource_id?: ID | null;
  requested_by_user_id?: ID | null;
  assigned_to_user_id?: ID | null;
  assigned_role?: string | null;
  due_at?: string | null;
  client_visible: boolean;
  locked: boolean;
  approved_at?: string | null;
  approved_by_user_id?: ID | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbAssetRecord {
  id: ID;
  agency_id: ID;
  client_id?: ID | null;
  event_id?: ID | null;
  owner_user_id?: ID | null;
  asset_type: string;
  name: string;
  description?: string | null;
  file_url?: string | null;
  external_url?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | null;
  status: string;
  visibility: string;
  current_version_id?: ID | null;
  usage_rights?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbProductionInboxItemRecord {
  id: ID;
  agency_id: ID;
  client_id?: ID | null;
  event_id?: ID | null;
  event_code: string;
  source_channel: string;
  status: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  summary?: string | null;
  possible_match_type?: string | null;
  possible_match_id?: ID | null;
  linked_resource_type?: string | null;
  linked_resource_id?: ID | null;
  next_action?: string | null;
  received_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbLastMinuteChangeRequestRecord {
  id: ID;
  agency_id: ID;
  client_id: ID;
  event_id: ID;
  speaker_id?: ID | null;
  sponsor_id?: ID | null;
  run_of_show_segment_id?: ID | null;
  change_type: string;
  urgency: string;
  risk: string;
  status: string;
  title: string;
  old_version_label?: string | null;
  new_version_label?: string | null;
  diff_summary?: string | null;
  affects_timing: boolean;
  affects_sponsor_mention: boolean;
  affects_client_approved_copy: boolean;
  minutes_until_segment: number;
  recommended_action?: string | null;
  submitted_by_user_id?: ID | null;
  decided_by_user_id?: ID | null;
  submitted_at: string;
  decided_at?: string | null;
  pushed_to_live_at?: string | null;
  rolled_back_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

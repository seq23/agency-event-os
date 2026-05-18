-- Agency Event OS initial schema draft
-- Purpose: Supabase/Postgres foundation for multi-client agency event production.
-- Status: draft migration; review before production use.

create extension if not exists "pgcrypto";

create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  legal_name text,
  website_url text,
  logo_url text,
  primary_color text,
  owner_user_id uuid,
  status text not null default 'active' check (status in ('active', 'paused', 'archived', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.profiles (
  id uuid primary key,
  email text not null unique,
  full_name text not null,
  avatar_url text,
  timezone text,
  status text not null default 'active' check (status in ('active', 'invited', 'disabled', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agency_members (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  status text not null default 'active' check (status in ('invited', 'active', 'disabled', 'removed')),
  invited_by_user_id uuid references public.profiles(id),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agency_id, user_id)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  name text not null,
  slug text not null,
  industry text,
  website_url text,
  logo_url text,
  primary_contact_name text,
  primary_contact_email text,
  status text not null default 'active' check (status in ('active', 'prospect', 'paused', 'archived', 'deleted')),
  internal_notes text,
  created_by_user_id uuid references public.profiles(id),
  updated_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (agency_id, slug)
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  user_id uuid references public.profiles(id),
  name text not null,
  email text not null,
  phone text,
  title text,
  role text not null default 'client_reviewer',
  is_primary boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  slug text not null,
  event_type text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'registration_open', 'pre_event', 'live', 'ended', 'replay_available', 'archived')),
  start_at timestamptz,
  end_at timestamptz,
  timezone text not null default 'America/Chicago',
  description text,
  internal_goal text,
  client_facing_goal text,
  primary_producer_user_id uuid references public.profiles(id),
  project_manager_user_id uuid references public.profiles(id),
  registration_enabled boolean not null default false,
  venue_enabled boolean not null default true,
  replay_enabled boolean not null default true,
  reporting_enabled boolean not null default true,
  created_by_user_id uuid references public.profiles(id),
  updated_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (agency_id, slug)
);

create table if not exists public.event_milestones (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'not_started',
  due_at timestamptz,
  completed_at timestamptz,
  completed_by_user_id uuid references public.profiles(id),
  client_visible boolean not null default false,
  sort_order integer not null default 0,
  created_by_user_id uuid references public.profiles(id),
  updated_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.event_tasks (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  milestone_id uuid references public.event_milestones(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'not_started',
  priority text not null default 'normal',
  assigned_to_user_id uuid references public.profiles(id),
  assigned_role text,
  due_at timestamptz,
  completed_at timestamptz,
  completed_by_user_id uuid references public.profiles(id),
  client_visible boolean not null default false,
  internal_notes text,
  client_facing_notes text,
  linked_resource_type text,
  linked_resource_id uuid,
  created_by_user_id uuid references public.profiles(id),
  updated_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.run_of_show_segments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  segment_title text not null,
  public_title text,
  start_at timestamptz,
  end_at timestamptz,
  duration_minutes integer,
  room text,
  speaker_id uuid,
  sponsor_id uuid,
  responsible_user_id uuid references public.profiles(id),
  producer_notes text,
  technical_cues text,
  client_facing_description text,
  backup_plan text,
  poll_cue text,
  q_and_a_cue text,
  sponsor_mention text,
  readiness_status text not null default 'not_started',
  approval_status text not null default 'draft',
  client_visible boolean not null default false,
  locked boolean not null default false,
  sort_order integer not null default 0,
  created_by_user_id uuid references public.profiles(id),
  updated_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  owner_user_id uuid references public.profiles(id),
  asset_type text not null,
  name text not null,
  description text,
  file_url text,
  external_url text,
  mime_type text,
  file_size_bytes bigint,
  status text not null default 'draft',
  visibility text not null default 'internal_agency',
  current_version_id uuid,
  usage_rights text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  approval_type text not null,
  title text not null,
  description text,
  status text not null default 'draft',
  resource_type text not null,
  resource_id uuid,
  requested_by_user_id uuid references public.profiles(id),
  assigned_to_user_id uuid references public.profiles(id),
  assigned_role text,
  due_at timestamptz,
  client_visible boolean not null default true,
  locked boolean not null default false,
  approved_at timestamptz,
  approved_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.approval_comments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  approval_request_id uuid not null references public.approval_requests(id) on delete cascade,
  author_user_id uuid references public.profiles(id),
  body text not null,
  visibility text not null default 'client_facing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.contractors (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid references public.profiles(id),
  name text not null,
  email text not null,
  timezone text,
  primary_role text,
  skills text[] not null default '{}',
  rate_type text,
  rate_amount numeric,
  status text not null default 'active',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.contractor_assignments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  contractor_id uuid not null references public.contractors(id) on delete cascade,
  user_id uuid references public.profiles(id),
  role text not null,
  status text not null default 'invited',
  call_time_at timestamptz,
  end_time_at timestamptz,
  assigned_by_user_id uuid references public.profiles(id),
  assignment_notes text,
  shared_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  name text not null,
  service_category text,
  website_url text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  status text not null default 'active',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.vendor_assignments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  service_category text,
  status text not null default 'requested',
  assigned_by_user_id uuid references public.profiles(id),
  due_at timestamptz,
  internal_notes text,
  shared_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.speaker_profiles (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id),
  name text not null,
  title text,
  company text,
  email text not null,
  bio text,
  readiness_status text not null default 'invited',
  tech_check_status text not null default 'not_scheduled',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  website_url text,
  tier text,
  status text not null default 'prospect',
  primary_contact_name text,
  primary_contact_email text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.sponsor_booths (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  name text not null,
  description text,
  logo_asset_id uuid references public.assets(id),
  cta_label text,
  cta_url text,
  offer_text text,
  video_url text,
  status text not null default 'draft',
  lead_routing_email text,
  approval_status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_rooms (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  room_type text not null,
  resource_type text,
  resource_id uuid,
  provider text not null default 'mock',
  provider_room_id text,
  name text not null,
  status text not null default 'scheduled',
  starts_at timestamptz,
  ends_at timestamptz,
  recording_enabled boolean not null default false,
  created_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id),
  attendee_id uuid,
  event_name text not null,
  resource_type text,
  resource_id uuid,
  metadata_json jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  actor_user_id uuid references public.profiles(id),
  actor_role text,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  previous_value_json jsonb,
  new_value_json jsonb,
  visibility text not null default 'internal_agency',
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id),
  notification_type text not null,
  title text not null,
  body text,
  resource_type text,
  resource_id uuid,
  status text not null default 'unread',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  scope_type text not null,
  scope_id uuid,
  agency_id uuid references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  assigned_by_user_id uuid references public.profiles(id),
  status text not null default 'active',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clients_agency on public.clients(agency_id);
create index if not exists idx_events_agency_client on public.events(agency_id, client_id);
create index if not exists idx_events_status_start on public.events(status, start_at);
create index if not exists idx_tasks_event_status_due on public.event_tasks(event_id, status, due_at);
create index if not exists idx_ros_event_sort on public.run_of_show_segments(event_id, sort_order, start_at);
create index if not exists idx_approvals_event_status on public.approval_requests(event_id, status);
create index if not exists idx_assets_event_status on public.assets(event_id, status);
create index if not exists idx_audit_agency_event_created on public.audit_logs(agency_id, event_id, created_at);
create index if not exists idx_analytics_event_name_time on public.analytics_events(event_id, event_name, occurred_at);
create index if not exists idx_role_assignments_user_scope on public.role_assignments(user_id, scope_type, scope_id);

-- RLS should be enabled after policies are fully reviewed.
-- alter table public.agencies enable row level security;
-- alter table public.clients enable row level security;
-- alter table public.events enable row level security;
-- alter table public.event_tasks enable row level security;
-- alter table public.approval_requests enable row level security;
-- alter table public.audit_logs enable row level security;

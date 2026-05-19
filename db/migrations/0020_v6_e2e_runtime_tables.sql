-- V6 end-to-end runtime persistence additions.
-- These tables support event setup, support, email, registration, room fallback state, and run-of-show runtime events.

create table if not exists public.v6_room_fallback_states (
  event_id text not null,
  room_type text not null,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (event_id, room_type)
);

create table if not exists public.v6_incident_events (
  id text primary key,
  event_id text not null,
  title text not null,
  severity text not null check (severity in ('low','medium','high','critical')),
  status text not null check (status in ('open','monitoring','resolved')),
  owner_role text not null,
  details text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.v6_support_requests (
  id text primary key,
  event_id text not null,
  attendee_id text,
  subject text not null,
  status text not null check (status in ('open','triaged','resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.v6_email_events (
  id text primary key,
  event_id text not null,
  template_key text not null,
  recipient_segment text not null,
  status text not null check (status in ('queued','sent','blocked','failed')),
  provider_message_id text,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.v6_registration_events (
  id text primary key,
  event_id text not null,
  attendee_email_hash text not null,
  status text not null check (status in ('submitted','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.v6_run_of_show_runtime_events (
  id text primary key,
  event_id text not null,
  segment_id text not null,
  action text not null check (action in ('mark_ready','mark_live','mark_complete','skip','delay','note')),
  actor_role text not null,
  created_at timestamptz not null default now()
);

create index if not exists v6_incident_events_event_status_idx on public.v6_incident_events(event_id, status, created_at desc);
create index if not exists v6_support_requests_event_status_idx on public.v6_support_requests(event_id, status, created_at desc);
create index if not exists v6_email_events_event_template_idx on public.v6_email_events(event_id, template_key, created_at desc);
create index if not exists v6_registration_events_event_idx on public.v6_registration_events(event_id, created_at desc);
create index if not exists v6_run_of_show_runtime_events_event_idx on public.v6_run_of_show_runtime_events(event_id, segment_id, created_at desc);

alter table public.v6_room_fallback_states enable row level security;
alter table public.v6_incident_events enable row level security;
alter table public.v6_support_requests enable row level security;
alter table public.v6_email_events enable row level security;
alter table public.v6_registration_events enable row level security;
alter table public.v6_run_of_show_runtime_events enable row level security;

do $$ begin
  create policy v6_room_fallback_states_service_role_all on public.v6_room_fallback_states for all to service_role using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy v6_incident_events_service_role_all on public.v6_incident_events for all to service_role using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy v6_support_requests_service_role_all on public.v6_support_requests for all to service_role using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy v6_email_events_service_role_all on public.v6_email_events for all to service_role using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy v6_registration_events_service_role_all on public.v6_registration_events for all to service_role using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy v6_run_of_show_runtime_events_service_role_all on public.v6_run_of_show_runtime_events for all to service_role using (true) with check (true);
exception when duplicate_object then null; end $$;

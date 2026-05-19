-- V5 access/security/runtime boundary repair.
-- Forward-only migration. Do not edit older migrations.
-- Namespaced v5 tables avoid collision with existing public.analytics_events/audit_logs schemas.

create table if not exists public.v5_access_attempt_events (
  id text primary key,
  event_id text,
  access_kind text not null check (access_kind in ('attendee','crew','special_guest')),
  role text,
  status text not null check (status in ('access_attempted','access_granted','access_denied','access_expired','access_revoked')),
  route text,
  reason text,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

create index if not exists v5_access_attempt_events_event_id_created_idx
  on public.v5_access_attempt_events(event_id, created_at desc);

create table if not exists public.v5_runtime_fallback_events (
  id text primary key,
  event_id text not null,
  room_id text not null,
  room_type text not null,
  provider text not null check (provider in ('livekit','daily','zoom','google_meet')),
  action text not null check (action in ('auto_switch','manual_switch','rollback','health_check')),
  actor_role text,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists v5_runtime_fallback_events_room_created_idx
  on public.v5_runtime_fallback_events(event_id, room_id, created_at desc);

create table if not exists public.v5_analytics_events (
  id text primary key,
  event_id text not null,
  kind text not null,
  subject_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists v5_analytics_events_event_kind_created_idx
  on public.v5_analytics_events(event_id, kind, created_at desc);

alter table public.v5_access_attempt_events enable row level security;
alter table public.v5_runtime_fallback_events enable row level security;
alter table public.v5_analytics_events enable row level security;

-- Service role is the server-side runtime writer. Client/browser writes are intentionally not allowed.
do $$ begin
  create policy v5_access_attempt_events_service_role_all
    on public.v5_access_attempt_events for all to service_role
    using (true) with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy v5_runtime_fallback_events_service_role_all
    on public.v5_runtime_fallback_events for all to service_role
    using (true) with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy v5_analytics_events_service_role_all
    on public.v5_analytics_events for all to service_role
    using (true) with check (true);
exception when duplicate_object then null; end $$;

-- 0007_livekit_provider_runtime.sql
-- LiveKit runtime metadata. Secrets are not stored here.

create table if not exists public.video_provider_configs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  provider text not null default 'livekit',
  display_name text not null default 'LiveKit',
  is_primary boolean not null default true,
  is_enabled boolean not null default true,
  config_status text not null default 'env_configured',
  public_config jsonb not null default '{}'::jsonb,
  secret_storage_note text not null default 'Secrets must live in server env vars, not the database.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_token_audit_logs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  room_id uuid references public.video_rooms(id) on delete set null,
  provider text not null default 'livekit',
  participant_identity text not null,
  participant_role text not null,
  token_expires_at timestamptz not null,
  issued_at timestamptz not null default now()
);

alter table public.video_provider_configs enable row level security;
alter table public.video_token_audit_logs enable row level security;

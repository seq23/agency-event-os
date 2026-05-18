-- 0003_storage_assets_stakeholders.sql
-- Storage, asset metadata, speaker persistence, sponsor persistence.

create table if not exists public.asset_records (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  speaker_id uuid,
  sponsor_id uuid,
  asset_type text not null,
  source_channel text not null default 'portal_upload',
  bucket_name text not null,
  storage_path text not null,
  file_name text not null,
  file_size_bytes bigint not null default 0,
  mime_type text not null,
  version_number integer not null default 1,
  status text not null default 'uploaded',
  review_status text not null default 'needs_review',
  is_locked boolean not null default false,
  is_live_version boolean not null default false,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.speakers (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  email text not null,
  title text,
  organization text,
  bio text,
  headshot_asset_id uuid references public.asset_records(id) on delete set null,
  readiness_status text not null default 'not_invited',
  call_time_at timestamptz,
  segment_starts_at timestamptz,
  tech_check_status text not null default 'not_started',
  producer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'asset_records_speaker_fk'
  ) then
    alter table public.asset_records
      add constraint asset_records_speaker_fk
      foreign key (speaker_id) references public.speakers(id) on delete set null;
  end if;
end $$;

create table if not exists public.speaker_scripts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  speaker_id uuid not null references public.speakers(id) on delete cascade,
  run_of_show_segment_id uuid,
  title text not null,
  script_text text not null,
  talking_points jsonb not null default '[]'::jsonb,
  version_number integer not null default 1,
  status text not null default 'draft',
  is_live_version boolean not null default false,
  rollback_available boolean not null default true,
  approved_by_profile_id uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  primary_contact_name text,
  primary_contact_email text,
  booth_headline text,
  booth_description text,
  cta_label text,
  cta_url text,
  lead_routing_email text,
  booth_status text not null default 'draft',
  ready_room_status text not null default 'not_ready',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sponsors add column if not exists booth_headline text;
alter table public.sponsors add column if not exists booth_description text;
alter table public.sponsors add column if not exists cta_label text;
alter table public.sponsors add column if not exists cta_url text;
alter table public.sponsors add column if not exists lead_routing_email text;
alter table public.sponsors add column if not exists booth_status text not null default 'draft';
alter table public.sponsors add column if not exists ready_room_status text not null default 'not_ready';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'asset_records_sponsor_fk'
  ) then
    alter table public.asset_records
      add constraint asset_records_sponsor_fk
      foreign key (sponsor_id) references public.sponsors(id) on delete set null;
  end if;
end $$;

create table if not exists public.sponsor_packages (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  tier_name text not null,
  tier_key text not null default 'custom',
  price_cents integer,
  status text not null default 'draft',
  booth_enabled boolean not null default true,
  session_enabled boolean not null default false,
  ros_mentions_allowed integer not null default 0,
  lead_access_level text not null default 'aggregate',
  reporting_level text not null default 'basic',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsor_deliverables (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  package_id uuid references public.sponsor_packages(id) on delete cascade,
  label text not null,
  deliverable_type text not null,
  status text not null default 'requested',
  due_at timestamptz,
  client_approval_required boolean not null default false,
  asset_record_id uuid references public.asset_records(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsor_representatives (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  name text not null,
  email text not null,
  role_title text,
  readiness_status text not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.asset_records enable row level security;
alter table public.speakers enable row level security;
alter table public.speaker_scripts enable row level security;
alter table public.sponsors enable row level security;
alter table public.sponsor_packages enable row level security;
alter table public.sponsor_deliverables enable row level security;
alter table public.sponsor_representatives enable row level security;

-- Investor briefing tracking — schema for per-investor URLs and activity events.
-- Tables are isolated from existing app data; service-role access only via Edge Functions.

create table if not exists public.investor_invites (
  id            uuid primary key default gen_random_uuid(),
  token         text unique not null,
  full_name     text not null,
  first_name    text not null,           -- lowercase; used for password match
  organization  text,
  email         text,
  notes         text,
  created_at    timestamptz default now(),
  active        boolean default true
);

create table if not exists public.investor_events (
  id            uuid primary key default gen_random_uuid(),
  token         text references public.investor_invites(token) on delete cascade,
  event_type    text not null,
  metadata      jsonb,
  ip_hash       text,
  user_agent    text,
  occurred_at   timestamptz default now()
);

create index if not exists idx_events_token     on public.investor_events(token);
create index if not exists idx_events_occurred  on public.investor_events(occurred_at desc);
create index if not exists idx_events_type      on public.investor_events(event_type);

-- Lock tables. All access goes through Edge Functions using service role key.
alter table public.investor_invites enable row level security;
alter table public.investor_events  enable row level security;

-- Explicitly deny anon + authenticated access (service_role bypasses RLS).
revoke all on public.investor_invites from anon, authenticated;
revoke all on public.investor_events  from anon, authenticated;

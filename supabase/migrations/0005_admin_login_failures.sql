-- Wrong admin passwords, one row each, so the login can slow down guessing.
-- The admin password now opens the Sales CRM (prices, deal notes) as well as investor analytics.
-- Only a daily-salted hash of the IP is kept, never the IP itself.

create table if not exists public.admin_login_failures (
  id      bigint generated always as identity primary key,
  ip_hash text,
  at      timestamptz not null default now()
);

create index if not exists idx_admin_login_failures on public.admin_login_failures(ip_hash, at desc);

alter table public.admin_login_failures enable row level security;
revoke all on public.admin_login_failures from anon, authenticated;

-- Mtskheta test day (2026-11-16): the working tool for MediMind representatives at medimind.md/admin/testday.
-- Staff names, WebMed logins and test-seat passwords live ONLY here, reached through the gated `testday` route
-- (its own password, its own token key). No anon / authenticated access, like every landing table.

create table if not exists public.testday_departments (
  slug       text primary key,
  title      text not null,
  sort       int  not null default 0,
  warn       text,                                -- note shown on top of the department (no roster, etc.)
  seat_note  text,                                -- where the test seat does not match the department
  seats      text[] not null default '{}',        -- testday_seats.email, in display order
  flows      jsonb not null default '[]',         -- [{ w, steps: [], result }]
  teach      jsonb not null default '[]'          -- [{ h, t }]
);

create table if not exists public.testday_users (
  id           int primary key,                   -- WebMed staff code
  dept_slug    text not null references public.testday_departments(slug),
  name         text not null,
  title        text,
  logins       text,                              -- WebMed user names, comma separated
  how          text,
  roles        text,                              -- Georgian role names
  first_screen text,
  spot         jsonb not null default '[]',
  seat_ok      boolean not null default true,
  sort         int not null default 0
);

create table if not exists public.testday_user_checks (
  user_id       int primary key references public.testday_users(id) on delete cascade,
  signed_in     boolean not null default false,
  key_screen_ok boolean not null default false,
  actions_ok    boolean not null default false,
  note          text,
  checked_by    text,
  checked_at    timestamptz not null default now()
);

create table if not exists public.testday_flow_checks (
  dept_slug  text not null references public.testday_departments(slug),
  flow_idx   int  not null,
  done       boolean not null default false,
  note       text,
  checked_by text,
  checked_at timestamptz not null default now(),
  primary key (dept_slug, flow_idx)
);

create table if not exists public.testday_issues (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  dept_slug   text references public.testday_departments(slug),
  person      text,
  screen      text,
  what        text not null,
  expected    text,
  pr_url      text,
  status      text not null default 'open' check (status in ('open', 'pr', 'fixed', 'wontfix')),
  reported_by text,
  updated_at  timestamptz not null default now()
);

create table if not exists public.testday_seats (
  email    text primary key,
  role     text,
  password text
);

create table if not exists public.testday_notes (
  dept_slug  text primary key references public.testday_departments(slug),
  handin     jsonb not null default '{}',
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.testday_login_failures (
  id      bigint generated always as identity primary key,
  ip_hash text,
  at      timestamptz not null default now()
);
create index if not exists idx_testday_login_failures on public.testday_login_failures(ip_hash, at desc);

do $$
declare t text;
begin
  foreach t in array array['testday_departments','testday_users','testday_user_checks','testday_flow_checks',
                           'testday_issues','testday_seats','testday_notes','testday_login_failures'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- "Could not sign in" is its own mark, not just an empty box.
alter table public.testday_user_checks add column if not exists sign_in_failed boolean not null default false;

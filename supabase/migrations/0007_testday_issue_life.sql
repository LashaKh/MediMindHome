-- Test-day issues get a life: open → in work → fixed, please re-check → confirmed (closed) / still broken (back to
-- open) → or answered (training or a decision, with the answer). Additive only: every existing row stays as it is
-- and the old statuses (pr, wontfix) stay valid, so the page that is live now keeps working.
-- Rollback: supabase/migrations/rollback/0007_testday_issue_life.down.sql

alter table public.testday_issues add column if not exists user_id      bigint;   -- testday_users.id when it came from a person card
alter table public.testday_issues add column if not exists flow_idx     int;      -- the department action it is about
alter table public.testday_issues add column if not exists answer       text;     -- our plain Georgian answer: what changed, what to try
alter table public.testday_issues add column if not exists recheck_note text;     -- the tester's line when it is still broken
alter table public.testday_issues add column if not exists source       text;     -- where it came from: note:user:<id> | handin:<dept>:<field>
alter table public.testday_issues add column if not exists ref          text;     -- seed key (feedback register row), keeps re-seeding idempotent
alter table public.testday_issues add column if not exists fixed_at     timestamptz;
alter table public.testday_issues add column if not exists closed_at    timestamptz;

create unique index if not exists uq_testday_issues_ref on public.testday_issues(ref) where ref is not null;
create index if not exists idx_testday_issues_user on public.testday_issues(user_id) where user_id is not null;

alter table public.testday_issues drop constraint if exists testday_issues_status_check;
alter table public.testday_issues add constraint testday_issues_status_check
  check (status in ('open', 'work', 'pr', 'fixed', 'closed', 'answered', 'wontfix'));

-- Undo 0007: back to the four day-1 statuses and the day-1 columns. Rows in the new states are mapped first so the
-- old check constraint can be put back (work → pr, closed/answered → fixed); their answers and re-check notes are
-- lost with the columns, so export them first if they matter:
--   select id, status, answer, recheck_note, source, ref from public.testday_issues where answer is not null or recheck_note is not null;
update public.testday_issues set status = 'pr' where status = 'work';
update public.testday_issues set status = 'fixed' where status in ('closed', 'answered');

alter table public.testday_issues drop constraint if exists testday_issues_status_check;
alter table public.testday_issues add constraint testday_issues_status_check check (status in ('open', 'pr', 'fixed', 'wontfix'));

drop index if exists public.uq_testday_issues_ref;
drop index if exists public.idx_testday_issues_user;
alter table public.testday_issues drop column if exists closed_at;
alter table public.testday_issues drop column if exists fixed_at;
alter table public.testday_issues drop column if exists ref;
alter table public.testday_issues drop column if exists source;
alter table public.testday_issues drop column if exists recheck_note;
alter table public.testday_issues drop column if exists answer;
alter table public.testday_issues drop column if exists flow_idx;
alter table public.testday_issues drop column if exists user_id;

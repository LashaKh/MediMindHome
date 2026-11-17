-- Mtskheta acceptance records are append-only. Rehearsal ticks and issues stay in their own tables.
create table public.testday_acceptance_events (
  id bigint generated always as identity primary key,
  request_id uuid not null unique,
  revision text not null,
  environment text not null check (environment in ('shadow', 'foundation')),
  build text not null,
  area text not null,
  case_id text,
  outcome text not null,
  actor text not null check (length(actor) between 1 and 100),
  trainee text,
  evidence text not null check (length(evidence) between 1 and 2000),
  issue_id bigint references public.testday_issues(id),
  basis bigint,
  created_at timestamptz not null default now(),
  check (
    (case_id is not null and basis is null and outcome in ('pass', 'fail', 'blocked', 'not_applicable')
      and (outcome <> 'pass' or nullif(btrim(trainee), '') is not null))
    or
    (case_id is null and trainee is null and issue_id is null and outcome in ('approved', 'changes_requested')
      and (outcome <> 'approved' or basis is not null))
  )
);

create index testday_acceptance_build_area
  on public.testday_acceptance_events (revision, environment, build, area, id desc);

alter table public.testday_acceptance_events enable row level security;
revoke all on public.testday_acceptance_events from public, anon, authenticated, service_role;
grant select on public.testday_acceptance_events to service_role;

create function public.testday_record_acceptance(
  p_event jsonb,
  p_cases text[]
) returns public.testday_acceptance_events
language plpgsql security definer set search_path = ''
as $$
declare
  entry public.testday_acceptance_events;
  latest_id bigint;
  completed integer;
begin
  -- Serialize decisions and evidence for the same area and build.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    concat_ws('/', p_event->>'revision', p_event->>'environment', p_event->>'build', p_event->>'area'), 0
  ));

  select * into entry
  from public.testday_acceptance_events
  where request_id = (p_event->>'request_id')::uuid;

  if found then
    if entry.revision <> p_event->>'revision' or entry.environment <> p_event->>'environment'
      or entry.build <> p_event->>'build' or entry.area <> p_event->>'area'
      or entry.case_id is distinct from p_event->>'case_id' or entry.outcome <> p_event->>'outcome'
      or entry.actor <> p_event->>'actor' or entry.trainee is distinct from p_event->>'trainee'
      or entry.evidence <> p_event->>'evidence' or entry.issue_id is distinct from (p_event->>'issue_id')::bigint
    then
      raise exception 'acceptance_request_conflict';
    end if;
    return entry;
  end if;

  if p_event->>'outcome' = 'approved' then
    select count(*), max(id) into completed, latest_id
    from (
      select distinct on (case_id) id, outcome, trainee
      from public.testday_acceptance_events
      where revision = p_event->>'revision' and environment = p_event->>'environment'
        and build = p_event->>'build' and area = p_event->>'area' and case_id = any(p_cases)
      order by case_id, id desc
    ) latest
    where (outcome = 'pass' and trainee is not null) or outcome = 'not_applicable';

    if coalesce(cardinality(p_cases), 0) = 0 or completed <> cardinality(p_cases) then
      raise exception 'acceptance_incomplete';
    end if;

    if latest_id is distinct from (p_event->>'basis')::bigint then
      raise exception 'acceptance_stale';
    end if;
  end if;

  insert into public.testday_acceptance_events (
    request_id, revision, environment, build, area, case_id, outcome, actor, trainee, evidence, issue_id, basis
  ) values (
    (p_event->>'request_id')::uuid, p_event->>'revision', p_event->>'environment', p_event->>'build',
    p_event->>'area', p_event->>'case_id', p_event->>'outcome', p_event->>'actor', p_event->>'trainee',
    p_event->>'evidence', (p_event->>'issue_id')::bigint, latest_id
  )
  returning * into entry;
  return entry;
end
$$;

revoke all on function public.testday_record_acceptance(jsonb, text[]) from public, anon, authenticated;
grant execute on function public.testday_record_acceptance(jsonb, text[]) to service_role;

-- The page shows the latest result per case plus the latest decision per area.
create function public.testday_acceptance_latest(p_revision text, p_environment text, p_build text)
returns setof public.testday_acceptance_events
language sql stable security invoker set search_path = ''
as $$
  select distinct on (area, case_id) *
  from public.testday_acceptance_events
  where revision = p_revision and environment = p_environment and build = p_build
  order by area, case_id, id desc;
$$;

revoke all on function public.testday_acceptance_latest(text, text, text) from public, anon, authenticated;
grant execute on function public.testday_acceptance_latest(text, text, text) to service_role;

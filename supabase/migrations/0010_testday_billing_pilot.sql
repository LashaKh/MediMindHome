-- One failed observation and its builder issue are committed together. Replaying a
-- request returns its original event, without reopening a subsequently resolved issue.
create or replace function public.testday_record_pilot_step(p_event jsonb, p_cases text[], p_step jsonb, p_origin text)
returns public.testday_acceptance_events
language plpgsql security definer set search_path = ''
as $$
declare
  recorded public.testday_acceptance_events;
  issue bigint := (p_event->>'issue_id')::bigint;
  source_key text := concat_ws(':', 'billing-er-v1', p_event->>'environment', p_event->>'build', p_event->>'case_id');
  prior_issue bigint;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    concat_ws('/', p_event->>'revision', p_event->>'environment', p_event->>'build', p_event->>'area'), 0));
  select * into recorded from public.testday_acceptance_events where request_id = (p_event->>'request_id')::uuid;
  if found then
    if issue is not null and recorded.issue_id is distinct from issue then raise exception 'acceptance_request_conflict'; end if;
    return public.testday_record_acceptance(p_event || jsonb_build_object('issue_id', recorded.issue_id), p_cases);
  end if;
  if issue is not null then
    if p_origin is null or p_origin = p_event->>'build' or not exists (
      select 1 from public.testday_acceptance_events
      where issue_id = issue and revision = p_event->>'revision' and area = p_event->>'area'
        and environment = p_event->>'environment' and build = p_origin and case_id = p_event->>'case_id' and outcome = 'fail'
    ) then raise exception 'acceptance_retest_source'; end if;
  else
    select e.issue_id into prior_issue from public.testday_acceptance_events e
    where e.revision = p_event->>'revision' and e.environment = p_event->>'environment'
      and e.area = p_event->>'area' and e.build = p_event->>'build' and e.case_id = p_event->>'case_id' and e.issue_id is not null
    order by e.id desc limit 1;
    issue := prior_issue;
  end if;
  if issue is null and p_event->>'outcome' = 'fail' then
    insert into public.testday_issues (dept_slug, person, screen, what, expected, source, ref, reported_by)
    values ('billing', p_step->>'role', p_step->>'title', p_event->>'evidence',
      p_step->>'expected', 'billing-er-v1', source_key, p_event->>'actor')
    returning id into issue;
  elsif issue is not null and p_event->>'outcome' in ('pass','fail') then
    update public.testday_issues set
      status = case when p_event->>'outcome' = 'pass' then 'closed' else 'open' end,
      closed_at = case when p_event->>'outcome' = 'pass' then now() else null end,
      updated_at = now(), recheck_note = (p_event->>'build') || chr(10) || (p_event->>'evidence')
    where id = issue;
  end if;
  return public.testday_record_acceptance(p_event || jsonb_build_object('issue_id', issue), p_cases);
end
$$;
revoke all on function public.testday_record_pilot_step(jsonb,text[],jsonb,text) from public, anon, authenticated;
grant execute on function public.testday_record_pilot_step(jsonb,text[],jsonb,text) to service_role;

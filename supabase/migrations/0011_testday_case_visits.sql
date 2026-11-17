-- Each build rehearses one demonstration visit and one independent staff visit.
create table if not exists public.testday_case_visits (
  revision text not null, environment text not null, build text not null,
  round int not null check (round in (1,2)), visit text not null,
  primary key(revision,environment,build,round), unique(revision,environment,build,visit)
);
alter table public.testday_case_visits enable row level security;
revoke all on public.testday_case_visits from public, anon, authenticated, service_role;

create or replace function public.testday_record_case_step(p_event jsonb, p_cases text[], p_step jsonb, p_origin text)
returns public.testday_acceptance_events
language plpgsql security definer set search_path = ''
as $$
declare
  pos int := array_position(p_cases,p_event->>'case_id');
  round_no int := case when pos > cardinality(p_cases)/2 then 2 else 1 end;
  visit_key text := lower(trim(p_step->>'visit'));
  bound text;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    concat_ws('/',p_event->>'revision',p_event->>'environment',p_event->>'build',p_event->>'area'),0));
  if p_event->>'outcome' = 'pass' and not exists (
    select 1 from public.testday_acceptance_events where request_id=(p_event->>'request_id')::uuid
  ) then
    if pos is null or coalesce(visit_key,'')='' then raise exception 'acceptance_invalid'; end if;
    if p_origin is null and exists (
      select 1 from unnest(p_cases[1:pos-1]) required(id)
      where (select outcome from public.testday_acceptance_events e
        where e.revision=p_event->>'revision' and e.environment=p_event->>'environment'
          and e.build=p_event->>'build' and e.area=p_event->>'area' and e.case_id=required.id
        order by e.id desc limit 1) is distinct from 'pass'
    ) then raise exception 'acceptance_case_order'; end if;
    select visit into bound from public.testday_case_visits
      where revision=p_event->>'revision' and environment=p_event->>'environment' and build=p_event->>'build' and round=round_no;
    if bound is null then
      begin
        insert into public.testday_case_visits(revision,environment,build,round,visit)
        values(p_event->>'revision',p_event->>'environment',p_event->>'build',round_no,visit_key);
      exception when unique_violation then raise exception 'acceptance_case_visit'; end;
    elsif bound <> visit_key then raise exception 'acceptance_case_visit'; end if;
  end if;
  return public.testday_record_pilot_step(p_event,p_cases,p_step,p_origin);
end
$$;
revoke all on function public.testday_record_case_step(jsonb,text[],jsonb,text) from public,anon,authenticated;
grant execute on function public.testday_record_case_step(jsonb,text[],jsonb,text) to service_role;

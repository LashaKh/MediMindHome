-- Test Day coordinators record an owner for each Mtskheta area.
create table public.testday_acceptance_owners (
  area text primary key,
  name text not null check (length(btrim(name)) between 1 and 100),
  recorded_by text not null check (length(btrim(recorded_by)) between 1 and 100),
  updated_at timestamptz not null default clock_timestamp()
);
alter table public.testday_acceptance_owners enable row level security;
revoke all on public.testday_acceptance_owners from public, anon, authenticated, service_role;
grant select on public.testday_acceptance_owners to service_role;

create function public.testday_assign_acceptance_owner(
  p_area text, p_name text, p_actor text, p_expected timestamptz
) returns public.testday_acceptance_owners
language plpgsql security definer set search_path = ''
as $$
declare
  owner_row public.testday_acceptance_owners;
begin
  if p_expected is null then
    insert into public.testday_acceptance_owners (area, name, recorded_by)
    values (p_area, p_name, p_actor)
    on conflict (area) do nothing
    returning * into owner_row;
  else
    update public.testday_acceptance_owners
    set name = p_name, recorded_by = p_actor, updated_at = clock_timestamp()
    where area = p_area and updated_at = p_expected
    returning * into owner_row;
  end if;

  if not found then
    raise exception 'acceptance_owner_stale';
  end if;
  return owner_row;
end
$$;
revoke all on function public.testday_assign_acceptance_owner(text, text, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.testday_assign_acceptance_owner(text, text, text, timestamptz)
  to service_role;

alter table public.testday_acceptance_events add column department_owner text;

-- Store the department owner at the time the team member records a decision.
create function public.testday_stamp_acceptance_owner() returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if new.case_id is null then
    select name into new.department_owner
    from public.testday_acceptance_owners where area = new.area;
    if new.department_owner is null then
      raise exception 'acceptance_owner_required';
    end if;
  end if;
  return new;
end
$$;
revoke all on function public.testday_stamp_acceptance_owner() from public, anon, authenticated;

create trigger testday_stamp_acceptance_owner
  before insert on public.testday_acceptance_events
  for each row execute function public.testday_stamp_acceptance_owner();

create function public.testday_record_acceptance_decision(
  p_event jsonb, p_cases text[], p_owner_updated_at timestamptz
) returns public.testday_acceptance_events
language plpgsql security definer set search_path = ''
as $$
declare
  last_owner timestamptz;
begin
  select updated_at into last_owner
  from public.testday_acceptance_owners where area = p_event->>'area' for share;
  if last_owner is null then
    raise exception 'acceptance_owner_required';
  elsif last_owner is distinct from p_owner_updated_at then
    raise exception 'acceptance_owner_stale';
  end if;
  return public.testday_record_acceptance(p_event, p_cases);
end
$$;
revoke all on function public.testday_record_acceptance_decision(jsonb, text[], timestamptz)
  from public, anon, authenticated;
grant execute on function public.testday_record_acceptance_decision(jsonb, text[], timestamptz)
  to service_role;

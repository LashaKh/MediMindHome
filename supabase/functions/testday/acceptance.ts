import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { ACCEPTANCE_AREAS, ACCEPTANCE_REVISION } from "./acceptanceCatalog.ts";
import { BILLING_ACCEPTANCE_REVISION } from "./billingAcceptance.ts";

import { PILOT_GROUP, PILOT_REVISION } from "./billingPilot.ts";
import { CASE_GROUP, CASE_REVISION, CASE_ROLES, type CaseRole } from "./caseWalkthrough.ts";
import { pilotEvidence } from "./pilotEvidence.ts";

const BUILD = /^[a-z0-9][a-z0-9._-]{6,79}$/;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const COLUMNS = "id,area,case_id,outcome,actor,trainee,evidence,issue_id,basis,department_owner,created_at";
const CASE_OUTCOMES = new Set(["pass", "fail", "blocked", "not_applicable"]);

type Reply = (body: unknown, status?: number) => Response;

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null;
}

function positiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function timestamp(value: unknown) {
  const text = clean(value, 64);
  return text && Number.isFinite(Date.parse(text)) ? text : null;
}

// All actions enter through the existing Test Day session gate in index.ts.
export async function acceptanceAction(body: Record<string, unknown>, sb: SupabaseClient, json: Reply) {
  const { action, environment } = body;

  if (action === "acceptance_owners") {
    const { data, error } = await sb.from("testday_acceptance_owners").select("area,name,recorded_by,updated_at");
    if (error) {
      console.error("testday acceptance_owners", error.code);
      return json({ error: "server" }, 500);
    }
    return json({ row: data });
  }

  if (action === "acceptance_owner") {
    const area = ACCEPTANCE_AREAS.find((item) => item.id === body.area);
    const name = clean(body.owner, 100);
    const actor = clean(body.by, 100);
    const expected = timestamp(body.owner_updated_at);
    if (!area || !name || !actor || (body.owner_updated_at !== null && !expected)) {
      return json({ error: "acceptance_invalid" }, 400);
    }
    const { data, error } = await sb.rpc("testday_assign_acceptance_owner", {
      p_area: area.id, p_name: name, p_actor: actor, p_expected: expected,
    }).select("area,name,recorded_by,updated_at").single();
    if (error) {
      if (error.message === "acceptance_owner_stale") return json({ error: error.message }, 409);
      console.error("testday acceptance_owner", error.code);
      return json({ error: "server" }, 500);
    }
    return json({ row: data });
  }
  const build = clean(body.build, 80)?.toLowerCase();
  if (!build || !BUILD.test(build) || (environment !== "shadow" && environment !== "foundation")) {
    return json({ error: "acceptance_bad_build" }, 400);
  }

  const area = ACCEPTANCE_AREAS.find((item) => item.id === body.area);
  const archive = action === "acceptance_state" && area?.id === "billing" && body.archive === true;
  const walkthrough = body.pilot === "walkthrough";
  const pilot = walkthrough || body.pilot === true;
  if (pilot && (area?.id !== "billing" || environment !== "shadow" || archive)) return json({ error: "acceptance_invalid" }, 400);
  const revision = walkthrough ? CASE_REVISION : pilot ? PILOT_REVISION : area?.id === "billing" && !archive ? BILLING_ACCEPTANCE_REVISION : ACCEPTANCE_REVISION;
  const scope = { revision, environment, build };
  if (action === "acceptance_state") {
    const before = body.before;
    if ((before != null && !positiveInt(before)) || (body.area != null && !area)) {
      return json({ error: "acceptance_invalid" }, 400);
    }
    const recent = sb.from("testday_acceptance_events").select(COLUMNS)
      .match(area ? { ...scope, area: area.id } : scope).order("id", { ascending: false }).limit(200);
    const { data, error } = await (before == null ? recent : recent.lt("id", before));
    if (error) {
      console.error("testday acceptance_state", error.code);
      return json({ error: "server" }, 500);
    }
    const next = data.length === 200 ? data.at(-1)?.id ?? null : null;
    if (before == null && next !== null) {
      // Include current results even if they are older than the initial history page.
      const latestQuery = sb.rpc("testday_acceptance_latest", {
        p_revision: scope.revision, p_environment: scope.environment, p_build: scope.build,
      });
      const { data: latest, error: latestError } = await (area ? latestQuery.eq("area", area.id) : latestQuery).select(COLUMNS);
      if (latestError) {
        console.error("testday acceptance_latest", latestError.code);
        return json({ error: "server" }, 500);
      }
      const events = new Map([...latest, ...data].map((row) => [row.id, row]));
      return json({ row: { events: [...events.values()].sort((a, b) => b.id - a.id), before: next } });
    }
    return json({ row: { events: data, before: next } });
  }

  const cases = walkthrough ? CASE_GROUP.cases : pilot ? PILOT_GROUP.cases : area?.groups?.flatMap((group) => group.cases);
  const request_id = clean(body.request_id, 36);
  const evidence = clean(body.evidence, 2000);
  if (!area || !cases?.length || !request_id || !UUID.test(request_id) || !evidence) {
    return json({ error: "acceptance_invalid" }, 400);
  }

  const event = { ...scope, area: area.id, request_id, evidence };
  const actor = clean(body.by, 100);
  if (!actor) return json({ error: "acceptance_invalid" }, 400);
  const deciding = action === "acceptance_sign";
  const ownerUpdatedAt = timestamp(body.owner_updated_at);
  let fields: Record<string, unknown>;
  if (action === "acceptance_run") {
    const test = cases.find(([id]) => id === body.case_id);
    const trainee = clean(body.trainee, 100);
    const { outcome, issue_id } = body;
    if (!test || typeof outcome !== "string" || !CASE_OUTCOMES.has(outcome)
      || (outcome === "pass" && !trainee) || (outcome === "not_applicable" && !test[5])
      || (issue_id != null && !positiveInt(issue_id))) {
      return json({ error: "acceptance_invalid" }, 400);
    }
    fields = { case_id: test[0], outcome, actor, trainee: outcome === "not_applicable" ? null : trainee, issue_id };
  } else {
    const { outcome, basis } = body;
    if ((outcome !== "approved" && outcome !== "changes_requested") || (outcome === "approved" && !positiveInt(basis))) {
      return json({ error: "acceptance_invalid" }, 400);
    }
    if (!ownerUpdatedAt) return json({ error: "acceptance_owner_required" }, 400);
    fields = { outcome, actor, basis };
  }

  let pilotStep;
  let origin = null;
  if (pilot && !deciding) {
    origin = clean(body.origin_build, 80);
    if (!clean(body.trainee, 100) || ((body.issue_id != null || body.origin_build != null)
      && (!origin || !BUILD.test(origin) || origin === build || !positiveInt(body.issue_id)))) {
      return json({ error: "acceptance_retest_source" }, 400);
    }
    const observed = pilotEvidence(body, evidence, walkthrough);
    if (!observed) return json({ error: "acceptance_invalid" }, 400);
    event.evidence = observed.evidence;
    pilotStep = { title: observed.step.title, role: walkthrough ? CASE_ROLES[observed.step.role as CaseRole].label : observed.step.role, expected: observed.step.expected, visit: body.visit };
  }
  const request = { p_event: { ...event, ...fields }, p_cases: cases.map(([id]) => id) };
  const { data, error } = await (deciding
    ? sb.rpc("testday_record_acceptance_decision", { ...request, p_owner_updated_at: ownerUpdatedAt })
    : pilotStep ? sb.rpc(walkthrough ? "testday_record_case_step" : "testday_record_pilot_step", { ...request, p_step: pilotStep, p_origin: origin })
    : sb.rpc("testday_record_acceptance", request)).select(COLUMNS).single();
  if (error) {
    if (["acceptance_case_order", "acceptance_case_visit", "acceptance_retest_source", "acceptance_incomplete", "acceptance_stale", "acceptance_request_conflict", "acceptance_owner_required", "acceptance_owner_stale"].includes(error.message)) {
      return json({ error: error.message }, 409);
    }
    if (error.code === "23503") return json({ error: "acceptance_issue" }, 400);
    console.error("testday record_acceptance", error.code);
    return json({ error: "server" }, 500);
  }
  return json({ row: data });
}

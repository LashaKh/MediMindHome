// Sales CRM API behind /admin/crm. Served through the track-event router (?route=crm).
// Admin-only: every call needs the admin JWT. One POST endpoint; `action` picks the operation.
//
// Also exports handleDemoRequest (?route=demo-request): the PUBLIC "Request demo" form ingest.
// Each request lands in the CRM as an inbound target. A honeypot field, a per-IP hourly cap and
// a global daily cap keep spam out.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders, getClientIp, hashIp } from "../_shared/cors.ts";
import { verifyAdminJwt } from "../admin-data/index.ts";
import {
  applyRules,
  cleanAccountFields,
  cleanDemoRequest,
  escapeLike,
  formatDemoRequest,
  isIsoDate,
  isUuid,
  LOG_TYPES,
  type Patch,
  tbilisiToday,
  TOUCH_TYPES,
} from "./validate.ts";

const STAGE_LABEL: Record<string, string> = {
  discovery: "Discovery",
  qualified: "Qualified",
  evaluation_agreed: "Evaluation agreed",
  evaluating: "Evaluating",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Closed won",
  lost: "Closed lost",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  waiting_on_us: "Waiting on us",
  waiting_on_it: "Waiting on hospital IT",
  stalled: "Stalled",
  on_hold: "On hold",
};
const KIND_LABEL: Record<string, string> = { target: "Targets", deal: "the pipeline", anchor: "Anchor" };

type Row = Record<string, unknown>;

function client() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}
type Db = ReturnType<typeof client>;

export async function handleCrm(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!(await verifyAdminJwt(req))) return json({ error: "unauthorized" }, 401);
  if (req.method !== "POST") return json({ error: "method" }, 405);

  let body: Row;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const db = client();
  const author = typeof body.author === "string" && body.author.trim()
    ? body.author.trim().slice(0, 60)
    : null;

  try {
    switch (body.action) {
      case "list":
        return await list(db);
      case "activities":
        return await activities(db, body);
      case "create":
        return await create(db, body, author);
      case "update":
        return await update(db, body, author);
      case "log":
        return await logActivity(db, body, author);
      case "delete_activity":
        return await deleteActivity(db, body);
      case "archive":
        return await setArchived(db, body, author, true);
      case "restore":
        return await setArchived(db, body, author, false);
      default:
        return json({ error: "unknown_action" }, 400);
    }
  } catch (err) {
    console.error("crm error:", err);
    return json({ error: "server" }, 500);
  }
}

async function list(db: Db): Promise<Response> {
  const { data: accounts, error } = await db
    .from("crm_accounts")
    .select("*")
    .eq("archived", false)
    .order("updated_at", { ascending: false });
  if (error) throw error;

  const { data: recent, error: recentErr } = await db
    .from("crm_activities")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(60);
  if (recentErr) throw recentErr;

  const since = new Date(Date.now() - 30 * 86400_000).toISOString();
  const { data: inbound, error: inboundErr } = await db
    .from("crm_activities")
    .select("id, account_id, body, occurred_at")
    .eq("type", "inbound")
    .gte("occurred_at", since)
    .order("occurred_at", { ascending: false })
    .limit(100);
  if (inboundErr) throw inboundErr;

  return json({ accounts, activities: recent, inbound, today: tbilisiToday() }, 200);
}

async function activities(db: Db, body: Row): Promise<Response> {
  if (!isUuid(body.account_id)) return json({ error: "account_id required" }, 400);
  const { data, error } = await db
    .from("crm_activities")
    .select("*")
    .eq("account_id", body.account_id)
    .order("occurred_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return json({ activities: data }, 200);
}

async function create(db: Db, body: Row, author: string | null): Promise<Response> {
  const { patch, errors } = cleanAccountFields(body.fields);
  if (!patch.name && !errors.includes("name is required")) errors.push("name is required");
  if (errors.length) return json({ error: "invalid", details: errors }, 400);

  const row = applyRules(null, { kind: "target", ...patch }, tbilisiToday());
  row.updated_at = new Date().toISOString();

  const { data: account, error } = await db.from("crm_accounts").insert(row).select().single();
  if (error) throw error;

  await db.from("crm_activities").insert({
    account_id: account.id,
    type: "created",
    body: `New in ${KIND_LABEL[account.kind as string] ?? "the CRM"}`,
    author,
  });
  return json({ ok: true, account }, 200);
}

async function update(db: Db, body: Row, author: string | null): Promise<Response> {
  if (!isUuid(body.id)) return json({ error: "id required" }, 400);
  if (typeof body.expected_updated_at !== "string") {
    return json({ error: "expected_updated_at required" }, 400);
  }
  const { patch, errors } = cleanAccountFields(body.fields);
  if (errors.length) return json({ error: "invalid", details: errors }, 400);

  const { data: current, error: readErr } = await db
    .from("crm_accounts")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();
  if (readErr) throw readErr;
  if (!current) return json({ error: "not_found" }, 404);
  // Someone else saved since this person opened the record: never overwrite their work silently.
  if (current.updated_at !== body.expected_updated_at) {
    return json({ error: "conflict", account: current }, 409);
  }

  const final = applyRules(current, patch, tbilisiToday());
  for (const k of Object.keys(final)) {
    if (final[k] === current[k]) delete final[k];
  }
  if (Object.keys(final).length === 0) return json({ ok: true, account: current }, 200);
  final.updated_at = new Date().toISOString();

  const { data: updated, error: writeErr } = await db
    .from("crm_accounts")
    .update(final)
    .eq("id", body.id)
    .eq("updated_at", current.updated_at)
    .select()
    .maybeSingle();
  if (writeErr) throw writeErr;
  if (!updated) {
    const { data: latest } = await db.from("crm_accounts").select("*").eq("id", body.id).maybeSingle();
    return json({ error: "conflict", account: latest }, 409);
  }

  const events = describeChanges(current, final);
  if (events.length) {
    await db.from("crm_activities").insert(
      events.map((e) => ({ account_id: updated.id, author, ...e })),
    );
  }
  return json({ ok: true, account: updated }, 200);
}

/** Turn the changes that matter for the timeline into activity rows. */
function describeChanges(before: Row, change: Patch): Array<{ type: string; body: string; meta: Row }> {
  const out: Array<{ type: string; body: string; meta: Row }> = [];
  if ("kind" in change) {
    out.push({
      type: "moved",
      body: `To ${KIND_LABEL[change.kind as string] ?? change.kind}`,
      meta: { from: before.kind, to: change.kind },
    });
  }
  if ("stage" in change && change.stage) {
    const from = before.stage ? STAGE_LABEL[before.stage as string] : null;
    const to = STAGE_LABEL[change.stage as string];
    out.push({
      type: "stage",
      body: from ? `${from} → ${to}` : `Entered ${to}`,
      meta: { from: before.stage, to: change.stage },
    });
  }
  if ("status" in change) {
    const to = change.status ? STATUS_LABEL[change.status as string] : "No status";
    out.push({ type: "status", body: to, meta: { from: before.status, to: change.status } });
  }
  if ("owner" in change) {
    out.push({
      type: "owner",
      body: change.owner ? String(change.owner) : "Removed",
      meta: { from: before.owner, to: change.owner },
    });
  }
  if ("next_step" in change || "next_step_date" in change) {
    const text = ("next_step" in change ? change.next_step : before.next_step) as string | null;
    const date = ("next_step_date" in change ? change.next_step_date : before.next_step_date) as
      | string
      | null;
    if (text || date) {
      out.push({
        type: "next_step",
        body: `${text ?? "(no text)"}${date ? ` (by ${date})` : ""}`,
        meta: { text, date },
      });
    }
  }
  return out;
}

async function logActivity(db: Db, body: Row, author: string | null): Promise<Response> {
  if (!isUuid(body.account_id)) return json({ error: "account_id required" }, 400);
  const type = String(body.type ?? "");
  if (!(LOG_TYPES as readonly string[]).includes(type)) return json({ error: "unknown type" }, 400);
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text || text.length > 5000) return json({ error: "body must be 1-5000 characters" }, 400);
  const today = tbilisiToday();
  const on = typeof body.occurred_on === "string" && isIsoDate(body.occurred_on) && body.occurred_on <= today
    ? body.occurred_on
    : today;

  const { data: account, error: readErr } = await db
    .from("crm_accounts")
    .select("*")
    .eq("id", body.account_id)
    .maybeSingle();
  if (readErr) throw readErr;
  if (!account) return json({ error: "not_found" }, 404);

  const occurred_at = on === today ? new Date().toISOString() : `${on}T12:00:00+04:00`;
  const { data: activity, error } = await db
    .from("crm_activities")
    .insert({ account_id: account.id, type, body: text, author, occurred_at })
    .select()
    .single();
  if (error) throw error;

  // A call, meeting or email with the hospital moves "last touch" forward. A note does not.
  let latest = account;
  if ((TOUCH_TYPES as readonly string[]).includes(type) && (!account.last_touch || on > account.last_touch)) {
    const { data: touched, error: touchErr } = await db
      .from("crm_accounts")
      .update({ last_touch: on, updated_at: new Date().toISOString() })
      .eq("id", account.id)
      .select()
      .single();
    if (touchErr) throw touchErr;
    latest = touched;
  }
  return json({ ok: true, activity, account: latest }, 200);
}

async function deleteActivity(db: Db, body: Row): Promise<Response> {
  if (!isUuid(body.id)) return json({ error: "id required" }, 400);
  // Only hand-written entries can be removed; stage and status history stays.
  const { data, error } = await db
    .from("crm_activities")
    .delete()
    .eq("id", body.id)
    .in("type", [...LOG_TYPES])
    .select("id");
  if (error) throw error;
  if (!data?.length) return json({ error: "not_found" }, 404);
  return json({ ok: true }, 200);
}

async function setArchived(db: Db, body: Row, author: string | null, archived: boolean): Promise<Response> {
  if (!isUuid(body.id)) return json({ error: "id required" }, 400);
  const { data: account, error } = await db
    .from("crm_accounts")
    .update({ archived, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!account) return json({ error: "not_found" }, 404);
  await db.from("crm_activities").insert({
    account_id: account.id,
    type: archived ? "archived" : "restored",
    body: archived ? "Archived" : "Restored",
    author,
  });
  return json({ ok: true, account }, 200);
}

// ─── Public: website "Request demo" form ────────────────────────────────────

const PER_IP_PER_HOUR = 3;
const PER_DAY_TOTAL = 50;

export async function handleDemoRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  let body: Row;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true }, 200);
  }
  const { request, errors } = cleanDemoRequest(body);
  if (errors.length) return json({ error: "invalid", details: errors }, 400);

  try {
    const db = client();
    const ip_hash = await hashIp(getClientIp(req));
    if (ip_hash) {
      const { count } = await db
        .from("crm_activities")
        .select("id", { count: "exact", head: true })
        .eq("type", "inbound")
        .eq("meta->>ip_hash", ip_hash)
        .gte("occurred_at", new Date(Date.now() - 3600_000).toISOString());
      if ((count ?? 0) >= PER_IP_PER_HOUR) return json({ error: "rate_limited" }, 429);
    }
    const { count: today } = await db
      .from("crm_activities")
      .select("id", { count: "exact", head: true })
      .eq("type", "inbound")
      .gte("occurred_at", new Date(Date.now() - 86400_000).toISOString());
    if ((today ?? 0) >= PER_DAY_TOTAL) return json({ error: "rate_limited" }, 429);

    // One row per buying organization: attach to an existing account with the same name.
    const { data: existing } = await db
      .from("crm_accounts")
      .select("id")
      .ilike("name", escapeLike(request.companyName))
      .eq("archived", false)
      .limit(1)
      .maybeSingle();

    let accountId = existing?.id as string | undefined;
    if (!accountId) {
      const { data: created, error } = await db
        .from("crm_accounts")
        .insert({
          kind: "target",
          name: request.companyName,
          source: "inbound",
          researched_on: tbilisiToday(),
          next_step: "Reply to the website demo request",
          next_step_date: tbilisiToday(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) throw error;
      accountId = created.id;
    }

    const { error: actErr } = await db.from("crm_activities").insert({
      account_id: accountId,
      type: "inbound",
      body: formatDemoRequest(request),
      meta: { ip_hash, ...request },
      author: "Website form",
    });
    if (actErr) throw actErr;
    return json({ ok: true }, 200);
  } catch (err) {
    console.error("demo-request error:", err);
    return json({ error: "server" }, 500);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

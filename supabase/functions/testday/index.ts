// Mtskheta test-day portal API (medimind.md/admin/testday), served through track-event?route=testday.
// Its own shared password (TESTDAY_PASSWORD secret) and its own token key, so a test-day token never opens the
// CRM or investor admin (they check role "admin" with ADMIN_JWT_SECRET; this signs role "testday" with a
// different derived key). Wrong passwords are logged in testday_login_failures and slow down guessing.
//
// POST { action: "login", password }                     → { ok, token, exp }
// POST Bearer <token> { action: "state" }                → everything the page shows (gated: names, logins, seats)
// POST Bearer <token> { action: "tick_user", user_id, field, value, by }
// POST Bearer <token> { action: "tick_flow", dept, idx, done?, note?, by }
// POST Bearer <token> { action: "issue_add", dept, person, screen, what, expected, pr_url, user_id?, flow_idx?, by }
// POST Bearer <token> { action: "issue_update", id, status?, pr_url?, answer?, recheck_note?, by }
//   status life: open → work → fixed (please re-check) → closed (tester confirmed) | open again (still broken);
//   answered = training or a decision, with the answer. pr and wontfix stay valid for day-1 rows.
// POST Bearer <token> { action: "handin", dept, handin, by }

import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders, getClientIp, hashIp } from "../_shared/cors.ts";
import { acceptanceAction } from "./acceptance.ts";

const enc = new TextEncoder();
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60_000;
const TOKEN_HOURS = 14; // one working day
const USER_FIELDS = new Set(["signed_in", "sign_in_failed", "key_screen_ok", "actions_ok", "note"]);
const STATUSES = new Set(["open", "work", "pr", "fixed", "closed", "answered", "wontfix"]);
const int = (v: unknown) => (Number.isInteger(Number(v)) && v !== null && v !== "" ? Number(v) : null);

function db() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

async function key(): Promise<CryptoKey> {
  const secret = Deno.env.get("ADMIN_JWT_SECRET");
  if (!secret) throw new Error("ADMIN_JWT_SECRET not set");
  return await crypto.subtle.importKey("raw", enc.encode(`${secret}:testday`), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

async function authorized(req: Request): Promise<boolean> {
  const m = (req.headers.get("authorization") ?? "").match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  try {
    const payload = await verify(m[1], await key());
    return payload?.role === "testday";
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

const str = (v: unknown, max = 4000) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const now = () => new Date().toISOString();

async function login(req: Request, password: unknown): Promise<Response> {
  const expected = Deno.env.get("TESTDAY_PASSWORD");
  if (!expected) return json({ ok: false, error: "not_configured" }, 503);
  const ip_hash = await hashIp(getClientIp(req));
  const sb = db();
  if (ip_hash) {
    const { count } = await sb.from("testday_login_failures").select("id", { count: "exact", head: true })
      .eq("ip_hash", ip_hash).gte("at", new Date(Date.now() - WINDOW_MS).toISOString());
    if ((count ?? 0) >= MAX_FAILURES) return json({ ok: false, error: "rate_limit" }, 429);
  }
  if (typeof password !== "string" || password.trim() !== expected) {
    await sb.from("testday_login_failures").insert({ ip_hash });
    return json({ ok: false, error: "invalid" }, 401);
  }
  const exp = getNumericDate(TOKEN_HOURS * 3600);
  const token = await create({ alg: "HS256", typ: "JWT" }, { role: "testday", exp }, await key());
  return json({ ok: true, token, exp });
}

async function state(): Promise<Response> {
  const sb = db();
  const [d, u, uc, fc, is, se, no] = await Promise.all([
    sb.from("testday_departments").select("*").order("sort"),
    sb.from("testday_users").select("*").order("sort"),
    sb.from("testday_user_checks").select("*"),
    sb.from("testday_flow_checks").select("*"),
    sb.from("testday_issues").select("*").order("created_at", { ascending: false }),
    sb.from("testday_seats").select("*"),
    sb.from("testday_notes").select("*"),
  ]);
  const err = [d, u, uc, fc, is, se, no].find((r) => r.error)?.error;
  if (err) {
    console.error("testday state:", err);
    return json({ error: "server" }, 500);
  }
  return json({
    departments: d.data,
    users: u.data,
    userChecks: uc.data,
    flowChecks: fc.data,
    issues: is.data,
    seats: se.data,
    notes: no.data,
    at: now(),
  });
}

// deno-lint-ignore no-explicit-any
async function write(body: any): Promise<Response> {
  const sb = db();
  const by = str(body.by, 80);
  switch (body.action) {
    case "tick_user": {
      const id = Number(body.user_id);
      if (!Number.isInteger(id) || !USER_FIELDS.has(body.field)) return json({ error: "bad_request" }, 400);
      const value = body.field === "note" ? str(body.value) : body.value === true;
      // Only the touched field changes, so two testers ticking different boxes never undo each other.
      const { data, error } = await sb.from("testday_user_checks")
        .upsert({ user_id: id, [body.field]: value, checked_by: by, checked_at: now() }, { onConflict: "user_id" })
        .select().single();
      if (error) return fail("tick_user", error);
      return json({ row: data });
    }
    case "tick_flow": {
      const idx = Number(body.idx);
      const dept = str(body.dept, 40);
      if (!dept || !Number.isInteger(idx)) return json({ error: "bad_request" }, 400);
      const row: Record<string, unknown> = { dept_slug: dept, flow_idx: idx, checked_by: by, checked_at: now() };
      if (typeof body.done === "boolean") row.done = body.done;
      if ("note" in body) row.note = str(body.note);
      const { data, error } = await sb.from("testday_flow_checks").upsert(row, { onConflict: "dept_slug,flow_idx" })
        .select().single();
      if (error) return fail("tick_flow", error);
      return json({ row: data });
    }
    case "issue_add": {
      const what = str(body.what);
      if (!what) return json({ error: "what_required" }, 400);
      const { data, error } = await sb.from("testday_issues").insert({
        dept_slug: str(body.dept, 40),
        person: str(body.person, 200),
        screen: str(body.screen, 200),
        what,
        expected: str(body.expected),
        pr_url: str(body.pr_url, 500),
        status: str(body.pr_url, 500) ? "pr" : "open",
        reported_by: by,
        user_id: int(body.user_id),
        flow_idx: int(body.flow_idx),
      }).select().single();
      if (error) return fail("issue_add", error);
      return json({ row: data });
    }
    case "issue_update": {
      const id = Number(body.id);
      if (!Number.isInteger(id)) return json({ error: "bad_request" }, 400);
      const patch: Record<string, unknown> = { updated_at: now() };
      if (STATUSES.has(body.status)) {
        patch.status = body.status;
        // Stamps for "solved since yesterday" and "waiting for re-check"; reopening clears the close stamp.
        if (body.status === "fixed") patch.fixed_at = now();
        if (body.status === "closed" || body.status === "answered" || body.status === "wontfix") patch.closed_at = now();
        if (body.status === "open" || body.status === "work") patch.closed_at = null;
      }
      if ("pr_url" in body) patch.pr_url = str(body.pr_url, 500);
      if ("answer" in body) patch.answer = str(body.answer);
      if ("recheck_note" in body) patch.recheck_note = str(body.recheck_note, 1000);
      const { data, error } = await sb.from("testday_issues").update(patch).eq("id", id).select().single();
      if (error) return fail("issue_update", error);
      return json({ row: data });
    }
    case "handin": {
      const dept = str(body.dept, 40);
      if (!dept || typeof body.handin !== "object" || !body.handin) return json({ error: "bad_request" }, 400);
      const handin: Record<string, string> = {};
      for (const [k, v] of Object.entries(body.handin)) if (typeof v === "string") handin[k.slice(0, 40)] = v.slice(0, 4000);
      const { data, error } = await sb.from("testday_notes")
        .upsert({ dept_slug: dept, handin, updated_by: by, updated_at: now() }, { onConflict: "dept_slug" }).select().single();
      if (error) return fail("handin", error);
      return json({ row: data });
    }
    default:
      return json({ error: "unknown_action" }, 400);
  }
}

function fail(where: string, error: unknown) {
  console.error(`testday ${where}:`, error);
  return json({ error: "server" }, 500);
}

export async function handleTestday(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.action === "login") return await login(req, body.password);
    if (!(await authorized(req))) return json({ error: "unauthorized" }, 401);
    if (body?.action === "state") return await state();
    if (body?.action === "acceptance_state" || body?.action === "acceptance_run" || body?.action === "acceptance_sign"
      || body?.action === "acceptance_owners" || body?.action === "acceptance_owner") {
      return await acceptanceAction(body, db(), json);
    }
    return await write(body);
  } catch (err) {
    console.error("testday error:", err);
    return json({ error: "server" }, 500);
  }
}

// Sales CRM from the command line, for people and agents (see .claude/skills/sales-crm/SKILL.md).
//
// It runs the CRM's own API code in this process, so every rule the website follows applies here too
// (stage dates, the timeline, conflict checks), against the real database. Nothing is sent over the
// public internet except to Supabase itself, and no key is ever printed.
//
// Needs SUPABASE_ACCESS_TOKEN (a Supabase personal access token) or SUPABASE_SERVICE_ROLE_KEY in the environment.
//
//   deno run -A scripts/crm.ts list [all|deals|targets|anchor|closed] [--json]
//   deno run -A scripts/crm.ts show <#ref or name> [--json]
//   deno run -A scripts/crm.ts add <target|deal> "<name>" [field=value ...] --as <person>
//   deno run -A scripts/crm.ts set <#ref or name> field=value [field=value ...] --as <person>
//   deno run -A scripts/crm.ts log <#ref or name> <message|call|meeting|email|note> [--on YYYY-MM-DD] [--file path|-] [text ...] --as <person>
//   deno run -A scripts/crm.ts archive <#ref or name> --as <person>
//   deno run -A scripts/crm.ts restore <id> --as <person>
//   deno run -A scripts/crm.ts fields

import { tbilisiToday } from "../supabase/functions/crm/validate.ts";
import { handleLandingApi } from "../supabase/functions/track-event/index.ts";

const PROJECT_REF = "kvsqtolsjggpyvdtdpss";
type Row = Record<string, unknown>;

const FIELDS: [string, string][] = [
  ["kind", "target | deal | anchor"],
  ["name", "hospital or group name (one row per buying organization)"],
  ["org_type", "group | single | clinic | government"],
  ["sites", "number of sites"],
  ["city", "city or region"],
  ["source", "founder_network | warm_intro | direct_outreach | inbound"],
  ["stage", "deals only: discovery | qualified | evaluation_agreed | evaluating | proposal | negotiation | won | lost"],
  ["stage_since", "date the deal entered its stage (set automatically on a stage change)"],
  ["status", "active | waiting_on_us | waiting_on_it (shown as 'Waiting on the hospital') | stalled | on_hold"],
  ["owner", "Lasha | Irakli | Team"],
  ["next_step", "what happens next, and who does it"],
  ["next_step_date", "YYYY-MM-DD"],
  ["last_touch", "last contact date (logging a message, call, meeting or email sets it)"],
  ["connector", "who opened the door"],
  ["champion", "who organizes colleagues inside, or the person we talk to"],
  ["buyer", "who approves the spending"],
  ["roles_reached", "roles we have met"],
  ["pain", "the problem, in their words"],
  ["pain_status", "hypothesis | confirmed"],
  ["objections", "objections we heard"],
  ["last_sent", "the last thing we sent"],
  ["current_software", "their current system"],
  ["current_spend_gel", "what they pay now, GEL a month"],
  ["amount_gel", "deal value, GEL a year"],
  ["decision_date", "YYYY-MM-DD"],
  ["price_reaction", "how they reacted to the price"],
  ["concessions", "every discount, free item or price lock promised"],
  ["team_hours", "hours our team spent"],
  ["first_contact_at", "milestone date"],
  ["discovery_at", "milestone date: discovery call held"],
  ["sql_at", "milestone date: qualified"],
  ["data_access_at", "milestone date: data access verified"],
  ["eval_agreed_at", "milestone date: evaluation agreed"],
  ["delivered_at", "milestone date: parallel version delivered"],
  ["first_test_at", "milestone date: first hands-on test by their staff"],
  ["results_reviewed_at", "milestone date: results reviewed"],
  ["signed_at", "milestone date: purchase agreement signed"],
  ["lost_reason", "why a deal was lost"],
  ["evidence_link", "link to call notes, approvals, feedback (never passwords or patient data)"],
  ["notes", "checked facts and where they came from; lines starting with [ ] are checkboxes"],
  ["researched_on", "YYYY-MM-DD"],
  ["excluded", "true | false (target marked as a bad fit)"],
];
const FIELD_NAMES = new Set(FIELDS.map(([k]) => k));
const LOG_TYPES = ["message", "call", "meeting", "email", "note"];
const STAGE: Record<string, string> = {
  discovery: "Discovery",
  qualified: "Qualified",
  evaluation_agreed: "Evaluation agreed",
  evaluating: "Evaluating",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Closed won",
  lost: "Closed lost",
};
const STATUS: Record<string, string> = {
  active: "Active",
  waiting_on_us: "Waiting on us",
  waiting_on_it: "Waiting on the hospital",
  stalled: "Stalled",
  on_hold: "On hold",
};

function fail(message: string): never {
  console.error(message);
  Deno.exit(1);
}

function usage(): void {
  const text = Deno.readTextFileSync(new URL(import.meta.url)).split("\n");
  console.log(text.filter((l) => l.startsWith("//   ")).map((l) => l.slice(5)).join("\n"));
  console.log("\nAdd --as <person> to every change, so the timeline shows who did it. Run `fields` for what you can set.");
}

/** The database key, fetched into memory only. */
async function serviceKey(): Promise<string> {
  const direct = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (direct) return direct;
  const token = Deno.env.get("SUPABASE_ACCESS_TOKEN");
  if (!token) {
    fail("Set SUPABASE_ACCESS_TOKEN (a Supabase personal access token) first. The sales-crm skill explains where to get one.");
  }
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) fail(`Supabase refused the access token (HTTP ${res.status}). Check it is current.`);
  const keys = await res.json() as { name?: string; api_key?: string }[];
  const key = keys.find((k) => k.name === "service_role")?.api_key;
  if (!key) fail("The project has no service_role key; set SUPABASE_SERVICE_ROLE_KEY instead.");
  return key;
}

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") flags.json = true;
    else if (a === "--as" || a === "--on" || a === "--file") {
      const v = argv[++i];
      if (v === undefined) fail(`${a} needs a value`);
      flags[a.slice(2)] = v;
    } else rest.push(a);
  }
  return { flags, rest };
}

/** field=value pairs. "null" or an empty value clears a field; excluded takes true/false. */
function parseFields(pairs: string[]): Row {
  const fields: Row = {};
  for (const pair of pairs) {
    const eq = pair.indexOf("=");
    if (eq < 1) fail(`Expected field=value, got "${pair}". Run \`fields\` for the list.`);
    const key = pair.slice(0, eq);
    const raw = pair.slice(eq + 1);
    if (!FIELD_NAMES.has(key)) fail(`Unknown field "${key}". Run \`fields\` for the list.`);
    fields[key] = raw === "" || raw === "null" ? null : key === "excluded" ? raw === "true" : raw;
  }
  return fields;
}

const where = (a: Row) =>
  a.kind === "anchor" ? "Anchor" : a.kind === "target" ? (a.excluded ? "Target (bad fit)" : "Target") : STAGE[String(a.stage)] ?? "Pipeline";

function line(a: Row): string {
  const closed = a.stage === "won" || a.stage === "lost";
  const parts = [`#${a.ref}`, `[${where(a)}${a.status && !closed ? `, ${STATUS[String(a.status)]}` : ""}]`, String(a.name)];
  if (a.owner) parts.push(`owner ${a.owner}`);
  if (a.next_step || a.next_step_date) parts.push(`next: ${a.next_step ?? "(no text)"}${a.next_step_date ? ` (by ${a.next_step_date})` : ""}`);
  if (a.last_touch) parts.push(`last contact ${a.last_touch}`);
  return parts.join("  ");
}

async function main(): Promise<void> {
  const { flags, rest } = parseArgs(Deno.args);
  const [command, ...args] = rest;
  if (!command || command === "help" || command === "--help") return usage();
  if (command === "fields") {
    for (const [k, d] of FIELDS) console.log(`${k.padEnd(20)} ${d}`);
    return;
  }

  const writes = ["add", "set", "log", "archive", "restore"];
  if (!writes.includes(command) && !["list", "show"].includes(command)) fail(`Unknown command "${command}". Run without arguments for help.`);
  if (writes.includes(command) && typeof flags.as !== "string") {
    fail("Say who this change is for, so the timeline is honest: --as Lasha (or --as Irakli).");
  }

  // A private, throwaway admin session inside this process.
  Deno.env.set("SUPABASE_URL", `https://${PROJECT_REF}.supabase.co`);
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", await serviceKey());
  const password = crypto.randomUUID();
  Deno.env.set("ADMIN_PASSWORD", password);
  Deno.env.set("ADMIN_JWT_SECRET", `${crypto.randomUUID()}${crypto.randomUUID()}`);
  const post = async (route: string, body: Row, jwt?: string) => {
    const res = await handleLandingApi(
      new Request(`http://localhost/functions/v1/track-event?route=${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) },
        body: JSON.stringify(body),
      }),
    );
    return { status: res.status, json: await res.json().catch(() => null) as Row | null };
  };
  const jwt = (await post("admin-login", { password })).json?.token as string | undefined;
  if (!jwt) fail("Could not open a CRM session.");
  const crm = async (action: string, payload: Row = {}): Promise<Row> => {
    const { status, json } = await post("crm", { action, author: flags.as ?? null, ...payload }, jwt);
    if (status !== 200) {
      const details = Array.isArray(json?.details) ? (json!.details as string[]).join("; ") : json?.error;
      fail(`The CRM refused that (${status}): ${details ?? "unknown error"}`);
    }
    return json as Row;
  };

  const accounts = (await crm("list")).accounts as Row[];
  const find = (query: string | undefined): Row => {
    if (!query) fail("Which hospital? Give its #number or part of its name.");
    const ref = query.replace(/^#/, "");
    if (/^\d+$/.test(ref)) return accounts.find((a) => String(a.ref) === ref) ?? fail(`No live hospital #${ref}.`);
    const q = query.toLowerCase();
    const exact = accounts.filter((a) => String(a.name).toLowerCase() === q);
    if (exact.length === 1) return exact[0];
    const hits = accounts.filter((a) => String(a.name).toLowerCase().includes(q));
    if (hits.length === 1) return hits[0];
    if (hits.length === 0) fail(`No hospital matches "${query}". Try: list all`);
    return fail(`"${query}" matches ${hits.length}: ${hits.map((h) => `#${h.ref} ${h.name}`).join(", ")}. Use the #number.`);
  };

  if (command === "list") {
    const which = args[0] ?? "all";
    const pick: Record<string, (a: Row) => boolean> = {
      all: () => true,
      deals: (a) => a.kind === "deal" && a.stage !== "won" && a.stage !== "lost",
      closed: (a) => a.kind === "deal" && (a.stage === "won" || a.stage === "lost"),
      targets: (a) => a.kind === "target",
      anchor: (a) => a.kind === "anchor",
    };
    if (!pick[which]) fail(`list takes one of: ${Object.keys(pick).join(", ")}`);
    const rows = accounts.filter(pick[which]).sort((a, b) => Number(a.ref) - Number(b.ref));
    if (flags.json) console.log(JSON.stringify(rows, null, 2));
    else for (const a of rows) console.log(line(a));
    return;
  }

  if (command === "show") {
    const a = find(args[0]);
    const { activities } = await crm("activities", { account_id: a.id }) as { activities: Row[] };
    if (flags.json) return console.log(JSON.stringify({ account: a, activities }, null, 2));
    console.log(line(a));
    for (const [k] of FIELDS) {
      const v = a[k];
      if (v === null || v === undefined || v === "" || v === false || k === "notes" || k === "name") continue;
      console.log(`  ${k}: ${v}`);
    }
    if (a.notes) console.log(`  notes:\n${String(a.notes).split("\n").map((l) => `    ${l}`).join("\n")}`);
    console.log("  timeline, newest first:");
    for (const act of activities.slice(0, 25)) {
      const body = String(act.body ?? "").replace(/\s+/g, " ");
      console.log(`    ${tbilisiToday(new Date(String(act.occurred_at)))} ${act.type}${act.author ? ` (${act.author})` : ""}: ${body.length > 220 ? `${body.slice(0, 220)}…` : body}`);
    }
    return;
  }

  if (command === "add") {
    const [kind, name, ...pairs] = args;
    if (kind !== "target" && kind !== "deal") fail('add takes "target" or "deal" first.');
    if (!name) fail("add needs the hospital's name.");
    // Same check as the website's "Already in the CRM" hint: letters and digits only, either name inside the other.
    const squash = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
    const typed = squash(name);
    const similar = accounts.filter((a) => {
      const existing = squash(String(a.name));
      return existing.length >= 3 && typed.length >= 3 && (existing.includes(typed) || typed.includes(existing));
    });
    if (similar.length) {
      fail(`Already in the CRM: ${similar.map((s) => `#${s.ref} ${s.name}`).join(", ")}. Update that one with set/log instead.`);
    }
    const { account } = await crm("create", { fields: { kind, name, ...parseFields(pairs) } }) as { account: Row };
    console.log(`Added: ${line(account)}`);
    return;
  }

  if (command === "set") {
    const a = find(args[0]);
    const fields = parseFields(args.slice(1));
    if (!Object.keys(fields).length) fail("set needs at least one field=value.");
    const { account } = await crm("update", { id: a.id, expected_updated_at: a.updated_at, fields }) as { account: Row };
    console.log(`Saved: ${line(account)}`);
    return;
  }

  if (command === "log") {
    const a = find(args[0]);
    const type = args[1];
    if (!LOG_TYPES.includes(type)) fail(`log takes one of: ${LOG_TYPES.join(", ")}`);
    let body = args.slice(2).join(" ");
    if (typeof flags.file === "string") {
      body = flags.file === "-" ? await new Response(Deno.stdin.readable).text() : await Deno.readTextFile(flags.file);
    }
    if (!body.trim()) fail("log needs the text: as words after the type, or --file path (- reads stdin).");
    const { account } = await crm("log", {
      account_id: a.id,
      type,
      body: body.trim(),
      ...(typeof flags.on === "string" ? { occurred_on: flags.on } : {}),
    }) as { account: Row };
    console.log(`Logged ${type} on ${account.name}${typeof flags.on === "string" ? ` (dated ${flags.on})` : ""}.`);
    return;
  }

  if (command === "archive") {
    const a = find(args[0]);
    await crm("archive", { id: a.id });
    console.log(`Archived #${a.ref} ${a.name}. To undo: deno run -A scripts/crm.ts restore ${a.id} --as ${flags.as}`);
    return;
  }

  if (command === "restore") {
    if (!args[0]) fail("restore needs the id printed when the hospital was archived.");
    const { account } = await crm("restore", { id: args[0] }) as { account: Row };
    console.log(`Restored: ${line(account)}`);
  }
}

if (import.meta.main) await main();

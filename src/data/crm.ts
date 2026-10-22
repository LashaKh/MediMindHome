/**
 * Sales CRM vocabulary and pure helpers (no React, no network).
 * Stage rules follow the 500 Global Week 5 Day 2 lecture: each stage is something the
 * HOSPITAL did; our own work is a status, never a stage; closed won means signed.
 */

export type Kind = "target" | "deal" | "anchor";
export type StageId =
  | "discovery"
  | "qualified"
  | "evaluation_agreed"
  | "evaluating"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";
export type OpenStageId = Exclude<StageId, "won" | "lost">;
export type StatusId = "active" | "waiting_on_us" | "waiting_on_it" | "stalled" | "on_hold";
export type SourceId = "founder_network" | "warm_intro" | "direct_outreach" | "inbound";
export type OrgType = "group" | "single" | "clinic" | "government";
export type LogType = "note" | "call" | "meeting" | "email" | "message";
export type ActivityType =
  | LogType
  | "created"
  | "stage"
  | "status"
  | "owner"
  | "next_step"
  | "moved"
  | "archived"
  | "restored"
  | "inbound";

export interface Account {
  id: string;
  ref: number;
  kind: Kind;
  name: string;
  org_type: OrgType | null;
  sites: number | null;
  city: string | null;
  source: SourceId | null;
  stage: StageId | null;
  stage_since: string | null;
  status: StatusId | null;
  owner: string | null;
  next_step: string | null;
  next_step_date: string | null;
  last_touch: string | null;
  connector: string | null;
  champion: string | null;
  buyer: string | null;
  roles_reached: string | null;
  pain: string | null;
  pain_status: "hypothesis" | "confirmed" | null;
  objections: string | null;
  last_sent: string | null;
  current_software: string | null;
  current_spend_gel: number | null;
  amount_gel: number | null;
  decision_date: string | null;
  price_reaction: string | null;
  concessions: string | null;
  team_hours: number | null;
  first_contact_at: string | null;
  discovery_at: string | null;
  sql_at: string | null;
  data_access_at: string | null;
  eval_agreed_at: string | null;
  delivered_at: string | null;
  first_test_at: string | null;
  results_reviewed_at: string | null;
  signed_at: string | null;
  lost_reason: string | null;
  evidence_link: string | null;
  notes: string | null;
  researched_on: string | null;
  excluded: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  account_id: string;
  type: ActivityType;
  body: string | null;
  meta: Record<string, unknown> | null;
  author: string | null;
  occurred_at: string;
}

export interface InboundItem {
  id: string;
  account_id: string;
  body: string | null;
  occurred_at: string;
}

export interface CrmData {
  accounts: Account[];
  activities: Activity[];
  inbound: InboundItem[];
  today: string;
}

export interface StageDef {
  id: OpenStageId;
  label: string;
  rule: string;
  needs: string;
}

export const OPEN_STAGES: StageDef[] = [
  {
    id: "discovery",
    label: "Discovery",
    rule: "A named leader there replied and agreed to talk.",
    needs: "Source, owner, next step and date",
  },
  {
    id: "qualified",
    label: "Qualified",
    rule: "On a call they confirmed the pain with a number, why now, a sponsor, who approves and pays, and who owns it inside.",
    needs: "Confirmed pain, champion, buyer, current software and spend",
  },
  {
    id: "evaluation_agreed",
    label: "Evaluation agreed",
    rule: "They signed off scope, testers, baseline, success criteria and dates. Data access works.",
    needs: "Data access date and a link to the agreed plan",
  },
  {
    id: "evaluating",
    label: "Evaluating",
    rule: "Their staff did the first hands-on test. A founder-only demo does not count.",
    needs: "First test date and feedback",
  },
  {
    id: "proposal",
    label: "Proposal",
    rule: "They reviewed the results and named who signs, and when. We sent a price.",
    needs: "Deal amount, decision date, signer",
  },
  {
    id: "negotiation",
    label: "Negotiation",
    rule: "They accepted the proposal in principle. The contract is with their legal team.",
    needs: "Every concession written down",
  },
];

export const STAGE_LABEL: Record<StageId, string> = {
  discovery: "Discovery",
  qualified: "Qualified",
  evaluation_agreed: "Evaluation agreed",
  evaluating: "Evaluating",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Closed won",
  lost: "Closed lost",
};

export const STATUSES: { id: StatusId; label: string; hint: string }[] = [
  { id: "active", label: "Active", hint: "Moving, and the next step has a date." },
  { id: "waiting_on_us", label: "Waiting on us", hint: "We are building or preparing. Our work is a status, not a stage." },
  { id: "waiting_on_it", label: "Waiting on the hospital", hint: "The next move is theirs: a reply, data access or an approval." },
  { id: "stalled", label: "Stalled", hint: "No hospital activity for 14 days or more." },
  { id: "on_hold", label: "On hold", hint: "Paused on purpose. Put the review date in the next step." },
];
export const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s.id, s.label])) as Record<StatusId, string>;

export const SOURCES: { id: SourceId; label: string; hint: string }[] = [
  { id: "founder_network", label: "Founder network", hint: "People we already knew" },
  { id: "warm_intro", label: "Warm introduction", hint: "Someone introduced us" },
  { id: "direct_outreach", label: "Direct outreach", hint: "We contacted them first" },
  { id: "inbound", label: "Inbound", hint: "They came to us" },
];
export const SOURCE_LABEL = Object.fromEntries(SOURCES.map((s) => [s.id, s.label])) as Record<SourceId, string>;

export const ORG_TYPES: { id: OrgType; label: string }[] = [
  { id: "group", label: "Hospital group" },
  { id: "single", label: "Single hospital" },
  { id: "clinic", label: "Clinic" },
  { id: "government", label: "Government" },
];

export const OWNERS = ["Irakli", "Lasha", "Team"];

export const LOST_REASONS = [
  "No reply after follow-ups",
  "Not a priority now",
  "No budget",
  "The group decides elsewhere",
  "Staying with their current system",
  "They built their own system",
  "Chose another vendor",
  "Data or security approval refused",
  "Evaluation missed the success criteria",
  "Bad fit",
];

export const LOG_TYPES: { id: LogType; label: string; verb: string; hint: string }[] = [
  { id: "message", label: "Message", verb: "Log message", hint: "What did you send or get back? WhatsApp, Messenger, SMS or LinkedIn." },
  { id: "call", label: "Call", verb: "Log call", hint: "What was said on the call? What did they agree to?" },
  { id: "meeting", label: "Meeting", verb: "Log meeting", hint: "Who was there, what was said, what did they agree to?" },
  { id: "email", label: "Email", verb: "Log email", hint: "What did you send or get back?" },
  { id: "note", label: "Note", verb: "Add note", hint: "Internal note. The hospital never sees it, and it doesn't count as contact." },
];

/** What each timeline entry is called, everywhere it is shown. */
export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  note: "Note",
  call: "Call",
  meeting: "Meeting",
  email: "Email",
  message: "Message",
  created: "Added",
  stage: "Stage",
  status: "Status",
  owner: "Owner",
  next_step: "Next step",
  moved: "Moved",
  archived: "Archived",
  restored: "Restored",
  inbound: "Website request",
};

export const MILESTONES: { key: MilestoneKey; label: string }[] = [
  { key: "first_contact_at", label: "First contact" },
  { key: "discovery_at", label: "Discovery call held" },
  { key: "sql_at", label: "Qualified" },
  { key: "data_access_at", label: "Data access verified" },
  { key: "eval_agreed_at", label: "Evaluation agreed" },
  { key: "delivered_at", label: "Parallel version delivered" },
  { key: "first_test_at", label: "First hands-on test" },
  { key: "results_reviewed_at", label: "Results reviewed" },
  { key: "signed_at", label: "Signed" },
];
export type MilestoneKey =
  | "first_contact_at"
  | "discovery_at"
  | "sql_at"
  | "data_access_at"
  | "eval_agreed_at"
  | "delivered_at"
  | "first_test_at"
  | "results_reviewed_at"
  | "signed_at";

// ─── Dates ─────────────────────────────────────────────────────────────────

/** Today in Tbilisi, the team's clock, as YYYY-MM-DD. */
export function tbilisiToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tbilisi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function dayNumber(iso: string): number {
  return Math.round(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / 86400000);
}

/** Whole days from `from` to `to` (both YYYY-MM-DD). Positive when `to` is later. */
export function daysBetween(from: string, to: string): number {
  return dayNumber(to) - dayNumber(from);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string | null | undefined, today?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const sameYear = today ? today.slice(0, 4) === String(y) : false;
  return `${d} ${MONTHS[m - 1]}${sameYear ? "" : ` ${y}`}`;
}

/** "today", "tomorrow", "in 3 days", "yesterday", "5 days ago". */
export function relativeDay(iso: string, today: string): string {
  const n = daysBetween(today, iso);
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n === -1) return "yesterday";
  return n > 0 ? `in ${n} days` : `${-n} days ago`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Today", "Tomorrow" or "Tue 27 Oct": for a to-do list, where the weekday matters. */
export function dayLabel(iso: string, today: string): string {
  const n = daysBetween(today, iso);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  const weekday = WEEKDAYS[new Date(`${iso.slice(0, 10)}T00:00:00Z`).getUTCDay()];
  return `${weekday} ${formatDate(iso, today)}`;
}

export function timeAgo(isoTime: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - Date.parse(isoTime)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "yesterday";
  if (d < 30) return `${d} days ago`;
  return formatDate(isoTime.slice(0, 10));
}

export function formatGel(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} GEL`;
}

export function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

// ─── What needs attention ──────────────────────────────────────────────────

export interface Flag {
  label: string;
  tone: "red" | "amber";
}

export function isOpenDeal(a: Account): boolean {
  return a.kind === "deal" && a.stage !== "won" && a.stage !== "lost";
}

/** When we last reached a target (a logged message, call, meeting or email). Null: not contacted yet. */
export function contactedOn(a: Account): string | null {
  return a.last_touch ?? a.first_contact_at;
}

function lateFlag(date: string, today: string): Flag {
  const late = daysBetween(date, today);
  return { label: `Next step ${late} ${late === 1 ? "day" : "days"} late`, tone: "red" };
}

/** Everything wrong with a record, most urgent first. Empty when it is in good shape. */
export function flagsFor(a: Account, today: string): Flag[] {
  const flags: Flag[] = [];
  if (a.kind === "target") {
    if (a.excluded) return flags;
    if (a.source === "inbound" && !a.owner) flags.push({ label: "Website request: needs an owner", tone: "red" });
    // A target we already wrote to needs a dated follow-up, or the conversation quietly dies.
    if (a.next_step_date && a.next_step_date < today) flags.push(lateFlag(a.next_step_date, today));
    else if (contactedOn(a) && !a.next_step_date) flags.push({ label: "No follow-up date", tone: "amber" });
    return flags;
  }
  if (a.kind === "deal" && a.stage === "won" && !a.signed_at) flags.push({ label: "Add the signed date", tone: "amber" });
  if (a.kind === "deal" && a.stage === "lost" && !a.lost_reason) flags.push({ label: "Add the lost reason", tone: "amber" });
  if (a.kind === "deal" && !isOpenDeal(a)) return flags;

  if (!a.owner) flags.push({ label: "No owner", tone: "red" });
  if (!a.next_step_date) {
    flags.push({ label: "No next step date", tone: "red" });
  } else if (a.next_step_date < today) {
    flags.push(lateFlag(a.next_step_date, today));
  }
  if (a.kind === "deal") {
    // With nothing logged yet, the clock starts when the deal entered its stage.
    const since = contactedOn(a) ?? a.stage_since;
    if (since && daysBetween(since, today) >= 14) {
      flags.push({ label: `No contact for ${daysBetween(since, today)} days`, tone: "amber" });
    }
    if ((a.stage === "proposal" || a.stage === "negotiation") && (a.amount_gel === null || !a.decision_date)) {
      flags.push({ label: "Needs amount and decision date", tone: "amber" });
    }
  }
  return flags;
}

// ─── The weekly numbers ────────────────────────────────────────────────────

export interface Metrics {
  openDeals: Account[];
  targets: Account[];
  /** Targets we already wrote to or called, waiting for a reply. */
  contacted: Account[];
  /** In good shape, with a next step due in the next 7 days, soonest first. */
  upcoming: Account[];
  excluded: Account[];
  anchors: Account[];
  won: Account[];
  lost: Account[];
  last30: Record<"discovery_at" | "sql_at" | "eval_agreed_at" | "delivered_at" | "first_test_at" | "signed_at", number>;
  byStage: Record<StageId, { deals: Account[]; knownValue: number; unknownValue: number; avgDays: number | null }>;
  bySource: Record<SourceId | "unknown", { open: number; won: number; lost: number }>;
  byStatus: Record<StatusId | "none", number>;
  winRate: number | null;
  lostReasons: { reason: string; count: number }[];
  attention: { account: Account; flags: Flag[] }[];
  avgAgreedToTest: number | null;
}

export function computeMetrics(accounts: Account[], today: string): Metrics {
  const live = accounts.filter((a) => !a.archived);
  const deals = live.filter((a) => a.kind === "deal");
  const openDeals = deals.filter(isOpenDeal);
  const won = deals.filter((a) => a.stage === "won");
  const lost = deals.filter((a) => a.stage === "lost");

  const inWindow = (d: string | null) => !!d && daysBetween(d, today) >= 0 && daysBetween(d, today) <= 29;
  const count = (k: keyof Metrics["last30"]) => deals.filter((a) => inWindow(a[k])).length;

  const byStage = {} as Metrics["byStage"];
  for (const id of [...OPEN_STAGES.map((s) => s.id), "won", "lost"] as StageId[]) {
    const inStage = deals.filter((a) => a.stage === id);
    const ages = inStage.filter((a) => a.stage_since).map((a) => daysBetween(a.stage_since!, today));
    byStage[id] = {
      deals: inStage,
      knownValue: inStage.reduce((s, a) => s + (a.amount_gel ?? 0), 0),
      unknownValue: inStage.filter((a) => a.amount_gel === null).length,
      avgDays: ages.length ? Math.round(ages.reduce((s, n) => s + n, 0) / ages.length) : null,
    };
  }

  const bySource = {} as Metrics["bySource"];
  for (const id of [...SOURCES.map((s) => s.id), "unknown"] as (SourceId | "unknown")[]) {
    const mine = deals.filter((a) => (a.source ?? "unknown") === id);
    bySource[id] = {
      open: mine.filter(isOpenDeal).length,
      won: mine.filter((a) => a.stage === "won").length,
      lost: mine.filter((a) => a.stage === "lost").length,
    };
  }

  const byStatus = { none: 0 } as Metrics["byStatus"];
  for (const s of STATUSES) byStatus[s.id] = 0;
  for (const a of openDeals) byStatus[a.status ?? "none"] += 1;

  const reasons = new Map<string, number>();
  for (const a of lost) reasons.set(a.lost_reason ?? "No reason recorded", (reasons.get(a.lost_reason ?? "No reason recorded") ?? 0) + 1);

  const attention = live
    .filter((a) => !a.excluded)
    .map((account) => ({ account, flags: flagsFor(account, today) }))
    .filter((x) => x.flags.length > 0)
    .sort((x, y) => {
      const red = (f: Flag[]) => (f.some((g) => g.tone === "red") ? 0 : 1);
      return red(x.flags) - red(y.flags) || (x.account.next_step_date ?? "9999").localeCompare(y.account.next_step_date ?? "9999");
    });

  const spans = deals
    .filter((a) => a.eval_agreed_at && a.first_test_at)
    .map((a) => daysBetween(a.eval_agreed_at!, a.first_test_at!));

  const flagged = new Set(attention.map((x) => x.account.id));
  const upcoming = live
    .filter((a) => !a.excluded && !flagged.has(a.id) && (a.kind !== "deal" || isOpenDeal(a)))
    .filter((a) => a.next_step_date && daysBetween(today, a.next_step_date) >= 0 && daysBetween(today, a.next_step_date) <= 7)
    .sort((x, y) => x.next_step_date!.localeCompare(y.next_step_date!) || x.name.localeCompare(y.name));
  const targets = live.filter((a) => a.kind === "target" && !a.excluded);

  return {
    openDeals,
    targets,
    contacted: targets.filter((a) => contactedOn(a) !== null),
    upcoming,
    excluded: live.filter((a) => a.kind === "target" && a.excluded),
    anchors: live.filter((a) => a.kind === "anchor"),
    won,
    lost,
    last30: {
      discovery_at: count("discovery_at"),
      sql_at: count("sql_at"),
      eval_agreed_at: count("eval_agreed_at"),
      delivered_at: count("delivered_at"),
      first_test_at: count("first_test_at"),
      signed_at: count("signed_at"),
    },
    byStage,
    bySource,
    byStatus,
    winRate: won.length + lost.length ? won.length / (won.length + lost.length) : null,
    lostReasons: [...reasons.entries()].map(([reason, n]) => ({ reason, count: n })).sort((a, b) => b.count - a.count),
    attention,
    avgAgreedToTest: spans.length ? Math.round(spans.reduce((s, n) => s + n, 0) / spans.length) : null,
  };
}

// ─── CSV export (investors sometimes ask for the raw pipeline) ─────────────

const CSV_COLUMNS: (keyof Account)[] = [
  "ref", "kind", "name", "stage", "status", "owner", "source", "org_type", "sites", "city",
  "next_step", "next_step_date", "last_touch", "stage_since", "amount_gel", "decision_date",
  "current_software", "current_spend_gel", "pain", "pain_status", "connector", "champion", "buyer",
  "first_contact_at", "discovery_at", "sql_at", "data_access_at", "eval_agreed_at", "delivered_at",
  "first_test_at", "results_reviewed_at", "signed_at", "lost_reason", "concessions", "evidence_link", "notes",
];

export function toCsv(accounts: Account[]): string {
  const cell = (v: unknown) => {
    let s = v === null || v === undefined ? "" : String(v);
    // A cell that starts like a formula would run as one in Excel or Sheets: keep it plain text.
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [CSV_COLUMNS.join(","), ...accounts.map((a) => CSV_COLUMNS.map((c) => cell(a[c])).join(","))].join("\n");
}

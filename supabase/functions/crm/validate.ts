// Pure validation and stage rules for the Sales CRM API. No I/O, so it is unit-tested directly.

export const KINDS = ["target", "deal", "anchor"] as const;
export const ORG_TYPES = ["group", "single", "clinic", "government"] as const;
export const SOURCES = ["founder_network", "warm_intro", "direct_outreach", "inbound"] as const;
export const STAGES = [
  "discovery",
  "qualified",
  "evaluation_agreed",
  "evaluating",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;
export const STATUSES = ["active", "waiting_on_us", "waiting_on_it", "stalled", "on_hold"] as const;
export const PAIN_STATUSES = ["hypothesis", "confirmed"] as const;
/** Activity types a person can log by hand (and delete again). */
export const LOG_TYPES = ["note", "call", "meeting", "email"] as const;
/** Logged contact with the hospital — these move "last touch". A note is internal. */
export const TOUCH_TYPES = ["call", "meeting", "email"] as const;

const TEXT_LIMITS: Record<string, number> = {
  name: 200,
  city: 120,
  owner: 60,
  next_step: 1000,
  connector: 300,
  champion: 300,
  buyer: 300,
  roles_reached: 300,
  pain: 2000,
  objections: 2000,
  last_sent: 300,
  current_software: 300,
  price_reaction: 2000,
  concessions: 2000,
  lost_reason: 300,
  evidence_link: 1000,
  notes: 10000,
};
const DATE_FIELDS = new Set([
  "stage_since",
  "next_step_date",
  "last_touch",
  "decision_date",
  "first_contact_at",
  "discovery_at",
  "sql_at",
  "data_access_at",
  "eval_agreed_at",
  "delivered_at",
  "first_test_at",
  "results_reviewed_at",
  "signed_at",
  "researched_on",
]);
const NUMBER_FIELDS = new Set(["sites", "current_spend_gel", "amount_gel", "team_hours"]);
const ENUM_FIELDS: Record<string, readonly string[]> = {
  kind: KINDS,
  org_type: ORG_TYPES,
  source: SOURCES,
  stage: STAGES,
  status: STATUSES,
  pain_status: PAIN_STATUSES,
};
const BOOL_FIELDS = new Set(["excluded"]);

export type Patch = Record<string, string | number | boolean | null>;

/** Copy only known account fields, normalised. Unknown keys are ignored; bad values are errors. */
export function cleanAccountFields(input: unknown): { patch: Patch; errors: string[] } {
  const patch: Patch = {};
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { patch, errors: ["fields must be an object"] };
  }
  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    if (key in TEXT_LIMITS) {
      if (raw === null || raw === undefined) {
        patch[key] = null;
      } else if (typeof raw !== "string") {
        errors.push(`${key} must be text`);
      } else if (raw.trim().length > TEXT_LIMITS[key]) {
        errors.push(`${key} is too long (max ${TEXT_LIMITS[key]} characters)`);
      } else {
        patch[key] = raw.trim() === "" ? null : raw.trim();
      }
    } else if (DATE_FIELDS.has(key)) {
      if (raw === null || raw === undefined || raw === "") {
        patch[key] = null;
      } else if (typeof raw !== "string" || !isIsoDate(raw)) {
        errors.push(`${key} must be a date (YYYY-MM-DD)`);
      } else {
        patch[key] = raw;
      }
    } else if (NUMBER_FIELDS.has(key)) {
      if (raw === null || raw === undefined || raw === "") {
        patch[key] = null;
        continue;
      }
      const n = typeof raw === "number"
        ? raw
        : typeof raw === "string"
        ? Number(raw.replace(/[\s,]/g, ""))
        : Number.NaN;
      if (!Number.isFinite(n) || n < 0 || n > 1e12) {
        errors.push(`${key} must be a positive number`);
      } else if (key === "sites" && !Number.isInteger(n)) {
        errors.push("sites must be a whole number");
      } else {
        patch[key] = n;
      }
    } else if (key in ENUM_FIELDS) {
      if (raw === null || raw === undefined || raw === "") {
        if (key === "kind") errors.push("kind is required");
        else patch[key] = null;
      } else if (typeof raw !== "string" || !ENUM_FIELDS[key].includes(raw)) {
        errors.push(`${key} has an unknown value`);
      } else {
        patch[key] = raw;
      }
    } else if (BOOL_FIELDS.has(key)) {
      if (typeof raw !== "boolean") errors.push(`${key} must be true or false`);
      else patch[key] = raw;
    }
  }
  if ("name" in patch && !patch.name) errors.push("name is required");
  return { patch, errors };
}

export function isIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function isUuid(v: unknown): v is string {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

/** Today in Tbilisi (the team's clock) as YYYY-MM-DD. */
export function tbilisiToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tbilisi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Entering a stage means the hospital did that stage's thing: record its milestone date once. */
export const STAGE_MILESTONE: Record<string, string> = {
  qualified: "sql_at",
  evaluation_agreed: "eval_agreed_at",
  evaluating: "first_test_at",
  proposal: "results_reviewed_at",
  won: "signed_at",
};

/**
 * Server-side rules applied to every create (current = null) and update.
 * - Only pipeline deals carry a stage; a deal without one starts at Discovery.
 * - A stage change restarts "in this stage since" and fills that stage's milestone date once.
 * - A target promoted into the pipeline gets a first-contact date if it had none.
 */
export function applyRules(
  current: Record<string, unknown> | null,
  patch: Patch,
  today: string,
): Patch {
  const out: Patch = { ...patch };
  const kind = (out.kind ?? current?.kind ?? "target") as string;
  const currentStage = (current?.stage ?? null) as string | null;

  if (kind !== "deal") {
    if (currentStage !== null || "stage" in out) out.stage = null;
  } else if (!("stage" in out ? out.stage : currentStage)) {
    out.stage = "discovery";
  }

  // A field the caller sends explicitly (even null, e.g. an Undo) is never overridden.
  const stageChanged = "stage" in out && out.stage !== currentStage;
  if (stageChanged) {
    if (out.stage === null) {
      out.stage_since = null;
    } else {
      if (!("stage_since" in patch)) out.stage_since = today;
      const milestone = STAGE_MILESTONE[out.stage as string];
      if (milestone && !(milestone in patch) && !current?.[milestone]) out[milestone] = today;
    }
  }

  const promoted = kind === "deal" && current !== null && current.kind !== "deal";
  if (promoted && !current?.first_contact_at && !("first_contact_at" in patch)) out.first_contact_at = today;
  if (kind === "deal" && !("status" in out ? out.status : current?.status)) out.status = "active";

  return out;
}

const DEMO_LIMITS: Record<string, number> = {
  firstName: 80,
  lastName: 80,
  email: 200,
  phone: 40,
  companyName: 200,
  companySize: 60,
  industry: 80,
  jobTitle: 120,
  facilityType: 80,
  numberOfProviders: 40,
  currentEHR: 300,
  useCase: 200,
  timeline: 60,
  budgetRange: 60,
  specificNeeds: 3000,
};
const DEMO_REQUIRED = ["firstName", "lastName", "email", "companyName"];

export type DemoRequest = Record<string, string>;

/** Validate the public "Request demo" form. Only known fields are kept. */
export function cleanDemoRequest(input: unknown): { request: DemoRequest; errors: string[] } {
  const request: DemoRequest = {};
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { request, errors: ["body must be an object"] };
  }
  const src = input as Record<string, unknown>;
  for (const [key, max] of Object.entries(DEMO_LIMITS)) {
    const raw = src[key];
    if (raw === undefined || raw === null || raw === "") continue;
    if (typeof raw !== "string") {
      errors.push(`${key} must be text`);
      continue;
    }
    const v = raw.trim();
    if (v.length > max) errors.push(`${key} is too long`);
    else if (v) request[key] = v;
  }
  for (const key of DEMO_REQUIRED) {
    if (!request[key]) errors.push(`${key} is required`);
  }
  if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
    errors.push("email is not valid");
  }
  return { request, errors };
}

/** Plain-text summary of a demo request for the activity timeline. */
export function formatDemoRequest(r: DemoRequest): string {
  const lines = [
    `Name: ${r.firstName} ${r.lastName}${r.jobTitle ? ` (${r.jobTitle})` : ""}`,
    `Email: ${r.email}`,
    r.phone && `Phone: ${r.phone}`,
    `Organization: ${r.companyName}${r.companySize ? `, ${r.companySize} staff` : ""}`,
    (r.facilityType || r.numberOfProviders) &&
    `Facility: ${[r.facilityType, r.numberOfProviders && `${r.numberOfProviders} providers`].filter(Boolean).join(", ")}`,
    r.industry && `Industry: ${r.industry}`,
    r.currentEHR && `Current systems: ${r.currentEHR}`,
    r.useCase && `Main interest: ${r.useCase}`,
    r.timeline && `Timeline: ${r.timeline}`,
    r.budgetRange && `Budget: ${r.budgetRange}`,
    r.specificNeeds && `Needs: ${r.specificNeeds}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/** Escape LIKE wildcards so a company name matches literally. */
export function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

import type { Account } from "../data/crm";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://kvsqtolsjggpyvdtdpss.supabase.co";
const API = `${SUPABASE_URL}/functions/v1/track-event`;

/** The page-level CRM caller every screen receives. */
export type Api = <T>(action: string, payload?: Record<string, unknown>) => Promise<T>;

export class CrmError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: string[];
  /** On a 409 conflict: the version someone else saved. */
  readonly account: Account | null;

  constructor(status: number, code: string, details: string[] = [], account: Account | null = null) {
    super(code);
    this.status = status;
    this.code = code;
    this.details = details;
    this.account = account;
  }
}

const AUTHOR_KEY = "mm-crm-author";

/** Who is working in the CRM on this browser. Shown on timeline entries. */
export function readAuthor(): string {
  try {
    return localStorage.getItem(AUTHOR_KEY) ?? "";
  } catch {
    return ""; // storage blocked (private window): the name lasts for this visit only
  }
}

export function writeAuthor(name: string): void {
  try {
    localStorage.setItem(AUTHOR_KEY, name);
  } catch {
    // storage blocked: the in-memory choice still applies for this visit
  }
}

interface ErrorBody {
  error?: string;
  details?: string[];
  account?: Account;
}

async function post(route: string, body: unknown, jwt?: string): Promise<{ status: number; json: unknown }> {
  let res: Response;
  try {
    res = await fetch(`${API}?route=${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new CrmError(0, "network");
  }
  const json: unknown = await res.json().catch(() => null);
  return { status: res.status, json };
}

/** One CRM API call. Throws CrmError on any non-2xx answer. */
export async function crmCall<T>(jwt: string, action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const { status, json } = await post("crm", { action, author: readAuthor() || null, ...payload }, jwt);
  if (status < 200 || status >= 300) {
    const b = (json ?? {}) as ErrorBody;
    throw new CrmError(status, b.error ?? "server", b.details ?? [], b.account ?? null);
  }
  return json as T;
}

/** Same check as the admin login page. Returns the session, or null for a wrong password. */
export async function adminLogin(password: string): Promise<{ token: string; exp: number } | null> {
  const { json } = await post("admin-login", { password });
  const b = (json ?? {}) as { ok?: boolean; token?: string; exp?: number };
  return b.ok && b.token && b.exp ? { token: b.token, exp: b.exp } : null;
}

export function describeError(e: unknown): string {
  if (!(e instanceof CrmError)) return "Something went wrong. Try again.";
  if (e.status === 0) return "Couldn't reach the server. Check your connection and try again.";
  if (e.status === 401) return "Your admin session ended. Log in again to continue; your edits are kept.";
  if (e.status === 409) return "Someone saved this hospital a moment ago. Their version is loaded and your unsaved edits are kept.";
  if (e.status === 404) return "This record no longer exists.";
  if (e.status === 400 && e.details.length) return e.details.join(". ");
  return "The server couldn't save that. Try again.";
}

export type DemoResult = "ok" | "invalid" | "rate_limited" | "error";

/** Public: the website's "Request demo" form. */
export async function submitDemoRequest(form: Record<string, string>): Promise<DemoResult> {
  try {
    const { status } = await post("demo-request", form);
    if (status >= 200 && status < 300) return "ok";
    if (status === 400) return "invalid";
    if (status === 429) return "rate_limited";
    return "error";
  } catch {
    return "error";
  }
}

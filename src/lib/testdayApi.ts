// Client for the Mtskheta test-day portal (/admin/testday). Everything goes through the gated
// track-event?route=testday function; nothing about staff or seats lives in this bundle.

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "https://kvsqtolsjggpyvdtdpss.supabase.co";
const API = `${SUPABASE_URL}/functions/v1/track-event?route=testday`;

export interface Flow { w: string; steps: string[]; result: string }
export interface Department {
  slug: string; title: string; sort: number; warn: string | null; seat_note: string | null;
  seats: string[]; flows: Flow[]; teach: { h: string; t: string }[];
}
export interface User {
  id: number; dept_slug: string; name: string; title: string | null; logins: string | null; how: string | null;
  roles: string; first_screen: string; spot: string[]; seat_ok: boolean; sort: number;
}
export interface UserCheck {
  user_id: number; signed_in: boolean; sign_in_failed: boolean; key_screen_ok: boolean; actions_ok: boolean;
  note: string | null; checked_by: string | null; checked_at: string;
}
export interface FlowCheck { dept_slug: string; flow_idx: number; done: boolean; note: string | null; checked_by: string | null; checked_at: string }
// Life of an item: open → work → fixed (please re-check) → closed (tester confirmed) | open (still broken);
// answered = training or a decision. pr and wontfix are day-1 values that stay readable.
export type IssueStatus = "open" | "work" | "pr" | "fixed" | "closed" | "answered" | "wontfix";
export interface Issue {
  id: number; created_at: string; dept_slug: string | null; person: string | null; screen: string | null; what: string;
  expected: string | null; pr_url: string | null; status: IssueStatus; reported_by: string | null; updated_at: string;
  // Added by migration 0007; optional so a row from before it still reads.
  user_id?: number | null; flow_idx?: number | null; answer?: string | null; recheck_note?: string | null;
  source?: string | null; ref?: string | null; fixed_at?: string | null; closed_at?: string | null;
}
export interface Seat { email: string; role: string | null; password: string | null }
export interface Note { dept_slug: string; handin: Record<string, string>; updated_by: string | null; updated_at: string }
export interface State {
  departments: Department[]; users: User[]; userChecks: UserCheck[]; flowChecks: FlowCheck[];
  issues: Issue[]; seats: Seat[]; notes: Note[]; at: string;
}

// Local fake data (Vite dev server + ?mock only). import.meta.env.DEV is false in production builds,
// so the mock module is never fetched there. ?mock=error and ?mock=slow show the error and loading states.
const MOCK = (() => {
  if (!import.meta.env.DEV) return false;
  try {
    const m = new URLSearchParams(window.location.search).get("mock");
    if (m !== null) sessionStorage.setItem("td-mock", m);
    return sessionStorage.getItem("td-mock") !== null;
  } catch { return false; }
})();
const mock = () => import("./testdayMock");

export class TdError extends Error {
  constructor(readonly status: number, code: string) { super(code); }
}

async function post<T>(body: Record<string, unknown>, token?: string): Promise<T> {
  if (MOCK) {
    const m = await mock();
    if (body.action === "login") return { token: "mock", exp: Date.now() / 1000 + 50_000 } as T;
    try {
      if (body.action === "state") return (await m.mockState()) as T;
      return { row: await m.mockWrite(String(body.action), body) } as T;
    } catch { throw new TdError(0, "network"); }
  }
  let res: Response;
  try {
    res = await fetch(API, {
      method: "POST",
      // A hung hospital Wi-Fi request fails after 15 s, so the page can say so and retry.
      signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(15_000) : undefined, // old iPhones lack it
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
  } catch {
    throw new TdError(0, "network");
  }
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new TdError(res.status, json.error ?? "server");
  return json as T;
}

export async function tdLogin(password: string): Promise<{ token: string; exp: number } | "wrong" | "locked" | "off" | "network"> {
  try {
    const r = await post<{ token: string; exp: number }>({ action: "login", password });
    return r;
  } catch (e) {
    const s = (e as TdError).status;
    return s === 429 ? "locked" : s === 503 ? "off" : s === 0 ? "network" : "wrong";
  }
}

export const tdState = (token: string) => post<State>({ action: "state" }, token);
export const tdWrite = <T>(token: string, action: string, payload: Record<string, unknown>) =>
  post<{ row: T }>({ action, ...payload }, token).then((r) => r.row);

// ---- this browser's session and tester name ----
const SESSION = "mm-testday-session";
const NAME = "mm-testday-name";
const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => {
  try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* private window */ }
};
export function loadSession(): string | null {
  try {
    const s = JSON.parse(read(SESSION) ?? "null") as { token: string; exp: number } | null;
    return s && s.exp > Date.now() / 1000 + 60 ? s.token : null;
  } catch { return null; }
}
export const saveSession = (s: { token: string; exp: number } | null) => write(SESSION, s ? JSON.stringify(s) : null);
export const loadName = () => read(NAME) ?? "";
export const saveName = (n: string) => write(NAME, n);

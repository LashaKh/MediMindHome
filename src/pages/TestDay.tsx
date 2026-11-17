// Mtskheta test-day portal (medimind.md/admin/testday).
// One idea: a ward checklist you work with your thumb. Find the person, tap "all fine", tap "problem".
// Gate → tester name → departments / department page / issues / overview. A problem is reported from anywhere in
// one sheet that already knows who, where and which action; only "what happened" is typed.
// All data (names, WebMed logins, seats) comes from the gated testday API; this file holds only UI wording.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  loadName, loadSession, saveName, saveSession, TdError, tdLogin, tdState, tdWrite,
  type Department, type FlowCheck, type Issue, type IssueStatus, type Note, type State, type User, type UserCheck,
} from "../lib/testdayApi";
import "./TestDay.css";
import { TestDayAcceptance } from "./TestDayAcceptance";

const SHADOW = "https://emr-shadow.gh.ge:8443";
const BASE = "/admin/testday";
const POLL_MS = 30_000;

const RULE = [
  "ყველაფერი კეთდება რეალური თანამშრომლის საკუთარი ანგარიშით.",
  "სატესტო ანგარიში (mts.*) მხოლოდ მაშინ, როცა სხვაგვარად შეუძლებელია: ადამიანი არ არის, ვერ შედის ან უფლება აკლია. ჩაწერეთ მიზეზი.",
  "სკრინშოტზე არ უნდა ჩანდეს პაციენტის სახელი და პირადი ნომერი: PR-ს მთელი გუნდი ხედავს.",
];
const MISSION = [
  ["ტრენინგი", "ხელით, თანამშრომლის გვერდით, მის რეალურ საქმეზე."],
  ["სია", "სწორია თუ არა სია: ვინ მუშაობს აქ, რა როლით, ვინ აკლია, ვინ აღარ მუშაობს."],
  ["შესვლა", "ყველა შედის საკუთარი WebMed-ის მომხმარებლით და ხედავს თავის ძირითად ეკრანს."],
  ["უფლებები", "დღის მოქმედებები ამ ადამიანის ანგარიშით. სატესტო ანგარიში უფლებებზე ვერაფერს გვეტყვის."],
  ["სარკე", "რასაც თანამშრომელი WebMed-ში აკეთებს, იმავე პაციენტზე გაიმეორეთ MediMind-ში."],
  ["ხარვეზები", "ყოველი ხარვეზი ჩაწერეთ აქ, ხარვეზების გვერდზე."],
];
const MORNING = [
  "სიის ყველა ადამიანი შედის თავისი WebMed-ის მომხმარებლით და პაროლით. მონიშნეთ „შევიდა“.",
  "ვინც ვერ შევიდა: მონიშნეთ „ვერ შევიდა“ და შენიშვნაში ჩაწერეთ შეცდომის ზუსტი ტექსტი.",
  "ვინც შევიდა, მაგრამ ძირითადი ეკრანი არ ჩანს: შენიშვნაში ჩაწერეთ, რა ჩანს, და დაარეგისტრირეთ ხარვეზი.",
];
// Five stages people see. Day-1 values fold in: pr reads as "in work", wontfix as "answered".
type Stage = "open" | "work" | "fixed" | "closed" | "answered";
const stage = (s: IssueStatus): Stage => (s === "pr" ? "work" : s === "wontfix" ? "answered" : s);
const STAGE_KA: Record<Stage, string> = { open: "ღია", work: "მუშავდება", fixed: "გასწორდა, გადაამოწმეთ", closed: "დადასტურდა", answered: "პასუხი მიიღო" };
const STATUS_KA: Record<IssueStatus, string> = { ...STAGE_KA, pr: STAGE_KA.work, wontfix: STAGE_KA.answered };
const TEAM_STAGES: Stage[] = ["open", "work", "fixed", "answered", "closed"];
// Waiting for the tester first, then open, in work, and the finished ones last.
const STAGE_ORDER: Record<Stage, number> = { fixed: 0, open: 1, work: 2, answered: 3, closed: 4 };
const sortIssues = (l: Issue[]) => [...l].sort((a, b) => STAGE_ORDER[stage(a.status)] - STAGE_ORDER[stage(b.status)] || b.id - a.id);
const isSolved = (i: Issue) => stage(i.status) === "closed" || stage(i.status) === "answered";
const HANDIN = [
  ["failed", "ვინ ვერ შევიდა (WebMed № და მიზეზი)"],
  ["prs", "გახსნილი PR-ები"],
  ["asks", "რა მოითხოვეს თანამშრომლებმა, რასაც MediMind ჯერ არ აკეთებს"],
  ["roster", "სიის შესწორებები: ვინ აკლია სიას, ვინ აღარ მუშაობს, ვის აქვს სხვა როლი (ხარვეზები აქ არ იწერება)"],
  ["other", "სხვა შენიშვნა"],
] as const;

// Georgian quotes open low („) and close high (“).
const q = (s: string) => s.replace(/„([^"„]*)"/gu, "„$1“");
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tbilisi" });
const done = (c?: UserCheck) => !!c && c.signed_in && c.key_screen_ok && c.actions_ok;
const problem = (c?: UserCheck) => !!c && c.sign_in_failed;
// Still on our side: open or in work. A fixed item waits for the tester and is counted on its own.
const isActive = (i: Issue) => stage(i.status) === "open" || stage(i.status) === "work";
// A real mouse means a desk computer: there the search box may take the focus without opening a phone keyboard.
const finePointer = () => typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches;

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("დაკოპირდა", { duration: 1200 });
  } catch {
    toast.error("ვერ დაკოპირდა");
  }
}

// ───────────────────────── root ─────────────────────────
export function TestDay() {
  const [token, setToken] = useState<string | null>(() => loadSession());
  const [name, setName] = useState(() => loadName());
  // ?redact blurs names and logins, for screenshots that leave the team.
  const [redact] = useState(() => new URLSearchParams(window.location.search).has("redact"));

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prev = document.title;
    document.title = "მცხეთა · სატესტო დღე";
    return () => { meta.remove(); document.title = prev; };
  }, []);

  const logout = useCallback(() => { saveSession(null); setToken(null); }, []);

  return (
    <div className={redact ? "td td-redact" : "td"}>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "inherit", fontSize: 14 } }} />
      {!token ? (
        <Gate onIn={(s) => { saveSession(s); setToken(s.token); }} />
      ) : !name ? (
        <NameStep token={token} onName={(n) => { saveName(n); setName(n); }} />
      ) : (
        <Portal token={token} name={name} onLogout={logout} onRename={() => setName("")} />
      )}
    </div>
  );
}

function Gate({ onIn }: { onIn: (s: { token: string; exp: number }) => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim() || busy) return;
    setBusy(true);
    setErr("");
    const r = await tdLogin(pw.trim());
    setBusy(false);
    if (typeof r === "object") return onIn(r);
    setErr({
      wrong: "პაროლი არასწორია. შეამოწმეთ ასოების სიდიდე და კლავიატურის ენა.",
      locked: "ძალიან ბევრი მცდელობა. სცადეთ 15 წუთში.",
      off: "პორტალი ჯერ არ არის ჩართული. დაუკავშირდით დამფუძნებელს.",
      network: "სერვერს ვერ დავუკავშირდით. შეამოწმეთ ინტერნეტი.",
    }[r]);
  };
  return (
    <form className="td-gate" onSubmit={submit}>
      <img src="/favicon.svg" alt="" width={44} height={44} />
      <div className="td-kicker">MediMind · მხოლოდ გუნდისთვის</div>
      <h1>მცხეთის სატესტო დღე</h1>
      <label className="td-label" htmlFor="td-pw">გუნდის პაროლი</label>
      {/* Phones capitalise and "correct" words: switched off, and the password can be shown to check it. */}
      <div className="td-pw">
        <input id="td-pw" className="td-input" type={show ? "text" : "password"} autoComplete="current-password" autoFocus
          autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-invalid={!!err}
          value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} />
        <button type="button" className="td-mini" onClick={() => setShow(!show)} aria-pressed={show}>{show ? "დამალვა" : "ჩვენება"}</button>
      </div>
      {err && <p className="td-err" role="alert">{err}</p>}
      <button className="td-btn td-btn-primary" disabled={busy || !pw}>{busy ? "მოწმდება…" : "შესვლა"}</button>
    </form>
  );
}

// Who is ticking. Type the first letters of a name or a WebMed user and pick from the list (that also opens the
// person's card), or keep what you typed. The list loads in the background; without it, free text still works.
function NameStep({ token, onName }: { token: string; onName: (n: string) => void }) {
  const [n, setN] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const nav = useNavigate();
  useEffect(() => { tdState(token).then((s) => setUsers(s.users)).catch(() => {}); }, [token]);
  const qq = n.trim().toLowerCase();
  const found = qq ? users.filter((u) => u.name.toLowerCase().split(/\s+/).some((w) => w.startsWith(qq)) || u.name.toLowerCase().startsWith(qq)
    || (u.logins ?? "").toLowerCase().split(/[\s,]+/).some((l) => l.startsWith(qq))).slice(0, 6) : [];
  const pick = (u: User) => { onName(u.name); nav(`${BASE}/d/${u.dept_slug}#u${u.id}`); };
  return (
    <form className="td-gate" onSubmit={(e) => { e.preventDefault(); if (found.length === 1) pick(found[0]); else if (n.trim()) onName(n.trim()); }}>
      <h1>ვინ ხართ?</h1>
      <p className="td-muted">აკრიფეთ თქვენი სახელი ან WebMed-ის მომხმარებელი და აირჩიეთ სიიდან. ეს მხოლოდ ერთხელ დაგჭირდებათ ამ მოწყობილობაზე.</p>
      <input className="td-input" autoFocus value={n} onChange={(e) => setN(e.target.value)} placeholder="სახელი ან WebMed-ის მომხმარებელი" maxLength={60}
        autoCapitalize="none" autoCorrect="off" spellCheck={false} />
      {found.length > 0 && (
        <ul className="td-find-list td-find-static" role="listbox">
          {found.map((u) => (
            <li key={u.id}><button type="button" onClick={() => pick(u)}>
              <span className="td-find-main"><span className="td-find-name">{u.name}</span><span className="td-sub">{u.roles}{u.logins ? ` · ${u.logins}` : ""}</span></span>
            </button></li>
          ))}
        </ul>
      )}
      <button className="td-btn td-btn-primary" disabled={!n.trim()}>{found.length === 1 ? "ეს მე ვარ" : "დაწყება"}</button>
    </form>
  );
}

// ───────────────────────── data + writes ─────────────────────────
type Write = <T>(action: string, payload: Record<string, unknown>, optimistic: (s: State) => State, apply: (s: State, row: T) => State) => void;
// What the problem sheet already knows when it opens: department, person, action. Only "what happened" is typed.
interface ReportCtx { dept?: string; person?: string; screen?: string; expected?: string; userId?: number; flowIdx?: number }
const ReportContext = createContext<(ctx: ReportCtx) => void>(() => {});
const useReport = () => useContext(ReportContext);

function Portal({ token, name, onLogout, onRename }: { token: string; name: string; onLogout: () => void; onRename: () => void }) {
  const [state, setState] = useState<State | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [report, setReport] = useState<ReportCtx | null>(null);
  const pending = useRef(0);
  const { pathname } = useLocation();

  const refresh = useCallback(async () => {
    if (pending.current > 0) return; // a save is in flight: don't overwrite the optimistic view
    try {
      const s = await tdState(token);
      if (pending.current === 0) setState(s);
      setLoadErr(false);
    } catch (e) {
      if (e instanceof TdError && e.status === 401) return onLogout();
      setLoadErr(true);
      setTimeout(refresh, 5000); // don't wait a full poll when the connection drops
    }
  }, [token, onLogout]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, POLL_MS);
    const vis = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(t); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", vis); };
  }, [refresh]);

  const write: Write = useCallback((action, payload, optimistic, apply) => {
    let before: State | null = null;
    setState((s) => { before = s; return s ? optimistic(s) : s; });
    pending.current++;
    const attempt = async (n: number): Promise<void> => {
      try {
        const row = await tdWrite<never>(token, action, { ...payload, by: name });
        pending.current--;
        setState((s) => (s ? apply(s, row) : s));
      } catch (e) {
        if (e instanceof TdError && e.status === 401) { pending.current--; return onLogout(); }
        if (n < 3) {
          if (n === 0) toast.loading("ვერ შეინახა, ხელახლა ვცდი…", { id: "retry" });
          await new Promise((r) => setTimeout(r, [1000, 3000, 6000][n]));
          return attempt(n + 1);
        }
        pending.current--;
        toast.dismiss("retry");
        toast.error("ვერ შეინახა. შეამოწმეთ ინტერნეტი და სცადეთ ისევ.", { duration: 6000 });
        if (before) setState(before);
        return;
      }
      toast.dismiss("retry");
    };
    attempt(0);
  }, [token, name, onLogout]);

  const parts = pathname.replace(BASE, "").split("/").filter(Boolean);
  const view = parts[0] ?? "";
  const slug = view === "d" ? parts[1] : undefined;
  const openCount = state ? state.issues.filter(isActive).length : null;

  return (
    <ReportContext.Provider value={setReport}>
      <header className="td-top">
        <div className="td-top-in">
          <Link to={BASE} className="td-brand"><img src="/favicon.svg" alt="" width={24} height={24} /><span>სატესტო დღე</span></Link>
          <nav className="td-nav">
            <Link to={BASE} className={view === "" || view === "d" ? "on" : ""}>განყოფილებები</Link>
            <Link to={`${BASE}/acceptance`} className={view === "acceptance" ? "on" : ""}>მიღება</Link>
            <Link to={`${BASE}/issues`} className={view === "issues" ? "on" : ""}>ხარვეზები{openCount ? <b>{openCount}</b> : null}</Link>
            <Link to={`${BASE}/overview`} className={view === "overview" ? "on" : ""}>მიმოხილვა</Link>
          </nav>
          {state && view !== "" && <div className="td-top-find"><FindPerson state={state} compact /></div>}
          <button className="td-me" onClick={onRename} title="სახელის შეცვლა">{name}</button>
        </div>
      </header>
      {loadErr && state && <div className="td-banner" role="status">კავშირი გაწყდა. ბოლო მონაცემებს ვაჩვენებ, ვცდი ხელახლა.</div>}
      <main className="td-main">
        {!state ? (
          loadErr ? (
            <div className="td-state" role="alert">
              <b>სერვერს ვერ დავუკავშირდით</b>
              <span>შეამოწმეთ ინტერნეტი. ვცდილობთ ხელახლა ყოველ 5 წამში.</span>
              <button className="td-btn td-btn-ghost" onClick={refresh}>ახლავე ცდა</button>
            </div>
          ) : <Skeleton />
        ) : slug ? (
          <DeptPage state={state} slug={slug} write={write} />
        ) : view === "issues" ? (
          <IssuesPage state={state} write={write} />
        ) : view === "acceptance" ? (
          <TestDayAcceptance roster={state} slug={parts[1]} token={token} name={name} onLogout={onLogout}
            onReport={(test) => setReport({ dept: "billing", screen: `${test[0]} · ${test[1]}`, expected: test[4] })} />
        ) : view === "overview" ? (
          <Overview state={state} />
        ) : (
          <Picker state={state} />
        )}
      </main>
      {state && !(view === "acceptance" && parts[1] === "billing") && (
        <button className="td-fab" onClick={() => setReport({ dept: slug })}>
          <span aria-hidden="true">!</span> ხარვეზის ჩაწერა
        </button>
      )}
      {state && report && <ReportSheet state={state} ctx={report} write={write} onClose={() => setReport(null)} />}
    </ReportContext.Provider>
  );
}

function Skeleton() {
  return (
    <div className="td-pad" aria-busy="true" aria-label="იტვირთება">
      <div className="td-sk td-sk-h" />
      <div className="td-grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="td-sk td-sk-card" />)}</div>
    </div>
  );
}

// ───────────────────────── stats ─────────────────────────
// idle = signed in, but neither the main screen nor an action is ticked: someone has to go and walk them through.
interface DeptStat { total: number; done: number; partial: number; signed: number; failed: number; flowsDone: number; open: number; idle: number }
type DeptState = "empty" | "todo" | "going" | "done";
function deptState(s: DeptStat, flows: number): DeptState {
  if (s.total === 0 && s.flowsDone === 0) return "empty";
  if (s.done === s.total && s.flowsDone === flows) return "done";
  if (s.signed + s.failed + s.flowsDone + s.partial > 0) return "going";
  return "todo";
}
const STATE_KA: Record<DeptState, string> = { empty: "სია ცარიელია", todo: "არ დაწყებულა", going: "მიმდინარეობს", done: "დასრულდა" };

function useStats(state: State) {
  return useMemo(() => {
    const checks = new Map(state.userChecks.map((c) => [c.user_id, c]));
    const flows = new Map(state.flowChecks.map((f) => [`${f.dept_slug}:${f.flow_idx}`, f]));
    const by = new Map<string, DeptStat>();
    for (const d of state.departments) {
      by.set(d.slug, {
        total: 0, done: 0, partial: 0, signed: 0, failed: 0, open: 0, idle: 0,
        flowsDone: d.flows.filter((_, i) => flows.get(`${d.slug}:${i}`)?.done).length,
      });
    }
    for (const u of state.users) {
      const s = by.get(u.dept_slug);
      if (!s) continue;
      const c = checks.get(u.id);
      s.total++;
      if (done(c)) s.done++;
      else if (c && !problem(c) && (c.signed_in || c.key_screen_ok || c.actions_ok)) s.partial++;
      if (c?.signed_in) s.signed++;
      if (problem(c)) s.failed++;
      if (c?.signed_in && !c.key_screen_ok && !c.actions_ok) s.idle++;
    }
    for (const i of state.issues) if (i.dept_slug && isActive(i)) { const s = by.get(i.dept_slug); if (s) s.open++; }
    const all = [...by.values()].reduce((a, s) => ({
      total: a.total + s.total, done: a.done + s.done, partial: a.partial + s.partial, signed: a.signed + s.signed,
      failed: a.failed + s.failed, flowsDone: a.flowsDone + s.flowsDone, open: a.open, idle: a.idle + s.idle,
    }), { total: 0, done: 0, partial: 0, signed: 0, failed: 0, flowsDone: 0, open: state.issues.filter(isActive).length, idle: 0 });
    return { checks, flows, by, all };
  }, [state]);
}

// One bar, four colours: fully checked, started, could not sign in, not yet touched.
function Bar({ s }: { s: Pick<DeptStat, "total" | "done" | "partial" | "failed"> }) {
  const pct = (n: number) => (s.total ? `${(n / s.total) * 100}%` : "0%");
  return (
    <div className="td-bar" aria-hidden="true">
      <i className="b-done" style={{ width: pct(s.done) }} />
      <i className="b-part" style={{ width: pct(s.partial) }} />
      <i className="b-fail" style={{ width: pct(s.failed) }} />
    </div>
  );
}

// ───────────────────────── find a person (whole hospital) ─────────────────────────
// Keyboard first: "/" focuses it anywhere, arrows move, Enter opens. One letter is enough.
function FindPerson({ state, compact, autoFocus }: { state: State; compact?: boolean; autoFocus?: boolean }) {
  const { checks } = useStats(state);
  const nav = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const [find, setFind] = useState("");
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(false);
  const qq = find.trim().toLowerCase();
  const found = useMemo(() => {
    if (!qq) return [];
    const hit = (u: User) => {
      const n = u.name.toLowerCase();
      if (n.startsWith(qq) || n.split(/\s+/).some((w) => w.startsWith(qq))) return 0;
      if ((u.logins ?? "").toLowerCase().split(/[\s,]+/).some((l) => l.startsWith(qq))) return 0;
      return n.includes(qq) || (u.logins ?? "").toLowerCase().includes(qq) ? 1 : 2;
    };
    return state.users.map((u) => [u, hit(u)] as const).filter(([, h]) => h < 2).sort((a, b) => a[1] - b[1]).slice(0, 8).map(([u]) => u);
  }, [qq, state.users]);
  const deptTitle = (slug: string) => state.departments.find((d) => d.slug === slug)?.title ?? "";
  const go = (u: User) => { setFind(""); setOpen(false); ref.current?.blur(); nav(`${BASE}/d/${u.dept_slug}#u${u.id}`); };

  useEffect(() => {
    if (autoFocus && finePointer()) ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) { e.preventDefault(); ref.current?.focus(); }
    };
    // Only one box listens: the page's own box when there is one, else the top bar's.
    if (compact && document.querySelector(".td-find-big")) return;
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [autoFocus, compact]);

  return (
    <div className={compact ? "td-find td-find-compact" : "td-find td-find-big"} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <input ref={ref} className="td-input" type="search" enterKeyHint="go" autoComplete="off"
        placeholder={compact ? "ძებნა: სახელი ან WebMed" : "ვის ეძებთ? სახელი ან WebMed მომხმარებელი"}
        aria-label="თანამშრომლის ძებნა" value={find}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setFind(e.target.value); setSel(0); setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setSel((i) => Math.min(i + 1, found.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setSel((i) => Math.max(i - 1, 0)); }
          if (e.key === "Enter" && found[sel]) { e.preventDefault(); go(found[sel]); }
          if (e.key === "Escape") { setFind(""); ref.current?.blur(); }
        }} />
      {!compact && !qq && <kbd className="td-kbd" aria-hidden="true">/</kbd>}
      {open && qq && (
        <ul className="td-find-list" role="listbox">
          {found.length === 0 && <li className="td-find-none">ვერავინ მოიძებნა. სცადეთ გვარი ან WebMed-ის ნომერი.</li>}
          {found.map((u, i) => {
            const c = checks.get(u.id);
            const st = done(c) ? "ok" : problem(c) ? "bad" : c ? "part" : "";
            return (
              <li key={u.id} role="option" aria-selected={i === sel}>
                <button type="button" className={i === sel ? "on" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(u)}>
                  <span className={`td-dot ${st}`} aria-hidden="true" />
                  <span className="td-find-main"><span className="td-find-name">{u.name}</span><span className="td-sub">{u.roles}{u.logins ? ` · ${u.logins}` : ""}</span></span>
                  <span className="td-tag">{deptTitle(u.dept_slug)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ───────────────────────── departments (home) ─────────────────────────
function Picker({ state }: { state: State }) {
  const { by, all, checks } = useStats(state);
  const title = (slug: string | null) => state.departments.find((d) => d.slug === slug)?.title ?? "";
  const failed = state.users.filter((u) => problem(checks.get(u.id)));
  const open = state.issues.filter(isActive);
  return (
    <div className="td-pad td-split">
      <div className="td-split-main">
        <div className="td-hero">
          <div className="td-kicker">მცხეთა · Shadow · <a className="td-link" href={SHADOW} target="_blank" rel="noreferrer">{SHADOW.replace("https://", "")}</a></div>
          <h1>ვის ამოწმებთ?</h1>
        </div>
        <FindPerson state={state} autoFocus />
        <h2 className="td-grid-h">განყოფილებები</h2>
        <div className="td-grid">
          {state.departments.map((d) => {
            const s = by.get(d.slug)!;
            const st = deptState(s, d.flows.length);
            return (
              <Link key={d.slug} to={`${BASE}/d/${d.slug}`} className={`td-dept st-${st}`}>
                <div className="td-dept-top">
                  <span className="td-dept-title">{d.title}</span>
                  <span className={`td-pill p-${st}`}>{STATE_KA[st]}</span>
                </div>
                <div className="td-dept-nums">
                  <span><b>{s.done}</b>/{s.total} ადამიანი</span>
                  <span><b>{s.flowsDone}</b>/{d.flows.length} მოქმედება</span>
                </div>
                <Bar s={s} />
                {(s.failed > 0 || s.open > 0) && (
                  <div className="td-dept-tags">
                    {s.failed > 0 && <span className="td-tag td-tag-red">{s.failed} ვერ შევიდა</span>}
                    {s.open > 0 && <span className="td-tag td-tag-amber">{s.open} ხარვეზი</span>}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <aside className="td-side">
        <div className="td-card td-side-sum">
          <div className="td-big"><b>{all.done}</b><span>/ {all.total} შემოწმდა</span></div>
          <Bar s={all} />
          <div className="td-legend">
            <span><i className="b-done" />სრულად {all.done}</span>
            <span><i className="b-part" />დაწყებული {all.partial}</span>
            <span><i className="b-fail" />ვერ შევიდა {all.failed}</span>
          </div>
          <Link to={`${BASE}/overview`} className="td-link">სრული მიმოხილვა</Link>
        </div>
        {(failed.length > 0 || open.length > 0) && (
          <div className="td-card td-side-list">
            <h3>ყურადღება სჭირდება</h3>
            <ul>
              {failed.slice(0, 4).map((u) => (
                <li key={`u${u.id}`}><Link to={`${BASE}/d/${u.dept_slug}#u${u.id}`}><span className="td-dot bad" /><span><span className="td-find-name">{u.name}</span><span className="td-sub"> ვერ შევიდა · {title(u.dept_slug)}</span></span></Link></li>
              ))}
              {open.slice(0, 4).map((i) => (
                <li key={`i${i.id}`}><Link to={`${BASE}/issues`}><span className="td-dot warn" /><span><span className="td-clamp">{i.what}</span><span className="td-sub"> {title(i.dept_slug) || "საერთო"}</span></span></Link></li>
              ))}
            </ul>
          </div>
        )}
        <details className="td-card td-rules">
          <summary>დღის მისია და მთავარი წესი</summary>
          <ol className="td-mission">{MISSION.map(([k, t]) => <li key={k}><b>{k}.</b> {t}</li>)}</ol>
          <h3>მთავარი წესი</h3>
          <ul>{RULE.map((r) => <li key={r}>{r}</li>)}</ul>
        </details>
      </aside>
    </div>
  );
}

// ───────────────────────── department page ─────────────────────────
const SECTIONS = [["flows", "მოქმედებები"], ["people", "ხალხი"], ["issues", "ხარვეზები"], ["help", "დახმარება"], ["handin", "ჩაბარება"]] as const;
const SECTION_IDS = SECTIONS.map(([id]) => id);

// Which section is on screen, so the contents can highlight it.
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, [ids]);
  return active;
}
const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function DeptPage({ state, slug, write }: { state: State; slug: string; write: Write }) {
  const dept = state.departments.find((d) => d.slug === slug);
  const stats = useStats(state);
  const active = useActiveSection(SECTION_IDS);
  const report = useReport();
  const { hash } = useLocation();
  const tocRef = useRef<HTMLElement>(null);
  const [flash, setFlash] = useState<string | null>(null);
  useEffect(() => {
    const chip = tocRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (chip && tocRef.current) tocRef.current.scrollLeft = chip.offsetLeft - tocRef.current.offsetLeft - 12;
  }, [active]);
  // Arriving from the search (#u<id>): bring that person to the middle of the screen and light the card up.
  useEffect(() => {
    if (!hash.startsWith("#u")) {
      const sec = hash.slice(1);
      if (sec === "accounts" || (SECTION_IDS as readonly string[]).includes(sec)) setTimeout(() => jump(sec), 60); else window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    const to = (smooth: boolean) => document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
    const t = setTimeout(() => { to(true); setFlash(id); }, 60);
    // Cards above may still grow (fonts, wrapping) while the first scroll runs: settle once more.
    const t1 = setTimeout(() => to(false), 700);
    const t2 = setTimeout(() => setFlash(null), 2600);
    return () => { clearTimeout(t); clearTimeout(t1); clearTimeout(t2); };
  }, [slug, hash]);
  if (!dept) return <div className="td-pad"><div className="td-state"><b>განყოფილება ვერ მოიძებნა</b><Link className="td-btn td-btn-ghost" to={BASE}>ყველა განყოფილება</Link></div></div>;
  const s = stats.by.get(slug)!;
  const st = deptState(s, dept.flows.length);
  const users = state.users.filter((u) => u.dept_slug === slug);
  const issues = state.issues.filter((i) => i.dept_slug === slug);
  const toc = (cls: string) => (
    <nav className={cls} aria-label="ნაწილები" ref={cls === "td-toc" ? tocRef : undefined}>
      {SECTIONS.map(([id, label]) => (
        <a key={id} data-id={id} href={`#${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined}
          onClick={(e) => { e.preventDefault(); jump(id); }}>
          {label}
          {id === "people" && <small>{s.done}/{s.total}</small>}
          {id === "flows" && <small>{s.flowsDone}/{dept.flows.length}</small>}
          {id === "issues" && s.open > 0 && <small className="amber">{s.open}</small>}
        </a>
      ))}
    </nav>
  );
  return (
    <div>
      {/* Phone: one sticky bar with name, progress and contents. Desktop uses the side panel instead. */}
      <div className="td-stick">
        <div className="td-stick-row">
          <Link to={BASE} className="td-stick-back" aria-label="ყველა განყოფილება">←</Link>
          <div className="td-stick-title">{dept.title}</div>
          <div className="td-stick-num" title="სრულად შემოწმდა"><b>{s.done}</b>/{s.total}</div>
        </div>
        <div className="td-stick-bar"><Bar s={s} /></div>
        {toc("td-toc")}
      </div>
      <div className="td-pad td-split">
        <div className="td-split-main td-sections">
          <div className="td-dept-head">
            <Link to={BASE} className="td-back">← ყველა განყოფილება</Link>
            <h1>{dept.title}</h1>
          </div>
          {["billing", "registration", "er"].includes(slug) && <section className="td-card">
            <h2>გადაუდებელი ვიზიტი: ერთი ეკგ, ორი დარიცხვა</h2>
            <p>მცხეთის გუნდთან ერთად გაიარეთ ერთი შემთხვევა ტრიაჟიდან გაწერამდე და შეაჯერეთ პაციენტის ანგარიში სალაროსთან.</p>
            <Link className="td-btn td-btn-primary" to={`${BASE}/acceptance/billing`}>შემთხვევის გეგმის გახსნა</Link>
          </section>}
          {dept.warn && <p className="td-warn">{dept.warn}</p>}
          <Flows dept={dept} flows={stats.flows} write={write} />
          <People users={users} checks={stats.checks} write={write} dept={dept} flash={flash} issues={issues} state={state} />
          <section id="issues" className="td-section">
            <div className="td-h2row">
              <h2>ხარვეზები <span className="td-count">{issues.length}</span></h2>
              <button className="td-btn td-btn-amber" onClick={() => report({ dept: slug })}>+ ხარვეზი</button>
            </div>
            <IssueList issues={issues} state={state} write={write} hideDept />
          </section>
          <section id="help" className="td-section td-help">
            <h2>დახმარება</h2>
            <div className="td-help-grid">
              <div className="td-card">
                <h3>დილის 15 წუთი</h3>
                <ol className="td-steps">{MORNING.map((m) => <li key={m}>{m}</li>)}</ol>
              </div>
              <Seats dept={dept} state={state} />
              <Teach dept={dept} />
            </div>
          </section>
          <Handin dept={dept} note={state.notes.find((n) => n.dept_slug === slug)} summary={`${s.signed} შევიდა · ${s.done} / ${s.total} სრულად`} write={write} issues={issues} />
        </div>
        <aside className="td-side td-side-dept">
          <div className="td-card td-side-sum">
            <span className={`td-pill p-${st}`}>{STATE_KA[st]}</span>
            <div className="td-big"><b>{s.done}</b><span>/ {s.total} შემოწმდა</span></div>
            <Bar s={s} />
            <div className="td-side-kv">
              <span><b>{s.signed}</b> შევიდა</span>
              <span className={s.failed ? "red" : ""}><b>{s.failed}</b> ვერ შევიდა</span>
              <span><b>{s.flowsDone}</b>/{dept.flows.length} მოქმედება</span>
              <span className={s.open ? "amber" : ""}><b>{s.open}</b> ღია ხარვეზი</span>
            </div>
          </div>
          {toc("td-vtoc")}
        </aside>
      </div>
    </div>
  );
}

type Filter = "all" | "todo" | "problem" | "done";
function People({ users, checks, write, dept, flash, issues, state }: { users: User[]; checks: Map<number, UserCheck>; write: Write; dept: Department; flash: string | null; issues: Issue[]; state: State }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => {
    const qq = query.trim().toLowerCase();
    return users.filter((u) => {
      if (qq && !(u.name.toLowerCase().includes(qq) || (u.logins ?? "").toLowerCase().includes(qq) || u.roles.toLowerCase().includes(qq))) return false;
      const c = checks.get(u.id);
      if (filter === "done") return done(c);
      if (filter === "problem") return problem(c) || !!c?.note;
      if (filter === "todo") return !done(c);
      return true;
    });
  }, [users, checks, query, filter]);

  const counts = {
    all: users.length,
    todo: users.filter((u) => !done(checks.get(u.id))).length,
    problem: users.filter((u) => problem(checks.get(u.id)) || !!checks.get(u.id)?.note).length,
    done: users.filter((u) => done(checks.get(u.id))).length,
  };

  return (
    <section id="people" className="td-section">
      <div className="td-h2row">
        <h2>ხალხი <span className="td-count">{users.length}</span></h2>
        {users.length > 0 && (
          <div className="td-chips">
            {([["all", "ყველა"], ["todo", "დარჩა"], ["problem", "პრობლემა"], ["done", "დასრულდა"]] as const).map(([k, l]) => (
              <button key={k} className={filter === k ? "on" : ""} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l} <span>{counts[k]}</span></button>
            ))}
          </div>
        )}
      </div>
      {users.length > 6 && (
        <input className="td-input td-people-find" type="search" placeholder="ამ განყოფილებაში: სახელი, WebMed, როლი" value={query} onChange={(e) => setQuery(e.target.value)} />
      )}
      {users.length === 0 && (
        <div className="td-empty">
          <b>ამ განყოფილებაზე სიაში არავინაა.</b>
          <span>ადგილზე ჩაწერეთ, ვინ მუშაობს: „ჩაბარება“, სიის შესწორებები.</span>
        </div>
      )}
      {users.length > 0 && list.length === 0 && <p className="td-empty">ამ ფილტრით არავინ ჩანს.</p>}
      <ul className="td-people">
        {list.map((u) => <Person key={u.id} u={u} c={checks.get(u.id)} write={write} dept={dept} flash={flash === `u${u.id}`} items={issues.filter((i) => i.user_id === u.id)} state={state} />)}
      </ul>
    </section>
  );
}

const BLANK = (id: number): UserCheck => ({
  user_id: id, signed_in: false, sign_in_failed: false, key_screen_ok: false, actions_ok: false, note: null, checked_by: null, checked_at: new Date().toISOString(),
});
const setCheck = (s: State, row: UserCheck): State => ({
  ...s, userChecks: s.userChecks.some((c) => c.user_id === row.user_id) ? s.userChecks.map((c) => (c.user_id === row.user_id ? row : c)) : [...s.userChecks, row],
});
const STEPS = [["signed_in", "შევიდა"], ["key_screen_ok", "ეკრანი"], ["actions_ok", "მოქმედებები"]] as const;

function Person({ u, c, write, dept, flash, items, state }: { u: User; c?: UserCheck; write: Write; dept: Department; flash: boolean; items: Issue[]; state: State }) {
  const report = useReport();
  const [note, setNote] = useState(c?.note ?? "");
  const [editing, setEditing] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [more, setMore] = useState(false);
  useEffect(() => { if (!editing) setNote(c?.note ?? ""); }, [c?.note, editing]);

  const tick = (field: keyof UserCheck, value: boolean | string | null) => {
    // "signed in" and "could not sign in" exclude each other.
    const extra: [keyof UserCheck, boolean][] = [];
    if (field === "signed_in" && value === true && c?.sign_in_failed) extra.push(["sign_in_failed", false]);
    if (field === "sign_in_failed" && value === true && c?.signed_in) extra.push(["signed_in", false]);
    const send = (f: keyof UserCheck, v: unknown) =>
      write<UserCheck>("tick_user", { user_id: u.id, field: f, value: v },
        (s) => setCheck(s, { ...(s.userChecks.find((x) => x.user_id === u.id) ?? BLANK(u.id)), [f]: v }), setCheck);
    send(field, value);
    for (const [f, v] of extra) send(f, v);
  };
  // The one-tap path: signed in, saw the main screen, did the day's actions.
  const allFine = () => { for (const [f] of STEPS) if (!c?.[f]) tick(f, true); };
  const isDone = done(c);
  const failed = problem(c);
  const showNote = noteOpen || !!c?.note || failed;
  return (
    <li id={`u${u.id}`} className={`td-card td-person ${isDone ? "is-done" : ""} ${failed ? "is-problem" : ""} ${u.seat_ok ? "" : "is-off"} ${flash ? "is-flash" : ""}`}>
      <div className="td-person-head">
        <div className="td-person-id">
          <div className="td-name" title={u.name}>{u.name}</div>
          {/* One line; the full role list sits in the tooltip and in "details". */}
          <div className="td-sub td-one" title={[u.title, u.roles].filter(Boolean).join(" · ")}>{[u.title, u.roles || "როლი არ აქვს"].filter(Boolean).join(" · ")}</div>
        </div>
        {u.logins ? (
          <button className="td-login" onClick={() => copy(u.logins!.split(",")[0].trim())} title="კოპირება">{u.logins}</button>
        ) : <span className="td-tag td-tag-amber">WebMed არა</span>}
      </div>
      {more && (
        <div className="td-meta">
          <span><i>ძირითადი ეკრანი</i>{q(u.first_screen)}</span>
          {u.how && u.how !== "WebMed-ის მომხმარებლით" && <span><i>შესვლა</i>{u.how}</span>}
          {u.spot.length > 0 && <span className="td-spot"><i>რა უნდა შეეძლოს</i>{u.spot.map((x) => <em key={x}>{q(x)}</em>)}</span>}
        </div>
      )}
      <div className="td-acts">
        <button className={`td-ok ${isDone ? "on" : ""}`} aria-pressed={isDone} onClick={allFine} disabled={isDone}>
          <span className="td-box">✓</span>{isDone ? "შემოწმდა" : "ყველაფერი რიგზეა"}
        </button>
        <button className="td-prob td-prob-sq" onClick={() => report({ dept: dept.slug, person: `${u.name} (${u.roles})`, userId: u.id })}
          aria-label="პრობლემა" title="პრობლემა">!</button>
      </div>
      <div className="td-ticks" role="group" aria-label="ნაბიჯები">
        {STEPS.map(([f, label]) => (
          <button key={f} className={`td-tick ${c?.[f] ? "on" : ""}`} aria-pressed={!!c?.[f]} onClick={() => tick(f, !c?.[f])}>
            <span className="td-box">{c?.[f] ? "✓" : ""}</span>{label}
          </button>
        ))}
        <button className={`td-tick td-tick-fail ${failed ? "on" : ""}`} aria-pressed={failed} onClick={() => tick("sign_in_failed", !failed)}>
          <span className="td-box">{failed ? "✕" : ""}</span>ვერ შევიდა
        </button>
      </div>
      {showNote ? (
        <textarea className="td-input td-note" rows={1} autoFocus={noteOpen && !c?.note} placeholder={failed ? "შეცდომის ზუსტი ტექსტი" : "შენიშვნა"} value={note}
          onFocus={() => setEditing(true)} onChange={(e) => setNote(e.target.value)}
          onBlur={() => { setEditing(false); setNoteOpen(false); if ((note.trim() || null) !== (c?.note ?? null)) tick("note", note.trim() || null); }} />
      ) : null}
      {c?.note && items.some((i) => i.source === `note:user:${u.id}`) && (
        <div className="td-madeinto">→ {items.filter((i) => i.source === `note:user:${u.id}`).length} საკითხად იქცა, იხ. ქვემოთ</div>
      )}
      {items.length > 0 && <IssueList issues={items} state={state} write={write} hideDept compact />}
      <div className="td-person-foot">
        {!showNote && <button className="td-mini" onClick={() => setNoteOpen(true)}>+ შენიშვნა</button>}
        <button className="td-mini" onClick={() => setMore(!more)} aria-expanded={more}>{more ? "ნაკლები" : "დეტალები"}</button>
        {c?.checked_by && <span className="td-by">{c.checked_by} · {hhmm(c.checked_at)}</span>}
      </div>
    </li>
  );
}

function Seats({ dept, state }: { dept: Department; state: State }) {
  const [show, setShow] = useState(false);
  const seats = dept.seats.map((e) => state.seats.find((s) => s.email === e)).filter(Boolean) as State["seats"];
  return (
    <div id="accounts" className="td-card td-seats">
      <h3>სატესტო ანგარიშები <span className="td-tag td-tag-red">მხოლოდ გუნდისთვის</span></h3>
      <p className="td-hint">მხოლოდ სათადარიგოდ: როცა რეალური ადამიანი ვერ შედის, არ არის ან უფლება აკლია. მიზეზი ჩაწერეთ შენიშვნაში.</p>
      {dept.seat_note && <p className="td-warn">{dept.seat_note}</p>}
      {seats.map((s) => (
        <div key={s.email} className="td-seat">
          <div><button className="td-login" onClick={() => copy(s.email)}>{s.email}</button><div className="td-sub">{s.role}</div></div>
          {s.password && (show
            ? <button className="td-login" onClick={() => copy(s.password!)}>{s.password}</button>
            : <button className="td-btn td-btn-ghost td-btn-sm" onClick={() => setShow(true)}>პაროლი</button>)}
        </div>
      ))}
      {seats.length === 0 && <p className="td-sub">ამ განყოფილებას სატესტო ანგარიში არ აქვს.</p>}
    </div>
  );
}

const setFlow = (s: State, row: FlowCheck): State => ({
  ...s,
  flowChecks: s.flowChecks.some((f) => f.dept_slug === row.dept_slug && f.flow_idx === row.flow_idx)
    ? s.flowChecks.map((f) => (f.dept_slug === row.dept_slug && f.flow_idx === row.flow_idx ? row : f))
    : [...s.flowChecks, row],
});

function Flows({ dept, flows, write }: { dept: Department; flows: Map<string, FlowCheck>; write: Write }) {
  const send = (idx: number, patch: Partial<FlowCheck>) =>
    write<FlowCheck>("tick_flow", { dept: dept.slug, idx, ...patch }, (s) => setFlow(s, {
      dept_slug: dept.slug, flow_idx: idx, done: false, note: null, checked_by: null, checked_at: new Date().toISOString(),
      ...flows.get(`${dept.slug}:${idx}`), ...patch,
    }), setFlow);
  return (
    <section id="flows" className="td-section">
      <h2>მოქმედებები <span className="td-count">{dept.flows.filter((_, i) => flows.get(`${dept.slug}:${i}`)?.done).length}/{dept.flows.length}</span></h2>
      <p className="td-hint">რასაც თანამშრომელი WebMed-ში აკეთებს, იმავე პაციენტზე გაიმეორეთ MediMind-ში. როცა შედეგს ეკრანზე ნამდვილად ხედავთ, დააჭირეთ „შესრულდა“. არ გამოვიდა? დააჭირეთ „პრობლემა“.</p>
      {dept.flows.length === 0 ? <p className="td-empty">ამ განყოფილებას მოქმედებების სია არ აქვს.</p> : (
        <ol className="td-flows">
          {dept.flows.map((f, i) => {
            const c = flows.get(`${dept.slug}:${i}`);
            return <FlowItem key={i} f={f} i={i} c={c} dept={dept.slug} onDone={() => send(i, { done: !c?.done })} onNote={(note) => send(i, { note })} />;
          })}
        </ol>
      )}
    </section>
  );
}

function FlowItem({ f, i, c, dept, onDone, onNote }: { f: Department["flows"][number]; i: number; c?: FlowCheck; dept: string; onDone: () => void; onNote: (n: string | null) => void }) {
  const report = useReport();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(c?.note ?? "");
  useEffect(() => setNote(c?.note ?? ""), [c?.note]);
  return (
    <li className={`td-card td-flow ${c?.done ? "is-done" : ""}`}>
      <div className="td-flow-head">
        <button className="td-flow-title" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="td-num">{i + 1}</span><span>{q(f.w)}</span><span className="td-caret" aria-hidden="true">{open ? "▾" : "▸"}</span>
        </button>
      </div>
      {open && <ol className="td-flow-body">{f.steps.map((s) => <li key={s}>{q(s)}</li>)}</ol>}
      <div className="td-result"><b>შედეგი ეკრანზე:</b> {q(f.result)}</div>
      <div className="td-acts">
        <button className={`td-ok ${c?.done ? "on" : ""}`} aria-pressed={!!c?.done} aria-label={`შესრულდა: ${f.w}`}
          onClick={() => { onDone(); if (!c?.done) toast.success(`შესრულდა: ${q(f.w)}`, { duration: 1500 }); }}>
          <span className="td-box">✓</span>{c?.done ? "შესრულდა" : "მონიშნეთ: შესრულდა"}
        </button>
        <button className="td-prob" onClick={() => report({ dept, screen: q(f.w), flowIdx: i })}>პრობლემა</button>
      </div>
      {(open || c?.note) && (
        <textarea className="td-input td-note" rows={1} placeholder="შენიშვნა (რა არ გამოვიდა)" value={note}
          onChange={(e) => setNote(e.target.value)} onBlur={() => { if ((note.trim() || null) !== (c?.note ?? null)) onNote(note.trim() || null); }} />
      )}
      {c?.checked_by && <div className="td-by">{c.checked_by} · {hhmm(c.checked_at)}</div>}
    </li>
  );
}

function Teach({ dept }: { dept: Department }) {
  return (
    <div className="td-card">
      <h3>სასწავლო წერტილები</h3>
      {dept.teach.length === 0 ? <p className="td-sub">ამ განყოფილებას დღეს განსაკუთრებული წერტილი არ აქვს.</p> : (
        <ul className="td-teach">
          {dept.teach.map((t) => (
            // Teach text is our own copy from the seed (may hold <b>), never user input.
            <li key={t.t}><span className="td-tag">{t.h}</span><span dangerouslySetInnerHTML={{ __html: q(t.t) }} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Handin({ dept, note, summary, write, issues }: { dept: Department; note?: Note; summary: string; write: Write; issues: Issue[] }) {
  const report = useReport();
  const made = (k: string) => issues.filter((i) => i.source === `handin:${dept.slug}:${k}`).length;
  const [form, setForm] = useState<Record<string, string>>(note?.handin ?? {});
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (!dirty) setForm(note?.handin ?? {}); }, [note, dirty]);
  const save = () => {
    write<Note>("handin", { dept: dept.slug, handin: form }, (s) => s, (s, row) => ({
      ...s, notes: s.notes.some((n) => n.dept_slug === row.dept_slug) ? s.notes.map((n) => (n.dept_slug === row.dept_slug ? row : n)) : [...s.notes, row],
    }));
    setDirty(false);
    toast.success("ჩაბარება შენახულია");
  };
  return (
    <section id="handin" className="td-section">
      {/* Folded during the day: five optional boxes are only for the end of the shift. */}
      <details className="td-card td-form td-handin" open={!!note}>
        <summary><h2>დღის ბოლოს ჩააბარეთ <span className="td-tag">MediMind-ის წარმომადგენელი</span></h2>{note?.updated_by && <span className="td-by">{note.updated_by} · {hhmm(note.updated_at)}</span>}</summary>
        <div className="td-handin-warn">
          <span>პრობლემები აქ არ იწერება. ჩაწერეთ ისინი ხარვეზად, რომ გუნდმა დაინახოს და გაასწოროს.</span>
          <button type="button" className="td-btn td-btn-amber td-btn-sm" onClick={() => report({ dept: dept.slug })}>ხარვეზის ჩაწერა</button>
        </div>
        <p className="td-sum"><b>შემოწმდა:</b> {summary}. შეავსეთ მხოლოდ ის, რაც გაქვთ.</p>
        <div className="td-handin-grid">
          {HANDIN.map(([k, label]) => (
            <label key={k} className="td-field">
              <span className="td-label">{label}</span>
              <textarea className="td-input" rows={2} value={form[k] ?? ""} onChange={(e) => { setDirty(true); setForm({ ...form, [k]: e.target.value }); }} />
              {made(k) > 0 && <a className="td-madeinto" href="#issues" onClick={(e) => { e.preventDefault(); jump("issues"); }}>→ {made(k)} საკითხად იქცა</a>}
            </label>
          ))}
        </div>
        <div className="td-row">
          <button className="td-btn td-btn-primary" onClick={save} disabled={!dirty}>შენახვა</button>
        </div>
      </details>
    </section>
  );
}

// ───────────────────────── report a problem (one sheet, from anywhere) ─────────────────────────
function ReportSheet({ state, ctx, write, onClose }: { state: State; ctx: ReportCtx; write: Write; onClose: () => void }) {
  const [what, setWhat] = useState("");
  const [dept, setDept] = useState(ctx.dept ?? "");
  const [person, setPerson] = useState(ctx.person ?? "");
  const [screen, setScreen] = useState(ctx.screen ?? "");
  const [expected, setExpected] = useState(ctx.expected ?? "");
  const [pr, setPr] = useState("");
  const [more, setMore] = useState(false);
  const people = state.users.filter((u) => !dept || u.dept_slug === dept);
  const deptTitle = state.departments.find((d) => d.slug === dept)?.title;
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!what.trim()) return;
    write<Issue>("issue_add", {
      dept: dept || null, person, screen, what: what.trim(), expected, pr_url: pr,
      // Link to the person and the action only while their chips are still on the sheet.
      ...(person && ctx.userId ? { user_id: ctx.userId } : {}), ...(screen && ctx.flowIdx !== undefined ? { flow_idx: ctx.flowIdx } : {}),
    }, (s) => s, (s, row) => ({ ...s, issues: [row, ...s.issues] }));
    toast.success("ხარვეზი ჩაიწერა");
    onClose();
  };
  return (
    <div className="td-sheet-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="td-sheet" role="dialog" aria-modal="true" aria-labelledby="td-sheet-h" onSubmit={submit}>
        <div className="td-sheet-grip" aria-hidden="true" />
        <div className="td-h2row">
          <h2 id="td-sheet-h">ხარვეზის ჩაწერა</h2>
          <button type="button" className="td-mini" onClick={onClose} aria-label="დახურვა">✕</button>
        </div>
        <div className="td-ctx">
          {ctx.dept ? <span className="td-tag">{deptTitle}</span> : (
            <select className="td-input td-input-sm" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="განყოფილება">
              <option value="">განყოფილება (არჩევითი)</option>
              {state.departments.map((d) => <option key={d.slug} value={d.slug}>{d.title}</option>)}
            </select>
          )}
          {person && <span className="td-tag td-tag-x">{person}<button type="button" onClick={() => setPerson("")} aria-label="მოხსნა">✕</button></span>}
          {screen && <span className="td-tag td-tag-x">{screen}<button type="button" onClick={() => setScreen("")} aria-label="მოხსნა">✕</button></span>}
          <span className="td-sub">{hhmm(new Date().toISOString())}</span>
        </div>
        <textarea className="td-input" rows={3} autoFocus required placeholder="რა მოხდა?" value={what}
          onChange={(e) => setWhat(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }} />
        {!more ? (
          <button type="button" className="td-mini td-more" onClick={() => setMore(true)}>+ ეკრანი, მომხმარებელი, რას ელოდით, PR</button>
        ) : (
          <div className="td-more-fields">
            {!person && (
              <label className="td-field"><span className="td-label">მომხმარებელი და როლი</span>
                <input className="td-input" list="td-people-list" value={person} onChange={(e) => setPerson(e.target.value)} />
                <datalist id="td-people-list">{people.map((u) => <option key={u.id} value={`${u.name} (${u.roles})`} />)}</datalist>
              </label>
            )}
            {!ctx.screen && <label className="td-field"><span className="td-label">ეკრანი</span><input className="td-input" value={screen} onChange={(e) => setScreen(e.target.value)} placeholder="მაგ.: საექთნო პოსტი → MAR" /></label>}
            <label className="td-field"><span className="td-label">რას ელოდით</span><textarea className="td-input" rows={2} value={expected} onChange={(e) => setExpected(e.target.value)} /></label>
            <label className="td-field"><span className="td-label">PR-ის ბმული</span><input className="td-input" type="url" value={pr} onChange={(e) => setPr(e.target.value)} placeholder="https://github.com/…" /></label>
          </div>
        )}
        <button className="td-btn td-btn-amber td-wide" disabled={!what.trim()}>ჩაწერა</button>
      </form>
    </div>
  );
}

const setIssue = (s: State, row: Issue): State => ({ ...s, issues: s.issues.map((i) => (i.id === row.id ? row : i)) });

// One issue item, two views. "staff": state chip, our answer, and for a fixed item the two re-check buttons (testers
// on the department page and their own card). "team": the same plus one-tap state change and the answer box (issues tab).
function useIssueUpdate(write: Write) {
  return useCallback((i: Issue, patch: Partial<Issue>) =>
    write<Issue>("issue_update", { id: i.id, ...patch }, (s) => setIssue(s, { ...i, ...patch }), setIssue), [write]);
}

function IssueList({ issues, state, write, hideDept, team, compact }: { issues: Issue[]; state: State; write: Write; hideDept?: boolean; team?: boolean; compact?: boolean }) {
  const update = useIssueUpdate(write);
  if (issues.length === 0) return <p className="td-empty">ხარვეზი ჯერ არ ჩაწერილა.</p>;
  const title = (slug: string | null) => state.departments.find((d) => d.slug === slug)?.title ?? "საერთო";
  return (
    <ul className={compact ? "td-issues td-issues-compact" : "td-issues"}>
      {sortIssues(issues).map((i) => <IssueItem key={i.id} i={i} dept={hideDept ? null : title(i.dept_slug)} update={update} team={team} compact={compact} />)}
    </ul>
  );
}

function Recheck({ i, update }: { i: Issue; update: (i: Issue, p: Partial<Issue>) => void }) {
  const [broken, setBroken] = useState(false);
  const [line, setLine] = useState("");
  if (broken) {
    return (
      <form className="td-recheck" onSubmit={(e) => { e.preventDefault(); update(i, { status: "open", recheck_note: line.trim() || "ისევ არ მუშაობს" }); toast("გუნდს დაუბრუნდა", { icon: "↩" }); setBroken(false); }}>
        <input className="td-input td-input-sm" autoFocus placeholder="რა არ მუშაობს? (არჩევითი)" value={line} onChange={(e) => setLine(e.target.value)} />
        <button className="td-btn td-btn-sm td-btn-red">ისევ არ მუშაობს</button>
        <button type="button" className="td-mini" onClick={() => setBroken(false)}>გაუქმება</button>
      </form>
    );
  }
  return (
    <div className="td-recheck">
      <button className="td-btn td-btn-sm td-btn-green" onClick={() => { update(i, { status: "closed" }); toast.success("დადასტურდა. მადლობა!"); }}>✓ ახლა მუშაობს</button>
      <button className="td-btn td-btn-sm td-btn-ghost td-btn-redtext" onClick={() => setBroken(true)}>ისევ არ მუშაობს</button>
    </div>
  );
}

function IssueItem({ i, dept, update, team, compact }: { i: Issue; dept: string | null; update: (i: Issue, p: Partial<Issue>) => void; team?: boolean; compact?: boolean }) {
  const [answer, setAnswer] = useState(i.answer ?? "");
  const [answerOpen, setAnswerOpen] = useState(false);
  const [pr, setPr] = useState(i.pr_url ?? "");
  const [prOpen, setPrOpen] = useState(false);
  useEffect(() => setPr(i.pr_url ?? ""), [i.pr_url]);
  useEffect(() => { if (!answerOpen) setAnswer(i.answer ?? ""); }, [i.answer, answerOpen]);
  const st = stage(i.status);
  const pilotRef = i.source === "billing-er-v1" && i.ref?.match(/^billing-er-v1:(shadow):([a-z0-9._-]{7,80}):(ER-0[1-8]|MTS-(?:0[1-9]|1[0-9]|2[0-2]))$/);
  const pilotPath = pilotRef && `${BASE}/acceptance/billing?env=${pilotRef[1]}&step=${pilotRef[3]}&build=${pilotRef[2]}`;
  return (
    <li id={`issue-${i.id}`} className={`td-card td-issue sg-${st}`}>
      <div className="td-issue-head">
        <span className={`td-chip c-${st}`}>{STAGE_KA[st]}</span>
        <span className="td-sub">#{i.id} · {hhmm(i.created_at)}{dept ? ` · ${dept}` : ""}</span>
      </div>
      {/* "In work" read as "nobody fixed it": say plainly where the fix is (Codex-reviewed wording). */}
      {st === "work" && <div className="td-work-note">გამოსწორება უკვე დავწერეთ. დღეს ღამით Shadow-ზე დავაყენებთ, შემდეგ შევამოწმებთ და მოვნიშნავთ, რომ მოგვარდა.</div>}
      <div className="td-issue-what">{i.what}</div>
      {pilotRef && pilotPath && <div className="td-row">
        <Link className="td-link" to={pilotPath}>ნაბიჯი და მტკიცებულება · {pilotRef[2]}</Link>
        <Link className="td-btn td-btn-ghost" to={`${pilotPath}&from=${pilotRef[2]}&issue=${i.id}`}>შესწორების შემოწმება</Link>
      </div>}
      {!compact && i.expected && <div className="td-sub"><b>ელოდნენ:</b> {i.expected}</div>}
      {!compact && (i.person || i.screen || i.reported_by) && <div className="td-sub td-issue-who">{[i.person, i.screen, i.reported_by && `ჩაწერა: ${i.reported_by}`].filter(Boolean).join(" · ")}</div>}
      {i.recheck_note && (st === "open" || st === "work") && <div className="td-recheck-note"><b>ტესტერი:</b> {i.recheck_note}</div>}
      {/* Testers see our answer only once it is true (fixed, confirmed, answered); a prepared answer on an open or
          in-work item shows to the team alone, marked as not yet visible. */}
      {i.answer && !answerOpen && (st === "fixed" || st === "closed" || st === "answered") && <div className={`td-answer a-${st}`}><b>{st === "answered" ? "პასუხი:" : "რა შევცვალეთ:"}</b> {i.answer}</div>}
      {i.answer && !answerOpen && team && (st === "open" || st === "work") && <div className="td-answer a-draft"><b>მომზადებული პასუხი (ტესტერი ჯერ ვერ ხედავს):</b> {i.answer}</div>}
      {st === "fixed" && !pilotRef && <Recheck i={i} update={update} />}
      {team && (
        <div className="td-team">
          <div className="td-seg" role="group" aria-label="მდგომარეობა">
            {TEAM_STAGES.map((s) => (
              <button key={s} className={st === s ? `on s-${s}` : ""} aria-pressed={st === s} onClick={() => { if (i.status !== s) update(i, { status: s }); }}>{STAGE_KA[s]}</button>
            ))}
          </div>
          {answerOpen ? (
            <textarea className="td-input" rows={2} autoFocus placeholder="მოკლე პასუხი ტესტერს: რა შევცვალეთ და რა სცადოს ახლა" value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onBlur={() => { setAnswerOpen(false); if ((answer.trim() || null) !== (i.answer ?? null)) update(i, { answer: answer.trim() || null }); }} />
          ) : (
            <div className="td-row">
              <button className="td-mini" onClick={() => setAnswerOpen(true)}>{i.answer ? "პასუხის შეცვლა" : "+ პასუხი ტესტერს"}</button>
              {i.pr_url && !prOpen && <a className="td-link" href={i.pr_url} target="_blank" rel="noreferrer">PR გახსნა</a>}
              {prOpen ? (
                <input className="td-input td-input-sm" type="url" autoFocus placeholder="PR-ის ბმული" value={pr} onChange={(e) => setPr(e.target.value)}
                  onBlur={() => { setPrOpen(false); if ((pr.trim() || null) !== i.pr_url) update(i, { pr_url: pr.trim() || null, ...(pr.trim() && i.status === "open" ? { status: "work" as IssueStatus } : {}) }); }} />
              ) : <button className="td-mini" onClick={() => setPrOpen(true)}>{i.pr_url ? "ბმულის შეცვლა" : "+ PR-ის ბმული"}</button>}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function IssuesPage({ state, write }: { state: State; write: Write }) {
  const report = useReport();
  const { hash } = useLocation();
  const linkedIssue = /^#issue-\d+$/.test(hash) ? hash.slice(1) : "";
  useEffect(() => { if (linkedIssue) jump(linkedIssue); }, [linkedIssue, state.issues.length]);
  const [filter, setFilter] = useState<Stage | "all">(() => (!linkedIssue && state.issues.some((i) => stage(i.status) === "fixed") ? "fixed" : "all"));
  const [dept, setDept] = useState("");
  const match = (i: Issue, f: typeof filter) => (f === "all" || stage(i.status) === f || (f === "closed" && isSolved(i))) && (!dept || i.dept_slug === dept);
  const count = (f: typeof filter) => state.issues.filter((i) => match(i, f)).length;
  const list = state.issues.filter((i) => match(i, filter));
  return (
    <div className="td-pad td-split">
      <div className="td-split-main td-sections">
        <div className="td-h2row">
          <h1>ხარვეზები</h1>
          <button className="td-btn td-btn-amber" onClick={() => report({})}>+ ხარვეზი</button>
        </div>
        <div className="td-row td-filters">
          <div className="td-chips">
            {([["fixed", "გადასამოწმებელი"], ["open", "ღია"], ["work", "მუშავდება"], ["closed", "მოგვარდა"], ["all", "ყველა"]] as const).map(([k, l]) => (
              <button key={k} className={`f-${k} ${filter === k ? "on" : ""}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l} <span>{count(k)}</span></button>
            ))}
          </div>
          <select className="td-input td-input-sm td-dept-filter" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="განყოფილება">
            <option value="">ყველა განყოფილება</option>
            {state.departments.map((d) => <option key={d.slug} value={d.slug}>{d.title}</option>)}
          </select>
        </div>
        <IssueList issues={list} state={state} write={write} team />
      </div>
      <aside className="td-side">
        <details className="td-card td-rules" open>
          <summary>როგორ მიდის ხარვეზი PR-მდე</summary>
          <ol>
            <li>ჩაწერეთ აქ: დრო, ეკრანი, მომხმარებელი და როლი, რა მოხდა, რას ელოდით. სკრინშოტი პაციენტის მონაცემების გარეშე.</li>
            <li>გახსენით PR EMR-ის რეპოზიტორიაში, <b>develop</b> ბრენჩზე. ერთი ხარვეზი, ერთი PR.</li>
            <li>ბრენჩი: <code>test-day/&lt;განყოფილება&gt;-&lt;მოკლე-სახელი&gt;</code>, მაგ. <code>test-day/therapy-mar-dose</code></li>
            <li>სათაური: <code>Mtskheta სატესტო დღე: &lt;ხარვეზი&gt;</code></li>
            <li>PR-ის ბმული ჩასვით ხარვეზის ბარათში.</li>
          </ol>
        </details>
      </aside>
    </div>
  );
}

// ───────────────────────── overview ─────────────────────────
function csv(rows: (string | number | boolean | null | undefined)[][]) {
  return "﻿" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}
function download(name: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function Overview({ state }: { state: State }) {
  const { by, checks, all } = useStats(state);
  const title = (slug: string | null) => state.departments.find((d) => d.slug === slug)?.title ?? "საერთო";
  const failed = state.users.filter((u) => problem(checks.get(u.id)));
  const open = state.issues.filter(isActive);
  // Showcase: solved since the start of yesterday (Tbilisi, UTC+4 all year) and items waiting for the tester.
  const DAY = 86_400_000, TZ = 4 * 3_600_000;
  const since = Math.floor((Date.now() + TZ) / DAY) * DAY - TZ - DAY;
  const solved = state.issues.filter((i) => isSolved(i) && new Date(i.closed_at ?? i.updated_at).getTime() >= since)
    .sort((a, b) => (b.closed_at ?? b.updated_at).localeCompare(a.closed_at ?? a.updated_at));
  const recheck = state.issues.filter((i) => stage(i.status) === "fixed");
  const flowsAll = state.departments.reduce((a, d) => a + d.flows.length, 0);
  const pct = all.total ? Math.round((all.done / all.total) * 100) : 0;
  const states = state.departments.map((d) => deptState(by.get(d.slug)!, d.flows.length));
  const nDone = states.filter((s) => s === "done").length;
  const nTodo = states.filter((s) => s === "todo").length;
  // Signed in, then nothing: people with only "signed in", or a department with sign-ins and no action ticked.
  const chase = state.departments.filter((d) => { const s = by.get(d.slug)!; return s.idle > 0 || (s.signed > 0 && s.flowsDone === 0); });
  // Departments that need someone first: failures and open issues on top, then the ones not started.
  const rows = [...state.departments].sort((a, b) => {
    const sa = by.get(a.slug)!, sb = by.get(b.slug)!;
    const w = (s: DeptStat, d: Department) => s.failed * 3 + s.open * 2 + s.idle * 2 + (s.signed > 0 && s.flowsDone === 0 ? 2 : 0) + (deptState(s, d.flows.length) === "todo" ? 1 : 0);
    return w(sb, b) - w(sa, a);
  });

  const exportUsers = () => download("mtskheta-testday-users.csv", csv([
    ["განყოფილება", "სახელი", "WebMed", "როლი", "შევიდა", "ვერ შევიდა", "ეკრანი", "მოქმედებები", "შენიშვნა", "ვინ", "როდის"],
    ...state.users.map((u) => { const c = checks.get(u.id); return [title(u.dept_slug), u.name, u.logins, u.roles, c?.signed_in, c?.sign_in_failed, c?.key_screen_ok, c?.actions_ok, c?.note, c?.checked_by, c ? hhmm(c.checked_at) : ""]; }),
  ]));
  const exportIssues = () => download("mtskheta-testday-issues.csv", csv([
    ["#", "დრო", "განყოფილება", "მომხმარებელი", "ეკრანი", "რა მოხდა", "ელოდნენ", "სტატუსი", "PR", "ჩაწერა"],
    ...state.issues.map((i) => [i.id, hhmm(i.created_at), title(i.dept_slug), i.person, i.screen, i.what, i.expected, STATUS_KA[i.status], i.pr_url, i.reported_by]),
  ]));

  return (
    <div className="td-pad td-sections">
      <div className="td-h2row">
        <div>
          <h1>მიმოხილვა</h1>
          <p className="td-headline"><b>{pct}%</b> შემოწმებულია: {all.done} / {all.total} ადამიანი. დასრულებულია {nDone} განყოფილება, {nTodo} ჯერ არ დაწყებულა.</p>
        </div>
        <div className="td-row">
          <span className="td-sub">განახლდა {hhmm(state.at)}</span>
          <button className="td-btn td-btn-ghost td-btn-sm" onClick={exportUsers}>ხალხი CSV</button>
          <button className="td-btn td-btn-ghost td-btn-sm" onClick={exportIssues}>ხარვეზები CSV</button>
        </div>
      </div>
      <div className="td-kpis">
        <div className="td-card"><b>{all.done}<small>/{all.total}</small></b><span>სრულად შემოწმდა</span><Bar s={all} /></div>
        <div className="td-card"><b>{all.signed}</b><span>შევიდა</span></div>
        <div className={`td-card ${all.failed ? "is-red" : ""}`}><b>{all.failed}</b><span>ვერ შევიდა</span></div>
        <div className="td-card"><b>{all.flowsDone}<small>/{flowsAll}</small></b><span>მოქმედება</span></div>
        <div className={`td-card ${open.length ? "is-amber" : ""}`}><b>{open.length}</b><span>ღია ხარვეზი</span></div>
      </div>
      <div className="td-showcase">
        <section className="td-card td-solved">
          <div className="td-h2row"><h2>მოგვარდა გუშინდლიდან</h2><b className="td-solved-n">{solved.length}</b></div>
          {solved.length === 0 ? <p className="td-sub">ჯერ არაფერი. აქ გამოჩნდება ყველა დადასტურებული და პასუხგაცემული საკითხი.</p> : (
            <ul className="td-list">{solved.slice(0, 12).map((i) => (
              <li key={i.id}><span className={`td-chip c-${stage(i.status)}`}>{STAGE_KA[stage(i.status)]}</span> <span className="td-sub">{title(i.dept_slug)}</span><div>{i.what}</div>{i.answer && <div className="td-sub">{i.answer}</div>}</li>
            ))}</ul>
          )}
        </section>
        <section className="td-card td-waiting">
          <div className="td-h2row"><h2>ელოდება ტესტერის გადამოწმებას</h2><b className="td-solved-n">{recheck.length}</b></div>
          {recheck.length === 0 ? <p className="td-sub">ასეთი საკითხი არ არის.</p> : (
            <ul className="td-list">{recheck.map((i) => (
              <li key={i.id}><Link to={i.dept_slug ? `${BASE}/d/${i.dept_slug}${i.user_id ? `#u${i.user_id}` : "#issues"}` : `${BASE}/issues`}><span className="td-sub">{title(i.dept_slug)}</span><div>{i.what}</div></Link></li>
            ))}</ul>
          )}
        </section>
      </div>
      <div className="td-ov-grid">
        <div className="td-card td-table-wrap">
          <table className="td-table">
            <thead><tr><th>განყოფილება</th><th>მდგომარეობა</th><th>სრულად</th><th title="შევიდა, მეტი არაფერი">მხოლოდ შევიდა</th><th>ვერ</th><th>მოქმ.</th><th>ხარვ.</th></tr></thead>
            <tbody>
              {rows.map((d) => { const s = by.get(d.slug)!; const st = deptState(s, d.flows.length); return (
                <tr key={d.slug}>
                  <td><Link to={`${BASE}/d/${d.slug}`}>{d.title}</Link><Bar s={s} /></td>
                  <td><span className={`td-pill p-${st}`}>{STATE_KA[st]}</span></td>
                  <td>{s.done}/{s.total}</td><td className={s.idle ? "amber" : "zero"}>{s.idle}</td><td className={s.failed ? "red" : "zero"}>{s.failed}</td>
                  <td>{s.flowsDone}/{d.flows.length}</td><td className={s.open ? "amber" : "zero"}>{s.open}</td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
        <div className="td-sections">
          <section className={`td-card ${chase.length ? "td-chase" : ""}`}>
            <h2>შევიდნენ, მერე არაფერი <span className="td-count">{chase.length}</span></h2>
            {chase.length === 0 ? <p className="td-sub">ასეთი განყოფილება არ არის.</p> : (
              <ul className="td-list">{chase.map((d) => { const s = by.get(d.slug)!; return (
                <li key={d.slug}><Link to={`${BASE}/d/${d.slug}`}><b>{d.title}</b></Link>
                  <div className="td-sub">{[s.idle > 0 && `${s.idle} ადამიანმა მხოლოდ „შევიდა“ მონიშნა`, s.flowsDone === 0 && "არცერთი მოქმედება არ მონიშნულა"].filter(Boolean).join(" · ")}</div></li>
              ); })}</ul>
            )}
          </section>
          <section className="td-card">
            <h2>ვერ შევიდა <span className="td-count">{failed.length}</span></h2>
            {failed.length === 0 ? <p className="td-sub">ჯერ არავინ.</p> : (
              <ul className="td-list">{failed.map((u) => { const c = checks.get(u.id)!; return (
                <li key={u.id}><Link to={`${BASE}/d/${u.dept_slug}#u${u.id}`}><b className="td-find-name">{u.name}</b> <span className="td-sub">{u.logins} · {title(u.dept_slug)}</span></Link>{c.note && <div>{c.note}</div>}</li>
              ); })}</ul>
            )}
          </section>
          <section className="td-card">
            <h2>ღია ხარვეზები <span className="td-count">{open.length}</span></h2>
            {open.length === 0 ? <p className="td-sub">ღია ხარვეზი არ არის.</p> : (
              <ul className="td-list">{open.map((i) => (
                <li key={i.id}><span className="td-sub">#{i.id} · {hhmm(i.created_at)} · {title(i.dept_slug)} · {STATUS_KA[i.status]}</span><div>{i.what}</div>{i.pr_url && <a className="td-link" href={i.pr_url} target="_blank" rel="noreferrer">PR</a>}</li>
              ))}</ul>
            )}
          </section>
        </div>
      </div>
      <section className="td-section">
        <h2>ჩაბარებები <span className="td-count">{state.notes.length}/{state.departments.length}</span></h2>
        {state.notes.length === 0 ? <p className="td-empty">ჯერ არცერთი განყოფილება არ ჩაბარებულა.</p> : (
          <ul className="td-list td-handins">{state.notes.map((n) => (
            <li key={n.dept_slug} className="td-card"><b>{title(n.dept_slug)}</b> <span className="td-by">{n.updated_by} · {hhmm(n.updated_at)}</span>
              {HANDIN.filter(([k]) => n.handin[k]).map(([k, l]) => <div key={k}><span className="td-sub">{l}:</span> {n.handin[k]}</div>)}
            </li>
          ))}</ul>
        )}
      </section>
    </div>
  );
}

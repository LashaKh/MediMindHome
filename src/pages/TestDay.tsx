// Mtskheta test-day portal (medimind.md/admin/testday), Mon 2026-11-16.
// One idea: a department's day on one scrolling page you tick as you go.
// Gate → tester name → department picker / department page / issues / overview.
// All data (names, WebMed logins, seats) comes from the gated testday API; this file holds only UI wording.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  loadName, loadSession, saveName, saveSession, TdError, tdLogin, tdState, tdWrite,
  type Department, type FlowCheck, type Issue, type IssueStatus, type Note, type State, type User, type UserCheck,
} from "../lib/testdayApi";
import "./TestDay.css";

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
const STATUS_KA: Record<IssueStatus, string> = { open: "ღია", pr: "PR გახსნილია", fixed: "გასწორდა", wontfix: "არ სჭირდება" };
const HANDIN = [
  ["failed", "ვინ ვერ შევიდა (WebMed № და მიზეზი)"],
  ["prs", "გახსნილი PR-ები"],
  ["asks", "რა მოითხოვეს თანამშრომლებმა, რასაც MediMind ჯერ არ აკეთებს"],
  ["roster", "სიის შესწორებები (აკლია, აღარ მუშაობს, სხვა როლი)"],
  ["other", "სხვა შენიშვნა"],
] as const;

// Georgian quotes open low („) and close high (“).
const q = (s: string) => s.replace(/„([^"„]*)"/gu, "„$1“");
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tbilisi" });
const done = (c?: UserCheck) => !!c && c.signed_in && c.key_screen_ok && c.actions_ok;
const problem = (c?: UserCheck) => !!c && c.sign_in_failed;

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
      <Toaster position="bottom-center" toastOptions={{ style: { fontFamily: "inherit", fontSize: 14 } }} />
      {!token ? (
        <Gate onIn={(s) => { saveSession(s); setToken(s.token); }} />
      ) : !name ? (
        <NameStep onName={(n) => { saveName(n); setName(n); }} />
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
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    setErr("");
    const r = await tdLogin(pw);
    setBusy(false);
    if (typeof r === "object") return onIn(r);
    setErr({
      wrong: "პაროლი არასწორია.",
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
      <p className="td-muted">ორშაბათი, 16 ნოემბერი · 18 განყოფილება</p>
      <label className="td-label" htmlFor="td-pw">გუნდის პაროლი</label>
      <input id="td-pw" className="td-input" type="password" autoComplete="current-password" autoFocus
        value={pw} onChange={(e) => setPw(e.target.value)} />
      {err && <p className="td-err" role="alert">{err}</p>}
      <button className="td-btn td-btn-primary" disabled={busy || !pw}>{busy ? "მოწმდება…" : "შესვლა"}</button>
    </form>
  );
}

function NameStep({ onName }: { onName: (n: string) => void }) {
  const [n, setN] = useState("");
  return (
    <form className="td-gate" onSubmit={(e) => { e.preventDefault(); if (n.trim()) onName(n.trim()); }}>
      <h1>თქვენი სახელი</h1>
      <p className="td-muted">ყველა მონიშვნასთან ჩანს, ვინ გააკეთა. ერთხელ ჩაწერეთ.</p>
      <input className="td-input" autoFocus value={n} onChange={(e) => setN(e.target.value)} placeholder="მაგ.: ნინო ბ." maxLength={60} />
      <button className="td-btn td-btn-primary" disabled={!n.trim()}>დაწყება</button>
    </form>
  );
}

// ───────────────────────── data + writes ─────────────────────────
type Write = <T>(action: string, payload: Record<string, unknown>, optimistic: (s: State) => State, apply: (s: State, row: T) => State) => void;

function Portal({ token, name, onLogout, onRename }: { token: string; name: string; onLogout: () => void; onRename: () => void }) {
  const [state, setState] = useState<State | null>(null);
  const [loadErr, setLoadErr] = useState(false);
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

  return (
    <>
      <header className="td-top">
        <Link to={BASE} className="td-brand"><img src="/favicon.svg" alt="" width={24} height={24} /><span>სატესტო დღე</span></Link>
        <nav className="td-nav">
          <Link to={BASE} className={view === "" || view === "d" ? "on" : ""}>განყოფილებები</Link>
          <Link to={`${BASE}/issues`} className={view === "issues" ? "on" : ""}>ხარვეზები{state ? <b>{state.issues.filter((i) => i.status === "open" || i.status === "pr").length}</b> : null}</Link>
          <Link to={`${BASE}/overview`} className={view === "overview" ? "on" : ""}>მიმოხილვა</Link>
        </nav>
        <button className="td-me" onClick={onRename} title="სახელის შეცვლა">{name}</button>
      </header>
      {loadErr && <div className="td-banner">კავშირი გაწყდა. ბოლო მონაცემებს ვაჩვენებ, ვცდი ხელახლა.</div>}
      <main className="td-main">
        {!state ? (
          <p className="td-muted td-pad">იტვირთება…</p>
        ) : view === "d" && parts[1] ? (
          <DeptPage state={state} slug={parts[1]} write={write} />
        ) : view === "issues" ? (
          <IssuesPage state={state} write={write} />
        ) : view === "overview" ? (
          <Overview state={state} />
        ) : (
          <Picker state={state} />
        )}
      </main>
    </>
  );
}

// ───────────────────────── stats ─────────────────────────
function useStats(state: State) {
  return useMemo(() => {
    const checks = new Map(state.userChecks.map((c) => [c.user_id, c]));
    const flows = new Map(state.flowChecks.map((f) => [`${f.dept_slug}:${f.flow_idx}`, f]));
    const by = new Map<string, { total: number; done: number; signed: number; failed: number; flowsDone: number; open: number }>();
    for (const d of state.departments) {
      by.set(d.slug, {
        total: 0, done: 0, signed: 0, failed: 0, open: 0,
        flowsDone: d.flows.filter((_, i) => flows.get(`${d.slug}:${i}`)?.done).length,
      });
    }
    for (const u of state.users) {
      const s = by.get(u.dept_slug);
      if (!s) continue;
      const c = checks.get(u.id);
      s.total++;
      if (done(c)) s.done++;
      if (c?.signed_in) s.signed++;
      if (problem(c)) s.failed++;
    }
    for (const i of state.issues) if (i.dept_slug && (i.status === "open" || i.status === "pr")) by.get(i.dept_slug)!.open++;
    return { checks, flows, by };
  }, [state]);
}

function Bar({ value, total }: { value: number; total: number }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return <div className="td-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>;
}

// ───────────────────────── picker ─────────────────────────
function Picker({ state }: { state: State }) {
  const { by } = useStats(state);
  const [rules, setRules] = useState(false);
  const [find, setFind] = useState("");
  const qq = find.trim().toLowerCase();
  const found = qq.length < 2 ? [] : state.users.filter((u) => u.name.toLowerCase().includes(qq) || (u.logins ?? "").toLowerCase().includes(qq)).slice(0, 20);
  const deptTitle = (slug: string) => state.departments.find((d) => d.slug === slug)?.title ?? "";
  const all = [...by.values()].reduce((a, s) => ({ total: a.total + s.total, done: a.done + s.done }), { total: 0, done: 0 });
  return (
    <div className="td-pad">
      <div className="td-hero">
        <div>
          <div className="td-kicker">მცხეთა · Shadow</div>
          <h1>აირჩიეთ განყოფილება</h1>
          <a className="td-link" href={SHADOW} target="_blank" rel="noreferrer">{SHADOW.replace("https://", "")}</a>
        </div>
        <div className="td-hero-num"><b>{all.done}</b><span>/ {all.total} შემოწმდა</span></div>
      </div>
      <button className="td-rules-toggle" onClick={() => setRules(!rules)} aria-expanded={rules}>
        {rules ? "▾" : "▸"} დღის მისია და მთავარი წესი
      </button>
      {rules && (
        <div className="td-card td-rules">
          <ol className="td-mission">{MISSION.map(([k, t]) => <li key={k}><b>{k}.</b> {t}</li>)}</ol>
          <h3>მთავარი წესი</h3>
          <ul>{RULE.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      )}
      <div className="td-find">
        <input className="td-input" type="search" placeholder="ვის ეძებთ? სახელი ან WebMed მომხმარებელი" value={find} onChange={(e) => setFind(e.target.value)} />
        {qq.length >= 2 && (found.length === 0 ? <p className="td-empty" style={{ marginTop: 8 }}>ვერ მოიძებნა.</p> : (
          <ul className="td-find-list">
            {found.map((u) => (
              <li key={u.id}><Link to={`${BASE}/d/${u.dept_slug}`} className="td-card"><span><span className="td-find-name">{u.name}</span><div className="td-sub">{u.roles}</div></span><span className="td-tag">{deptTitle(u.dept_slug)}</span></Link></li>
            ))}
          </ul>
        ))}
      </div>
      <div className="td-grid">
        {state.departments.map((d) => {
          const s = by.get(d.slug)!;
          return (
            <Link key={d.slug} to={`${BASE}/d/${d.slug}`} className="td-card td-dept">
              <div className="td-dept-title">{d.title}</div>
              <div className="td-dept-nums">
                <span><b>{s.done}</b> / {s.total} ადამიანი</span>
                <span>{s.flowsDone} / {d.flows.length} მოქმედება</span>
              </div>
              <Bar value={s.done} total={s.total} />
              <div className="td-dept-tags">
                {s.failed > 0 && <span className="td-tag td-tag-red">{s.failed} ვერ შევიდა</span>}
                {s.open > 0 && <span className="td-tag td-tag-amber">{s.open} ღია ხარვეზი</span>}
                {s.total > 0 && s.done === s.total && <span className="td-tag td-tag-green">ყველა შემოწმდა</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────── department page ─────────────────────────
const SECTIONS = [
  ["people", "ხალხი"], ["seats", "სატესტო ანგარიშები"], ["morning", "დილის 15 წუთი"],
  ["flows", "მოქმედებები"], ["teach", "სასწავლო"], ["issues", "ხარვეზები"], ["handin", "ჩაბარება"],
] as const;

// Which section is on screen, so the sticky contents bar can highlight it.
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 190) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    // Capture, so it also hears a scrolling body (not only the window).
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, [ids]);
  return active;
}
const SECTION_IDS = SECTIONS.map(([id]) => id);
const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function DeptPage({ state, slug, write }: { state: State; slug: string; write: Write }) {
  const dept = state.departments.find((d) => d.slug === slug);
  const stats = useStats(state);
  const active = useActiveSection(SECTION_IDS);
  const [issueOpen, setIssueOpen] = useState(false);
  const tocRef = useRef<HTMLElement>(null);
  // Keep the highlighted chip in view as the page scrolls.
  useEffect(() => {
    const chip = tocRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (chip && tocRef.current) tocRef.current.scrollLeft = chip.offsetLeft - tocRef.current.offsetLeft - 12;
  }, [active]);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!dept) return <p className="td-pad">განყოფილება ვერ მოიძებნა. <Link to={BASE}>უკან</Link></p>;
  const s = stats.by.get(slug)!;
  const users = state.users.filter((u) => u.dept_slug === slug);
  return (
    <div>
      <div className="td-stick">
        <div className="td-stick-row">
          <Link to={BASE} className="td-stick-back" aria-label="ყველა განყოფილება">←</Link>
          <div className="td-stick-title">{dept.title}</div>
          <div className="td-stick-num" title="სრულად შემოწმდა"><b>{s.done}</b>/{s.total}</div>
        </div>
        <Bar value={s.done} total={s.total} />
        <nav className="td-toc" aria-label="ნაწილები" ref={tocRef}>
          {SECTIONS.map(([id, label]) => (
            <a key={id} data-id={id} href={`#${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined}
              onClick={(e) => { e.preventDefault(); jump(id); }}>{label}</a>
          ))}
        </nav>
      </div>
      <div className="td-pad td-dept-sum">
        <span><b>{s.signed}</b> შევიდა</span>
        <span className={s.failed ? "red" : ""}><b>{s.failed}</b> ვერ შევიდა</span>
        <span><b>{s.flowsDone}</b>/{dept.flows.length} მოქმედება</span>
        <span className={s.open ? "amber" : ""}><b>{s.open}</b> ღია ხარვეზი</span>
      </div>
      <button className="td-fab" onClick={() => { if (issueOpen) jump("issues"); else setIssueOpen(true); }}>+ ხარვეზი</button>
      <div className="td-pad td-sections">
        {dept.warn && <p className="td-warn">{dept.warn}</p>}
        <People users={users} checks={stats.checks} write={write} />
        <Seats dept={dept} state={state} />
        <Morning />
        <Flows dept={dept} flows={stats.flows} write={write} />
        <Teach dept={dept} />
        <section id="issues" className="td-section">
          <h2>ხარვეზები</h2>
          <IssueForm state={state} dept={slug} write={write} open={issueOpen} setOpen={setIssueOpen} />
          <IssueList issues={state.issues.filter((i) => i.dept_slug === slug)} state={state} write={write} />
        </section>
        <Handin dept={dept} note={state.notes.find((n) => n.dept_slug === slug)} summary={`${s.signed} შევიდა · ${s.done} / ${s.total} სრულად`} write={write} />
      </div>
    </div>
  );
}

type Filter = "all" | "todo" | "problem" | "done";
function People({ users, checks, write }: { users: User[]; checks: Map<number, UserCheck>; write: Write }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<"name" | "todo">("name");
  const list = useMemo(() => {
    const qq = query.trim().toLowerCase();
    let l = users.filter((u) => !qq || u.name.toLowerCase().includes(qq) || (u.logins ?? "").toLowerCase().includes(qq) || u.roles.toLowerCase().includes(qq));
    l = l.filter((u) => {
      const c = checks.get(u.id);
      if (filter === "done") return done(c);
      if (filter === "problem") return problem(c) || !!c?.note;
      if (filter === "todo") return !done(c);
      return true;
    });
    if (sort === "todo") l = [...l].sort((a, b) => Number(done(checks.get(a.id))) - Number(done(checks.get(b.id))));
    return l;
  }, [users, checks, query, filter, sort]);

  const counts = {
    all: users.length,
    todo: users.filter((u) => !done(checks.get(u.id))).length,
    problem: users.filter((u) => problem(checks.get(u.id)) || !!checks.get(u.id)?.note).length,
    done: users.filter((u) => done(checks.get(u.id))).length,
  };

  return (
    <section id="people" className="td-section">
      <h2>ხალხი <span className="td-count">{users.length}</span></h2>
      <p className="td-hint">ყოველ ადამიანზე: შევიდა საკუთარი WebMed-ის მომხმარებლით · გაიხსნა ძირითადი ეკრანი · მისი ანგარიშით შესრულდა „რა უნდა შეეძლოს“. სიაში არ მყოფი ადამიანი ჩაწერეთ „ჩაბარებაში“.</p>
      <div className="td-tools">
        <input className="td-input" type="search" placeholder="ძებნა: სახელი, WebMed, როლი" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="td-chips">
          {([["all", "ყველა"], ["todo", "დარჩა"], ["problem", "პრობლემა"], ["done", "დასრულდა"]] as const).map(([k, l]) => (
            <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l} <span>{counts[k]}</span></button>
          ))}
          <button className="td-sort" onClick={() => setSort(sort === "name" ? "todo" : "name")}>{sort === "name" ? "ა-ჰ" : "დარჩენილი ზემოთ"}</button>
        </div>
      </div>
      {users.length === 0 && <p className="td-empty">ამ განყოფილებაზე სიაში არავინაა. ადგილზე ჩაწერეთ, ვინ მუშაობს („ჩაბარება“, სიის შესწორებები).</p>}
      {users.length > 0 && list.length === 0 && <p className="td-empty">ამ ფილტრით არავინ ჩანს.</p>}
      <ul className="td-people">
        {list.map((u) => <Person key={u.id} u={u} c={checks.get(u.id)} write={write} />)}
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

function Person({ u, c, write }: { u: User; c?: UserCheck; write: Write }) {
  const [note, setNote] = useState(c?.note ?? "");
  const [editing, setEditing] = useState(false);
  useEffect(() => { if (!editing) setNote(c?.note ?? ""); }, [c?.note, editing]);

  const tick = (field: keyof UserCheck, value: boolean | string | null) => {
    const patch: Partial<UserCheck> = { [field]: value };
    // "signed in" and "could not sign in" exclude each other.
    const extra: [keyof UserCheck, boolean][] = [];
    if (field === "signed_in" && value === true && c?.sign_in_failed) extra.push(["sign_in_failed", false]);
    if (field === "sign_in_failed" && value === true && c?.signed_in) extra.push(["signed_in", false]);
    const send = (f: keyof UserCheck, v: unknown, p: Partial<UserCheck>) =>
      write<UserCheck>("tick_user", { user_id: u.id, field: f, value: v },
        (s) => setCheck(s, { ...(s.userChecks.find((x) => x.user_id === u.id) ?? BLANK(u.id)), ...p }), setCheck);
    send(field, value, patch);
    for (const [f, v] of extra) send(f, v, { [f]: v });
  };
  const box = (field: "signed_in" | "key_screen_ok" | "actions_ok", label: string) => (
    <button className={`td-tick ${c?.[field] ? "on" : ""}`} aria-pressed={!!c?.[field]} onClick={() => tick(field, !c?.[field])}>
      <span className="td-box">{c?.[field] ? "✓" : ""}</span>{label}
    </button>
  );
  const isDone = done(c);
  return (
    <li className={`td-card td-person ${isDone ? "is-done" : ""} ${problem(c) ? "is-problem" : ""} ${u.seat_ok ? "" : "is-off"}`}>
      <div className="td-person-head">
        <div>
          <div className="td-name">{u.name}</div>
          {u.title && <div className="td-sub">{u.title}</div>}
        </div>
        {u.logins ? (
          <button className="td-login" onClick={() => copy(u.logins!.split(",")[0].trim())} title="კოპირება">{u.logins}</button>
        ) : <span className="td-sub">WebMed მომხმარებელი არ აქვს</span>}
      </div>
      <div className="td-meta">
        <span><i>როლი</i>{u.roles || "არ აქვს"}</span>
        <span><i>ძირითადი ეკრანი</i>{q(u.first_screen)}</span>
        {u.how && u.how !== "WebMed-ის მომხმარებლით" && <span><i>შესვლა</i>{u.how}</span>}
      </div>
      <div className="td-spot"><i>რა უნდა შეეძლოს</i>{u.spot.map((x) => <span key={x}>{q(x)}</span>)}</div>
      <div className="td-ticks">
        {box("signed_in", "შევიდა")}
        <button className={`td-tick td-tick-fail ${c?.sign_in_failed ? "on" : ""}`} aria-pressed={!!c?.sign_in_failed} onClick={() => tick("sign_in_failed", !c?.sign_in_failed)}>
          <span className="td-box">{c?.sign_in_failed ? "✕" : ""}</span>ვერ შევიდა
        </button>
        {box("key_screen_ok", "ეკრანი")}
        {box("actions_ok", "მოქმედებები")}
      </div>
      <textarea className="td-input td-note" rows={1} placeholder={c?.sign_in_failed ? "შეცდომის ზუსტი ტექსტი" : "შენიშვნა"} value={note}
        onFocus={() => setEditing(true)} onChange={(e) => setNote(e.target.value)}
        onBlur={() => { setEditing(false); if ((note.trim() || null) !== (c?.note ?? null)) tick("note", note.trim() || null); }} />
      {c?.checked_by && <div className="td-by">{c.checked_by} · {hhmm(c.checked_at)}</div>}
    </li>
  );
}

function Seats({ dept, state }: { dept: Department; state: State }) {
  const [show, setShow] = useState(false);
  const seats = dept.seats.map((e) => state.seats.find((s) => s.email === e)).filter(Boolean) as State["seats"];
  return (
    <section id="seats" className="td-section">
      <h2>სატესტო ანგარიშები <span className="td-tag td-tag-red">მხოლოდ გუნდისთვის</span></h2>
      <p className="td-hint">მხოლოდ სათადარიგოდ: როცა რეალური ადამიანი ვერ შედის, არ არის ან უფლება აკლია. მიზეზი ჩაწერეთ შენიშვნაში.</p>
      {dept.seat_note && <p className="td-warn">{dept.seat_note}</p>}
      <div className="td-card td-seats">
        {seats.map((s) => (
          <div key={s.email} className="td-seat">
            <div><button className="td-login" onClick={() => copy(s.email)}>{s.email}</button><div className="td-sub">{s.role}</div></div>
            {s.password && (show
              ? <button className="td-login" onClick={() => copy(s.password!)}>{s.password}</button>
              : <button className="td-btn td-btn-ghost" onClick={() => setShow(true)}>პაროლი</button>)}
          </div>
        ))}
        {seats.length === 0 && <p className="td-empty">ამ განყოფილებას სატესტო ანგარიში არ აქვს.</p>}
      </div>
    </section>
  );
}

function Morning() {
  return (
    <section id="morning" className="td-section">
      <h2>დილის 15 წუთი</h2>
      <ol className="td-card td-steps">
        <li>სიის ყველა ადამიანი შედის თავისი WebMed-ის მომხმარებლით და პაროლით. მონიშნეთ „შევიდა“.</li>
        <li>ვინც ვერ შევიდა: მონიშნეთ „ვერ შევიდა“ და შენიშვნაში ჩაწერეთ შეცდომის ზუსტი ტექსტი.</li>
        <li>ვინც შევიდა, მაგრამ ძირითადი ეკრანი არ ჩანს: შენიშვნაში ჩაწერეთ, რა ჩანს, და დაარეგისტრირეთ ხარვეზი.</li>
      </ol>
    </section>
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
      <h2>სარკისებური მოქმედებები <span className="td-count">{dept.flows.length}</span></h2>
      <p className="td-hint">რასაც თანამშრომელი WebMed-ში აკეთებს, იმავე პაციენტზე გაიმეორეთ MediMind-ში. მონიშნეთ, როცა „შედეგი ეკრანზე“ ნამდვილად ჩანს.</p>
      <ol className="td-flows">
        {dept.flows.map((f, i) => {
          const c = flows.get(`${dept.slug}:${i}`);
          return <FlowItem key={i} f={f} i={i} c={c} onDone={() => send(i, { done: !c?.done })} onNote={(note) => send(i, { note })} />;
        })}
      </ol>
    </section>
  );
}

function FlowItem({ f, i, c, onDone, onNote }: { f: Department["flows"][number]; i: number; c?: FlowCheck; onDone: () => void; onNote: (n: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(c?.note ?? "");
  useEffect(() => setNote(c?.note ?? ""), [c?.note]);
  return (
    <li className={`td-card td-flow ${c?.done ? "is-done" : ""}`}>
      <div className="td-flow-head">
        <button className={`td-tick ${c?.done ? "on" : ""}`} aria-pressed={!!c?.done} onClick={onDone} aria-label="შესრულდა">
          <span className="td-box">{c?.done ? "✓" : ""}</span>
        </button>
        <button className="td-flow-title" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="td-num">{i + 1}</span>{q(f.w)}<span className="td-caret">{open ? "▾" : "▸"}</span>
        </button>
      </div>
      {open && (
        <div className="td-flow-body">
          <ol>{f.steps.map((s) => <li key={s}>{q(s)}</li>)}</ol>
        </div>
      )}
      <div className="td-result"><b>შედეგი ეკრანზე:</b> {q(f.result)}</div>
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
    <section id="teach" className="td-section">
      <h2>სასწავლო წერტილები</h2>
      {dept.teach.length === 0 ? <p className="td-empty">ამ განყოფილებას დღეს განსაკუთრებული წერტილი არ აქვს.</p> : (
        <ul className="td-teach">
          {dept.teach.map((t) => (
            // Teach text is our own copy from the seed (may hold <b>), never user input.
            <li key={t.t} className="td-card"><span className="td-tag">{t.h}</span><span dangerouslySetInnerHTML={{ __html: q(t.t) }} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Handin({ dept, note, summary, write }: { dept: Department; note?: Note; summary: string; write: Write }) {
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
      <h2>დღის ბოლოს ჩააბარეთ</h2>
      <div className="td-card td-form">
        <p className="td-sum"><b>შემოწმდა:</b> {summary}</p>
        {HANDIN.map(([k, label]) => (
          <label key={k} className="td-field">
            <span className="td-label">{label}</span>
            <textarea className="td-input" rows={2} value={form[k] ?? ""} onChange={(e) => { setDirty(true); setForm({ ...form, [k]: e.target.value }); }} />
          </label>
        ))}
        <div className="td-row">
          <button className="td-btn td-btn-primary" onClick={save} disabled={!dirty}>შენახვა</button>
          {note?.updated_by && <span className="td-by">{note.updated_by} · {hhmm(note.updated_at)}</span>}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── issues ─────────────────────────
function IssueForm({ state, dept: fixedDept, write, ...ctl }: { state: State; dept?: string; write: Write; open?: boolean; setOpen?: (o: boolean) => void }) {
  const empty = { dept: fixedDept ?? "", person: "", screen: "", what: "", expected: "", pr_url: "" };
  const [f, setF] = useState(empty);
  const [ownOpen, setOwnOpen] = useState(false);
  const open = ctl.open ?? ownOpen;
  const setOpen = ctl.setOpen ?? setOwnOpen;
  const people = state.users.filter((u) => !f.dept || u.dept_slug === f.dept);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.what.trim()) return;
    write<Issue>("issue_add", { ...f, dept: f.dept || null }, (s) => s, (s, row) => ({ ...s, issues: [row, ...s.issues] }));
    toast.success("ხარვეზი ჩაიწერა");
    setF(empty);
    setOpen(false);
  };
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  if (!open) return <button className="td-btn td-btn-primary td-wide" onClick={() => setOpen(true)}>+ ახალი ხარვეზი</button>;
  return (
    <form className="td-card td-form" onSubmit={submit}>
      <div className="td-sub">დრო ავტომატურად იწერება: {hhmm(new Date().toISOString())}</div>
      {!fixedDept && (
        <label className="td-field"><span className="td-label">განყოფილება</span>
          <select className="td-input" value={f.dept} onChange={set("dept")}>
            <option value="">აირჩიეთ</option>
            {state.departments.map((d) => <option key={d.slug} value={d.slug}>{d.title}</option>)}
          </select>
        </label>
      )}
      <label className="td-field"><span className="td-label">მომხმარებელი და როლი</span>
        <input className="td-input" list="td-people-list" value={f.person} onChange={set("person")} />
        <datalist id="td-people-list">{people.map((u) => <option key={u.id} value={`${u.name} (${u.roles})`} />)}</datalist>
      </label>
      <label className="td-field"><span className="td-label">ეკრანი</span><input className="td-input" value={f.screen} onChange={set("screen")} placeholder="მაგ.: საექთნო პოსტი → MAR" /></label>
      <label className="td-field"><span className="td-label">რა მოხდა *</span><textarea className="td-input" rows={3} required autoFocus value={f.what} onChange={set("what")} /></label>
      <label className="td-field"><span className="td-label">რას ელოდით</span><textarea className="td-input" rows={2} value={f.expected} onChange={set("expected")} /></label>
      <label className="td-field"><span className="td-label">PR-ის ბმული (თუ უკვე გახსენით)</span><input className="td-input" type="url" value={f.pr_url} onChange={set("pr_url")} placeholder="https://github.com/…" /></label>
      <div className="td-row">
        <button className="td-btn td-btn-primary" disabled={!f.what.trim()}>ჩაწერა</button>
        <button type="button" className="td-btn td-btn-ghost" onClick={() => { setF(empty); setOpen(false); }}>გაუქმება</button>
      </div>
    </form>
  );
}

const setIssue = (s: State, row: Issue): State => ({ ...s, issues: s.issues.map((i) => (i.id === row.id ? row : i)) });

function IssueList({ issues, state, write }: { issues: Issue[]; state: State; write: Write }) {
  if (issues.length === 0) return <p className="td-empty">ხარვეზი ჯერ არ ჩაწერილა.</p>;
  const title = (slug: string | null) => state.departments.find((d) => d.slug === slug)?.title ?? "განყოფილების გარეშე";
  const update = (i: Issue, patch: Partial<Issue>) =>
    write<Issue>("issue_update", { id: i.id, ...patch }, (s) => setIssue(s, { ...i, ...patch }), setIssue);
  return (
    <ul className="td-issues">
      {issues.map((i) => <IssueItem key={i.id} i={i} dept={title(i.dept_slug)} update={update} />)}
    </ul>
  );
}

function IssueItem({ i, dept, update }: { i: Issue; dept: string; update: (i: Issue, p: Partial<Issue>) => void }) {
  const [pr, setPr] = useState(i.pr_url ?? "");
  useEffect(() => setPr(i.pr_url ?? ""), [i.pr_url]);
  return (
    <li className={`td-card td-issue st-${i.status}`}>
      <div className="td-issue-head">
        <span className="td-sub">#{i.id} · {hhmm(i.created_at)} · {dept}</span>
        <select className="td-status" value={i.status} onChange={(e) => update(i, { status: e.target.value as IssueStatus })}>
          {(Object.keys(STATUS_KA) as IssueStatus[]).map((s) => <option key={s} value={s}>{STATUS_KA[s]}</option>)}
        </select>
      </div>
      <div className="td-issue-what">{i.what}</div>
      {i.expected && <div className="td-sub"><b>ელოდნენ:</b> {i.expected}</div>}
      <div className="td-sub">{[i.person, i.screen, i.reported_by && `ჩაწერა: ${i.reported_by}`].filter(Boolean).join(" · ")}</div>
      <div className="td-row">
        <input className="td-input" type="url" placeholder="PR-ის ბმული" value={pr} onChange={(e) => setPr(e.target.value)}
          onBlur={() => { if ((pr.trim() || null) !== i.pr_url) update(i, { pr_url: pr.trim() || null, ...(pr.trim() && i.status === "open" ? { status: "pr" as IssueStatus } : {}) }); }} />
        {i.pr_url && <a className="td-link" href={i.pr_url} target="_blank" rel="noreferrer">გახსნა</a>}
      </div>
    </li>
  );
}

function IssuesPage({ state, write }: { state: State; write: Write }) {
  const [filter, setFilter] = useState<"active" | "all">("active");
  const list = state.issues.filter((i) => filter === "all" || i.status === "open" || i.status === "pr");
  return (
    <div className="td-pad td-sections">
      <h1>ხარვეზები</h1>
      <div className="td-card td-rules">
        <h3>როგორ</h3>
        <ol>
          <li>ჩაწერეთ აქ: დრო, ეკრანი, მომხმარებელი და როლი, რა მოხდა, რას ელოდით. სკრინშოტი პაციენტის მონაცემების გარეშე.</li>
          <li>გახსენით PR EMR-ის რეპოზიტორიაში, <b>develop</b> ბრენჩზე. ერთი ხარვეზი, ერთი PR.</li>
          <li>ბრენჩი: <code>test-day/&lt;განყოფილება&gt;-&lt;მოკლე-სახელი&gt;</code>, მაგ. <code>test-day/therapy-mar-dose</code></li>
          <li>სათაური: <code>Mtskheta სატესტო დღე 11-16: &lt;ხარვეზი&gt;</code></li>
          <li>PR-ის ბმული ჩასვით ხარვეზის ბარათში.</li>
        </ol>
      </div>
      <IssueForm state={state} write={write} />
      <div className="td-chips">
        <button className={filter === "active" ? "on" : ""} onClick={() => setFilter("active")}>ღია</button>
        <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>ყველა <span>{state.issues.length}</span></button>
      </div>
      <IssueList issues={list} state={state} write={write} />
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
  const { by, checks } = useStats(state);
  const title = (slug: string | null) => state.departments.find((d) => d.slug === slug)?.title ?? "";
  const failed = state.users.filter((u) => problem(checks.get(u.id)));
  const open = state.issues.filter((i) => i.status === "open" || i.status === "pr");
  const tot = [...by.values()].reduce((a, s) => ({ total: a.total + s.total, done: a.done + s.done, signed: a.signed + s.signed, failed: a.failed + s.failed }), { total: 0, done: 0, signed: 0, failed: 0 });
  const flowsAll = state.departments.reduce((a, d) => a + d.flows.length, 0);
  const flowsDone = [...by.values()].reduce((a, s) => a + s.flowsDone, 0);

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
      <div className="td-row td-between"><h1>მიმოხილვა</h1><span className="td-sub">განახლდა {hhmm(state.at)}</span></div>
      <div className="td-kpis">
        <div className="td-card"><b>{tot.done}<small>/{tot.total}</small></b><span>სრულად შემოწმდა</span></div>
        <div className="td-card"><b>{tot.signed}</b><span>შევიდა</span></div>
        <div className="td-card is-red"><b>{tot.failed}</b><span>ვერ შევიდა</span></div>
        <div className="td-card"><b>{flowsDone}<small>/{flowsAll}</small></b><span>მოქმედება</span></div>
        <div className="td-card is-amber"><b>{open.length}</b><span>ღია ხარვეზი</span></div>
      </div>
      <div className="td-row">
        <button className="td-btn td-btn-ghost" onClick={exportUsers}>ხალხი CSV</button>
        <button className="td-btn td-btn-ghost" onClick={exportIssues}>ხარვეზები CSV</button>
      </div>
      <div className="td-card td-table-wrap">
        <table className="td-table">
          <thead><tr><th>განყოფილება</th><th>სრულად</th><th>შევიდა</th><th>ვერ</th><th>მოქმ.</th><th>ხარვ.</th></tr></thead>
          <tbody>
            {state.departments.map((d) => { const s = by.get(d.slug)!; return (
              <tr key={d.slug}>
                <td><Link to={`${BASE}/d/${d.slug}`}>{d.title}</Link><Bar value={s.done} total={s.total} /></td>
                <td>{s.done}/{s.total}</td><td>{s.signed}</td><td className={s.failed ? "red" : ""}>{s.failed}</td>
                <td>{s.flowsDone}/{d.flows.length}</td><td className={s.open ? "amber" : ""}>{s.open}</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
      <section className="td-section">
        <h2>ვერ შევიდა <span className="td-count">{failed.length}</span></h2>
        {failed.length === 0 ? <p className="td-empty">ჯერ არავინ.</p> : (
          <ul className="td-list">{failed.map((u) => { const c = checks.get(u.id)!; return (
            <li key={u.id} className="td-card"><b>{u.name}</b> <span className="td-sub">{u.logins} · {title(u.dept_slug)}</span>{c.note && <div>{c.note}</div>}<div className="td-by">{c.checked_by} · {hhmm(c.checked_at)}</div></li>
          ); })}</ul>
        )}
      </section>
      <section className="td-section">
        <h2>ღია ხარვეზები <span className="td-count">{open.length}</span></h2>
        {open.length === 0 ? <p className="td-empty">ღია ხარვეზი არ არის.</p> : (
          <ul className="td-list">{open.map((i) => (
            <li key={i.id} className="td-card"><span className="td-sub">#{i.id} · {hhmm(i.created_at)} · {title(i.dept_slug)} · {STATUS_KA[i.status]}</span><div>{i.what}</div>{i.pr_url && <a className="td-link" href={i.pr_url} target="_blank" rel="noreferrer">PR</a>}</li>
          ))}</ul>
        )}
      </section>
      <section className="td-section">
        <h2>ჩაბარებები</h2>
        {state.notes.length === 0 ? <p className="td-empty">ჯერ არცერთი განყოფილება არ ჩაბარებულა.</p> : (
          <ul className="td-list">{state.notes.map((n) => (
            <li key={n.dept_slug} className="td-card"><b>{title(n.dept_slug)}</b> <span className="td-by">{n.updated_by} · {hhmm(n.updated_at)}</span>
              {HANDIN.filter(([k]) => n.handin[k]).map(([k, l]) => <div key={k}><span className="td-sub">{l}:</span> {n.handin[k]}</div>)}
            </li>
          ))}</ul>
        )}
      </section>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ACCEPTANCE_AREAS,
  type AcceptanceArea, type AcceptanceCase, type AcceptanceEnvironment,
  type AcceptanceEvent, type CaseOutcome, type DecisionOutcome,
} from "../../supabase/functions/testday/acceptanceCatalog";
import { TdError, tdWrite } from "../lib/testdayApi";
import "./TestDayAcceptance.css";

const BASE = "/admin/testday/acceptance";
const BUILD = String.raw`[a-zA-Z0-9][a-zA-Z0-9._\-]{6,79}`;
const LABEL: Record<AcceptanceEvent["outcome"], string> = {
  pass: "გაიარა", fail: "ვერ გაიარა", blocked: "დაბრკოლდა",
  not_applicable: "ფილიალში არ გამოიყენება", approved: "დამტკიცებულია", changes_requested: "შესასწორებელია",
};
const ENV: Record<AcceptanceEnvironment, string> = { shadow: "სატესტო გარემო (Shadow)", foundation: "საავადმყოფოს სამუშაო გარემო" };
const ERRORS: Record<string, string> = {
  acceptance_bad_build: "შეამოწმეთ გარემო და ვერსიის კოდი.",
  acceptance_invalid: "შეამოწმეთ შევსებული ველები.",
  acceptance_signer: "ამ კოდით ამ მიმართულების დამტკიცება ვერ მოხერხდა. გადაამოწმეთ კოდი და თქვენი უფლებამოსილება.",
  acceptance_signer_setup: "ხელმძღვანელების კოდები ჯერ არ არის გაცემული. მიმართეთ MediMind-ის წარმომადგენელს.",
  acceptance_incomplete: "დამტკიცებამდე დაასრულეთ ყველა სავალდებულო შემოწმება და პრაქტიკული დავალება.",
  acceptance_stale: "შემოწმების შედეგები შეიცვალა. გადახედეთ ახალ შედეგებს და ისევ სცადეთ.",
  acceptance_request_conflict: "ეს შედეგი უკვე შეიცვალა. განაახლეთ სია და ისევ სცადეთ.",
  acceptance_issue: "ამ ნომრით ხარვეზი ვერ მოიძებნა.",
};

type Scope = { environment: AcceptanceEnvironment; build: string };
type Save = (action: string, payload: Record<string, unknown>) => Promise<void>;

function testDate(iso: string) {
  return new Date(iso).toLocaleString("ka-GE", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tbilisi" });
}

function errorMessage(e: unknown) {
  return e instanceof TdError && ERRORS[e.message] ? ERRORS[e.message] : "ვერ შევინახეთ. შეამოწმეთ კავშირი და სცადეთ ისევ.";
}

function caseList(area: AcceptanceArea) {
  return area.groups?.flatMap((group) => group.cases) ?? [];
}

function statusOf(area: AcceptanceArea, events: AcceptanceEvent[]) {
  const records = events.filter((item) => item.area === area.id);
  const latest = new Map<string, AcceptanceEvent>();
  let decision: AcceptanceEvent | undefined;
  for (const item of records) {
    if (item.case_id && !latest.has(item.case_id)) latest.set(item.case_id, item);
    if (!item.case_id && !decision) decision = item;
  }
  const cases = caseList(area);
  const completed = cases.filter(([id]) => {
    const result = latest.get(id);
    return result?.outcome === "not_applicable" || (result?.outcome === "pass" && result.trainee);
  }).length;
  const basis = Math.max(0, ...Array.from(latest.values(), (item) => item.id));
  const approved = decision?.outcome === "approved" && decision.basis === basis && completed === cases.length;
  return { cases, records, latest, completed, basis, decision, approved };
}

export function TestDayAcceptance({ slug, token, name, onLogout }: {
  slug?: string; token: string; name: string; onLogout: () => void;
}) {
  const [params, setParams] = useSearchParams();
  const build = params.get("build") ?? "";
  const environment = params.get("env") === "foundation" ? "foundation" : "shadow";
  const area = ACCEPTANCE_AREAS.find(({ id }) => id === slug);
  const selected = new URLSearchParams(params);
  const href = selected.size ? `?${selected}` : "";

  function chooseBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    selected.set("build", String(values.get("build")).trim().toLowerCase());
    selected.set("env", String(values.get("environment")));
    setParams(selected);
  }

  return (
    <div className="td-pad td-accept">
      {slug && <Link className="td-link" to={BASE + href}>ყველა მიმართულება</Link>}
      <header className="td-accept-heading">
        <p className="td-sub">GeoHospitals · მცხეთის საავადმყოფო</p>
        <h1>{area?.title ?? "შემოწმება და მიღება"}</h1>
        <p>{area?.owner ?? "აირჩიეთ მიმართულება, ჩაატარეთ პრაქტიკული შემოწმება და ჩაიწერეთ შედეგები."}</p>
      </header>
      <form className="td-card td-accept-build" onSubmit={chooseBuild} key={environment + build}>
        <label className="td-label">გარემო
          <select name="environment" defaultValue={environment} className="td-input">
            <option value="shadow">{ENV.shadow}</option>
            <option value="foundation">{ENV.foundation}</option>
          </select>
        </label>
        <label className="td-label">გამოცდილი ვერსიის კოდი
          <input className="td-input" name="build" defaultValue={build} pattern={BUILD} required spellCheck={false} autoComplete="off" placeholder="მაგ. 579d2ff94ead" />
        </label>
        <button className="td-btn td-btn-primary" type="submit">ვერსიის გახსნა</button>
      </form>
      {slug && !area ? <p className="td-empty">მიმართულება ვერ მოიძებნა.</p> : (
        <Workspace key={environment + "/" + build} scope={{ environment, build }} token={token} name={name} onLogout={onLogout} area={area} href={href} />
      )}
    </div>
  );
}

function Workspace({ scope, token, name, onLogout, area, href }: {
  scope: Scope; token: string; name: string; onLogout: () => void; area?: AcceptanceArea; href: string;
}) {
  const { build, environment } = scope;
  const [events, setEvents] = useState<AcceptanceEvent[]>([]);
  const [loaded, setLoaded] = useState(!scope.build);
  const [error, setError] = useState(false);
  const [before, setBefore] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(false);

  const refresh = useCallback(async () => {
    setLoaded(false);
    setError(false);
    try {
      const result = await tdWrite<{ events: AcceptanceEvent[]; before: number | null }>(token, "acceptance_state", { build, environment });
      setEvents(result.events);
      setBefore(result.before);
    } catch (e) {
      if (e instanceof TdError && e.status === 401) onLogout();
      else setError(true);
    } finally {
      setLoaded(true);
    }
  }, [build, environment, onLogout, token]);

  useEffect(() => { if (build) void refresh(); }, [build, refresh]);

  const save: Save = async (action, payload) => {
    try {
      const saved = await tdWrite<AcceptanceEvent>(token, action, { ...scope, ...payload, by: name });
      setEvents((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => b.id - a.id));
    } catch (e) {
      if (e instanceof TdError && e.status === 401) onLogout();
      throw e;
    }
  };

  async function loadHistory() {
    setLoadingHistory(true);
    setHistoryError(false);
    try {
      const result = await tdWrite<{ events: AcceptanceEvent[]; before: number | null }>(token, "acceptance_state", { ...scope, before });
      setEvents((current) => {
        const byId = new Map([...current, ...result.events].map((item) => [item.id, item]));
        return [...byId.values()].sort((a, b) => b.id - a.id);
      });
      setBefore(result.before);
    } catch (e) {
      if (e instanceof TdError && e.status === 401) onLogout();
      else setHistoryError(true);
    } finally {
      setLoadingHistory(false);
    }
  }

  if (area) {
    if (!area.groups) return <p className="td-empty"><b>დაგეგმილია</b>{area.scope}</p>;
    const status = statusOf(area, events);
    const editable = !!scope.build && loaded && !error;
    return (
      <div className="td-accept-work">
        <div className="td-accept-status">
          <div>
            <strong>{status.completed} / {status.cases.length} დასრულებული შემოწმება</strong>
            {scope.build && <span className="td-sub">{ENV[scope.environment]} · {scope.build}</span>}
          </div>
          {scope.build && <button className="td-btn td-btn-ghost" type="button" disabled={!loaded} onClick={refresh}>შედეგების განახლება</button>}
        </div>
        {!scope.build && <p className="td-warn">შედეგის შესანახად გახსენით გამოცდილი ვერსია.</p>}
        {scope.build && !loaded && <p role="status" className="td-hint">შედეგები იტვირთება…</p>}
        {error && <p role="alert" className="td-err">შედეგები ვერ ჩაიტვირთა. დააჭირეთ „შედეგების განახლებას“.</p>}
        {area.groups.map(({ title, role, cases }) => (
          <section className="td-accept-group" key={title}>
            <h2>{title}</h2>
            <p className="td-sub">{role}</p>
            {cases.map((test) => <CaseRow key={test[0]} test={test} current={status.latest.get(test[0])}
              history={status.records.filter((item) => item.case_id === test[0])} editable={editable}
              onSave={(payload) => save("acceptance_run", { ...payload, area: area.id, case_id: test[0] })} />)}
          </section>
        ))}
        <Decision status={status} editable={editable}
          onSave={(payload) => save("acceptance_sign", { ...payload, area: area.id, basis: status.basis })}
          onRefresh={refresh} />
        {before !== null && <div>
          <button className="td-btn td-btn-ghost" type="button" disabled={loadingHistory} onClick={loadHistory}>ძველი შედეგების ჩატვირთვა</button>
          {historyError && <p className="td-err" role="alert">ძველი შედეგები ვერ ჩაიტვირთა.</p>}
        </div>}
      </div>
    );
  }

  return (
    <div>
      {scope.build && !loaded && <p role="status" className="td-hint">შედეგები იტვირთება…</p>}
      {error && <div className="td-row"><p role="alert" className="td-err">შედეგები ვერ ჩაიტვირთა.</p>
        <button className="td-btn td-btn-ghost" type="button" onClick={refresh}>განახლება</button></div>}
      <ul className="td-accept-directory">
        {[...ACCEPTANCE_AREAS.filter((item) => item.groups), ...ACCEPTANCE_AREAS.filter((item) => !item.groups)].map((item) => {
          const { cases, completed, approved } = statusOf(item, events);
          return <li key={item.id}>
            <Link to={`${BASE}/${item.id}${href}`}>
              <span><strong>{item.title}</strong><span className="td-sub">{item.owner}</span></span>
              <span className={`td-accept-pill ${approved ? "is-pass" : ""}`}>
                {approved ? LABEL.approved : cases.length ? (scope.build && loaded && !error ? `${completed} / ${cases.length}` : `${cases.length} შემოწმება`) : "დაგეგმილია"}
              </span>
            </Link>
          </li>;
        })}
      </ul>
    </div>
  );
}

function useSave(onSave: (payload: Record<string, unknown>) => Promise<void>) {
  const requestId = useRef<string | null>(null);
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  function edited() {
    requestId.current = null;
    setMessage("");
    setFailed(false);
  }

  async function submit(payload: Record<string, unknown>, after?: () => void) {
    if (busy.current) return;
    busy.current = true;
    setSaving(true);
    setMessage("");
    setFailed(false);
    requestId.current ??= crypto.randomUUID();
    try {
      await onSave({ ...payload, request_id: requestId.current });
      requestId.current = null;
      setMessage("შენახულია.");
      after?.();
    } catch (e) {
      setFailed(true);
      setMessage(errorMessage(e));
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return { edited, submit, saving, message, failed };
}

function CaseRow({ test, current, history, editable, onSave }: {
  test: AcceptanceCase; current?: AcceptanceEvent; history: AcceptanceEvent[]; editable: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [id, title, reference, exercise, expected, conditional] = test;
  const [outcome, setOutcome] = useState("");
  const action = useSave(onSave);
  const acceptOutcomes: CaseOutcome[] = conditional
    ? ["pass", "fail", "blocked", "not_applicable"] : ["pass", "fail", "blocked"];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const issue = values.get("issue");
    void action.submit({
      outcome, evidence: values.get("evidence"), trainee: values.get("trainee"),
      issue_id: issue ? Number(issue) : null,
    }, () => { setOutcome(""); form.reset(); });
  }

  return (
    <details className="td-accept-case">
      <summary>
        <span><span className="td-accept-id">{id}</span> <strong>{title}</strong></span>
        <span className={`td-accept-pill is-${current?.outcome ?? "open"}`}>{current ? LABEL[current.outcome] : "შესამოწმებელია"}</span>
      </summary>
      <div className="td-accept-case-body">
        <p className="td-sub">WebMed · {reference}</p>
        <p>{exercise}</p>
        <p className="td-accept-expected"><strong>რას ველოდებით</strong> {expected}</p>
        {history.length > 0 && <details className="td-accept-history">
          <summary>შენახული შედეგები ({history.length})</summary>
          <EventList events={history} />
        </details>}
        {editable && <form className="td-accept-form" onSubmit={submit} onChange={action.edited}>
          <fieldset disabled={action.saving}>
            <legend>ჩაწერეთ შემოწმების შედეგი</legend>
            <label className="td-label">შედეგი
              <select required className="td-input" value={outcome} onChange={(event) => setOutcome(event.target.value)}>
                <option value="">აირჩიეთ შედეგი</option>
                {acceptOutcomes.map((value) => <option key={value} value={value}>{LABEL[value]}</option>)}
              </select>
            </label>
            {outcome === "pass" && <label className="td-label">თანამშრომელი, რომელმაც მოქმედება თავად შეასრულა
              <input className="td-input" name="trainee" maxLength={100} required />
              <span className="td-hint">ჯერ აჩვენეთ მოქმედება, შემდეგ თანამშრომელმა თავად გაიმეოროს თავისი როლით.</span>
            </label>}
            <label className="td-label">{outcome === "not_applicable" ? "რატომ არ გამოიყენება ფილიალში" : "რა მოხდა და რით დასტურდება"}
              <textarea className="td-input" name="evidence" required maxLength={2000} rows={3} />
              <span className="td-hint">მიუთითეთ სატესტო ჩანაწერი ან დაცულ მასალაზე მითითება. პაციენტის მონაცემები არ ჩაწეროთ.</span>
            </label>
            <label className="td-label">დაკავშირებული ხარვეზის ნომერი, თუ არსებობს
              <input className="td-input" name="issue" type="number" min={1} max={Number.MAX_SAFE_INTEGER} step={1} />
            </label>
            <button type="submit" className="td-btn td-btn-primary">{action.saving ? "ინახება…" : "შედეგის შენახვა"}</button>
          </fieldset>
          {action.message && <p className={action.failed ? "td-err" : "td-hint"} role={action.failed ? "alert" : "status"}>{action.message}</p>}
        </form>}
      </div>
    </details>
  );
}

function EventList({ events }: { events: AcceptanceEvent[] }) {
  return (
    <ul className="td-accept-events">
      {events.map((item) => <li key={item.id}>
        <strong>{LABEL[item.outcome]}</strong> <span className="td-sub">{item.actor} · {testDate(item.created_at)}</span>
        {item.trainee && <div className="td-sub">თავად შეასრულა: {item.trainee}</div>}
        {item.issue_id && <div className="td-sub">ხარვეზი №{item.issue_id}</div>}
        <p>{item.evidence}</p>
      </li>)}
    </ul>
  );
}

function Decision({ status, editable, onSave, onRefresh }: {
  status: ReturnType<typeof statusOf>; editable: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>; onRefresh: () => Promise<void>;
}) {
  const action = useSave(onSave);
  const ready = status.completed === status.cases.length;
  const [outcome, setOutcome] = useState<DecisionOutcome>("approved");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (outcome === "approved" && !ready) return;
    void action.submit({ outcome, code: values.get("code"), evidence: values.get("evidence") }, () => form.reset());
  }

  return <section className="td-accept-decision td-card">
    <h2>განყოფილების გადაწყვეტილება</h2>
    {status.approved && <p className="td-accept-pill is-pass">{LABEL.approved}</p>}
    {status.decision?.outcome === "approved" && !status.approved && <p className="td-warn">დამტკიცების შემდეგ შედეგები შეიცვალა. საჭიროა ხელახლა დამტკიცება.</p>}
    {!ready && <p className="td-hint">დამტკიცებამდე დაასრულეთ დარჩენილი შემოწმებები და პრაქტიკული დავალებები.</p>}
    {status.decision && <EventList events={status.records.filter((item) => !item.case_id)} />}
    {editable && (!status.approved || outcome === "changes_requested") && <form className="td-accept-form" onSubmit={submit} onChange={action.edited}>
      <fieldset disabled={action.saving}>
        <legend>ავსებს განყოფილების უფლებამოსილი ხელმძღვანელი</legend>
        <label className="td-label">გადაწყვეტილება
          <select className="td-input" value={outcome} onChange={(event) => setOutcome(event.target.value === "changes_requested" ? "changes_requested" : "approved")}>
            <option value="approved">დამტკიცება</option>
            <option value="changes_requested">შესწორების მოთხოვნა</option>
          </select>
        </label>
        <label className="td-label">ხელმძღვანელის პირადი კოდი
          <input className="td-input" name="code" type="password" minLength={64} maxLength={64} required autoComplete="off" />
        </label>
        <label className="td-label">გადაწყვეტილების ჩანაწერი
          <textarea className="td-input" name="evidence" maxLength={2000} required rows={2} />
        </label>
        <button className="td-btn td-btn-primary" type="submit" disabled={outcome === "approved" && !ready}>
          {action.saving ? "ინახება…" : "გადაწყვეტილების შენახვა"}
        </button>
      </fieldset>
      {action.message && <p className={action.failed ? "td-err" : "td-hint"} role={action.failed ? "alert" : "status"}>{action.message}</p>}
      {action.failed && <button className="td-btn td-btn-ghost" type="button" onClick={onRefresh}>შედეგების განახლება</button>}
    </form>}
    {editable && status.approved && outcome === "approved" && <button className="td-btn td-btn-ghost" type="button"
      onClick={() => setOutcome("changes_requested")}>შესწორების მოთხოვნა</button>}
  </section>;
}

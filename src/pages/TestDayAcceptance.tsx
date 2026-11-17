import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ACCEPTANCE_AREAS, PREVIOUS_BILLING_GROUPS,
  type AcceptanceArea, type AcceptanceCase, type AcceptanceEnvironment,
  type AcceptanceEvent, type AcceptanceOwner, type CaseOutcome, type DecisionOutcome,
} from "../../supabase/functions/testday/acceptanceCatalog";
import { TdError, tdWrite } from "../lib/testdayApi";
import "./TestDayAcceptance.css";
import { CASE_GROUP } from "../../supabase/functions/testday/caseWalkthrough";
import { CaseWalkthrough } from "./CaseWalkthrough";
import type { State } from "../lib/testdayApi";
import { BillingPilot } from "./BillingPilot";
import { PILOT_GROUP } from "../../supabase/functions/testday/billingPilot";
import { TestDayBilling } from "./TestDayBilling";
import { BILLING_RESULT } from "../lib/testdayBillingLabels";

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
  acceptance_owner_required: "გადაწყვეტილების ჩაწერამდე მიუთითეთ პასუხისმგებელი პირი.",
  acceptance_owner_stale: "პასუხისმგებელი პირი შეიცვალა. განაახლეთ მონაცემები და ისევ სცადეთ.",
  acceptance_incomplete: "დამტკიცებამდე დაასრულეთ ყველა სავალდებულო შემოწმება და პრაქტიკული დავალება.",
  acceptance_stale: "შემოწმების შედეგები შეიცვალა. გადახედეთ ახალ შედეგებს და ისევ სცადეთ.",
  acceptance_request_conflict: "ეს შედეგი უკვე შეიცვალა. განაახლეთ სია და ისევ სცადეთ.",
  acceptance_issue: "ამ ნომრით ხარვეზი ვერ მოიძებნა.",
};

const EMR_HOST: Record<AcceptanceEnvironment, string> = {
  shadow: "https://emr-shadow.gh.ge:8443",
  foundation: "https://emr.gh.ge",
};

type ReportAction = (test: AcceptanceCase) => void;
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

export function TestDayAcceptance({ roster, slug, token, name, onLogout, onReport }: {
  roster: State | null; slug?: string; token: string; name: string; onLogout: () => void; onReport?: ReportAction;
}) {
  const [params, setParams] = useSearchParams();
  const build = params.get("build") ?? "";
  const environment = params.get("env") === "foundation" ? "foundation" : "shadow";
  const currentArea = ACCEPTANCE_AREAS.find(({ id }) => id === slug);
  const archive = slug === "billing" && params.get("list") === "previous";
  const billing = slug === "billing" && !archive;
  const isExercise = billing && environment === "shadow" && !params.has("action") && params.get("list") !== "actions";
  const original = params.get("case") === "original" || /^ER-0[1-8]$/.test(params.get("step") ?? "");
  const pilot = isExercise && (original || "walkthrough");
  const [lastBuild, setLastBuild] = useState(() => localStorage.getItem("mts-billing-pilot-build") ?? "");
  const area = pilot && currentArea ? { ...currentArea, groups: [original ? PILOT_GROUP : CASE_GROUP] } : archive && currentArea ? { ...currentArea, groups: PREVIOUS_BILLING_GROUPS } : currentArea;
  const settings = useRef<HTMLDetailsElement>(null);
  const [owners, setOwners] = useState<AcceptanceOwner[] | null>(null);
  const [ownerError, setOwnerError] = useState(false);
  const owner = owners?.find((item) => item.area === area?.id);

  const refreshOwners = useCallback(async () => {
    setOwnerError(false);
    try {
      setOwners(await tdWrite<AcceptanceOwner[]>(token, "acceptance_owners", {}));
    } catch (e) {
      if (e instanceof TdError && e.status === 401) onLogout();
      else setOwnerError(true);
    }
  }, [onLogout, token]);

  useEffect(() => { void refreshOwners(); }, [refreshOwners]);

  async function saveOwner(payload: Record<string, unknown>) {
    try {
      const saved = await tdWrite<AcceptanceOwner>(token, "acceptance_owner", {
        ...payload, area: area?.id, by: name, owner_updated_at: owner?.updated_at ?? null,
      });
      setOwners((current) => [...(current ?? []).filter((item) => item.area !== saved.area), saved]);
    } catch (e) {
      if (e instanceof TdError && e.status === 401) onLogout();
      throw e;
    }
  }

  const selected = new URLSearchParams(params);
  const directory = new URLSearchParams(params);
  directory.delete("list");
  directory.delete("action");
  for (const key of ["step", "from", "issue", "case", "view"]) directory.delete(key);
  const pilotParams = new URLSearchParams(directory);
  if (environment === "foundation") pilotParams.delete("build");
  pilotParams.set("env", "shadow");
  const originalParams = new URLSearchParams(pilotParams);
  originalParams.set("case", "original");
  const actions = new URLSearchParams(directory);
  actions.set("list", "actions");
  const resumeParams = new URLSearchParams(pilotParams);
  resumeParams.set("build", lastBuild);
  const href = directory.size ? `?${directory}` : "";
  const previous = new URLSearchParams(directory);
  previous.set("list", "previous");

  function chooseBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    selected.set("build", String(values.get("build")).trim().toLowerCase());
    selected.set("env", String(values.get("environment")));
    if (pilot) {
      const version = selected.get("build") ?? "";
      localStorage.setItem("mts-billing-pilot-build", version);
      setLastBuild(version);
    }
    setParams(selected);
    if (settings.current) settings.current.open = false;
  }

  function showSettings() {
    if (!settings.current) return;
    settings.current.open = true;
    settings.current.querySelector<HTMLInputElement>('input[name="build"]')?.focus();
    settings.current.scrollIntoView({ block: "nearest" });
  }

  const ownerEditor = area && !archive && owners && !ownerError && (
    <OwnerEditor key={area.id} owner={owner} onSave={saveOwner} onRefresh={refreshOwners} />
  );
  const buildPicker = (
    <form className="td-card td-accept-build" onSubmit={chooseBuild} key={environment + build}>
      <label className="td-label">გარემო
        <select name="environment" defaultValue={environment} className="td-input">
          <option value="shadow">{ENV.shadow}</option>
          {!pilot && <option value="foundation">{ENV.foundation}</option>}
        </select>
      </label>
      <label className="td-label">გამოცდილი ვერსიის კოდი
        <input className="td-input" name="build" defaultValue={build} pattern={BUILD} required spellCheck={false}
          autoComplete="off" placeholder={billing ? "ჩასვით ვერსიის კოდი" : "მაგ. 579d2ff94ead"} />
      </label>
      <button className="td-btn td-btn-primary" type="submit">{billing ? "ვერსიის არჩევა" : "ვერსიის გახსნა"}</button>
    </form>
  );
  const ownerWarning = ownerError && !archive && (
    <div className="td-row">
      <p role="alert" className="td-err">პასუხისმგებელი პირების სია ვერ ჩაიტვირთა.</p>
      <button className="td-btn td-btn-ghost" type="button" onClick={refreshOwners}>სიის განახლება</button>
    </div>
  );
  const workspace = (
    <Workspace roster={roster} key={`${environment}/${build}/${slug ?? ""}/${archive}/${pilot}`} pilot={pilot} scope={{ environment, build }}
      token={token} name={name} onLogout={onLogout} area={area} href={href} archive={archive}
      owners={ownerError ? [] : owners ?? []} onRefreshOwners={refreshOwners} onSettings={showSettings} onReport={onReport} />
  );

  if (billing) {
    return (
      <div className="td-pad td-accept td-billing-page">
        <header className="td-billing-page-top">
          <div>
            <Link className="td-link" to={BASE + href}>ყველა მიმართულება</Link>
            {pilot === "walkthrough" ? <span className="td-sub"> · ბილინგი</span> : <h1>ბილინგის შემოწმება</h1>}
            <div className="td-sub">მცხეთის საავადმყოფო{build ? ` · ${ENV[environment]} · ${build}` : ""}</div>
          </div>
        </header>
        <details className="td-billing-settings" ref={settings}>
          <summary>პასუხისმგებელი და ვერსია</summary>
          <div className="td-billing-settings-main">{ownerEditor}{buildPicker}</div>
          {ownerWarning}
          <div className="td-row td-billing-settings-links">
            <a className="td-link" href={EMR_HOST.shadow + "/version.json"} target="_blank" rel="noreferrer">სატესტო ვერსიის კოდი</a>
            <a className="td-link" href={EMR_HOST.foundation + "/version.json"} target="_blank" rel="noreferrer">სამუშაო ვერსიის კოდი</a>
            <Link className="td-link" to={`?${originalParams}`}>წინა სასწავლო შემთხვევა (8 ნაბიჯი)</Link>
            <Link className="td-link" to={`${BASE}/billing?${previous}`}>წინა სია და შედეგები</Link>
          </div>
        </details>
        <nav className="td-row" aria-label="ბილინგის სამუშაო სივრცე">
          <Link className={pilot === "walkthrough" ? "td-btn td-btn-primary" : "td-btn td-btn-ghost"} aria-current={pilot === "walkthrough" ? "page" : undefined} to={`?${pilotParams}`}>შემთხვევის გეგმა</Link>
          <Link className={!pilot ? "td-btn td-btn-primary" : "td-btn td-btn-ghost"} aria-current={!pilot ? "page" : undefined} to={`?${actions}`}>ქმედებების სრული სია</Link>
          {pilot && !build && !params.has("issue") && lastBuild && <Link className="td-link" to={`?${resumeParams}`}>შემოწმების გაგრძელება · {lastBuild}</Link>}
        </nav>
        {workspace}
      </div>
    );
  }
  return (
    <div className="td-pad td-accept">
      {slug && <Link className="td-link" to={archive ? `${BASE}/billing${href}` : BASE + href}>
        {archive ? "ბილინგის მიმდინარე სია" : "ყველა მიმართულება"}
      </Link>}
      <header className="td-accept-heading">
        <p className="td-sub">GeoHospitals · მცხეთის საავადმყოფო</p>
        <h1>{archive ? "ბილინგის წინა სია" : area?.title ?? "შემოწმება და მიღება"}</h1>
        <p>{archive ? "წინა სიის შედეგები ჩანს არჩეული ვერსიის მიხედვით." : area?.owner ?? "აირჩიეთ მიმართულება, ჩაატარეთ პრაქტიკული შემოწმება და ჩაიწერეთ შედეგები."}</p>
      </header>
      {ownerWarning}
      {ownerEditor}
      {buildPicker}
      {slug && !area ? <p className="td-empty">მიმართულება ვერ მოიძებნა.</p> : workspace}
    </div>
  );
}

type StatePage = { events: AcceptanceEvent[]; before: number | null };

function Workspace({ roster, pilot, scope, token, name, onLogout, area, href, owners, onRefreshOwners, archive, onSettings, onReport }: {
  scope: Scope; token: string; name: string; onLogout: () => void; area?: AcceptanceArea; href: string;
  owners: AcceptanceOwner[]; onRefreshOwners: () => Promise<void>;
  roster: State | null; pilot: boolean | "walkthrough"; archive: boolean; onSettings: () => void; onReport?: ReportAction;
}) {
  const { build, environment } = scope;
  const areaId = area?.id;
  const readScope = useMemo(() => ({
    build, environment, ...(areaId && { area: areaId }), ...(archive && { archive: true }), ...(pilot && { pilot }),
  }), [build, environment, areaId, archive, pilot]);
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
      const results = await Promise.all([
        tdWrite<StatePage>(token, "acceptance_state", readScope),
        ...(!areaId ? [tdWrite<StatePage>(token, "acceptance_state", { build, environment, area: "billing" })] : []),
      ]);
      const [result, billingResult] = results;
      const rows = billingResult
        ? [...result.events.filter((row) => row.area !== "billing"), ...billingResult.events].sort((a, b) => b.id - a.id)
        : result.events;
      if (pilot === "walkthrough") {
        setEvents((current) => [...new Map([...current, ...rows].map((e) => [e.id, e])).values()].sort((a, b) => b.id - a.id));
      } else setEvents(rows);
      setBefore(result.before);
    } catch (e) {
      if (e instanceof TdError && e.status === 401) onLogout();
      else setError(true);
    } finally {
      setLoaded(true);
    }
  }, [areaId, build, environment, onLogout, pilot, readScope, token]);

  useEffect(() => {
    if (!build) return;
    void refresh();
    if (pilot !== "walkthrough") return;
    const resume = () => { void refresh(); };
    window.addEventListener("focus", resume);
    return () => window.removeEventListener("focus", resume);
  }, [build, pilot, refresh]);

  const save: Save = async (action, payload) => {
    try {
      const saved = await tdWrite<AcceptanceEvent>(token, action, { ...scope, ...payload, ...(pilot && { pilot }), by: name });
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
      const result = await tdWrite<StatePage>(token, "acceptance_state", { ...readScope, before });
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
    const owner = owners.find((item) => item.area === area.id);
    const editable = !!scope.build && loaded && !error && !archive;
    const decision = (
      <Decision status={status} editable={editable} owner={owner}
        onSave={(payload) => save("acceptance_sign", {
          ...payload, area: area.id, basis: status.basis, owner_updated_at: owner?.updated_at,
        })}
        onRefresh={async () => { await Promise.all([refresh(), onRefreshOwners()]); }} />
    );
    const loading = scope.build && !loaded && <p role="status" className="td-hint">შედეგები იტვირთება…</p>;
    const loadError = error && (
      <div className="td-row">
        <p role="alert" className="td-err">შედეგები ვერ ჩაიტვირთა.</p>
        <button className="td-btn td-btn-ghost" type="button" onClick={refresh}>ხელახლა ჩატვირთვა</button>
      </div>
    );
    const moreHistory = before !== null && (
      <div>
        <button className="td-btn td-btn-ghost" type="button" disabled={loadingHistory} onClick={loadHistory}>ძველი შედეგების ჩატვირთვა</button>
        {historyError && <p className="td-err" role="alert">ძველი შედეგები ვერ ჩაიტვირთა.</p>}
      </div>
    );
    const onSaveCase = (id: string, payload: Record<string, unknown>) => save("acceptance_run", { ...payload, area: area.id, case_id: id });

    const Exercise = pilot === "walkthrough" ? CaseWalkthrough : BillingPilot;
    if (pilot) return <>{loading}{loadError}
      <Exercise roster={roster} events={status.records} build={build} target={EMR_HOST.shadow} editable={editable} ownerName={owner?.name}
        onSettings={onSettings} onSave={onSaveCase} decision={<>
          <p>აქ ბილინგის განყოფილება ადასტურებს ამ სასწავლო შემთხვევის შედეგს არჩეულ ვერსიაზე.</p>
          {!owner && <button className="td-btn td-btn-ghost" type="button" onClick={onSettings}>პასუხისმგებელი პირის მითითება</button>}
          {decision}
        </>} />
      {moreHistory}
      {build && <button className="td-btn td-btn-ghost" type="button" disabled={!loaded} onClick={refresh}>შენახული შედეგების განახლება</button>}
    </>;
    if (area.id === "billing" && !archive) {
      return (
        <>
          {loading}
          {loadError}
          <TestDayBilling groups={area.groups} latest={status.latest} completed={status.completed}
            buildReady={!!build} target={EMR_HOST[environment]} onSettings={onSettings} onReport={onReport}
            renderResult={(test) => {
              const history = status.records.filter((item) => item.case_id === test[0]);
              return (
                <div key={test[0]}>
                  {editable && <ResultForm test={test} onSave={(payload) => onSaveCase(test[0], payload)} billing />}
                  {!!history.length && <details className="td-accept-history">
                    <summary>წინა ცდები ({history.length})</summary>
                    <EventList events={history} billing />
                  </details>}
                </div>
              );
            }}
            decision={build && !error ? <div className="td-billing-main">
              {decision}
              {moreHistory}
              <button className="td-btn td-btn-ghost" type="button" disabled={!loaded} onClick={refresh}>შედეგების განახლება</button>
            </div> : null} />
        </>
      );
    }

    return (
      <div className="td-accept-work">
        <div className="td-accept-status">
          <div>
            <strong>{status.completed} / {status.cases.length} დასრულებული შემოწმება</strong>
            {scope.build && <span className="td-sub">{ENV[scope.environment]} · {scope.build}</span>}
          </div>
          {scope.build && <button className="td-btn td-btn-ghost" type="button" disabled={!loaded} onClick={refresh}>შედეგების განახლება</button>}
        </div>
        {!scope.build && <p className="td-warn">{archive ? "წინა შედეგების სანახავად აირჩიეთ გამოცდილი ვერსია." : "შედეგის შესანახად გახსენით გამოცდილი ვერსია."}</p>}
        {loading}
        {loadError}
        {area.groups.map(({ title, role, cases }) => (
          <section className="td-accept-group" key={title}>
            <h2>{title}</h2>
            <p className="td-sub">{role}</p>
            {cases.map((test) => <CaseRow key={test[0]} test={test} current={status.latest.get(test[0])}
              history={status.records.filter((item) => item.case_id === test[0])} editable={editable}
              onSave={(payload) => onSaveCase(test[0], payload)} />)}
          </section>
        ))}
        {decision}
        {moreHistory}
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
          const owner = owners.find((value) => value.area === item.id);
          return <li key={item.id}>
            <Link to={`${BASE}/${item.id}${href}`}>
              <span><strong>{item.title}</strong><span className={owner ? "td-sub td-accept-owner-name" : "td-sub"}>{owner?.name ?? item.owner}</span></span>
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

function OwnerEditor({ owner, onSave, onRefresh }: {
  owner?: AcceptanceOwner; onSave: (payload: Record<string, unknown>) => Promise<void>; onRefresh: () => Promise<void>;
}) {
  const action = useSave(onSave);
  const [editing, setEditing] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    void action.submit({ owner: values.get("owner") }, () => setEditing(false));
  }

  return <section className="td-card td-accept-owner">
    <div className="td-h2row">
      <div><h2>პასუხისმგებელი პირი</h2>
        {owner ? <p><strong>{owner.name}</strong> <span className="td-sub">მიუთითა {owner.recorded_by} · {testDate(owner.updated_at)}</span></p>
          : <p className="td-sub">ჯერ არ არის მითითებული.</p>}
      </div>
      {!editing && <button className="td-btn td-btn-ghost" type="button" onClick={() => { action.edited(); setEditing(true); }}>
        {owner ? "შეცვლა" : "პასუხისმგებელი პირის მითითება"}
      </button>}
    </div>
    {editing && <form className="td-accept-form" onSubmit={submit} onChange={action.edited}>
      <fieldset disabled={action.saving}>
        <label className="td-label">სახელი და გვარი
          <input className="td-input" name="owner" defaultValue={owner?.name} required maxLength={100} />
        </label>
        <div className="td-row">
          <button className="td-btn td-btn-primary" type="submit">შენახვა</button>
          <button className="td-btn td-btn-ghost" type="button" onClick={() => setEditing(false)}>გაუქმება</button>
          {action.failed && <button className="td-btn td-btn-ghost" type="button" onClick={() => { setEditing(false); void onRefresh(); }}>სიის განახლება</button>}
        </div>
      </fieldset>
    </form>}
    {action.message && <p className={action.failed ? "td-err" : "td-hint"} role={action.failed ? "alert" : "status"}>{action.message}</p>}
  </section>;
}

function CaseRow({ test, current, history, editable, onSave }: {
  test: AcceptanceCase; current?: AcceptanceEvent; history: AcceptanceEvent[]; editable: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [id, title, reference, exercise, expected] = test;
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
        {editable && <ResultForm test={test} onSave={onSave} />}
      </div>
    </details>
  );
}

function ResultForm({ test, onSave, billing = false }: {
  test: AcceptanceCase; onSave: (payload: Record<string, unknown>) => Promise<void>; billing?: boolean;
}) {
  const conditional = test[5];
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
        <form className="td-accept-form" onSubmit={submit} onChange={action.edited}>
          <fieldset disabled={action.saving}>
            {!billing && <legend>ჩაწერეთ შემოწმების შედეგი</legend>}
            <label className="td-label">შედეგი
              <select required className="td-input" value={outcome} onChange={(event) => setOutcome(event.target.value)}>
                <option value="">აირჩიეთ შედეგი</option>
                {acceptOutcomes.map((value) => <option key={value} value={value}>{billing ? BILLING_RESULT[value] : LABEL[value]}</option>)}
              </select>
            </label>
            {outcome === "pass" && <label className="td-label">{billing ? "ვინ შეასრულა ქმედება დამოუკიდებლად" : "თანამშრომელი, რომელმაც მოქმედება თავად შეასრულა"}
              <input className="td-input" name="trainee" maxLength={100} required />
              <span className="td-hint">ჯერ აჩვენეთ მოქმედება, შემდეგ თანამშრომელმა თავად გაიმეოროს თავისი როლით.</span>
            </label>}
            <label className="td-label">{outcome === "not_applicable" ? "რატომ არ გამოიყენება ფილიალში" : "რა მოხდა და რით დასტურდება"}
              <textarea className="td-input" name="evidence" required maxLength={2000} rows={3} />
              <span className="td-hint">მიუთითეთ საცდელი ჩანაწერის კოდი ან დაცულ მასალაზე ბმული. პაციენტის მონაცემები არ ჩაწეროთ.</span>
            </label>
            <label className="td-label">დაკავშირებული ხარვეზის ნომერი, თუ არსებობს
              <input className="td-input" name="issue" type="number" min={1} max={Number.MAX_SAFE_INTEGER} step={1} />
            </label>
            <button type="submit" className="td-btn td-btn-primary">{action.saving ? "ინახება…" : "შედეგის შენახვა"}</button>
          </fieldset>
          {action.message && <p className={action.failed ? "td-err" : "td-hint"} role={action.failed ? "alert" : "status"}>{action.message}</p>}
        </form>
  );
}

function EventList({ events, billing = false }: { events: AcceptanceEvent[]; billing?: boolean }) {
  return (
    <ul className="td-accept-events">
      {events.map((item) => <li key={item.id}>
        <strong>{billing ? BILLING_RESULT[item.outcome] ?? LABEL[item.outcome] : LABEL[item.outcome]}</strong> <span className="td-sub">{item.department_owner ? "ჩაწერა " : ""}{item.actor} · {testDate(item.created_at)}</span>
        {item.department_owner && <div className="td-sub">პასუხისმგებელი პირი: {item.department_owner}</div>}
        {item.trainee && <div className="td-sub">თავად შეასრულა: {item.trainee}</div>}
        {item.issue_id && <div className="td-sub">ხარვეზი №{item.issue_id}</div>}
        <p>{item.evidence}</p>
      </li>)}
    </ul>
  );
}

function Decision({ status, editable, owner, onSave, onRefresh }: {
  status: ReturnType<typeof statusOf>; editable: boolean; owner?: AcceptanceOwner;
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
    void action.submit({ outcome, evidence: values.get("evidence") }, () => form.reset());
  }

  return <section className="td-accept-decision td-card">
    <h2>განყოფილების გადაწყვეტილება</h2>
    {status.approved && <p className="td-accept-pill is-pass">{LABEL.approved}</p>}
    {status.decision?.outcome === "approved" && !status.approved && <p className="td-warn">დამტკიცების შემდეგ შედეგები შეიცვალა. საჭიროა ხელახლა დამტკიცება.</p>}
    {!ready && <p className="td-hint">დამტკიცებამდე დაასრულეთ დარჩენილი შემოწმებები და პრაქტიკული დავალებები.</p>}
    {status.decision && <EventList events={status.records.filter((item) => !item.case_id)} />}
    {!owner && <p className="td-hint">გადაწყვეტილების ჩასაწერად მიუთითეთ პასუხისმგებელი პირი.</p>}
    {editable && owner && (!status.approved || outcome === "changes_requested") && <form className="td-accept-form" onSubmit={submit} onChange={action.edited}>
      <fieldset disabled={action.saving}>
        <legend>ჩაწერეთ პასუხისმგებელ პირთან შეთანხმებული გადაწყვეტილება</legend>
        <label className="td-label">გადაწყვეტილება
          <select className="td-input" value={outcome} onChange={(event) => setOutcome(event.target.value === "changes_requested" ? "changes_requested" : "approved")}>
            <option value="approved">დამტკიცება</option>
            <option value="changes_requested">შესწორების მოთხოვნა</option>
          </select>
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
    {editable && owner && status.approved && outcome === "approved" && <button className="td-btn td-btn-ghost" type="button"
      onClick={() => setOutcome("changes_requested")}>შესწორების მოთხოვნა</button>}
  </section>;
}

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import type { AcceptanceEvent } from "../../supabase/functions/testday/acceptanceCatalog";
import { PILOT_STEPS, PILOT_TITLE } from "../../supabase/functions/testday/billingPilot";
import "./BillingPilot.css";

type Draft = { outcome: string; trainee: string; evidence: string; observed: Record<string, string>; training: string };
type Props = {
  events: AcceptanceEvent[]; build: string; target: string; editable: boolean; decision: ReactNode;
  ownerName?: string; onSettings: () => void;
  onSave: (stepId: string, payload: Record<string, unknown>) => Promise<void>;
};

const resultLabel: Record<string, string> = { pass: "გაიარა", fail: "ხარვეზი", blocked: "შეფერხდა" };
const freshDraft = (): Draft => ({ outcome: "", trainee: "", evidence: "", observed: {}, training: "" });

export function BillingPilot({ events, build, target, editable, decision, ownerName, onSettings, onSave }: Props) {
  const [params, setParams] = useSearchParams();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(() => window.matchMedia("(min-width: 761px)").matches);
  const heading = useRef<HTMLHeadingElement>(null);
  const requestIds = useRef<Record<string, string>>({});
  const latest = useMemo(() => {
    const map = new Map<string, AcceptanceEvent>();
    [...events].sort((a, b) => b.id - a.id).forEach((event) => {
      if (event.case_id && !map.has(event.case_id)) map.set(event.case_id, event);
    });
    return map;
  }, [events]);
  const firstOpen = PILOT_STEPS.find((item) => latest.get(item.id)?.outcome !== "pass") ?? PILOT_STEPS[PILOT_STEPS.length - 1];
  const step = PILOT_STEPS.find((item) => item.id === params.get("step")) ?? firstOpen;
  const index = PILOT_STEPS.findIndex((item) => item.id === step.id);
  const draft = drafts[step.id] ?? freshDraft();
  const attempts = events.filter((event) => event.case_id === step.id).sort((a, b) => b.id - a.id);
  const completed = PILOT_STEPS.filter((item) => latest.get(item.id)?.outcome === "pass").length;
  const issue = params.get("issue");
  const origin = params.get("from");
  const sameBuild = Boolean(issue && origin && build.trim().toLowerCase() === origin.trim().toLowerCase());
  const exactAmounts = step.amounts.every((amount) => draft.observed[amount.key]?.trim() && Number(draft.observed[amount.key]) === amount.value);
  const canPass = exactAmounts && (step.id !== "ER-08" || draft.training === "independent");
  const failedAttempt = attempts.find((event) => event.outcome === "fail" && event.issue_id);
  const retestParams = new URLSearchParams(params);
  if (failedAttempt?.issue_id) { retestParams.set("issue", String(failedAttempt.issue_id)); retestParams.set("from", build); retestParams.set("step", step.id); }

  function update(change: Partial<Draft>) {
    delete requestIds.current[step.id];
    setSavedMessage("");
    setDrafts((current) => ({ ...current, [step.id]: { ...(current[step.id] ?? freshDraft()), ...change } }));
  }
  function open(id: string) {
    const next = new URLSearchParams(params);
    if (id !== step.id) { next.delete("issue"); next.delete("from"); }
    setCopied(false);
    next.set("step", id);
    setParams(next, { replace: true, preventScrollReset: true });
    setError("");
    if (window.matchMedia("(max-width: 760px)").matches) setShowSteps(false);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "nearest" });
    });
  }
  async function save() {
    if (saving) return;
    if (sameBuild) { setError("ხელახალი შემოწმებისთვის აირჩიეთ საწყისისგან განსხვავებული ვერსია."); return; }
    if (!draft.outcome || !draft.trainee.trim() || !draft.evidence.trim() || (step.id === "ER-08" && !draft.training)) {
      setError("შეავსეთ შედეგი, შემსრულებელი და მტკიცებულება. სწავლების ნაბიჯზე აირჩიეთ შესრულების ფორმაც.");
      return;
    }
    if (draft.outcome === "pass" && !canPass) {
      setError("წარმატებისთვის ფაქტობრივი თანხები უნდა ემთხვეოდეს მოსალოდნელს. მეორე შემთხვევა დამოუკიდებლად უნდა შესრულდეს.");
      return;
    }
    setSaving(true); setError("");
    try {
      const observed = Object.fromEntries(step.amounts.filter((amount) => draft.observed[amount.key]?.trim()).map((amount) => [amount.key, Number(draft.observed[amount.key])]));
      const requestId = requestIds.current[step.id] ?? crypto.randomUUID();
      requestIds.current[step.id] = requestId;
      await onSave(step.id, { outcome: draft.outcome, observed, trainee: draft.trainee.trim(), evidence: draft.evidence.trim(), ...(draft.training ? { training_outcome: draft.training } : {}), ...(issue ? { issue_id: Number(issue) } : {}), ...(origin ? { origin_build: origin } : {}), request_id: requestId });
      delete requestIds.current[step.id];
      setSavedMessage(draft.outcome === "fail" ? "შედეგი შენახულია. ხარვეზის ნომერი მითითებულია ამ ნაბიჯის ისტორიაში." : "ნაბიჯის შედეგი შენახულია.");
      setDrafts((current) => ({ ...current, [step.id]: freshDraft() }));
      if (draft.outcome === "pass" && PILOT_STEPS[index + 1]) open(PILOT_STEPS[index + 1].id);
    } catch {
      setError("შედეგი ვერ შეინახა. სცადეთ ხელახლა.");
    } finally { setSaving(false); }
  }
  async function copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.id);
    if (build) url.searchParams.set("build", build);
    try { await navigator.clipboard.writeText(url.toString()); setCopied(true); }
    catch { setError("ბმული ვერ დაკოპირდა. დააკოპირეთ მისამართი ბრაუზერიდან."); }
  }

  return <section className="pilot" aria-label={PILOT_TITLE}>
    <header className="pilot-header">
      <div><p className="pilot-kicker">სასწავლო შემთხვევა · გადაუდებელი დახმარება</p><h2>{PILOT_TITLE}</h2>
        <p>სალარო და ბილინგი ერთად გადიან ერთ შემთხვევას, მიღებიდან საბოლოო ანგარიშამდე.</p></div>
      <div className="pilot-build"><span>გარემო: <strong>{params.get("env") === "foundation" ? "სამუშაო გარემო" : "სატესტო გარემო"}</strong></span><span>ვერსია: <strong>{build || "არ არის არჩეული"}</strong></span><button type="button" onClick={onSettings}>{build ? "ვერსიის შეცვლა" : "შემოწმების დაწყება"}</button></div>
    </header>
    <div className="pilot-fixture"><strong>სასწავლო მონაცემები</strong><span>დაზღვეული ვიზიტი 100 ₾, დაფარვა 80 ₾. ეკგ 30 ₾ პაციენტის გადასახდელია. შეცდომით დამატებულია მეორე ეკგ 30 ₾.</span></div>
    {savedMessage && <p className="td-hint" role="status">{savedMessage}</p>}
    <div className="pilot-layout">
      <details className="pilot-step-menu" open={showSteps} onToggle={(event) => setShowSteps(event.currentTarget.open)}><summary>ნაბიჯები: {index + 1} / {PILOT_STEPS.length}</summary><nav className="pilot-steps" aria-label="შემთხვევის ნაბიჯები"><div className="pilot-progress"><strong>{completed} / {PILOT_STEPS.length}</strong><span>ნაბიჯი დასრულებულია</span></div><progress value={completed} max={PILOT_STEPS.length} aria-label="დასრულებული ნაბიჯები" />
        {PILOT_STEPS.map((item, i) => { const result = latest.get(item.id); return <button type="button" key={item.id} className={`pilot-step${step.id === item.id ? " active" : ""}`} aria-current={step.id === item.id ? "step" : undefined} onClick={() => open(item.id)}><span className="pilot-number">{i + 1}</span><span><strong>{item.title}</strong><small>{result ? resultLabel[result.outcome] || result.outcome : "შესამოწმებელია"}</small></span></button>; })}
      </nav></details>
      <main className="pilot-work">
        <div className="pilot-step-head"><div><p className="pilot-kicker">ნაბიჯი {index + 1} / {PILOT_STEPS.length} · {step.role}</p><h3 ref={heading} tabIndex={-1}>{step.title}</h3></div><button className="pilot-link" type="button" onClick={() => void copyLink()}>{copied ? "ბმული დაკოპირდა" : "ნაბიჯის ბმულის კოპირება"}</button></div>
        {(issue || origin) && <p className="pilot-retest">ხელახალი შემოწმება {issue && <> · ხარვეზი #{issue}</>}{origin && <> · საწყისი ვერსია: {origin}</>}</p>}
        <div className="pilot-instructions"><h4>რა უნდა გააკეთოთ</h4><ol>{step.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>{step.path && target && <p><a href={new URL(step.path, target).toString()} target="_blank" rel="noreferrer">MediMind-ში შესაბამისი გვერდის გახსნა</a></p>}</div>
        <div className="pilot-expected"><strong>მოსალოდნელი შედეგი</strong><p>{step.expected}</p><span>{step.evidence}</span></div>
        {step.links.length > 0 && <p className="pilot-related">დაკავშირებული შემოწმებები: {step.links.map((link) => { const query = new URLSearchParams(params); query.set("list", "actions"); query.set("action", link); query.delete("step"); query.delete("issue"); query.delete("from"); return <a key={link} href={`?${query}`}>{link} </a>; })}</p>}
        <form className="pilot-form" onSubmit={(event) => { event.preventDefault(); void save(); }}>
          <h4>დააფიქსირეთ შედეგი</h4>
          {step.amounts.length > 0 && <div className="pilot-amounts">{step.amounts.map((amount) => <label key={amount.key}>{amount.label}<span className="pilot-amount-input"><input type="number" step="any" inputMode="decimal" value={draft.observed[amount.key] ?? ""} onChange={(event) => update({ observed: { ...draft.observed, [amount.key]: event.target.value } })} disabled={!editable} /><span>₾</span></span><small>მოსალოდნელი: {amount.value} ₾</small></label>)}</div>}
          <label>ვინ შეასრულა<input maxLength={100} value={draft.trainee} onChange={(event) => update({ trainee: event.target.value })} disabled={!editable} /></label>
          {step.id === "ER-08" && <label>მეორე შემთხვევის შესრულება<select value={draft.training} onChange={(event) => update({ training: event.target.value })} disabled={!editable}><option value="">აირჩიეთ</option><option value="independent">დამოუკიდებლად</option><option value="help">დახმარებით</option><option value="rebook">განმეორებითი სწავლება საჭიროა</option></select></label>}
          <label>ქვითარი, სასწავლო ჩანაწერი ან სხვა მტკიცებულება<textarea rows={3} maxLength={1100} value={draft.evidence} onChange={(event) => update({ evidence: event.target.value })} disabled={!editable} /></label>
          <p className="pilot-guidance">წარმატებისთვის თანხები ზუსტად უნდა ემთხვეოდეს მოსალოდნელს. ხარვეზის ან შეფერხებისას მიუწვდომელი თანხები ცარიელი დატოვეთ.</p><fieldset disabled={!editable}><legend>შედეგი</legend><div className="pilot-outcomes">{Object.entries(resultLabel).map(([value, label]) => <label key={value}><input type="radio" name={`outcome-${step.id}`} value={value} disabled={value === "pass" && !canPass} checked={draft.outcome === value} onChange={() => update({ outcome: value })} />{label}</label>)}</div></fieldset>
          {sameBuild && <p className="pilot-error">ხელახალი შემოწმებისთვის აირჩიეთ ახალი ვერსია. <button type="button" onClick={onSettings}>ვერსიის არჩევა</button></p>}
          {error && <p className="pilot-error" role="alert">{error}</p>}
          <div className="pilot-actions"><button type="submit" className="pilot-primary" disabled={!editable || saving || sameBuild}>{saving ? "ინახება…" : draft.outcome === "fail" ? "შედეგისა და ხარვეზის შენახვა" : "შედეგის შენახვა"}</button></div>
          {!editable && <p>შედეგის შესანახად აირჩიეთ ვერსია და გარემო.</p>}
        </form>
        {failedAttempt?.issue_id && <p><a href={`?${retestParams}`}>ხარვეზის ხელახლა შემოწმება სხვა ვერსიაზე</a></p>}
        <section className="pilot-history"><h4>ამ ნაბიჯის წინა შედეგები</h4>{attempts.length === 0 ? <p>ამ ვერსიაზე ჩანაწერი ჯერ არ არის.</p> : <ul>{attempts.map((event) => <li key={event.id}><strong>{resultLabel[event.outcome] || event.outcome}</strong><span>{event.trainee || event.actor} · {new Date(event.created_at).toLocaleString("ka-GE")}</span><p>{event.evidence}</p>{event.issue_id && <a href={`/admin/testday/issues#issue-${event.issue_id}`}>ხარვეზი #{event.issue_id}</a>}</li>)}</ul>}</section>
        {index < PILOT_STEPS.length - 1 && <button type="button" className="pilot-next" onClick={() => open(PILOT_STEPS[index + 1].id)}>შემდეგი ნაბიჯი</button>}
        {index === PILOT_STEPS.length - 1 && <section className="pilot-decision">{ownerName && <p>განყოფილების პასუხისმგებელი: <strong>{ownerName}</strong></p>}{decision}</section>}
      </main>
    </div>
  </section>;
}

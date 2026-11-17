import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { AcceptanceEvent } from "../../supabase/functions/testday/acceptanceCatalog";
import {
  CASE_ROLES,
  CASE_STEPS,
  CASE_TITLE,
  casePeopleOptions,
  caseSeatOptions,
} from "../../supabase/functions/testday/caseWalkthrough";
import type { State } from "../lib/testdayApi";
import "./CaseWalkthrough.css";

type Draft = {
  visit: string;
  outcome: string;
  trainee: string;
  seat: string;
  reference: string;
  evidence: string;
  observed: Record<string, string>;
  training: string;
};
type Props = {
  events: AcceptanceEvent[];
  build: string;
  target: string;
  editable: boolean;
  decision: ReactNode;
  ownerName?: string;
  onSettings: () => void;
  onSave: (stepId: string, payload: Record<string, unknown>) => Promise<void>;
  roster: State | null;
};
const blank = (): Draft => ({
  visit: "",
  outcome: "",
  trainee: "",
  seat: "",
  reference: "",
  evidence: "",
  observed: {},
  training: "",
});
const labels: Record<string, string> = { pass: "გაიარა", fail: "ხარვეზი", blocked: "შეფერხდა" };

export function CaseWalkthrough(
  { events, build, target, editable, decision, ownerName, onSettings, onSave, roster }: Props,
) {
  const [params, setParams] = useSearchParams();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [manualSeat, setManualSeat] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const requestIds = useRef<Record<string, string>>({});
  const lock = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (params.get("step") || params.get("view") === "signoff") heading.current?.focus({ preventScroll: true });
  }, [params]);
  const latest = useMemo(() => {
    const result = new Map<string, AcceptanceEvent>();
    [...events].sort((a, b) => b.id - a.id).forEach((event) => {
      if (event.case_id && !result.has(event.case_id)) result.set(event.case_id, event);
    });
    return result;
  }, [events]);
  const firstOpen = CASE_STEPS.find((item) => latest.get(item.id)?.outcome !== "pass") ??
    CASE_STEPS[CASE_STEPS.length - 1];
  const step = CASE_STEPS.find((item) => item.id === params.get("step"));
  const index = step ? CASE_STEPS.findIndex((item) => item.id === step.id) : -1;
  const completed = CASE_STEPS.filter((item) => latest.get(item.id)?.outcome === "pass").length;

  function open(id?: string) {
    const next = new URLSearchParams(params);
    next.delete("view");
    if (id) next.set("step", id);
    else next.delete("step");
    if (id !== step?.id) {
      next.delete("issue");
      next.delete("from");
    }
    setParams(next, { preventScrollReset: false });
    setError("");
    setMessage("");
  }
  function signoff() {
    const next = new URLSearchParams(params);
    next.delete("step");
    next.delete("issue");
    next.delete("from");
    next.set("view", "signoff");
    setParams(next);
    setError("");
  }
  function update(change: Partial<Draft>) {
    if (!step) return;
    delete requestIds.current[step.id];
    setDrafts((current) => ({ ...current, [step.id]: { ...(current[step.id] ?? initialDraft), ...change } }));
  }
  if (params.get("view") === "signoff") {
    return (
      <section className="case-walk">
        <button type="button" className="case-back" onClick={() => open()}>შემთხვევის აღწერა</button>
        <h2 ref={heading} tabIndex={-1}>განყოფილების გადაწყვეტილება</h2>
        <p>ვერსია: {build || "არ არის არჩეული"}</p>
        <div className="case-comparison">
          <table>
            <thead>
              <tr>
                <th>მოქმედება და როლი</th>
                <th>ერთად</th>
                <th>დამოუკიდებლად</th>
              </tr>
            </thead>
            <tbody>
              {CASE_STEPS.slice(0, 11).map((item, i) => (
                <tr key={item.id}>
                  <th scope="row">
                    {item.title}
                    <small>{CASE_ROLES[item.role].label}</small>
                  </th>
                  {[item, CASE_STEPS[i + 11]].map((roundStep) => {
                    const event = latest.get(roundStep.id);
                    return (
                      <td key={roundStep.id}>
                        <button
                          type="button"
                          onClick={() => open(roundStep.id)}
                        >
                          {event ? labels[event.outcome] || event.outcome : "შესამოწმებელია"}
                        </button>
                        <small>{event?.trainee || event?.actor || ""}</small>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section className="case-decision">
          {ownerName && (
            <p>
              განყოფილების პასუხისმგებელი: <strong>{ownerName}</strong>
            </p>
          )}
          {decision}
        </section>
      </section>
    );
  }
  if (!step) {
    const roleKeys = Array.from(new Set(CASE_STEPS.map((item) => item.role)));
    return (
      <section className="case-walk" aria-label={CASE_TITLE}>
        <header className="case-brief-head">
          <div>
            <p className="case-eyebrow">სასწავლო შემთხვევა · მორიგეობის დავალება</p>
            <h2>{CASE_TITLE}</h2>
            <p>პაციენტი გულის ფრიალით მიმართავს გადაუდებელ განყოფილებას. გაწერამდე გუნდმა უნდა დაადგინოს, როგორ მოხვდა ერთი შესრულებული ეკგ ანგარიშში ორჯერ და როგორ დაუბრუნდება პაციენტს 30 ₾.</p>
            <button className="case-primary" type="button" onClick={() => open(firstOpen.id)}>
              {completed ? "შემოწმების გაგრძელება" : "პირველი ნაბიჯის გახსნა"}
            </button>
            {build && <span className="case-progress"> {completed} / {CASE_STEPS.length}</span>}
          </div>
          <div className="case-build">
            <span>
              გარემო: <strong>{params.get("env") === "foundation" ? "სამუშაო" : "სატესტო"}</strong>
            </span>
            <span>
              ვერსია: <strong>{build || "არ არის არჩეული"}</strong>
            </span>
            <button type="button" onClick={onSettings}>{build ? "ვერსიის შეცვლა" : "ვერსიის არჩევა"}</button>
          </div>
        </header>
        <div className="case-brief-grid">
          <div className="case-story">
            <h3>რა უნდა მივიღოთ ბოლოს</h3>
            <p>
              ზრდასრული გამოგონილი პაციენტი გულის ფრიალით მოდის გადაუდებელში. ექიმი ნიშნავს ერთ ეკგ-ს, რომელიც
              სრულდება ერთხელ. ანგარიშზე განზრახ მეორდება მხოლოდ ეკგ-ის დარიცხვა. შესწორების შემდეგ პაციენტი ბინაზე
              ეწერება.
            </p>
            <p>სასწავლო კონსულტაცია 100 ₾ ღირს, აქედან დაზღვევა 80 ₾-ს ფარავს. ეკგ 30 ₾ პაციენტის გადასახდელია.</p>
            <table className="case-balance"><thead><tr><th>ანგარიში</th><th>სულ</th><th>დაზღვევა</th><th>პაციენტი</th></tr></thead>
              <tbody><tr><th>გადახდისას</th><td>160 ₾</td><td>80 ₾</td><td>80 ₾</td></tr>
              <tr><th>შესწორების შემდეგ</th><td>130 ₾</td><td>80 ₾</td><td>50 ₾</td></tr></tbody></table>
            <p>დაბრუნებული თანხა: 30 ₾. პაციენტის საბოლოო დავალიანება: 0 ₾.</p>
            <p>
              <strong>პირველი გასვლა:</strong> ტესტერი და თანამშრომლები ერთად ასრულებენ.{" "}
              <strong>მეორე გასვლა:</strong> თანამშრომლები ახალ სასწავლო ვიზიტზე დამოუკიდებლად იმეორებენ.
            </p>
          </div>
          <aside className="case-prerequisites">
            <h3>დაწყებამდე</h3>
            <ul>
              <li>აირჩიეთ შესამოწმებელი ვერსია და გარემო. გადაამოწმეთ, ხელმისაწვდომია თუ არა ტრიაჟის დაფა.</li>
              <li>
                ადგილზე მოამზადეთ სასწავლო ტარიფი და პოლისი. მოლარისა და ეკგ-ის შემსრულებლის ანგარიშები
                ადგილობრივად გადაამოწმეთ.
              </li>
              <li>შეამოწმეთ, რომ თითოეულ მონაწილეს თავისი როლის ანგარიში აქვს.</li>
              <li>ორივე გასვლისთვის გამოიყენეთ განსხვავებული გამოგონილი ვიზიტის ნომერი.</li>
              <li>შეინახეთ ვიზიტისა და ქვითრის საცნობარო ნომრები, პაროლის გარეშე.</li>
              <li>თითოეული მოქმედება თავისი როლით სრულდება. თუ უფლება არ არის, მონიშნეთ შეფერხება.</li>
            </ul>
          </aside>
        </div>
        <details className="case-cast">
          <summary>მონაწილეები და სატესტო ანგარიშები ({roleKeys.length} როლი)</summary>
          <p>
            ანგარიშები და მონაწილეები შერჩეულია არსებული სიის მიხედვით. შეუსაბამობა გადაამოწმეთ განყოფილებასთან.
          </p>
          <div className="case-cast-grid">
            {roleKeys.map((key) => {
              const role = CASE_ROLES[key];
              const seats = roster ? caseSeatOptions(key, roster) : [];
              const people = roster ? casePeopleOptions(key, roster) : [];
              const department = roster?.departments.find((item) => item.slug === role.dept);
              return (
                <article key={key}>
                  <h4>{role.label}</h4>
                  <p>
                    <strong>თანამშრომელი:</strong>{" "}
                    {people.length ? people.map((person) => person.name).join(", ") : "დასაზუსტებელია"}
                  </p>
                  <p>
                    <strong>ანგარიში:</strong>{" "}
                    {seats.length ? seats.map((seat) => seat.email).join(", ") : "დასაზუსტებელია"}
                  </p>
                  {department?.seat_note && <p className="case-notice">{department.seat_note}</p>}
                  <a href={`/admin/testday/d/${role.dept}#accounts`}>განყოფილების ანგარიშების ნახვა</a>
                </article>
              );
            })}
          </div>
        </details>
        <details className="case-conditional">
          <summary>საჭიროებისას: ბილინგის ხელმძღვანელი</summary>
          <p>
            თუ შემთხვევა ჩაკეტილია, უფლებამოსილ ხელმძღვანელს მიაწოდეთ ვიზიტის ნომერი და შესწორების მიზეზი.
            მოქმედება განაგრძეთ შესაბამისი როლით.
          </p>
          <a href="/admin/testday/d/billing#accounts">ბილინგის ანგარიშების ნახვა</a>
        </details>
        <button className="case-back" type="button" onClick={signoff}>განყოფილების გადაწყვეტილება</button>
        <section className="case-chronology">
          <h3>შემთხვევის მსვლელობა</h3>
          <div className="case-rounds">
            {[0, 11].map((start) => {
              const items = CASE_STEPS.slice(start, start + 11);
              const next = items.find((item) => latest.get(item.id)?.outcome !== "pass");
              return (
                <button
                  type="button"
                  key={start}
                  onClick={() => build ? open((next ?? items[items.length - 1]).id) : onSettings()}
                >
                  <strong>{start === 0 ? "ერთად შესრულება" : "დამოუკიდებელი შესრულება"}</strong>
                  <span>
                    {items.filter((item) => latest.get(item.id)?.outcome === "pass").length} / 11 გავლილია
                  </span>
                  <span>{next ? `შემდეგი: ${next.title}` : "ყველა ნაბიჯი გავლილია"}</span>
                </button>
              );
            })}
          </div>
          <p>ეს 11 მოქმედება გაიარეთ ჯერ ერთად, შემდეგ მეორე შემთხვევაზე დამოუკიდებლად.</p>
          <ol>
            {CASE_STEPS.slice(0, 11).map((item) => (
              <li key={item.id}>
                <span>{item.phase}</span>
                <strong>{item.title}</strong>
                <small>
                  {CASE_ROLES[item.role].label} ·{" "}
                  {latest.get(item.id) ? labels[latest.get(item.id)!.outcome] || "ჩაწერილია" : "შესამოწმებელია"}
                </small>
              </li>
            ))}
          </ol>
        </section>
      </section>
    );
  }
  const role = CASE_ROLES[step.role];
  const seats = roster ? caseSeatOptions(step.role, roster) : [];
  const priorRoleEvent =
    CASE_STEPS.slice(index < 11 ? 0 : 11, index).filter((item) => item.role === step.role).map((item) =>
      latest.get(item.id)
    ).filter((event): event is AcceptanceEvent => Boolean(event)).sort((a, b) => b.id - a.id)[0];
  const priorSeat = priorRoleEvent?.evidence.match(/^ანგარიში: ([^\n]+)/m)?.[1]?.trim() ?? "";
  const initialDraft = { ...blank(), trainee: priorRoleEvent?.trainee ?? "", seat: priorSeat };
  const draft = drafts[step.id] ?? initialDraft;
  const people = roster ? casePeopleOptions(step.role, roster) : [];
  const department = roster?.departments.find((item) => item.slug === role.dept);
  const phaseStart = index < 11 ? 0 : 11;
  const previous = index > phaseStart ? CASE_STEPS[index - 1] : undefined;
  const successfulEvent = (id: string) =>
    [...events].filter((event) => event.case_id === id && event.outcome === "pass").sort((a, b) => b.id - a.id)[0];
  // A builder may have retested a later handoff before the team starts this round.
  const roundSteps = CASE_STEPS.slice(phaseStart, phaseStart + 11);
  const phaseStartEvent = events.find((event) => event.outcome === "pass" && roundSteps.some((s) => s.id === event.case_id));
  const recordedVisit = phaseStartEvent?.evidence.match(/^ვიზიტი: ([^\n]+)/)?.[1]?.trim() ?? "";
  const visit = recordedVisit || draft.visit;
  const firstVisit = successfulEvent(CASE_STEPS[0].id)?.evidence.match(/^ვიზიტი: ([^\n]+)/)?.[1]?.trim() ?? "";
  const repeatedVisit = phaseStart === 11 && Boolean(firstVisit && visit.trim() && firstVisit === visit.trim());
  const gap = !(params.get("issue") && params.get("from") && build && params.get("from") !== build) &&
    CASE_STEPS.slice(0, index).some((item) => latest.get(item.id)?.outcome !== "pass");
  const previousEvent = previous ? latest.get(previous.id) : undefined;
  const attempts = events.filter((event) => event.case_id === step.id).sort((a, b) => b.id - a.id);
  const issue = params.get("issue");
  const origin = params.get("from");
  const sameBuild = Boolean(issue && origin && build.trim().toLowerCase() === origin.trim().toLowerCase());
  const exact = step.amounts.every((amount) =>
    draft.observed[amount.key]?.trim() && Number(draft.observed[amount.key]) === amount.value
  );
  const canPass = Boolean(
    !gap && !repeatedVisit && visit.trim() && exact && draft.trainee.trim() && draft.seat.trim() &&
      draft.reference.trim() && (!step.training || draft.training === "independent"),
  );
  const failed = attempts.find((event) => event.outcome === "fail" && event.issue_id);
  const retest = new URLSearchParams(params);
  if (failed?.issue_id) {
    retest.set("issue", String(failed.issue_id));
    retest.set("from", build);
    retest.set("step", step.id);
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setError("ბმული ვერ დაკოპირდა. გამოიყენეთ ბრაუზერის მისამართი.");
    }
  }
  async function save() {
    if (lock.current || !step) return;
    if (sameBuild) {
      setError("ხელახალი შემოწმებისთვის აირჩიეთ საწყისისგან განსხვავებული ვერსია.");
      return;
    }
    if (!draft.outcome || !draft.trainee.trim() || !draft.evidence.trim()) {
      setError("შეავსეთ შემსრულებელი, შედეგი და მომხდარის აღწერა.");
      return;
    }
    if (draft.outcome === "pass" && !canPass) {
      setError(
        "წარმატებისთვის ჯერ გაიარეთ წინა ნაბიჯები და შეავსეთ ვიზიტი, ანგარიში და საცნობარო ნომერი. თანხები უნდა ემთხვეოდეს მოსალოდნელს, სწავლება კი დამოუკიდებლად შესრულდეს.",
      );
      return;
    }
    lock.current = true;
    setSaving(true);
    setError("");
    try {
      const observed = Object.fromEntries(
        step.amounts.filter((amount) => draft.observed[amount.key]?.trim()).map((
          amount,
        ) => [amount.key, Number(draft.observed[amount.key])]),
      );
      const requestId = requestIds.current[step.id] ?? crypto.randomUUID();
      requestIds.current[step.id] = requestId;
      await onSave(step.id, {
        visit: visit.trim(),
        outcome: draft.outcome,
        trainee: draft.trainee.trim(),
        seat: draft.seat.trim(),
        reference: draft.reference.trim(),
        evidence: draft.evidence.trim(),
        observed,
        ...(draft.training ? { training_outcome: draft.training } : {}),
        ...(issue ? { issue_id: Number(issue) } : {}),
        ...(origin ? { origin_build: origin } : {}),
        request_id: requestId,
      });
      delete requestIds.current[step.id];
      setDrafts((current) => ({ ...current, [step.id]: blank() }));
      if (draft.outcome === "pass") {
        if (CASE_STEPS[index + 1]) open(CASE_STEPS[index + 1].id);
        else signoff();
      } else setMessage("შედეგი შენახულია.");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(
        code === "acceptance_case_order"
          ? "ჯერ დაასრულეთ წინა ნაბიჯები ორივე გასვლაში და სცადეთ ხელახლა."
          : code === "acceptance_case_visit"
          ? "გადაამოწმეთ ვიზიტის ნომერი: გამოიყენეთ ამ გასვლის პირველი ნაბიჯის ნომერი და მეორე გასვლისთვის სხვა ნომერი."
          : "შედეგი ვერ შეინახა. ჩანაწერი შენარჩუნებულია, სცადეთ ხელახლა.",
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  return (
    <section className="case-walk" aria-label={CASE_TITLE}>
      <div className="case-topline">
        <button type="button" onClick={() => open()}>შემთხვევის აღწერა</button>
        <span>{completed} / {CASE_STEPS.length} დასრულდა</span>
        <button type="button" onClick={onSettings}>ვერსია: {build || "აირჩიეთ"}</button>
        <button type="button" onClick={() => void copyLink()}>
          {copied ? "ბმული დაკოპირდა" : "ნაბიჯის ბმული"}
        </button>
      </div>
      <details className="case-nav">
        <summary>ნაბიჯები: {index + 1} / {CASE_STEPS.length}</summary>
        <ol>
          {CASE_STEPS.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.id === step.id ? "step" : undefined}
                onClick={() => open(item.id)}
              >
                {i + 1}. {item.title}
              </button>
            </li>
          ))}
        </ol>
      </details>
      <div className="case-work-head">
        <div>
          <p className="case-eyebrow">{step.phase} · ნაბიჯი {index + 1} / {CASE_STEPS.length}</p>
          <h2 ref={heading} tabIndex={-1}>{step.title}</h2>
          <p className="case-role">
            პასუხისმგებელი: <strong>{role.label}</strong>
          </p>
          <p>ამ როლის უფლების გარეშე მონიშნეთ შეფერხება. სხვა როლით ჩანაცვლება არ გამოიყენოთ.</p>
        </div>
        <span className="case-environment">
          {params.get("env") === "foundation" ? "სამუშაო გარემო" : "სატესტო გარემო"}
        </span>
      </div>
      {(issue || origin) && (
        <p className="case-notice">
          ხელახალი შემოწმება: {issue && `ხარვეზი #${issue}`} {origin && `საწყისი ვერსია: ${origin}`}
        </p>
      )}
      {message && <p role="status" className="case-notice">{message}</p>}
      {previous && (
        <section className="case-handoff">
          <h3>რა გადმოგეცათ წინა ნაბიჯიდან</h3>
          <strong>{previous.title}</strong>
          {previousEvent
            ? (
              <>
                <p>
                  {labels[previousEvent.outcome] || previousEvent.outcome} ·{" "}
                  {previousEvent.trainee || previousEvent.actor}
                </p>
                <p className="case-record">{previousEvent.evidence}</p>
              </>
            )
            : <p>წინა ნაბიჯზე შედეგი ჯერ არ ჩაწერილა.</p>}
        </section>
      )}
      <div className="case-work-grid">
        <div>
          <section className="case-task">
            <h3>თქვენი დავალება</h3>
            <p>
              <strong>სად:</strong> {step.where}
            </p>
            {target && step.path && (
              <a
                className="case-page-link"
                href={new URL(step.path, target).toString()}
                target="_blank"
                rel="noreferrer"
              >
                MediMind-ში ამ გვერდის გახსნა
              </a>
            )}
            <ol>{step.instructions.map((text) => <li key={text}>{text}</li>)}</ol>
          </section>
          <section className="case-expected">
            <h3>რას უნდა ხედავდეთ</h3>
            <p>{step.expected}</p>
            <p>{step.evidence}</p>
            <strong>შემდეგ ადამიანს გადაეცით</strong>
            <p>{step.handoff}</p>
          </section>
        </div>
        <aside className="case-account">
          <h3>ვინ ასრულებს</h3>
          <strong>{role.label}</strong>
          <p>{role.purpose}</p>
          <p>
            მონაწილეები:{" "}
            {people.length ? people.map((person) => person.name).join(", ") : "შესაბამისი მონაწილე ვერ მოიძებნა"}
          </p>
          <p>
            ანგარიშები:{" "}
            {seats.length ? seats.map((seat) => seat.email).join(", ") : "შესაბამისი ანგარიში ვერ მოიძებნა"}
          </p>
          {department?.seat_note && <p className="case-notice">{department.seat_note}</p>}
          <a href={`/admin/testday/d/${role.dept}#accounts`}>განყოფილების ანგარიშების ნახვა</a>
        </aside>
      </div>
      <form
        className="case-form"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <h3>ჩაწერეთ, რა მოხდა</h3>
        <label>
          სასწავლო ვიზიტის ნომერი<input
            maxLength={100}
            value={visit}
            onChange={(event) => update({ visit: event.target.value })}
            readOnly={Boolean(recordedVisit)}
            disabled={!editable || saving}
          />
        </label>
        {index !== phaseStart && recordedVisit && (
          <p className="case-hint">ნომერი აღებულია ამ გასვლის პირველი ნაბიჯიდან.</p>
        )}
        {repeatedVisit && (
          <p className="case-notice">
            დამოუკიდებელი გასვლისთვის გამოიყენეთ პირველი გასვლისგან განსხვავებული ვიზიტის ნომერი.
          </p>
        )}
        {gap && (
          <p className="case-notice">
            წინა ნაბიჯები ჯერ არ დასრულებულა. შეგიძლიათ დაათვალიეროთ ან შეფერხება ჩაიწეროთ.
          </p>
        )}
        <div className="case-input-grid">
          <label>
            შემსრულებელი<input
              list={`case-people-${step.id}`}
              maxLength={100}
              value={draft.trainee}
              onChange={(event) => update({ trainee: event.target.value })}
              disabled={!editable || saving}
            />
          </label>
          <datalist id={`case-people-${step.id}`}>
            {people.map((person) => <option key={person.id} value={person.name} />)}
          </datalist>
          <label>
            გამოყენებული ანგარიში<select
              value={manualSeat[step.id] ||
                  (manualSeat[step.id] === undefined && Boolean(draft.seat) &&
                    !seats.some((seat) => seat.email === draft.seat))
                ? "__other"
                : draft.seat}
              onChange={(event) => {
                const other = event.target.value === "__other";
                setManualSeat((current) => ({ ...current, [step.id]: other }));
                update({ seat: other ? "" : event.target.value });
              }}
              disabled={!editable || saving}
            >
              <option value="">აირჩიეთ ანგარიში</option>
              {draft.seat && !manualSeat[step.id] && !seats.some((seat) => seat.email === draft.seat) && (
                <option value={draft.seat}>{draft.seat} (წინა ჩანაწერიდან, გადაამოწმეთ)</option>
              )}
              {seats.map((seat) => (
                <option key={seat.email} value={seat.email}>
                  {seat.email} {seat.role ? `(${seat.role})` : ""}
                </option>
              ))}
              <option value="__other">სხვა სატესტო ანგარიში</option>
            </select>
          </label>
        </div>
        {(manualSeat[step.id] ||
          (manualSeat[step.id] === undefined && Boolean(draft.seat) &&
            !seats.some((seat) => seat.email === draft.seat))) && (
          <label>
            გადამოწმებული სატესტო ანგარიშის სახელი ან ელფოსტა<input
              type="text"
              value={draft.seat}
              onChange={(event) => update({ seat: event.target.value })}
              disabled={!editable || saving}
            />
          </label>
        )}
        <label>
          {step.reference}
          <input
            maxLength={200}
            value={draft.reference}
            onChange={(event) => update({ reference: event.target.value })}
            disabled={!editable || saving}
          />
        </label>
        {step.amounts.length > 0 && (
          <div className="case-input-grid">
            {step.amounts.map((amount) => (
              <label key={amount.key}>
                {amount.label}
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={draft.observed[amount.key] ?? ""}
                  onChange={(event) =>
                    update({ observed: { ...draft.observed, [amount.key]: event.target.value } })}
                  disabled={!editable || saving}
                />
                <small>მოსალოდნელი: {amount.value} ₾</small>
              </label>
            ))}
          </div>
        )}
        {step.training && (
          <label>
            მეორე შემთხვევის შესრულება<select
              value={draft.training}
              onChange={(event) => update({ training: event.target.value })}
              disabled={!editable || saving}
            >
              <option value="">აირჩიეთ</option>
              <option value="independent">დამოუკიდებლად</option>
              <option value="help">დახმარებით</option>
              <option value="rebook">განმეორებითი სწავლება საჭიროა</option>
            </select>
          </label>
        )}
        <label>
          რა მოხდა და რა გადაეცემა შემდეგ ადამიანს<textarea
            rows={3}
            maxLength={1100}
            value={draft.evidence}
            onChange={(event) => update({ evidence: event.target.value })}
            disabled={!editable || saving}
          />
        </label>
        <p className="case-hint">
          პაროლი არ ჩაწეროთ. ხარვეზის ან შეფერხებისას მიუწვდომელი ანგარიში, ნომერი და თანხა ცარიელი დატოვეთ.
        </p>
        <fieldset disabled={!editable || saving}>
          <legend>შედეგი</legend>
          <div className="case-outcomes">
            {Object.entries(labels).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`case-${step.id}`}
                  value={value}
                  checked={draft.outcome === value}
                  onChange={() => update({ outcome: value })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {sameBuild && (
          <p className="case-error">
            ხელახალი შემოწმებისთვის აირჩიეთ ახალი ვერსია.{" "}
            <button type="button" onClick={onSettings}>ვერსიის არჩევა</button>
          </p>
        )}
        {error && <p className="case-error" role="alert">{error}</p>}
        <button className="case-primary" type="submit" disabled={!editable || saving || sameBuild}>
          {saving ? "ინახება…" : draft.outcome === "fail" ? "შედეგისა და ხარვეზის შენახვა" : "შედეგის შენახვა"}
        </button>
        {!build && <button type="button" className="case-back" onClick={onSettings}>შედეგის შესანახად აირჩიეთ ვერსია</button>}
      </form>
      {step.links.length > 0 && (
        <p className="case-related">
          დაკავშირებული შემოწმებები: {step.links.map((link) => {
            const query = new URLSearchParams(params);
            query.set("list", "actions");
            query.set("action", link);
            query.delete("step");
            query.delete("issue");
            query.delete("from");
            return <a key={link} href={`?${query}`}>{link}</a>;
          })}
        </p>
      )}
      <section className="case-history">
        <h3>ამ ნაბიჯის ჩანაწერები</h3>
        {attempts.length
          ? attempts.map((event) => (
            <article key={event.id}>
              <strong>{labels[event.outcome] || event.outcome}</strong>
              <p>{event.trainee || event.actor} · {new Date(event.created_at).toLocaleString("ka-GE")}</p>
              <p className="case-record">{event.evidence}</p>
              {event.issue_id && (
                <a href={`/admin/testday/issues#issue-${event.issue_id}`}>ხარვეზი #{event.issue_id}</a>
              )}
            </article>
          ))
          : <p>ამ ვერსიაზე ჩანაწერი ჯერ არ არის.</p>}
        {failed?.issue_id && <a href={`?${retest}`}>ხარვეზის ხელახლა შემოწმება სხვა ვერსიაზე</a>}
      </section>
      <div className="case-bottom-nav">
        {index > 0 && <button type="button" onClick={() => open(CASE_STEPS[index - 1].id)}>წინა ნაბიჯი</button>}
        {index < CASE_STEPS.length - 1 && (
          <button
            type="button"
            onClick={() => open(CASE_STEPS[index + 1].id)}
          >
            შემდეგი ნაბიჯი
          </button>
        )}
      </div>
      {index === CASE_STEPS.length - 1 && (
        <button type="button" className="case-back" onClick={signoff}>განყოფილების გადაწყვეტილება</button>
      )}
    </section>
  );
}

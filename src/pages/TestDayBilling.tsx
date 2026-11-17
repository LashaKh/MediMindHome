import { useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import type { AcceptanceCase, AcceptanceEvent, AcceptanceGroup } from "../../supabase/functions/testday/acceptanceCatalog";
import { BILLING_RESULT } from "../lib/testdayBillingLabels";
import "./TestDayBilling.css";

const FILTERS = [
  ["all", "ყველა"],
  ["open", "შესამოწმებელი"],
  ["fail", "ხარვეზი"],
  ["blocked", "შეფერხებული"],
  ["complete", "დასრულებული"],
] as const;

type Entry = { test: AcceptanceCase; group: AcceptanceGroup };
type BillingWorkspaceProps = {
  groups: readonly AcceptanceGroup[];
  latest: ReadonlyMap<string, AcceptanceEvent>;
  completed: number;
  buildReady: boolean;
  target: string;
  onSettings: () => void;
  onReport?: (test: AcceptanceCase) => void;
  renderResult: (test: AcceptanceCase) => ReactNode;
  decision: ReactNode;
};

const resultOf = (item?: AcceptanceEvent) => item?.outcome ?? "open";
const done = (item?: AcceptanceEvent) => item?.outcome === "pass" || item?.outcome === "not_applicable";

export function TestDayBilling({
  groups, latest, completed, buildReady, target, onSettings, onReport, renderResult, decision,
}: BillingWorkspaceProps) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const heading = useRef<HTMLHeadingElement>(null);
  const items = useMemo(() => groups.flatMap((group) => group.cases.map((test) => ({ test, group }))), [groups]);
  const terms = query.trim().toLocaleLowerCase("ka-GE").split(/\s+/).filter(Boolean);
  const visible = items.filter(({ test, group }) => {
    if (groupName && group.title !== groupName) return false;
    const result = latest.get(test[0]);
    if (filter === "complete" ? !done(result) : filter !== "all" && resultOf(result) !== filter) return false;
    if (!terms.length) return true;
    const searchable = [test[0], test[1], test[2], test[6]?.fixture, group.title].join(" ").toLocaleLowerCase("ka-GE");
    return terms.every((term) => searchable.includes(term));
  });
  const selected = visible.find(({ test }) => test[0] === params.get("action")) ?? visible[0];
  const selectedIndex = selected ? visible.indexOf(selected) : -1;
  const next = visible[selectedIndex + 1];
  const previous = visible[selectedIndex - 1];

  function open(entry: Entry) {
    const updated = new URLSearchParams(params);
    updated.set("action", entry.test[0]);
    setParams(updated, { replace: true, preventScrollReset: true });
    setShowMobileList(false);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches) heading.current?.scrollIntoView({ block: "start" });
    });
  }

  function reset() {
    setQuery("");
    setGroupName("");
    setFilter("all");
  }

  const issueCount = items.filter(({ test }) => latest.get(test[0])?.outcome === "fail").length;

  return (
    <section className="td-billing-workspace" aria-label="ბილინგის შემოწმება">
      <div className="td-billing-summary">
        <div>
          <strong>{buildReady ? `${completed} / ${items.length} დასრულდა` : `${items.length} შესამოწმებელი ქმედება`}</strong>
          {buildReady && issueCount > 0 && <button type="button" className="td-billing-fail-link" onClick={() => { setGroupName(""); setQuery(""); setFilter("fail"); setShowMobileList(true); }}>
            ხარვეზი: {issueCount}
          </button>}
        </div>
        {buildReady && <progress value={completed} max={items.length} aria-label="დასრულებული შემოწმებები" />}
      </div>
      <div className="td-billing-columns">
        <aside className="td-billing-rail" aria-label="ქმედებების სია">
          <button type="button" className="td-billing-mobile-list-toggle" aria-controls="td-billing-rail-body"
            aria-expanded={showMobileList} onClick={() => setShowMobileList((open) => !open)}>
            <span>{showMobileList ? "სიის დახურვა" : "სხვა ქმედების მოძებნა"}</span><span aria-hidden="true">{showMobileList ? "▴" : "▾"}</span>
          </button>
          <div id="td-billing-rail-body" className={`td-billing-rail-body${showMobileList ? " is-open" : ""}`}>
          <div className="td-billing-search">
            <label className="td-label" htmlFor="td-billing-query">ქმედების მოძებნა</label>
            <input id="td-billing-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              className="td-input" placeholder="ქმედება, კოდი ან დამფინანსებელი" />
            <label className="td-label" htmlFor="td-billing-group">სამუშაო ჯგუფი</label>
            <select id="td-billing-group" className="td-input" value={groupName} onChange={(event) => setGroupName(event.target.value)}>
              <option value="">ყველა ჯგუფი</option>
              {groups.map((group) => <option key={group.title} value={group.title}>{group.title} ({group.cases.length})</option>)}
            </select>
            {buildReady && <div className="td-billing-filters" role="group" aria-label="შედეგით გაფილტვრა">
              {FILTERS.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}
            </div>}
          </div>
          <nav className="td-billing-list" aria-label="აირჩიეთ ქმედება">
            {groups.map((group) => {
              const entries = visible.filter((entry) => entry.group === group);
              if (!entries.length) return null;
              const count = group.cases.filter((test) => done(latest.get(test[0]))).length;
              return (
                <section className="td-billing-list-group" key={group.title}>
                  <h2>{group.title} <span>{buildReady ? `${count}/${group.cases.length}` : group.cases.length}</span></h2>
                  <ul>
                    {entries.map((entry) => {
                      const [id, title] = entry.test;
                      const state = resultOf(latest.get(id));
                      return <li key={id}>
                        <button type="button" aria-current={selected === entry ? "true" : undefined} onClick={() => open(entry)}>
                          <strong>{title}</strong>
                          <span className="td-billing-row-meta"><span>{id}</span>{buildReady && <span className={`td-billing-state is-${state}`}>{BILLING_RESULT[state]}</span>}</span>
                        </button>
                      </li>;
                    })}
                  </ul>
                </section>
              );
            })}
            {!visible.length && <div className="td-billing-empty">
              <p>ამ პირობებით ქმედება ვერ მოიძებნა.</p>
              <button className="td-btn td-btn-ghost" type="button" onClick={reset}>ფილტრების მოხსნა</button>
            </div>}
          </nav>
          </div>
        </aside>
        <div className="td-billing-main">
          {selected && (
            <article className="td-billing-detail" aria-labelledby="td-billing-action">
              <div className="td-billing-detail-top">
                <span className="td-billing-detail-group">{selected.group.title}</span>
                <div className="td-billing-pager" aria-label="ქმედებებს შორის გადასვლა">
                  <button type="button" className="td-btn td-btn-ghost" disabled={!previous} onClick={() => previous && open(previous)}>წინა</button>
                  <button type="button" className="td-btn td-btn-ghost" disabled={!next} onClick={() => next && open(next)}>შემდეგი</button>
                </div>
              </div>
              <h2 id="td-billing-action" ref={heading} tabIndex={-1}>{selected.test[1]}</h2>
              <div className="td-billing-action-meta">
                <span>{selected.group.role}</span><code>{selected.test[0]}</code>
                <span className={`td-billing-state is-${resultOf(latest.get(selected.test[0]))}`}>{BILLING_RESULT[resultOf(latest.get(selected.test[0]))]}</span>
              </div>
              {selected.test[6] && (
                <>
                  <div className="td-billing-fixture">
                    <h3>მოამზადეთ</h3>
                    <p>{selected.test[6].fixture}</p>
                  </div>
                  <div className="td-billing-procedure">
                    <div className="td-billing-steps-title">
                      <h3>შეასრულეთ MediMind-ში</h3>
                      <a className="td-link" href={target + selected.test[6].path} target="_blank" rel="noreferrer">გახსენით MediMind</a>
                    </div>
                    <ol>{selected.test[6].steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  </div>
                  <div className="td-billing-proof">
                    <section><h3>სწორი შედეგი</h3><p>{selected.test[4]}</p></section>
                    <section><h3>რა ჩაწეროთ მტკიცებულებად</h3><p>{selected.test[6].evidence}</p></section>
                  </div>
                </>
              )}
              {selected.test[5] && <p className="td-billing-conditional">თუ მცხეთა ამ ქმედებას არ იყენებს, შედეგში მიუთითეთ მიზეზი.</p>}
              <details className="td-billing-source"><summary>WebMed-ის წყარო</summary><p>{selected.test[2]}</p></details>
              <div className="td-billing-record">
                <div className="td-h2row">
                  <h3>შედეგის ჩაწერა</h3>
                  {onReport && <button type="button" className="td-btn td-btn-ghost" onClick={() => onReport(selected.test)}>ხარვეზის აღწერა</button>}
                </div>
                {!buildReady && <div className="td-billing-record-start">
                  <p>შედეგი მიაბით იმ ვერსიას, რომელზეც ეს ქმედება გამოცადეთ.</p>
                  <button className="td-btn td-btn-primary" type="button" onClick={onSettings}>აირჩიეთ გამოცდილი ვერსია</button>
                </div>}
                {renderResult(selected.test)}
              </div>
            </article>
          )}
          {decision}
        </div>
      </div>
    </section>
  );
}

import React, { useMemo, useState } from "react";
import {
  type Account,
  daysBetween,
  flagsFor,
  formatDate,
  formatGel,
  isOpenDeal,
  OPEN_STAGES,
  OWNERS,
  relativeDay,
  STAGE_LABEL,
  type StageId,
} from "../../data/crm";
import { FlagText, Owner, StatusTag } from "./ui";

interface Props {
  accounts: Account[];
  today: string;
  onOpen: (id: string) => void;
  onMoveStage: (a: Account, stage: StageId) => Promise<void>;
}

type SortKey = "name" | "stage" | "next" | "touch" | "amount";

const VIEW_KEY = "mm-crm-pipeline-view";
function readView(): "board" | "list" {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "board";
  } catch {
    return "board";
  }
}

export const Pipeline: React.FC<Props> = ({ accounts, today, onOpen, onMoveStage }) => {
  const [view, setViewState] = useState(readView);
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<StageId | null>(null);
  const [sort, setSort] = useState<SortKey>("next");

  const setView = (v: "board" | "list") => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // storage blocked: the choice lasts for this visit
    }
  };

  const deals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter(
      (a) =>
        a.kind === "deal" &&
        !a.archived &&
        (!q || a.name.toLowerCase().includes(q) || (a.city ?? "").toLowerCase().includes(q)) &&
        (!owner || (owner === "none" ? !a.owner : a.owner === owner)) &&
        (!attentionOnly || flagsFor(a, today).length > 0),
    );
  }, [accounts, query, owner, attentionOnly, today]);

  const open = deals.filter(isOpenDeal);
  const won = deals.filter((a) => a.stage === "won");
  const lost = deals.filter((a) => a.stage === "lost");

  const drop = (stage: StageId, id: string) => {
    setOverStage(null);
    setDragId(null);
    const a = deals.find((d) => d.id === id);
    if (a && a.stage !== stage) onMoveStage(a, stage);
  };

  const sorted = [...deals].sort((a, b) => {
    const order = (s: StageId | null) => [...OPEN_STAGES.map((x) => x.id), "won", "lost"].indexOf(s ?? "");
    switch (sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "stage":
        return order(a.stage) - order(b.stage);
      case "touch":
        return (a.last_touch ?? "0000").localeCompare(b.last_touch ?? "0000");
      case "amount":
        return (b.amount_gel ?? -1) - (a.amount_gel ?? -1);
      default:
        return (a.next_step_date ?? "9999").localeCompare(b.next_step_date ?? "9999");
    }
  });

  return (
    <div className="crm-pipeline">
      <div className="crm-toolbar">
        <div className="crm-seg" role="radiogroup" aria-label="View">
          <button role="radio" aria-checked={view === "board"} className={view === "board" ? "is-on" : ""} onClick={() => setView("board")}>
            Board
          </button>
          <button role="radio" aria-checked={view === "list"} className={view === "list" ? "is-on" : ""} onClick={() => setView("list")}>
            List
          </button>
        </div>
        <input
          className="crm-search"
          type="search"
          placeholder="Search hospitals"
          aria-label="Search hospitals"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="crm-filter" value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Owner">
          <option value="">Everyone's deals</option>
          {OWNERS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
          <option value="none">No owner</option>
        </select>
        <label className="crm-toggle">
          <input type="checkbox" checked={attentionOnly} onChange={(e) => setAttentionOnly(e.target.checked)} />
          Only deals that need attention
        </label>
      </div>

      {view === "board" ? (
        <>
          <div className="crm-board">
            {OPEN_STAGES.map((s) => {
              const list = open.filter((a) => a.stage === s.id);
              const value = list.reduce((sum, a) => sum + (a.amount_gel ?? 0), 0);
              return (
                <section
                  key={s.id}
                  className={`crm-col${overStage === s.id ? " is-over" : ""}`}
                  aria-label={s.label}
                  onDragOver={(e) => {
                    if (!dragId) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (overStage !== s.id) setOverStage(s.id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverStage(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    drop(s.id, e.dataTransfer.getData("text/plain"));
                  }}
                >
                  <header className="crm-col-head">
                    <h3>{s.label}</h3>
                    <span className="crm-col-count">{list.length}</span>
                  </header>
                  <p className="crm-col-rule">{s.rule}</p>
                  {value > 0 && <p className="crm-col-value">{formatGel(value)} known</p>}
                  <div className="crm-col-cards">
                    {list.map((a) => (
                      <DealCard
                        key={a.id}
                        a={a}
                        today={today}
                        dragging={dragId === a.id}
                        onOpen={onOpen}
                        onDragStart={setDragId}
                        onDragEnd={() => {
                          setDragId(null);
                          setOverStage(null);
                        }}
                      />
                    ))}
                    {list.length === 0 && <p className="crm-col-empty">{dragId ? "Drop here" : "No deals"}</p>}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="crm-closed" aria-label="Closed deals">
            <div className="crm-closed-col">
              <h3>
                Closed won <span className="crm-col-count">{won.length}</span>
              </h3>
              {won.length === 0 ? (
                <p className="crm-quiet">A deal counts as won only when the purchase agreement is signed.</p>
              ) : (
                won.map((a) => (
                  <button key={a.id} className="crm-closed-row" onClick={() => onOpen(a.id)}>
                    <span>{a.name}</span>
                    <span className="crm-quiet">{formatGel(a.amount_gel)}, signed {formatDate(a.signed_at, today)}</span>
                  </button>
                ))
              )}
            </div>
            <div className="crm-closed-col">
              <h3>
                Closed lost <span className="crm-col-count">{lost.length}</span>
              </h3>
              {lost.length === 0 ? (
                <p className="crm-quiet">Close dead conversations here with a reason, so the pipeline stays honest.</p>
              ) : (
                lost.map((a) => (
                  <button key={a.id} className="crm-closed-row" onClick={() => onOpen(a.id)}>
                    <span>{a.name}</span>
                    <span className="crm-quiet">{a.lost_reason ?? "No reason yet"}</span>
                  </button>
                ))
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <SortHeader label="Hospital" k="name" sort={sort} onSort={setSort} />
                <SortHeader label="Stage" k="stage" sort={sort} onSort={setSort} />
                <th scope="col">Status</th>
                <th scope="col">Owner</th>
                <SortHeader label="Next step" k="next" sort={sort} onSort={setSort} />
                <SortHeader label="Last contact" k="touch" sort={sort} onSort={setSort} />
                <SortHeader label="Amount" k="amount" sort={sort} onSort={setSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => {
                const flags = flagsFor(a, today);
                return (
                  <tr key={a.id} onClick={() => onOpen(a.id)}>
                    <th scope="row">
                      <button className="crm-link" onClick={(e) => { e.stopPropagation(); onOpen(a.id); }}>
                        {a.name}
                      </button>
                      {flags[0] && <FlagText flag={flags[0]} />}
                    </th>
                    <td>{a.stage ? STAGE_LABEL[a.stage] : "—"}</td>
                    <td><StatusTag status={a.status} /></td>
                    <td><Owner name={a.owner} /></td>
                    <td className="crm-table-next">
                      {a.next_step ?? "—"}
                      {a.next_step_date && <span className="crm-quiet"> {relativeDay(a.next_step_date, today)}</span>}
                    </td>
                    <td>{a.last_touch ? relativeDay(a.last_touch, today) : "—"}</td>
                    <td className="crm-num">{formatGel(a.amount_gel)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sorted.length === 0 && <p className="crm-empty">No deals match these filters.</p>}
        </div>
      )}
    </div>
  );
};

const SortHeader: React.FC<{ label: string; k: SortKey; sort: SortKey; onSort: (k: SortKey) => void }> = ({
  label,
  k,
  sort,
  onSort,
}) => (
  <th scope="col" aria-sort={sort === k ? "ascending" : undefined}>
    <button className={`crm-sort${sort === k ? " is-on" : ""}`} onClick={() => onSort(k)}>
      {label}
    </button>
  </th>
);

const DealCard: React.FC<{
  a: Account;
  today: string;
  dragging: boolean;
  onOpen: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}> = ({ a, today, dragging, onOpen, onDragStart, onDragEnd }) => {
  const flags = flagsFor(a, today);
  const late = a.next_step_date !== null && a.next_step_date < today;
  return (
    <article
      className={`crm-card crm-card--${a.status ?? "none"}${dragging ? " is-dragging" : ""}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", a.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(a.id);
      }}
      onDragEnd={onDragEnd}
    >
      <button className="crm-card-open" onClick={() => onOpen(a.id)}>
        <span className="crm-card-top">
          <span className="crm-card-name">{a.name}</span>
          <Owner name={a.owner} />
        </span>
        <StatusTag status={a.status} />
        {a.next_step ? (
          <span className={`crm-card-next${late ? " is-late" : ""}`}>
            {a.next_step}
            {a.next_step_date && <em> {relativeDay(a.next_step_date, today)}</em>}
          </span>
        ) : (
          <span className="crm-card-next is-missing">No next step</span>
        )}
        {flags[0] && <FlagText flag={flags[0]} />}
        <span className="crm-card-foot">
          <span>{a.amount_gel !== null ? formatGel(a.amount_gel) : "Amount unknown"}</span>
          {a.stage_since && <span>{daysBetween(a.stage_since, today)}d in stage</span>}
        </span>
      </button>
    </article>
  );
};

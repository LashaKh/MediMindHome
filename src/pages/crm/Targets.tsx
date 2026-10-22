import React, { useMemo, useState } from "react";
import { type Account, formatDate, type InboundItem, SOURCE_LABEL, timeAgo } from "../../data/crm";

interface Props {
  targets: Account[];
  excluded: Account[];
  inbound: InboundItem[];
  today: string;
  onOpen: (id: string) => void;
  onPromote: (a: Account) => Promise<void>;
  onNew: () => void;
}

export const Targets: React.FC<Props> = ({ targets, excluded, inbound, today, onOpen, onPromote, onNew }) => {
  const [query, setQuery] = useState("");
  const latestInbound = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of inbound) if (!m.has(i.account_id)) m.set(i.account_id, i.occurred_at);
    return m;
  }, [inbound]);

  const q = query.trim().toLowerCase();
  const list = targets
    .filter((a) => !q || a.name.toLowerCase().includes(q) || (a.city ?? "").toLowerCase().includes(q))
    .sort((a, b) => {
      const ia = latestInbound.get(a.id) ?? "";
      const ib = latestInbound.get(b.id) ?? "";
      return ib.localeCompare(ia) || a.name.localeCompare(b.name);
    });

  return (
    <div className="crm-targets">
      <header className="crm-section-head">
        <div>
          <h1 className="crm-section-title">Researched hospitals</h1>
          <p className="crm-section-sub">
            Not pipeline yet. When a named person replies and agrees to talk, move them to the pipeline.
          </p>
        </div>
        <div className="crm-section-actions">
          <input
            className="crm-search"
            type="search"
            placeholder="Search"
            aria-label="Search researched hospitals"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="adm-btn" onClick={onNew}>Add target</button>
        </div>
      </header>

      {list.length === 0 ? (
        <div className="crm-empty">
          <p>{q ? "No researched hospital matches that search." : "No researched hospitals yet."}</p>
          {!q && <button className="adm-btn adm-btn-primary" onClick={onNew}>Add the first one</button>}
        </div>
      ) : (
        <ul className="crm-target-list">
          {list.map((a) => {
            const fromWeb = latestInbound.get(a.id);
            return (
              <li key={a.id} className={`crm-target${fromWeb ? " is-inbound" : ""}`}>
                <button className="crm-target-main" onClick={() => onOpen(a.id)}>
                  <span className="crm-target-name">
                    {a.name}
                    {a.city && <span className="crm-quiet"> {a.city}</span>}
                  </span>
                  {fromWeb && <span className="crm-badge-inbound">Website request {timeAgo(fromWeb)}</span>}
                  {a.notes && <span className="crm-target-notes">{a.notes}</span>}
                  <span className="crm-target-meta">
                    {a.buyer && <span>Buyer: {a.buyer}</span>}
                    {a.connector && <span>Connector: {a.connector}</span>}
                    {a.source && <span>Route in: {SOURCE_LABEL[a.source]}</span>}
                    {a.researched_on && <span>Researched {formatDate(a.researched_on, today)}</span>}
                  </span>
                  {a.next_step && <span className="crm-target-next">Next: {a.next_step}</span>}
                </button>
                <button className="adm-btn crm-small" onClick={() => onPromote(a)}>Move to pipeline</button>
              </li>
            );
          })}
        </ul>
      )}

      {excluded.length > 0 && (
        <details className="crm-excluded">
          <summary>Marked as a bad fit ({excluded.length})</summary>
          <ul className="crm-target-list">
            {excluded.map((a) => (
              <li key={a.id} className="crm-target is-excluded">
                <button className="crm-target-main" onClick={() => onOpen(a.id)}>
                  <span className="crm-target-name">{a.name}</span>
                  {a.notes && <span className="crm-target-notes">{a.notes}</span>}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};

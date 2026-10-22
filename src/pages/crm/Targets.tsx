import React, { useMemo, useState } from "react";
import {
  type Account,
  contactedOn,
  dayLabel,
  flagsFor,
  formatDate,
  type InboundItem,
  SOURCE_LABEL,
  timeAgo,
} from "../../data/crm";
import { FlagText, Owner } from "./ui";

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
  const matching = targets.filter(
    (a) => !q || [a.name, a.city, a.buyer, a.connector, a.champion].some((s) => (s ?? "").toLowerCase().includes(q)),
  );
  // Written to or called: soonest follow-up first, so the overdue ones sit on top.
  const waiting = matching
    .filter((a) => contactedOn(a) !== null)
    .sort((a, b) => (a.next_step_date ?? "9999").localeCompare(b.next_step_date ?? "9999") || a.name.localeCompare(b.name));
  // Not contacted yet: fresh website requests first, then by name.
  const fresh = matching
    .filter((a) => contactedOn(a) === null)
    .sort((a, b) => {
      const ia = latestInbound.get(a.id) ?? "";
      const ib = latestInbound.get(b.id) ?? "";
      return ib.localeCompare(ia) || a.name.localeCompare(b.name);
    });

  const row = (a: Account) => {
    const fromWeb = latestInbound.get(a.id);
    const contacted = contactedOn(a);
    const flags = flagsFor(a, today);
    return (
      <li key={a.id} className={`crm-target${fromWeb ? " is-inbound" : ""}`}>
        <button className="crm-target-main" onClick={() => onOpen(a.id)}>
          <span className="crm-target-name">
            {a.name}
            {a.city && <span className="crm-quiet"> {a.city}</span>}
          </span>
          {fromWeb && <span className="crm-badge-inbound">Website request {timeAgo(fromWeb)}</span>}
          {flags.length > 0 && (
            <span className="crm-target-flags">
              {flags.map((f) => (
                <FlagText key={f.label} flag={f} />
              ))}
            </span>
          )}
          {a.notes && <span className="crm-target-notes">{a.notes}</span>}
          <span className="crm-target-meta">
            {contacted && <span>Contacted {formatDate(contacted, today)}</span>}
            {a.champion && <span>Champion: {a.champion}</span>}
            {a.buyer && <span>Buyer: {a.buyer}</span>}
            {a.connector && <span>Connector: {a.connector}</span>}
            {a.source && <span>Route in: {SOURCE_LABEL[a.source]}</span>}
            {!contacted && a.researched_on && <span>Researched {formatDate(a.researched_on, today)}</span>}
          </span>
          {a.next_step && (
            <span className="crm-target-next">
              {contacted ? "Follow-up" : "Next"}: {a.next_step}
              {a.next_step_date && <em> ({dayLabel(a.next_step_date, today)})</em>}
            </span>
          )}
        </button>
        <div className="crm-target-side">
          {a.owner && <Owner name={a.owner} />}
          <button className="adm-btn crm-small" onClick={() => onPromote(a)}>Move to pipeline</button>
        </div>
      </li>
    );
  };

  return (
    <div className="crm-targets">
      <header className="crm-section-head">
        <div>
          <h1 className="crm-section-title">Targets</h1>
          <p className="crm-section-sub">
            Hospitals that haven't agreed to talk yet. When a named person replies and agrees to talk, move them to the
            pipeline.
          </p>
        </div>
        <div className="crm-section-actions">
          <input
            className="crm-search"
            type="search"
            placeholder="Search targets"
            aria-label="Search targets"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="adm-btn" onClick={onNew}>Add target</button>
        </div>
      </header>

      {matching.length === 0 ? (
        <div className="crm-empty">
          <p>{q ? "No target matches that search." : "No targets yet."}</p>
          {!q && <button className="adm-btn adm-btn-primary" onClick={onNew}>Add the first one</button>}
        </div>
      ) : (
        <>
          {waiting.length > 0 && (
            <section className="crm-target-group" aria-labelledby="crm-waiting-title">
              <h2 id="crm-waiting-title" className="crm-group-title">
                Waiting for a reply <span className="crm-col-count">{waiting.length}</span>
              </h2>
              <ul className="crm-target-list">{waiting.map(row)}</ul>
            </section>
          )}
          {fresh.length > 0 && (
            <section className="crm-target-group" aria-labelledby="crm-fresh-title">
              <h2 id="crm-fresh-title" className="crm-group-title">
                Not contacted yet <span className="crm-col-count">{fresh.length}</span>
              </h2>
              <ul className="crm-target-list">{fresh.map(row)}</ul>
            </section>
          )}
        </>
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

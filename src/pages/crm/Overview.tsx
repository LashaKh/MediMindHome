import React from "react";
import {
  type CrmData,
  formatDate,
  type Metrics,
  OPEN_STAGES,
  relativeDay,
  SOURCES,
  timeAgo,
} from "../../data/crm";
import { FlagText, Owner, StatusTag } from "./ui";

type Tab = "overview" | "pipeline" | "targets" | "anchor";

interface Props {
  data: CrmData;
  metrics: Metrics;
  today: string;
  onOpen: (id: string) => void;
  onTab: (tab: Tab) => void;
}

const plural = (n: number, word: string) => `${word}${n === 1 ? "" : "s"}`;

function briefing(m: Metrics): string[] {
  const open = m.openDeals.length;
  const flagged = m.attention.filter((x) => x.account.kind === "deal").length;
  const targets = m.targets.length;
  const tests = m.last30.first_test_at;

  let pipeline: string;
  if (open === 0) pipeline = "No hospitals are in the pipeline yet.";
  else if (flagged === 0) pipeline = `${open} ${plural(open, "hospital")} in the pipeline, all on track.`;
  else if (flagged === open) {
    pipeline = open === 1
      ? "1 hospital in the pipeline, and it needs attention."
      : open === 2
      ? "2 hospitals in the pipeline, and both need attention."
      : `${open} hospitals in the pipeline, and all ${open} need attention.`;
  } else pipeline = `${open} ${plural(open, "hospital")} in the pipeline; ${flagged} ${flagged === 1 ? "needs" : "need"} attention.`;

  const research = targets === 0
    ? "Every researched hospital has been contacted."
    : `${targets} researched ${plural(targets, "hospital")} ${targets === 1 ? "has" : "have"} not been contacted yet.`;

  const metric = `${tests === 0 ? "No" : tests} new ${plural(tests, "hospital")} ran a first hands-on test in the last 30 days.`;
  return [pipeline, research, metric];
}

export const Overview: React.FC<Props> = ({ data, metrics, today, onOpen, onTab }) => {
  const [pipelineLine, researchLine, metricLine] = briefing(metrics);
  const names = new Map(data.accounts.map((a) => [a.id, a.name]));
  const last30 = [
    { label: "Discovery calls held", n: metrics.last30.discovery_at },
    { label: "Newly qualified", n: metrics.last30.sql_at },
    { label: "Evaluations agreed", n: metrics.last30.eval_agreed_at },
    { label: "Parallel versions delivered", n: metrics.last30.delivered_at },
    { label: "Purchase agreements signed", n: metrics.last30.signed_at },
  ];
  const recent = data.activities
    .filter((a) => names.has(a.account_id) && !(a.type === "created" && a.author === "Import"))
    .slice(0, 12);

  return (
    <div className="crm-overview">
      <section className="crm-briefing" aria-label="This week in one paragraph">
        <p className="crm-briefing-date">{formatDate(today, today)}, Tbilisi</p>
        <h1 className="crm-briefing-text">
          {pipelineLine} {researchLine}
        </h1>
        <p className="crm-briefing-metric">{metricLine}</p>
      </section>

      <section className="crm-path" aria-label="Pipeline by stage">
        <ol className="crm-path-line">
          {OPEN_STAGES.map((s) => {
            const deals = metrics.byStage[s.id].deals;
            return (
              <li key={s.id} className={`crm-station${deals.length ? " has-deals" : ""}`}>
                <button className="crm-station-head" onClick={() => onTab("pipeline")} title={s.rule}>
                  <span className="crm-station-dot" aria-hidden="true" />
                  <span className="crm-station-name">{s.label}</span>
                  <span className="crm-station-count">{deals.length}</span>
                </button>
                <div className="crm-station-deals">
                  {deals.slice(0, 3).map((a) => (
                    <button key={a.id} className="crm-namechip" onClick={() => onOpen(a.id)}>
                      {a.name}
                    </button>
                  ))}
                  {deals.length > 3 && <span className="crm-quiet">and {deals.length - 3} more</span>}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="crm-path-end">
          <button className="crm-path-closed" onClick={() => onTab("pipeline")}>
            <span>Won</span>
            <strong>{metrics.won.length}</strong>
          </button>
          <button className="crm-path-closed is-lost" onClick={() => onTab("pipeline")}>
            <span>Lost</span>
            <strong>{metrics.lost.length}</strong>
          </button>
        </div>
      </section>

      <div className="crm-overview-grid">
        <div className="crm-main-col">
        <section className="crm-panel" aria-labelledby="crm-attention-title">
          <h2 id="crm-attention-title" className="crm-panel-title">Needs attention</h2>
          {metrics.attention.length === 0 ? (
            <p className="crm-quiet">
              Nothing is waiting. Every open deal has an owner, a dated next step and recent contact.
            </p>
          ) : (
            <ul className="crm-attention">
              {metrics.attention.map(({ account: a, flags }) => (
                <li key={a.id}>
                  <button className="crm-attention-row" onClick={() => onOpen(a.id)}>
                    <span className="crm-attention-main">
                      <span className="crm-attention-name">{a.name}</span>
                      <span className="crm-attention-flags">
                        {flags.map((f) => (
                          <FlagText key={f.label} flag={f} />
                        ))}
                      </span>
                      {a.next_step && (
                        <span className="crm-attention-next">
                          {a.next_step}
                          {a.next_step_date && <em> ({relativeDay(a.next_step_date, today)})</em>}
                        </span>
                      )}
                    </span>
                    <span className="crm-attention-side">
                      {a.kind !== "target" && <StatusTag status={a.status} />}
                      <Owner name={a.owner} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        {data.inbound.length > 0 && (
          <section className="crm-panel" aria-labelledby="crm-inbound-title">
            <h2 id="crm-inbound-title" className="crm-panel-title">Website demo requests, last 30 days</h2>
            <ul className="crm-feed">
              {data.inbound.map((i) => (
                <li key={i.id}>
                  <button className="crm-feed-row" onClick={() => onOpen(i.account_id)}>
                    <strong>{names.get(i.account_id) ?? "Archived hospital"}</strong>
                    <span className="crm-feed-text">{(i.body ?? "").split("\n")[0]}</span>
                    <time dateTime={i.occurred_at}>{timeAgo(i.occurred_at)}</time>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="crm-panel" aria-labelledby="crm-recent-title">
          <h2 id="crm-recent-title" className="crm-panel-title">Recent activity</h2>
          {recent.length === 0 ? (
            <p className="crm-quiet">Nothing logged yet.</p>
          ) : (
            <ul className="crm-feed">
              {recent.map((a) => (
                <li key={a.id}>
                  <button className="crm-feed-row" onClick={() => onOpen(a.account_id)}>
                    <strong>{names.get(a.account_id)}</strong>
                    <span className="crm-feed-text">{a.body}</span>
                    <time dateTime={a.occurred_at}>{timeAgo(a.occurred_at)}</time>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        </div>

        <aside className="crm-side">
          <section className="crm-panel" aria-labelledby="crm-30-title">
            <h2 id="crm-30-title" className="crm-panel-title">Last 30 days</h2>
            <dl className="crm-numbers">
              <div className="crm-numbers-main">
                <dt>New hospitals' first hands-on tests</dt>
                <dd>{metrics.last30.first_test_at}</dd>
              </div>
              {last30.map((x) => (
                <div key={x.label}>
                  <dt>{x.label}</dt>
                  <dd>{x.n}</dd>
                </div>
              ))}
              <div>
                <dt>Days from evaluation agreed to first test</dt>
                <dd>{metrics.avgAgreedToTest ?? "—"}</dd>
              </div>
            </dl>
            <p className="crm-quiet crm-small-print">Target: first test within 21 days of the evaluation being agreed.</p>
          </section>

          <section className="crm-panel" aria-labelledby="crm-source-title">
            <h2 id="crm-source-title" className="crm-panel-title">Where deals come from</h2>
            <table className="crm-mini-table">
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col">Open</th>
                  <th scope="col">Won</th>
                  <th scope="col">Lost</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" title={s.hint}>{s.label}</th>
                    <td>{metrics.bySource[s.id].open}</td>
                    <td>{metrics.bySource[s.id].won}</td>
                    <td>{metrics.bySource[s.id].lost}</td>
                  </tr>
                ))}
                {metrics.bySource.unknown.open + metrics.bySource.unknown.won + metrics.bySource.unknown.lost > 0 && (
                  <tr className="is-muted">
                    <th scope="row">Not recorded</th>
                    <td>{metrics.bySource.unknown.open}</td>
                    <td>{metrics.bySource.unknown.won}</td>
                    <td>{metrics.bySource.unknown.lost}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="crm-panel" aria-labelledby="crm-win-title">
            <h2 id="crm-win-title" className="crm-panel-title">Win rate</h2>
            {metrics.winRate === null ? (
              <p className="crm-quiet">No new hospital deal has closed yet, won or lost.</p>
            ) : (
              <p className="crm-winrate">
                {Math.round(metrics.winRate * 100)}%
                <span className="crm-quiet"> of {metrics.won.length + metrics.lost.length} closed deals</span>
              </p>
            )}
            {metrics.lostReasons.length > 0 && (
              <ul className="crm-reasons">
                {metrics.lostReasons.map((r) => (
                  <li key={r.reason}>
                    <span>{r.reason}</span>
                    <strong>{r.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

    </div>
  );
};

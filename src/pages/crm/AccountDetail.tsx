import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  type Account,
  type Activity,
  type ActivityType,
  daysBetween,
  flagsFor,
  formatDate,
  formatGel,
  LOG_TYPES,
  type LogType,
  LOST_REASONS,
  MILESTONES,
  OPEN_STAGES,
  ORG_TYPES,
  OWNERS,
  relativeDay,
  SOURCE_LABEL,
  SOURCES,
  type StageId,
  STATUSES,
  tbilisiToday,
  timeAgo,
} from "../../data/crm";
import { type Api, CrmError, describeError } from "../../lib/crmApi";
import { FlagText } from "./ui";

type Draft = Partial<Record<keyof Account, string>>;

export interface DetailProps {
  account: Account;
  today: string;
  api: Api;
  onAccount: (a: Account) => void;
  onMoveStage: (a: Account, stage: StageId, extra?: Record<string, unknown>) => Promise<void>;
  onPromote: (a: Account) => Promise<void>;
  onArchive: (a: Account) => void;
  onDirtyChange?: (dirty: boolean) => void;
  /** Drawer only: the close button. */
  onClose?: () => void;
  /** Full-width page layout (Anchor tab) instead of the drawer column. */
  wide?: boolean;
}

const KIND_LABEL = { target: "Target", deal: "Pipeline", anchor: "Anchor customer" } as const;

const ACT_LABEL: Record<ActivityType, string> = {
  note: "Note",
  call: "Call",
  meeting: "Meeting",
  email: "Email",
  created: "Added",
  stage: "Stage",
  status: "Status",
  owner: "Owner",
  next_step: "Next step",
  moved: "Moved",
  archived: "Archived",
  restored: "Restored",
  inbound: "Website request",
};
const HAND_WRITTEN: ActivityType[] = ["note", "call", "meeting", "email"];

const byNewest = (a: Activity, b: Activity) => b.occurred_at.localeCompare(a.occurred_at);
const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export const AccountDetail: React.FC<DetailProps> = ({
  account,
  today,
  api,
  onAccount,
  onMoveStage,
  onPromote,
  onArchive,
  onDirtyChange,
  onClose,
  wide = false,
}) => {
  const [draft, setDraft] = useState<Draft>({});
  const [saving, setSaving] = useState(false);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [closing, setClosing] = useState<null | "won" | "lost">(null);
  const [lostReason, setLostReason] = useState("");
  const [wonDate, setWonDate] = useState(today);
  const [wonAmount, setWonAmount] = useState(str(account.amount_gel));

  const [nextText, setNextText] = useState(account.next_step ?? "");
  const [nextDate, setNextDate] = useState(account.next_step_date ?? "");
  useEffect(() => {
    setNextText(account.next_step ?? "");
    setNextDate(account.next_step_date ?? "");
  }, [account.next_step, account.next_step_date]);
  const nextDirty = nextText !== (account.next_step ?? "") || nextDate !== (account.next_step_date ?? "");

  const [logType, setLogType] = useState<LogType>("call");
  const [logText, setLogText] = useState("");
  const [logDate, setLogDate] = useState(today);

  const dirty = Object.keys(draft).length > 0 || nextDirty || logText.trim() !== "";
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const loadActivities = useCallback(async () => {
    try {
      const res = await api<{ activities: Activity[] }>("activities", { account_id: account.id });
      setActivities(res.activities);
    } catch (e) {
      setActivities((cur) => cur ?? []);
      toast.error(describeError(e));
    }
  }, [api, account.id]);
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const value = (k: keyof Account) => (k in draft ? draft[k] ?? "" : str(account[k]));
  const set = (k: keyof Account, v: string) =>
    setDraft((d) => {
      const next = { ...d };
      if (v === str(account[k])) delete next[k];
      else next[k] = v;
      return next;
    });

  /** Save a few fields right away (status, owner, next step, checklist). */
  const quickSave = async (fields: Record<string, unknown>, success?: string): Promise<boolean> => {
    try {
      const res = await api<{ account: Account }>("update", {
        id: account.id,
        expected_updated_at: account.updated_at,
        fields,
      });
      onAccount(res.account);
      if (success) toast.success(success);
      loadActivities();
      return true;
    } catch (e) {
      if (e instanceof CrmError && e.account) onAccount(e.account);
      toast.error(describeError(e));
      return false;
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    if (await quickSave(draft, "Changes saved")) setDraft({});
    setSaving(false);
  };

  const saveNext = () => quickSave({ next_step: nextText, next_step_date: nextDate || null }, "Next step saved");

  const submitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = logText.trim();
    if (!text) return;
    const temp: Activity = {
      id: `pending-${Date.now()}`,
      account_id: account.id,
      type: logType,
      body: text,
      meta: { pending: true },
      author: null,
      occurred_at: new Date().toISOString(),
    };
    setActivities((cur) => [temp, ...(cur ?? [])]);
    setLogText("");
    try {
      const res = await api<{ activity: Activity; account: Account }>("log", {
        account_id: account.id,
        type: logType,
        body: text,
        occurred_on: logDate,
      });
      setActivities((cur) => (cur ?? []).map((a) => (a.id === temp.id ? res.activity : a)).sort(byNewest));
      onAccount(res.account);
      setLogDate(today);
    } catch (err) {
      setActivities((cur) => (cur ?? []).filter((a) => a.id !== temp.id));
      setLogText(text);
      toast.error(describeError(err));
    }
  };

  const relog = async (act: Activity) => {
    try {
      const res = await api<{ activity: Activity; account: Account }>("log", {
        account_id: account.id,
        type: act.type,
        body: act.body,
        occurred_on: tbilisiToday(new Date(act.occurred_at)),
      });
      setActivities((cur) => [res.activity, ...(cur ?? [])].sort(byNewest));
      onAccount(res.account);
    } catch (err) {
      toast.error(describeError(err));
    }
  };

  const removeActivity = async (act: Activity) => {
    setActivities((cur) => (cur ?? []).filter((a) => a.id !== act.id));
    try {
      await api("delete_activity", { id: act.id });
      toast.success(
        (t) => (
          <span className="crm-toast">
            {ACT_LABEL[act.type]} deleted
            <button onClick={() => { toast.dismiss(t.id); relog(act); }}>Undo</button>
          </span>
        ),
        { duration: 6000 },
      );
    } catch (err) {
      setActivities((cur) => [act, ...(cur ?? [])].sort(byNewest));
      toast.error(describeError(err));
    }
  };

  const toggleCheck = (index: number) => {
    const lines = (account.notes ?? "").split("\n");
    const line = lines[index];
    lines[index] = /^\[[xX]\]/.test(line) ? `[ ]${line.slice(3)}` : `[x]${line.slice(3)}`;
    quickSave({ notes: lines.join("\n") });
  };

  const flags = flagsFor(account, today);
  const isDeal = account.kind === "deal";
  const isTarget = account.kind === "target";
  const stageIndex = OPEN_STAGES.findIndex((s) => s.id === account.stage);
  const currentStage = OPEN_STAGES[stageIndex];
  const isClosed = account.stage === "won" || account.stage === "lost";
  const daysInStage = account.stage_since ? daysBetween(account.stage_since, today) : null;
  const metaLine = [
    ORG_TYPES.find((o) => o.id === account.org_type)?.label,
    account.sites ? `${account.sites} ${account.sites === 1 ? "site" : "sites"}` : null,
    account.city,
    account.source ? SOURCE_LABEL[account.source] : null,
  ].filter(Boolean) as string[];

  // ── field helpers (plain functions, so inputs keep focus while typing) ──
  const textField = (k: keyof Account, label: string, opts: { area?: boolean; hint?: string; number?: boolean } = {}) => (
    <label className="crm-field" key={k}>
      <span className="crm-field-label">{label}</span>
      {opts.area ? (
        <textarea rows={3} value={value(k)} placeholder={opts.hint} onChange={(e) => set(k, e.target.value)} />
      ) : (
        <input
          type="text"
          inputMode={opts.number ? "decimal" : undefined}
          value={value(k)}
          placeholder={opts.hint}
          onChange={(e) => set(k, e.target.value)}
        />
      )}
    </label>
  );
  const dateField = (k: keyof Account, label: string) => (
    <label className="crm-field" key={k}>
      <span className="crm-field-label">{label}</span>
      <input type="date" value={value(k)} max={k === "decision_date" ? undefined : today} onChange={(e) => set(k, e.target.value)} />
    </label>
  );
  const selectField = (k: keyof Account, label: string, options: { id: string; label: string }[]) => (
    <label className="crm-field" key={k}>
      <span className="crm-field-label">{label}</span>
      <select value={value(k)} onChange={(e) => set(k, e.target.value)}>
        <option value="">Not set</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </label>
  );

  const header = (
    <header className="crm-detail-head">
      <div className="crm-detail-kicker">
        <span className={`crm-kind crm-kind--${account.kind}`}>{KIND_LABEL[account.kind]}</span>
        <span className="crm-ref">#{account.ref}</span>
        {onClose && (
          <button className="crm-icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>
      <h2 className="crm-detail-name">{account.name}</h2>
      {metaLine.length > 0 && (
        <p className="crm-detail-meta">
          {metaLine.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
      )}
    </header>
  );

  const flagBlock = flags.length > 0 && (
    <div className="crm-detail-flags">
      {flags.map((f) => (
        <FlagText key={f.label} flag={f} />
      ))}
    </div>
  );

  const stageBlock = isDeal && (
    <section className="crm-block" aria-label="Sales stage">
      <ol className={`crm-track${isClosed ? ` is-${account.stage}` : ""}`}>
        {OPEN_STAGES.map((s, i) => {
          const state = isClosed ? (account.stage === "won" ? "done" : "")
            : i < stageIndex ? "done" : i === stageIndex ? "current" : "";
          return (
            <li key={s.id} className={`crm-track-step${state ? ` is-${state}` : ""}`}>
              <button
                onClick={() => (i !== stageIndex || isClosed) && onMoveStage(account, s.id)}
                aria-current={i === stageIndex && !isClosed ? "step" : undefined}
                title={`${s.label}: ${s.rule}`}
              >
                <span className="crm-track-dot" aria-hidden="true" />
                <span className="crm-track-label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {isClosed ? (
        <p className="crm-stage-note">
          {account.stage === "won"
            ? `Closed won${account.signed_at ? ` on ${formatDate(account.signed_at, today)}` : ""}${account.amount_gel !== null ? `, ${formatGel(account.amount_gel)} a year` : ""}.`
            : `Closed lost: ${account.lost_reason ?? "no reason recorded yet"}.`}{" "}
          Click a stage above to reopen it.
        </p>
      ) : currentStage ? (
        <p className="crm-stage-note">
          <strong>{currentStage.label}</strong> means: {currentStage.rule}{" "}
          <span className="crm-quiet">Fill in: {currentStage.needs.toLowerCase()}.</span>
          {daysInStage !== null && <span className="crm-quiet"> In this stage for {daysInStage} {daysInStage === 1 ? "day" : "days"}.</span>}
        </p>
      ) : null}

      {!isClosed && closing === null && (
        <div className="crm-close-actions">
          <button className="adm-btn crm-btn-won" onClick={() => setClosing("won")}>Close as won</button>
          <button className="adm-btn adm-btn-ghost" onClick={() => setClosing("lost")}>Close as lost</button>
        </div>
      )}
      {closing === "won" && (
        <form
          className="crm-close-form"
          onSubmit={(e) => {
            e.preventDefault();
            setClosing(null);
            onMoveStage(account, "won", { signed_at: wonDate, amount_gel: wonAmount || null });
          }}
        >
          <p>Closed won means the purchase agreement is signed. Nothing less.</p>
          <label className="crm-field">
            <span className="crm-field-label">Signed on</span>
            <input type="date" required value={wonDate} max={today} onChange={(e) => setWonDate(e.target.value)} />
          </label>
          <label className="crm-field">
            <span className="crm-field-label">Deal amount (GEL a year)</span>
            <input type="text" inputMode="decimal" value={wonAmount} onChange={(e) => setWonAmount(e.target.value)} />
          </label>
          <div className="crm-row-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setClosing(null)}>Cancel</button>
            <button type="submit" className="adm-btn crm-btn-won">Mark as signed</button>
          </div>
        </form>
      )}
      {closing === "lost" && (
        <form
          className="crm-close-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!lostReason) return;
            setClosing(null);
            onMoveStage(account, "lost", { lost_reason: lostReason });
          }}
        >
          <p>Every lost deal needs a reason. Repeated reasons show what to fix.</p>
          <label className="crm-field">
            <span className="crm-field-label">Why did we lose it?</span>
            <select required value={lostReason} onChange={(e) => setLostReason(e.target.value)}>
              <option value="">Choose a reason</option>
              {LOST_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <div className="crm-row-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setClosing(null)}>Cancel</button>
            <button type="submit" className="adm-btn" disabled={!lostReason}>Close as lost</button>
          </div>
        </form>
      )}
    </section>
  );

  const targetBlock = isTarget && (
    <section className="crm-block crm-target-actions">
      <p className="crm-stage-note">
        Researched, not contacted. Move it to the pipeline when a named person there replies and agrees to talk.
      </p>
      <div className="crm-row-actions">
        <button className="adm-btn adm-btn-primary" onClick={() => onPromote(account)}>Move to pipeline</button>
        <button
          className="adm-btn adm-btn-ghost"
          onClick={() => quickSave({ excluded: !account.excluded }, account.excluded ? "Back on the target list" : "Marked as a bad fit")}
        >
          {account.excluded ? "Put back on the list" : "Mark as bad fit"}
        </button>
      </div>
    </section>
  );

  const ownerOptions = account.owner && !OWNERS.includes(account.owner) ? [...OWNERS, account.owner] : OWNERS;
  const statusBlock = !isTarget && (
    <section className="crm-block crm-status-row">
      <div className="crm-chips" role="radiogroup" aria-label="Status">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={account.status === s.id}
            className={`crm-chip crm-chip--${s.id}${account.status === s.id ? " is-on" : ""}`}
            title={s.hint}
            onClick={() => account.status !== s.id && quickSave({ status: s.id }, `Status: ${s.label}`)}
          >
            <i aria-hidden="true" />
            {s.label}
          </button>
        ))}
      </div>
      <label className="crm-owner-select">
        <span>Owner</span>
        <select
          value={account.owner ?? ""}
          onChange={(e) => quickSave({ owner: e.target.value || null }, e.target.value ? `Owner: ${e.target.value}` : "Owner removed")}
        >
          <option value="">Nobody yet</option>
          {ownerOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
    </section>
  );

  const nextBlock = (
    <section className={`crm-block crm-next${account.next_step_date && account.next_step_date < today ? " is-late" : ""}`}>
      <h3 className="crm-block-title">Next step</h3>
      <textarea
        rows={2}
        value={nextText}
        placeholder="What happens next, and who does it?"
        onChange={(e) => setNextText(e.target.value)}
      />
      <div className="crm-next-row">
        <label className="crm-next-date">
          <span>By</span>
          <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
        </label>
        {account.next_step_date && !nextDirty && (
          <span className="crm-quiet">{relativeDay(account.next_step_date, today)}</span>
        )}
        {nextDirty && (
          <button className="adm-btn adm-btn-primary crm-small" onClick={saveNext}>Save next step</button>
        )}
      </div>
    </section>
  );

  const notesLines = (account.notes ?? "").split("\n");
  const notesBlock = account.notes && !("notes" in draft) && (
    <section className="crm-block crm-notes">
      <h3 className="crm-block-title">Notes</h3>
      {notesLines.map((line, i) => {
        const check = /^\[([ xX])\]\s?(.*)$/.exec(line);
        if (check) {
          return (
            <label key={i} className="crm-check">
              <input type="checkbox" checked={check[1] !== " "} onChange={() => toggleCheck(i)} />
              <span>{check[2]}</span>
            </label>
          );
        }
        return line.trim() ? <p key={i}>{line}</p> : <div key={i} className="crm-notes-gap" />;
      })}
    </section>
  );

  const activityBlock = (
    <section className="crm-block crm-activity">
      <h3 className="crm-block-title">Timeline</h3>
      <form className="crm-composer" onSubmit={submitLog}>
        <div className="crm-seg" role="radiogroup" aria-label="What happened">
          {LOG_TYPES.map((t) => (
            <button
              type="button"
              key={t.id}
              role="radio"
              aria-checked={logType === t.id}
              className={logType === t.id ? "is-on" : ""}
              onClick={() => setLogType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={logText}
          placeholder={logType === "note" ? "Internal note" : `What was said in the ${logType}? What did they agree to?`}
          onChange={(e) => setLogText(e.target.value)}
        />
        <div className="crm-next-row">
          <label className="crm-next-date">
            <span>On</span>
            <input type="date" value={logDate} max={today} onChange={(e) => setLogDate(e.target.value)} />
          </label>
          <button className="adm-btn adm-btn-primary crm-small" type="submit" disabled={!logText.trim()}>
            {LOG_TYPES.find((t) => t.id === logType)?.verb}
          </button>
        </div>
      </form>
      {activities === null ? (
        <p className="crm-quiet">Loading the timeline…</p>
      ) : activities.length === 0 ? (
        <p className="crm-quiet">Nothing logged yet. Log the first call or note above.</p>
      ) : (
        <ol className="crm-timeline">
          {activities.map((a) => {
            const pending = a.id.startsWith("pending-");
            return (
              <li key={a.id} className={`crm-act crm-act--${a.type}${pending ? " is-pending" : ""}`}>
                <span className="crm-act-dot" aria-hidden="true" />
                <div className="crm-act-body">
                  <div className="crm-act-head">
                    <strong>{ACT_LABEL[a.type]}</strong>
                    <time dateTime={a.occurred_at} title={new Date(a.occurred_at).toLocaleString()}>
                      {pending ? "saving…" : timeAgo(a.occurred_at)}
                    </time>
                    {a.author && <span className="crm-quiet">{a.author}</span>}
                    {!pending && HAND_WRITTEN.includes(a.type) && (
                      <button className="crm-act-delete" onClick={() => removeActivity(a)} aria-label={`Delete this ${ACT_LABEL[a.type].toLowerCase()}`}>
                        Delete
                      </button>
                    )}
                  </div>
                  {a.body && <p className="crm-act-text">{a.body}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );

  const detailsBlock = (
    <section className="crm-block crm-details">
      <details>
        <summary>Hospital and people</summary>
        <div className="crm-grid">
          {textField("name", "Name")}
          {selectField("org_type", "Type", ORG_TYPES)}
          {textField("sites", "Sites", { number: true })}
          {textField("city", "City")}
          {selectField("source", "Source", SOURCES)}
          {textField("connector", "Connector", { hint: "Who opened the door" })}
          {textField("champion", "Champion", { hint: "Organizes colleagues inside" })}
          {textField("buyer", "Buyer or signer", { hint: "Approves the spending" })}
          {textField("roles_reached", "Roles we have met", { hint: "CEO, ops, IT, finance…" })}
        </div>
      </details>
      <details>
        <summary>Pain and objections</summary>
        <div className="crm-grid">
          {textField("pain", "Pain, in their words", { area: true })}
          {selectField("pain_status", "Pain is", [
            { id: "hypothesis", label: "Our guess" },
            { id: "confirmed", label: "Confirmed by them" },
          ])}
          {textField("objections", "Objections we heard", { area: true })}
          {textField("last_sent", "Last thing we sent")}
        </div>
      </details>
      <details>
        <summary>Money</summary>
        <div className="crm-grid">
          {textField("current_software", "Current software")}
          {textField("current_spend_gel", "Current spend (GEL a month)", { number: true })}
          {textField("amount_gel", "Deal amount (GEL a year)", { number: true, hint: "Blank means unknown" })}
          {dateField("decision_date", "Decision date")}
          {textField("price_reaction", "Price reaction", { area: true, hint: "Compared to what? Who objected?" })}
          {textField("concessions", "Concessions promised", { area: true, hint: "Every discount, free item or price lock" })}
          {textField("team_hours", "Team hours spent", { number: true, hint: "Including the free build" })}
        </div>
      </details>
      <details>
        <summary>Milestone dates</summary>
        <p className="crm-quiet">The first time each happened. Moving a stage fills these in once; correct them here.</p>
        <div className="crm-grid">
          {MILESTONES.map((m) => dateField(m.key, m.label))}
          {dateField("stage_since", "In this stage since")}
          {dateField("last_touch", "Last contact")}
          {isTarget && dateField("researched_on", "Researched on")}
        </div>
      </details>
      <details>
        <summary>Evidence and notes</summary>
        <div className="crm-grid">
          {textField("evidence_link", "Evidence link", { hint: "Call notes, approvals, feedback. Never passwords or patient data." })}
          {account.stage === "lost" && textField("lost_reason", "Lost reason")}
          {textField("notes", "Notes", { area: true, hint: "Lines starting with [ ] become checkboxes" })}
        </div>
      </details>
      <div className="crm-danger">
        <button className="adm-btn adm-btn-ghost crm-small" onClick={() => onArchive(account)}>Archive {account.name}</button>
      </div>
    </section>
  );

  const saveBar = Object.keys(draft).length > 0 && (
    <div className="crm-savebar" role="status">
      <span>Unsaved changes</span>
      <button className="adm-btn adm-btn-ghost crm-small" onClick={() => setDraft({})} disabled={saving}>Discard</button>
      <button className="adm-btn adm-btn-primary crm-small" onClick={saveDraft} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );

  if (wide) {
    return (
      <div className="crm-detail crm-detail--wide">
        <div className="crm-detail-col">
          {header}
          {flagBlock}
          {stageBlock}
          {targetBlock}
          {statusBlock}
          {nextBlock}
          {notesBlock}
          {detailsBlock}
        </div>
        <div className="crm-detail-col">{activityBlock}</div>
        {saveBar}
      </div>
    );
  }
  return (
    <div className="crm-detail">
      {header}
      {flagBlock}
      {stageBlock}
      {targetBlock}
      {statusBlock}
      {nextBlock}
      {notesBlock}
      {activityBlock}
      {detailsBlock}
      {saveBar}
    </div>
  );
};


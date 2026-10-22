import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  type Account,
  type Activity,
  ACTIVITY_LABEL,
  type ActivityType,
  contactedOn,
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
import { type Api, describeError } from "../../lib/crmApi";
import { FlagText } from "./ui";
import { useEscape } from "./useEscape";

type Draft = Partial<Record<keyof Account, string>>;
export type Fields = Record<string, unknown>;
/** Runs writes to one hospital one after another (see AdminCrm). */
export type Queue = <T>(id: string, task: () => Promise<T>) => Promise<T>;
/** Saves fields with the newest version stamp; `change` may be computed from the newest version. */
export type Update = (
  id: string,
  change: Fields | ((current: Account) => Fields),
) => Promise<{ before: Account; account: Account }>;

export interface DetailProps {
  account: Account;
  today: string;
  api: Api;
  onAccount: (a: Account) => void;
  onUpdate: Update;
  onQueue: Queue;
  /** Resolves true when the move was saved. */
  onMoveStage: (a: Account, stage: StageId, extra?: Fields) => Promise<boolean>;
  onPromote: (a: Account) => Promise<void>;
  onArchive: (a: Account) => void;
  onDirtyChange?: (dirty: boolean) => void;
  /** Drawer only: the close button. */
  onClose?: () => void;
  /** Full-width page layout (Anchor tab) instead of the drawer column. */
  wide?: boolean;
}

const KIND_LABEL = { target: "Target", deal: "Pipeline", anchor: "Anchor customer" } as const;

const ACT_LABEL = ACTIVITY_LABEL;
const HAND_WRITTEN: ActivityType[] = ["note", "call", "meeting", "email", "message"];

const LOG_TYPE_KEY = "mm-crm-log-type";
function readLogType(): LogType {
  try {
    const saved = localStorage.getItem(LOG_TYPE_KEY);
    return LOG_TYPES.some((t) => t.id === saved) ? (saved as LogType) : "message";
  } catch {
    return "message"; // storage blocked: start with the most common kind of contact
  }
}
function writeLogType(type: LogType): void {
  try {
    localStorage.setItem(LOG_TYPE_KEY, type);
  } catch {
    // storage blocked: the choice lasts for this visit
  }
}

const byNewest = (a: Activity, b: Activity) => b.occurred_at.localeCompare(a.occurred_at);
/** Put a saved entry in the timeline once, replacing its "saving…" placeholder if that is still shown. */
const withActivity = (list: Activity[] | null, saved: Activity, placeholderId?: string) =>
  [saved, ...(list ?? []).filter((a) => a.id !== saved.id && a.id !== placeholderId)].sort(byNewest);
const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export const AccountDetail: React.FC<DetailProps> = ({
  account,
  today,
  api,
  onAccount,
  onUpdate,
  onQueue,
  onMoveStage,
  onPromote,
  onArchive,
  onDirtyChange,
  onClose,
  wide = false,
}) => {
  const [draft, setDraftState] = useState<Draft>({});
  // The same draft, readable right after a save returns (state would still be the old one there).
  const draftNow = useRef<Draft>({});
  const setDraft = (next: Draft) => {
    draftNow.current = next;
    setDraftState(next);
  };
  // The value each edited field had when typing started, to notice someone else changing it meanwhile.
  const draftFrom = useRef<Draft>({});
  const [saving, setSaving] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [checking, setChecking] = useState<Record<number, boolean>>({});
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [closing, setClosing] = useState<null | "won" | "lost">(null);
  const [closingBusy, setClosingBusy] = useState(false);
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

  const [logType, setLogTypeState] = useState<LogType>(readLogType);
  const [logText, setLogText] = useState("");
  // Empty means "today", whatever day it is when the entry is saved.
  const [logDate, setLogDate] = useState("");
  const setLogType = (type: LogType) => {
    setLogTypeState(type);
    writeLogType(type);
  };

  const dirty = Object.keys(draft).length > 0 || nextDirty || logText.trim() !== "";
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  // Reloading or closing the browser tab asks first while something is unsaved.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const activitiesRequest = useRef(0);
  const loadActivities = useCallback(async () => {
    const mine = ++activitiesRequest.current;
    try {
      const res = await api<{ activities: Activity[] }>("activities", { account_id: account.id });
      // Several saves in a row each reload the timeline; only the newest answer counts.
      if (mine === activitiesRequest.current) setActivities(res.activities);
    } catch (e) {
      setActivities((cur) => cur ?? []);
      toast.error(describeError(e));
    }
  }, [api, account.id]);
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const value = (k: keyof Account) => (k in draft ? draft[k] ?? "" : str(account[k]));
  const set = (k: keyof Account, v: string) => {
    const next = { ...draftNow.current };
    if (v === str(account[k])) {
      delete next[k];
      delete draftFrom.current[k];
    } else {
      if (!(k in draftFrom.current)) draftFrom.current[k] = str(account[k]);
      next[k] = v;
    }
    setDraft(next);
  };
  const dropFromDraft = (keys: (keyof Account)[]) => {
    const next = { ...draftNow.current };
    for (const k of keys) {
      delete next[k];
      delete draftFrom.current[k];
    }
    setDraft(next);
  };
  const clearDraft = () => {
    setDraft({});
    draftFrom.current = {};
    setEditingNotes(false);
  };

  /** Save a few fields right away (status, owner, next step, checklist). */
  const quickSave = async (change: Fields | ((current: Account) => Fields), success?: string): Promise<boolean> => {
    try {
      await onUpdate(account.id, change);
      if (success) toast.success(success);
      loadActivities();
      return true;
    } catch (e) {
      toast.error(describeError(e));
      return false;
    }
  };

  // Status and owner show the new choice at once; the newest server version replaces it when the last save lands.
  const [shownNow, setShownNow] = useState<Partial<Pick<Account, "status" | "owner">>>({});
  const lastQuick = useRef(0);
  const quickSaveShown = async (fields: Partial<Pick<Account, "status" | "owner">>, success: string) => {
    const mine = ++lastQuick.current;
    setShownNow((s) => ({ ...s, ...fields }));
    await quickSave(fields, success);
    if (mine === lastQuick.current) setShownNow({});
  };
  const shownStatus = "status" in shownNow ? shownNow.status : account.status;
  const shownOwner = "owner" in shownNow ? shownNow.owner : account.owner;

  const saveDraft = async () => {
    const sent = { ...draftNow.current };
    const changedMeanwhile = (Object.keys(sent) as (keyof Account)[]).filter(
      (k) => k in draftFrom.current && draftFrom.current[k] !== str(account[k]) && sent[k] !== str(account[k]),
    );
    if (changedMeanwhile.length) {
      for (const k of changedMeanwhile) draftFrom.current[k] = str(account[k]);
      toast.error(
        (t) => (
          <span className="crm-toast">
            Someone else changed {changedMeanwhile.length === 1 ? "a field" : `${changedMeanwhile.length} fields`} you
            are editing. Save again to keep yours.
            <button onClick={() => { toast.dismiss(t.id); dropFromDraft(changedMeanwhile); }}>Show theirs</button>
          </span>
        ),
        { duration: 10000 },
      );
      return;
    }
    setSaving(true);
    try {
      const { account: saved } = await onUpdate(account.id, sent);
      toast.success("Changes saved");
      loadActivities();
      // Anything typed after the click stays as an unsaved change, now starting from what was saved.
      const rest: Draft = {};
      const from: Draft = {};
      for (const [k, v] of Object.entries(draftNow.current) as [keyof Account, string][]) {
        if (sent[k] === v) continue;
        rest[k] = v;
        from[k] = k in sent ? str(saved[k]) : draftFrom.current[k];
      }
      draftFrom.current = from;
      setDraft(rest);
      if (!("notes" in rest)) setEditingNotes(false);
    } catch (e) {
      toast.error(describeError(e));
    } finally {
      setSaving(false);
    }
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
      const res = await onQueue(account.id, () =>
        api<{ activity: Activity; account: Account }>("log", {
          account_id: account.id,
          type: logType,
          body: text,
          occurred_on: logDate || undefined,
        }),
      );
      setActivities((cur) => withActivity(cur, res.activity, temp.id));
      onAccount(res.account);
      setLogDate("");
    } catch (err) {
      setActivities((cur) => (cur ?? []).filter((a) => a.id !== temp.id));
      setLogText(text);
      toast.error(describeError(err));
    }
  };

  const relog = async (act: Activity) => {
    try {
      const res = await onQueue(account.id, () =>
        api<{ activity: Activity; account: Account }>("log", {
          account_id: account.id,
          type: act.type,
          body: act.body,
          occurred_on: tbilisiToday(new Date(act.occurred_at)),
          author: act.author, // put back as written, not as whoever pressed Undo
        }),
      );
      setActivities((cur) => withActivity(cur, res.activity));
      onAccount(res.account);
    } catch (err) {
      toast.error(describeError(err));
    }
  };

  const removeActivity = async (act: Activity) => {
    setActivities((cur) => (cur ?? []).filter((a) => a.id !== act.id));
    try {
      // Deleting the newest contact moves "last contact" back, so it waits its turn like any save.
      const res = await onQueue(account.id, () =>
        api<{ account: Account | null }>("delete_activity", { id: act.id }),
      );
      if (res.account) onAccount(res.account);
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
      setActivities((cur) => withActivity(cur, act));
      toast.error(describeError(err));
    }
  };

  /** Tick or untick one `[ ]` line. The box flips at once; the line is rebuilt from the newest notes. */
  const toggleCheck = async (index: number, checked: boolean) => {
    setChecking((c) => ({ ...c, [index]: checked }));
    await quickSave((current) => {
      const lines = (current.notes ?? "").split("\n");
      const match = /^\[[ xX]\](.*)$/.exec(lines[index] ?? "");
      if (!match) return {};
      lines[index] = `[${checked ? "x" : " "}]${match[1]}`;
      return { notes: lines.join("\n") };
    });
    setChecking((c) => {
      const next = { ...c };
      delete next[index];
      return next;
    });
  };

  /** Open the won or lost form with today's facts, never with values from when the panel opened. */
  const startClosing = (kind: "won" | "lost") => {
    setWonAmount(str(account.amount_gel));
    setWonDate(account.signed_at ?? today);
    setLostReason(account.lost_reason ?? "");
    setClosing(kind);
  };
  const finishClose = async (stage: "won" | "lost", extra: Fields) => {
    setClosingBusy(true);
    const saved = await onMoveStage(account, stage, extra);
    setClosingBusy(false);
    if (saved) setClosing(null);
  };
  // Escape closes the innermost thing first: the won/lost form, then the notes editor, then the drawer.
  useEscape(() => setClosing(null), closing !== null && !closingBusy);
  useEscape(() => setEditingNotes(false), editingNotes && !("notes" in draft));

  const flags = flagsFor(account, today);
  const isDeal = account.kind === "deal";
  const isTarget = account.kind === "target";
  const stageIndex = OPEN_STAGES.findIndex((s) => s.id === account.stage);
  const currentStage = OPEN_STAGES[stageIndex];
  const isClosed = account.stage === "won" || account.stage === "lost";
  const daysInStage = account.stage_since ? daysBetween(account.stage_since, today) : null;
  const contacted = contactedOn(account);
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
          <button className="adm-btn crm-btn-won" onClick={() => startClosing("won")}>Close as won</button>
          <button className="adm-btn adm-btn-ghost" onClick={() => startClosing("lost")}>Close as lost</button>
        </div>
      )}
      {closing === "won" && (
        <form
          className="crm-close-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!closingBusy) finishClose("won", { signed_at: wonDate, amount_gel: wonAmount || null });
          }}
        >
          <p>Closed won means the purchase agreement is signed. Nothing less.</p>
          <label className="crm-field">
            <span className="crm-field-label">Signed on</span>
            <input type="date" required value={wonDate} max={today} onChange={(e) => setWonDate(e.target.value)} />
          </label>
          <label className="crm-field">
            <span className="crm-field-label">Deal amount (GEL a year)</span>
            <input type="text" inputMode="decimal" value={wonAmount} placeholder="For example 30000" onChange={(e) => setWonAmount(e.target.value)} />
          </label>
          <div className="crm-row-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setClosing(null)} disabled={closingBusy}>Cancel</button>
            <button type="submit" className="adm-btn crm-btn-won" disabled={closingBusy}>
              {closingBusy ? "Saving…" : "Mark as signed"}
            </button>
          </div>
        </form>
      )}
      {closing === "lost" && (
        <form
          className="crm-close-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (lostReason && !closingBusy) finishClose("lost", { lost_reason: lostReason });
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
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setClosing(null)} disabled={closingBusy}>Cancel</button>
            <button type="submit" className="adm-btn" disabled={!lostReason || closingBusy}>
              {closingBusy ? "Saving…" : "Close as lost"}
            </button>
          </div>
        </form>
      )}
    </section>
  );

  const targetBlock = isTarget && (
    <section className="crm-block crm-target-actions">
      <p className="crm-stage-note">
        {contacted ? (
          <>
            <strong>Contacted</strong>, last on {formatDate(contacted, today)}. When a named person there replies and agrees
            to talk, move it to the pipeline.
          </>
        ) : (
          "Not contacted yet. Log your first message or call in the timeline. When a named person there replies and agrees to talk, move it to the pipeline."
        )}
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
  // A closed deal has no status worth showing; only who owns it.
  const statusBlock = !isTarget && (
    <section className="crm-block crm-status-row">
      {!isClosed && (
        <div className="crm-chips" role="group" aria-label="Status">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              aria-pressed={shownStatus === s.id}
              className={`crm-chip crm-chip--${s.id}${shownStatus === s.id ? " is-on" : ""}`}
              title={s.hint}
              onClick={() => shownStatus !== s.id && quickSaveShown({ status: s.id }, `Status: ${s.label}`)}
            >
              <i aria-hidden="true" />
              {s.label}
            </button>
          ))}
        </div>
      )}
      <label className="crm-owner-select">
        <span>Owner</span>
        <select
          value={shownOwner ?? ""}
          onChange={(e) =>
            quickSaveShown({ owner: e.target.value || null }, e.target.value ? `Owner: ${e.target.value}` : "Owner removed")
          }
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
      <h3 className="crm-block-title">{isTarget && contacted ? "Follow-up" : "Next step"}</h3>
      <textarea
        rows={2}
        value={nextText}
        placeholder={isTarget && contacted ? "When do we follow up, and how?" : "What happens next, and who does it?"}
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
  const notesBlock = (
    <section className={`crm-block crm-notes${!account.notes && !editingNotes ? " is-empty" : ""}`}>
      <div className="crm-block-head">
        <h3 className="crm-block-title">Notes</h3>
        {!editingNotes ? (
          <button className="crm-text-btn" onClick={() => setEditingNotes(true)}>
            {account.notes ? "Edit" : "Add notes"}
          </button>
        ) : (
          !("notes" in draft) && (
            <button className="crm-text-btn" onClick={() => setEditingNotes(false)}>Done</button>
          )
        )}
      </div>
      {editingNotes ? (
        <textarea
          autoFocus
          rows={Math.min(16, Math.max(5, notesLines.length + 1))}
          value={value("notes")}
          placeholder="Checked facts, and where they came from. Start a line with [ ] to make a checkbox."
          onChange={(e) => set("notes", e.target.value)}
        />
      ) : (
        account.notes &&
        notesLines.map((line, i) => {
          const check = /^\[([ xX])\]\s?(.*)$/.exec(line);
          if (check) {
            return (
              <label key={i} className="crm-check">
                <input
                  type="checkbox"
                  checked={i in checking ? checking[i] : check[1] !== " "}
                  onChange={(e) => toggleCheck(i, e.target.checked)}
                />
                <span>{check[2]}</span>
              </label>
            );
          }
          return line.trim() ? <p key={i}>{line}</p> : <div key={i} className="crm-notes-gap" />;
        })
      )}
    </section>
  );

  const logDef = LOG_TYPES.find((t) => t.id === logType) ?? LOG_TYPES[0];
  const activityBlock = (
    <section className="crm-block crm-activity">
      <h3 className="crm-block-title">Timeline</h3>
      <form className="crm-composer" onSubmit={submitLog}>
        <div className="crm-seg" role="group" aria-label="What happened">
          {LOG_TYPES.map((t) => (
            <button
              type="button"
              key={t.id}
              aria-pressed={logType === t.id}
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
          aria-label={logDef.verb}
          placeholder={logDef.hint}
          onChange={(e) => setLogText(e.target.value)}
        />
        <div className="crm-next-row">
          <label className="crm-next-date">
            <span>On</span>
            <input
              type="date"
              value={logDate || today}
              max={today}
              onChange={(e) => setLogDate(e.target.value === today ? "" : e.target.value)}
            />
          </label>
          <button className="adm-btn adm-btn-primary crm-small" type="submit" disabled={!logText.trim()}>
            {logDef.verb}
          </button>
        </div>
      </form>
      {activities === null ? (
        <p className="crm-quiet">Loading the timeline…</p>
      ) : activities.length === 0 ? (
        <p className="crm-quiet">Nothing logged yet. Log the first message, call or note above.</p>
      ) : (
        <ol className="crm-timeline">
          {activities.map((a) => {
            const pending = a.id.startsWith("pending-");
            return (
              <li key={a.id} className={`crm-act crm-act--${a.type}${pending ? " is-pending" : ""}`}>
                <span className="crm-act-dot" aria-hidden="true" />
                <div className="crm-act-body">
                  <div className="crm-act-head">
                    <strong>{ACT_LABEL[a.type] ?? a.type}</strong>
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
        <summary>Evidence</summary>
        <div className="crm-grid">
          {textField("evidence_link", "Evidence link", { hint: "Call notes, approvals, feedback. Never passwords or patient data." })}
          {account.stage === "lost" && textField("lost_reason", "Lost reason")}
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
      <button className="adm-btn adm-btn-ghost crm-small" onClick={clearDraft} disabled={saving}>Discard</button>
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

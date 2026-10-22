import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAdminStore } from "../store/useAdminStore";
import {
  type Account,
  computeMetrics,
  type CrmData,
  type Kind,
  MILESTONES,
  OWNERS,
  STAGE_LABEL,
  type StageId,
  tbilisiToday,
  toCsv,
} from "../data/crm";
import { adminLogin, type Api, CrmError, crmCall, describeError, readAuthor, writeAuthor } from "../lib/crmApi";
import { Overview } from "./crm/Overview";
import { Pipeline } from "./crm/Pipeline";
import { Targets } from "./crm/Targets";
import { AnchorView } from "./crm/AnchorView";
import { AccountDrawer } from "./crm/AccountDrawer";
import { NewAccountModal } from "./crm/NewAccountModal";
import { QuickFind } from "./crm/QuickFind";
import { useEscape } from "./crm/useEscape";
import type { Fields, Queue, Update } from "./crm/AccountDetail";
import "./BriefingGate.css";
import "./AdminDashboard.css";
import "./AdminCrm.css";

type Tab = "overview" | "pipeline" | "targets" | "anchor";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "This week" },
  { id: "pipeline", label: "Pipeline" },
  { id: "targets", label: "Targets" },
  { id: "anchor", label: "Anchor" },
];

/** Fields an Undo puts back after a stage move or a promotion. */
const UNDO_FIELDS: (keyof Account)[] = [
  "kind", "stage", "stage_since", "status", "owner", "excluded", "lost_reason", "amount_gel", "first_contact_at",
  ...MILESTONES.map((m) => m.key),
];

/** Coming back to the tab after this long reloads the data, so both founders see each other's work. */
const STALE_AFTER_MS = 60_000;

export const AdminCrm: React.FC = () => {
  const navigate = useNavigate();
  const { isValid, setSession, clear } = useAdminStore();
  const [params, setParams] = useSearchParams();
  const tab = (TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "overview") as Tab;
  const openId = params.get("open");

  const [data, setData] = useState<CrmData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [newKind, setNewKind] = useState<Kind | null>(null);
  const [author, setAuthorState] = useState(readAuthor());
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const setAuthor = (name: string) => {
    writeAuthor(name);
    setAuthorState(name);
  };

  const api: Api = useCallback(
    async <T,>(action: string, payload: Record<string, unknown> = {}) => {
      const token = useAdminStore.getState().jwt;
      try {
        return await crmCall<T>(token ?? "", action, payload);
      } catch (e) {
        if (e instanceof CrmError && e.status === 401) setSessionExpired(true);
        throw e;
      }
    },
    [],
  );

  // The newest version of each hospital this browser has seen. Every save sends its stamp,
  // so quick clicks in a row never trip over each other, while a real conflict with the
  // other founder's save is still caught by the server.
  const latest = useRef(new Map<string, Account>());
  const queues = useRef(new Map<string, Promise<unknown>>());
  const lastLoad = useRef(0);

  const load = useCallback(async (): Promise<boolean> => {
    try {
      const next = await api<CrmData>("list");
      const accounts = next.accounts.map((a) => {
        const known = latest.current.get(a.id);
        return known && known.updated_at > a.updated_at ? known : a;
      });
      for (const a of accounts) latest.current.set(a.id, a);
      lastLoad.current = Date.now();
      setData({ ...next, accounts });
      setLoadError(null);
      return true;
    } catch (e) {
      setLoadError(describeError(e));
      return false;
    }
  }, [api]);

  useEffect(() => {
    if (!isValid()) {
      navigate("/admin?next=/admin/crm", { replace: true });
      return;
    }
    load();
  }, [isValid, navigate, load]);

  // Today in Tbilisi, re-checked every minute, so a tab left open overnight moves to the new day.
  const [today, setToday] = useState(tbilisiToday);
  useEffect(() => {
    const tick = window.setInterval(() => setToday(tbilisiToday()), 60_000);
    return () => window.clearInterval(tick);
  }, []);
  const metrics = useMemo(() => (data ? computeMetrics(data.accounts, today) : null), [data, today]);

  const upsert = useCallback((account: Account) => {
    latest.current.set(account.id, account);
    setData((d) => {
      if (!d) return d;
      const rest = d.accounts.filter((a) => a.id !== account.id);
      return { ...d, accounts: account.archived ? rest : [account, ...rest] };
    });
  }, []);

  /** Run writes to one hospital one after another, in click order. */
  const queue: Queue = useCallback(<T,>(id: string, task: () => Promise<T>): Promise<T> => {
    const run = (queues.current.get(id) ?? Promise.resolve()).catch(() => undefined).then(task);
    queues.current.set(id, run);
    return run;
  }, []);

  /** Save fields on one hospital. `change` can be computed from the newest version (for toggles). */
  const update: Update = useCallback(
    (id: string, change: Fields | ((current: Account) => Fields)) =>
      queue(id, async () => {
        const before = latest.current.get(id);
        if (!before) throw new CrmError(404, "not_found");
        const fields = typeof change === "function" ? change(before) : change;
        try {
          const { account } = await api<{ account: Account }>("update", {
            id,
            expected_updated_at: before.updated_at,
            fields,
          });
          upsert(account);
          return { before, account };
        } catch (e) {
          if (e instanceof CrmError && e.account) upsert(e.account);
          throw e;
        }
      }),
    [api, queue, upsert],
  );

  const setTab = (next: Tab) => {
    const p = new URLSearchParams(params);
    p.set("tab", next);
    p.delete("open");
    setParams(p);
  };
  const open = useCallback(
    (id: string | null) => {
      const p = new URLSearchParams(params);
      if (id) p.set("open", id);
      else p.delete("open");
      setParams(p);
    },
    [params, setParams],
  );

  const undo = useCallback(
    async (before: Account, after: Account) => {
      try {
        const { account } = await update(after.id, () => {
          const fields: Fields = {};
          for (const k of UNDO_FIELDS) if (before[k] !== after[k]) fields[k] = before[k];
          return fields;
        });
        toast.success(`Undone: ${account.name} is back where it was`);
      } catch (e) {
        toast.error(describeError(e));
      }
    },
    [update],
  );

  /** Move a deal to another stage right away, with an Undo in the confirmation. True when saved. */
  const moveStage = useCallback(
    async (a: Account, stage: StageId, extra: Fields = {}): Promise<boolean> => {
      const pending = toast.loading(`Moving ${a.name} to ${STAGE_LABEL[stage]}…`);
      try {
        const { before, account } = await update(a.id, { stage, ...extra });
        toast.success(
          (t) => (
            <span className="crm-toast">
              {account.name} is now in {STAGE_LABEL[stage]}
              <button onClick={() => { toast.dismiss(t.id); undo(before, account); }}>Undo</button>
            </span>
          ),
          { id: pending, duration: 6000 },
        );
        return true;
      } catch (e) {
        toast.error(describeError(e), { id: pending });
        return false;
      }
    },
    [update, undo],
  );

  /** A target replied: move it into the pipeline at Discovery. */
  const promote = useCallback(
    async (a: Account) => {
      const pending = toast.loading(`Moving ${a.name} to the pipeline…`);
      try {
        const { before, account } = await update(a.id, (current) => ({
          kind: "deal",
          owner: current.owner ?? (author || null),
          excluded: false,
        }));
        open(account.id);
        toast.success(
          (t) => (
            <span className="crm-toast">
              {account.name} is in Discovery. Give it a next step.
              <button onClick={() => { toast.dismiss(t.id); undo(before, account); }}>Undo</button>
            </span>
          ),
          { id: pending, duration: 6000 },
        );
      } catch (e) {
        toast.error(describeError(e), { id: pending });
      }
    },
    [update, open, undo, author],
  );

  const archive = useCallback(
    async (a: Account) => {
      open(null);
      upsert({ ...a, archived: true });
      try {
        const { account } = await queue(a.id, () => api<{ account: Account }>("archive", { id: a.id }));
        upsert(account);
        toast.success(
          (t) => (
            <span className="crm-toast">
              {a.name} archived
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    const res = await queue(a.id, () => api<{ account: Account }>("restore", { id: a.id }));
                    upsert(res.account);
                  } catch (e) {
                    toast.error(describeError(e));
                  }
                }}
              >
                Undo
              </button>
            </span>
          ),
          { duration: 6000 },
        );
      } catch (e) {
        upsert(a);
        toast.error(describeError(e));
      }
    },
    [api, queue, upsert, open],
  );

  const exportCsv = () => {
    if (!data) return;
    // The byte-order mark makes Excel read Georgian text as UTF-8 instead of garbage.
    const blob = new Blob(["﻿", toCsv(data.accounts)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medimind-crm-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const refresh = async () => {
    if (await load()) toast.success("Up to date");
    else toast.error("Couldn't refresh. Check your connection and try again.");
  };

  const opened = data?.accounts.find((a) => a.id === openId) ?? null;
  const overlay = opened !== null || newKind !== null || sessionExpired;

  // While a panel or dialog is open, the page behind it can't be clicked or reached with Tab.
  // Keyboard focus goes back to whatever opened it when it closes.
  const opener = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const focused = document.activeElement;
    if (overlay && !opener.current && focused instanceof HTMLElement && focused !== document.body) {
      opener.current = focused;
    }
    for (const el of [headerRef.current, mainRef.current]) {
      if (!el) continue;
      if (overlay) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    }
    if (!overlay && opener.current) {
      const back = opener.current;
      opener.current = null;
      if (back.isConnected) back.focus();
    }
  }, [overlay, data]);

  // Reload when someone comes back to this tab, unless a record is open in front of them.
  const quietRef = useRef(true);
  quietRef.current = !overlay && tab !== "anchor";
  useEffect(() => {
    const onReturn = () => {
      if (document.visibilityState !== "visible" || !quietRef.current) return;
      if (Date.now() - lastLoad.current < STALE_AFTER_MS) return;
      load();
    };
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, [load]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);
  const fromMenu = (action: () => void) => () => {
    setMoreOpen(false);
    action();
  };

  const counts = metrics && {
    pipeline: metrics.openDeals.length,
    targets: metrics.targets.length,
    anchor: metrics.anchors.length,
  };

  return (
    <div className="adm-page crm">
      <header className="crm-top" ref={headerRef}>
        <div className="crm-brand">
          <img src="/deck-assets/logo-horizontal-dark.svg" alt="MediMind" />
          <span className="crm-brand-title">Sales CRM</span>
        </div>
        <nav className="crm-tabs" aria-label="CRM sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`crm-tab${tab === t.id ? " is-active" : ""}`}
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {counts && t.id !== "overview" && <span className="crm-tab-count">{counts[t.id]}</span>}
            </button>
          ))}
        </nav>
        <div className="crm-top-actions">
          {data && <QuickFind accounts={data.accounts} onOpen={open} />}
          <label className={`crm-you${author ? "" : " is-empty"}`}>
            <span>You are</span>
            <select value={author} onChange={(e) => setAuthor(e.target.value)} aria-label="Who is working">
              <option value="">Pick your name</option>
              {OWNERS.filter((o) => o !== "Team").map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <button className="adm-btn adm-btn-primary" onClick={() => setNewKind(tab === "targets" ? "target" : "deal")}>
            Add hospital
          </button>
          <div className="crm-more" ref={moreRef}>
            <button
              className="adm-btn adm-btn-ghost"
              aria-expanded={moreOpen}
              aria-controls="crm-more-menu"
              onClick={() => setMoreOpen((o) => !o)}
            >
              More
            </button>
            {moreOpen && (
              <div className="crm-more-menu" id="crm-more-menu">
                <button onClick={fromMenu(exportCsv)}>Export CSV</button>
                <button onClick={fromMenu(refresh)}>Refresh</button>
                <Link to="/admin/dashboard" onClick={() => setMoreOpen(false)}>Investor analytics</Link>
                <button onClick={fromMenu(() => { clear(); navigate("/admin"); })}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {!data && !loadError && <div className="crm-loading">Loading the pipeline…</div>}
      {loadError && !data && (
        <div className="crm-empty">
          <p>{loadError}</p>
          <button className="adm-btn" onClick={load}>Try again</button>
        </div>
      )}

      {data && metrics && (
        <main className="crm-main" ref={mainRef}>
          {tab === "overview" && <Overview data={data} metrics={metrics} today={today} onOpen={open} onTab={setTab} />}
          {tab === "pipeline" && (
            <Pipeline accounts={data.accounts} today={today} onOpen={open} onMoveStage={moveStage} />
          )}
          {tab === "targets" && (
            <Targets
              targets={metrics.targets}
              excluded={metrics.excluded}
              inbound={data.inbound}
              today={today}
              onOpen={open}
              onPromote={promote}
              onNew={() => setNewKind("target")}
            />
          )}
          {tab === "anchor" && (
            <AnchorView
              anchors={metrics.anchors}
              today={today}
              api={api}
              onAccount={upsert}
              onUpdate={update}
              onQueue={queue}
              onMoveStage={moveStage}
              onPromote={promote}
              onArchive={archive}
            />
          )}
        </main>
      )}

      {opened && data && (
        <AccountDrawer
          key={opened.id}
          account={opened}
          today={today}
          api={api}
          onAccount={upsert}
          onUpdate={update}
          onQueue={queue}
          onMoveStage={moveStage}
          onPromote={promote}
          onArchive={archive}
          onClose={() => open(null)}
        />
      )}

      {newKind && data && (
        <NewAccountModal
          kind={newKind}
          author={author}
          api={api}
          accounts={data.accounts}
          onClose={() => setNewKind(null)}
          onOpenExisting={(id) => {
            setNewKind(null);
            open(id);
          }}
          onCreated={(a) => {
            upsert(a);
            setNewKind(null);
            open(a.id);
            toast.success(`${a.name} added`);
          }}
        />
      )}

      {sessionExpired && (
        <SessionModal
          onDone={(token, exp) => {
            setSession(token, exp);
            setSessionExpired(false);
            load();
            toast.success("Logged in again. Repeat your last action; your edits are still here.");
          }}
        />
      )}

      <Toaster
        position="bottom-left"
        toastOptions={{ className: "crm-toaster", duration: 4000 }}
      />
    </div>
  );
};

/** The 1-hour admin session ran out mid-work: log in again without leaving the page. */
const SessionModal: React.FC<{ onDone: (token: string, exp: number) => void }> = ({ onDone }) => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Escape does nothing here: closing this would leave the page with no way to save.
  useEscape(() => undefined);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const session = await adminLogin(password);
      if (typeof session === "object") onDone(session.token, session.exp);
      else if (session === "locked") setError("Too many wrong passwords from this connection. Wait 15 minutes, then try again.");
      else setError("That password didn't work. Try again.");
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-modal-bg" role="dialog" aria-modal="true" aria-labelledby="crm-session-title">
      <form className="adm-modal" onSubmit={submit}>
        <h2 id="crm-session-title">Your session ended</h2>
        <p className="adm-modal-sub">Admin sessions last an hour. Log in again to keep working; nothing on this page is lost.</p>
        <div className="adm-form-row">
          <label htmlFor="crm-session-password">Admin password</label>
          <input
            id="crm-session-password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="crm-form-error">{error}</p>}
        <div className="adm-form-actions">
          <button className="adm-btn adm-btn-primary" type="submit" disabled={busy || !password}>
            {busy ? "Checking…" : "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
};

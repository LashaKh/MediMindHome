import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  "kind", "stage", "stage_since", "status", "lost_reason", "amount_gel", "first_contact_at",
  ...MILESTONES.map((m) => m.key),
];

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

  const load = useCallback(async () => {
    try {
      const next = await api<CrmData>("list");
      setData(next);
      setLoadError(null);
    } catch (e) {
      setLoadError(describeError(e));
    }
  }, [api]);

  useEffect(() => {
    if (!isValid()) {
      navigate("/admin?next=/admin/crm", { replace: true });
      return;
    }
    load();
  }, [isValid, navigate, load]);

  const today = data?.today ?? tbilisiToday();
  const metrics = useMemo(() => (data ? computeMetrics(data.accounts, today) : null), [data, today]);

  const upsert = useCallback((account: Account) => {
    setData((d) => {
      if (!d) return d;
      const rest = d.accounts.filter((a) => a.id !== account.id);
      return { ...d, accounts: account.archived ? rest : [account, ...rest] };
    });
  }, []);

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
      const fields: Record<string, unknown> = {};
      for (const k of UNDO_FIELDS) if (before[k] !== after[k]) fields[k] = before[k];
      try {
        const { account } = await api<{ account: Account }>("update", {
          id: after.id,
          expected_updated_at: after.updated_at,
          fields,
        });
        upsert(account);
        toast.success(`Undone: ${account.name} is back where it was`);
      } catch (e) {
        if (e instanceof CrmError && e.account) upsert(e.account);
        toast.error(describeError(e));
      }
    },
    [api, upsert],
  );

  /** Move a deal to another stage right away, with an Undo in the confirmation. */
  const moveStage = useCallback(
    async (a: Account, stage: StageId, extra: Record<string, unknown> = {}) => {
      const pending = toast.loading(`Moving ${a.name} to ${STAGE_LABEL[stage]}…`);
      try {
        const { account } = await api<{ account: Account }>("update", {
          id: a.id,
          expected_updated_at: a.updated_at,
          fields: { stage, ...extra },
        });
        upsert(account);
        toast.success(
          (t) => (
            <span className="crm-toast">
              {account.name} is now in {STAGE_LABEL[stage]}
              <button onClick={() => { toast.dismiss(t.id); undo(a, account); }}>Undo</button>
            </span>
          ),
          { id: pending, duration: 6000 },
        );
      } catch (e) {
        if (e instanceof CrmError && e.account) upsert(e.account);
        toast.error(describeError(e), { id: pending });
      }
    },
    [api, upsert, undo],
  );

  /** A researched target replied: move it into the pipeline at Discovery. */
  const promote = useCallback(
    async (a: Account) => {
      const pending = toast.loading(`Moving ${a.name} to the pipeline…`);
      try {
        const { account } = await api<{ account: Account }>("update", {
          id: a.id,
          expected_updated_at: a.updated_at,
          fields: { kind: "deal", owner: a.owner ?? (author || null) },
        });
        upsert(account);
        open(account.id);
        toast.success(
          (t) => (
            <span className="crm-toast">
              {account.name} is in Discovery. Give it a next step.
              <button onClick={() => { toast.dismiss(t.id); undo(a, account); }}>Undo</button>
            </span>
          ),
          { id: pending, duration: 6000 },
        );
      } catch (e) {
        if (e instanceof CrmError && e.account) upsert(e.account);
        toast.error(describeError(e), { id: pending });
      }
    },
    [api, upsert, open, undo, author],
  );

  const archive = useCallback(
    async (a: Account) => {
      open(null);
      upsert({ ...a, archived: true });
      try {
        await api("archive", { id: a.id });
        toast.success(
          (t) => (
            <span className="crm-toast">
              {a.name} archived
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    const { account } = await api<{ account: Account }>("restore", { id: a.id });
                    upsert(account);
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
    [api, upsert, open],
  );

  const exportCsv = () => {
    if (!data) return;
    const blob = new Blob([toCsv(data.accounts)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medimind-crm-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const opened = data?.accounts.find((a) => a.id === openId) ?? null;
  const counts = metrics && {
    pipeline: metrics.openDeals.length,
    targets: metrics.targets.length,
    anchor: metrics.anchors.length,
  };

  return (
    <div className="adm-page crm">
      <header className="crm-top">
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
          <label className="crm-you">
            <span>You are</span>
            <select value={author} onChange={(e) => setAuthor(e.target.value)} aria-label="Who is working">
              <option value="">Choose…</option>
              {OWNERS.filter((o) => o !== "Team").map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <button className="adm-btn adm-btn-primary" onClick={() => setNewKind(tab === "targets" ? "target" : "deal")}>
            Add hospital
          </button>
          <details className="crm-more">
            <summary className="adm-btn adm-btn-ghost" aria-label="More actions">More</summary>
            <div className="crm-more-menu">
              <button onClick={exportCsv}>Export CSV</button>
              <button onClick={load}>Refresh</button>
              <Link to="/admin/dashboard">Investor analytics</Link>
              <button onClick={() => { clear(); navigate("/admin"); }}>Log out</button>
            </div>
          </details>
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
        <main className="crm-main">
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
          onMoveStage={moveStage}
          onPromote={promote}
          onArchive={archive}
          onClose={() => open(null)}
        />
      )}

      {newKind && (
        <NewAccountModal
          kind={newKind}
          author={author}
          api={api}
          onClose={() => setNewKind(null)}
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const session = await adminLogin(password);
      if (session) onDone(session.token, session.exp);
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import "./BriefingGate.css";
import "./AdminDashboard.css";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://kvsqtolsjggpyvdtdpss.supabase.co";

const ADMIN_DATA_URL = `${SUPABASE_URL}/functions/v1/admin-data`;
const ADMIN_WRITE_URL = `${SUPABASE_URL}/functions/v1/admin-write`;

interface Invite {
  id: string;
  token: string;
  full_name: string;
  first_name: string;
  organization: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  active: boolean;
  password: string;
}

interface InvestorEvent {
  id: string;
  token: string;
  event_type: string;
  metadata: Record<string, unknown> | null;
  ip_hash: string | null;
  user_agent: string | null;
  occurred_at: string;
}

interface SummaryEntry {
  total_events: number;
  open_count: number;
  total_dwell_seconds: number;
  last_seen_at: string | null;
  unique_ip_hashes: number;
  unique_user_agents: number;
  top_slides: Array<{ slide_index: number; slide_label: string; dwell: number }>;
}

interface DataPayload {
  invites: Invite[];
  events: InvestorEvent[];
  summary_by_token: Record<string, SummaryEntry>;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { jwt, clear, isValid } = useAdminStore();

  const [data, setData] = useState<DataPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchData = useCallback(async () => {
    if (!jwt) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(ADMIN_DATA_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.status === 401) {
        clear();
        navigate("/admin", { replace: true });
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }, [jwt, clear, navigate]);

  useEffect(() => {
    if (!isValid()) {
      navigate("/admin", { replace: true });
      return;
    }
    fetchData();
  }, [isValid, navigate, fetchData]);

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(fetchData, 60_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const stats = useMemo(() => {
    if (!data) return null;
    const totalInvites = data.invites.length;
    const activeInvites = data.invites.filter((i) => i.active).length;
    const totalOpens = Object.values(data.summary_by_token).reduce(
      (s, v) => s + v.open_count,
      0,
    );
    const totalEvents = data.events.length;
    return { totalInvites, activeInvites, totalOpens, totalEvents };
  }, [data]);

  if (loading && !data) {
    return (
      <div className="adm-page">
        <div className="adm-loading">Loading briefing analytics…</div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <header className="adm-topbar">
        <div className="adm-brand">
          <img src="/deck-assets/logo-horizontal-dark.svg" alt="MediMind" />
          <span className="adm-brand-title">Briefing Analytics</span>
        </div>
        <div className="adm-actions">
          <button className="adm-btn adm-btn-ghost" onClick={fetchData}>
            ↻ Refresh
          </button>
          <button className="adm-btn adm-btn-primary" onClick={() => setShowAdd(true)}>
            + Add Invitee
          </button>
          <button
            className="adm-btn adm-btn-ghost"
            onClick={() => { clear(); navigate("/admin"); }}
          >
            Logout
          </button>
        </div>
      </header>

      {stats && (
        <div className="adm-stats">
          <StatCard label="Active Invites" value={stats.activeInvites} sub={`${stats.totalInvites} total`} />
          <StatCard label="Total Opens" value={stats.totalOpens} sub="link + deck opens" />
          <StatCard label="Events (14d)" value={stats.totalEvents} sub="across all invites" />
          <StatCard
            label="Engagement"
            value={
              data && data.invites.length > 0
                ? `${Math.round(
                    (data.invites.filter((i) =>
                      data.summary_by_token[i.token]?.open_count
                    ).length /
                      data.invites.length) * 100,
                  )}%`
                : "0%"
            }
            sub="invitees who opened"
          />
        </div>
      )}

      {errorMsg && <div className="adm-empty">{errorMsg}</div>}

      <div className="adm-table-wrap">
        {data && data.invites.length === 0 ? (
          <div className="adm-empty">
            No invites yet. Click <strong style={{ color: "#bee3f8" }}>+ Add Invitee</strong> to create your first per-investor link.
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Investor</th>
                <th>Organization</th>
                <th>Last Seen</th>
                <th>Opens</th>
                <th>Dwell</th>
                <th>Devices</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.invites.map((inv) => {
                const sum = data.summary_by_token[inv.token];
                const isOpen = expanded === inv.token;
                return (
                  <React.Fragment key={inv.token}>
                    <tr
                      className={isOpen ? "expanded" : ""}
                      onClick={() => setExpanded(isOpen ? null : inv.token)}
                    >
                      <td>
                        <div className="row-name">
                          <span className={`adm-row-chevron ${isOpen ? "open" : ""}`}>▶</span>
                          <span>{inv.full_name}</span>
                        </div>
                      </td>
                      <td>{inv.organization || "—"}</td>
                      <td>{relativeTime(sum?.last_seen_at)}</td>
                      <td>{sum?.open_count ?? 0}</td>
                      <td>{formatDwell(sum?.total_dwell_seconds ?? 0)}</td>
                      <td>{sum?.unique_ip_hashes ?? 0}</td>
                      <td>{statusPill(inv, sum)}</td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <DetailPanel
                            invite={inv}
                            events={data.events.filter((e) => e.token === inv.token)}
                            summary={sum}
                            jwt={jwt!}
                            onChange={fetchData}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <AddInviteModal
          jwt={jwt!}
          onClose={() => setShowAdd(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: React.ReactNode; sub: string }> = ({
  label, value, sub,
}) => (
  <div className="adm-stat-card">
    <div className="adm-stat-label">{label}</div>
    <div className="adm-stat-value">{value}</div>
    <div className="adm-stat-sub">{sub}</div>
  </div>
);

const DetailPanel: React.FC<{
  invite: Invite;
  events: InvestorEvent[];
  summary: SummaryEntry | undefined;
  jwt: string;
  onChange: () => void;
}> = ({ invite, events, summary, jwt, onChange }) => {
  const briefingUrl = `${window.location.origin}/briefing/${invite.token}`;
  const [copied, setCopied] = useState(false);
  const [pwdCopied, setPwdCopied] = useState(false);
  const [editingPwd, setEditingPwd] = useState(false);
  const [pwdDraft, setPwdDraft] = useState(invite.password);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdBusy, setPwdBusy] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(briefingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* */ }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(invite.password);
      setPwdCopied(true);
      setTimeout(() => setPwdCopied(false), 1500);
    } catch { /* */ }
  };

  const toggleActive = async () => {
    await fetch(ADMIN_WRITE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ action: "toggle_active", token: invite.token }),
    });
    onChange();
  };

  const regeneratePassword = async () => {
    setPwdBusy(true);
    setPwdError(null);
    try {
      const res = await fetch(ADMIN_WRITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ action: "regenerate_password", token: invite.token }),
      });
      const json = await res.json();
      if (!json.ok) {
        setPwdError(json.error ?? "Failed to regenerate");
      } else {
        onChange();
      }
    } catch {
      setPwdError("Network error");
    } finally {
      setPwdBusy(false);
    }
  };

  const startEditPassword = () => {
    setPwdDraft(invite.password);
    setPwdError(null);
    setEditingPwd(true);
  };

  const cancelEditPassword = () => {
    setEditingPwd(false);
    setPwdError(null);
  };

  const savePassword = async () => {
    const value = pwdDraft.trim();
    if (value.length < 4 || value.length > 64) {
      setPwdError("Password must be 4-64 characters.");
      return;
    }
    setPwdBusy(true);
    setPwdError(null);
    try {
      const res = await fetch(ADMIN_WRITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          action: "update_password",
          token: invite.token,
          password: value,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setPwdError(json.error === "password_length" ? "Password must be 4-64 characters." : (json.error ?? "Failed to save"));
      } else {
        setEditingPwd(false);
        onChange();
      }
    } catch {
      setPwdError("Network error");
    } finally {
      setPwdBusy(false);
    }
  };

  const maxDwell = summary?.top_slides[0]?.dwell ?? 1;

  return (
    <div className="adm-detail">
      <div className="adm-detail-actions">
        <div className="adm-url-box">{briefingUrl}</div>
        <button className="adm-btn" onClick={copyUrl}>
          {copied ? "✓ Copied" : "Copy URL"}
        </button>
        <button className="adm-btn" onClick={toggleActive}>
          {invite.active ? "Revoke" : "Reactivate"}
        </button>
      </div>

      <div className="adm-detail-actions">
        <div className="adm-url-box" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          <span style={{ color: "var(--ink-faded)", marginRight: 8, fontSize: 12, letterSpacing: "0.06em" }}>PASSWORD</span>
          {editingPwd ? (
            <input
              type="text"
              value={pwdDraft}
              onChange={(e) => setPwdDraft(e.target.value)}
              autoFocus
              disabled={pwdBusy}
              style={{
                background: "transparent",
                border: "1px solid var(--accent)",
                borderRadius: 4,
                color: "inherit",
                font: "inherit",
                padding: "2px 6px",
                outline: "none",
                width: "calc(100% - 100px)",
              }}
            />
          ) : (
            <strong style={{ color: "#bee3f8" }}>{invite.password}</strong>
          )}
          {pwdError && (
            <span style={{ color: "var(--error, #f87171)", marginLeft: 10, fontSize: 12 }}>
              {pwdError}
            </span>
          )}
        </div>
        {editingPwd ? (
          <>
            <button className="adm-btn adm-btn-primary" onClick={savePassword} disabled={pwdBusy}>
              {pwdBusy ? "Saving…" : "Save"}
            </button>
            <button className="adm-btn" onClick={cancelEditPassword} disabled={pwdBusy}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="adm-btn" onClick={copyPassword}>
              {pwdCopied ? "✓ Copied" : "Copy"}
            </button>
            <button className="adm-btn" onClick={startEditPassword} disabled={pwdBusy}>
              Edit
            </button>
            <button className="adm-btn" onClick={regeneratePassword} disabled={pwdBusy} title="Reset to FirstName + first letter of surname">
              {pwdBusy ? "…" : "Regenerate"}
            </button>
          </>
        )}
      </div>

      <div>
        <h4>Top slides by dwell time</h4>
        {!summary?.top_slides.length ? (
          <p style={{ color: "var(--ink-faded)", fontSize: 12, margin: 0 }}>
            No slide views yet.
          </p>
        ) : (
          <div className="adm-bar-chart">
            {summary.top_slides.map((s) => (
              <div className="adm-bar-row" key={s.slide_index}>
                <div className="adm-bar-label" title={s.slide_label}>{s.slide_label}</div>
                <div className="adm-bar-track">
                  <div
                    className="adm-bar-fill"
                    style={{ width: `${Math.max(4, (s.dwell / maxDwell) * 100)}%` }}
                  />
                </div>
                <div className="adm-bar-value">{formatDwell(s.dwell)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4>Recent events ({events.length})</h4>
        {events.length === 0 ? (
          <p style={{ color: "var(--ink-faded)", fontSize: 12, margin: 0 }}>
            No activity recorded yet.
          </p>
        ) : (
          <ul className="adm-event-list">
            {events.slice(0, 50).map((e) => (
              <li key={e.id}>
                <span className="adm-event-time">{shortTime(e.occurred_at)}</span>
                <span className="adm-event-type">{e.event_type}</span>
                <span className="adm-event-meta">{eventMeta(e)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const AddInviteModal: React.FC<{
  jwt: string;
  onClose: () => void;
  onCreated: () => void;
}> = ({ jwt, onClose, onCreated }) => {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Name is required"); return; }
    setPending(true);
    setError(null);
    try {
      const res = await fetch(ADMIN_WRITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          action: "create",
          full_name: fullName.trim(),
          organization: organization.trim() || null,
          email: email.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      const json = await res.json();
      if (json.ok && json.invite) {
        setCreatedUrl(`${window.location.origin}/briefing/${json.invite.token}`);
        setCreatedName(json.invite.first_name);
        setCreatedPassword(json.invite.password ?? null);
        onCreated();
      } else {
        setError(json.error ?? "Failed to create");
      }
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  };

  if (createdUrl) {
    return (
      <div className="adm-modal-bg" onClick={onClose}>
        <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Invite created.</h2>
          <p className="adm-modal-sub">
            Send this URL and password to {fullName}. They'll use the password to unlock the briefing.
          </p>
          <div className="adm-success-box">
            <div className="label">Briefing URL</div>
            <div className="url">{createdUrl}</div>
          </div>
          <div className="adm-success-box" style={{ marginTop: 10 }}>
            <div className="label">Password</div>
            <div className="url" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              <strong style={{ color: "#bee3f8" }}>{createdPassword ?? createdName}</strong>
            </div>
          </div>
          <div className="adm-form-actions">
            <button
              className="adm-btn adm-btn-primary"
              onClick={async () => {
                await navigator.clipboard.writeText(createdUrl).catch(() => {});
                onClose();
              }}
            >
              Copy URL & Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-modal-bg" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add invitee</h2>
        <p className="adm-modal-sub">
          Generates a unique briefing URL and password. The password is
          auto-generated as <em>FirstName + first letter of surname</em>
          (e.g., "Lasha Khoshtaria" → <code style={{ color: "#bee3f8" }}>LashaK</code>),
          and you can edit it later from the row's detail panel.
        </p>
        <form onSubmit={submit}>
          <div className="adm-form-row">
            <label>Full name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Lasha Khoshtaria"
              autoFocus
            />
          </div>
          <div className="adm-form-row">
            <label>Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Andreessen Horowitz"
            />
          </div>
          <div className="adm-form-row">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lasha@a16z.com"
            />
          </div>
          <div className="adm-form-row">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Met at YC dinner; warm intro from Tornike"
            />
          </div>
          {error && (
            <div style={{ color: "var(--error)", fontSize: 12, marginTop: -8, marginBottom: 8 }}>
              {error}
            </div>
          )}
          <div className="adm-form-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
              {pending ? "Creating…" : "Create & Get URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ────── Helpers ───────────────────────────────────────────────────

function statusPill(inv: Invite, sum: SummaryEntry | undefined) {
  if (!inv.active) return <span className="adm-pill pill-revoked">Revoked</span>;
  if (!sum || !sum.last_seen_at) return <span className="adm-pill pill-cold">Not opened</span>;
  const ageMs = Date.now() - new Date(sum.last_seen_at).getTime();
  if (ageMs < 5 * 60_000) return <span className="adm-pill pill-hot">Viewing now</span>;
  if (sum.unique_ip_hashes > 1) return <span className="adm-pill pill-hot">Forwarded?</span>;
  if (ageMs < 24 * 3600_000) return <span className="adm-pill pill-warm">Warm</span>;
  return <span className="adm-pill pill-cold">Cold</span>;
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  if (ms < 3600_000) return `${Math.round(ms / 60_000)}m ago`;
  if (ms < 86400_000) return `${Math.round(ms / 3600_000)}h ago`;
  return `${Math.round(ms / 86400_000)}d ago`;
}

function shortTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function formatDwell(seconds: number): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function eventMeta(e: InvestorEvent): string {
  if (!e.metadata) return "";
  const m = e.metadata as Record<string, unknown>;
  if (e.event_type === "slide_view") {
    return `${m.slide_label ?? `slide ${m.slide_index}`} · ${m.dwell_seconds ?? 0}s`;
  }
  if (e.event_type === "deck_closed") {
    return `total ${m.total_dwell_seconds ?? 0}s`;
  }
  if (e.event_type === "password_fail") {
    return String(m.reason ?? "");
  }
  if (e.event_type === "link_opened") {
    const ua = (e.user_agent || "").slice(0, 40);
    return ua;
  }
  return "";
}

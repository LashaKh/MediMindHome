import React, { useMemo, useState } from "react";
import { type Account, type Kind, ORG_TYPES, OWNERS, SOURCES } from "../../data/crm";
import { type Api, describeError } from "../../lib/crmApi";
import { useEscape } from "./useEscape";

interface Props {
  kind: Kind;
  author: string;
  api: Api;
  /** Everything already in the CRM, to warn before a duplicate is added. */
  accounts: Account[];
  onClose: () => void;
  onOpenExisting: (id: string) => void;
  onCreated: (a: Account) => void;
}

/** Lowercase letters and digits only, so "Helsicore" finds "HelsiCore (Healthycore)". Georgian letters stay. */
const squash = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

export const NewAccountModal: React.FC<Props> = ({
  kind: initialKind,
  author,
  api,
  accounts,
  onClose,
  onOpenExisting,
  onCreated,
}) => {
  const [kind, setKind] = useState<Kind>(initialKind === "anchor" ? "deal" : initialKind);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [city, setCity] = useState("");
  const [orgType, setOrgType] = useState("");
  const [owner, setOwner] = useState(author);
  const [nextStep, setNextStep] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Escape or a click outside only closes an empty form; with something typed, Cancel does.
  const empty = !name.trim() && !city.trim() && !nextStep.trim() && !notes.trim();
  useEscape(onClose, !busy && empty);

  const similar = useMemo(() => {
    const typed = squash(name);
    if (typed.length < 3) return [];
    return accounts.filter((a) => {
      const existing = squash(a.name);
      return existing.length >= 3 && (existing.includes(typed) || typed.includes(existing));
    }).slice(0, 3);
  }, [accounts, name]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { account } = await api<{ account: Account }>("create", {
        fields: {
          kind,
          name,
          source: source || null,
          city,
          org_type: orgType || null,
          owner: owner || null,
          next_step: nextStep,
          next_step_date: nextDate || null,
          notes,
        },
      });
      onCreated(account);
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  };

  return (
    <div className="adm-modal-bg" onMouseDown={(e) => e.target === e.currentTarget && !busy && empty && onClose()}>
      <form className="adm-modal crm-new" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="crm-new-title">
        <h2 id="crm-new-title">Add a hospital</h2>
        <p className="adm-modal-sub">One row per buying organization. A group that buys centrally is one hospital here.</p>

        <div className="crm-seg crm-new-kind" role="group" aria-label="Where does it go">
          <button type="button" aria-pressed={kind === "target"} className={kind === "target" ? "is-on" : ""} onClick={() => setKind("target")}>
            Target: not talking yet
          </button>
          <button type="button" aria-pressed={kind === "deal"} className={kind === "deal" ? "is-on" : ""} onClick={() => setKind("deal")}>
            Pipeline: they agreed to talk
          </button>
        </div>

        <div className="crm-grid">
          <label className="crm-field crm-span-2">
            <span className="crm-field-label">Hospital or group name</span>
            <input autoFocus required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          {similar.length > 0 && (
            <div className="crm-similar crm-span-2" role="status">
              <span>Already in the CRM:</span>
              {similar.map((a) => (
                <button type="button" key={a.id} className="crm-text-btn" onClick={() => onOpenExisting(a.id)}>
                  Open {a.name}
                </button>
              ))}
            </div>
          )}
          <label className="crm-field">
            <span className="crm-field-label">How we got in</span>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Not set</option>
              {SOURCES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="crm-field">
            <span className="crm-field-label">Type</span>
            <select value={orgType} onChange={(e) => setOrgType(e.target.value)}>
              <option value="">Not set</option>
              {ORG_TYPES.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="crm-field">
            <span className="crm-field-label">City</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="crm-field">
            <span className="crm-field-label">Owner</span>
            <select value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option value="">Nobody yet</option>
              {OWNERS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="crm-field crm-span-2">
            <span className="crm-field-label">Next step</span>
            <input value={nextStep} placeholder="What happens next?" onChange={(e) => setNextStep(e.target.value)} />
          </label>
          <label className="crm-field">
            <span className="crm-field-label">By</span>
            <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
          </label>
          <label className="crm-field crm-span-2">
            <span className="crm-field-label">What we know</span>
            <textarea rows={3} value={notes} placeholder="Checked facts only, and where they came from" onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>

        {error && <p className="crm-form-error">{error}</p>}
        <div className="adm-form-actions">
          <button type="button" className="adm-btn adm-btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={busy || !name.trim()}>
            {busy ? "Adding…" : "Add hospital"}
          </button>
        </div>
      </form>
    </div>
  );
};

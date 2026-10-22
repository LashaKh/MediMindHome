import React, { useState } from "react";
import { type Account, type Kind, ORG_TYPES, OWNERS, SOURCES } from "../../data/crm";
import { type Api, describeError } from "../../lib/crmApi";
import { useEscape } from "./useEscape";

interface Props {
  kind: Kind;
  author: string;
  api: Api;
  onClose: () => void;
  onCreated: (a: Account) => void;
}

export const NewAccountModal: React.FC<Props> = ({ kind: initialKind, author, api, onClose, onCreated }) => {
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
  useEscape(onClose, !busy);

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
    <div className="adm-modal-bg" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <form className="adm-modal crm-new" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="crm-new-title">
        <h2 id="crm-new-title">Add a hospital</h2>
        <p className="adm-modal-sub">One row per buying organization. A group that buys centrally is one hospital here.</p>

        <div className="crm-seg crm-new-kind" role="radiogroup" aria-label="Where does it go">
          <button type="button" role="radio" aria-checked={kind === "target"} className={kind === "target" ? "is-on" : ""} onClick={() => setKind("target")}>
            Researched, not contacted
          </button>
          <button type="button" role="radio" aria-checked={kind === "deal"} className={kind === "deal" ? "is-on" : ""} onClick={() => setKind("deal")}>
            They replied: pipeline
          </button>
        </div>

        <div className="crm-grid">
          <label className="crm-field crm-span-2">
            <span className="crm-field-label">Hospital or group name</span>
            <input autoFocus required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
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

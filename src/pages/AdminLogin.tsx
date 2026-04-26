import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import "./BriefingGate.css";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://kvsqtolsjggpyvdtdpss.supabase.co";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const setSession = useAdminStore((s) => s.setSession);
  const isValid = useAdminStore((s) => s.isValid);

  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [helperText, setHelperText] = useState(
    "Enter the admin password to view briefing analytics.",
  );
  const [helperKind, setHelperKind] = useState<"normal" | "error" | "success">("normal");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isValid()) navigate("/admin/dashboard", { replace: true });
  }, [isValid, navigate]);

  useEffect(() => {
    if (!matchMedia("(max-width: 640px)").matches) inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || !value) return;

    setPending(true);
    setHelperKind("normal");
    setHelperText("Verifying…");

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      const json = await res.json();

      if (json.ok && json.token) {
        setSession(json.token, json.exp);
        setHelperKind("success");
        setHelperText("Authenticated — loading dashboard…");
        setTimeout(() => navigate("/admin/dashboard", { replace: true }), 400);
        return;
      }

      setPending(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setValue("");
      setHelperKind("error");
      setHelperText("Incorrect password.");
    } catch {
      setPending(false);
      setHelperKind("error");
      setHelperText("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-page">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />

      <div className="stage">
        <header className="topbar">
          <div className="brand">
            <img src="/deck-assets/logo-horizontal-dark.svg" alt="MediMind" />
          </div>
          <div className="session-tag">Admin Console</div>
        </header>

        <main className="center">
          <section className={`card ${shake ? "shake" : ""}`} role="dialog">
            <div className="eyebrow">Briefing Analytics</div>
            <h1 className="title">Admin access.</h1>
            <p className="lede">
              View per-investor briefing activity, manage invite links, and track
              engagement across the round.
            </p>

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="field">
                <label className="field-label" htmlFor="adminpw">Password</label>
                <input
                  ref={inputRef}
                  type="password"
                  id="adminpw"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  spellCheck={false}
                  required
                  disabled={pending}
                />
              </div>

              <button type="submit" className="submit" disabled={pending}>
                {pending
                  ? "Verifying…"
                  : <><span>Enter Console</span><span aria-hidden="true">→</span></>}
              </button>

              <div className={`helper ${helperKind}`} role="status" aria-live="polite">
                {helperText}
              </div>
            </form>
          </section>
        </main>

        <footer className="footer">
          <span className="lock">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" />
            </svg>
            <span>Confidential</span>
          </span>
          <span>&copy; 2026 MediMind. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { investorLogin, trackEvent } from "../lib/tracking";
import "./BriefingGate.css";

const DECK_URL = "/deck.html";
const SESSION_KEY = "mm_briefing_access";
const TOKEN_KEY = "mm_briefing_token";
const NAME_KEY = "mm_briefing_name";

export const BriefingGate: React.FC = () => {
  const { token = "" } = useParams<{ token: string }>();
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [helperText, setHelperText] = useState(
    "Single-use, encrypted access. Verified against your invitation.",
  );
  const [helperKind, setHelperKind] = useState<"normal" | "error" | "success">(
    "normal",
  );
  const [shake, setShake] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [, setTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // If already authenticated this session, skip straight to deck.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      window.location.replace(DECK_URL);
    }
  }, []);

  // Log link_opened on mount
  useEffect(() => {
    if (!token) return;
    void trackEvent(token, "link_opened", {
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      path: window.location.pathname,
    });
  }, [token]);

  // Auto-focus input on desktop
  useEffect(() => {
    if (!matchMedia("(max-width: 640px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  // Tick countdown when locked
  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => {
      if (Date.now() >= lockedUntil) {
        setLockedUntil(0);
        setHelperKind("normal");
        setHelperText(
          "Single-use, encrypted access. Verified against your invitation.",
        );
      } else {
        setTick((t) => t + 1);
      }
    }, 500);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || lockedUntil) return;
    if (!token) {
      setHelperKind("error");
      setHelperText("Invalid briefing link.");
      return;
    }
    if (!value.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
      return;
    }

    setPending(true);
    setHelperKind("normal");
    setHelperText("Verifying…");

    const result = await investorLogin(token, value.trim());

    if (result.ok) {
      setHelperKind("success");
      setHelperText(`Welcome, ${result.full_name.split(/\s+/)[0]} — entering briefing…`);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
        sessionStorage.setItem(TOKEN_KEY, token);
        if (result.full_name) {
          sessionStorage.setItem(NAME_KEY, result.full_name);
        }
      } catch {/* ignore */}
      // Brief delay so the success state is perceivable
      setTimeout(() => {
        window.location.replace(DECK_URL);
      }, 600);
      return;
    }

    // Failure paths
    setPending(false);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setValue("");
    inputRef.current?.focus();

    if (result.status === 429) {
      const lockMs = 5 * 60_000;
      setLockedUntil(Date.now() + lockMs);
      setHelperKind("error");
      setHelperText("Too many attempts. Please wait 5 minutes.");
    } else if (result.error === "network") {
      setHelperKind("error");
      setHelperText("Network error. Please try again.");
    } else {
      setHelperKind("error");
      setHelperText("That access name does not match this invitation.");
    }
  };

  const remainingSeconds = lockedUntil
    ? Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000))
    : 0;

  return (
    <div className="bg-page">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />

      <div className="stage">
        <header className="topbar">
          <div className="brand">
            <img src="/deck-assets/logo-horizontal-dark.svg" alt="MediMind" />
          </div>
          <div className="session-tag">Encrypted Session</div>
        </header>

        <main className="center">
          <section
            className={`card ${shake ? "shake" : ""}`}
            role="dialog"
            aria-labelledby="cardTitle"
          >
            <div className="eyebrow">Private Investor Briefing</div>
            <h1 className="title" id="cardTitle">By invitation only.</h1>
            <p className="lede">
              This briefing is shared with a select group of partners. Please
              enter your access name to continue.
            </p>

            <div className="round-window" role="status" aria-label="Round closing window">
              <span className="round-window-pulse" aria-hidden="true" />
              <div className="round-window-body">
                <div className="round-window-label">Pre-seed · open round</div>
                <div className="round-window-note">
                  $200K target · YC-standard SAFE · briefing access expires after the window.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="field">
                <label className="field-label" htmlFor="access">Access Name</label>
                <input
                  ref={inputRef}
                  type="text"
                  id="access"
                  name="access"
                  placeholder="Your first name"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoCapitalize="words"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  disabled={pending || !!lockedUntil}
                />
              </div>

              <button
                type="submit"
                className="submit"
                disabled={pending || !!lockedUntil}
              >
                {pending
                  ? "Verifying…"
                  : lockedUntil
                    ? `Locked · ${remainingSeconds}s`
                    : <><span>Enter Briefing</span><span aria-hidden="true">→</span></>}
              </button>

              <div className={`helper ${helperKind}`} role="status" aria-live="polite">
                {helperText}
              </div>
            </form>
          </section>
        </main>

        <footer className="footer">
          <span className="lock">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

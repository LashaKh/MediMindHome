import React from "react";
import "./BriefingGate.css";

/**
 * Shown when someone hits /briefing or /deck.html without a valid
 * per-investor token + session. Communicates "private — invitation
 * required" instead of bouncing them to the public landing page.
 */
export const BriefingLocked: React.FC = () => {
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
          <section className="card" role="dialog" aria-labelledby="lockedTitle">
            <div className="eyebrow">Private Investor Briefing</div>
            <h1 className="title" id="lockedTitle">Invitation required.</h1>
            <p className="lede">
              This briefing is shared with a select group of partners through
              personal invitation links. Please open the link from your
              invitation email to continue.
            </p>

            <div className="round-window" role="status">
              <span className="round-window-pulse" aria-hidden="true" />
              <div className="round-window-body">
                <div className="round-window-label">Pre-seed · open round</div>
                <div className="round-window-headline">
                  Round closes in <strong>14 days</strong>.
                </div>
                <div className="round-window-note">
                  $200K target · YC-standard SAFE · invitation-only access.
                </div>
              </div>
            </div>

            <a
              href="https://medimind.md"
              className="submit"
              style={{ textDecoration: "none" }}
            >
              <span>Visit MediMind.md</span>
              <span aria-hidden="true">→</span>
            </a>

            <div className="helper">
              Need access? Email{" "}
              <a
                href="mailto:team@medimind.md"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                team@medimind.md
              </a>
            </div>
          </section>
        </main>

        <footer className="footer">
          <span className="lock">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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

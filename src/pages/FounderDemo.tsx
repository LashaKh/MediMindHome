import React, { useEffect } from "react";
import "./FounderDemo.css";

const VIDEO_SRC = "/media/founder-demo.mp4";
const POSTER_SRC = "/og-image.png";

export const FounderDemo: React.FC = () => {
  useEffect(() => {
    // Keep this page out of search engines even if the URL leaks.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "MediMind — Founder Demo";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="fd-page">
      <header className="fd-topbar">
        <img src="/deck-assets/logo-horizontal-dark.svg" alt="MediMind" />
        <span className="fd-tag">Private Demo</span>
      </header>

      <main className="fd-stage">
        <div className="fd-eyebrow">Founder Walkthrough</div>
        <h1 className="fd-title">MediMind — Product Demo</h1>
        <p className="fd-lede">
          A short walkthrough of MediMind, the AI-native EMR for Georgian
          clinicians. Shared privately for review.
        </p>

        <div className="fd-player-frame">
          <video
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
          />
        </div>
      </main>

      <footer className="fd-footer">
        <span>Confidential · Do not redistribute</span>
        <span>&copy; 2026 MediMind</span>
      </footer>
    </div>
  );
};

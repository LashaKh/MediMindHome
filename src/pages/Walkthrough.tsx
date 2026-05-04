import React, { useCallback, useEffect, useRef, useState } from "react";
import { scenes, TOTAL_MS, type Scene } from "./walkthroughScenes";
import "./Walkthrough.css";

const SESSION_KEY = "mm_briefing_access";
const CROSSFADE_MS = 600;
const MONTAGE_CROSSFADE_MS = 200;

function isMontage(s: Scene): s is Extract<Scene, { kind: "montage" }> {
  return s.kind === "montage";
}

export const Walkthrough: React.FC = () => {
  // ── Auth gate (mirrors deck.html line 17–24 + BriefingGate.tsx line 28) ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "1") return;
    if (!sessionStorage.getItem(SESSION_KEY)) {
      window.location.replace("/briefing");
    }
  }, []);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsedInScene, setElapsedInScene] = useState(0);
  const sceneStartRef = useRef<number>(Date.now());
  const elapsedAtPauseRef = useRef<number>(0);

  const scene = scenes[idx];
  const isLast = idx === scenes.length - 1;

  // ── Auto-advance + elapsed tracker ───────────────────────────────────
  useEffect(() => {
    sceneStartRef.current = Date.now() - elapsedAtPauseRef.current;
    if (paused) return;

    const tick = setInterval(() => {
      setElapsedInScene(Date.now() - sceneStartRef.current);
    }, 50);

    const remaining = scene.durationMs - elapsedAtPauseRef.current;
    const advance = setTimeout(() => {
      elapsedAtPauseRef.current = 0;
      setElapsedInScene(0);
      if (!isLast) setIdx((i) => i + 1);
    }, Math.max(0, remaining));

    return () => {
      clearInterval(tick);
      clearTimeout(advance);
    };
  }, [idx, paused, scene.durationMs, isLast]);

  // ── Controls ──────────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    setPaused((p) => {
      if (!p) {
        // pausing: snapshot elapsed
        elapsedAtPauseRef.current = Date.now() - sceneStartRef.current;
      }
      return !p;
    });
  }, []);

  const goPrev = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    setElapsedInScene(0);
    setIdx((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    setElapsedInScene(0);
    setIdx((i) => Math.min(scenes.length - 1, i + 1));
  }, []);

  // ── Keyboard ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePause();
      } else if (e.code === "ArrowRight") {
        goNext();
      } else if (e.code === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause, goNext, goPrev]);

  // ── Total elapsed across all scenes (for global progress bar) ────────
  const totalElapsedMs =
    scenes.slice(0, idx).reduce((a, s) => a + s.durationMs, 0) +
    Math.min(elapsedInScene, scene.durationMs);
  const progress = Math.min(100, (totalElapsedMs / TOTAL_MS) * 100);

  // ── Section title for cold-open montage (only on first montage shot) ──
  const sectionTitle =
    isMontage(scene) && "sectionTitle" in scene
      ? scene.sectionTitle
      : // Persist across all montage shots: look back to first montage scene's title.
        isMontage(scene)
        ? findMontageTitle()
        : null;

  return (
    <div
      className={`wt-stage ${isMontage(scene) ? "is-montage" : ""}`}
      onClick={togglePause}
    >
      <SceneFrame scene={scene} elapsed={elapsedInScene} />

      {sectionTitle && (
        <div className="wt-section-title" aria-live="polite">
          {sectionTitle}
        </div>
      )}

      {/* Bottom controls (don't trigger pause) */}
      <div className="wt-controls" onClick={(e) => e.stopPropagation()}>
        <button
          className="wt-btn"
          onClick={goPrev}
          aria-label="Previous scene"
          disabled={idx === 0}
        >
          ‹
        </button>
        <button
          className="wt-btn wt-play"
          onClick={togglePause}
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? "▶" : "❚❚"}
        </button>
        <button
          className="wt-btn"
          onClick={goNext}
          aria-label="Next scene"
          disabled={isLast}
        >
          ›
        </button>
        <div className="wt-progress" aria-hidden="true">
          <div className="wt-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

// Walk back through scenes to find the active montage's section title.
function findMontageTitle(): string | null {
  for (const s of scenes) {
    if (s.kind === "montage" && s.sectionTitle) return s.sectionTitle;
  }
  return null;
}

// Crossfade between image sources via stacked layers + opacity
// (background-image is not interpolatable; opacity is).
const CrossfadeImage: React.FC<{
  src: string;
  durationMs: number;
  className?: string;
  bgSize?: "contain" | "cover";
}> = ({ src, durationMs, className, bgSize = "contain" }) => {
  // Two ping-pong layers. The "active" one shows the latest src at opacity 1;
  // the other holds the previous src at opacity 0. On src change we put the
  // new src on the inactive layer and flip active.
  const [state, setState] = useState({ a: src, b: "", active: "a" as "a" | "b" });

  useEffect(() => {
    setState((prev) => {
      const currentSrc = prev.active === "a" ? prev.a : prev.b;
      if (currentSrc === src) return prev;
      const inactiveKey = prev.active === "a" ? "b" : "a";
      return { ...prev, [inactiveKey]: src, active: inactiveKey };
    });
  }, [src]);

  const layer = (key: "a" | "b", img: string) => (
    <div
      key={key}
      className="cf-layer"
      data-bg={bgSize}
      style={{
        backgroundImage: img ? `url("${img}")` : "none",
        opacity: state.active === key ? 1 : 0,
        transition: `opacity ${durationMs}ms ease`,
      }}
    />
  );

  return (
    <div className={`cf-stack ${className ?? ""}`} role="img" aria-label="">
      {layer("a", state.a)}
      {layer("b", state.b)}
    </div>
  );
};

// ── Scene renderer ─────────────────────────────────────────────────────
const SceneFrame: React.FC<{ scene: Scene; elapsed: number }> = ({
  scene,
  elapsed,
}) => {
  if (scene.kind === "montage") {
    return (
      <CrossfadeImage
        src={scene.image}
        durationMs={MONTAGE_CROSSFADE_MS}
        className="wt-frame wt-frame-montage"
        bgSize="cover"
      />
    );
  }

  if (scene.kind === "end") {
    return (
      <div className="wt-frame wt-end">
        <div className="wt-end-content">
          <h1 className="wt-end-title">{scene.title}</h1>
          <p className="wt-end-subtitle">{scene.subtitle}</p>
          <p className="wt-end-cta">{scene.cta}</p>
        </div>
        <div className="wt-end-tiles" aria-hidden="true">
          {scene.tiles.map((t, i) => (
            <div
              key={i}
              className="wt-end-tile"
              style={{ backgroundImage: `url("${t}")` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // anchor — hard-cut to secondary image partway through, if specified
  const showSecondary =
    scene.secondaryImage && scene.cutAtMs && elapsed >= scene.cutAtMs;
  const activeImage = showSecondary ? scene.secondaryImage! : scene.image;

  return (
    <div className="wt-frame wt-frame-anchor">
      <CrossfadeImage
        src={activeImage}
        durationMs={CROSSFADE_MS}
        className="wt-frame-image"
        bgSize="contain"
      />
      <div className="wt-frame-text">
        {scene.label && <div className="wt-label">{scene.label}</div>}
        <p className="wt-caption">{scene.caption}</p>
      </div>
    </div>
  );
};

export default Walkthrough;

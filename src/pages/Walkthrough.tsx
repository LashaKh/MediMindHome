import React, { useCallback, useEffect, useRef, useState } from "react";
import { scenes, TOTAL_MS, type Scene } from "./walkthroughScenes";
import "./Walkthrough.css";
import "./BriefingGate.css";

const WALKTHROUGH_SESSION_KEY = "mm_walkthrough_access";
const WALKTHROUGH_PASSWORD = "Y-Combinator";

const formatMs = (ms: number): string => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

// Map a total-timeline ms onto (sceneIdx, offsetWithinScene).
const findSceneAtMs = (totalMs: number) => {
  let acc = 0;
  for (let i = 0; i < scenes.length; i++) {
    const dur = scenes[i].durationMs;
    const end = acc + dur;
    const isLast = i === scenes.length - 1;
    if (totalMs < end || isLast) {
      const offset = Math.max(0, Math.min(dur - 1, totalMs - acc));
      return { idx: i, offset };
    }
    acc = end;
  }
  return { idx: 0, offset: 0 };
};

// ── Top-level: gate decision. Renders the password panel until unlocked. ─
export const Walkthrough: React.FC = () => {
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "1") return true;
    try {
      return sessionStorage.getItem(WALKTHROUGH_SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (!authed) {
    return <WalkthroughGate onUnlock={() => setAuthed(true)} />;
  }
  return <Player />;
};

// ── Player: the original walkthrough UI. Runs only after the gate passes. ─
const Player: React.FC = () => {
  const [idx, setIdx] = useState(0);
  // Start paused — user must click play to begin. Avoids autoplay surprise on refresh.
  const [paused, setPaused] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [elapsedInScene, setElapsedInScene] = useState(0);
  const [seekToken, setSeekToken] = useState(0);
  const [theater, setTheater] = useState(false);
  const sceneStartRef = useRef<number>(Date.now());
  const elapsedAtPauseRef = useRef<number>(0);

  const scene = scenes[idx];
  const isLast = idx === scenes.length - 1;
  const effectivePaused = paused || scrubbing;

  // ── Auto-advance + elapsed tracker ───────────────────────────────────
  useEffect(() => {
    sceneStartRef.current = Date.now() - elapsedAtPauseRef.current;
    if (effectivePaused) return;

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
  }, [idx, effectivePaused, scene.durationMs, isLast]);

  const togglePause = useCallback(() => {
    setPaused((p) => {
      if (!p) elapsedAtPauseRef.current = Date.now() - sceneStartRef.current;
      return !p;
    });
  }, []);

  const goPrev = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    setElapsedInScene(0);
    setIdx((i) => Math.max(0, i - 1));
    setSeekToken((t) => t + 1);
  }, []);

  const goNext = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    setElapsedInScene(0);
    setIdx((i) => Math.min(scenes.length - 1, i + 1));
    setSeekToken((t) => t + 1);
  }, []);

  const jumpTo = useCallback((target: number) => {
    elapsedAtPauseRef.current = 0;
    setElapsedInScene(0);
    setIdx(target);
    setSeekToken((t) => t + 1);
  }, []);

  // Seek to a point on the global timeline (across all scenes).
  const seekToTotal = useCallback((totalMs: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_MS - 1, totalMs));
    const { idx: targetIdx, offset } = findSceneAtMs(clamped);
    elapsedAtPauseRef.current = offset;
    setElapsedInScene(offset);
    setIdx((curr) => (curr === targetIdx ? curr : targetIdx));
    setSeekToken((t) => t + 1);
  }, []);

  const toggleTheater = useCallback(() => setTheater((t) => !t), []);

  // Audio (narration) ended — on the last scene, freeze the engine so the
  // looping video stops too and the player visibly arrives at "the end".
  // For non-last scenes the auto-advance timer handles the transition;
  // VideoColumn pauses the looping video element on the same event.
  const handleAudioEnded = useCallback(() => {
    if (idx === scenes.length - 1) {
      elapsedAtPauseRef.current = scene.durationMs;
      setElapsedInScene(scene.durationMs);
      setPaused(true);
    }
  }, [idx, scene.durationMs]);

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
      } else if (e.code === "Escape" && theater) {
        setTheater(false);
      } else if (e.key === "f" || e.key === "F") {
        toggleTheater();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause, goNext, goPrev, theater, toggleTheater]);

  const totalElapsedMs =
    scenes.slice(0, idx).reduce((a, s) => a + s.durationMs, 0) +
    Math.min(elapsedInScene, scene.durationMs);
  const sceneProgress = Math.min(
    100,
    (Math.min(elapsedInScene, scene.durationMs) / scene.durationMs) * 100,
  );

  return (
    <div
      className={`wt-stage ${theater ? "is-theater" : ""}`}
      onClick={togglePause}
    >
      <TopBar idx={idx} total={scenes.length} scene={scene} />

      <SceneFrame
        scene={scene}
        paused={effectivePaused}
        sceneProgress={sceneProgress}
        scenes={scenes}
        idx={idx}
        seekToken={seekToken}
        seekOffsetMs={elapsedInScene}
        onJump={jumpTo}
        theater={theater}
        onToggleTheater={toggleTheater}
        onAudioEnded={handleAudioEnded}
      />

      <div className="wt-controls" onClick={(e) => e.stopPropagation()}>
        <button
          className="wt-btn"
          onClick={goPrev}
          aria-label="Previous chapter"
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
          aria-label="Next chapter"
          disabled={isLast}
        >
          ›
        </button>
        <span className="wt-time wt-time-now">{formatMs(totalElapsedMs)}</span>
        <Scrubber
          totalElapsedMs={totalElapsedMs}
          totalMs={TOTAL_MS}
          scenes={scenes}
          onSeek={seekToTotal}
          onSeekStart={() => setScrubbing(true)}
          onSeekEnd={() => setScrubbing(false)}
        />
        <span className="wt-time wt-time-end">{formatMs(TOTAL_MS)}</span>
      </div>
    </div>
  );
};

// ── Scrubber: click + drag + hover with chapter ticks and tooltip ──────
const Scrubber: React.FC<{
  totalElapsedMs: number;
  totalMs: number;
  scenes: Scene[];
  onSeek: (totalMs: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}> = ({ totalElapsedMs, totalMs, scenes, onSeek, onSeekStart, onSeekEnd }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const pctFromEvent = (clientX: number): number => {
    const r = railRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return 0;
    const p = (clientX - r.left) / r.width;
    return Math.max(0, Math.min(1, p));
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    railRef.current?.setPointerCapture(e.pointerId);
    setIsScrubbing(true);
    onSeekStart();
    const p = pctFromEvent(e.clientX);
    setHoverPct(p);
    onSeek(p * totalMs);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const p = pctFromEvent(e.clientX);
    setHoverPct(p);
    if (isScrubbing) onSeek(p * totalMs);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (railRef.current?.hasPointerCapture(e.pointerId)) {
      railRef.current.releasePointerCapture(e.pointerId);
    }
    if (isScrubbing) {
      setIsScrubbing(false);
      onSeekEnd();
    }
  };

  const onPointerLeave = () => {
    if (!isScrubbing) setHoverPct(null);
  };

  const fillPct = (totalElapsedMs / totalMs) * 100;
  const hoverMs = hoverPct != null ? hoverPct * totalMs : null;
  const hoverScene =
    hoverMs != null ? scenes[findSceneAtMs(hoverMs).idx] : null;

  // Cumulative chapter boundaries → tick % positions (skip 0% and 100%).
  const ticks: number[] = [];
  let acc = 0;
  for (let i = 0; i < scenes.length - 1; i++) {
    acc += scenes[i].durationMs;
    ticks.push((acc / totalMs) * 100);
  }

  return (
    <div
      ref={railRef}
      className={`wt-scrubber ${isScrubbing ? "is-scrubbing" : ""} ${hoverPct != null ? "is-hover" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      role="slider"
      aria-label="Walkthrough timeline"
      aria-valuemin={0}
      aria-valuemax={Math.round(totalMs)}
      aria-valuenow={Math.round(totalElapsedMs)}
      tabIndex={0}
    >
      <div className="wt-scrubber-track">
        {hoverPct != null && (
          <div
            className="wt-scrubber-ghost"
            style={{ width: `${hoverPct * 100}%` }}
          />
        )}
        <div className="wt-scrubber-fill" style={{ width: `${fillPct}%` }} />
        {ticks.map((t, i) => (
          <span
            key={i}
            className="wt-scrubber-tick"
            style={{ left: `${t}%` }}
            aria-hidden="true"
          />
        ))}
        <div
          className="wt-scrubber-thumb"
          style={{ left: `${fillPct}%` }}
          aria-hidden="true"
        />
      </div>
      {hoverPct != null && hoverScene && hoverMs != null && (
        <div
          className="wt-scrubber-tooltip"
          style={{ left: `${hoverPct * 100}%` }}
        >
          <span className="wt-tt-chap">Ch {hoverScene.chapter.number}</span>
          <span className="wt-tt-divider" />
          <span className="wt-tt-time">{formatMs(hoverMs)}</span>
        </div>
      )}
    </div>
  );
};

// ── Top brand strip + scene counter ────────────────────────────────────
const TopBar: React.FC<{ idx: number; total: number; scene: Scene }> = ({
  idx,
  total,
  scene,
}) => {
  const counter = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="wt-topbar" onClick={(e) => e.stopPropagation()}>
      <div className="wt-topbar-left">
        <span className="wt-brand">MediMind</span>
        <span className="wt-topbar-sep" aria-hidden="true" />
        <span className="wt-topbar-eyebrow">Live Walkthrough</span>
      </div>
      <div className="wt-topbar-right">
        <span className="wt-topbar-chapter">{scene.chapter.title}</span>
        <span className="wt-topbar-sep" aria-hidden="true" />
        <span className="wt-counter">
          <span className="wt-counter-now">{counter(idx + 1)}</span>
          <span className="wt-counter-divider">/</span>
          <span className="wt-counter-total">{counter(total)}</span>
        </span>
      </div>
    </div>
  );
};

// ── Scene renderer ─────────────────────────────────────────────────────
const SceneFrame: React.FC<{
  scene: Scene;
  paused: boolean;
  sceneProgress: number;
  scenes: Scene[];
  idx: number;
  seekToken: number;
  seekOffsetMs: number;
  onJump: (i: number) => void;
  theater: boolean;
  onToggleTheater: () => void;
  onAudioEnded: () => void;
}> = (props) => (
  <div className="wt-frame wt-frame-anchor">
    <VideoColumn {...props} />
    <NotesRail scene={props.scene} />
  </div>
);

// ── Left: video stack ───────────────────────────────────────────────────
const VideoColumn: React.FC<{
  scene: Scene;
  paused: boolean;
  sceneProgress: number;
  scenes: Scene[];
  idx: number;
  seekToken: number;
  seekOffsetMs: number;
  onJump: (i: number) => void;
  theater: boolean;
  onToggleTheater: () => void;
  onAudioEnded: () => void;
}> = ({ scene, paused, sceneProgress, scenes, idx, seekToken, seekOffsetMs, onJump, theater, onToggleTheater, onAudioEnded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync media currentTime to the requested offset on:
  //   - scene change (offset will normally be 0 or the seek-target)
  //   - in-scene seek (token bumps even if scene didn't change)
  useEffect(() => {
    const t = Math.max(0, seekOffsetMs / 1000);
    const v = videoRef.current;
    const a = audioRef.current;
    if (v) {
      try { v.currentTime = t; } catch { /* ignore — load may not be ready */ }
    }
    if (a) {
      try { a.currentTime = t; } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.video, scene.audio, seekToken]);

  // Pause/resume in sync with the scene engine.
  // scene.video / scene.audio are in deps so that when auto-advance swaps the
  // src (which resets and pauses the element by spec), we re-issue play().
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (paused) {
      v?.pause();
      a?.pause();
    } else {
      v?.play().catch(() => {});
      a?.play().catch(() => {});
    }
  }, [paused, seekToken, scene.video, scene.audio]);

  return (
    <div className="wt-video-column">
      <div className="wt-chapter-eyebrow">
        <span className="wt-chapter-tag">Chapter {scene.chapter.number}</span>
        <span className="wt-chapter-dot" aria-hidden="true" />
        <span className="wt-chapter-time">{scene.chapter.duration}</span>
      </div>

      <div className="wt-browser">
        <div className="wt-browser-chrome">
          <span className="wt-traffic">
            <i className="wt-traffic-dot" data-c="r" />
            <i className="wt-traffic-dot" data-c="y" />
            <i className="wt-traffic-dot" data-c="g" />
          </span>
          <span className="wt-url">
            <span className="wt-url-secure" aria-hidden="true">⌂</span>
            <span className="wt-url-host">app.medimind.md</span>
            <span className="wt-url-path">/{scene.chapter.slug}</span>
          </span>
          <button
            type="button"
            className="wt-cinema-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleTheater();
            }}
            aria-label={theater ? "Exit theater mode" : "Theater mode"}
            title={theater ? "Exit theater mode (Esc)" : "Theater mode (F)"}
          >
            {theater ? (
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6.5 2.5v4h-4 M9.5 2.5v4h4 M6.5 13.5v-4h-4 M9.5 13.5v-4h4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2.5 6.5v-4h4 M13.5 6.5v-4h-4 M2.5 9.5v4h4 M13.5 9.5v4h-4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="wt-video-card">
          <video
            ref={videoRef}
            src={scene.video}
            muted
            loop
            playsInline
            className="wt-video"
          />
          {scene.audio && (
            <audio
              ref={audioRef}
              src={scene.audio}
              preload="auto"
              onEnded={() => {
                // Stop the looping video at the same instant narration ends.
                videoRef.current?.pause();
                onAudioEnded();
              }}
            />
          )}
          <div
            className="wt-video-progress"
            aria-hidden="true"
            style={{ width: `${sceneProgress}%` }}
          />
        </div>
      </div>

      <div
        className="wt-stepper"
        role="tablist"
        aria-label="Walkthrough chapters"
        onClick={(e) => e.stopPropagation()}
      >
        {scenes.map((s, i) => {
          const state = i < idx ? "done" : i === idx ? "active" : "upcoming";
          return (
            <button
              key={s.chapter.number}
              type="button"
              role="tab"
              aria-selected={i === idx}
              className={`wt-step wt-step--${state}`}
              onClick={() => onJump(i)}
            >
              <span className="wt-step-num">{s.chapter.number}</span>
              <span className="wt-step-title">{s.chapter.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Right: notes rail ───────────────────────────────────────────────────
const NotesRail: React.FC<{ scene: Scene }> = ({ scene }) => {
  const features = (scene.notes.bullets ?? []).map((raw) => {
    const i = raw.indexOf(" — ");
    if (i === -1) return { label: raw, body: "" };
    return { label: raw.slice(0, i), body: raw.slice(i + 3) };
  });

  return (
    <div className="wt-frame-text wt-rail">
      <div className="wt-rail-watermark" aria-hidden="true">
        {scene.chapter.number}
      </div>
      <h2 className="wt-rail-title">{scene.notes.title}</h2>
      {scene.notes.subtitle && (
        <p className="wt-rail-subtitle">{scene.notes.subtitle}</p>
      )}
      {features.length > 0 && (
        <ol className="wt-features">
          {features.map((f, i) => (
            <li
              key={i}
              className="wt-feature"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="wt-feature-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="wt-feature-body">
                <span className="wt-feature-label">{f.label}</span>
                {f.body && <span className="wt-feature-text">{f.body}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

// ── Password gate (mirrors BriefingGate visual language) ────────────────
const WalkthroughGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [helperText, setHelperText] = useState(
    "Single-use, encrypted access. Verified against your invitation.",
  );
  const [helperKind, setHelperKind] = useState<"normal" | "error" | "success">(
    "normal",
  );
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!matchMedia("(max-width: 640px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;

    const trimmed = value.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
      return;
    }

    setPending(true);
    setHelperKind("normal");
    setHelperText("Verifying…");
    // Brief delay so the verifying state is perceivable.
    await new Promise((r) => setTimeout(r, 320));

    if (trimmed.toLowerCase() === WALKTHROUGH_PASSWORD.toLowerCase()) {
      setHelperKind("success");
      setHelperText("Welcome — entering walkthrough…");
      try {
        sessionStorage.setItem(WALKTHROUGH_SESSION_KEY, "1");
      } catch {/* ignore */}
      setTimeout(() => onUnlock(), 600);
      return;
    }

    setPending(false);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setValue("");
    inputRef.current?.focus();
    setHelperKind("error");
    setHelperText("That access code does not match.");
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
          <div className="session-tag">Encrypted Session</div>
        </header>

        <main className="center">
          <section
            className={`card ${shake ? "shake" : ""}`}
            role="dialog"
            aria-labelledby="wtCardTitle"
          >
            <div className="eyebrow">Live Product Walkthrough</div>
            <h1 className="title" id="wtCardTitle">By invitation only.</h1>
            <p className="lede">
              This walkthrough is shared with a select group of partners.
              Please enter your access code to continue.
            </p>

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="field">
                <label className="field-label" htmlFor="wt-access">
                  Access Code
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="wt-access"
                  name="wt-access"
                  placeholder="Provided with your invitation"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  disabled={pending}
                />
              </div>

              <button type="submit" className="submit" disabled={pending}>
                {pending ? (
                  "Verifying…"
                ) : (
                  <>
                    <span>Enter Walkthrough</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <div
                className={`helper ${helperKind}`}
                role="status"
                aria-live="polite"
              >
                {helperText}
              </div>
            </form>
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

export default Walkthrough;

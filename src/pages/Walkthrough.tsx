import React, { useCallback, useEffect, useRef, useState } from "react";
import { scenes, TOTAL_MS, type Scene } from "./walkthroughScenes";
import "./Walkthrough.css";

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

// Swap the English chapter/notes strings for their Georgian twins when lang==="ka".
// Preserves every other field (timing, video, slug) so the playback engine is unaffected.
const localizeScene = (s: Scene, lang: "en" | "ka"): Scene =>
  lang === "ka" && s.ka
    ? {
        ...s,
        chapter: { ...s.chapter, title: s.ka.chapterTitle },
        notes: {
          ...s.notes,
          title: s.ka.notesTitle,
          subtitle: s.ka.notesSubtitle ?? s.notes.subtitle,
          bullets: s.ka.notesBullets ?? s.notes.bullets,
        },
      }
    : s;

export const Walkthrough: React.FC = () => <Player />;

// ── Player: the original walkthrough UI. Runs only after the gate passes. ─
const Player: React.FC = () => {
  const [idx, setIdx] = useState(0);
  // Start paused — user must click play to begin. Avoids autoplay surprise on refresh.
  const [paused, setPaused] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [elapsedInScene, setElapsedInScene] = useState(0);
  const [seekToken, setSeekToken] = useState(0);
  const [theater, setTheater] = useState(false);
  // Narration volume + mute. Persisted to localStorage so the choice survives
  // chapter changes, reloads, and carries across both deck embeds (same origin).
  const [volume, setVolume] = useState(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("mm_wt_volume") : null;
    return v !== null ? Number(v) : 1;
  });
  const [muted, setMuted] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("mm_wt_muted") === "1",
  );
  const [lang, setLang] = useState<"en" | "ka">(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("lang") === "ka"
      ? "ka"
      : "en",
  );
  const sceneStartRef = useRef<number>(Date.now());
  const elapsedAtPauseRef = useRef<number>(0);

  const scene = localizeScene(scenes[idx], lang);
  const displayScenes =
    lang === "ka" ? scenes.map((s) => localizeScene(s, lang)) : scenes;
  const isLast = idx === scenes.length - 1;
  const effectivePaused = paused || scrubbing;

  useEffect(() => {
    localStorage.setItem("mm_wt_volume", String(volume));
    localStorage.setItem("mm_wt_muted", muted ? "1" : "0");
  }, [volume, muted]);

  // Speaker click: toggle mute. If unmuting while volume sits at 0, nudge it up
  // so a single click actually restores audible sound.
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (m) setVolume((v) => (v === 0 ? 0.6 : v));
      return !m;
    });
  }, []);

  const onVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (v > 0) setMuted(false);
  }, []);

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

  // ── Language sync with the parent deck (when embedded as an iframe) ────
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (d && d.type === "mm-lang" && (d.lang === "en" || d.lang === "ka")) {
        setLang(d.lang);
      }
    };
    window.addEventListener("message", onMsg);
    // Announce readiness so the deck replies with the current language.
    try {
      window.parent?.postMessage({ type: "mm-wt-ready" }, "*");
    } catch {
      /* not embedded */
    }
    return () => window.removeEventListener("message", onMsg);
  }, []);

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
        lang={lang}
        paused={effectivePaused}
        sceneProgress={sceneProgress}
        scenes={displayScenes}
        idx={idx}
        seekToken={seekToken}
        seekOffsetMs={elapsedInScene}
        onJump={jumpTo}
        theater={theater}
        onToggleTheater={toggleTheater}
        onAudioEnded={handleAudioEnded}
        volume={volume}
        muted={muted}
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
          lang={lang}
          onSeek={seekToTotal}
          onSeekStart={() => setScrubbing(true)}
          onSeekEnd={() => setScrubbing(false)}
        />
        <span className="wt-time wt-time-end">{formatMs(TOTAL_MS)}</span>
        <div className="wt-volume" onClick={(e) => e.stopPropagation()}>
          <button
            className="wt-btn wt-mute"
            onClick={toggleMute}
            aria-label={muted || volume === 0 ? "Unmute narration" : "Mute narration"}
            title={muted || volume === 0 ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M11 5 6 9H3v6h3l5 4V5z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m22 9-6 6M16 9l6 6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M11 5 6 9H3v6h3l5 4V5z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 9a3.5 3.5 0 0 1 0 6M19 6.5a7 7 0 0 1 0 11"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <input
            type="range"
            className="wt-volume-slider"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.currentTarget.value))}
            aria-label="Narration volume"
          />
        </div>
      </div>
    </div>
  );
};

// ── Scrubber: click + drag + hover with chapter ticks and tooltip ──────
const Scrubber: React.FC<{
  totalElapsedMs: number;
  totalMs: number;
  scenes: Scene[];
  lang: "en" | "ka";
  onSeek: (totalMs: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}> = ({ totalElapsedMs, totalMs, scenes, lang, onSeek, onSeekStart, onSeekEnd }) => {
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
          <span className="wt-tt-chap">{lang === "ka" ? "თ." : "Ch"} {hoverScene.chapter.number}</span>
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
  lang: "en" | "ka";
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
  volume: number;
  muted: boolean;
}> = (props) => (
  <div className="wt-frame wt-frame-anchor">
    <VideoColumn {...props} />
    <NotesRail scene={props.scene} />
  </div>
);

// ── Left: video stack ───────────────────────────────────────────────────
const VideoColumn: React.FC<{
  scene: Scene;
  lang: "en" | "ka";
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
  volume: number;
  muted: boolean;
}> = ({ scene, lang, paused, sceneProgress, scenes, idx, seekToken, seekOffsetMs, onJump, theater, onToggleTheater, onAudioEnded, volume, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Apply narration volume / mute. scene.audio in deps so a freshly-swapped
  // track (on auto-advance) inherits the current setting.
  useEffect(() => {
    const a = audioRef.current;
    if (a) {
      a.volume = volume;
      a.muted = muted;
    }
  }, [volume, muted, scene.audio]);

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
        <span className="wt-chapter-tag">{lang === "ka" ? "თავი" : "Chapter"} {scene.chapter.number}</span>
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

export default Walkthrough;

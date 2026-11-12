import React, { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import { cn } from '../../utils/cn';
import { orchestrationContent as c } from '../../content/landing.v2.a';

/**
 * The living hospital: one patient arrives, work fans out to seven
 * departments, each receives a prepared step (system blue) and then waits for,
 * and receives, a person's sign-off (amber). The system moves; people are still.
 *
 * - One clock drives everything; React re-renders only when a step changes
 *   state (a few times per second at most). Transform, opacity and SVG dash
 *   offsets only.
 * - The clock runs only while the panel is on screen and the tab is visible;
 *   the pause button freezes it exactly where it is.
 * - prefers-reduced-motion: a complete static frame (all prepared, five signed,
 *   two awaiting a person), no pulses, no pause button.
 * - Fixed geometry per breakpoint, so nothing shifts while it runs.
 *   md and up: patient on the left, a fan of paths, seven rows on the right.
 *   Phones: patient on top, a trunk down the left, seven rows.
 * The parent gives it its height (see HeroSection) and lazy-loads it.
 */

type StepState = 'idle' | 'preparing' | 'ready' | 'signed';

const LOOP_MS = 12800;
const TRUNK_AT = 500;
const prepAt = (i: number) => 900 + i * 240;
const PREP_MS = 1300;
/** People sign at their own pace, not in list order. */
const SIGN_ORDER = [0, 3, 1, 5, 2, 6, 4];
const signAt = (k: number) => 4300 + k * 620;
const RESET_AT = 11700;
/** The reduced-motion frame: five signed, two waiting for a person. */
const STATIC_MS = signAt(4) + 200;

const ROWS = c.steps.length;
/** md+ geometry, in px: row height and the fan's vertical extent. */
const ROW_H = 52;
const FAN_H = ROW_H * ROWS;

const stateAt = (t: number, i: number): StepState => {
  if (t >= RESET_AT) return 'idle';
  if (t >= signAt(SIGN_ORDER.indexOf(i))) return 'signed';
  if (t >= prepAt(i) + PREP_MS) return 'ready';
  if (t >= prepAt(i)) return 'preparing';
  return 'idle';
};

const frameAt = (t: number) => ({
  states: c.steps.map((_, i) => stateAt(t, i)),
  arrived: t < RESET_AT,
  trunk: t >= TRUNK_AT && t < RESET_AT,
  ping: t < 1600,
});

const keyOf = (t: number) => {
  const f = frameAt(t);
  return `${f.states.join()}|${f.arrived}|${f.trunk}|${f.ping}`;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const useReducedMotion = () => {
  const [reduce, setReduce] = useState(prefersReducedMotion);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const onChange = () => setReduce(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduce;
};

/** md+ fan path from the patient (left, vertical centre) to row i (right). */
const fanPath = (i: number) => {
  const y0 = FAN_H / 2;
  const y1 = ROW_H * i + ROW_H / 2;
  return `M0 ${y0} C 55 ${y0}, 45 ${y1}, 100 ${y1}`;
};

const StatusCell: React.FC<{ state: StepState; waiting: string; signed: string }> = ({ state, waiting, signed }) => (
  <span className="relative block h-5 w-[9.75rem] shrink-0 md:w-[11rem]">
    <span
      className={cn(
        'absolute inset-0 flex items-center justify-end gap-2 text-mm-link transition-opacity duration-300',
        state === 'preparing' ? 'opacity-100' : 'opacity-0'
      )}
    >
      {c.preparing}
      <span className="relative flex h-2 w-2">
        <span className="mm-orch-ping absolute inset-0 rounded-full border border-mm-system" />
        <span className="relative h-2 w-2 rounded-full border-[1.5px] border-mm-system" />
      </span>
    </span>
    <span
      className={cn(
        'absolute inset-0 flex items-center justify-end gap-2 whitespace-nowrap text-mm-human-text transition-opacity duration-300',
        state === 'ready' ? 'opacity-100' : 'opacity-0'
      )}
    >
      {waiting}
      <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-mm-human" />
    </span>
    <span
      className={cn(
        'absolute inset-0 flex items-center justify-end gap-2 whitespace-nowrap font-medium text-mm-human-text transition-opacity duration-300',
        state === 'signed' ? 'opacity-100' : 'opacity-0'
      )}
    >
      {signed}
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-mm-human">
        <Check className="h-2.5 w-2.5 text-mm-human-fg" strokeWidth={3.5} aria-hidden="true" />
      </span>
    </span>
  </span>
);

const nodeClass: Record<StepState, string> = {
  idle: 'border-mm-line bg-mm-surface',
  preparing: 'border-mm-system bg-mm-surface',
  ready: 'border-mm-human bg-mm-surface',
  signed: 'border-mm-human bg-mm-human',
};

export const HeroOrchestration: React.FC<{ className?: string }> = ({ className }) => {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [t, setT] = useState(() => (prefersReducedMotion() ? STATIC_MS : 0));
  const elapsed = useRef(0);
  const lastKey = useRef(keyOf(0));
  const rootRef = useRef<HTMLElement>(null);

  // Run the clock only while the panel is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) {
      setT(STATIC_MS);
      return;
    }
    if (!playing || !inView) return;
    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      elapsed.current = (elapsed.current + Math.min(now - last, 100)) % LOOP_MS;
      last = now;
      const key = keyOf(elapsed.current);
      if (key !== lastKey.current) {
        lastKey.current = key;
        setT(elapsed.current);
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [reduce, playing, inView]);

  const f = frameAt(t);
  const prepared = f.states.filter((s) => s === 'ready' || s === 'signed').length;
  const decided = f.states.filter((s) => s === 'signed').length;
  const moving = !reduce && playing;
  const progress = f.states.filter((s) => s !== 'idle').length / ROWS;

  return (
    <figure
      ref={rootRef}
      aria-labelledby="hero-orch-summary"
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-[18px] border border-mm-line',
        !moving && 'mm-orch-paused',
        className
      )}
      style={{ background: 'linear-gradient(180deg, var(--mm-raised) 0%, var(--mm-surface) 100%)' }}
    >
      <figcaption id="hero-orch-summary" className="sr-only">
        {c.summary}
      </figcaption>

      {/* Top bar: what this is, the honesty marker, pause. */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-mm-line pl-4 pr-1">
        <p className="mm-data flex min-w-0 items-center gap-2.5 text-mm-body" aria-hidden="true">
          <span className="relative flex h-2 w-2 shrink-0">
            {moving && <span className="mm-orch-ping absolute inset-0 rounded-full bg-mm-system" />}
            <span className="relative h-2 w-2 rounded-full bg-mm-system" />
          </span>
          <span className="truncate sm:hidden">{c.titleShort}</span>
          <span className="hidden truncate sm:inline">{c.title}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <span className="mm-dev-badge">{c.devBadge}</span>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? c.pauseLabel : c.playLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-mm-body transition-colors hover:bg-mm-tint hover:text-mm-ink"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>

      {/* Body. Decorative motion over the meaning in the figcaption. */}
      <div className="relative flex-1 px-4 py-4 md:grid md:grid-cols-[25%_15%_1fr] md:px-5 md:py-5" aria-hidden="true">
        {/* Patient. Phones: a row on top. md+: centred in the left column, with the trunk to the fan. */}
        <div className="relative flex h-10 items-center gap-3 md:h-full md:flex-col md:items-start md:justify-center md:gap-0">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center md:h-14 md:w-14">
            {f.ping && moving && <span className="mm-orch-ping-slow absolute inset-0 rounded-full border border-mm-system" />}
            <span
              className={cn(
                'absolute inset-0 rounded-full border transition-colors duration-500',
                f.arrived ? 'border-mm-system' : 'border-mm-line'
              )}
            />
            <span className={cn('h-2.5 w-2.5 rounded-full transition-colors duration-500', f.arrived ? 'bg-mm-ink' : 'bg-mm-line')} />
          </div>
          {/* md+: the trunk from the patient to where the fan starts. */}
          <span className="absolute left-14 right-0 top-1/2 hidden h-px bg-mm-line md:block">
            <span
              className={cn(
                'absolute inset-0 origin-left bg-mm-system transition-transform duration-500 ease-out',
                f.trunk ? 'scale-x-100' : 'scale-x-0'
              )}
            />
          </span>
          <div className="min-w-0 md:absolute md:left-0 md:right-2 md:top-[calc(50%+2.25rem)]">
            <p className="mm-data flex flex-wrap items-baseline gap-x-2 text-mm-muted">
              <span className="text-mm-ink">{c.patientTime}</span>
              <span>{c.patientLabel}</span>
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-mm-body">{c.patientDetail}</p>
          </div>
        </div>

        {/* md+: the fan. Stretched to the column, strokes stay 1px. */}
        <svg
          className="hidden h-[364px] w-full self-center md:block"
          viewBox={`0 0 100 ${FAN_H}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {c.steps.map((step, i) => {
            const s = f.states[i];
            return (
              <g key={step.id}>
                <path d={fanPath(i)} stroke="var(--mm-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path
                  d={fanPath(i)}
                  stroke="var(--mm-system)"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                  className="transition-opacity duration-500"
                  opacity={s === 'ready' || s === 'signed' ? 0.55 : 0}
                />
                {s === 'preparing' && (
                  <path
                    d={fanPath(i)}
                    pathLength={1}
                    stroke="var(--mm-system)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="mm-orch-travel"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Phones: the trunk down the left, filling as departments receive work. */}
        <span className="absolute bottom-[46px] left-[36px] top-[36px] w-px bg-mm-line md:hidden">
          <span
            className="absolute inset-0 origin-top bg-mm-system transition-transform duration-700 ease-out"
            style={{ transform: `scaleY(${progress})` }}
          />
        </span>

        {/* The seven departments. */}
        <ol className="mt-4 divide-y divide-mm-line md:mt-0 md:self-center">
          {c.steps.map((step, i) => {
            const s = f.states[i];
            return (
              <li key={step.id} className="relative flex h-[60px] flex-col justify-center pl-10 md:h-[52px] md:pl-5">
                {/* Phones: branch from the trunk. */}
                <span
                  className={cn(
                    'absolute left-[20px] top-1/2 h-px w-[14px] transition-colors duration-300 md:hidden',
                    s === 'idle' ? 'bg-mm-line' : 'bg-mm-system'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-[20px] top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] transition-colors duration-300 md:left-0',
                    nodeClass[s]
                  )}
                />
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate text-[14px] font-semibold leading-5 text-mm-ink">{step.name}</span>
                  <span className="mm-data text-[11.5px] md:text-[12px]">
                    <StatusCell state={s} waiting={step.waiting} signed={step.signed} />
                  </span>
                </span>
                <span className="relative mt-0.5 block h-[18px]">
                  <span
                    className={cn(
                      'absolute left-0 top-[7px] h-1 w-24 rounded-full bg-mm-line transition-opacity duration-300',
                      s === 'idle' ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span
                    className={cn(
                      'mm-data absolute inset-0 truncate text-[12px] leading-[18px] transition-[opacity,color] duration-300 md:text-[12.5px]',
                      s === 'idle' ? 'opacity-0' : 'opacity-100',
                      s === 'preparing' ? 'text-mm-link' : 'text-mm-body'
                    )}
                  >
                    {step.prepared}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Bottom bar: what the system prepared, what people decided. */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-t border-mm-line px-4" aria-hidden="true">
        <span className="mm-mark-system text-[12px]">
          <span className="hidden sm:inline">{c.footerSystem}</span>
          <span className="sm:hidden">{c.footerSystemShort}</span>
          <span className="tabular-nums text-mm-ink">{prepared}/{ROWS}</span>
        </span>
        <span className="mm-mark-human text-[12px]">
          <span className="hidden sm:inline">{c.footerHuman}</span>
          <span className="sm:hidden">{c.footerHumanShort}</span>
          <span className="tabular-nums text-mm-ink">{decided}/{ROWS}</span>
        </span>
      </div>
    </figure>
  );
};

export default HeroOrchestration;

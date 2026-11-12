import React, { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import { cn } from '../../utils/cn';
import { orchestrationContent as c, type DepartmentId } from '../../content/landing.v2.a';

/**
 * The living hospital, seen from mission control. One patient arrives; light
 * travels out along seven paths to departments placed across the canvas; each
 * department receives a prepared step (system blue) and then a named person
 * decides (amber). The system moves; people are still.
 *
 * Timing: the whole hospital moves once in about seven seconds, rests in its
 * final state, fades and replays. One clock drives everything; React re-renders
 * only when something visible changes. Transform, opacity and SVG dash offsets
 * only. The clock runs only while the visual is on screen and the tab is
 * visible; the pause button freezes it where it is.
 *
 * Two designed forms, fixed heights (the parent sizes the box, see HeroSection):
 *   lg and up  a wide canvas: patient left, a fan of light paths, departments
 *              at different depths across the canvas, a quiet readout on top.
 *   below lg   a vertical form: patient on top, a trunk down the left, seven
 *              departments, readout above and counters below.
 * prefers-reduced-motion: one complete static frame (all prepared, five signed,
 * two awaiting a person), no pulses, no pause button.
 */

type StepState = 'idle' | 'sending' | 'ready' | 'signed';

// ---------------------------------------------------------------- Timeline (ms)

const LOOP_MS = 15000;
const SETTLED_AT = 7000; // everything has happened by here
const FADE_AT = 13600; // rest until here, then fade and replay
const dispatchAt = (i: number) => 450 + i * 210;
/** People sign at their own pace, not in list order. */
const SIGN_ORDER = [0, 3, 1, 5, 2, 6, 4];
const signAt = (k: number) => 3500 + k * 540;
/** The reduced-motion frame: five signed, two waiting for a person. */
const STATIC_MS = signAt(4) + 120;

// ---------------------------------------------------------------- Canvas geometry (lg+)

/** Canvas height in px (fixed); x is in per-mille of the width, y in px. */
const CANVAS_H = 386;
const LANE_Y0 = 22;
const LANE_GAP = 52;
const PATIENT_X = 150;
const BEND_END_X = 300;
/**
 * Lanes top to bottom: each department's depth across the canvas (per-mille).
 * Triage sits on the patient's axis, nearest; the rest spread out so no path
 * crosses another department's label.
 */
const LANES: { id: DepartmentId; x: number }[] = [
  { id: 'billing', x: 730 },
  { id: 'lab', x: 500 },
  { id: 'imaging', x: 640 },
  { id: 'triage', x: 350 },
  { id: 'pharmacy', x: 560 },
  { id: 'beds', x: 430 },
  { id: 'ministry', x: 780 },
];
const laneOf = (id: DepartmentId) => LANES.findIndex((l) => l.id === id);
const laneY = (lane: number) => LANE_Y0 + lane * LANE_GAP;
const PATIENT_Y = laneY(3);

const pathFor = (lane: number) => {
  const { x } = LANES[lane];
  const y = laneY(lane);
  if (y === PATIENT_Y) return `M${PATIENT_X} ${y} L${x} ${y}`;
  return `M${PATIENT_X} ${PATIENT_Y} C ${PATIENT_X + 80} ${PATIENT_Y}, ${BEND_END_X - 80} ${y}, ${BEND_END_X} ${y} L${x} ${y}`;
};
/** Light travels at one speed: farther departments receive their work later. */
const travelMs = (lane: number) => 420 + (LANES[lane].x - PATIENT_X) * 1.05;

// ---------------------------------------------------------------- State at time t

const stepTimes = c.steps.map((step, i) => {
  const lane = laneOf(step.id);
  const dispatch = dispatchAt(i);
  return { lane, dispatch, arrive: dispatch + travelMs(lane), sign: signAt(SIGN_ORDER.indexOf(i)) };
});

const stateAt = (t: number, i: number): StepState => {
  const s = stepTimes[i];
  if (t >= FADE_AT) return 'idle';
  if (t >= s.sign) return 'signed';
  if (t >= s.arrive) return 'ready';
  if (t >= s.dispatch) return 'sending';
  return 'idle';
};

const minuteAt = (t: number) =>
  t >= FADE_AT ? 0 : Math.min(c.clockMinutesToSettle, Math.floor((t / SETTLED_AT) * c.clockMinutesToSettle));

const frameAt = (t: number) => ({
  states: c.steps.map((_, i) => stateAt(t, i)),
  arrived: t < FADE_AT,
  minute: minuteAt(t),
});

const keyOf = (t: number) => {
  const f = frameAt(t);
  return `${f.states.join()}|${f.arrived}|${f.minute}`;
};

const clockText = (addMinutes: number) => {
  const total = c.clockStartHour * 60 + c.clockStartMinute + addMinutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

// ---------------------------------------------------------------- Motion preference

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

// ---------------------------------------------------------------- Small parts

const delivered = (s: StepState) => s === 'ready' || s === 'signed';

/** Waiting for a person (hollow amber) or decided by a person (solid amber with a tick). */
const Decision: React.FC<{ state: StepState; waiting: string; signed: string; className?: string }> = ({
  state,
  waiting,
  signed,
  className,
}) => (
  <span className={cn('relative block h-[18px]', className)}>
    <span
      className={cn(
        'absolute inset-y-0 left-0 flex items-center gap-2 whitespace-nowrap text-mm-human-text transition-opacity duration-300',
        state === 'ready' ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-mm-human" />
      {waiting}
    </span>
    <span
      className={cn(
        'absolute inset-y-0 left-0 flex items-center gap-2 whitespace-nowrap font-medium text-mm-human-text transition-opacity duration-300',
        state === 'signed' ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-mm-human">
        <Check className="h-2.5 w-2.5 text-mm-human-fg" strokeWidth={3.5} aria-hidden="true" />
      </span>
      {signed}
    </span>
  </span>
);

/** A department's node: grey before, blue once work arrives, amber once a person decides. */
const Node: React.FC<{ state: StepState; moving: boolean }> = ({ state, moving }) => (
  <span className="relative flex h-3 w-3 items-center justify-center">
    {state === 'ready' && moving && <span className="mm-orch-ping-slow absolute inset-0 rounded-full bg-mm-system" />}
    <span
      className={cn(
        'h-3 w-3 rounded-full border-[1.5px] transition-colors duration-300',
        state === 'idle' && 'border-mm-line bg-mm-surface',
        state === 'sending' && 'border-mm-system bg-mm-surface',
        state === 'ready' && 'border-mm-system bg-mm-system',
        state === 'signed' && 'border-mm-human bg-mm-human'
      )}
    />
  </span>
);

/** A calm vital rhythm beside the patient. */
const Rhythm: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 72 16" className={cn('h-4 w-[72px]', className)} fill="none" aria-hidden="true">
    <path d="M0 9 H22 L26 9 L29 3 L32 14 L35 6 L37 9 H72" stroke="var(--mm-line)" strokeWidth="1.25" />
    <path
      d="M0 9 H22 L26 9 L29 3 L32 14 L35 6 L37 9 H72"
      pathLength={1}
      stroke="var(--mm-system)"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mm-orch-rhythm"
    />
  </svg>
);

const PatientNode: React.FC<{ arrived: boolean; moving: boolean; className?: string }> = ({ arrived, moving, className }) => (
  <span className={cn('relative flex h-11 w-11 items-center justify-center', className)}>
    {arrived && moving && <span className="mm-orch-beat absolute inset-0 rounded-full border border-mm-system" />}
    <span className={cn('absolute inset-0 rounded-full border transition-colors duration-500', arrived ? 'border-mm-system' : 'border-mm-line')} />
    <span className={cn('h-2.5 w-2.5 rounded-full transition-colors duration-500', arrived ? 'bg-mm-ink' : 'bg-mm-line')} />
  </span>
);

// ---------------------------------------------------------------- Component

export const HeroOrchestration: React.FC<{ className?: string }> = ({ className }) => {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [t, setT] = useState(() => (prefersReducedMotion() ? STATIC_MS : 0));
  const elapsed = useRef(0);
  const lastKey = useRef(keyOf(0));
  const rootRef = useRef<HTMLElement>(null);

  // Run the clock only while the visual is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
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
      elapsed.current = (elapsed.current + Math.min(now - last, 250)) % LOOP_MS;
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
  const prepared = f.states.filter(delivered).length;
  const decided = f.states.filter((s) => s === 'signed').length;
  const moving = !reduce && playing;
  const progress = f.states.filter((s) => s !== 'idle').length / c.steps.length;
  const total = c.steps.length;

  const pauseButton = !reduce && (
    <button
      type="button"
      onClick={() => setPlaying((p) => !p)}
      aria-label={playing ? c.pauseLabel : c.playLabel}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-mm-body transition-colors hover:bg-mm-tint hover:text-mm-ink"
    >
      {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
    </button>
  );

  const clock = (
    <span className="mm-data flex items-baseline gap-2.5 whitespace-nowrap">
      <span className="text-[15px] font-medium text-mm-ink">{clockText(f.minute)}</span>
      <span className="text-mm-muted">
        {c.arrivedAt} {clockText(0)}
      </span>
    </span>
  );

  const counters = (
    <>
      <span className="mm-mark-system whitespace-nowrap text-[12px]">
        <span className="hidden sm:inline">{c.footerSystem}</span>
        <span className="sm:hidden">{c.footerSystemShort}</span>
        <span className="tabular-nums text-mm-ink">
          {prepared}/{total}
        </span>
      </span>
      <span className="mm-mark-human whitespace-nowrap text-[12px]">
        <span className="hidden sm:inline">{c.footerHuman}</span>
        <span className="sm:hidden">{c.footerHumanShort}</span>
        <span className="tabular-nums text-mm-ink">
          {decided}/{total}
        </span>
      </span>
    </>
  );

  return (
    <figure
      ref={rootRef}
      aria-labelledby="hero-orch-summary"
      className={cn('relative flex h-full flex-col', !moving && 'mm-orch-paused', className)}
    >
      <figcaption id="hero-orch-summary" className="sr-only">
        {c.summary}
      </figcaption>

      {/* Readout. lg+: clock, both counters, the honesty marker, pause. Below lg: clock, marker, pause. */}
      <div className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-mm-line lg:h-10">
        <div className="flex min-w-0 items-center gap-8" aria-hidden="true">
          {clock}
          <span className="hidden items-center gap-8 lg:flex">{counters}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="mm-dev-badge">{c.devBadge}</span>
          {pauseButton}
        </div>
      </div>

      {/* ---------------- lg+: the canvas ---------------- */}
      <div className="relative hidden lg:block" style={{ height: CANVAS_H }} aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 1000 ${CANVAS_H}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {c.steps.map((step, i) => {
            const { lane } = stepTimes[i];
            const s = f.states[i];
            const d = pathFor(lane);
            const duration = `${Math.round(travelMs(lane))}ms`;
            return (
              <g key={step.id}>
                <path d={d} stroke="var(--mm-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path
                  d={d}
                  stroke="var(--mm-system)"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                  className="transition-opacity duration-500"
                  opacity={delivered(s) ? 0.5 : 0}
                />
                {s === 'sending' && moving && (
                  <>
                    <path
                      d={d}
                      pathLength={1}
                      stroke="var(--mm-system)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      opacity={0.22}
                      className="mm-orch-send"
                      style={{ animationDuration: duration }}
                    />
                    <path
                      d={d}
                      pathLength={1}
                      stroke="var(--mm-system)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="mm-orch-send"
                      style={{ animationDuration: duration }}
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* The patient: label above the node, rhythm below it; the fan leaves to the right. */}
        <div
          className="absolute flex flex-col items-end text-right"
          style={{ right: `calc(${100 - PATIENT_X / 10}% - 22px)`, bottom: CANVAS_H - PATIENT_Y + 34 }}
        >
          <span className="mm-data text-mm-muted">{c.patientLabel}</span>
          <span className="mt-0.5 whitespace-nowrap text-[13px] leading-snug text-mm-body">{c.patientDetail}</span>
        </div>
        <span className="absolute -translate-x-1/2" style={{ left: `${PATIENT_X / 10}%`, top: PATIENT_Y + 34 }}>
          <Rhythm />
        </span>
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${PATIENT_X / 10}%`, top: PATIENT_Y }}
        >
          <PatientNode arrived={f.arrived} moving={moving} />
        </span>

        {/* Departments. */}
        {c.steps.map((step, i) => {
          const { lane } = stepTimes[i];
          const s = f.states[i];
          const x = LANES[lane].x / 10;
          const y = laneY(lane);
          return (
            <div key={step.id}>
              <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: y }}>
                <Node state={s} moving={moving} />
              </span>
              <div className="absolute w-[17rem]" style={{ left: `calc(${x}% + 16px)`, top: y - 11 }}>
                <p
                  className={cn(
                    'text-[15px] font-semibold leading-[22px] transition-colors duration-300',
                    s === 'idle' ? 'text-mm-muted' : 'text-mm-ink'
                  )}
                >
                  {step.name}
                </p>
                <p
                  className={cn(
                    'mm-data truncate text-[12.5px] leading-[18px] text-mm-link transition-opacity duration-300',
                    delivered(s) ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {step.prepared}
                </p>
                <Decision state={s} waiting={step.waiting} signed={step.signed} className="mm-data mt-0.5 text-[12px]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- Below lg: the vertical form ---------------- */}
      <div className="relative flex-1 py-4 lg:hidden" aria-hidden="true">
        <div className="flex h-11 items-center gap-3">
          <PatientNode arrived={f.arrived} moving={moving} className="shrink-0" />
          <div className="min-w-0">
            <p className="mm-data text-mm-muted">{c.patientLabel}</p>
            <p className="text-[13px] leading-snug text-mm-body">{c.patientDetail}</p>
          </div>
          <Rhythm className="ml-auto shrink-0" />
        </div>

        {/* The trunk, filling as departments receive work. */}
        <span className="absolute bottom-[46px] left-[22px] top-[60px] w-px bg-mm-line">
          <span
            className="absolute inset-0 origin-top bg-mm-system transition-transform duration-700 ease-out"
            style={{ transform: `scaleY(${progress})` }}
          />
        </span>

        <ol className="mt-3 divide-y divide-mm-line">
          {c.steps.map((step, i) => {
            const s = f.states[i];
            return (
              <li key={step.id} className="relative flex h-[60px] flex-col justify-center pl-12">
                <span
                  className={cn(
                    'absolute left-[22px] top-1/2 h-px w-[16px] transition-colors duration-300',
                    s === 'idle' ? 'bg-mm-line' : 'bg-mm-system'
                  )}
                />
                <span className="absolute left-[22px] top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Node state={s} moving={moving} />
                </span>
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'truncate text-[14px] font-semibold leading-5 transition-colors duration-300',
                      s === 'idle' ? 'text-mm-muted' : 'text-mm-ink'
                    )}
                  >
                    {step.name}
                  </span>
                  <Decision
                    state={s}
                    waiting={step.waiting}
                    signed={step.signed}
                    className="mm-data w-[10.5rem] shrink-0 text-[11.5px] [&>span]:left-auto [&>span]:right-0 [&>span]:flex-row-reverse"
                  />
                </span>
                <span
                  className={cn(
                    'mm-data mt-0.5 truncate text-[12px] leading-[18px] text-mm-link transition-opacity duration-300',
                    delivered(s) ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {step.prepared}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Below lg: the counters as a quiet readout. */}
      <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-t border-mm-line lg:hidden" aria-hidden="true">
        {counters}
      </div>
    </figure>
  );
};

export default HeroOrchestration;

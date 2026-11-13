import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import { cn } from '../../utils/cn';
import { orchestrationContent as c, type DepartmentId } from '../../content/landing.v2.a';

/**
 * The living hospital, seen from mission control. One patient arrives; light
 * travels out along seven paths to departments placed across the canvas; each
 * department receives a prepared step (system blue) and then a named person
 * decides (amber). The system moves; people are still.
 *
 * Timing: the hospital responds once in about seven seconds, rests in its
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

/**
 * The wide canvas is drawn in real pixels of its measured width (no stretched
 * viewBox), so circles stay round and hairlines stay exactly one pixel.
 * Three zones, left to right: the arrival (a patient dial), the system (a fan
 * of light to seven departments at different depths), and the people (one
 * column where each step waits for, then receives, a person's decision).
 * A minute ruler under it all shows when the system prepared each step (blue)
 * and when a person decided it (amber): the system is always first.
 */
const CANVAS_H = 396;
const HEAD_Y = 14;
const LANE_Y0 = 54;
const LANE_GAP = 45;
const RULER_Y = 360;
const DIAL_X = 48;
const DIAL_R = 34;
const PATH_X0 = DIAL_X + DIAL_R + 8;
/** Room for a department's two lines of text. */
const LABEL_W = 200;
/**
 * Lanes top to bottom; depth 0..1 places each department across the system
 * zone. Triage sits on the patient's axis, nearest; no two labels collide.
 */
const LANES: { id: DepartmentId; depth: number }[] = [
  { id: 'billing', depth: 0.8 },
  { id: 'lab', depth: 0.34 },
  { id: 'imaging', depth: 0.64 },
  { id: 'triage', depth: 0 },
  { id: 'pharmacy', depth: 0.5 },
  { id: 'beds', depth: 0.18 },
  { id: 'ministry', depth: 0.96 },
];
const laneOf = (id: DepartmentId) => LANES.findIndex((l) => l.id === id);
const laneY = (lane: number) => LANE_Y0 + lane * LANE_GAP;
const PATIENT_Y = laneY(3);

/** Pixel layout for a canvas `w` wide. */
const layoutFor = (w: number) => {
  const wide = w >= 1150;
  const decW = wide ? 232 : 186;
  const decX = w - decW;
  const ruleX = decX - 28;
  const first = PATH_X0 + 118;
  const last = Math.max(first + 80, ruleX - LABEL_W - 16);
  const nodeX = LANES.map((l) => first + l.depth * (last - first));
  return { wide, decX, ruleX, first, nodeX };
};
type Layout = ReturnType<typeof layoutFor>;

const pathFor = (lane: number, g: Layout) => {
  const x = g.nodeX[lane];
  const y = laneY(lane);
  if (y === PATIENT_Y) return `M${PATH_X0} ${y} L${x} ${y}`;
  const mid = (PATH_X0 + g.first) / 2;
  return `M${PATH_X0} ${PATIENT_Y} C ${mid} ${PATIENT_Y}, ${mid} ${y}, ${g.first} ${y} L${x} ${y}`;
};
/** Light travels at one speed: deeper departments receive their work later. */
const travelMs = (lane: number) => 460 + LANES[lane].depth * 620;
/** Rough width of a department's text block, so its leader starts after it. */
const textWidth = (name: string, prepared: string) => Math.max(name.length * 8.4, prepared.length * 7.5);

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

// ---------------------------------------------------------------- The wide canvas (lg+)

const minuteOf = (ms: number) => (ms / SETTLED_AT) * c.clockMinutesToSettle;
const DIAL_TICKS = 42;
const ARC_PREPARED = DIAL_R - 4;
const ARC_DECIDED = DIAL_R - 10;
const circ = (r: number) => 2 * Math.PI * r;

/** One arc of the patient dial: `share` of a full turn, starting at twelve o'clock. */
const DialArc: React.FC<{ r: number; share: number; color: string }> = ({ r, share, color }) => (
  <>
    <circle cx={DIAL_X} cy={PATIENT_Y} r={r} stroke="var(--mm-line)" strokeWidth="2" />
    <circle
      cx={DIAL_X}
      cy={PATIENT_Y}
      r={r}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={`${share * circ(r)} ${circ(r)}`}
      transform={`rotate(-90 ${DIAL_X} ${PATIENT_Y})`}
      style={{ transition: 'stroke-dasharray 600ms cubic-bezier(.2,.7,.2,1)', opacity: share > 0 ? 1 : 0 }}
    />
  </>
);

/** A department node is the system's: blue once work leaves for it. The person's amber lives in the people column. */
const nodeColor = (s: StepState) => (s === 'idle' ? 'var(--mm-line)' : 'var(--mm-system)');

const WideCanvas: React.FC<{
  states: StepState[];
  arrived: boolean;
  minute: number;
  moving: boolean;
  prepared: number;
  decided: number;
}> = ({ states, arrived, minute, moving, prepared, decided }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const uid = useId().replace(/:/g, '');

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    setW(node.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setW(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const total = c.steps.length;
  const g = w > 0 ? layoutFor(w) : null;
  const rulerX0 = PATH_X0;
  const rulerX1 = w;
  const minuteX = (m: number) => rulerX0 + (m / c.clockMinutesToSettle) * (rulerX1 - rulerX0);

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: CANVAS_H }} aria-hidden="true">
      {g && (
        <>
          <svg className="absolute inset-0 overflow-visible" width={w} height={CANVAS_H} viewBox={`0 0 ${w} ${CANVAS_H}`} fill="none">
            <defs>
              <radialGradient id={`${uid}-halo`}>
                <stop offset="0" stopColor="var(--mm-system)" stopOpacity="0.16" />
                <stop offset="1" stopColor="var(--mm-system)" stopOpacity="0" />
              </radialGradient>
              <filter id={`${uid}-blur`} x="-20%" y="-200%" width="140%" height="500%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              {c.steps.map((step, i) => (
                <linearGradient
                  key={step.id}
                  id={`${uid}-lit-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={PATH_X0}
                  y1="0"
                  x2={g.nodeX[stepTimes[i].lane]}
                  y2="0"
                >
                  <stop offset="0" stopColor="var(--mm-system)" stopOpacity="0.15" />
                  <stop offset="1" stopColor="var(--mm-system)" stopOpacity="0.85" />
                </linearGradient>
              ))}
            </defs>

            {/* The people column: a hairline that separates what the system prepares from what a person decides. */}
            <line x1={g.ruleX} y1={HEAD_Y + 14} x2={g.ruleX} y2={laneY(6) + 22} stroke="var(--mm-line)" />

            {/* Light behind the patient. */}
            <circle cx={DIAL_X} cy={PATIENT_Y} r={DIAL_R * 2.6} fill={`url(#${uid}-halo)`} opacity={arrived ? 1 : 0} style={{ transition: 'opacity 600ms' }} />

            {/* Paths, the light travelling them, and each step's leader to the people column. */}
            {c.steps.map((step, i) => {
              const { lane } = stepTimes[i];
              const s = states[i];
              const d = pathFor(lane, g);
              const y = laneY(lane);
              const duration = `${Math.round(travelMs(lane))}ms`;
              const leaderX0 = g.nodeX[lane] + 18 + textWidth(step.name, step.prepared) + 14;
              const leaderX1 = g.decX - 14;
              return (
                <g key={step.id}>
                  <path d={d} stroke="var(--mm-line)" strokeWidth="1" />
                  <path
                    d={d}
                    stroke={`url(#${uid}-lit-${i})`}
                    strokeWidth="1.5"
                    style={{ transition: 'opacity 500ms', opacity: delivered(s) ? 1 : 0 }}
                  />
                  {s === 'sending' && moving && (
                    <>
                      <path
                        d={d}
                        pathLength={1}
                        stroke="var(--mm-system)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        filter={`url(#${uid}-blur)`}
                        opacity={0.55}
                        className="mm-orch-send"
                        style={{ animationDuration: duration }}
                      />
                      <path
                        d={d}
                        pathLength={1}
                        stroke="var(--mm-system)"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        className="mm-orch-send"
                        style={{ animationDuration: duration }}
                      />
                      <path
                        d={d}
                        pathLength={1}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="mm-orch-head stroke-mm-system dark:stroke-mm-ink"
                        style={{ animationDuration: duration }}
                      />
                    </>
                  )}
                  {leaderX1 - leaderX0 > 24 && (
                    <line
                      x1={leaderX0}
                      y1={y}
                      x2={leaderX1}
                      y2={y}
                      stroke={s === 'idle' || s === 'sending' ? 'var(--mm-line)' : 'var(--mm-human)'}
                      strokeDasharray={s === 'signed' ? undefined : '1 5'}
                      strokeLinecap="round"
                      style={{ transition: 'opacity 400ms', opacity: s === 'signed' ? 0.4 : s === 'ready' ? 0.9 : 0.8 }}
                    />
                  )}
                  {/* The department's node: a ring, its core and a soft halo once work arrives. */}
                  <circle
                    cx={g.nodeX[lane]}
                    cy={y}
                    r="11"
                    fill={nodeColor(s)}
                    style={{ transition: 'opacity 400ms, fill 300ms', opacity: delivered(s) ? 0.16 : 0 }}
                  />
                  <circle
                    cx={g.nodeX[lane]}
                    cy={y}
                    r="6"
                    fill="var(--mm-surface)"
                    stroke={nodeColor(s)}
                    strokeWidth="1.5"
                    style={{ transition: 'stroke 300ms' }}
                  />
                  <circle
                    cx={g.nodeX[lane]}
                    cy={y}
                    r="3"
                    fill={nodeColor(s)}
                    style={{ transition: 'opacity 300ms, fill 300ms', opacity: delivered(s) ? 1 : 0 }}
                  />
                  {s === 'ready' && moving && (
                    <circle
                      cx={g.nodeX[lane]}
                      cy={y}
                      r="6"
                      stroke="var(--mm-system)"
                      className="mm-orch-ping-slow"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  )}
                </g>
              );
            })}

            {/* The patient dial: ticks for the seven departments, an outer arc for what the system
                has prepared, an inner arc for what people have decided, the patient at the centre. */}
            <g>
              {Array.from({ length: DIAL_TICKS }, (_, k) => {
                const major = k % (DIAL_TICKS / total) === 0;
                const a = (k / DIAL_TICKS) * 2 * Math.PI - Math.PI / 2;
                const r0 = DIAL_R + (major ? 3 : 4);
                const r1 = DIAL_R + (major ? 9 : 7);
                return (
                  <line
                    key={k}
                    x1={DIAL_X + r0 * Math.cos(a)}
                    y1={PATIENT_Y + r0 * Math.sin(a)}
                    x2={DIAL_X + r1 * Math.cos(a)}
                    y2={PATIENT_Y + r1 * Math.sin(a)}
                    stroke={major ? 'var(--mm-muted)' : 'var(--mm-line)'}
                    strokeWidth={major ? 1.25 : 1}
                  />
                );
              })}
              <circle cx={DIAL_X} cy={PATIENT_Y} r={DIAL_R} fill="var(--mm-surface)" stroke="var(--mm-line)" />
              <DialArc r={ARC_PREPARED} share={prepared / total} color="var(--mm-system)" />
              <DialArc r={ARC_DECIDED} share={decided / total} color="var(--mm-human)" />
              {arrived && moving && (
                <circle
                  cx={DIAL_X}
                  cy={PATIENT_Y}
                  r="9"
                  stroke="var(--mm-system)"
                  className="mm-orch-beat"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              )}
              <circle
                cx={DIAL_X}
                cy={PATIENT_Y}
                r="5"
                fill={arrived ? 'var(--mm-ink)' : 'var(--mm-line)'}
                style={{ transition: 'fill 500ms' }}
              />
            </g>

            {/* The minute ruler. */}
            <g>
              <line x1={rulerX0} y1={RULER_Y} x2={rulerX1} y2={RULER_Y} stroke="var(--mm-line)" />
              {Array.from({ length: c.clockMinutesToSettle + 1 }, (_, m) => (
                <line
                  key={m}
                  x1={minuteX(m)}
                  y1={RULER_Y}
                  x2={minuteX(m)}
                  y2={RULER_Y + (m % 5 === 0 ? 7 : 4)}
                  stroke={m % 5 === 0 ? 'var(--mm-muted)' : 'var(--mm-line)'}
                />
              ))}
              {Array.from({ length: Math.floor(c.clockMinutesToSettle / 5) + 1 }, (_, k) => (
                <text
                  key={k}
                  x={minuteX(k * 5) + 4}
                  y={RULER_Y + 22}
                  className="font-mono"
                  fontSize="11"
                  fill="var(--mm-muted)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {clockText(k * 5)}
                </text>
              ))}
              {c.steps.map((step, i) => {
                const s = states[i];
                const prepX = minuteX(minuteOf(stepTimes[i].arrive));
                const signX = minuteX(minuteOf(stepTimes[i].sign));
                return (
                  <g key={step.id}>
                    <circle
                      cx={prepX}
                      cy={RULER_Y - 7}
                      r="2.25"
                      fill="var(--mm-system)"
                      style={{ transition: 'opacity 300ms', opacity: delivered(s) ? 1 : 0 }}
                    />
                    <rect
                      x={signX - 2.25}
                      y={RULER_Y - 9.25}
                      width="4.5"
                      height="4.5"
                      fill="var(--mm-human)"
                      transform={`rotate(45 ${signX} ${RULER_Y - 7})`}
                      style={{ transition: 'opacity 300ms', opacity: s === 'signed' ? 1 : 0 }}
                    />
                  </g>
                );
              })}
              {/* Now: a cursor that walks the minutes. */}
              <g
                style={{
                  transform: `translateX(${minuteX(minute)}px)`,
                  transition: 'transform 420ms cubic-bezier(.2,.7,.2,1), opacity 400ms',
                  opacity: arrived ? 1 : 0,
                }}
              >
                <line x1="0" y1={RULER_Y - 16} x2="0" y2={RULER_Y + 7} stroke="var(--mm-ink)" strokeWidth="1" />
                <circle cx="0" cy={RULER_Y - 16} r="2" fill="var(--mm-ink)" />
              </g>
            </g>
          </svg>

          {/* Column heads: what the system prepared, what people decided. */}
          <span className="mm-mark-system absolute whitespace-nowrap text-[12px]" style={{ left: g.first - 6, top: HEAD_Y - 8 }}>
            {c.footerSystem}
            <span className="tabular-nums text-mm-ink">
              {prepared}/{total}
            </span>
          </span>
          <span className="mm-mark-human absolute whitespace-nowrap text-[12px]" style={{ left: g.decX, top: HEAD_Y - 8 }}>
            {c.footerHuman}
            <span className="tabular-nums text-mm-ink">
              {decided}/{total}
            </span>
          </span>

          {/* The patient. */}
          <div className="absolute left-0" style={{ top: PATIENT_Y + DIAL_R + 18 }}>
            <p className="mm-data text-[12px] text-mm-muted">{c.patientLabel}</p>
            <p className="mt-0.5 whitespace-nowrap text-[13px] leading-snug text-mm-body">{c.patientDetail}</p>
          </div>

          {/* Departments, and the person each one waits for. */}
          {c.steps.map((step, i) => {
            const { lane } = stepTimes[i];
            const s = states[i];
            const y = laneY(lane);
            return (
              <React.Fragment key={step.id}>
                <div className="absolute" style={{ left: g.nodeX[lane] + 18, top: y - 19, width: LABEL_W }}>
                  <p
                    className={cn(
                      'text-[14px] font-semibold leading-5 tracking-[-0.005em] transition-colors duration-300',
                      s === 'idle' ? 'text-mm-muted' : 'text-mm-ink'
                    )}
                  >
                    {step.name}
                  </p>
                  <p
                    className={cn(
                      'mm-data truncate text-[12px] leading-[18px] text-mm-link transition-opacity duration-300',
                      delivered(s) ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    {step.prepared}
                  </p>
                </div>
                <div className="absolute flex items-center justify-between gap-3" style={{ left: g.decX, top: y - 9, right: 0 }}>
                  <Decision state={s} waiting={step.waiting} signed={step.signed} className="mm-data min-w-0 flex-1 text-[12px]" />
                  {g.wide && (
                    <span
                      className={cn(
                        'mm-data text-[11px] text-mm-muted transition-opacity duration-300',
                        s === 'signed' ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      {clockText(Math.floor(minuteOf(stepTimes[i].sign)))}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

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
      <span className="hidden text-mm-muted sm:inline">
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

      {/* Readout: clock, the "In development" chip, pause. lg+ shows the counters as the canvas's column heads. */}
      <div className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-mm-line lg:h-10">
        <div className="flex min-w-0 items-center gap-8" aria-hidden="true">
          {clock}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="mm-dev-badge">{c.devBadge}</span>
          {pauseButton}
        </div>
      </div>

      {/* ---------------- lg+: the canvas ---------------- */}
      <WideCanvas states={f.states} arrived={f.arrived} minute={f.minute} moving={moving} prepared={prepared} decided={decided} />

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

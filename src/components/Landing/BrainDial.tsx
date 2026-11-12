import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Lock, Minus, Plus } from 'lucide-react';
import { brain } from '../../content/landing.v2.c';
import { cn } from '../../utils/cn';

/**
 * The autonomy dial (#brain, lane C). One job's dial, six steps from watch
 * to own it. The signature line sits fixed at twelve o'clock: the three
 * steps left of it never act without a person; past it is only work with
 * no medical decision, nothing leaving the hospital and no money. The three
 * limits and the off switch sit around it and never move with it.
 *
 * Input: drag or tap the ring, tap a step (phones), the two step buttons,
 * or the keyboard (arrows, Home, End). It is one ARIA slider with a value
 * text that says what the system does and what the person does.
 */

const copy = brain.dial;
const LEVELS = copy.levels;
const MAX = LEVELS.length - 1;
const SIGN_AFTER = 2; // the signature line sits between step 2 (prepare) and step 3 (act and tell)

// Geometry (SVG user units). 0° is twelve o'clock, clockwise positive.
const CX = 280;
const CY = 222;
const R = 160;
const START = -135;
const SWEEP = 270;
const STEP = SWEEP / MAX;
const angleOf = (level: number) => START + level * STEP;
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
};
const arc = (r: number, a0: number, a1: number) => {
  if (a1 - a0 < 0.01) return '';
  const p0 = polar(r, a0);
  const p1 = polar(r, a1);
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1.x} ${p1.y}`;
};

/** Wide: room for the step names around the ring. Narrow: the ring alone, larger. */
const VIEW_WIDE = { x: 0, y: 0, w: 560, h: 444 };
const VIEW_NARROW = { x: 92, y: 30, w: 376, h: 384 };

function useWide(): boolean {
  const query = '(min-width: 640px)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return Boolean(wide);
}

const cx = cn;

export const BrainDial: React.FC<{ intro?: React.ReactNode }> = ({ intro }) => {
  const reduce = useReducedMotion();
  const wide = useWide();
  const view = wide ? VIEW_WIDE : VIEW_NARROW;
  const [level, setLevel] = useState(0); // every job starts at watch
  const [on, setOn] = useState(true);
  const dialRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // The needle follows the level on a spring (instant under reduced motion).
  const angle = useSpring(angleOf(0), { stiffness: 260, damping: 28 });
  useEffect(() => {
    const target = angleOf(on ? level : 0);
    if (reduce) angle.jump(target);
    else angle.set(target);
  }, [level, on, reduce, angle]);
  const activeD = useTransform(angle, (a) => arc(R, START, a));
  const knobX = useTransform(angle, (a) => polar(R, a).x);
  const knobY = useTransform(angle, (a) => polar(R, a).y);
  const needleX1 = useTransform(angle, (a) => polar(84, a).x);
  const needleY1 = useTransform(angle, (a) => polar(84, a).y);
  const needleX2 = useTransform(angle, (a) => polar(R - 18, a).x);
  const needleY2 = useTransform(angle, (a) => polar(R - 18, a).y);

  const set = useCallback((next: number) => setLevel(Math.max(0, Math.min(MAX, next))), []);

  /** Nearest step to a pointer position, or null if the pointer is far from the ring. */
  const levelAt = (clientX: number, clientY: number): number | null => {
    const box = dialRef.current?.getBoundingClientRect();
    if (!box) return null;
    const scale = box.width / view.w;
    const x = (clientX - box.left) / scale + view.x - CX;
    const y = (clientY - box.top) / scale + view.y - CY;
    const dist = Math.hypot(x, y);
    if (dist < R - 70 || dist > R + 110) return null;
    let deg = (Math.atan2(x, -y) * 180) / Math.PI;
    if (deg > 135 || deg < -135) deg = deg > 0 ? 135 : -135;
    return Math.round((deg - START) / STEP);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!on) return;
    const next = levelAt(e.clientX, e.clientY);
    if (next === null) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    set(next);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !on) return;
    const next = levelAt(e.clientX, e.clientY);
    if (next !== null) set(next);
  };
  const endDrag = () => {
    dragging.current = false;
  };
  // Some touch browsers deliver a tap only as a click: treat it like a press.
  const onClick = (e: React.MouseEvent) => {
    if (!on) return;
    const next = levelAt(e.clientX, e.clientY);
    if (next !== null) set(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!on) return;
    const map: Record<string, number> = {
      ArrowRight: level + 1,
      ArrowUp: level + 1,
      ArrowLeft: level - 1,
      ArrowDown: level - 1,
      PageUp: level + 1,
      PageDown: level - 1,
      Home: 0,
      End: MAX,
    };
    if (e.key in map) {
      e.preventDefault();
      set(map[e.key]);
    }
  };

  const shown = on ? level : 0;
  const current = LEVELS[shown];
  const pastLine = shown > SIGN_AFTER;
  const pct = (x: number, y: number) => ({
    left: `${((x - view.x) / view.w) * 100}%`,
    top: `${((y - view.y) / view.h) * 100}%`,
  });
  const signTop = polar(R + 40, 0);
  const signOuter = polar(R + 22, 0);
  const signInner = polar(R - 22, 0);

  return (
    <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12 lg:gap-y-10">
      {intro && <div className="lg:col-span-5 lg:row-start-1">{intro}</div>}

      {/* ── The dial ─────────────────────────────────────── */}
      <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
        <div
          ref={dialRef}
          role="slider"
          tabIndex={on ? 0 : -1}
          aria-label={copy.ariaLabel}
          aria-valuemin={0}
          aria-valuemax={MAX}
          aria-valuenow={shown}
          aria-valuetext={`${current.name}. ${copy.systemLabel}: ${current.system} ${copy.personLabel}: ${current.person}`}
          aria-disabled={!on || undefined}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={onClick}
          className={cx(
            'relative mx-auto w-full max-w-[600px] select-none rounded-[24px] outline-none transition-opacity duration-300',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mm-focus)]',
            on ? 'cursor-grab active:cursor-grabbing' : 'opacity-45'
          )}
          style={{ aspectRatio: `${view.w} / ${view.h}`, touchAction: 'pan-y' }}
        >
          {/* Light as meaning: the more the system may do, the more the dial glows */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full"
            style={{
              ...pct(CX, CY),
              width: `${((R * 2.3) / view.w) * 100}%`,
              aspectRatio: '1',
              translateX: '-50%',
              translateY: '-50%',
              background: 'radial-gradient(circle, var(--mm-system) 0%, transparent 64%)',
            }}
            initial={false}
            animate={{ opacity: on ? 0.05 + shown * 0.035 : 0 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
          />
          <svg
            viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {/* Instrument ticks */}
            {Array.from({ length: 31 }, (_, i) => {
              const a = START + (i * SWEEP) / 30;
              const p0 = polar(R + 12, a);
              const p1 = polar(R + (i % 5 === 0 ? 20 : 16), a);
              return (
                <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="var(--mm-line)" strokeWidth={1.25} />
              );
            })}
            {/* Track: solid where a person always decides, dashed past the signature line */}
            <path d={arc(R, START, 0)} fill="none" stroke="var(--mm-muted)" strokeOpacity={0.45} strokeWidth={2} />
            <path d={arc(R, 0, START + SWEEP)} fill="none" stroke="var(--mm-muted)" strokeOpacity={0.55} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
            {/* Active arc: the system's share of the work */}
            <motion.path d={activeD} fill="none" stroke="var(--mm-system)" strokeWidth={10} strokeLinecap="round" opacity={0.16} />
            <motion.path d={activeD} fill="none" stroke="var(--mm-system)" strokeWidth={3.5} strokeLinecap="round" />
            {/* Hub */}
            <circle cx={CX} cy={CY} r={78} fill="var(--mm-surface)" stroke="var(--mm-line)" strokeWidth={1} />
            {/* Needle */}
            <motion.line x1={needleX1} y1={needleY1} x2={needleX2} y2={needleY2} stroke="var(--mm-system)" strokeWidth={1.5} opacity={0.7} />
            {/* Step detents */}
            {LEVELS.map((l, i) => {
              const p = polar(R, angleOf(i));
              const lit = i <= shown;
              return (
                <circle
                  key={l.name}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill={lit ? 'var(--mm-system)' : 'var(--mm-surface)'}
                  stroke={lit ? 'var(--mm-system)' : 'var(--mm-muted)'}
                  strokeWidth={1.5}
                />
              );
            })}
            {/* The signature line: fixed, amber, never moves */}
            <line x1={signInner.x} y1={signInner.y} x2={signOuter.x} y2={signOuter.y} stroke="var(--mm-human)" strokeWidth={3} strokeLinecap="round" />
            {/* Knob */}
            <motion.circle cx={knobX} cy={knobY} r={20} fill="var(--mm-system)" opacity={0.14} />
            <motion.circle cx={knobX} cy={knobY} r={11} fill="var(--mm-surface)" stroke="var(--mm-system)" strokeWidth={3} />
          </svg>

          {/* Signature line label */}
          <span
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-full items-center gap-1.5 whitespace-nowrap pb-1 font-mono text-[12px] font-medium text-mm-human-text"
            style={pct(signTop.x, signTop.y)}
            aria-hidden="true"
          >
            <Lock className="h-3 w-3" strokeWidth={2.25} />
            {copy.signatureLine}
          </span>

          {/* Step names around the ring (wide screens) */}
          {wide &&
            LEVELS.map((l, i) => {
              const a = angleOf(i);
              const p = polar(R + 42, a);
              const leftSide = a < 0;
              return (
                <span
                  key={l.name}
                  aria-hidden="true"
                  className={cx(
                    'pointer-events-none absolute -translate-y-1/2 whitespace-nowrap font-mono text-[13px] transition-colors duration-200',
                    leftSide ? '-translate-x-full text-right' : 'text-left',
                    i === shown ? 'font-semibold text-mm-ink' : 'text-mm-muted'
                  )}
                  style={pct(p.x, p.y)}
                >
                  {l.name}
                </span>
              );
            })}

          {/* Hub readout */}
          <div
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
            style={{ ...pct(CX, CY), width: `${(140 / view.w) * 100}%` }}
            aria-hidden="true"
          >
            <span className="font-display text-[clamp(2.75rem,1.6rem+3vw,4rem)] font-[350] leading-none tracking-[-0.04em] text-mm-ink">
              {shown + 1}
            </span>
            <span className="mt-1 font-mono text-[11px] text-mm-muted">
              {copy.ofWord} {LEVELS.length}
            </span>
          </div>

          {/* Step buttons, in the open gap at the bottom of the ring */}
          <div
            className="absolute flex -translate-x-1/2 -translate-y-1/2 gap-3"
            style={pct(CX, CY + R + 6)}
          >
            {[
              { label: copy.down, icon: Minus, to: level - 1, off: level === 0 },
              { label: copy.up, icon: Plus, to: level + 1, off: level === MAX },
            ].map(({ label, icon: Icon, to, off }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                disabled={!on || off}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  set(to);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-mm-line bg-mm-raised text-mm-ink transition-colors hover:border-mm-system hover:text-mm-system disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-mm-line disabled:hover:text-mm-ink"
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        {/* Steps as tap targets on phones, split by the signature line */}
        <div className="mx-auto mt-6 max-w-[420px] sm:hidden">
          {[0, 1].map((row) => (
            <React.Fragment key={row}>
              {row === 1 && (
                <p className="my-2.5 flex items-center gap-2 font-mono text-[12px] font-medium text-mm-human-text" aria-hidden="true">
                  <span className="h-[2px] flex-1 bg-mm-human" />
                  <Lock className="h-3 w-3" strokeWidth={2.25} />
                  {copy.signatureLine}
                  <span className="h-[2px] flex-1 bg-mm-human" />
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.slice(row * 3, row * 3 + 3).map((l, j) => {
                  const i = row * 3 + j;
                  return (
                    <button
                      key={l.name}
                      type="button"
                      aria-pressed={i === shown}
                      disabled={!on}
                      onClick={() => set(i)}
                      className={cx(
                        'min-h-[44px] rounded-[10px] border px-2 font-mono text-[12px] leading-tight transition-colors disabled:opacity-40',
                        i === shown ? 'border-mm-system bg-mm-system-soft font-semibold text-mm-ink' : 'border-mm-line text-mm-body'
                      )}
                    >
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-[12px] text-mm-muted max-sm:hidden">{copy.hint}</p>
      </div>

      {/* ── What happens at this step ───────────────────── */}
      <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
        <div className="min-h-[300px] border-t border-mm-line pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {on ? (
              <motion.div
                key={shown}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-[2rem] leading-none text-mm-ink md:text-[2.5rem]">{current.name}</span>
                  <span className="mm-caption">{current.gist}</span>
                </p>
                <p className="mm-data m-0 mt-3 text-mm-muted">{current.job}</p>
                <dl className="m-0 mt-6 grid gap-5">
                  <div className="grid gap-1.5">
                    <dt className="mm-mark-system">{copy.systemLabel}</dt>
                    <dd className="mm-body m-0 text-mm-ink">{current.system}</dd>
                  </div>
                  <div className="grid gap-1.5">
                    <dt className="mm-mark-human">{copy.personLabel}</dt>
                    <dd className="mm-body m-0 text-mm-ink">{current.person}</dd>
                  </div>
                </dl>
                <p
                  className={cx(
                    'mm-caption m-0 mt-6 border-l-2 pl-3',
                    pastLine ? 'border-mm-human text-mm-body' : 'border-mm-line'
                  )}
                >
                  {pastLine ? copy.signatureNote : copy.belowNote}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="off"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <p className="m-0 font-display text-[2rem] leading-[1.05] text-mm-ink md:text-[2.5rem]">{copy.off.title}</p>
                <p className="mm-body m-0 mt-4">{copy.off.body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Fixed around it: the three limits and the off switch ── */}
      <div className="grid gap-4 md:grid-cols-3 lg:col-span-12 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <h4 className="mm-eyebrow m-0 md:col-span-3 lg:col-span-4">{copy.limitsTitle}</h4>
        {copy.limits.map((limit) => (
          <div
            key={limit}
            className="relative flex min-h-[112px] flex-col justify-between gap-4 rounded-[10px] border border-mm-line bg-mm-raised p-5"
          >
            {/* Rivets: bolted down */}
            <span aria-hidden="true" className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-mm-line" />
            <span aria-hidden="true" className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-mm-line" />
            <span className="flex items-center gap-2 font-mono text-[12px] font-medium text-mm-human-text">
              <Lock className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              {copy.fixed}
            </span>
            <p className="m-0 pr-4 text-[1.0625rem] font-medium leading-snug text-mm-ink">{limit}</p>
          </div>
        ))}
        <div className="flex flex-col justify-between gap-4 rounded-[10px] border border-mm-line p-5 md:col-span-3 md:flex-row md:items-center lg:col-span-1 lg:min-h-[112px] lg:min-w-[190px] lg:flex-col lg:items-stretch">
          <span className="font-mono text-[12px] font-medium text-mm-muted">{copy.off.label}</span>
          <button
            type="button"
            aria-pressed={!on}
            onClick={() => setOn((v) => !v)}
            className="group flex min-h-[44px] items-center gap-3 text-left"
          >
            <span
              aria-hidden="true"
              className={cx(
                'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200',
                on ? 'border-mm-system bg-mm-system-soft' : 'border-mm-line bg-transparent'
              )}
            >
              <span
                className={cx(
                  'absolute top-1 h-[18px] w-[18px] rounded-full transition-transform duration-200',
                  on ? 'translate-x-[24px] bg-mm-system' : 'translate-x-1 bg-mm-muted'
                )}
              />
            </span>
            <span className="text-[1.0625rem] font-medium text-mm-ink">
              <span className="sr-only">{copy.off.label}: </span>
              {on ? copy.off.on : copy.off.offState}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

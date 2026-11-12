import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ambition as copy } from '../../content/landing.v2.lane-d';
import { dDisplay, dEdge, dH2, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * Where this goes (#ambition): the page's last statement before the ask.
 * Ink canvas, like the hero: the page ends in the same night. A still field of
 * dim points stands for hospitals everywhere; exactly 25 points are lit
 * (the signed network). Three hairline rings widen from them: one
 * network, then a region, then anywhere. Then the belief, large and alone.
 *
 * Motion: the lit points and rings arrive once when the field scrolls in;
 * nothing loops. Under prefers-reduced-motion everything is drawn at once.
 * The field is decorative (aria-hidden); every idea is also real text.
 */

const W = 1200;
const H = 440;
const CX = 330;
const CY = 230;
const RINGS = [70, 230, 640];

/** Small deterministic PRNG so the field is identical on every render. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const FIELD = (() => {
  const rand = rng(11464);
  const dim: { x: number; y: number; r: number; o: number }[] = [];
  const cols = 48;
  const rows = 16;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (rand() < 0.42) continue;
      const x = (c + 0.5 + (rand() - 0.5) * 0.9) * (W / cols);
      const y = (r + 0.5 + (rand() - 0.5) * 0.9) * (H / rows);
      if (Math.hypot(x - CX, y - CY) < RINGS[0] + 6) continue;
      dim.push({ x, y, r: 1.1 + rand() * 0.9, o: 0.18 + rand() * 0.22 });
    }
  }
  const lit: { x: number; y: number }[] = [];
  while (lit.length < 25) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * (RINGS[0] - 14);
    const x = CX + Math.cos(a) * d;
    const y = CY + Math.sin(a) * d * 0.9;
    if (lit.every((p) => Math.hypot(p.x - x, p.y - y) > 11)) lit.push({ x, y });
  }
  return { dim, lit };
})();

const Field: React.FC = () => {
  const reduce = useReducedMotion();
  // One observer on the whole field (not per shape: a 1280-unit ring never reaches a visibility threshold).
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const on = reduce || inView;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="block h-[260px] w-full sm:h-auto"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMinYMid slice"
    >
      <defs>
        <radialGradient id="ambition-glow" cx={CX} cy={CY} r={RINGS[1]} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--mm-system)' }} stopOpacity="0.2" />
          <stop offset="1" style={{ stopColor: 'var(--mm-system)' }} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill="url(#ambition-glow)" />
      {FIELD.dim.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} className="fill-mm-muted" opacity={p.o} />
      ))}
      {RINGS.map((r, i) => (
        <motion.circle
          key={r}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          className="stroke-mm-link"
          strokeOpacity={0.55 - i * 0.15}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={reduce ? false : { scale: 0.55, opacity: 0 }}
          animate={on ? { scale: 1, opacity: 1 } : { scale: 0.55, opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.5 + i * 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        />
      ))}
      {copy.ringLabels.map((label, i) => (
        <text
          key={label}
          x={CX + RINGS[i] + 10}
          y={CY + 4}
          className="fill-mm-link font-mono max-lg:hidden"
          style={{ fontSize: 13 }}
        >
          {label}
        </text>
      ))}
      {FIELD.lit.map((p, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.5, delay: i * 0.03 }}
        >
          <circle cx={p.x} cy={p.y} r={7} className="fill-mm-system" opacity={0.2} />
          <circle cx={p.x} cy={p.y} r={2.6} className="fill-mm-ink" />
        </motion.g>
      ))}
    </svg>
  );
};

/** Ring glyphs that match the field: small, larger, largest. */
const RingGlyph: React.FC<{ step: number }> = ({ step }) => {
  const size = 14 + step * 8;
  return (
    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center" aria-hidden="true">
      <span
        className={cn('block rounded-full border', step === 0 ? 'border-mm-link bg-mm-system-soft' : 'border-mm-link opacity-80')}
        style={{ width: size, height: size }}
      />
    </span>
  );
};

export const AmbitionWorldSection: React.FC = () => (
  <section
    id="ambition"
    aria-labelledby="ambition-title"
    className="mm-tone-navy relative scroll-mt-16 overflow-hidden bg-mm-surface text-mm-body md:scroll-mt-20"
  >
    <div className={cn(dEdge, 'relative pt-24 md:pt-32 lg:pt-36')}>
      <h2 id="ambition-title" className={cn(dH2, 'max-w-4xl')}>
        {copy.title}
      </h2>
      <p className="mm-lead mt-6 max-w-2xl text-pretty">{copy.support}</p>
    </div>

    <div className="relative mx-auto mt-10 w-full max-w-[90rem] md:mt-4">
      <Field />
    </div>

    <div className={cn(dEdge, 'relative')}>
      <h3 className="sr-only">{copy.horizonLabel}</h3>
      <ol className="grid gap-6 border-t border-mm-line pt-8 sm:grid-cols-3 sm:gap-8">
        {copy.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <RingGlyph step={i} />
            <div>
              <p className="text-[1.125rem] font-semibold leading-snug text-mm-ink">{step.title}</p>
              <p className="mm-body mt-1 max-w-[30ch] text-pretty">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="pb-24 pt-28 md:pb-32 md:pt-40">
        <p className={cn(dMono, 'text-mm-muted')} aria-hidden="true">
          02:00
        </p>
        <p
          className={cn(
            dDisplay,
            'mt-5 max-w-5xl text-[2.5rem] leading-[1.02] text-mm-ink sm:text-[3.75rem] lg:text-[5.25rem] text-balance'
          )}
        >
          {copy.beliefLead}
          <br />
          {copy.beliefEnd}
        </p>
      </div>
    </div>
  </section>
);

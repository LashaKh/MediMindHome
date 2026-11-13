import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ambition as copy } from '../../content/landing.v2.lane-d';
import { dEdge, dH2 } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * Where this goes (#ambition): the page's last statement before the ask.
 * Same tone as the hero: light in the light theme, ink in the dark theme.
 * One network on a dotted globe. The globe's dots are laid out in rings
 * around the place it started, so the whole world reads as organised around
 * that network: 25 lit hospitals linked to their neighbours, a faint blue
 * region with five routes of expansion, then every other hospital out to the
 * horizon (smaller and fainter as the globe curves away). Three labels name
 * the rings; no country names.
 *
 * Motion: the network, region, rings and routes arrive once when the field
 * scrolls in; nothing loops. Under prefers-reduced-motion everything is drawn
 * at once. The field is decorative (aria-hidden); every idea is also real text.
 */

const W = 1200;
const H = 430;
/** The globe: a large sphere seen from the front, its upper cap filling the field. */
const SC = { x: 640, y: 1130 };
const R = 1040;
/** Angular spacing of the dots (radians): about 15px at the front of the globe. */
const STEP = 15 / R;
/** Where the network sits on the globe (projected), and the rings around it. */
const CORE = { x: 380, y: 300 };
const NET_RINGS = 6.6; // in dot rings: the 25 hospitals
const REGION_RINGS = 13; // the region
type V3 = [number, number, number];

/** Small deterministic PRNG so the field is identical on every render. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Unit vector of the network on the sphere (y up, z toward the viewer). */
const P: V3 = (() => {
  const px = (CORE.x - SC.x) / R;
  const py = (SC.y - CORE.y) / R;
  return [px, py, Math.sqrt(Math.max(0, 1 - px * px - py * py))];
})();
const U = norm(cross(P, [0, 0, 1]));
const Vb = cross(P, U);

/** A point `theta` radians from the network, at azimuth `phi`, projected. z > 0 faces the viewer. */
const at = (theta: number, phi: number) => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const d: V3 = [
    c * P[0] + s * (Math.cos(phi) * U[0] + Math.sin(phi) * Vb[0]),
    c * P[1] + s * (Math.cos(phi) * U[1] + Math.sin(phi) * Vb[1]),
    c * P[2] + s * (Math.cos(phi) * U[2] + Math.sin(phi) * Vb[2]),
  ];
  return { x: SC.x + R * d[0], y: SC.y - R * d[1], z: d[2] };
};
const inField = (p: { x: number; y: number; z: number }, m = 8) => p.z > 0.02 && p.x > -m && p.x < W + m && p.y > -m && p.y < H + m;

/** Rings of dots around the network: the whole globe organised around where it started. */
const FIELD = (() => {
  const near: { x: number; y: number; z: number }[] = [];
  const region: { x: number; y: number; z: number }[] = [];
  const world: { x: number; y: number; z: number }[] = [];
  const maxRing = Math.ceil(1.75 / STEP);
  for (let k = 0; k <= maxRing; k++) {
    const theta = k * STEP;
    const count = k === 0 ? 1 : Math.max(6, Math.round((2 * Math.PI * Math.sin(theta)) / STEP));
    const turn = (k % 2) * (Math.PI / count); // stagger alternate rings
    for (let j = 0; j < count; j++) {
      const p = at(theta, turn + (j / count) * 2 * Math.PI);
      if (!inField(p)) continue;
      if (k <= 6) near.push(p);
      else if (k <= REGION_RINGS) region.push(p);
      else world.push(p);
    }
  }
  // The 25 hospitals: the first dot and 24 others scattered through the network ring, like a real network (seeded, identical every render).
  const rand = rng(11464);
  const order = near.slice(1).map((p) => ({ p, key: rand() })).sort((a, b) => a.key - b.key);
  const lit = [near[0], ...order.slice(0, 24).map((o) => o.p)];
  order.slice(24).forEach((o) => region.push(o.p));
  // The network's own links: each hospital to its two nearest neighbours.
  const links: [number, number][] = [];
  lit.forEach((a, i) => {
    lit
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.j !== i)
      .sort((m, n) => m.d - n.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        if (!links.some(([m, n]) => (m === j && n === i) || (m === i && n === j))) links.push([i, j]);
      });
  });
  return { lit, region, world, links };
})();

/** A ring at `theta` around the network, as a path through its visible part. */
const ringPath = (theta: number) => {
  let d = '';
  let pen = false;
  for (let j = 0; j <= 360; j++) {
    const p = at(theta, (j / 360) * 2 * Math.PI);
    if (inField(p, 40)) {
      d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      pen = true;
    } else pen = false;
  }
  return d;
};
/** The visible point of a ring that lies furthest along (dx, dy): where its label goes. */
const ringLabelAt = (theta: number, dx: number, dy: number) => {
  let best = at(theta, 0);
  let score = -Infinity;
  for (let j = 0; j < 360; j++) {
    const p = at(theta, (j / 360) * 2 * Math.PI);
    if (inField(p, -24) && p.x * dx + p.y * dy > score) {
      score = p.x * dx + p.y * dy;
      best = p;
    }
  }
  return best;
};

/** The globe's horizon: the visible arc of its edge, and where "Every hospital" sits on it. */
const HORIZON = `M ${SC.x - R} ${SC.y} A ${R} ${R} 0 0 1 ${SC.x + R} ${SC.y}`;
const HORIZON_LABEL = { x: W - 28, y: SC.y - Math.sqrt(R * R - (W - 28 - SC.x) ** 2) - 12 };

/** Five routes of expansion: arcs from the network out to the region's edge. */
const ROUTES = [0.35, 1.25, 2.4, 3.6, 5.1].map((phi) => {
  let d = '';
  for (let k = 0; k <= 24; k++) {
    const p = at(((REGION_RINGS + 1.5) * STEP * k) / 24, phi);
    d += `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  }
  const end = at((REGION_RINGS + 1.5) * STEP, phi);
  return { d, end };
}).filter((r) => inField(r.end));

const Field: React.FC = () => {
  const reduce = useReducedMotion();
  // One observer on the whole field (a ring path never reaches a visibility threshold on its own).
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const on = reduce || inView;
  const ease = [0.2, 0.7, 0.2, 1] as const;
  const netLabel = ringLabelAt(NET_RINGS * STEP, 0.7, 0.7);
  const regionLabel = ringLabelAt(REGION_RINGS * STEP + STEP * 0.5, 0.8, -0.6);
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      // Phones: the field is drawn wider than the screen and shifted so the network sits left of centre with its region in view.
      className="-ml-[16%] block h-auto w-[170%] max-w-none sm:ml-0 sm:w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="ambition-glow" cx={CORE.x} cy={CORE.y} r={340} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--mm-system)' }} stopOpacity="0.22" />
          <stop offset="0.45" style={{ stopColor: 'var(--mm-system)' }} stopOpacity="0.06" />
          <stop offset="1" style={{ stopColor: 'var(--mm-system)' }} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ambition-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--mm-surface)' }} stopOpacity="0" />
          <stop offset="1" style={{ stopColor: 'var(--mm-surface)' }} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Light rising from the network. */}
      <rect x="0" y="0" width={W} height={H} fill="url(#ambition-glow)" className="opacity-70 dark:opacity-100" />

      {/* The globe's edge: every hospital, out to the horizon. */}
      <path d={HORIZON} className="stroke-mm-link" strokeOpacity="0.35" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />

      {/* Every other hospital: dim dots, smaller and fainter toward the horizon. */}
      {FIELD.world.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.55 + p.z * 1.25} className="fill-mm-muted" opacity={0.12 + p.z * 0.42} />
      ))}

      {/* The region: the same dots, lit faintly blue. */}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 1.4, delay: 0.9, ease }}>
        {FIELD.region.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={0.8 + p.z * 1.3} className="fill-mm-system" opacity={0.28 + p.z * 0.4} />
        ))}
      </motion.g>

      {/* Rings: the network, then the region. */}
      {[NET_RINGS, REGION_RINGS + 0.5].map((rings, i) => (
        <motion.path
          key={rings}
          d={ringPath(rings * STEP)}
          fill="none"
          className="stroke-mm-link"
          strokeOpacity={i === 0 ? 0.7 : 0.5}
          strokeWidth="1"
          strokeDasharray={i === 0 ? undefined : '2 4'}
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.3 + i * 0.6, ease }}
        />
      ))}

      {/* Routes of expansion, drawn once. */}
      {ROUTES.map((route, i) => (
        <g key={i}>
          <motion.path
            d={route.d}
            fill="none"
            className="stroke-mm-system"
            strokeWidth="1.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: on ? 1 : 0 }}
            transition={{ duration: 1.3, delay: 0.8 + i * 0.12, ease }}
          />
          <motion.circle
            cx={route.end.x}
            cy={route.end.y}
            r="3.5"
            className="fill-mm-surface stroke-mm-system"
            strokeWidth="1.5"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 2 + i * 0.12 }}
          />
        </g>
      ))}

      {/* The network running today: 25 hospitals, linked. */}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.8, ease }}>
        {FIELD.links.map(([a, b], i) => (
          <line
            key={i}
            x1={FIELD.lit[a].x}
            y1={FIELD.lit[a].y}
            x2={FIELD.lit[b].x}
            y2={FIELD.lit[b].y}
            className="stroke-mm-system"
            strokeOpacity="0.6"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {FIELD.lit.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={6} className="fill-mm-system opacity-[0.16] dark:opacity-25" />
            <circle cx={p.x} cy={p.y} r={2.4} className="fill-mm-system dark:fill-mm-ink" />
          </g>
        ))}
      </motion.g>

      {/* The globe sinks into the page at the bottom edge. */}
      <rect x="0" y={H - 70} width={W} height="70" fill="url(#ambition-fade)" />

      {/* Ring labels. */}
      <text x={netLabel.x + 12} y={netLabel.y + 4} className="fill-mm-link font-mono max-sm:hidden" style={{ fontSize: 12.5 }}>
        {copy.ringLabels[0]}
      </text>
      <text x={regionLabel.x + 12} y={regionLabel.y + 4} className="fill-mm-link font-mono max-sm:hidden" style={{ fontSize: 12.5 }}>
        {copy.ringLabels[1]}
      </text>
      <text x={HORIZON_LABEL.x} y={HORIZON_LABEL.y} textAnchor="end" className="fill-mm-link font-mono max-sm:hidden" style={{ fontSize: 12.5 }}>
        {copy.ringLabels[2]}
      </text>
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
    <div className={cn(dEdge, 'relative pt-20 md:pt-28')}>
      <h2 id="ambition-title" className={cn(dH2, 'max-w-[18ch] lg:max-w-[24ch]')}>
        {copy.title}
      </h2>
    </div>

    <div className="relative mx-auto -mt-2 w-full max-w-[110rem] md:-mt-6">
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
              <p className="mm-body mt-1 max-w-[32ch] text-pretty">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* The belief line lives once, in BeliefSection (founder: say more with less). */}
      <div className="pb-16 md:pb-24" aria-hidden="true" />
    </div>
  </section>
);

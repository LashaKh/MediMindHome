import React from 'react';
import { anatomy, type LayerId } from '../../content/landing.v2.b';

/**
 * Lane B. The operating system drawn as one living cross-section, like a scan
 * through a body made of software (viewBox centred on 0,0):
 *
 *   Heart   the record at the core: concentric record layers, a slow beat,
 *           FHIR R4 resource names engraved around it.
 *   Muscle  the command ring: 96 actuator ticks, one audited door.
 *   Nerve   eight fibres spiralling out from the heart through the muscle to
 *           the skin; blue pulses travel along them as things change.
 *   Skin    the outer surface where every role meets the system. People
 *           (amber, they decide) and devices (blue) sit on it.
 *   Brain   the reading ring around everything, with a slow scan that sweeps
 *           the whole body. Part of the ring is dashed: partly in development.
 *
 * `active` lights one part and dims the rest; null shows the whole body lit.
 * Pointer events over a part report it. Motion is CSS/SMIL and is dropped
 * entirely when `still` is true (reduced motion), leaving a complete picture.
 */

interface Props {
  active: LayerId | null;
  still: boolean;
  onHover: (id: LayerId | null) => void;
  onPick: (id: LayerId) => void;
  className?: string;
}

const SYS = 'var(--lb-system)';
const HUMAN = 'var(--lb-human)';
const INK = 'var(--mm-ink)';

/** Point at radius r, angle deg measured clockwise from 12 o'clock. */
const P = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [+(r * Math.sin(a)).toFixed(2), +(-r * Math.cos(a)).toFixed(2)];
};
const pt = (r: number, deg: number) => P(r, deg).join(' ');
/** Clockwise arc at radius r from angle a to angle b (degrees, b > a). */
const arc = (r: number, a: number, b: number) =>
  `M${pt(r, a)} A${r} ${r} 0 ${b - a > 180 ? 1 : 0} 1 ${pt(r, b)}`;
/** A filled ring between r1 and r2, for hit areas. */
const annulus = (r1: number, r2: number) =>
  `M${-r2} 0 A${r2} ${r2} 0 1 0 ${r2} 0 A${r2} ${r2} 0 1 0 ${-r2} 0 Z M${-r1} 0 A${r1} ${r1} 0 1 1 ${r1} 0 A${r1} ${r1} 0 1 1 ${-r1} 0 Z`;

const R = { core: 96, muscleIn: 150, muscleOut: 186, skin: 330, label: 377, brain: 438 };

/** The roles on the skin, clockwise from just left of 12 o'clock. */
const ROLE_ANGLES = [337.5, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5];

/** How far each fibre turns on its way out, and how early: no two alike. */
const BEND = [44, 27, 53, 33, 41, 23, 49, 31];
const REACH = [172, 196, 168, 204, 180, 190, 166, 200];
/** A nerve fibre from the heart to role i on the skin: a gentle clockwise spiral. */
const nerve = (i: number) => {
  const deg = ROLE_ANGLES[i];
  const b = BEND[i];
  return `M${pt(R.core + 4, deg - b)} C${pt(REACH[i], deg - b * 0.86)} ${pt(256 + (i % 3) * 8, deg - b * 0.22)} ${pt(R.skin, deg)}`;
};
const PULSE_DUR = [3.4, 4.1, 3.0, 3.8, 3.2, 4.4, 3.6, 3.1];
/** Two fine branches where the fibre meets the skin. */
const branches = (deg: number) => [
  `M${pt(296, deg - 4)} Q${pt(318, deg - 6)} ${pt(R.skin, deg - 9)}`,
  `M${pt(304, deg - 2)} Q${pt(320, deg + 3)} ${pt(R.skin, deg + 7)}`,
];

/** FHIR R4 resource types engraved around the record core. */
const FHIR =
  'Patient · Encounter · Observation · Condition · MedicationRequest · ServiceRequest · DiagnosticReport · Procedure · Coverage · Claim · ';

const TICKS = Array.from({ length: 96 }, (_, i) => i * 3.75);
/** The audited door: the one gap in the command ring every action passes. */
const DOOR = 116.25;
const isDoor = (deg: number) => Math.abs(deg - DOOR) < 5;

export const AnatomyOsOrganism: React.FC<Props> = ({ active, still, onHover, onPick, className }) => {
  const dim = (id: LayerId) => (active !== null && active !== id ? 'lb-ana-part lb-ana-dim' : 'lb-ana-part');
  const glow = (id: LayerId) => (active === id ? 'url(#lb-ana-glow)' : undefined);
  const hit = (id: LayerId) => ({
    'data-layer': id,
    onMouseEnter: () => onHover(id),
    onMouseLeave: () => onHover(null),
    onClick: () => onPick(id),
  });
  const roles = anatomy.figureLabels.roles;

  return (
    <div className={className} role="img" aria-label={anatomy.figureAlt}>
      <svg viewBox="-500 -500 1000 1000" className="block h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="lb-ana-disc" cx="0" cy="0" r={R.skin + 8} fx={-110} fy={-140} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: 'var(--lb-ana-disc-hi)' }} />
            <stop offset="0.72" style={{ stopColor: 'var(--lb-ana-disc-mid)' }} />
            <stop offset="1" style={{ stopColor: 'var(--lb-ana-disc-lo)' }} />
          </radialGradient>
          <radialGradient id="lb-ana-core" cx="0" cy="0" r={R.core} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: 'var(--lb-system)', stopOpacity: 0.34 }} />
            <stop offset="0.55" style={{ stopColor: 'var(--lb-system)', stopOpacity: 0.12 }} />
            <stop offset="1" style={{ stopColor: 'var(--lb-system)', stopOpacity: 0 }} />
          </radialGradient>
          <linearGradient id="lb-ana-scan" x1="0" y1={-R.core} x2="0" y2={-R.brain} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: 'var(--lb-system)', stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: 'var(--lb-system)', stopOpacity: 0.9 }} />
          </linearGradient>
          <filter id="lb-ana-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lb-ana-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          {ROLE_ANGLES.map((_, i) => (
            <path key={i} id={`lb-ana-n${i}`} d={nerve(i)} />
          ))}
          <path id="lb-ana-fhir" d={`M0 ${-84} A84 84 0 1 1 0 84 A84 84 0 1 1 0 ${-84}`} />
          <path id="lb-ana-top" d={`M${-R.label} 0 A${R.label} ${R.label} 0 0 1 ${R.label} 0`} />
          <path id="lb-ana-bot" d={`M${-R.label} 0 A${R.label} ${R.label} 0 0 0 ${R.label} 0`} />
        </defs>

        {/* Depth: a soft shadow (day) or glow (night) under the body, then the body itself. */}
        <circle cx="0" cy="26" r={R.skin} fill="var(--lb-ana-shadow)" filter="url(#lb-ana-soft)" />
        <circle cx="0" cy="0" r={R.skin + 8} fill="url(#lb-ana-disc)" />

        {/* Atlas registration: hairline crosshair and a faint field of rings. */}
        <g stroke={INK} strokeOpacity="0.1" strokeWidth="1" fill="none">
          {[240].map((r) => (
            <circle key={r} r={r} strokeDasharray="1 5" />
          ))}
          {[0, 90, 180, 270].map((d) => (
            <path key={d} d={`M${pt(474, d)} L${pt(492, d)}`} strokeOpacity="0.35" />
          ))}
        </g>

        {/* ── Brain: the reading ring around everything ───────────────── */}
        <g className={dim('brain')} filter={glow('brain')}>
          <g stroke={INK} fill="none">
            {Array.from({ length: 120 }, (_, i) => i * 3).map((d) => (
              <path
                key={d}
                d={`M${pt(R.brain + 10, d)} L${pt(R.brain + (d % 30 === 0 ? 26 : 17), d)}`}
                strokeWidth={d % 30 === 0 ? 1.4 : 0.8}
                strokeOpacity={d % 30 === 0 ? 0.5 : 0.22}
              />
            ))}
          </g>
          {/* Built (solid) and in development (dashed). */}
          <path d={arc(R.brain, -70, 200)} fill="none" stroke={SYS} strokeWidth="1.5" strokeOpacity="0.75" />
          <path d={arc(R.brain, 200, 290)} fill="none" stroke={SYS} strokeWidth="1.5" strokeOpacity="0.55" strokeDasharray="2 7" strokeLinecap="round" />
          <circle cx={P(R.brain, 200)[0]} cy={P(R.brain, 200)[1]} r="3.5" fill="var(--lb-ana-disc-lo)" stroke={SYS} strokeWidth="1.5" />
          <g className={still ? undefined : 'lb-ana-spin'}>
            {[0.11, 0.075, 0.045, 0.02].map((o, i) => (
              <path
                key={o}
                d={`M0 0 L${pt(R.brain, -i * 7)} A${R.brain} ${R.brain} 0 0 0 ${pt(R.brain, -(i + 1) * 7)} Z`}
                fill={SYS}
                fillOpacity={o}
              />
            ))}
            <path d={`M0 ${-R.core - 6} L0 ${-R.brain}`} stroke="url(#lb-ana-scan)" strokeWidth="1.5" />
            <path d={arc(R.brain, -22, 0)} fill="none" stroke={SYS} strokeWidth="4" strokeLinecap="round" />
            <circle cx="0" cy={-R.brain} r="6" fill={SYS} />
            <circle cx="0" cy={-R.brain} r="13" fill="none" stroke={SYS} strokeOpacity="0.4" />
          </g>
        </g>

        {/* ── Nerve: fibres from the heart to every role on the skin ─────── */}
        <g className={dim('nerve')} filter={glow('nerve')} fill="none" strokeLinecap="round">
          {ROLE_ANGLES.map((deg, i) => (
            <g key={deg}>
              <use href={`#lb-ana-n${i}`} stroke={SYS} strokeOpacity="0.1" strokeWidth="5" />
              <use href={`#lb-ana-n${i}`} stroke={SYS} strokeOpacity="0.9" strokeWidth="1.3" />
              {branches(deg).map((d) => (
                <path key={d} d={d} stroke={SYS} strokeOpacity="0.6" strokeWidth="0.9" />
              ))}
            </g>
          ))}
          {!still && ROLE_ANGLES.map((_, i) => <Pulse key={`pulse-${i}`} i={i} />)}
        </g>

        {/* ── Muscle: the command ring, every action through one door ────── */}
        <g className={dim('muscle')} filter={glow('muscle')}>
          <path d={annulus(R.muscleIn - 6, R.muscleOut + 6)} fillRule="evenodd" fill="var(--lb-ana-band)" />
          <circle r={R.muscleIn - 6} fill="none" stroke={INK} strokeOpacity="0.16" strokeWidth="1" />
          <circle r={R.muscleOut + 6} fill="none" stroke={INK} strokeOpacity="0.16" strokeWidth="1" />
          <g strokeLinecap="round">
            {TICKS.filter((d) => !isDoor(d)).map((d, i) => {
              const major = i % 4 === 0;
              return (
                <path
                  key={d}
                  className={still ? undefined : 'lb-ana-act'}
                  style={still ? undefined : { animationDelay: `${(-(d / 360) * 6).toFixed(2)}s` }}
                  d={`M${pt(major ? R.muscleIn : R.muscleIn + 6, d)} L${pt(major ? R.muscleOut : R.muscleOut - 6, d)}`}
                  stroke={major ? SYS : INK}
                  strokeOpacity={major ? 0.9 : 0.38}
                  strokeWidth={major ? 2.4 : 1.3}
                />
              );
            })}
          </g>
          {/* The door: the one opening in the ring, bracketed and lit. */}
          <g stroke={SYS} strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d={arc(R.muscleIn - 6, DOOR - 5, DOOR + 5)} />
            <path d={arc(R.muscleOut + 6, DOOR - 5, DOOR + 5)} />
          </g>
          <circle cx={P(168, DOOR)[0]} cy={P(168, DOOR)[1]} r="4.5" fill={SYS} />
          <circle cx={P(168, DOOR)[0]} cy={P(168, DOOR)[1]} r="10" fill="none" stroke={SYS} strokeOpacity="0.35" />
        </g>

        {/* ── Heart: the record at the core ──────────────────────────────── */}
        <g className={dim('heart')} filter={glow('heart')}>
          <circle r={R.core} fill="url(#lb-ana-core)" />
          <circle r={R.core} fill="none" stroke={SYS} strokeOpacity="0.55" strokeWidth="1.2" />
          {[22, 36, 50, 64].map((r, i) => (
            <circle key={r} r={r} fill="none" stroke={SYS} strokeOpacity={0.85 - i * 0.16} strokeWidth={i === 0 ? 2 : 1} />
          ))}
          <text className="lb-mono lb-ana-micro" fill={INK} fillOpacity="0.62">
            <textPath href="#lb-ana-fhir" textLength={2 * Math.PI * 84 - 6} lengthAdjust="spacing">
              {FHIR}
            </textPath>
          </text>
          {!still && <circle r="22" fill="none" stroke={SYS} strokeWidth="1.5" className="lb-ana-ripple" />}
          <circle r="9" fill={SYS} className={still ? undefined : 'lb-heartbeat'} />
        </g>

        {/* ── Skin: the surface where every role meets the system ────────── */}
        <g className={dim('skin')} filter={glow('skin')}>
          <g stroke={INK} strokeOpacity="0.2" strokeWidth="0.75">
            {Array.from({ length: 180 }, (_, i) => i * 2).map((d) => (
              <path key={d} d={`M${pt(R.skin - 7, d)} L${pt(R.skin + 7, d)}`} />
            ))}
          </g>
          <circle r={R.skin - 8} fill="none" stroke={INK} strokeOpacity="0.32" strokeWidth="1" />
          <circle r={R.skin + 8} fill="none" stroke={INK} strokeOpacity="0.55" strokeWidth="1.6" />
          {ROLE_ANGLES.map((deg, i) => {
            const [x, y] = P(R.skin, deg);
            const person = roles[i] !== 'Devices';
            const c = person ? HUMAN : SYS;
            const bottom = deg > 90 && deg < 270;
            const offset = bottom ? ((270 - deg) / 180) * 100 : (((deg + 90) % 360) / 180) * 100;
            return (
              <g key={roles[i]}>
                <circle cx={x} cy={y} r="15" fill="var(--lb-ana-disc-lo)" stroke={c} strokeOpacity="0.45" strokeWidth="1" />
                {person ? <circle cx={x} cy={y} r="6.5" fill={c} /> : <circle cx={x} cy={y} r="5.5" fill="none" stroke={c} strokeWidth="2" />}
                <text className="lb-mono lb-ana-role" fill={INK} dy="0.35em">
                  <textPath href={bottom ? '#lb-ana-bot' : '#lb-ana-top'} startOffset={`${offset}%`} textAnchor="middle">
                    {roles[i]}
                  </textPath>
                </text>
              </g>
            );
          })}
        </g>

        {/* Hit areas (invisible): outermost first so inner parts win where they overlap. */}
        <g fill="transparent" stroke="none" style={{ cursor: 'pointer' }}>
          <path d={annulus(R.brain - 22, R.brain + 34)} fillRule="evenodd" {...hit('brain')} />
          <path d={annulus(R.skin - 26, R.label + 22)} fillRule="evenodd" {...hit('skin')} />
          {ROLE_ANGLES.map((_, i) => (
            <use key={i} href={`#lb-ana-n${i}`} fill="none" stroke="transparent" strokeWidth="26" {...hit('nerve')} />
          ))}
          <path d={annulus(R.muscleIn - 12, R.muscleOut + 14)} fillRule="evenodd" {...hit('muscle')} />
          <circle r={R.core + 4} {...hit('heart')} />
        </g>
      </svg>
    </div>
  );
};

/** One change travelling out along nerve i: a soft halo and a bright point. */
const Pulse: React.FC<{ i: number }> = ({ i }) => {
  const dur = `${PULSE_DUR[i]}s`;
  const begin = `${-((i * 1.37) % PULSE_DUR[i]).toFixed(2)}s`;
  const motion = (
    <>
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1">
        <mpath href={`#lb-ana-n${i}`} />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.86;1" dur={dur} begin={begin} repeatCount="indefinite" />
    </>
  );
  return (
    <g>
      <circle r="10" fill={SYS} fillOpacity="0.2">
        {motion}
      </circle>
      <circle r="3.6" fill={SYS}>
        {motion}
      </circle>
    </g>
  );
};

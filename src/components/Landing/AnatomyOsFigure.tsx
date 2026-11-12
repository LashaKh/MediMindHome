import React from 'react';
import { anatomy, type LayerId } from '../../content/landing.v2.b';

/**
 * The operating system as a body: a figure in fine lines inside a circle.
 * Heart at the centre (the record), Brain in the head, Muscle in the limbs
 * reaching out to the world, Skin as the circle where people meet it, Nerve
 * running through everything. The active layer lights; the rest stays dim
 * but visible. Pointer events report the layer under the cursor.
 */

interface Props {
  active: LayerId | null;
  onHover: (id: LayerId | null) => void;
  onPick: (id: LayerId) => void;
  className?: string;
}

const SYS = 'var(--lb-system)';
const LIMBS = ['M190 194 L118 206 L60 214', 'M290 194 L362 206 L420 214', 'M216 342 L202 428 L192 500', 'M264 342 L278 428 L288 500'];
const DIM = 'var(--mm-body)';

export const AnatomyOsFigure: React.FC<Props> = ({ active, onHover, onPick, className }) => {
  const on = (id: LayerId) => active === null || active === id;
  const layer = (id: LayerId) => ({
    'data-layer': id,
    style: { opacity: on(id) ? 1 : 0.22, transition: 'opacity 450ms ease, filter 450ms ease', cursor: 'pointer' } as React.CSSProperties,
    filter: active === id ? 'url(#lb-glow)' : undefined,
    onMouseEnter: () => onHover(id),
    onMouseLeave: () => onHover(null),
    onClick: () => onPick(id),
  });
  const stroke = (id: LayerId) => (active === id ? SYS : DIM);
  const { world, people } = anatomy.figureLabels;

  return (
    <div className={className} role="img" aria-label={anatomy.figureAlt}>
      <svg viewBox="0 0 480 540" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <filter id="lb-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Skin: the boundary where staff and patients meet the system. */}
        <g {...layer('skin')}>
          <circle cx="240" cy="282" r="226" fill="none" stroke={stroke('skin')} strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
          {[
            [92, 108, people[0]],
            [388, 108, people[1]],
            [92, 456, people[2]],
            [388, 456, people[3]],
          ].map(([x, y, label]) => (
            <g key={label as string}>
              <circle cx={x} cy={y} r="6" fill={stroke('skin')} />
              <text
                x={(x as number) < 240 ? (x as number) + 14 : (x as number) - 14}
                y={(y as number) + 5}
                textAnchor={(x as number) < 240 ? 'start' : 'end'}
                className="lb-mono max-sm:hidden"
                fontSize="14"
                fill="currentColor"
                style={{ color: 'var(--mm-ink)' }}
              >
                {label}
              </text>
            </g>
          ))}
        </g>

        {/* The torso outline: structure, not a layer. */}
        <path
          d="M184 190 Q240 176 296 190 L288 336 Q240 356 192 336 Z"
          fill="none"
          stroke="var(--mm-line)"
          strokeWidth="1.5"
          aria-hidden="true"
          style={{ opacity: active ? 0.7 : 1 }}
        />

        {/* Muscle: limbs that reach out and act in the world. */}
        <g {...layer('muscle')} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {LIMBS.map((d) => (
            <g key={d}>
              <path d={d} stroke={stroke('muscle')} strokeWidth="14" />
              <path d={d} stroke="var(--mm-surface)" strokeWidth="11" />
            </g>
          ))}
          {[
            [56, 188, world[0], 'start'],
            [56, 248, world[1], 'start'],
            [424, 188, world[2], 'end'],
            [424, 248, world[3], 'end'],
          ].map(([x, y, label, anchor]) => (
            <text
              key={label as string}
              x={x as number}
              y={y as number}
              textAnchor={anchor as 'start' | 'end'}
              className="lb-mono max-sm:hidden"
              fontSize="14"
              stroke="none"
              fill="currentColor"
              style={{ color: 'var(--mm-ink)' }}
            >
              {label}
            </text>
          ))}
          <circle cx="56" cy="214" r="5" fill={stroke('muscle')} stroke="none" />
          <circle cx="424" cy="214" r="5" fill={stroke('muscle')} stroke="none" />
        </g>

        {/* Nerve: signals running through every part. */}
        <g {...layer('nerve')} fill="none" strokeLinecap="round">
          {[
            'M240 160 L240 360',
            'M240 196 L190 200 L120 212 L60 220',
            'M240 196 L290 200 L360 212 L420 220',
            'M240 350 L222 360 L206 430 L198 496',
            'M240 350 L258 360 L274 430 L282 496',
          ].map((d) => (
            <g key={d}>
              <path d={d} stroke={stroke('nerve')} strokeWidth="1.25" opacity="0.7" />
              <path d={d} stroke={SYS} strokeWidth="2.5" className="lb-signal" />
            </g>
          ))}
        </g>

        {/* Brain: reasoning across the record. */}
        <g {...layer('brain')}>
          <circle cx="240" cy="116" r="40" fill="none" stroke={stroke('brain')} strokeWidth="1.75" />
          <g stroke={stroke('brain')} strokeWidth="1.25" fill="none">
            <path d="M222 104 L240 92 L258 106 L250 128 L228 128 Z M222 104 L250 128 M240 92 L228 128 M258 106 L228 128" />
          </g>
          {[
            [222, 104],
            [240, 92],
            [258, 106],
            [250, 128],
            [228, 128],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={stroke('brain')} />
          ))}
        </g>

        {/* Heart: the record itself, at the centre. */}
        <g {...layer('heart')}>
          <circle cx="254" cy="236" r="30" fill="none" stroke={stroke('heart')} strokeWidth="1.25" opacity="0.6" />
          <circle cx="254" cy="236" r="15" fill={active === 'heart' || active === null ? SYS : DIM} className="lb-heartbeat" />
        </g>
      </svg>
    </div>
  );
};

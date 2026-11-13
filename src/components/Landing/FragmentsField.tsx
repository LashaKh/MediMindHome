import React, { useEffect, useRef, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { fragmentNames, fragments } from '../../content/landing.v2.b';

/**
 * The forty-system hospital, drawn: one patient in the middle, one tile per
 * program scattered around them, the patient's links to each program broken,
 * and the gaps labelled where work is retyped, phoned through or carried.
 * As `progress` runs from 0 to 1 the gaps close and the tiles gather around
 * the patient into one block: one record, one system. With `progress` fixed
 * at 0 (reduced motion) it is a complete static picture of the problem.
 */

interface Layout {
  cols: number;
  rows: number;
  /** Cells the patient takes in the middle row. */
  pc: number;
  tileW: number;
  tileH: number;
  gap: number;
  /** Gap annotations as [column, row boundary]. */
  notes: [number, number][];
}

function layoutFor(width: number): Layout {
  if (width >= 900) {
    return { cols: 6, rows: 7, pc: 2, tileW: Math.min(150, (width - 60) / 6), tileH: 44, gap: 4, notes: [[0, 0], [4, 1], [1, 2], [5, 3], [0, 4], [3, 5]] };
  }
  if (width >= 560) {
    return { cols: 6, rows: 7, pc: 2, tileW: Math.min(108, (width - 40) / 6), tileH: 36, gap: 4, notes: [[0, 0], [4, 1], [1, 4], [4, 5]] };
  }
  return { cols: 3, rows: 9, pc: 1, tileW: Math.min(104, (width - 12) / 3), tileH: 32, gap: 3, notes: [[1, 0], [1, 2], [1, 6]] };
}

/** Deterministic noise in [-1, 1]. */
const noise = (i: number, salt: number) => {
  const h = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (h - Math.floor(h)) * 2 - 1;
};

export const FragmentsField: React.FC<{ progress: MotionValue<number>; still: boolean; className?: string }> = ({
  progress,
  still,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { cols, rows, pc, tileW, tileH, gap, notes } = layoutFor(size.w || 1024);
  const W = size.w || 1;
  const H = size.h || 1;
  const blockW = cols * tileW + (cols - 1) * gap;
  const blockH = rows * tileH + (rows - 1) * gap;
  const ox = (W - blockW) / 2;
  const oy = (H - blockH) / 2;
  const cellW = W / cols;
  const cellH = H / rows;

  // The patient sits in the middle row, centred.
  const pRow = Math.floor(rows / 2);
  const pCol0 = Math.floor((cols - pc) / 2);
  const isPatientCell = (c: number, r: number) => r === pRow && c >= pCol0 && c < pCol0 + pc;
  const patient = {
    x: ox + pCol0 * (tileW + gap),
    y: oy + pRow * (tileH + gap),
    w: pc * tileW + (pc - 1) * gap,
  };

  const cells: { c: number; r: number }[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!isPatientCell(c, r)) cells.push({ c, r });
  const tiles = cells.slice(0, fragmentNames.length).map(({ c, r }, i) => {
    const sx = (c + 0.5) * cellW + noise(i, 1) * Math.max(0, (cellW - tileW) / 2) * 0.95;
    const sy = (r + 0.5) * cellH + noise(i, 2) * Math.max(0, (cellH - tileH) / 2) * 0.7;
    const jx = ox + c * (tileW + gap) + tileW / 2;
    const jy = oy + r * (tileH + gap) + tileH / 2;
    return { name: fragmentNames[i], sx, sy, dx: jx - sx, dy: jy - sy, rot: noise(i, 3) * 9 };
  });

  const pcx = patient.x + patient.w / 2;
  const pcy = patient.y + tileH / 2;
  /** The patient's broken links to a handful of programs. */
  const links = tiles.filter((_, i) => i % 4 === 1);

  const brokenOpacity = useTransform(progress, [0, 0.2], [1, 0]);
  const oneOpacity = useTransform(progress, [0.8, 0.95], [0, 1]);
  const ready = size.w > 0;

  return (
    <div ref={ref} className={`relative w-full ${className ?? ''}`} role="img" aria-label={fragments.figureAlt}>
      {/* The field: a fine dot grid that fades out toward the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, color-mix(in srgb, var(--mm-ink) 22%, transparent) 1px, transparent 1.4px)',
          backgroundSize: '18px 18px',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(ellipse 62% 58% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 50%, #000 30%, transparent 100%)',
        }}
      />
      {ready && (
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: still ? 1 : brokenOpacity }}
        >
          {/* The patient, ringed and alone. */}
          <g fill="none" stroke="var(--mm-ink)" strokeOpacity="0.14">
            <ellipse cx={pcx} cy={pcy} rx={patient.w / 2 + 26} ry={tileH / 2 + 22} />
            <ellipse cx={pcx} cy={pcy} rx={patient.w / 2 + 54} ry={tileH / 2 + 46} strokeDasharray="2 6" />
          </g>
          {links.map((t) => {
            const mx = (a: number, b: number, k: number) => a + (b - a) * k;
            // The break: a gap with a short red bar across each end.
            const len = Math.hypot(t.sx - pcx, t.sy - pcy) || 1;
            const nx = (-(t.sy - pcy) / len) * 5;
            const ny = ((t.sx - pcx) / len) * 5;
            const a = [mx(pcx, t.sx, 0.42), mx(pcy, t.sy, 0.42)];
            const b = [mx(pcx, t.sx, 0.58), mx(pcy, t.sy, 0.58)];
            return (
              <g key={t.name} stroke="var(--lb-harm)">
                <g strokeWidth="1.25" strokeDasharray="3 5" opacity="0.7">
                  <line x1={pcx} y1={pcy} x2={a[0]} y2={a[1]} />
                  <line x1={b[0]} y1={b[1]} x2={t.sx} y2={t.sy} />
                </g>
                <g strokeWidth="1.5" strokeLinecap="round">
                  <line x1={a[0] - nx} y1={a[1] - ny} x2={a[0] + nx} y2={a[1] + ny} />
                  <line x1={b[0] - nx} y1={b[1] - ny} x2={b[0] + nx} y2={b[1] + ny} />
                </g>
              </g>
            );
          })}
        </motion.svg>
      )}

      {ready && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[14px]"
          style={{
            left: ox - 10,
            top: oy - 10,
            width: blockW + 20,
            height: blockH + 20,
            border: '1.5px solid var(--lb-system)',
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--mm-system) 8%, var(--mm-raised)), var(--mm-raised) 70%)',
            boxShadow:
              '0 0 0 6px color-mix(in srgb, var(--mm-system) 8%, transparent), 0 30px 90px -30px var(--lb-ink-glow)',
            opacity: still ? 0 : oneOpacity,
          }}
        >
          {/* One surface, many modules: hairline seams where the programs used to end. */}
          <span
            className="absolute inset-[10px] overflow-hidden rounded-[4px]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, color-mix(in srgb, var(--mm-system) 18%, transparent) 0 1px, transparent 1px), linear-gradient(0deg, color-mix(in srgb, var(--mm-system) 18%, transparent) 0 1px, transparent 1px)',
              backgroundSize: `${tileW + gap}px 100%, 100% ${tileH + gap}px`,
              backgroundPosition: `${tileW + gap / 2}px 0, 0 ${tileH + gap / 2}px`,
            }}
          />
        </motion.div>
      )}

      {ready && !still && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 rounded-full"
          style={{
            left: patient.x,
            top: patient.y,
            width: patient.w,
            height: tileH,
            boxShadow: '0 0 0 5px color-mix(in srgb, var(--mm-system) 16%, transparent), 0 0 0 6px var(--lb-system), 0 10px 30px -6px var(--lb-ink-glow)',
            opacity: oneOpacity,
          }}
        />
      )}

      {ready &&
        tiles.map((t, i) => <Tile key={t.name} tile={t} w={tileW} h={tileH} progress={progress} still={still} index={i} />)}

      {ready && (
        <span
          aria-hidden="true"
          className="absolute z-10 flex items-center justify-center gap-2 rounded-full text-[13px] font-semibold"
          style={{
            left: patient.x,
            top: patient.y,
            width: patient.w,
            height: tileH,
            backgroundColor: 'var(--mm-btn-bg)',
            color: 'var(--mm-btn-fg)',
          }}
        >
          <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: 'currentColor' }} />
          {fragments.patientLabel}
        </span>
      )}

      {ready &&
        notes.map(([c, r], i) => {
          const label = fragments.gaps[i % fragments.gaps.length];
          return (
            <motion.span
              key={label}
              aria-hidden="true"
              className="lb-mono pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded bg-mm-surface px-1 text-[12px]"
              style={{
                left: `${((c + 0.5) / cols) * 100}%`,
                top: `${((r + 1) / rows) * 100}%`,
                color: 'var(--lb-harm)',
                opacity: still ? 1 : brokenOpacity,
              }}
            >
              <span className="block h-[1.5px] w-2.5" style={{ backgroundColor: 'var(--lb-harm)' }} />
              <span className="block h-[1.5px] w-2.5" style={{ backgroundColor: 'var(--lb-harm)' }} />
              {label}
            </motion.span>
          );
        })}

      {ready && !still && (
        <motion.p
          aria-hidden="true"
          className="lb-serif absolute inset-x-0 text-center text-[22px] text-mm-ink sm:text-[28px]"
          style={{ top: oy + blockH + 24, opacity: oneOpacity }}
        >
          {fragments.resolvedLabel}
        </motion.p>
      )}
    </div>
  );
};

/** Forty programs from different makers: no two corners quite alike. */
const RADII = [6, 3, 9, 4, 7, 2, 8, 5, 10];

const Tile: React.FC<{
  tile: { name: string; sx: number; sy: number; dx: number; dy: number; rot: number };
  w: number;
  h: number;
  progress: MotionValue<number>;
  still: boolean;
  index: number;
}> = ({ tile, w, h, progress, still, index }) => {
  // Tiles start moving at slightly different moments, so the join reads as a gathering.
  const start = 0.2 + (index % 7) * 0.03;
  const end = 0.8;
  const x = useTransform(progress, [start, end], [0, tile.dx], { clamp: true });
  const y = useTransform(progress, [start, end], [0, tile.dy], { clamp: true });
  const rotate = useTransform(progress, [start, end], [tile.rot, 0], { clamp: true });
  // Once joined, the borders between programs dissolve into one surface.
  const frame = useTransform(progress, [0.82, 0.96], [1, 0], { clamp: true });
  return (
    <motion.span
      aria-hidden="true"
      className="absolute flex items-center justify-center px-1.5 text-center text-[12px] font-medium leading-tight text-mm-ink sm:text-[13px]"
      style={{
        left: tile.sx - w / 2,
        top: tile.sy - h / 2,
        width: w,
        height: h,
        x: still ? 0 : x,
        y: still ? 0 : y,
        rotate: still ? tile.rot : rotate,
      }}
    >
      {/* Each program its own little window: its own corner radius, a mark, a shadow. */}
      <motion.span
        className="absolute inset-0 border border-mm-line bg-mm-raised"
        style={{
          opacity: still ? 1 : frame,
          borderRadius: RADII[index % RADII.length],
          boxShadow: '0 1px 0 var(--mm-line), 0 8px 18px -12px color-mix(in srgb, var(--mm-ink) 35%, transparent)',
        }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-1.5 top-1.5 block h-1 w-1 rounded-full"
        style={{ opacity: still ? 0.5 : frame, backgroundColor: 'var(--mm-muted)' }}
      />
      <span className="relative">{tile.name}</span>
    </motion.span>
  );
};

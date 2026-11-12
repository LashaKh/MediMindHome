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
    return { cols: 6, rows: 7, pc: 2, tileW: 124, tileH: 38, gap: 4, notes: [[0, 0], [4, 1], [1, 2], [5, 3], [0, 4], [3, 5]] };
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
      {ready && (
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: still ? 1 : brokenOpacity }}
        >
          {links.map((t) => {
            const mx = (a: number, b: number, k: number) => a + (b - a) * k;
            return (
              <g key={t.name} stroke="var(--lb-harm)" strokeWidth="1.25" strokeDasharray="3 5" opacity="0.7">
                <line x1={pcx} y1={pcy} x2={mx(pcx, t.sx, 0.42)} y2={mx(pcy, t.sy, 0.42)} />
                <line x1={mx(pcx, t.sx, 0.58)} y1={mx(pcy, t.sy, 0.58)} x2={t.sx} y2={t.sy} />
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
            border: '2px solid var(--lb-system)',
            backgroundColor: 'var(--mm-pale)',
            boxShadow: '0 30px 90px -30px var(--lb-ink-glow)',
            opacity: still ? 0 : oneOpacity,
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
      <motion.span
        className="absolute inset-0 rounded-[6px] border border-mm-line bg-mm-pale"
        style={{ opacity: still ? 1 : frame }}
      />
      <span className="relative">{tile.name}</span>
    </motion.span>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { product as copy } from '../../content/landing.v2.c';
import type { Callout } from '../../content/landing.v2.c';
import { useLandingManifest, useMinWidth } from './laneC.manifest';
import { GRID_PX, Picture, Shot, Window } from './ProductPlate';
import { cn } from '../../utils/cn';
import './LaneCScreens.css';

/**
 * Lane C helper: the imaging stage (#product, first scene). A near-black
 * display in both themes. Left: one CT scan rendered in 3D, crossfading
 * slowly between vessels and bone, with a scan line sweeping down; two
 * chips switch it by click or keyboard. Right: heart-valve planning, the
 * aortic-root view in a window with the valve-ring view lifted over its
 * corner, two thin blue callouts. Reduced motion: vessels, still, no sweep.
 */

const img = copy.imaging;
const HOLD_MS = 6600; // 1.6 s fade + 5 s hold

/* Geometry from 1024 up, in units of a 1000-wide panel. */
const H = 470;
const BODY = { x: 0, w: 372 };
const ROOT = { x: 392, y: 128, w: 566, bar: 12 };
const VALVE = { x: 724, y: 278, w: 252, bar: 10 };
const ux = (n: number) => `${n / 10}%`;
const uy = (n: number) => `${(n / H) * 100}%`;
const imgH = (w: number) => (w * img.root.image.height) / img.root.image.width;

/** A point on a window's screen, in panel units. */
const at = (win: { x: number; y: number; w: number; bar: number }, c: Callout) => ({
  x: win.x + c.x * win.w,
  y: win.y + win.bar + c.y * imgH(win.w),
});

/** The 3D body: both renders stacked; the one not shown fades out. */
const Body: React.FC<{ mode: number; reduce: boolean; sizes: string }> = ({ mode, reduce, sizes }) => (
  <div className="lc-body">
    <div className={cn('lc-body__drift', reduce && '[animation:none]')}>
      {img.modes.map((m, i) => (
        <div key={m.id} className="lc-body__layer" style={{ opacity: i === mode ? 1 : 0 }} aria-hidden={i !== mode}>
          <Picture
            image={m.image}
            sizes={sizes}
            alt={i === mode ? m.image.alt : ''}
            className="absolute inset-0 h-full w-full max-w-none object-contain"
          />
        </div>
      ))}
    </div>
    {!reduce && (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="lc-scanline" />
      </div>
    )}
  </div>
);

const Modes: React.FC<{
  mode: number;
  onPick: (i: number) => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ mode, onPick, className, style }) => (
  <div role="group" aria-label={img.modesLabel} className={cn('flex gap-2', className)} style={style}>
    {img.modes.map((m, i) => (
      <button key={m.id} type="button" className="lc-mode" aria-pressed={i === mode} onClick={() => onPick(i)}>
        {m.label}
      </button>
    ))}
  </div>
);

/** A thin blue callout: a ring on the point, a leader, the words. */
const Pin: React.FC<{ p: { x: number; y: number }; label: string; down?: number }> = ({ p, label, down }) => (
  <>
    <span className="lc-ring z-[5]" style={{ left: ux(p.x), top: uy(p.y) }} aria-hidden="true" />
    {down ? (
      <span
        className="absolute z-[5] flex -translate-x-1/2 flex-col items-center"
        style={{ left: ux(p.x), top: `calc(${uy(p.y)} + 8px)`, height: `calc(${uy(down)} - 8px)` }}
        aria-hidden="true"
      >
        <span className="lc-lead w-px flex-1" />
        <span className="lc-chip">{label}</span>
      </span>
    ) : (
      <span
        className="absolute z-[5] flex -translate-y-1/2 items-center"
        style={{ left: `calc(${ux(p.x)} + 8px)`, top: uy(p.y) }}
        aria-hidden="true"
      >
        <span className="lc-lead h-px w-10 xl:w-14" />
        <span className="lc-chip">{label}</span>
      </span>
    )}
  </>
);

export const ImagingStage: React.FC = () => {
  const manifest = useLandingManifest();
  const reduce = useReducedMotion() ?? false;
  const lg = useMinWidth(1024);
  const [mode, setMode] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // The slow crossfade, until someone picks a view.
  useEffect(() => {
    if (reduce || !auto) return;
    const id = window.setInterval(() => setMode((m) => (m + 1) % img.modes.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce, auto]);
  const shown = reduce && auto ? 0 : mode;
  const pick = (i: number) => {
    setAuto(false);
    setMode(i);
  };

  // A little depth on scroll: the lifted window moves more than the one beneath it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const still = reduce || !lg;
  const valveY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [26, -26]);
  const rootY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [10, -10]);
  const bodyY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [-14, 14]);

  const rootPin = at(ROOT, img.rootCallout);
  const valvePin = at(VALVE, img.valveCallout);
  const lgPanel = GRID_PX;

  return (
    <figure ref={ref} className="lc-monitor m-0">
      {lg ? (
        <div className="relative" style={{ aspectRatio: `1000 / ${H}` }}>
          <motion.div className="absolute inset-y-0" style={{ left: ux(BODY.x), width: ux(BODY.w), y: bodyY }}>
            <Body mode={shown} reduce={reduce} sizes={`${Math.round((lgPanel * BODY.w) / 1000)}px`} />
          </motion.div>
          <Modes
            mode={shown}
            onPick={pick}
            className="absolute bottom-7 z-[6] -translate-x-1/2"
            style={{ left: ux(BODY.x + BODY.w / 2) }}
          />

          <figcaption className="absolute z-[6]" style={{ left: ux(ROOT.x), top: uy(40), width: ux(560) }}>
            <span className="block text-[1.25rem] font-semibold leading-snug tracking-[-0.012em] text-white">
              {img.title}
            </span>
            <span className="mt-1.5 block text-[1.0625rem] leading-relaxed text-[#a9b8cc]">{img.line}</span>
            <span className="sr-only">
              {' '}
              {img.rootCallout.label}. {img.valveCallout.label}.
            </span>
          </figcaption>

          <motion.div
            className="absolute z-[2]"
            style={{ left: ux(ROOT.x), top: uy(ROOT.y), width: ux(ROOT.w), y: rootY }}
          >
            <Window label={img.rootLabel} barRatio={ROOT.bar / ROOT.w}>
              <Shot screen={img.root} lgPx={(lgPanel * ROOT.w) / 1000} vw={52} manifest={manifest} />
            </Window>
          </motion.div>
          <motion.div
            className="absolute z-[3]"
            style={{ left: ux(VALVE.x), top: uy(VALVE.y), width: ux(VALVE.w), y: valveY }}
          >
            <Window label={img.valveLabel} barRatio={VALVE.bar / VALVE.w}>
              <Shot screen={img.valve} lgPx={(lgPanel * VALVE.w) / 1000} vw={27} manifest={manifest} />
            </Window>
          </motion.div>

          <motion.div className="pointer-events-none absolute inset-0 z-[4]" style={{ y: rootY }}>
            <Pin p={rootPin} label={img.rootCallout.label} />
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0 z-[4]" style={{ y: valveY }}>
            <Pin p={valvePin} label={img.valveCallout.label} down={H - 36 - valvePin.y} />
          </motion.div>
        </div>
      ) : (
        <div className="grid gap-6 p-5 md:gap-8 md:p-8">
          <div className="relative mx-auto aspect-[1000/1430] w-full max-w-[22rem]">
            <Body mode={shown} reduce={reduce} sizes="(min-width: 768px) 352px, 80vw" />
          </div>
          <Modes mode={shown} onPick={pick} className="-mt-2 justify-center" />
          <figcaption>
            <span className="block text-[1.1875rem] font-semibold leading-snug text-white">{img.title}</span>
            <span className="mt-1 block text-[1rem] leading-relaxed text-[#a9b8cc]">{img.line}</span>
          </figcaption>
          <Window label={img.rootLabel}>
            <Shot screen={img.root} lgPx={0} vw={90} manifest={manifest} />
          </Window>
        </div>
      )}
    </figure>
  );
};

import React from 'react';
import { brain as copy } from '../../content/landing.v2.c';
import type { BrainScreen } from '../../content/landing.v2.c';
import { useLandingManifest } from './laneC.manifest';
import type { ManifestMap } from './laneC.manifest';
import { GRID_PX, Picture, Window } from './ProductPlate';
import { cn } from '../../utils/cn';
import './LaneCScreens.css';

/**
 * Lane C helper: real screens of the hospital brain (in development), under
 * the autonomy dial. The Control Center large with the staff inbox and the
 * morning brief laid over its edge, then workers and proof side by side.
 * Every screen comes from the manifest by id (`brain-*`, night twin
 * `brain-*-dark`); a screen not captured yet stays a named empty frame.
 */

/** Every brain screen is framed at 16:10 and filled from its top-left corner. */
const FRAME = 16 / 10;

const BrainShot: React.FC<{ screen: BrainScreen; manifest: ManifestMap; lgPx: number; vw: number }> = ({
  screen,
  manifest,
  lgPx,
  vw,
}) => {
  const light = manifest.get(screen.id);
  const dark = manifest.get(`${screen.id}-dark`);
  const sizes = `(min-width: 1024px) ${Math.round(lgPx)}px, ${vw}vw`;
  const fill = 'absolute inset-0 h-full w-full max-w-none object-cover object-left-top';
  return (
    <div className={cn('relative overflow-hidden', light && !dark && 'lc-settle')} style={{ aspectRatio: `${FRAME}` }}>
      {light ? (
        <>
          <div className={cn('absolute inset-0', dark && 'dark:hidden')}>
            <Picture image={light} sizes={sizes} alt={light.alt} className={cn(fill, !dark && 'lc-shot-light')} />
          </div>
          {dark && (
            <div className="absolute inset-0 hidden dark:block">
              <Picture image={dark} sizes={sizes} alt={dark.alt || light.alt} className={fill} />
            </div>
          )}
        </>
      ) : (
        <div className="lc-slot" data-slot={screen.id}>
          <span className="font-mono text-[12px] text-mm-muted">{screen.name}</span>
        </div>
      )}
    </div>
  );
};

/* The three-window scene, in units of a 1000-wide box. */
const H = 560;
const SCENE = [
  { x: 0, y: 36, w: 640, bar: 18, z: 1 },
  { x: 586, y: 0, w: 414, bar: 14, z: 2 },
  { x: 548, y: 262, w: 452, bar: 14, z: 3 },
];
const ux = (n: number) => `${n / 10}%`;
const uy = (n: number) => `${(n / H) * 100}%`;

const Caption: React.FC<{ screen: BrainScreen; className?: string }> = ({ screen, className }) => (
  <div className={cn('min-w-0', className)}>
    <span className="block text-[1.0625rem] font-semibold leading-snug text-mm-ink">{screen.name}</span>
    <span className="mm-body mt-0.5 block text-pretty text-mm-muted">{screen.tag}</span>
  </div>
);

export const BrainScreens: React.FC = () => {
  const manifest = useLandingManifest();
  const [main, inbox, brief, ...rest] = copy.screens;
  const trio = [main, inbox, brief];
  const lgStage = GRID_PX - 112;

  return (
    <div className="mt-16 md:mt-20 lg:mt-24">
      <div className="lc-stage px-4 py-4 md:px-10 md:py-10 xl:px-14 xl:py-12">
        {/* Phones and tablets below 768: the three screens one under another */}
        <div className="grid gap-6 md:hidden">
          {trio.map((s) => (
            <figure key={s.id} className="m-0">
              <Window label={s.name}>
                <BrainShot screen={s} manifest={manifest} lgPx={0} vw={92} />
              </Window>
              <figcaption className="mt-3">
                <Caption screen={s} />
              </figcaption>
            </figure>
          ))}
        </div>

        {/* From 768 up: the Control Center with the inbox and the brief over its edge */}
        <div className="relative max-md:hidden" style={{ aspectRatio: `1000 / ${H}` }}>
          {trio.map((s, i) => {
            const g = SCENE[i];
            return (
              <Window
                key={s.id}
                label={s.name}
                back={i === 0}
                barRatio={g.bar / g.w}
                className="absolute"
                style={{ left: ux(g.x), top: uy(g.y), width: ux(g.w), zIndex: g.z }}
              >
                <BrainShot screen={s} manifest={manifest} lgPx={(lgStage * g.w) / 1000} vw={(g.w / 10) * 0.9} />
              </Window>
            );
          })}
        </div>
      </div>

      {/* Names and tags for the three, in the order they stand */}
      <div className="mt-6 grid gap-6 max-md:hidden md:grid-cols-3 md:gap-8">
        {trio.map((s) => (
          <Caption key={s.id} screen={s} className="border-t border-mm-line pt-4" />
        ))}
      </div>

      {/* Workers and proof */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:gap-6">
        {rest.map((s) => (
          <figure key={s.id} className="lc-stage lc-stage--small m-0 flex flex-col">
            <figcaption className="px-6 pt-6 md:px-8 md:pt-7">
              <Caption screen={s} />
            </figcaption>
            <div className="relative mt-6 aspect-[16/8] md:mt-7">
              <Window label={s.name} className="absolute left-6 top-0 w-[118%] md:left-8">
                <BrainShot screen={s} manifest={manifest} lgPx={(GRID_PX / 2) * 1.18} vw={110} />
              </Window>
            </div>
          </figure>
        ))}
      </div>

      <p className="m-0 mt-5 font-mono text-[12px] text-mm-muted">{copy.screensNote}</p>
    </div>
  );
};

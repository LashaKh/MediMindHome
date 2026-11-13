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
 * the autonomy dial. The Control Center large, the workers (each with its
 * own level dial) over its edge and the money panel across its foot; then
 * smaller stages for the inbox, proof and morning brief. Every screen comes
 * from the manifest by id (`brain-*`, night twin `brain-*-dark`). A screen
 * not captured yet is a named empty frame while developing and is left out
 * of the built page.
 */

const SHOW_SLOTS = import.meta.env.DEV;

const BrainShot: React.FC<{ screen: BrainScreen; manifest: ManifestMap; lgPx: number; vw: number }> = ({
  screen,
  manifest,
  lgPx,
  vw,
}) => {
  const light = manifest.get(screen.id);
  const dark = manifest.get(`${screen.id}-dark`);
  const sizes = `(min-width: 1024px) ${Math.round(lgPx)}px, ${vw}vw`;
  const fill = 'absolute inset-0 h-full w-full max-w-none object-cover';
  const pos = { objectPosition: screen.focus };
  return (
    <div className={cn('relative overflow-hidden', light && !dark && 'lc-settle')} style={{ aspectRatio: `${screen.frame}` }}>
      {light ? (
        <>
          <div className={cn('absolute inset-0', dark && 'dark:hidden')}>
            <Picture image={light} sizes={sizes} alt={light.alt} className={cn(fill, !dark && 'lc-shot-light')} style={pos} />
          </div>
          {dark && (
            <div className="absolute inset-0 hidden dark:block">
              <Picture image={dark} sizes={sizes} alt={dark.alt || light.alt} className={fill} style={pos} />
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

/* The scene, in units of a 1000-wide box: Control Center, workers over its edge, money across its foot. */
const H = 516;
const SCENE = [
  { x: 0, y: 0, w: 690, bar: 18 },
  { x: 500, y: 168, w: 500, bar: 14 },
  { x: 70, y: 388, w: 600, bar: 14 },
];
const ux = (n: number) => `${n / 10}%`;
const uy = (n: number) => `${(n / H) * 100}%`;

const Caption: React.FC<{ screen: BrainScreen; className?: string }> = ({ screen, className }) => (
  <div className={cn('min-w-0', className)}>
    <span className="block text-[1.0625rem] font-semibold leading-snug text-mm-ink">{screen.name}</span>
    <span className="mm-body mt-0.5 block text-pretty text-mm-muted">{screen.tag}</span>
    {screen.pin && <span className="sr-only"> {screen.pin.label}.</span>}
  </div>
);

export const BrainScreens: React.FC = () => {
  const manifest = useLandingManifest();
  const has = (s: BrainScreen) => SHOW_SLOTS || manifest.has(s.id);
  const scene = copy.screens.scene;
  const sceneShown = scene.filter(has);
  const more = copy.screens.more.filter(has);
  if (sceneShown.length === 0 && more.length === 0) return null;
  const lgStage = GRID_PX - 112;

  return (
    <div className="mt-16 md:mt-20 lg:mt-24">
      {sceneShown.length > 0 && (
        <>
          <div className="lc-stage px-4 py-4 md:px-10 md:py-10 xl:px-14 xl:py-12">
            {/* Below 768: the screens one under another */}
            <div className="grid gap-6 md:hidden">
              {sceneShown.map((s) => (
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

            {/* From 768 up: the composed scene */}
            <div className="relative max-md:hidden" style={{ aspectRatio: `1000 / ${H}` }}>
              {scene.map((s, i) => {
                const g = SCENE[i];
                if (!s.pin || !manifest.has(s.id)) return null;
                const at = {
                  x: g.x + s.pin.x * g.w,
                  y: g.y + g.bar + s.pin.y * (g.w / s.frame),
                };
                const right = s.pin.dir === 'right';
                return (
                  <React.Fragment key={`${s.id}-pin`}>
                    <span
                      className={cn('lc-ring z-[5]', s.pin.human && 'lc-ring--human')}
                      style={{ left: ux(at.x), top: uy(at.y) }}
                      aria-hidden="true"
                    />
                    <span
                      className={cn('absolute z-[5] flex', right ? '-translate-y-1/2 items-center' : '-translate-x-1/2 flex-col items-center')}
                      style={right ? { left: `calc(${ux(at.x)} + 8px)`, top: uy(at.y) } : { left: ux(at.x), top: `calc(${uy(at.y)} + 8px)` }}
                      aria-hidden="true"
                    >
                      <span className={cn('bg-mm-ink', right ? 'h-px w-10 lg:w-16' : 'h-20 w-px lg:h-40')} />
                      <span className="lc-chip">
                        <span className={cn('h-2 w-2 rounded-full', s.pin.human ? 'bg-mm-human' : 'border-[1.5px] border-current')} />
                        {s.pin.label}
                      </span>
                    </span>
                  </React.Fragment>
                );
              })}
              {scene.map((s, i) => {
                if (!has(s)) return null;
                const g = SCENE[i];
                return (
                  <Window
                    key={s.id}
                    label={s.name}
                    back={i === 0}
                    barRatio={g.bar / g.w}
                    className="absolute"
                    style={{ left: ux(g.x), top: uy(g.y), width: ux(g.w), zIndex: i + 1 }}
                  >
                    <BrainShot screen={s} manifest={manifest} lgPx={(lgStage * g.w) / 1000} vw={(g.w / 10) * 0.9} />
                  </Window>
                );
              })}
            </div>
          </div>

          {/* Names and tags, in the order the screens stand */}
          <div className="mt-6 grid gap-6 max-md:hidden md:grid-cols-3 md:gap-8">
            {sceneShown.map((s) => (
              <Caption key={s.id} screen={s} className="border-t border-mm-line pt-4" />
            ))}
          </div>
        </>
      )}

      {more.length > 0 && (
        <div className={cn('mt-10 grid gap-5 lg:mt-12 lg:gap-6', more.length > 1 && 'md:grid-cols-2', more.length > 2 && 'lg:grid-cols-3')}>
          {more.map((s, i) => (
            <figure
              key={s.id}
              className={cn('lc-stage lc-stage--small m-0 flex flex-col', more.length === 3 && i === 2 && 'md:max-lg:col-span-2')}
            >
              <figcaption className="px-6 pt-6 md:px-8 md:pt-7">
                <Caption screen={s} />
              </figcaption>
              <div className="relative mt-6 aspect-[16/9] md:mt-7">
                <Window label={s.name} className="absolute left-6 top-0 w-[112%] md:left-8">
                  <BrainShot screen={s} manifest={manifest} lgPx={(GRID_PX / Math.max(more.length, 2)) * 1.12} vw={100} />
                </Window>
              </div>
            </figure>
          ))}
        </div>
      )}

      <p className="m-0 mt-5 font-mono text-[12px] text-mm-muted">{copy.screensNote}</p>
    </div>
  );
};

import React from 'react';
import { product as copy } from '../../content/landing.v2.c';
import { useIsDark, useLandingManifest, isPending } from './laneC.manifest';
import { GRID_PX, Picture, Window } from './ProductPlate';
import { cn } from '../../utils/cn';
import './LaneCScreens.css';

/**
 * Lane C helper: the bridge at the end of #product into the brain. The AI
 * proposing next steps for one patient, large, with the "In development"
 * marker and one thin amber callout on the Accept control: a doctor decides.
 * Appears only when the capture exists in the manifest (a named empty frame
 * while developing).
 */

const SHOW_SLOT = import.meta.env.DEV;

export const ProductBridge: React.FC = () => {
  const manifest = useLandingManifest();
  const isDark = useIsDark();
  const b = copy.bridge;
  const light = manifest.get(b.id);
  const twin = isDark ? manifest.get(`${b.id}-dark`) : undefined;
  const shown = twin ?? light;
  if (!light && !SHOW_SLOT) return null;
  const wait = isDark && isPending(manifest);
  const ratio = light ? light.width / light.height : 16 / 10;

  return (
    <figure className="lc-stage m-0 grid gap-8 p-5 md:p-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-12">
      <figcaption className="lg:col-span-4">
        <span className="mm-dev-badge">{b.chip}</span>
        <span className="mm-h3 mt-5 block">{b.name}</span>
        <span className="mm-body mt-2 block max-w-[24rem] text-pretty text-mm-muted">{b.tag}</span>
        {b.pin && <span className="sr-only"> {b.pinLabel}.</span>}
      </figcaption>

      <div className="relative lg:col-span-8">
        <Window label={b.label} lit>
          <div className="relative overflow-hidden" style={{ aspectRatio: `${ratio}` }}>
            {shown && !wait ? (
              <Picture
                key={shown.fallback}
                image={shown}
                sizes={`(min-width: 1024px) ${Math.round((GRID_PX * 8) / 12)}px, 92vw`}
                alt={shown.alt || light?.alt || b.name}
                className={cn('absolute inset-0 h-full w-full max-w-none object-cover object-left-top')}
              />
            ) : (
              !shown && (
                <div className="lc-slot" data-slot={b.id}>
                  <span className="font-mono text-[12px] text-mm-muted">{b.label}</span>
                </div>
              )
            )}
            {b.pin && light && (
              <>
                <span
                  className="lc-ring lc-ring--human z-[5]"
                  style={{ left: `${b.pin.x * 100}%`, top: `${b.pin.y * 100}%` }}
                  aria-hidden="true"
                />
                <span
                  className="absolute z-[5] flex -translate-x-full -translate-y-1/2 flex-row-reverse items-center"
                  style={{ left: `calc(${b.pin.x * 100}% - 8px)`, top: `${b.pin.y * 100}%` }}
                  aria-hidden="true"
                >
                  <span className="h-px w-10 bg-mm-human lg:w-16" />
                  <span className="lc-chip">
                    <span className="h-2 w-2 rounded-full bg-mm-human" />
                    {b.pinLabel}
                  </span>
                </span>
              </>
            )}
          </div>
        </Window>
      </div>
    </figure>
  );
};

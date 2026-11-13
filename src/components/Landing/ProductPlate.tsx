import React from 'react';
import type { ResponsiveImage } from '../../content/types';
import type { Crop, OpsTile, Screen } from '../../content/landing.v2.c';
import { product as copy } from '../../content/landing.v2.c';
import { isPending, useIsDark, useLandingManifest, useMinWidth } from './laneC.manifest';
import type { ManifestMap } from './laneC.manifest';
import { cn } from '../../utils/cn';
import './LaneCScreens.css';

/**
 * Lane C helpers: real product screens as composed scenes. A window holds
 * one real screen (cropped to its telling part) with a slim named top bar,
 * a thin highlight edge and a long soft shadow; windows stand on a lit
 * stage, overlap and run off its edge. In night mode a screen's night twin
 * (`<id>-dark` in the manifest) replaces it; until then the light capture
 * is settled so it never reads as a white slab on ink.
 */

/** Content width of the page grid at its widest (88rem less 2 x 64px side padding). */
export const GRID_PX = 1280;

const FULL: Crop = { x: 0, y: 0, w: 1, h: 1 };

export const Picture: React.FC<{
  image: ResponsiveImage;
  sizes: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ image, sizes, alt, className, style }) => (
  <picture>
    {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
    {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
    <img
      src={image.fallback}
      alt={alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn('select-none', className)}
      style={style}
    />
  </picture>
);

/**
 * A crop of a real screen: the box takes the crop's shape (from the light
 * capture, so the frame never shifts) and the picture is zoomed and shifted
 * inside it. Shows the night twin under `:root.dark` when it exists.
 */
export const Shot: React.FC<{
  screen: Screen;
  crop?: Crop;
  /** CSS width the crop is drawn at on wide screens, and as vw below lg. */
  lgPx: number;
  vw: number;
  manifest: ManifestMap;
  decorative?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ screen, crop = FULL, lgPx, vw, manifest, decorative = false, className, children }) => {
  const isDark = useIsDark();
  const { image } = screen;
  const twin = isDark ? manifest.get(`${screen.id}-dark`) : undefined;
  const shown = twin ?? image;
  const settle = isDark && !twin;
  const sizes = `(min-width: 1024px) ${Math.round(lgPx / crop.w)}px, ${Math.round(vw / crop.w)}vw`;
  return (
    <div
      className={cn('relative overflow-hidden', settle && 'lc-settle', className)}
      style={{
        aspectRatio: `${crop.w * image.width} / ${crop.h * image.height}`,
      }}
    >
      {!(isDark && isPending(manifest)) && (
        <Picture
          key={shown.fallback}
          image={shown}
          sizes={sizes}
          alt={decorative ? '' : shown.alt || image.alt}
          className={cn('absolute max-w-none', settle && 'lc-shot-light')}
          style={{
            width: `${100 / crop.w}%`,
            height: 'auto',
            left: `${(-crop.x / crop.w) * 100}%`,
            top: `${(-crop.y / crop.h) * 100}%`,
          }}
        />
      )}
      {children}
    </div>
  );
};

/** A window: a slim top bar carrying the screen's name, then the screen. */
export const Window: React.FC<{
  label: string;
  back?: boolean;
  /** Top bar height as a share of the window width (keeps scenes in proportion); omit for a fixed 30px bar. */
  barRatio?: number;
  /** A light screen that stays bright at night, with a cool bloom around its frame. */
  lit?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ label, back = false, barRatio, lit = false, className, style, children }) => (
  <div className={cn('lc-window', back && 'lc-window--back', lit && 'lc-window--lit', className)} style={style}>
    <div
      className="lc-chrome"
      style={barRatio ? { aspectRatio: `${1 / barRatio}` } : { height: 30 }}
      aria-hidden="true"
    >
      <span className="lc-chrome__dot" />
      <span className={cn('truncate', barRatio && 'max-lg:hidden')}>{label}</span>
    </div>
    {children}
  </div>
);

// ─── The hero scene ──────────────────────────────────────────────────

/*
 * Geometry of the hero scene in units of a 1000-wide box (heights in the
 * same units), so windows, the lens and its cone stay locked together at
 * every width from 1024 up.
 */
const H = 520;
const BACK = { x: 0, y: 0, w: 470, bar: 18 };
const FRONT = { x: 150, y: 104, w: 850, bar: 22 };
const LENS = { x: 640, y: 444, w: 340 };
const ux = (n: number) => `${n / 10}%`;
const uy = (n: number) => `${(n / H) * 100}%`;

export const HeroScene: React.FC = () => {
  const manifest = useLandingManifest();
  const hero = copy.hero;
  const front = hero.front.image;
  const frontImgH = (FRONT.w * front.height) / front.width;
  const origin = { x: FRONT.x, y: FRONT.y + FRONT.bar };
  const lens = hero.lens.crop;
  const lensH = (LENS.w * lens.h * front.height) / (lens.w * front.width);
  const src = {
    x: origin.x + lens.x * FRONT.w,
    y: origin.y + lens.y * frontImgH,
    w: lens.w * FRONT.w,
    h: lens.h * frontImgH,
  };
  const pin = {
    x: origin.x + hero.callout.x * FRONT.w,
    y: origin.y + hero.callout.y * frontImgH,
  };
  const lgStage = GRID_PX - 96; // stage padding on wide screens
  const md = useMinWidth(768);
  const lg = useMinWidth(1024);

  return (
    <figure className="m-0">
      <div className="lc-stage p-4 md:p-8 lg:px-10 lg:pb-10 lg:pt-9 xl:px-12 xl:pb-11 xl:pt-10">
        {/* Below 1024: the record alone, cropped to its first two (phones) or three (tablets) columns */}
        {!lg && (
          <Window label={hero.frontLabel} lit>
            <Shot
              screen={hero.front}
              crop={{ x: 0, y: 0.27, w: md ? 0.755 : 0.52, h: 0.73 }}
              lgPx={0}
              vw={md ? 88 : 92}
              manifest={manifest}
            />
          </Window>
        )}

        {/* From 1024 up: the composed scene */}
        {lg && (
          <div className="relative" style={{ aspectRatio: `1000 / ${H}` }}>
            <Window
              label={hero.backLabel}
              back
              barRatio={BACK.bar / BACK.w}
              className="absolute"
              style={{ left: ux(BACK.x), top: uy(BACK.y), width: ux(BACK.w) }}
            >
              <Shot screen={hero.back} lgPx={(lgStage * BACK.w) / 1000} vw={47} manifest={manifest} decorative />
            </Window>

            {/* Name and tag, in the open band above the record */}
            <div className="absolute" style={{ left: ux(530), top: uy(14), width: ux(440) }} aria-hidden="true">
              <span className="mm-h3 block">{hero.name}</span>
              <span className="mm-body mt-1.5 block text-pretty text-mm-muted">{hero.tag}</span>
            </div>

            <Window
              label={hero.frontLabel}
              barRatio={FRONT.bar / FRONT.w}
              lit
              className="absolute"
              style={{
                left: ux(FRONT.x),
                top: uy(FRONT.y),
                width: ux(FRONT.w),
              }}
            >
              <Shot screen={hero.front} lgPx={(lgStage * FRONT.w) / 1000} vw={85} manifest={manifest} />
            </Window>

            {/* The lens cone: from the warfarin line to its enlarged copy */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 1000 ${H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon
                points={`${src.x + src.w},${src.y} ${LENS.x + LENS.w},${LENS.y} ${LENS.x},${LENS.y + lensH} ${src.x},${src.y + src.h}`}
                fill="var(--mm-system)"
                fillOpacity={0.07}
              />
              <line
                x1={src.x + src.w}
                y1={src.y}
                x2={LENS.x + LENS.w}
                y2={LENS.y}
                stroke="var(--mm-system)"
                strokeOpacity={0.4}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={src.x}
                y1={src.y + src.h}
                x2={LENS.x}
                y2={LENS.y + lensH}
                stroke="var(--mm-system)"
                strokeOpacity={0.4}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={src.x}
                y={src.y}
                width={src.w}
                height={src.h}
                rx={3}
                fill="none"
                stroke="var(--mm-system)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* The lens */}
            <div className="absolute" style={{ left: ux(LENS.x), top: uy(LENS.y), width: ux(LENS.w) }}>
              <div className="lc-window lc-window--lit" style={{ borderRadius: 10 }}>
                <Shot
                  screen={hero.front}
                  crop={lens}
                  lgPx={(lgStage * LENS.w) / 1000}
                  vw={34}
                  manifest={manifest}
                  decorative
                />
              </div>
              <span className="lc-chip absolute bottom-1 right-full mr-4" aria-hidden="true">
                <span className="h-2 w-2 rounded-full border-[1.5px] border-current" />
                {hero.lens.label}
              </span>
            </div>

            {/* The interaction callout: a ring where the banner's text ends, the words in its empty run */}
            <span className="lc-ring" style={{ left: ux(pin.x), top: uy(pin.y) }} aria-hidden="true" />
            <span
              className="absolute flex -translate-y-1/2 items-center"
              style={{ left: `calc(${ux(pin.x)} + 8px)`, top: uy(pin.y) }}
              aria-hidden="true"
            >
              <span className="h-px w-8 bg-mm-ink lg:w-12" />
              <span className="lc-chip">{hero.callout.label}</span>
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-4 lg:sr-only">
        <span className="mm-h3 block">{hero.name}</span>
        <span className="mm-body mt-1 block text-mm-muted">{hero.tag}</span>
        <span className="sr-only">
          {' '}
          {hero.callout.label}. {hero.lens.label}.
        </span>
      </figcaption>
    </figure>
  );
};

// ─── An operations tile ──────────────────────────────────────────────

/**
 * A wide, short screen in a refined frame: the name and tag above, the
 * window running off the tile's right edge on purpose. At night the screen
 * is a lit display (full brightness, a cool bloom), drawn a touch smaller.
 */
export const OpsTileView: React.FC<{ tile: OpsTile; className?: string }> = ({ tile, className }) => {
  const manifest = useLandingManifest();
  return (
    <figure className={cn('lc-stage lc-stage--small lc-tile m-0 flex min-w-0 flex-col', className)}>
      <figcaption className="px-6 pt-6 md:px-7 md:pt-7">
        <span className="mm-h3 block">{tile.name}</span>
        <span className="mm-body mt-1 block text-pretty text-mm-muted">{tile.tag}</span>
      </figcaption>
      <div className="mt-auto pb-6 pl-6 pt-6 md:pb-7 md:pl-7 md:pt-7">
        <Window label={tile.name} lit className="w-[118%] dark:w-[112%]">
          <Shot screen={tile.screen} crop={tile.crop} lgPx={(GRID_PX / 3) * 1.18} vw={110} manifest={manifest} />
        </Window>
      </div>
    </figure>
  );
};

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ResponsiveImage } from '../../content/types';
import type { Callout, Crop, FlowArea, ScreenArea } from '../../content/landing.v2.c';
import { product as copy } from '../../content/landing.v2.c';
import './ProductSection.css';
import { liftShadow, plateGrid } from './ProductPlate.styles';
import { cn } from '../../utils/cn';

/**
 * Lane C helpers: real product screens as compositions, never a lone
 * screenshot. A small map of the whole screen sits behind, with the focus
 * marked; the telling detail is drawn large in front; thin leader lines run
 * from numbered points to labels in the margin. Areas with no honest screen
 * get a labelled diagram of how the work travels (never a drawn screen).
 */

const cx = cn;

/** `sizes` for an image zoomed so that only `w` of its width shows in a box `lgPx` wide. */
function zoomSizes(w: number, lgPx: number, smVw: number): string {
  return `(min-width: 1024px) ${Math.round(lgPx / w)}px, ${Math.round(smVw / w)}vw`;
}

/** Navy marker on the (always light) product screen, readable in both themes. */
const MARK = '#0f2a52';

/**
 * A crop of a screenshot: the box takes the crop's shape and the picture is
 * zoomed and shifted inside it. Children are laid over the crop.
 */
export const CroppedShot: React.FC<{
  image: ResponsiveImage;
  crop: Crop;
  sizes: string;
  className?: string;
  decorative?: boolean;
  children?: React.ReactNode;
}> = ({ image, crop, sizes, className, decorative = false, children }) => (
  <div
    className={cx('relative overflow-hidden', className)}
    style={{ aspectRatio: `${crop.w * image.width} / ${crop.h * image.height}` }}
  >
    <picture>
      {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
      {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
      <img
        src={image.fallback}
        alt={decorative ? '' : image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute max-w-none select-none"
        style={{
          width: `${100 / crop.w}%`,
          height: 'auto',
          left: `${(-crop.x / crop.w) * 100}%`,
          top: `${(-crop.y / crop.h) * 100}%`,
        }}
      />
    </picture>
    {children}
  </div>
);

const FULL: Crop = { x: 0, y: 0, w: 1, h: 1 };

/** Position of a callout inside the crop, in percent. */
const inCrop = (c: Callout, crop: Crop) => ({
  left: ((c.x - crop.x) / crop.w) * 100,
  top: ((c.y - crop.y) / crop.h) * 100,
});

/** A numbered point. `onScreen`: navy on the (always light) screenshot; otherwise ink, following the theme. */
const Num: React.FC<{ n: number; className?: string; onScreen?: boolean }> = ({ n, className, onScreen = false }) => (
  <span
    className={cx(
      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold leading-none',
      className
    )}
    style={onScreen ? { backgroundColor: MARK, color: '#fff' } : { backgroundColor: 'var(--mm-ink)', color: 'var(--mm-surface)' }}
  >
    {n}
  </span>
);

/** Numbered points over a crop (only those that fall inside it). */
const Points: React.FC<{ crop: Crop; callouts: Callout[]; all: Callout[] }> = ({ crop, callouts, all }) => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    {callouts.map((c) => {
      const p = inCrop(c, crop);
      if (p.left < 0 || p.left > 100 || p.top < 0 || p.top > 100) return null;
      return (
        <span key={c.label} className="absolute" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
          <Num
            onScreen
            n={all.indexOf(c) + 1}
            className="absolute -left-2 -top-2 h-4 w-4 text-[10px] ring-2 ring-white md:-left-2.5 md:-top-2.5 md:h-5 md:w-5 md:text-[11px]"
          />
        </span>
      );
    })}
  </div>
);

/**
 * A very wide strip (one row of figures) laid in front of a second real
 * screen. Wide screens: the screen behind, the strip lifted across its foot.
 * Phones: the strip in two halves, one above the other, so it stays legible.
 */
const StripPlate: React.FC<{ area: ScreenArea & { backdrop: NonNullable<ScreenArea['backdrop']> } }> = ({ area }) => {
  const reduce = useReducedMotion();
  const { image, callouts } = area;
  const halves: Crop[] = [
    { x: 0, y: 0, w: 0.5, h: 1 },
    { x: 0.5, y: 0, w: 0.5, h: 1 },
  ];
  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-[18px] border border-mm-line bg-mm-pale p-2.5 sm:p-6 md:p-8"
        style={plateGrid}
      >
        <div className="hidden w-[74%] overflow-hidden rounded-[10px] border border-mm-line bg-white md:block">
          <CroppedShot image={area.backdrop.image} crop={FULL} sizes="(min-width: 1024px) 720px, 74vw" />
        </div>
        <motion.div
          className="relative md:-mt-[9%] md:ml-[8%]"
          initial={reduce ? false : { x: 22, y: 22, scale: 0.985 }}
          whileInView={{ x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hidden overflow-hidden rounded-[10px] border border-mm-line bg-white md:block" style={{ boxShadow: liftShadow }}>
            <CroppedShot image={image} crop={FULL} sizes="(min-width: 1024px) 960px, 92vw">
              <Points crop={FULL} callouts={callouts} all={callouts} />
            </CroppedShot>
          </div>
          <div className="grid gap-2 md:hidden">
            {halves.map((half, i) => (
              <div key={i} className="overflow-hidden rounded-[8px] border border-mm-line bg-white" style={{ boxShadow: liftShadow }}>
                <CroppedShot image={image} crop={half} sizes="184vw" decorative={i > 0}>
                  <Points crop={half} callouts={callouts} all={callouts} />
                </CroppedShot>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <figcaption className="mt-4 grid gap-3">
        <ol className="m-0 grid list-none gap-x-6 gap-y-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {callouts.map((c, i) => (
            <li key={c.label} className="mm-caption flex items-center gap-2.5 text-mm-body">
              <Num n={i + 1} />
              {c.label}
            </li>
          ))}
        </ol>
        <p className="mm-caption m-0">
          {area.caption}. <span className="text-mm-muted">{copy.demoData}.</span>
        </p>
      </figcaption>
    </figure>
  );
};

export const ScreenPlate: React.FC<{ area: ScreenArea }> = ({ area }) => {
  if (area.backdrop) return <StripPlate area={{ ...area, backdrop: area.backdrop }} />;
  return <FocusPlate area={area} />;
};

const FocusPlate: React.FC<{ area: ScreenArea }> = ({ area }) => {
  const reduce = useReducedMotion();
  const { image, focus } = area;
  const cropAspect = (focus.w * image.width) / (focus.h * image.height);
  const tall = cropAspect < 1;
  // Width of the detail inside the row (the rest is the label margin).
  const frontW = tall ? 36 : 64;
  // The map of the whole screen: 26% of the plate, tucked behind the detail's top-left corner.
  const mapW = 22;
  const mapH = mapW * (image.height / image.width);
  const callouts = area.callouts.filter((c) => {
    const p = inCrop(c, focus);
    return p.left >= 0 && p.left <= 100 && p.top >= 0 && p.top <= 100;
  });

  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-[18px] border border-mm-line bg-mm-pale p-2.5 sm:p-6 md:p-8"
        style={plateGrid}
      >
        <div className="relative">
          {/* The whole screen, small, with the focus marked (wide screens) */}
          <div
            className="absolute left-0 top-0 hidden overflow-hidden rounded-[6px] border border-mm-line bg-mm-page md:block"
            style={{ width: `${mapW}%` }}
            aria-hidden="true"
          >
            <CroppedShot image={image} crop={FULL} sizes={zoomSizes(1, 230, 26)} decorative>
              <span
                className="absolute rounded-[2px] border-[1.5px]"
                style={{
                  left: `${focus.x * 100}%`,
                  top: `${focus.y * 100}%`,
                  width: `${focus.w * 100}%`,
                  height: `${focus.h * 100}%`,
                  borderColor: MARK,
                  backgroundColor: 'rgb(15 42 82 / 0.08)',
                }}
              />
            </CroppedShot>
          </div>

          {/* The telling detail, in front, with labels in the margin */}
          <div
            className="relative flex md:[padding-left:var(--pad-l)] md:[padding-top:var(--pad-t)]"
            style={
              {
                '--pad-l': `${mapW * 0.32}%`,
                '--pad-t': `${mapH * 0.5}%`,
              } as React.CSSProperties
            }
          >
            <motion.div
              className={cx(
                'relative w-full shrink-0 md:[width:var(--front-w-md)] lg:[width:var(--front-w)]',
                tall && 'max-md:mx-auto max-md:max-w-[300px]'
              )}
              style={{ '--front-w': `${frontW}%`, '--front-w-md': tall ? '42%' : '92%' } as React.CSSProperties}
              initial={reduce ? false : { x: 22, y: 22, scale: 0.985 }}
              whileInView={{ x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="overflow-hidden rounded-[10px] border border-mm-line bg-white"
                style={{ boxShadow: liftShadow }}
              >
                <CroppedShot image={image} crop={focus} sizes={zoomSizes(focus.w, frontW * 9.6, 92)}>
                  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    {callouts.map((c, i) => {
                      const p = inCrop(c, focus);
                      return (
                        <span key={c.label} className="absolute" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
                          <Num onScreen n={i + 1} className="absolute -left-2 -top-2 h-4 w-4 text-[10px] ring-2 ring-white md:-left-2.5 md:-top-2.5 md:h-5 md:w-5 md:text-[11px]" />
                        </span>
                      );
                    })}
                  </div>
                </CroppedShot>
              </div>
            </motion.div>

            {/* Margin labels, each level with its point (wide screens) */}
            <ol className="relative m-0 hidden min-w-0 flex-1 list-none p-0 lg:block" aria-hidden="true">
              {callouts.map((c, i) => (
                <li
                  key={c.label}
                  className="absolute left-0 right-0 flex -translate-y-1/2 items-center gap-2"
                  style={{ top: `${inCrop(c, focus).top}%` }}
                >
                  <span className="block h-px w-5 shrink-0 bg-mm-ink opacity-50" />
                  <Num n={i + 1} />
                  <span className="font-mono text-[12px] font-medium leading-snug text-mm-ink">{c.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 grid gap-3">
        {/* The labels as a key: read by screen readers everywhere, shown on phones */}
        <ol className="m-0 grid list-none gap-2 p-0 max-lg:mb-1 lg:sr-only">
          {callouts.map((c, i) => (
            <li key={c.label} className="mm-caption flex items-center gap-2.5 text-mm-body">
              <Num n={i + 1} />
              {c.label}
            </li>
          ))}
        </ol>
        <p className="mm-caption m-0">
          {area.caption}. <span className="text-mm-muted">{copy.demoData}.</span>
        </p>
      </figcaption>
    </figure>
  );
};

/** How the work travels, for areas with no honest screen to show. */
export const FlowPlate: React.FC<{ area: FlowArea }> = ({ area }) => {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });
  return (
  <figure className="m-0">
    <div
      ref={ref}
      className={cx(
        live && 'is-live',
        'relative overflow-hidden rounded-[18px] border border-mm-line bg-mm-pale px-5 py-8 sm:px-8 md:px-10 md:py-12'
      )}
      style={plateGrid}
    >
      <ol className="relative m-0 grid list-none gap-7 p-0 md:grid-cols-4 md:gap-4">
        <span aria-hidden="true" className="product-flow-path">
          <span className="product-flow-pulse" />
        </span>
        {area.steps.map((step, i) => (
          <li key={step.title} className="relative pl-9 md:pl-0 md:pt-10">
            <span
              aria-hidden="true"
              className={cx(
                'absolute left-0 top-0.5 block h-[19px] w-[19px] rounded-full border-[1.5px] border-mm-system md:top-0',
                i === area.steps.length - 1 ? 'bg-mm-system' : 'bg-mm-page'
              )}
            />
            <p className="m-0 font-display text-[1.25rem] font-medium leading-tight text-mm-ink md:text-[1.375rem]">
              {step.title}
            </p>
            <p className="mm-caption m-0 mt-1.5 text-mm-body">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
    <figcaption className="mm-caption mt-4">{area.caption}</figcaption>
  </figure>
  );
};

import React from 'react';
import type { ResponsiveImage } from '../../content/types';
import type { ProductTile } from '../../content/landing.v2.c';
import { liftShadow } from './ProductPlate.styles';
import { cn } from '../../utils/cn';

/**
 * Lane C helper: one tile of the product composition. The tile is a window
 * onto a real screen, zoomed so the telling part fills it, with one short
 * tag laid on the screen and the area's name beneath. The screens are light
 * captures, so they sit on white in both themes; everything around them
 * follows the theme through mm-* tokens.
 */

const Picture: React.FC<{
  image: ResponsiveImage;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ image, sizes, className, style }) => (
  <picture>
    {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
    {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
    <img
      src={image.fallback}
      alt={image.alt}
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

export const ProductTileView: React.FC<{
  tile: ProductTile;
  /** Share of the 96rem grid this tile spans on wide screens (0 to 1). */
  span: number;
  className?: string;
  screenClassName?: string;
}> = ({ tile, span, className, screenClassName }) => {
  const { image, view, front } = tile;
  const sizes = `(min-width: 1024px) ${Math.round((span * 1536) / view.w)}px, ${Math.round(100 / view.w)}vw`;
  return (
    <figure className={cn('m-0 flex min-w-0 flex-col', className)}>
      <div
        className={cn(
          'relative min-h-0 flex-1 overflow-hidden rounded-[12px] border border-mm-line bg-white',
          screenClassName
        )}
        style={{ boxShadow: liftShadow }}
      >
        <Picture
          image={image}
          sizes={sizes}
          className="absolute top-0 max-w-none"
          style={{
            width: `${100 / view.w}%`,
            height: 'auto',
            left: `${(-view.x / view.w) * 100}%`,
            transform: `translateY(${-view.y * 100}%)`,
          }}
        />
        {front && (
          <div
            className="absolute inset-x-[5%] bottom-[9%] overflow-hidden rounded-[8px] border border-mm-line bg-white"
            style={{ boxShadow: liftShadow }}
          >
            <Picture
              image={front.image}
              sizes={`(min-width: 1024px) ${Math.round(span * 1536 * 0.9)}px, 90vw`}
              className="block h-auto w-full"
            />
          </div>
        )}
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-mm-ink px-3 py-1.5 font-mono text-[12px] font-medium leading-none text-mm-surface dark:bg-mm-surface dark:text-mm-ink lg:[left:var(--tx)] lg:[top:var(--ty)]"
          style={{ '--tx': `${tile.tagAt.x * 100}%`, '--ty': `${tile.tagAt.y * 100}%` } as React.CSSProperties}
        >
          <span className="h-2 w-2 rounded-full border-[1.5px] border-current" />
          {tile.tag}
        </span>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-semibold text-mm-ink lg:text-base">{tile.name}</span>
        <span className="sr-only">: {tile.tag}</span>
      </figcaption>
    </figure>
  );
};

import React from 'react';
import { cn } from '../../utils/cn';
import type { ResponsiveImage } from '../../content/types';

/**
 * Quiet browser frame for a real product screenshot. Renders <picture>
 * with AVIF and WebP srcsets, explicit width/height (no layout shift),
 * lazy loading, and a "Demo data" caption under the frame.
 *
 *   <BrowserFrame image={billingShot} label="Billing" />
 *   <BrowserFrame image={heroShot} priority caption="Demo data · lab worklist" />
 *
 * priority: only for the hero image (eager + high fetch priority).
 * label: short text shown in the frame's address bar (optional).
 */
interface BrowserFrameProps {
  image: ResponsiveImage;
  label?: string;
  caption?: React.ReactNode;
  priority?: boolean;
  className?: string;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  image,
  label,
  caption = 'Demo data',
  priority = false,
  className,
}) => {
  const sizes = image.sizes ?? '(min-width: 1152px) 1088px, 100vw';
  return (
    <figure className={cn('w-full', className)}>
      <div className="overflow-hidden rounded-[10px] border border-mm-line bg-mm-page">
        <div className="flex h-8 items-center gap-3 border-b border-mm-line bg-mm-tint px-3" aria-hidden="true">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-mm-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-mm-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-mm-line" />
          </span>
          {label && <span className="mm-caption truncate text-xs">{label}</span>}
        </div>
        <picture>
          {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
          {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
          <img
            src={image.fallback}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            // React 18 warns on camelCase fetchPriority; the lowercase attribute passes through.
            {...{ fetchpriority: priority ? 'high' : 'auto' }}
            className="block h-auto w-full"
          />
        </picture>
      </div>
      {caption && <figcaption className="mm-caption mt-3">{caption}</figcaption>}
    </figure>
  );
};

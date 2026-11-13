import React from 'react';
import { traction } from '../../content/landing.v2.lane-d';
import { dDisplay, dEdge, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * Traction (#traction): four big facts directly under the hero, in one row
 * across the full page grid (2 x 2 on smaller screens). Same tone as the
 * hero so it reads as the hero's last line, not a new band: light in the
 * light theme, ink in the dark theme. Static; the Proof section is the big
 * moment, this is the strip.
 */
export const TractionStrip: React.FC = () => (
  <section
    id="traction"
    aria-labelledby="traction-title"
    className="mm-tone-navy relative scroll-mt-16 bg-mm-surface text-mm-body md:scroll-mt-20"
  >
    <h2 id="traction-title" className="sr-only">
      {traction.srTitle}
    </h2>
    <div className={dEdge}>
      <ul className="grid grid-cols-2 border-y border-mm-line lg:grid-cols-4">
        {traction.items.map((item, i) => (
          <li
            key={item.label}
            className={cn(
              'flex flex-col gap-2.5 py-6 md:py-8',
              // hairline separators: between columns on desktop, a 2 x 2 grid on smaller screens
              i % 2 === 1 && 'border-l border-mm-line pl-4 sm:pl-8',
              i % 2 === 0 && 'pr-4 sm:pr-8',
              i >= 2 && 'border-t border-mm-line lg:border-t-0',
              i === 2 && 'lg:border-l lg:pl-8'
            )}
          >
            <span className={cn(dMono, 'text-[12px] text-mm-muted')}>{item.label}</span>
            <span
              className={cn(
                dDisplay,
                'text-[1.75rem] leading-[1.02] text-mm-ink [font-variant-numeric:lining-nums] sm:text-[2.25rem] xl:text-[2.75rem]'
              )}
            >
              {item.figure}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

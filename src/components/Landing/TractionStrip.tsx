import React from 'react';
import { traction } from '../../content/landing.v2.lane-d';
import { dEdge, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * Traction (#traction): one quiet line of credentials directly under the
 * hero. Same ink canvas as the hero so it reads as the hero's last line,
 * not a new band. Four facts, hairline separators, a live status light on
 * the one thing in daily use. Fully static (no loop: the design language
 * allows ambient loops only with a pause control).
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
      <ul className="grid grid-cols-2 border-t border-mm-line lg:grid-cols-4">
        {traction.items.map((item, i) => (
          <li
            key={item.key}
            className={cn(
              'flex flex-col gap-1.5 py-5 md:py-7',
              // hairline separators: between columns on desktop, a 2 x 2 grid on smaller screens
              i % 2 === 1 && 'border-l border-mm-line pl-4 sm:pl-6',
              i % 2 === 0 && 'pr-4 sm:pr-6',
              i >= 2 && 'border-t border-mm-line lg:border-t-0',
              i === 2 && 'lg:border-l lg:pl-6',
              i === 1 && 'lg:pr-6'
            )}
          >
            <span className={cn(dMono, 'flex items-center gap-2 text-mm-muted')}>
              {item.live && (
                <span
                  className="inline-flex h-2 w-2 rounded-full bg-mm-system shadow-[0_0_8px_var(--mm-system)]"
                  aria-hidden="true"
                />
              )}
              {item.key}
            </span>
            <span className="text-[1rem] font-medium leading-snug text-mm-ink md:text-[1.0625rem]">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

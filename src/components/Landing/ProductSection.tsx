import React, { useEffect, useState } from 'react';
import { SectionShell } from '../ui';
import { product as copy } from '../../content/landing.v2.c';
import type { AreaStatus } from '../../content/landing.v2.c';
import { FlowPlate, ScreenPlate } from './ProductPlate';
import { cn } from '../../utils/cn';

/**
 * The product today (#product, lane C). Six areas, each readable on its own
 * as you scroll: name, honest status, one line, and a composition of the real
 * screen (or a labelled diagram where no honest screen exists yet). On wide
 * screens a sticky index follows the scroll and jumps between areas.
 */

const cx = cn;

/** Filled dot: in daily use. Ring: built, running beside the current system. */
export const StatusDot: React.FC<{ status: AreaStatus; className?: string }> = ({ status, className }) => (
  <span
    aria-hidden="true"
    className={cx(
      'inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-mm-system',
      status === 'daily' && 'bg-mm-system shadow-[0_0_0_4px_var(--mm-system-soft)]',
      className
    )}
  />
);

const StatusMark: React.FC<{ status: AreaStatus }> = ({ status }) => (
  <p className="mm-caption m-0 inline-flex items-center gap-2.5 font-mono text-[13px] text-mm-body">
    <StatusDot status={status} />
    {status === 'daily' ? copy.status.daily : copy.status.beside}
  </p>
);

export const ProductSection: React.FC = () => {
  const [active, setActive] = useState(copy.areas[0].id);

  // The index follows whichever area crosses the middle of the screen.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(hit.target.id.replace('product-', ''));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    copy.areas.forEach((area) => {
      const node = document.getElementById(`product-${area.id}`);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <SectionShell id="product" tone="white" labelledBy="product-title">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <h2 id="product-title" className="mm-h2 m-0 text-balance lg:col-span-7">
          {copy.title.map((line) => (
            <span key={line} className="block">
              {line}{' '}
            </span>
          ))}
        </h2>
        <div className="lg:col-span-5">
          <p className="mm-lead m-0 max-w-xl text-pretty">{copy.support}</p>
          <ul className="m-0 mt-6 grid list-none gap-2.5 p-0">
            <li className="mm-caption flex items-start gap-3 text-mm-body">
              <StatusDot status="daily" className="mt-[5px]" />
              {copy.status.dailyLong}
            </li>
            <li className="mm-caption flex items-start gap-3 text-mm-body">
              <StatusDot status="beside" className="mt-[5px]" />
              {copy.status.besideLong}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 grid gap-16 md:mt-20 xl:grid-cols-12 xl:gap-10">
        <nav aria-label={copy.navLabel} className="hidden xl:col-span-2 xl:block">
          <ol className="sticky top-28 m-0 list-none border-l border-mm-line p-0">
            {copy.areas.map((area) => {
              const on = active === area.id;
              return (
                <li key={area.id}>
                  <a
                    href={`#product-${area.id}`}
                    aria-current={on ? 'true' : undefined}
                    className={cx(
                      '-ml-px flex min-h-[44px] items-center gap-3 border-l-2 py-2 pl-4 pr-1 text-[15px] leading-snug transition-colors',
                      on
                        ? 'border-mm-ink font-semibold text-mm-ink'
                        : 'border-transparent text-mm-muted hover:border-mm-line hover:text-mm-ink'
                    )}
                  >
                    <StatusDot status={area.status} />
                    {area.name}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid gap-20 md:gap-24 lg:gap-32 xl:col-span-10">
          {copy.areas.map((area) => (
            <article
              key={area.id}
              id={`product-${area.id}`}
              aria-labelledby={`product-${area.id}-title`}
              className="scroll-mt-28"
            >
              <div className="mb-6 grid gap-3 md:mb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline md:gap-x-8">
                <h3 id={`product-${area.id}-title`} className="mm-h3 m-0">
                  {area.name}
                </h3>
                <div className="md:row-start-1 md:col-start-2">
                  <StatusMark status={area.status} />
                </div>
                <p className="mm-body m-0 max-w-2xl text-pretty md:col-span-2">{area.line}</p>
              </div>
              {area.kind === 'screen' ? <ScreenPlate area={area} /> : <FlowPlate area={area} />}
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

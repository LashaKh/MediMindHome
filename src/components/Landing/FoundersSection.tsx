import React from 'react';
import { SectionShell } from '../ui';
import { foundersPhoto as photo, team } from '../../content/landing.v2.lane-d';
import { cn } from '../../utils/cn';

/**
 * Founders (#team): "Built from inside a hospital." Across the full grid:
 * the headline, one line and three short credentials (two founders and the
 * AI engineering team) on the left, the real photo on the right, backers in
 * one quiet row under the credentials.
 */
export const FoundersSection: React.FC = () => (
  <SectionShell id="team" tone="pale" labelledBy="team-title">
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
      <div className="lg:col-span-7">
        <h2 id="team-title" className="mm-h2 text-balance">
          {team.title}
        </h2>
        <p className="mm-lead mt-5 max-w-[44ch] text-pretty">{team.lead}</p>

        {/* Two people (ink rule) and the AI engineering team (the system's blue rule). */}
        <ul className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-8 md:mt-12">
          {team.people.map((person, i) => (
            <li key={person.name} className="relative pt-5">
              <span
                aria-hidden="true"
                className={cn('absolute inset-x-0 top-0 h-px', i === team.people.length - 1 ? 'bg-mm-system' : 'bg-mm-rule')}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 top-[-2px] h-[5px] w-[5px] rounded-full',
                  i === team.people.length - 1 ? 'bg-mm-system' : 'bg-mm-rule'
                )}
              />
              <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.006em] text-mm-ink">{person.name}</h3>
              <p className="mm-body mt-1 text-pretty">{person.role}</p>
            </li>
          ))}
        </ul>

      </div>

      <figure className="relative lg:col-span-5">
        <picture>
          <source type="image/avif" srcSet={photo.avif} sizes={photo.sizes} />
          <source type="image/webp" srcSet={photo.webp} sizes={photo.sizes} />
          <img
            src={photo.fallback}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-[14px] object-cover"
          />
        </picture>
        {/* A fine inner edge so the photo sits in the page like a print, not a pasted rectangle. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </figure>
    </div>
  </SectionShell>
);

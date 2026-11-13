import React from 'react';
import { SectionShell } from '../ui';
import { foundersPhoto as photo, team } from '../../content/landing.v2.lane-d';
import { dMono } from './laneD.styles';
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
        <p className="mm-lead mt-6 max-w-[40ch] text-pretty">{team.lead}</p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-8 md:mt-14">
          {team.people.map((person) => (
            <li key={person.name} className="border-t-2 border-mm-rule pt-4">
              <h3 className="text-[1.125rem] font-semibold leading-snug text-mm-ink md:text-[1.1875rem]">{person.name}</h3>
              <p className="mm-body mt-1.5 text-pretty">{person.role}</p>
            </li>
          ))}
        </ul>

        <p className={cn(dMono, 'mt-10 text-mm-muted md:mt-14')}>
          {team.backersLead} <span className="text-mm-ink">{team.backers.join(' · ')}</span>
        </p>
      </div>

      <figure className="lg:col-span-5">
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
            className="block h-auto w-full rounded-[6px] object-cover"
          />
        </picture>
      </figure>
    </div>
  </SectionShell>
);

import React from 'react';
import { SectionShell } from '../ui';
import { foundersPhoto as photo, team } from '../../content/landing.v2.lane-d';
import { dDisplay, dH2, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * Founders (#team): "Built from inside a hospital." The headline and the
 * 2 a.m. statement on the left; the real photo on the right with each
 * founder's facts set directly under the half of the photo they stand in,
 * joined by a thin callout tick, so the picture and the names read as one.
 */
export const FoundersSection: React.FC = () => (
  <SectionShell id="team" tone="pale" labelledBy="team-title">
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start lg:pt-4">
        <h2 id="team-title" className={dH2}>
          {team.title}
        </h2>
        <p className="mm-lead mt-6 max-w-md text-pretty">{team.lead}</p>
        <p
          className={cn(
            dDisplay,
            'mt-10 max-w-md border-l-2 border-mm-rule pl-5 text-[1.5rem] leading-[1.25] text-mm-ink md:text-[1.75rem] text-pretty'
          )}
        >
          {team.statement}
        </p>
        <p className="mm-caption mt-10 hidden max-w-md lg:block">
          <span className="font-semibold text-mm-ink">{team.backersLead}</span> {team.backers.join(', ')}.
        </p>
      </div>

      <figure className="lg:col-span-7">
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
        <figcaption className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
          {team.people.map((person) => (
            <div key={person.name} className="relative pt-6 sm:pt-7">
              {/* callout tick up to the photo, under the half each founder stands in (two columns only) */}
              <span className="absolute left-0 top-0 hidden h-5 w-px bg-mm-rule sm:block" aria-hidden="true" />
              <h3 className="text-[1.1875rem] font-semibold leading-snug text-mm-ink md:text-[1.25rem]">{person.name}</h3>
              <p className={cn(dMono, 'mt-1 text-mm-muted')}>{person.role}</p>
              <p className="mm-body mt-3 max-w-sm text-pretty">{person.bio}</p>
            </div>
          ))}
        </figcaption>
      </figure>

      <p className="mm-caption -mt-4 lg:hidden">
        <span className="font-semibold text-mm-ink">{team.backersLead}</span> {team.backers.join(', ')}.
      </p>
    </div>
  </SectionShell>
);

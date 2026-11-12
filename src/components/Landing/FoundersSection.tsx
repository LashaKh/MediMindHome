import React from 'react';
import { SectionShell, SectionHeading, Reveal } from '../ui';
import { founders } from '../../content/landing.trust';

/** Team: the two founders, one concrete proof each, and who backs them. */
export const FoundersSection: React.FC = () => {
  const { photo } = founders;
  return (
    <SectionShell id="team" tone="pale" labelledBy="team-title">
      <SectionHeading
        as="h2"
        id="team-title"
        eyebrow={founders.eyebrow}
        title={
          <>
            {founders.title} <span className="mm-accent-text">{founders.accent}</span> {founders.titleEnd}
          </>
        }
        support={founders.support}
      />
      <div className="mt-12 grid items-start gap-10 md:grid-cols-12 lg:mt-16 lg:gap-16">
        <Reveal as="figure" className="md:col-span-5">
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
              className="h-auto w-full rounded-lg border border-mm-line"
            />
          </picture>
        </Reveal>
        <div className="md:col-span-7">
          <ul className="grid gap-10">
            {founders.people.map((person) => (
              <li key={person.name} className="border-t-4 border-mm-rule pt-5">
                <h3 className="mm-h3">{person.name}</h3>
                <p className="mm-eyebrow mt-1">{person.role}</p>
                <p className="mm-body mt-3 max-w-xl">{person.proof}</p>
              </li>
            ))}
          </ul>
          <p className="mm-caption mt-10 border-t border-mm-line pt-5">{founders.backers}</p>
        </div>
      </div>
    </SectionShell>
  );
};

import React from 'react';
import { SectionShell, SectionHeading, BrowserFrame, Reveal } from '../ui';
import { whatChanges as copy } from '../../content/landing.story';

/**
 * What changes (#system): one operating system, six areas an owner
 * recognises, the honest status of each, and one large real screen.
 * Dense section on pale; the next section (examples) is airier on white.
 */
export const WhatChangesSection: React.FC = () => (
  <SectionShell id="system" tone="pale" labelledBy="system-title">
    <SectionHeading
      as="h2"
      id="system-title"
      eyebrow={copy.eyebrow}
      title={copy.title}
      accent={<span className="md:whitespace-nowrap">{copy.accent}</span>}
      support={copy.support}
      className="[&_h2]:text-balance [&_p]:text-pretty"
    />

    <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
      {copy.areas.map((area, i) => (
        <Reveal as="li" key={area.name} delay={(i % 3) * 50} className="border-t border-mm-line pt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="mm-body font-semibold text-mm-ink">{area.name}</h3>
            {area.inDailyUse && (
              <span className="mm-caption inline-flex items-center gap-1.5 rounded-full bg-mm-tint px-2.5 py-0.5 font-semibold text-mm-link">
                <span className="h-1.5 w-1.5 rounded-full bg-mm-link" aria-hidden="true" />
                {copy.dailyUseChip}
              </span>
            )}
          </div>
          <p className="mm-body mt-1 max-w-sm">{area.line}</p>
        </Reveal>
      ))}
    </ul>

    <p className="mm-caption mt-8 max-w-2xl text-pretty">{copy.statusFootnote}</p>

    <Reveal className="mt-12 lg:mt-16">
      <BrowserFrame image={copy.image} label={copy.imageLabel} caption={copy.caption} />
    </Reveal>

    <p className="mm-body mt-10 max-w-2xl border-l-2 border-mm-rule pl-4 font-semibold text-mm-ink">
      {copy.standardLine}
    </p>
  </SectionShell>
);

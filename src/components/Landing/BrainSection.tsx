import React from 'react';
import { SectionShell } from '../ui';
import { brain as copy } from '../../content/landing.v2.c';
import { BrainDial } from './BrainDial';
import { BrainScreens } from './BrainScreens';

/**
 * The hospital brain (#brain, lane C), in development. The autonomy dial
 * first: the headline and one line beside it, what the current step means,
 * the three limits that never move and the off switch. Under it, real
 * screens of the brain harness (Control Center, staff inbox, morning
 * brief, workers, proof). Blue is the system working; amber is a person
 * deciding.
 */

export const BrainSection: React.FC = () => (
  <SectionShell id="brain" tone="navy" labelledBy="brain-title">
    <BrainDial
      intro={
        <>
          <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="mm-dev-badge">{copy.chip}</span>
            <span className="mm-eyebrow">{copy.label}</span>
          </p>
          <h2 id="brain-title" className="mm-h2 m-0 mt-6 text-balance">
            {copy.title.map((line, i) => (
              <span key={line} className={i === 1 ? 'block mm-accent-text' : 'block'}>
                {line}{' '}
              </span>
            ))}
          </h2>
          <p className="mm-lead m-0 mt-5 max-w-[34rem] text-pretty">{copy.support}</p>
        </>
      }
    />
    <BrainScreens />
  </SectionShell>
);

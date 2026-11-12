import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionShell, SectionHeading, Reveal } from '../ui';
import { vision as copy } from '../../content/landing.story';
import { showPracticeCase } from '../../content/site';

/**
 * The proactive hospital (#vision): what MediMind is building next,
 * labelled "In development" at the top and again on the navy punch block.
 * Reactive vs proactive is a list of matched pairs: two columns with an
 * arrow on wide screens, stacked and labelled on phones (never a squeezed
 * table). The navy block is the one loud moment in the middle of the page.
 */
const DevelopmentChip: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`mm-caption inline-flex items-center gap-2 rounded-full border-[1.5px] border-mm-link px-3 py-1 font-semibold text-mm-link ${className ?? ''}`}
  >
    <span className="h-2 w-2 rounded-full border-[1.5px] border-mm-link" aria-hidden="true" />
    {copy.chip}
  </span>
);

export const VisionSection: React.FC = () => (
  <SectionShell id="vision" tone="pale" labelledBy="vision-title">
    <DevelopmentChip className="mb-6" />
    <SectionHeading
      as="h2"
      id="vision-title"
      eyebrow={copy.eyebrow}
      title={copy.title}
      accent={<span className="md:whitespace-nowrap">{copy.accent}</span>}
      support={copy.support}
      className="[&_h2]:text-balance [&_p]:text-pretty"
    />

    {/* Reactive vs proactive, as matched pairs */}
    <div className="mt-14 lg:mt-20">
      <h3 className="mm-h3 text-balance">{copy.tableIntro}</h3>

      <div
        className="mt-8 hidden grid-cols-[1fr_2.5rem_1fr] gap-x-6 pb-3 md:grid"
        aria-hidden="true"
      >
        <p className="mm-eyebrow">
          {copy.reactiveHeading} <span className="font-normal normal-case tracking-normal">{copy.reactiveNote}</span>
        </p>
        <span />
        <p className="mm-eyebrow text-mm-ink">
          {copy.proactiveHeading} <span className="font-normal normal-case tracking-normal">{copy.proactiveNote}</span>
        </p>
      </div>

      <ol className="mt-6 border-b border-mm-line md:mt-0">
        {copy.pairs.map((pair) => (
          <li
            key={pair.reactive}
            className="grid gap-y-3 border-t border-mm-line py-5 md:grid-cols-[1fr_2.5rem_1fr] md:items-baseline md:gap-x-6"
          >
            <p className="mm-body">
              <span className="mm-eyebrow mb-1 block md:sr-only">{copy.reactiveHeading}</span>
              {pair.reactive}
            </p>
            <ArrowRight className="hidden h-5 w-5 self-center text-mm-muted md:block" aria-hidden="true" />
            <p className="mm-body font-semibold text-mm-ink">
              <span className="mm-eyebrow mb-1 block md:sr-only">{copy.proactiveHeading}</span>
              {pair.proactive}
            </p>
          </li>
        ))}
      </ol>
    </div>

    {/* Punch block */}
    <Reveal className="mm-tone-navy mt-16 rounded-[10px] bg-mm-surface px-6 py-12 sm:px-10 md:py-16 lg:mt-24 lg:px-16 lg:py-20">
      <DevelopmentChip className="mb-8" />
      <p className="mm-h2 max-w-3xl">
        {copy.punchLine.map((sentence, i) => (
          <span key={sentence} className="block text-balance">
            {i > 0 && <span className="sr-only"> </span>}
            {sentence}
          </span>
        ))}
      </p>
      <p className="mm-lead mt-5">{copy.punchSupport}</p>
    </Reveal>

    {/* How it will work */}
    <div className="mt-16 lg:mt-24">
      <h3 className="mm-h3 text-balance">{copy.rulesTitle}</h3>
      <ul className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
        {copy.rules.map((rule) => (
          <li key={rule.title} className="border-t border-mm-line pt-4">
            <p className="mm-body max-w-xl">
              <span className="font-semibold text-mm-ink">{rule.title}</span> {rule.body}
            </p>
          </li>
        ))}
      </ul>
    </div>

    {/* A personal note from the cardiologist co-founder, set apart quietly */}
    {showPracticeCase && (
      <aside aria-labelledby="vision-case-title" className="mt-16 max-w-2xl border-l-2 border-mm-line pl-6 lg:mt-24">
        <h3 id="vision-case-title" className="mm-body font-semibold text-mm-ink">
          {copy.practiceCase.label}
        </h3>
        <p className="mm-body mt-3">{copy.practiceCase.body}</p>
        <p className="mm-body mt-3">{copy.practiceCase.closing}</p>
      </aside>
    )}
  </SectionShell>
);

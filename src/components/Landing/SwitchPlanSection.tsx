import React from 'react';
import { SectionShell, SectionHeading, Column, Reveal } from '../ui';
import { switchPlan as copy } from '../../content/landing.story';
import { showCustomerName } from '../../content/site';

/**
 * The objection and the plan (#switch): the owner's fear as the heading,
 * then three dated steps that read as a timeline (left to right on desktop,
 * a continuous line top to bottom on a phone), the switch-without-stopping
 * points and the proof. Dense section on pale.
 */
export const SwitchPlanSection: React.FC = () => (
  <SectionShell id="switch" tone="pale" labelledBy="switch-title">
    <SectionHeading
      as="h2"
      id="switch-title"
      eyebrow={copy.eyebrow}
      title={
        <>
          “{copy.titleBefore}{' '}
          <span className="whitespace-nowrap">
            <span className="mm-accent-text">{copy.accent}</span>.”
          </span>
        </>
      }
      support={copy.support}
      className="[&_p]:text-pretty"
    />

    {/* The plan */}
    <div className="mt-14 lg:mt-20">
      <h3 className="mm-h3 text-balance">{copy.planTitle}</h3>
      <ol className="mt-8 grid lg:grid-cols-3 lg:gap-x-3">
        {copy.steps.map((step, i) => (
          <Reveal as="li" key={step.label} delay={i * 75}>
            <Column
              as="h4"
              label={step.label}
              title={step.title}
              className="max-w-2xl border-l-4 border-t-0 pb-10 pl-5 pt-0 lg:max-w-none lg:border-l-0 lg:border-t-4 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-5"
            >
              <p>{step.body}</p>
              <p className="mt-4 text-mm-link">
                <span className="font-semibold">{copy.successPrefix}</span> {step.success}
              </p>
            </Column>
          </Reveal>
        ))}
      </ol>

      <p className="mm-lead mt-10 text-balance font-semibold text-mm-ink md:mt-12">{copy.decideLine}</p>
      <div className="mt-3 max-w-2xl space-y-2">
        <p className="mm-body">{copy.measuresLine}</p>
        <p className="mm-body">{copy.datesLine}</p>
      </div>
    </div>

    {/* Switch without stopping */}
    <div className="mt-16 lg:mt-24">
      <h3 className="mm-h3 text-balance">{copy.switchTitle}</h3>
      <ul className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-3">
        {copy.switchPoints.map((point) => (
          <li key={point.title} className="max-w-2xl border-t border-mm-line pt-4 lg:max-w-none">
            <p className="mm-body font-semibold text-mm-ink">{point.title}</p>
            <p className="mm-body mt-1">{point.body}</p>
          </li>
        ))}
      </ul>
      <p className="mm-body mt-8 font-semibold text-mm-ink">{copy.commitmentLine}</p>
    </div>

    {/* Proof */}
    <Reveal className="mt-16 grid items-center gap-x-10 gap-y-4 border-t border-mm-line pt-10 md:grid-cols-[auto,1fr] lg:mt-20">
      <p className="mm-stat" aria-hidden="true">
        {copy.proofFigure}
      </p>
      <div className="max-w-2xl">
        <p className="mm-lead text-mm-ink">{showCustomerName ? copy.proofNamed : copy.proofUnnamed}</p>
        {showCustomerName && (
          <figure className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <picture>
              <source type="image/webp" srcSet={copy.logo.dark.webp} />
              <img
                src={copy.logo.dark.fallback}
                alt={copy.logo.alt}
                width={copy.logo.width}
                height={copy.logo.height}
                loading="lazy"
                className="block h-auto w-[140px] dark:hidden"
              />
            </picture>
            <picture>
              <source type="image/webp" srcSet={copy.logo.white.webp} />
              <img
                src={copy.logo.white.fallback}
                alt={copy.logo.alt}
                width={copy.logo.width}
                height={copy.logo.height}
                loading="lazy"
                className="hidden h-auto w-[140px] dark:block"
              />
            </picture>
            <div className="min-w-0 flex-1 basis-64">
              <blockquote className="mm-body text-mm-ink">“{copy.quote}”</blockquote>
              <figcaption className="mm-caption mt-2">{copy.quoteAttribution}</figcaption>
            </div>
          </figure>
        )}
      </div>
    </Reveal>
  </SectionShell>
);

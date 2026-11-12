import React, { Suspense, lazy } from 'react';
import { SectionShell, ButtonLink } from '../ui';
import { primaryCta } from '../../content/site';
import { heroContent as c } from '../../content/landing.v2.a';
import { trackLanding } from '../../lib/tracking';

// The visual loads after the words: the headline, sub and button paint first.
const HeroOrchestration = lazy(() => import('./HeroOrchestration'));

/**
 * Hero: the page's only h1, on the ink canvas in both themes. The header is
 * transparent over it (MainLayout adds no top offset on `/`).
 *
 * Desktop (lg+): eyebrow and the two-sentence headline across the grid; under
 * it the sub, buttons and honesty line on the left (4 of 12) and the living
 * hospital on the right (8 of 12).
 * Tablet and phone: words first, the visual under them, the honesty line under
 * the visual. On a phone the first screen holds headline, sub and button.
 * The visual's box has a fixed height per breakpoint, so neither the lazy load
 * nor the animation moves anything.
 * Keep id="hero": the header and the sticky phone bar watch it.
 */
const visualBox = 'h-[604px] md:h-[500px]';

const Honesty: React.FC<{ className?: string }> = ({ className }) => (
  <p className={`mm-caption flex gap-2.5 ${className ?? ''}`}>
    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full border border-dashed border-mm-system" />
    <span className="[text-wrap:pretty]">{c.honesty}</span>
  </p>
);

export const HeroSection: React.FC = () => (
  <SectionShell
    id="hero"
    tone="navy"
    labelledBy="hero-title"
    className="overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32 lg:pb-16 lg:pt-[6.5rem]"
  >
    {/* The plane the hospital runs on: a faint grid, strongest behind the visual. */}
    <div aria-hidden="true" className="mm-hero-plane pointer-events-none absolute inset-0" />

    <div className="relative">
      <p className="mm-eyebrow">{c.eyebrow}</p>
      <h1 id="hero-title" className="mm-display mt-5 md:mt-6">
        {/* One sentence per balanced block: no stranded words at any width. */}
        {c.titleLines.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 && ' '}
            <span className="block">{line}</span>
          </React.Fragment>
        ))}
      </h1>

      <div className="mt-7 grid grid-cols-1 gap-y-12 md:mt-10 lg:mt-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="flex min-w-0 flex-col lg:col-span-4">
          <p className="mm-lead max-w-[34rem] text-mm-body">{c.sub}</p>
          <div className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-3">
            <ButtonLink
              href={primaryCta.href}
              className="whitespace-nowrap"
              onClick={() => trackLanding('cta_click', { location: 'hero' })}
            >
              {primaryCta.label}
            </ButtonLink>
            <a href={c.secondary.href} className="btn-quiet self-center sm:self-auto lg:self-start">
              {c.secondary.label}
            </a>
          </div>
          <Honesty className="mt-auto hidden max-w-[22rem] pt-10 lg:flex" />
        </div>

        <div className="min-w-0 lg:col-span-8">
          <div className={visualBox}>
            <Suspense fallback={<div className="h-full rounded-[18px] border border-mm-line" />}>
              <HeroOrchestration />
            </Suspense>
          </div>
          <Honesty className="mt-5 max-w-[40rem] lg:hidden" />
        </div>
      </div>
    </div>
  </SectionShell>
);

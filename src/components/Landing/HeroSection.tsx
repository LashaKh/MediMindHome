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
 * The living hospital is the centrepiece: the headline spans the top, the sub
 * and the buttons sit in one compact row beneath it (stacked on phones), and
 * the orchestration runs across the full content width with the honesty line
 * as its caption. On a phone the first screen holds headline, sub and button;
 * the visual follows in its own vertical form.
 * The visual's box has a fixed height per breakpoint, so neither the lazy load
 * nor the animation moves anything.
 * Keep id="hero": the header and the sticky phone bar watch it.
 */
const visualBox = 'h-[596px] lg:h-[472px]';

export const HeroSection: React.FC = () => (
  <SectionShell
    id="hero"
    tone="navy"
    labelledBy="hero-title"
    className="overflow-hidden pb-14 pt-24 md:pb-16 md:pt-32 lg:pb-14 lg:pt-[6.5rem]"
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

      <div className="mt-7 flex flex-col gap-8 md:mt-9 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <p className="mm-lead max-w-[36rem] text-mm-body">{c.sub}</p>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink
            href={primaryCta.href}
            className="whitespace-nowrap"
            onClick={() => trackLanding('cta_click', { location: 'hero' })}
          >
            {primaryCta.label}
          </ButtonLink>
          <a href={c.secondary.href} className="btn-quiet self-center sm:self-auto">
            {c.secondary.label}
          </a>
        </div>
      </div>

      <div className="mt-12 md:mt-14 lg:mt-9">
        <div className={visualBox}>
          <Suspense fallback={<div className="h-full border-t border-mm-line" />}>
            <HeroOrchestration />
          </Suspense>
        </div>
        {/* The visual's caption: what is in development, what runs today. */}
        <p className="mm-caption mt-5 flex max-w-[44rem] gap-2.5 border-mm-line lg:mt-4 lg:border-t lg:pt-4">
          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full border border-dashed border-mm-system" />
          <span className="[text-wrap:pretty]">{c.honesty}</span>
        </p>
      </div>
    </div>
  </SectionShell>
);

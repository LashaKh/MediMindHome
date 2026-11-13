import React, { Suspense, lazy } from 'react';
import { SectionShell, ButtonLink } from '../ui';
import { primaryCta } from '../../content/site';
import { heroContent as c } from '../../content/landing.v2.a';
import { trackLanding } from '../../lib/tracking';

// The visual loads after the words: the headline, sub and button paint first.
const HeroOrchestration = lazy(() => import('./HeroOrchestration'));

/**
 * Hero: the page's only h1, on the navy tone (daylight by day, the ink canvas
 * by night). The header is transparent over it (MainLayout adds no top offset
 * on `/`).
 *
 * lg and up: the headline owns the left of the grid, the sub-sentence and the
 * buttons sit at its baseline on the right, and the living hospital runs
 * across the full content width beneath. Headline, buttons and the whole
 * canvas fit one 1440x900 screen. On a phone the first screen holds the
 * headline, the sub-sentence and the button; the visual follows in its own
 * vertical form. The visual's box has a fixed height per breakpoint, so
 * neither the lazy load nor the animation moves anything.
 * Keep id="hero": the header and the sticky phone bar watch it.
 */
const visualBox = 'h-[596px] lg:h-[426px]';

export const HeroSection: React.FC = () => (
  <SectionShell
    id="hero"
    tone="navy"
    labelledBy="hero-title"
    className="overflow-hidden pb-12 pt-24 md:pb-14 md:pt-32 lg:pb-10 lg:pt-28"
  >
    {/* The plane the hospital runs on: a faint grid, strongest behind the visual; by day a wash of clear light. */}
    <div aria-hidden="true" className="mm-hero-light pointer-events-none absolute inset-0" />
    <div aria-hidden="true" className="mm-hero-plane pointer-events-none absolute inset-0" />

    <div className="relative">
      <div className="grid gap-7 md:gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-end lg:gap-16 2xl:grid-cols-[minmax(0,1fr)_minmax(0,29rem)]">
        <div>
          <p className="mm-eyebrow">{c.eyebrow}</p>
          <h1 id="hero-title" className="mm-display mt-5 md:mt-6">
            {/* One balanced block per line: no stranded words at any width. */}
            {c.titleLines.map((line, i) => (
              <React.Fragment key={line}>
                {i > 0 && ' '}
                <span className="sm:block">{line}</span>
              </React.Fragment>
            ))}
          </h1>
        </div>

        <div className="lg:pb-3">
          <p className="mm-lead max-w-[34rem] text-mm-body">{c.sub}</p>
          <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-6 md:mt-7">
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
      </div>

      <div className={`mt-12 md:mt-14 lg:mt-10 ${visualBox}`}>
        <Suspense fallback={<div className="h-full border-t border-mm-line" />}>
          <HeroOrchestration />
        </Suspense>
      </div>
    </div>
  </SectionShell>
);

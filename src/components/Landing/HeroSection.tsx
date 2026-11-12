import React from 'react';
import { Check } from 'lucide-react';
import { SectionShell, BrowserFrame, ButtonLink } from '../ui';
import { primaryCta } from '../../content/site';
import { heroContent as c } from '../../content/landing.top';
import { trackLanding } from '../../lib/tracking';

/**
 * Hero: the page's only h1. Words lead, the product follows.
 *
 * Desktop: the headline runs across the grid; under it, the sub and the button
 * on the left (7 of 12 columns) and the three benefits on the right; the
 * product screen spans the grid underneath and is visible above the fold.
 * Phone: pre-headline, headline, sub and button fill the first screen;
 * the trust line, benefits and screen follow.
 * Keep id="hero": the sticky phone bar watches it.
 */
export const HeroSection: React.FC = () => (
  <SectionShell
    id="hero"
    tone="white"
    labelledBy="hero-title"
    className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pb-24 lg:pt-10"
  >
    <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8">
      <div className="lg:col-span-12">
        <p className="text-base font-semibold text-mm-muted [text-wrap:balance] md:text-[17px]">{c.preHeadline}</p>
        <h1 id="hero-title" className="mm-display mt-4 max-w-[20ch] [text-wrap:balance] md:mt-5">
          {c.title}{' '}
          <span className="mm-accent-text">{c.accent}</span>
          {c.end}
        </h1>
      </div>

      <div className="lg:col-span-7">
        <p className="mm-lead max-w-[38rem] [text-wrap:pretty]">{c.sub}</p>
        <div className="mt-7 flex flex-col items-start gap-2.5">
          <ButtonLink
            href={primaryCta.href}
            className="w-full sm:w-auto"
            onClick={() => trackLanding('cta_click', { location: 'hero' })}
          >
            {primaryCta.label}
          </ButtonLink>
          <p className="mm-caption [text-wrap:balance]">{c.underButton}</p>
        </div>
        <p className="mm-caption mt-5 max-w-[38rem] font-semibold text-mm-body [text-wrap:balance]">
          {c.trust}
        </p>
      </div>

      {/* On desktop the list stretches to the left column's height, so its top and bottom hairlines line up with the sub and the trust line. */}
      <ul className="flex flex-col lg:col-span-5">
        {c.benefits.map((benefit) => (
          <li key={benefit} className="mm-body flex items-center border-t border-mm-line py-3.5 last:border-b lg:flex-1">
            <span className="flex gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-mm-accent" strokeWidth={2.25} aria-hidden="true" />
              <span className="[text-wrap:pretty]">{benefit}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Phones: the full screen would shrink to 140px and be unreadable, so the frame shows its left part at a readable size (fixed height, no layout shift). */}
    <BrowserFrame
      image={c.image}
      priority
      caption={c.imageCaption}
      className="mt-12 md:mt-14 lg:mt-10 max-md:[&_img]:h-[240px] max-md:[&_img]:w-auto max-md:[&_img]:max-w-none"
    />
  </SectionShell>
);

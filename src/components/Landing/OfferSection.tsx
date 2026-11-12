import React from 'react';
import { SectionShell, SectionHeading, Column, ButtonLink, Reveal } from '../ui';
import { offer } from '../../content/landing.trust';
import { showFoundingPlaces } from '../../content/site';
import { trackLanding } from '../../lib/tracking';

/** The offer: founding partner terms in deck columns, then the primary button. Navy punch section. */
export const OfferSection: React.FC = () => (
  <SectionShell id="offer" tone="navy" labelledBy="offer-title">
    <SectionHeading
      as="h2"
      id="offer-title"
      eyebrow={offer.eyebrow}
      title={offer.title}
      accent={offer.accent}
      support={offer.support}
    />
    <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
      {offer.terms.map((term, i) => (
        <Reveal key={term.title} delay={i * 50}>
          <Column title={term.title}>{term.text}</Column>
        </Reveal>
      ))}
    </div>
    <div className="mt-12 lg:mt-16">
      {showFoundingPlaces && <p className="mm-body mb-6 font-semibold text-mm-ink">{offer.places}</p>}
      <ButtonLink href={offer.cta.href} onClick={() => trackLanding('cta_click', { location: 'offer' })}>
        {offer.cta.label}
      </ButtonLink>
      <p className="mm-caption mt-4 max-w-xl">{offer.underButton}</p>
    </div>
  </SectionShell>
);

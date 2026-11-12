import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** The offer (trust lane). Placeholder from the foundation; navy "punch" section. */
export const OfferSection: React.FC = () => (
  <SectionShell id="offer" tone="navy" labelledBy="offer-title">
    <SectionHeading as="h2" id="offer-title" title="Offer" />
  </SectionShell>
);

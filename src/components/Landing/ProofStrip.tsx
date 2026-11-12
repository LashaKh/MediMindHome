import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Proof strip (top lane). Placeholder from the foundation. */
export const ProofStrip: React.FC = () => (
  <SectionShell id="proof" tone="pale" labelledBy="proof-title">
    <SectionHeading as="h2" id="proof-title" title="Proof strip" />
  </SectionShell>
);

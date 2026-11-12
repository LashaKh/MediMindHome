import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** The product today (lane C). Placeholder from the orchestrator; see 09-DIRECTION-V2.md. */
export const ProductSection: React.FC = () => (
  <SectionShell id="product" tone="white" labelledBy="product-title">
    <SectionHeading as="h2" id="product-title" title="The product today" />
  </SectionShell>
);

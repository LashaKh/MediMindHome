import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** FAQ (trust lane). Placeholder from the foundation. */
export const FaqSection: React.FC = () => (
  <SectionShell id="faq" tone="white" narrow labelledBy="faq-title">
    <SectionHeading as="h2" id="faq-title" title="FAQ" />
  </SectionShell>
);

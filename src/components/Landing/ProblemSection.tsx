import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** The problem (top lane). Placeholder from the foundation. */
export const ProblemSection: React.FC = () => (
  <SectionShell id="problem" tone="white" labelledBy="problem-title">
    <SectionHeading as="h2" id="problem-title" title="The problem" />
  </SectionShell>
);

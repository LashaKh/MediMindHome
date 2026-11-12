import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Two examples (middle lane). Placeholder from the foundation. */
export const ExamplesSection: React.FC = () => (
  <SectionShell id="examples" tone="white" labelledBy="examples-title">
    <SectionHeading as="h2" id="examples-title" title="Examples" />
  </SectionShell>
);

import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Control and safety (trust lane). Placeholder from the foundation. */
export const ControlSection: React.FC = () => (
  <SectionShell id="control" tone="white" labelledBy="control-title">
    <SectionHeading as="h2" id="control-title" title="Control and safety" />
  </SectionShell>
);

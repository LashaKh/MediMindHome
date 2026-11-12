import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** One operating system (lane B). Placeholder from the orchestrator; see 09-DIRECTION-V2.md. */
export const AnatomyOsSection: React.FC = () => (
  <SectionShell id="system" tone="white" labelledBy="system-title">
    <SectionHeading as="h2" id="system-title" title="One operating system" />
  </SectionShell>
);

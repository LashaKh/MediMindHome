import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Team (trust lane). Placeholder from the foundation. */
export const FoundersSection: React.FC = () => (
  <SectionShell id="team" tone="pale" labelledBy="team-title">
    <SectionHeading as="h2" id="team-title" title="Team" />
  </SectionShell>
);

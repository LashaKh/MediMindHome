import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** The objection and the plan (middle lane). Placeholder from the foundation. */
export const SwitchPlanSection: React.FC = () => (
  <SectionShell id="switch" tone="pale" labelledBy="switch-title">
    <SectionHeading as="h2" id="switch-title" title="Switch plan" />
  </SectionShell>
);

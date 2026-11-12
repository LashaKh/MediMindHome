import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** AI today (middle lane). Placeholder from the foundation. */
export const AiTodaySection: React.FC = () => (
  <SectionShell id="ai" tone="white" labelledBy="ai-title">
    <SectionHeading as="h2" id="ai-title" title="AI today" />
  </SectionShell>
);

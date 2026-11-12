import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** The vision (middle lane). Placeholder from the foundation; navy "punch" section. */
export const VisionSection: React.FC = () => (
  <SectionShell id="vision" tone="navy" labelledBy="vision-title">
    <SectionHeading as="h2" id="vision-title" title="Vision" />
  </SectionShell>
);

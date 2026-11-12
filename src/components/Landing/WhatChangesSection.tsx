import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** What changes (middle lane). Placeholder from the foundation. */
export const WhatChangesSection: React.FC = () => (
  <SectionShell id="system" tone="pale" labelledBy="system-title">
    <SectionHeading as="h2" id="system-title" title="What changes" />
  </SectionShell>
);

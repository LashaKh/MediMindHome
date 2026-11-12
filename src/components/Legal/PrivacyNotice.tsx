import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Privacy notice at /privacy (trust lane fills it). Placeholder from the foundation. */
export const PrivacyNotice: React.FC = () => (
  <SectionShell id="privacy" tone="white" narrow labelledBy="privacy-title">
    <SectionHeading as="h1" id="privacy-title" title="Privacy notice" />
  </SectionShell>
);

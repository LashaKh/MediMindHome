import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Hero (top lane). Placeholder from the foundation; the only h1 on the page. Keep id="hero": the sticky phone bar watches it. */
export const HeroSection: React.FC = () => (
  <SectionShell id="hero" tone="white" labelledBy="hero-title">
    <SectionHeading as="h1" id="hero-title" title="Hero" />
  </SectionShell>
);

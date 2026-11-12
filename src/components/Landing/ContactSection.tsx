import React from 'react';
import { SectionShell, SectionHeading } from '../ui';

/** Final call to action with the form (trust lane). Placeholder from the foundation. Keep id="contact": primaryCta and the sticky bar point here. */
export const ContactSection: React.FC = () => (
  <SectionShell id="contact" tone="pale" labelledBy="contact-title">
    <SectionHeading as="h2" id="contact-title" title="Contact" />
  </SectionShell>
);

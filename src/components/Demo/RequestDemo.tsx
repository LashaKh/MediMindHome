import React from 'react';
import { SectionShell } from '../ui';
import { ContactContent } from '../Landing/ContactSection';

/**
 * /request-demo: kept so old links keep working. Same heading, bullets and
 * form as the landing page's #contact, as a page of its own.
 */
export const RequestDemo: React.FC = () => (
  <SectionShell id="request-demo" tone="pale" labelledBy="request-demo-title">
    <ContactContent headingAs="h1" headingId="request-demo-title" location="request-demo" backHref="/" />
  </SectionShell>
);

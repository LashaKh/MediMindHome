import React from 'react';
import { SectionShell } from '../ui';
import { ContactContent } from '../Landing/ContactSection';

/**
 * /request-demo: kept so old links keep working. Same heading, faces,
 * list and form as the landing page's #contact, on the same ink canvas,
 * as a page of its own.
 */
export const RequestDemo: React.FC = () => (
  <SectionShell id="request-demo" tone="navy" labelledBy="request-demo-title" className="md:pt-32 lg:pt-36">
    <ContactContent headingAs="h1" headingId="request-demo-title" location="request-demo" backHref="/" />
  </SectionShell>
);

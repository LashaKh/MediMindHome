import React from 'react';
import { Check } from 'lucide-react';
import { SectionShell, EyebrowBadge } from '../ui';
import { ScopingForm } from '../Demo/ScopingForm';
import { contact } from '../../content/landing.trust';

/**
 * The call-to-action body: heading about the call, support line, the three
 * verb-led bullets and the form. Shared by #contact and /request-demo
 * (which needs the heading as its h1).
 */
interface ContactContentProps {
  headingAs: 'h1' | 'h2';
  headingId: string;
  location: 'final' | 'request-demo';
  backHref: string;
}

export const ContactContent: React.FC<ContactContentProps> = ({ headingAs: Heading, headingId, location, backHref }) => (
  <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
    <div className="lg:col-span-5">
      {/* Same look as SectionHeading; written out so /request-demo can make it the h1 at section size. */}
      <EyebrowBadge label={contact.eyebrow} className="mb-4" />
      <Heading id={headingId} className="mm-h2">
        {contact.title} <span className="mm-accent-text">{contact.accent}</span> {contact.titleEnd}
      </Heading>
      <p className="mm-lead mt-5">{contact.support}</p>
      <div className="mt-10 border-t-4 border-mm-rule pt-5">
        <p className="mm-body font-semibold text-mm-ink">{contact.bulletsTitle}</p>
        <ul className="mt-4 space-y-3">
          {contact.bullets.map((bullet) => (
            <li key={bullet} className="mm-body flex gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-mm-link" strokeWidth={2.25} aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <p className="mm-body mt-5 font-semibold text-mm-ink">{contact.commitment}</p>
      </div>
    </div>
    <div className="lg:col-span-7">
      <ScopingForm location={location} backHref={backHref} />
    </div>
  </div>
);

/** Final call to action with the form. Keep id="contact": primaryCta and the sticky bar point here. */
export const ContactSection: React.FC = () => (
  <SectionShell id="contact" tone="pale" labelledBy="contact-title">
    <ContactContent headingAs="h2" headingId="contact-title" location="final" backHref="#hero" />
  </SectionShell>
);

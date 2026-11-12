import React from 'react';
import { SectionShell } from '../ui';
import { privacy } from '../../content/landing.trust';
import { contactEmail } from '../../content/site';

/** Splits copy into plain text, [blanks for the lawyer] (highlighted) and the contact address (a mailto link). */
function renderText(text: string): React.ReactNode[] {
  return text.split(/(\[[^\]]+\]|team@medimind\.md)/g).map((part, i) => {
    if (part.startsWith('[')) {
      return (
        <mark key={i} className="rounded-sm bg-mm-tint px-1 text-mm-ink">
          {part}
        </mark>
      );
    }
    if (part === contactEmail) {
      return (
        <a key={i} href={`mailto:${contactEmail}`} className="text-mm-link underline underline-offset-2">
          {part}
        </a>
      );
    }
    return part;
  });
}

/** Privacy notice at /privacy: the draft from the copy deck, blanks shown as written, marked as a draft. */
export const PrivacyNotice: React.FC = () => (
  <SectionShell id="privacy" tone="white" narrow labelledBy="privacy-title">
    <h1 id="privacy-title" className="mm-h2">
      {privacy.title}
    </h1>
    <div className="mt-6 rounded-md border-l-4 border-mm-rule bg-mm-tint px-4 py-3">
      <p className="mm-eyebrow text-mm-ink">{privacy.draftLabel}</p>
      <p className="mm-body mt-1">{privacy.draftNote}</p>
    </div>
    <div className="mt-10">
      {privacy.sections.map((section) => (
        <section key={section.title} className="border-t border-mm-line py-6">
          <h2 className="mm-h3">{section.title}</h2>
          <p className="mm-body mt-2">{renderText(section.text)}</p>
        </section>
      ))}
    </div>
  </SectionShell>
);

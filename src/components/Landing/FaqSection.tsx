import React from 'react';
import { SectionShell, SectionHeading } from '../ui';
import { faq } from '../../content/landing.trust';

/** FAQ: four questions, every answer in plain sight (no accordion, nothing behind a click). */
export const FaqSection: React.FC = () => (
  <SectionShell id="faq" tone="white" narrow labelledBy="faq-title">
    <SectionHeading as="h2" id="faq-title" eyebrow={faq.eyebrow} title={faq.title} accent={faq.accent} support={faq.support} />
    <div className="mt-12 lg:mt-14">
      {faq.items.map((item) => (
        <div key={item.question} className="border-t border-mm-line py-7 last:border-b">
          <h3 className="mm-h3">{item.question}</h3>
          <p className="mm-body mt-3 max-w-2xl">{item.answer}</p>
        </div>
      ))}
    </div>
  </SectionShell>
);

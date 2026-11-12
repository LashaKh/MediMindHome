import React from 'react';
import { SectionShell, SectionHeading, BrowserFrame, Reveal } from '../ui';
import { aiToday as copy } from '../../content/landing.story';

/**
 * AI today (#ai): what the AI does now, and that a person always decides.
 * Airy section on white: three items, one status line, the chat screen
 * full width with a caption that says what was asked.
 */
export const AiTodaySection: React.FC = () => (
  <SectionShell id="ai" tone="white" labelledBy="ai-title">
    <SectionHeading
      as="h2"
      id="ai-title"
      eyebrow={copy.eyebrow}
      title={copy.title}
      accent={<span className="md:whitespace-nowrap">{copy.accent}</span>}
      support={copy.support}
      className="[&_h2]:text-balance [&_p]:text-pretty"
    />

    <ul className="mt-14 grid max-w-2xl gap-x-10 gap-y-10 lg:mt-20 lg:max-w-none lg:grid-cols-3">
      {copy.items.map((item, i) => (
        <Reveal as="li" key={item.title} delay={i * 75} className="border-t border-mm-line pt-5">
          <h3 className="mm-body font-semibold text-mm-ink">{item.title}</h3>
          <p className="mm-body mt-2">{item.body}</p>
        </Reveal>
      ))}
    </ul>

    <p className="mm-caption mt-10 max-w-2xl text-pretty">{copy.statusLine}</p>

    <Reveal className="mt-14 lg:mt-20">
      {/* Below md the empty right third of the screen is cropped so the answer stays readable. */}
      <BrowserFrame
        image={copy.image}
        label={copy.imageLabel}
        caption={copy.caption}
        className="max-md:[&_img]:w-[140%] max-md:[&_img]:max-w-none"
      />
    </Reveal>
  </SectionShell>
);

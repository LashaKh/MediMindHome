import React from 'react';
import { SectionShell, SectionHeading, BrowserFrame, Reveal } from '../ui';
import { examples as copy } from '../../content/landing.story';

/**
 * Two examples (#examples): billing and warehouse, each tied to a problem
 * from the problem section. Every example uses the same row: label, title
 * and outcome on the left, the three lines on the right; a real screen, when
 * one exists, runs full width under the row so its text stays legible.
 * An example without an honest screen has none (never a drawn or fake one).
 */
export const ExamplesSection: React.FC = () => (
  <SectionShell id="examples" tone="white" labelledBy="examples-title">
    <SectionHeading
      as="h2"
      id="examples-title"
      eyebrow={copy.eyebrow}
      title={copy.title}
      accent={<span className="md:whitespace-nowrap">{copy.accent}</span>}
      support={copy.support}
      className="[&_h2]:text-balance [&_p]:text-pretty"
    />

    <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
      {copy.items.map((item) => (
        <Reveal as="article" key={item.title} className="border-t-4 border-mm-rule pt-8">
          {/* Phone: label, title, lines, outcome. Desktop: outcome moves under the title. */}
          <div className="grid gap-y-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-4">
            <div className="lg:col-span-5 lg:row-start-1">
              <p className="mm-eyebrow">{item.label}</p>
              <h3 className="mm-h3 mt-3 text-balance">{item.title}</h3>
            </div>
            <ul className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
              {item.lines.map((line) => (
                <li key={line} className="mm-body border-t border-mm-line py-3 last:border-b">
                  {line}
                </li>
              ))}
            </ul>
            <p className="mm-body max-w-md font-semibold text-mm-ink lg:col-span-5 lg:col-start-1 lg:row-start-2">
              {item.outcome}
            </p>
          </div>
          {item.image && (
            <BrowserFrame
              image={item.image}
              label={item.imageLabel}
              caption={item.caption}
              className="mt-10 lg:mt-12"
            />
          )}
        </Reveal>
      ))}
    </div>

    <div className="mt-16 max-w-2xl space-y-3 lg:mt-20">
      <p className="mm-body text-pretty">{copy.bridge}</p>
      <p className="mm-caption">{copy.statusFootnote}</p>
    </div>
  </SectionShell>
);

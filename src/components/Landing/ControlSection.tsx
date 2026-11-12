import React from 'react';
import { SectionShell, SectionHeading, Reveal } from '../ui';
import { control } from '../../content/landing.trust';

/** Control and safety, for the people who approve: six short answers. */
export const ControlSection: React.FC = () => (
  <SectionShell id="control" tone="white" labelledBy="control-title">
    <SectionHeading
      as="h2"
      id="control-title"
      eyebrow={control.eyebrow}
      title={control.title}
      accent={control.accent}
      support={control.support}
    />
    <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
      {control.items.map((item, i) => (
        <Reveal as="li" key={item.title} delay={(i % 3) * 60} className="border-t border-mm-line pt-5">
          <h3 className="mm-h3">{item.title}</h3>
          <p className="mm-body mt-2">{item.text}</p>
        </Reveal>
      ))}
    </ul>
  </SectionShell>
);

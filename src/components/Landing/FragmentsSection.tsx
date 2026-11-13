import React, { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'framer-motion';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { fragments } from '../../content/landing.v2.b';
import { FragmentsField } from './FragmentsField';

/**
 * Forty systems (#problem), lane B. One sentence and one picture: the
 * forty-system hospital drawn as fragments around one patient, whose gaps
 * close into one system as the picture scrolls up to the middle of the screen.
 */
export const FragmentsSection: React.FC = () => {
  const reduce = !!useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: fieldRef, offset: ['start 0.85', 'center 0.4'] });
  const progress = useTransform(scrollYProgress, [0.15, 1], [0, 1], { clamp: true });

  return (
    <SectionShell id="problem" tone="white" labelledBy="problem-title" className="lb-scope">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <h2 id="problem-title" className="mm-h2 lg:col-span-5">
          <span className="block">{fragments.title}</span>
          <span className="mm-accent-text block">{fragments.titleSecond}</span>
        </h2>
        <div ref={fieldRef} className="lg:col-span-7">
          <FragmentsField
            progress={progress}
            still={reduce}
            className="h-[500px] sm:h-[540px]"
          />
        </div>
      </div>
    </SectionShell>
  );
};

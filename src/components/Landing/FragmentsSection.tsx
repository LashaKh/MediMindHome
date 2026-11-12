import React, { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'framer-motion';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { fragments } from '../../content/landing.v2.b';
import { FragmentsField } from './FragmentsField';

/**
 * Forty systems (#problem), lane B. Why the problem has not been fixed: the
 * forty-system hospital, drawn as fragments whose gaps close as you scroll,
 * then the insight that intelligence cannot be added to fragments.
 */
export const FragmentsSection: React.FC = () => {
  const reduce = !!useReducedMotion();
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: runway, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0.05, 0.9], [0, 1], { clamp: true });

  return (
    <SectionShell id="problem" tone="white" labelledBy="problem-title" className="lb-scope">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
        <h2 id="problem-title" className="mm-h2">
          <span className="block">{fragments.title}</span>
          <span className="mm-accent-text block">{fragments.titleSecond}</span>
        </h2>
        <p className="mm-lead max-w-[46ch]">{fragments.lead}</p>
      </div>

      {/* The picture. With motion: pinned while the gaps close. */}
      <div ref={runway} className={reduce ? 'mt-12' : 'mt-6 h-[240vh]'}>
        <div className={reduce ? '' : 'sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center md:top-20 md:h-[calc(100svh-5rem)]'}>
          <FragmentsField
            progress={progress}
            still={reduce}
            className={reduce ? 'h-[620px] sm:h-[680px] lg:h-[560px]' : 'h-[min(82%,720px)]'}
          />
          <p className="mm-caption mt-4 flex items-center gap-2">
            <span aria-hidden="true" className="block h-[1.5px] w-5" style={{ backgroundColor: 'var(--lb-harm)' }} />
            {fragments.gapLegend}
          </p>
        </div>
      </div>

      {/* The insight. */}
      <div className="mt-16 border-t border-mm-line pt-14 md:mt-20 md:pt-20">
        <p className="lb-serif lb-statement max-w-[20ch] text-mm-ink">{fragments.insight}</p>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {fragments.failures.map((f) => (
            <div key={f.name} className="border-t-2 pt-5" style={{ borderColor: 'var(--lb-harm)' }}>
              <h3 className="mm-h3">{f.name}</h3>
              <p className="mm-body mt-3 max-w-[48ch]">{f.text}</p>
            </div>
          ))}
        </div>
        <p className="mm-lead mt-14 max-w-[40ch] text-mm-ink">{fragments.resolve}</p>
      </div>
    </SectionShell>
  );
};

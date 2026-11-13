import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../ui';
import { proof as copy } from '../../content/landing.v2.c';

/**
 * Proof (#proof, lane C): the big moment. Four numbers in one wide row, each
 * very large with a few words under it, then one quiet row of recognitions.
 * The rule above each number draws itself once; the numbers are never hidden.
 */

export const ProofSection: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="proof" tone="white" labelledBy="proof-title">
      <h2 id="proof-title" className="mm-h2 m-0 text-balance">
        {copy.title.map((line, i) => (
          <span key={line} className={i === 0 ? 'block' : 'block text-mm-voice2'}>
            {line}{' '}
          </span>
        ))}
      </h2>

      <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-x-6 gap-y-12 p-0 md:mt-16 lg:mt-20 lg:grid-cols-4 lg:gap-x-10">
        {copy.numbers.map((n, i) => (
          <li key={n.line} className="relative min-w-0 pt-6 md:pt-8">
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 h-px origin-left bg-mm-ink opacity-30"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, delay: reduce ? 0 : i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
            />
            <p className="m-0 flex items-baseline whitespace-nowrap">
              <span className="font-display text-[clamp(3.75rem,1.4rem+7.4vw,10.5rem)] font-[350] leading-[0.86] tracking-[-0.045em] text-mm-ink [font-variant-numeric:lining-nums]">
                {n.value}
              </span>
              {n.unit && (
                <span className="ml-2 font-display text-[clamp(1.375rem,0.9rem+1.6vw,2.75rem)] font-[350] tracking-[-0.02em] text-mm-ink md:ml-3">
                  {n.unit}
                </span>
              )}
            </p>
            <p className="mm-lead m-0 mt-4 max-w-[18rem] text-pretty text-mm-body md:mt-5">{n.line}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-4 border-t border-mm-line pt-6 md:mt-20 md:flex-row md:items-center md:gap-10">
        <h3 className="m-0 font-mono text-[13px] font-medium text-mm-muted">{copy.recognitionTitle}</h3>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-8 gap-y-2 p-0">
          {copy.recognitions.map((r) => (
            <li key={r.name} className="text-[1.0625rem] font-medium text-mm-ink md:text-lg">
              {r.href ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${r.linkLabel ?? r.name} (opens in a new tab)`}
                  className="inline-flex min-h-[44px] items-center underline decoration-mm-line decoration-1 underline-offset-[6px] transition-colors hover:text-mm-link hover:decoration-current"
                >
                  {r.name}
                </a>
              ) : (
                <span className="inline-flex min-h-[44px] items-center">{r.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
};

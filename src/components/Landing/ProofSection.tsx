import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../ui';
import { proof as copy } from '../../content/landing.v2.c';

/**
 * Proof (#proof, lane C): a ledger of four numbers, each set very large with
 * one line beside it, then the recognitions. The rule above each row draws
 * itself once as the row arrives; the numbers are never hidden.
 */

export const ProofSection: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="proof" tone="pale" labelledBy="proof-title">
      <h2 id="proof-title" className="mm-h2 m-0 max-w-3xl">
        {copy.title.map((line) => (
          <span key={line} className="block">
            {line}{' '}
          </span>
        ))}
      </h2>

      <ol className="m-0 mt-14 list-none p-0 md:mt-20">
        {copy.numbers.map((n) => (
          <li key={n.line} className="relative grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-10 md:py-10">
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 h-px origin-left bg-mm-ink opacity-25"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            />
            <p className="m-0 md:col-span-6 lg:col-span-5">
              <span className="font-display text-[clamp(4.5rem,2.2rem+8vw,10rem)] font-[350] leading-[0.86] tracking-[-0.045em] text-mm-ink [font-variant-numeric:lining-nums_tabular-nums]">
                {n.value}
              </span>
              {n.unit && (
                <span className="ml-3 font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-[350] tracking-[-0.02em] text-mm-ink">
                  {n.unit}
                </span>
              )}
              <span className="sr-only"> {n.line}</span>
            </p>
            <p className="mm-lead m-0 max-w-md text-mm-ink md:col-span-6 lg:col-span-6 lg:col-start-7" aria-hidden="true">
              {n.line}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-16 border-t border-mm-line pt-10 md:mt-24">
        <h3 className="mm-eyebrow m-0">{copy.recognitionTitle}</h3>
        <ul className="m-0 mt-8 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-10">
          {copy.recognitions.map((r) => (
            <li key={r.name} className="grid content-start gap-2">
              <p className="m-0 font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-mm-ink md:text-[2rem]">
                {r.name}
              </p>
              <p className="mm-body m-0 max-w-xs">{r.line}</p>
              {r.href && (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mm-body mt-1 inline-flex min-h-[44px] w-fit items-center font-medium text-mm-link underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {r.linkLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
};

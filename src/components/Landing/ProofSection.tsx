import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../ui';
import { proof as copy } from '../../content/landing.v2.c';
import type { ProofNumber } from '../../content/landing.v2.c';
import { cn } from '../../utils/cn';

/**
 * Proof (#proof, lane C): the big moment. The headline with the backers set
 * quietly beside it, then the four numbers as one ledger: hairline columns,
 * the figures large, a few words under each. Two figures carry a literal
 * count drawn in fine marks: one dot per hospital, one tick per day.
 * The rule above each column draws itself once; the numbers are never hidden.
 */

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** A value such as "1M+": the plus set smaller and raised, the rest as the figure. */
const Figure: React.FC<{ n: ProofNumber }> = ({ n }) => {
  const plus = n.value.endsWith('+');
  const main = plus ? n.value.slice(0, -1) : n.value;
  return (
    <p className="m-0 flex items-baseline whitespace-nowrap text-mm-ink">
      <span className="mm-stat">
        {main}
        {plus && <span className="ml-[0.03em] inline-block align-[0.62em] text-[0.5em] text-mm-voice2">+</span>}
      </span>
      {n.unit && (
        <span className="ml-2.5 font-display text-[clamp(1.25rem,0.9rem+1vw,1.75rem)] font-[350] tracking-[-0.02em] text-mm-ink">
          {n.unit}
        </span>
      )}
    </p>
  );
};

/** Fine marks under a figure: `count` dots or ticks, the last one lit. */
const Marks: React.FC<{ kind: 'dots' | 'ticks'; count: number; reduce: boolean }> = ({ kind, count, reduce }) => (
  <motion.svg
    aria-hidden="true"
    viewBox={`0 0 ${kind === 'dots' ? count * 11 : count * 5} 12`}
    className={cn('mt-6 block h-3', kind === 'dots' ? 'w-[17rem]' : 'w-[18.75rem]', 'max-w-full')}
    initial={reduce ? false : { opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
  >
    {Array.from({ length: count }, (_, i) =>
      kind === 'dots' ? (
        <circle key={i} cx={i * 11 + 5.5} cy={6} r={3} fill="var(--mm-system)" opacity={i === count - 1 ? 1 : 0.38} />
      ) : (
        <line
          key={i}
          x1={i * 5 + 1}
          x2={i * 5 + 1}
          y1={i % 10 === 9 || i === count - 1 ? 0 : 5}
          y2={12}
          stroke={i === count - 1 ? 'var(--mm-system)' : 'var(--mm-muted)'}
          strokeOpacity={i === count - 1 ? 1 : 0.55}
          strokeWidth={1.25}
        />
      )
    )}
  </motion.svg>
);

export const ProofSection: React.FC = () => {
  const reduce = useReducedMotion() ?? false;

  return (
    <SectionShell id="proof" tone="white" labelledBy="proof-title">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <h2 id="proof-title" className="mm-h2 m-0 text-balance lg:col-span-8">
          {copy.title.map((line, i) => (
            <span key={line} className={i === 0 ? 'block' : 'block mm-accent-text'}>
              {line}{' '}
            </span>
          ))}
        </h2>
      </div>

      <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-y-12 p-0 md:mt-16 lg:mt-20 lg:grid-cols-4">
        {copy.numbers.map((n, i) => (
          <li
            key={n.line}
            className={cn(
              'relative min-w-0 pr-4 pt-7 md:pt-9 lg:pr-8',
              i % 2 === 1 && 'border-l border-mm-line pl-5 md:pl-8',
              i > 0 && 'lg:border-l lg:border-mm-line lg:pl-8',
              i === 2 && 'max-lg:pl-0'
            )}
          >
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 h-px origin-left bg-mm-ink"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, delay: reduce ? 0 : i * 0.12, ease: EASE }}
            />
            <Figure n={n} />
            <p className="mm-body m-0 mt-4 max-w-[16rem] text-pretty text-mm-body md:mt-5">{n.line}</p>
            {n.marks && <Marks kind={n.marks.kind} count={n.marks.count} reduce={reduce} />}
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-2 border-t border-mm-line pt-5 md:mt-20 md:flex-row md:items-center md:gap-10">
        <h3 className="m-0 font-mono text-[12px] font-medium text-mm-muted">{copy.recognitionTitle}</h3>
        <ul className="m-0 flex list-none flex-wrap items-center gap-y-1 p-0">
          {copy.recognitions.map((r, i) => (
            <li
              key={r.name}
              className={cn('text-[1rem] font-medium text-mm-ink md:text-[1.0625rem]', i > 0 && 'ml-5 border-l border-mm-line pl-5')}
            >
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

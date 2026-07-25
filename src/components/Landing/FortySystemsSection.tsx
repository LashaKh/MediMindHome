import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ServerCrash, KeyRound, Building, Cable } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';

const stats = [
  {
    icon: KeyRound,
    before: '6+ logins',
    after: '1',
    caption: 'Your coordinators stop re-typing the same patient into five different screens.',
  },
  {
    icon: Building,
    before: '40+ vendors',
    after: '1',
    caption: 'One contract, one bill — instead of a monthly fee to every system that half-talks to the next.',
  },
  {
    icon: Cable,
    before: 'Dozens of integrations',
    after: '0',
    caption: 'Nothing to glue together, nothing to break. It’s all one system.',
  },
];

/**
 * Forty fragmented systems collapse to one. The right-hand grid of 40 cells
 * dims to a single lit cell on view — the visual argument of the copy.
 */
const SURVIVOR = 21;
const SystemsGrid: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-8 gap-2 sm:gap-2.5">
      {Array.from({ length: 40 }).map((_, i) => {
        const alive = i === SURVIVOR;
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0.5 }}
            whileInView={{ opacity: alive ? 1 : 0.16 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: alive ? 1.05 : (i % 8) * 0.05 + Math.floor(i / 8) * 0.04 }}
            className={
              alive
                ? 'aspect-square rounded-[3px] border border-accent bg-accent/40 shadow-[0_0_16px_2px_rgba(49,130,206,0.75)]'
                : 'aspect-square rounded-[3px] border border-surface-border bg-surface-card'
            }
          />
        );
      })}
    </div>
  );
};

export const FortySystemsSection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <SectionShell id="problem" variant="dark" className="border-t border-surface-border">
      <GradientHeading
        align="left"
        eyebrow={{ icon: ServerCrash, label: 'The problem', tone: 'accent' }}
        title="Forty systems run hospitals today."
        highlight="One runs them tomorrow."
        subhead="Every department runs its own program — separate logins, separate vendors, separate bills. None of them see the whole patient. The gaps between those systems are where time, money, and lives get lost."
      />

      <div className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
        {/* the 40 → 1 visual */}
        <div className="lg:col-span-5">
          <SystemsGrid />
        </div>

        {/* before → after ledger */}
        <div className="border-y border-surface-border lg:col-span-6 lg:col-start-7">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.before}
                initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(5px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 border-b border-surface-border py-5 last:border-b-0"
              >
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-surface-border bg-surface-card text-accent">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-text-subtle line-through decoration-1">{s.before}</span>
                    <span className="text-text-subtle">→</span>
                    <span className="font-serif text-3xl font-semibold leading-none text-secondary dark:text-light-accent sm:text-4xl">
                      {s.after}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.caption}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
};

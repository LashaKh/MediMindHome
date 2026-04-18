import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Star } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { milestones } from '../../data/milestones';
import { cn } from '../../utils/cn';

export const MilestonesSection: React.FC = () => {
  return (
    <SectionShell id="milestones" variant="dark" ambient className="border-t border-white/5">
      <GradientHeading
        eyebrow={{ icon: CalendarClock, label: 'Progress', tone: 'accent' }}
        title="Twelve months from idea"
        highlight="to 25 hospitals."
        subhead="MediMind's trajectory is dated, public, and verifiable."
      />

      <div className="relative mt-12 sm:mt-16 mx-auto max-w-4xl">
        {/* Vertical spine */}
        <div className="absolute left-[1.4rem] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent sm:-translate-x-px" />

        <ol className="space-y-6 sm:space-y-8">
          {milestones.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.li
                key={`${m.date}-${m.label}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
                className="relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 sm:items-center"
              >
                {/* Marker */}
                <span
                  className={cn(
                    'absolute left-3 sm:left-1/2 top-1.5 sm:top-1/2 -translate-y-1/2 sm:-translate-x-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface-page',
                    m.highlight ? 'bg-accent text-navy' : 'bg-slate-700 text-slate-300'
                  )}
                >
                  {m.highlight ? <Star className="h-3 w-3" /> : <span className="block h-2 w-2 rounded-full bg-slate-400" />}
                </span>

                <div className={cn('sm:col-start-1', !isLeft && 'sm:col-start-2')}>
                  <div
                    className={cn(
                      'rounded-2xl border bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm',
                      m.highlight ? 'border-accent/30 bg-accent/5' : 'border-white/10'
                    )}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">{m.date}</div>
                    <h3 className="mt-1.5 text-base sm:text-lg font-semibold text-white leading-snug">{m.label}</h3>
                    <p className="mt-2 text-sm text-slate-300/85 leading-relaxed">{m.detail}</p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </SectionShell>
  );
};

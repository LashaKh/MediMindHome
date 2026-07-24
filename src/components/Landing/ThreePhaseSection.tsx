import React from 'react';
import { motion } from 'framer-motion';
import { Route, Check } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { phases } from '../../data/phases';
import { cn } from '../../utils/cn';

/**
 * The Path — the 3-phase integration roadmap, presented as a single journey
 * with equal weight per phase (no availability tiers). A glowing beam threads
 * numbered nodes; each phase is a gradient-hairline glass card with a faint
 * icon watermark, and foot-stats are pinned to a shared baseline via mt-auto
 * so all three cards read as one aligned system.
 */
export const ThreePhaseSection: React.FC = () => {
  return (
    <SectionShell id="path" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: Route, label: 'The path', tone: 'navy' }}
        title="Start solid."
        highlight="End ahead of the world."
        subhead="One integration, three stages. Phase 1 replaces the legacy stack today — Phases 2 and 3 build on the same foundation as you grow."
      />

      <div className="relative mt-16 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3 lg:gap-7">
        {/* desktop beam threaded through the numbered nodes */}
        <div className="pointer-events-none absolute inset-x-[16.66%] top-7 hidden h-px overflow-hidden lg:block">
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-accent/20 via-accent/70 to-accent/20 bg-[length:200%_100%]" />
        </div>

        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const isLast = i === phases.length - 1;
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex gap-5 lg:flex-col lg:gap-0"
            >
              {/* node column (mobile: left rail · desktop: centered above card) */}
              <div className="flex flex-col items-center lg:mb-8 lg:flex-row lg:justify-center">
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold tabular-nums text-white shadow-[0_0_28px_-6px_rgba(49,130,206,0.75)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                  <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />
                  <span className="relative">{phase.number}</span>
                </div>
                {!isLast && (
                  <div className="mt-3 w-px flex-1 bg-gradient-to-b from-accent/50 to-transparent lg:hidden" />
                )}
              </div>

              {/* gradient-hairline glass card */}
              <div className="flex flex-1 rounded-3xl bg-gradient-to-br from-accent/50 via-secondary/20 to-accent/25 p-px shadow-xl shadow-black/5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:from-accent/70 group-hover:shadow-2xl group-hover:shadow-accent/20">
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-[23px] bg-surface-card/80 p-7 backdrop-blur-xl">
                  {/* top edge highlight */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  {/* giant faint icon watermark */}
                  <Icon
                    strokeWidth={1}
                    className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-primary/[0.05] dark:text-white/[0.05]"
                  />

                  {/* header: mono phase label + theme verb */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.22em] text-text-subtle">
                      PHASE 0{phase.number}
                    </span>
                    <span className="h-3 w-px bg-surface-border" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] brand-gradient-text">
                      {phase.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold leading-tight text-text">{phase.name}</h3>
                  <p className="mt-1.5 text-sm font-medium text-secondary dark:text-light-accent">{phase.scope}</p>

                  <div className="my-5 h-px bg-gradient-to-r from-surface-border to-transparent" />

                  <ul className="space-y-3">
                    {phase.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm leading-snug text-text-muted">
                        <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* foot stat — pinned to a shared baseline across all cards */}
                  <div className="mt-auto pt-7">
                    <div className="mb-5 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent" />
                    <div className="text-4xl font-extrabold tabular-nums brand-gradient-text">{phase.proof.value}</div>
                    <div className="mt-1.5 text-xs leading-relaxed text-text-subtle">{phase.proof.label}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* closer — the load-bearing "switch, not a rebuild" line */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-14 flex items-center gap-4 sm:gap-6"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-surface-border" />
        <p className="max-w-2xl text-center text-sm font-medium leading-relaxed text-text-muted sm:text-base">
          Phase 1 lays the rails — the global FHIR standard under everything. So when you want more, it&apos;s a{' '}
          <span className="font-semibold text-text">switch, not a rebuild</span>.
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-surface-border" />
      </motion.div>
    </SectionShell>
  );
};

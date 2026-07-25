import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Route, Check } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { phases } from '../../data/phases';

/**
 * The Path — the 3-phase roadmap as one journey. A light beam threads three
 * squared numbered nodes; each phase is a flat editorial panel with a mono
 * phase label, serif name, and a large serif foot-stat pinned to a shared
 * baseline (mt-auto) so the three read as one aligned system.
 */
export const ThreePhaseSection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <SectionShell id="path" variant="dark" className="border-t border-surface-border">
      <GradientHeading
        align="left"
        eyebrow={{ icon: Route, label: 'The path', tone: 'navy' }}
        title="Start solid."
        highlight="End ahead of the world."
        subhead="One integration, three stages. Phase 1 replaces the legacy stack today — Phases 2 and 3 build on the same foundation as you grow."
      />

      <div className="relative mt-16 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3 lg:gap-7">
        {/* desktop beam threaded through the numbered nodes */}
        <div className="pointer-events-none absolute inset-x-[16.66%] top-6 hidden h-px overflow-hidden lg:block">
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-accent/10 via-accent/70 to-accent/10 bg-[length:200%_100%]" />
        </div>

        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const isLast = i === phases.length - 1;
          return (
            <motion.div
              key={phase.id}
              initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex gap-5 lg:flex-col lg:gap-0"
            >
              {/* node column (mobile: left rail · desktop: centered above panel) */}
              <div className="flex flex-col items-center lg:mb-8 lg:flex-row lg:justify-center">
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-accent/50 bg-surface-page font-mono text-lg font-semibold tabular-nums text-accent shadow-[0_0_20px_-6px_rgba(49,130,206,0.8)]">
                  {phase.number}
                </div>
                {!isLast && (
                  <div className="mt-3 w-px flex-1 bg-gradient-to-b from-accent/40 to-transparent lg:hidden" />
                )}
              </div>

              {/* flat editorial panel */}
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card p-7">
                {/* giant faint icon watermark */}
                <Icon
                  strokeWidth={1}
                  className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 text-primary/[0.04] dark:text-white/[0.04]"
                />

                {/* header: mono phase label + theme verb */}
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.22em] text-text-subtle">
                    PHASE 0{phase.number}
                  </span>
                  <span className="h-3 w-px bg-surface-border" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary dark:text-light-accent">
                    {phase.tag}
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-text">{phase.name}</h3>
                <p className="mt-1.5 text-sm font-medium text-secondary dark:text-light-accent">{phase.scope}</p>

                <div className="my-5 h-px bg-surface-border" />

                <ul className="space-y-3">
                  {phase.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm leading-snug text-text-muted">
                      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* foot stat — pinned to a shared baseline across all panels */}
                <div className="mt-auto pt-7">
                  <div className="mb-5 h-px bg-surface-border" />
                  <div className="font-serif text-4xl font-semibold leading-none tabular-nums text-secondary dark:text-light-accent">
                    {phase.proof.value}
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-text-subtle">{phase.proof.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* closer — the load-bearing "switch, not a rebuild" line */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
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

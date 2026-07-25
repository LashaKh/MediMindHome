import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, ArrowUpRight } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { pillars } from '../../data/pillars';

/**
 * The foundation as a "system index" — an OS boot-manifest ledger. Mono index,
 * serif capability name, sans tagline, hairline row separators. Each row boots
 * in and illuminates on hover. Breadth reads at a glance; depth lives in the demo.
 */
export const PlatformPillarsSection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <SectionShell id="platform" variant="gradient">
      <GradientHeading
        align="left"
        eyebrow={{ icon: Layers, label: 'Phase 1 · Live today', tone: 'accent' }}
        title="The foundation:"
        highlight="everything a hospital needs, built in."
        subhead="Six capability areas. One system. Nothing to integrate, no vendors to glue together."
      />

      <div className="mt-12 border-t border-surface-border sm:mt-14">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.a
              key={pillar.id}
              href="/request-demo"
              initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-surface-border py-5 transition-colors duration-300 hover:bg-accent/[0.04] sm:grid-cols-[3rem_1fr_auto] sm:gap-6"
            >
              {/* left-edge illuminate bar */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent/70 transition-transform duration-300 group-hover:scale-y-100"
              />
              <span className="font-mono text-sm font-semibold tabular-nums text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                <h3 className="flex items-center gap-2.5 font-serif text-lg font-semibold leading-snug text-text sm:text-xl">
                  <Icon className="h-4 w-4 flex-shrink-0 text-text-subtle transition-colors duration-300 group-hover:text-accent sm:hidden" strokeWidth={1.75} />
                  {pillar.name}
                </h3>
                <p className="text-sm leading-snug text-text-muted">{pillar.tagline}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 flex-shrink-0 translate-x-0 text-text-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
            </motion.a>
          );
        })}
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-sm text-text-subtle sm:mt-12"
      >
        Want to see any of them up close?{' '}
        <a href="/request-demo" className="font-medium text-accent hover:text-secondary dark:hover:text-light-accent">
          Book a 30-min demo →
        </a>
      </motion.p>
    </SectionShell>
  );
};

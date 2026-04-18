import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { pillars } from '../../data/pillars';
import { cn } from '../../utils/cn';

/**
 * Lean pillar tile — icon, name, one-line tagline. No expand, no feature list.
 * Breadth is the point; depth lives in the demo.
 */
export const PlatformPillarsSection: React.FC = () => {
  return (
    <SectionShell id="platform" variant="gradient" ambient>
      <GradientHeading
        eyebrow={{ icon: Layers, label: 'Platform at a glance', tone: 'accent' }}
        title="Everything a hospital needs."
        highlight="Built into one platform."
        subhead="Nine modules. One FHIR data model. One AI substrate."
      />

      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="group relative rounded-2xl border border-surface-border bg-surface-card/60 p-5 sm:p-6 backdrop-blur-sm transition-colors hover:border-accent/30 hover:bg-surface-hover"
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'inline-flex flex-shrink-0 rounded-xl bg-gradient-to-br p-2.5 ring-1',
                    pillar.accent
                  )}
                >
                  <Icon className="h-5 w-5 text-primary dark:text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-text leading-tight">{pillar.name}</h3>
                  <p className="mt-1.5 text-sm text-text-muted leading-snug">{pillar.tagline}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 sm:mt-12 text-center text-sm text-text-subtle"
      >
        Want to see any of them up close?{' '}
        <a href="/request-demo" className="text-accent hover:text-secondary dark:hover:text-light-accent font-medium">
          Book a 30-min demo →
        </a>
      </motion.p>
    </SectionShell>
  );
};

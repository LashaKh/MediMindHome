import React from 'react';
import { motion } from 'framer-motion';
import { Layers3 } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { anatomyLayers } from '../../data/anatomy';
import { cn } from '../../utils/cn';

export const AnatomySection: React.FC = () => {
  return (
    <SectionShell id="anatomy" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: Layers3, label: 'The anatomy', tone: 'navy' }}
        title="A hospital with a body"
        highlight="made of software."
        subhead="Five layers. One codebase. Built ground-up on FHIR R4."
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {anatomyLayers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="group relative rounded-2xl border border-surface-border bg-surface-card/60 p-5 sm:p-6 backdrop-blur-sm transition-colors hover:border-accent/30 hover:bg-surface-hover flex flex-col"
            >
              <div className="flex items-center gap-3">
                <div className={cn('inline-flex flex-shrink-0 rounded-xl bg-gradient-to-br p-2.5 ring-1', layer.accent)}>
                  <Icon className="h-5 w-5 text-primary dark:text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-subtle">{layer.layer}</span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold text-text leading-tight">{layer.name}</h3>
                <p className="mt-1 text-sm font-medium text-secondary dark:text-light-accent">{layer.verb}</p>
              </div>
              <p className="mt-3 text-sm text-text-muted leading-snug font-medium">{layer.tagline}</p>
              <p className="mt-2 text-xs text-text-subtle leading-relaxed">{layer.body}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 sm:mt-12 text-center text-sm sm:text-base italic text-text-muted max-w-3xl mx-auto"
      >
        Heart holds, Brain thinks, Muscle acts, Skin meets the world, Nerve feels every change.
      </motion.p>
    </SectionShell>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { FeaturePillarCard } from '../ui/feature-pillar-card';
import { safetyPrimitives } from '../../data/safetyPrimitives';

export const SafetySection: React.FC = () => {
  return (
    <SectionShell id="safety" variant="gradient" ambient className="border-t border-surface-border">
      <GradientHeading
        align="left"
        eyebrow={{ icon: ShieldCheck, label: 'Doctor-Grade Safety', tone: 'success' }}
        title="Built like the operating room."
        highlight="Not the marketing department."
        subhead="Six hard safety rules built into the system’s core. Each one fails safe: when in doubt, the system stops and a human decides."
      />

      {/* pull-line — the load-bearing safety credo, flanked by glowing ticks */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-12 flex items-center justify-center gap-4 sm:mt-14 sm:gap-6"
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent sm:w-16" />
        <p className="font-serif text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          AI works. <span className="text-secondary dark:text-light-accent">People decide.</span>
        </p>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent sm:w-16" />
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {safetyPrimitives.map((s, i) => (
          <FeaturePillarCard
            key={s.id}
            icon={s.icon}
            title={s.title}
            description={s.body}
            badge={`S-${String(i + 1).padStart(2, '0')}`}
            index={i}
          />
        ))}
      </div>
    </SectionShell>
  );
};

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
        eyebrow={{ icon: ShieldCheck, label: 'Doctor-Grade Safety', tone: 'success' }}
        title="Built like the operating room."
        highlight="Not the marketing department."
        subhead="Specific, technical safety primitives — not “we care about safety” theater."
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-8 text-center text-xl sm:text-2xl font-semibold tracking-tight text-text max-w-2xl mx-auto"
      >
        <span className="brand-gradient-text">AI works. People decide.</span>
      </motion.p>

      <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {safetyPrimitives.map((s, i) => (
          <FeaturePillarCard
            key={s.id}
            icon={s.icon}
            title={s.title}
            description={s.body}
            index={i}
          />
        ))}
      </div>
    </SectionShell>
  );
};

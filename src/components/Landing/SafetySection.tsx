import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { FeaturePillarCard } from '../ui/feature-pillar-card';
import { safetyPrimitives } from '../../data/safetyPrimitives';

export const SafetySection: React.FC = () => {
  return (
    <SectionShell id="safety" variant="gradient" ambient className="border-t border-white/5">
      <GradientHeading
        eyebrow={{ icon: ShieldCheck, label: 'Doctor-Grade Safety', tone: 'success' }}
        title="Built like the operating room."
        highlight="Not the marketing department."
        subhead="Specific, technical safety primitives — not “we care about safety” theater."
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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

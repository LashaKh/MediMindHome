import React from 'react';
import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';

const horizons = [
  {
    label: 'Georgia (today)',
    body: 'Replacing fragmented hospital software with one operating system on FHIR R4. Positioned to take the home market within a year.',
    accent: 'from-accent/20 to-secondary/10 ring-accent/30',
  },
  {
    label: 'Post-Soviet region (2026–2027)',
    body: 'Natural expansion: similar regulatory profiles, similar care models, all underserved. Georgian execution becomes the template.',
    accent: 'from-secondary/20 to-light-accent/10 ring-secondary/30',
  },
  {
    label: 'Global (when the moment arrives)',
    body: 'Other markets are waiting on regulation to catch up to AI. We use that window to harden the operating system locally, build international relationships, and earn the right to scale globally — first-mover by patience, not by hype.',
    accent: 'from-light-accent/20 to-accent/10 ring-light-accent/30',
  },
];

export const AmbitionSection: React.FC = () => {
  return (
    <SectionShell id="ambition" variant="gradient" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: Globe2, label: "Where We're Going", tone: 'navy' }}
        title="Georgia first. Region next."
        highlight="Then everywhere."
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {horizons.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`relative rounded-2xl border border-surface-border bg-gradient-to-br ${h.accent} p-6 sm:p-7 backdrop-blur-sm ring-1`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Horizon {i + 1}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-text leading-snug">{h.label}</h3>
            <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">{h.body}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
};

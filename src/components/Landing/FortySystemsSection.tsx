import React from 'react';
import { motion } from 'framer-motion';
import { ServerCrash, KeyRound, Building, Cable } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';

const stats = [
  {
    icon: KeyRound,
    before: '6+ logins',
    after: '1',
    caption: 'The coordinator stops swivel-chairing between the EMR, portal, regulator, SMS, and email.',
  },
  {
    icon: Building,
    before: '40+ vendors',
    after: '1',
    caption: 'The CEO stops paying a monthly fee to every system that half-talks to the next one.',
  },
  {
    icon: Cable,
    before: 'Dozens of integrations',
    after: '0',
    caption: 'The CTO stops firefighting broken interfaces between systems that were never designed to meet.',
  },
];

export const FortySystemsSection: React.FC = () => {
  return (
    <SectionShell id="problem" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: ServerCrash, label: 'The problem', tone: 'accent' }}
        title="Forty systems run hospitals today."
        highlight="One runs them tomorrow."
        subhead="A modern hospital runs on dozens of disconnected systems — each with its own login, its own data model, its own update cycle. The cost isn't licenses. It's the integrations between them that break every sprint. MediMind replaces the stack."
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.before}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative rounded-2xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm"
            >
              <div className="inline-flex rounded-xl bg-gradient-to-br from-accent/30 to-secondary/15 p-2.5 ring-1 ring-accent/30">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-sm font-medium text-text-subtle line-through decoration-1">{s.before}</span>
                <span className="text-text-subtle">→</span>
                <span className="brand-gradient-text text-3xl sm:text-4xl font-extrabold tracking-tight">{s.after}</span>
              </div>
              <p className="mt-4 text-sm text-text-muted leading-relaxed">{s.caption}</p>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileCheck2, Building, ArrowRight, Repeat } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';

const flow = [
  { icon: Building, label: 'EMR Encounter', sub: 'Inpatient · Day Hospital · ED · Planned Ambulatory' },
  { icon: Repeat, label: 'Mapping', sub: 'Encounter → government XML schema · Classifier lookup · Validation' },
  { icon: Landmark, label: 'Government Submission', sub: 'Dual API submission · Status tracking · Retry queue' },
];

export const ComplianceMoatSection: React.FC = () => {
  return (
    <SectionShell id="compliance" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: FileCheck2, label: 'The Moat', tone: 'light' }}
        title="The integration"
        highlight="nobody else has done."
        subhead="Submitting to a country's health ministry and revenue service isn't a feature — it's a 6–12 month engineering investment in regulatory expertise. We did it. It's why hospitals sign with us."
      />

      {/* Flow diagram */}
      <div className="mt-12 sm:mt-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 sm:gap-2">
          {flow.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.label}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center rounded-2xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm"
                >
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-accent/30 to-secondary/20 p-3 ring-1 ring-accent/30">
                    <Icon className="h-6 w-6 text-secondary dark:text-light-accent" />
                  </div>
                  <h3 className="mt-3 text-base sm:text-lg font-semibold text-text">{step.label}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-snug max-w-xs">{step.sub}</p>
                </motion.div>
                {i < flow.length - 1 && (
                  <div className="flex items-center justify-center text-accent/50">
                    <ArrowRight className="hidden md:block h-6 w-6" />
                    <ArrowRight className="md:hidden h-5 w-5 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </SectionShell>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileCheck2, Building, ArrowRight, Repeat } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';

const flow = [
  { icon: Building, label: 'EMR Encounter', sub: 'Inpatient · Day Hospital · ED · Planned Ambulatory' },
  { icon: Repeat, label: 'Mapping', sub: 'Encounter → MOH XML schema · Classifier lookup · Validation' },
  { icon: Landmark, label: 'MOH + RS.GE', sub: 'Dual API submission · Status tracking · Retry queue' },
];

const proof = [
  '4 case-type XML schemas auto-selected from encounter context (Inpatient, Day Hospital, Emergency Ambulatory, Planned Ambulatory)',
  '7 government classifiers auto-sync on a 30-day cadence — medical specialties, care levels, personnel types, blood components, transportation, hospitalization, plus 2,000+ medical items as FHIR CodeSystem resources',
  'Dual-API submission — same XML payload to RS.GE (Revenue Service, billing) and MOH (national EHR surveillance, quality reporting); status tracked separately per API',
  'Submission retry queue with exponential backoff, manual retry button, full status dashboard (pending / submitted / failed / updated), XML preview + validation before submit',
  'ePrescription verification against MOH government registry — flags prescriptions not registered, prevents billing if validation fails',
];

export const ComplianceMoatSection: React.FC = () => {
  return (
    <SectionShell id="compliance" variant="dark" ambient className="border-t border-white/5">
      <GradientHeading
        eyebrow={{ icon: FileCheck2, label: 'The Moat', tone: 'light' }}
        title="The integration"
        highlight="nobody else has done."
        subhead="Submitting to Georgia's MOH and RS.GE isn't a feature — it's a 6–12 month engineering investment in regulatory expertise. We did it. It's why hospitals sign with us."
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
                  className="flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
                >
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-accent/30 to-secondary/20 p-3 ring-1 ring-accent/30">
                    <Icon className="h-6 w-6 text-light-accent" />
                  </div>
                  <h3 className="mt-3 text-base sm:text-lg font-semibold text-white">{step.label}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300/85 leading-snug max-w-xs">{step.sub}</p>
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

      {/* Proof bullets */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 sm:mt-14 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm"
      >
        <ul className="space-y-3">
          {proof.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              <span className="text-sm sm:text-base text-slate-200/95 leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm sm:text-base italic text-slate-300/90">
            “This is not a feature you can build in a sprint. It's the reason a 25-hospital chain signed with us in April 2026.”
          </p>
        </div>
      </motion.div>
    </SectionShell>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';

const standards = ['FHIR R4', 'HL7 v2.x', 'DICOM', 'SMART on FHIR', 'ICD-10', 'LOINC', 'RxNorm', 'CPT'];

const partners = ['HealthGorilla', 'DoseSpot', 'Orthanc', 'LiveKit', 'Fitbit', 'Withings', 'Apple Health', 'Georgia MOH', 'RS.GE'];

export const StandardsSection: React.FC = () => {
  return (
    <SectionShell id="standards" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: ShieldCheck, label: 'Standards & integrations', tone: 'accent' }}
        title="Built on what the world"
        highlight="already runs on."
      />

      {/* Standards strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
      >
        {standards.map((s) => (
          <span
            key={s}
            className="rounded-lg border border-accent/25 bg-accent/5 px-3.5 py-1.5 text-sm font-semibold text-secondary dark:text-light-accent"
          >
            {s}
          </span>
        ))}
      </motion.div>

      {/* Integration partners — single line */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-8 sm:mt-10 text-center text-sm sm:text-base text-text-subtle max-w-3xl mx-auto leading-relaxed"
      >
        Integrates with{' '}
        {partners.map((p, i) => (
          <React.Fragment key={p}>
            <span className="text-text font-medium">{p}</span>
            {i < partners.length - 1 && <span> · </span>}
          </React.Fragment>
        ))}
      </motion.p>
    </SectionShell>
  );
};

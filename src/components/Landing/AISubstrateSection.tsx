import React from 'react';
import { Sparkles } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { MediScribeWalkthrough } from './MediScribeWalkthrough';

export const AISubstrateSection: React.FC = () => {
  return (
    <SectionShell id="ai" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: Sparkles, label: 'See the AI work', tone: 'navy' }}
        title="AI in every workflow,"
        highlight="not in a chatbot."
        subhead="Voice in. Structured FHIR out. ICD-10 codes generated. Government form drafted in parallel. Watch a single MediScribe encounter end-to-end."
      />

      <div className="mt-12 sm:mt-14">
        <MediScribeWalkthrough />
      </div>
    </SectionShell>
  );
};

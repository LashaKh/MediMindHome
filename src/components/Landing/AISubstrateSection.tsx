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
        title="AI in every capability,"
        highlight="not a chatbot on top."
        subhead="AI sits inside every capability — ambient scribe, drug-interaction hard-stops, appeals drafting, pathway engine, coordinator copilot. Here's one encounter end-to-end: voice in, structured FHIR out, ICD-10 codes generated, government form drafted in parallel."
      />

      <div className="mt-12 sm:mt-14">
        <MediScribeWalkthrough />
      </div>
    </SectionShell>
  );
};

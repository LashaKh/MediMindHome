import React from 'react';
import { Sparkles } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { MediScribeWalkthrough } from './MediScribeWalkthrough';

export const AISubstrateSection: React.FC = () => {
  return (
    <SectionShell id="ai" variant="dark" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: Sparkles, label: 'Phase 2 · AI in action', tone: 'navy' }}
        title="Watch one visit"
        highlight="document itself."
        subhead="The doctor talks to the patient. MediMind writes the note, codes the visit, and drafts the government form — the doctor reviews and signs."
      />

      <div className="mt-12 sm:mt-14">
        <MediScribeWalkthrough />
      </div>
    </SectionShell>
  );
};

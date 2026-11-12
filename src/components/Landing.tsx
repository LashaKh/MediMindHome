import React from 'react';
import { HeroSection } from './Landing/HeroSection';
import { TractionStrip } from './Landing/TractionStrip';
import { BeliefSection } from './Landing/BeliefSection';
import { FragmentsSection } from './Landing/FragmentsSection';
import { AnatomyOsSection } from './Landing/AnatomyOsSection';
import { ProductSection } from './Landing/ProductSection';
import { BrainSection } from './Landing/BrainSection';
import { ProofSection } from './Landing/ProofSection';
import { SwitchPlanSection } from './Landing/SwitchPlanSection';
import { FoundersSection } from './Landing/FoundersSection';
import { AmbitionWorldSection } from './Landing/AmbitionWorldSection';
import { ContactSection } from './Landing/ContactSection';
import { StickyCtaBar } from './ui';

/**
 * MediMind landing, direction v2
 * (marketing/landing-level-up-2026-11-12/09-DIRECTION-V2.md).
 *   Hero → Traction → Belief → Fragments → Anatomy → Product → Brain
 *   → Proof → Switch → Founders → Ambition → Contact
 *
 * Earlier sections (v1 and the original page) stay in the codebase but are
 * not rendered.
 */
export const Landing: React.FC = () => {
  return (
    <div className="w-full bg-mm-page">
      <HeroSection />
      <TractionStrip />
      <BeliefSection />
      <FragmentsSection />
      <AnatomyOsSection />
      <ProductSection />
      <BrainSection />
      <ProofSection />
      <SwitchPlanSection />
      <FoundersSection />
      <AmbitionWorldSection />
      <ContactSection />
      <StickyCtaBar />
    </div>
  );
};

import React from 'react';
import { HeroSection } from './Landing/HeroSection';
import { ProofStrip } from './Landing/ProofStrip';
import { ProblemSection } from './Landing/ProblemSection';
import { WhatChangesSection } from './Landing/WhatChangesSection';
import { ExamplesSection } from './Landing/ExamplesSection';
import { SwitchPlanSection } from './Landing/SwitchPlanSection';
import { AiTodaySection } from './Landing/AiTodaySection';
import { VisionSection } from './Landing/VisionSection';
import { ControlSection } from './Landing/ControlSection';
import { FoundersSection } from './Landing/FoundersSection';
import { OfferSection } from './Landing/OfferSection';
import { FaqSection } from './Landing/FaqSection';
import { ContactSection } from './Landing/ContactSection';
import { StickyCtaBar } from './ui';

/**
 * MediMind landing: the master brief's message order
 * (marketing/landing-level-up-2026-11-12/00-MASTER-BRIEF.md).
 *   Hero → Proof → Problem → What changes → Examples → Switch plan
 *   → AI today → Vision → Control → Team → Offer → FAQ → Contact
 *
 * The previous sections (LampHero, FortySystems, ThreePhase, PlatformPillars,
 * AISubstrate, Safety, Recognition, FinalCTA, LightThread) and the dormant
 * Anatomy, Team and Ambition sections stay in the codebase but are not rendered.
 */
export const Landing: React.FC = () => {
  return (
    <div className="w-full bg-mm-page">
      <HeroSection />
      <ProofStrip />
      <ProblemSection />
      <WhatChangesSection />
      <ExamplesSection />
      <SwitchPlanSection />
      <AiTodaySection />
      <VisionSection />
      <ControlSection />
      <FoundersSection />
      <OfferSection />
      <FaqSection />
      <ContactSection />
      <StickyCtaBar />
    </div>
  );
};

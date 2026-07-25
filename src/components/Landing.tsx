import React from 'react';
import { LightThread } from './Landing/LightThread';
import { LampHeroSection } from './Landing/LampHeroSection';
import { FortySystemsSection } from './Landing/FortySystemsSection';
import { ThreePhaseSection } from './Landing/ThreePhaseSection';
import { PlatformPillarsSection } from './Landing/PlatformPillarsSection';
import { AISubstrateSection } from './Landing/AISubstrateSection';
import { SafetySection } from './Landing/SafetySection';
import { RecognitionSection } from './Landing/RecognitionSection';
import { FinalCTASection } from './Landing/FinalCTASection';

/**
 * MediMind landing — one hospital, one operating system.
 *
 * Narrative arc — the 3-phase deployment path is the spine:
 *   Hero → Problem (forty systems) → The Path (3 phases)
 *        → Platform (Phase 1 depth) → AI demo (Phase 2 in action)
 *        → Safety (AI works, people decide) → Proof → CTA
 *
 * AnatomySection, TeamSection and AmbitionSection remain in the codebase
 * but are not rendered — Anatomy is internal-architecture framing, and the
 * other two re-enable once founders are named / ambition copy is aligned.
 */
export const Landing: React.FC = () => {
  return (
    <div className="w-full bg-surface-page text-text">
      <LightThread />
      <LampHeroSection />
      <FortySystemsSection />
      <ThreePhaseSection />
      <PlatformPillarsSection />
      <AISubstrateSection />
      <SafetySection />
      <RecognitionSection />
      <FinalCTASection />
    </div>
  );
};

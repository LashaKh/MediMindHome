import React from 'react';
import { LampHeroSection } from './Landing/LampHeroSection';
import { FortySystemsSection } from './Landing/FortySystemsSection';
import { PlatformPillarsSection } from './Landing/PlatformPillarsSection';
import { AnatomySection } from './Landing/AnatomySection';
import { AISubstrateSection } from './Landing/AISubstrateSection';
import { SafetySection } from './Landing/SafetySection';
import { RecognitionSection } from './Landing/RecognitionSection';
import { FinalCTASection } from './Landing/FinalCTASection';

/**
 * MediMind landing — one hospital, one operating system.
 *
 * Narrative arc (aligned with positioning doc):
 *   Hero → Pain (forty systems) → Capabilities (9 pillars) → Anatomy (5 layers)
 *        → AI demo → Safety (AI works, people decide) → Recognition → CTA
 *
 * TeamSection and AmbitionSection remain in the codebase but are not
 * rendered — re-enable once founders are named and ambition copy is
 * re-written in full positioning alignment.
 */
export const Landing: React.FC = () => {
  return (
    <div className="w-full bg-surface-page text-text">
      <LampHeroSection />
      <FortySystemsSection />
      <PlatformPillarsSection />
      <AnatomySection />
      <AISubstrateSection />
      <SafetySection />
      <RecognitionSection />
      <FinalCTASection />
    </div>
  );
};

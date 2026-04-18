import React from 'react';
import { LampHeroSection } from './Landing/LampHeroSection';
import { PlatformPillarsSection } from './Landing/PlatformPillarsSection';
import { AISubstrateSection } from './Landing/AISubstrateSection';
import { RecognitionSection } from './Landing/RecognitionSection';
import { StandardsSection } from './Landing/StandardsSection';
import { FinalCTASection } from './Landing/FinalCTASection';

/**
 * Lean landing page — 6 sections.
 *
 * Hero → Platform (9 pillars at a glance) → AI demo → Trust/proof → Standards → CTA
 *
 * Other sections (SafetySection, ComplianceMoatSection, TeamSection,
 * MilestonesSection, AmbitionSection) remain in the codebase but are not
 * rendered. Re-import here if a deep-dive page is ever wanted.
 */
export const Landing: React.FC = () => {
  return (
    <div className="w-full bg-surface-page text-text">
      <LampHeroSection />
      <PlatformPillarsSection />
      <AISubstrateSection />
      <RecognitionSection />
      <StandardsSection />
      <FinalCTASection />
    </div>
  );
};

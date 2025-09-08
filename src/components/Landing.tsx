import React from 'react';
import { LampHeroSection } from './Landing/LampHeroSection';
import { ProductsSection } from './Landing/ProductsSection';
import { ProblemsSection } from './Landing/ProblemsSection';
import { FeaturesSection } from './Landing/FeaturesSection';

export const Landing: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900/95 via-slate-800/90 via-slate-700/80 via-slate-600/70 via-slate-500/60 via-slate-400/50 via-slate-300/40 via-slate-200/30 via-slate-100/20 to-white">
      <LampHeroSection />
      <div id="products">
        <ProductsSection />
      </div>
      <div id="problems">
        <ProblemsSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
    </div>
  );
};
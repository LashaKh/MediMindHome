import React from 'react';
import { LampHeroSection } from './Landing/LampHeroSection';
import { ProductsSection } from './Landing/ProductsSection';
import { ProblemsSection } from './Landing/ProblemsSection';
import { FeaturesSection } from './Landing/FeaturesSection';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <LampHeroSection />
      <div id="problems">
        <ProblemsSection />
      </div>
      <div id="products">
        <ProductsSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
    </div>
  );
};
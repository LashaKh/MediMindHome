import React from 'react';
import { MediMindLogo } from '../ui/MediMindLogo';

export const Footer: React.FC = () => (
  <footer className="border-t border-surface-border bg-surface-page py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-text-muted">
        <MediMindLogo variant="icon" size="sm" />
        <span className="text-sm">© {new Date().getFullYear()} MediMind. All rights reserved.</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
        <a href="https://medimind.md/expert" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
          MediMind Expert
        </a>
        <a href="mailto:team@updevoteai.com" className="hover:text-accent transition-colors">
          Contact
        </a>
        <a href="https://innovationstatus.gov.ge/ka/awarded-companies/11464" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
          Innovative Startup Status
        </a>
      </div>
    </div>
  </footer>
);

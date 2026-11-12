import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Header, page, footer. On the landing page the hero runs under the fixed
 * header (the header is transparent over it), so there is no top offset;
 * every other route starts below the header.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isLanding = useLocation().pathname === '/';
  return (
    <div className="min-h-screen flex flex-col bg-surface-page text-text">
      <Header />
      <div className={isLanding ? 'flex-1' : 'flex-1 mt-16 md:mt-20'}>
        <main className="flex-1 w-full">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

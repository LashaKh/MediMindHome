import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-page text-text">
      <Header />
      <div className="flex-1 mt-16 sm:mt-18 md:mt-20">
        <main className="flex-1 w-full">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

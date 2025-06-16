import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex-1 overflow-hidden mt-16">
        <main className="flex-1 transition-all duration-200 overflow-hidden w-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
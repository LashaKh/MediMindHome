import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SideMenu } from './SideMenu';
import { useAuthStore } from '../../store/useAuthStore'; 

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setIsExpanded(!isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex-1 overflow-hidden mt-16">
        {user && (
          <SideMenu 
            isMobile={isMobile} 
            isExpanded={isExpanded}
            onExpandedChange={setIsExpanded}
          />
        )}
        <main className={`flex-1 transition-all duration-200 overflow-hidden ${
          isMobile ? 'w-full' : isExpanded ? 'lg:pl-60' : 'lg:pl-[72px]'
        }`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
import { useState, useEffect } from 'react';

export const useMigrationNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the notice
    const dismissed = localStorage.getItem('migration-notice-dismissed');
    
    if (!dismissed) {
      // Show the notice after a short delay to allow page to load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closeNotice = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    closeNotice
  };
};
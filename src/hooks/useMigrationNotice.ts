import { useState, useEffect } from 'react';

export const useMigrationNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always show the notice - no dismissal option
    // Show the notice after a short delay to allow page to load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return {
    isOpen
  };
};
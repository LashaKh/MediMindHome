import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  StickyNote, 
  Users,
  User,
  Activity,
  FileText,
  ChevronLeft, 
  ChevronRight, 
  Menu,
  Droplets,
  Search
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface SideMenuProps {
  isMobile: boolean;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ 
  isMobile, 
  isExpanded, 
  onExpandedChange 
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    onExpandedChange(!isMobile);
  }, [isMobile]);

  const menuItems = [
    { icon: Users, label: "Patients", path: '/patients' },
    { icon: User, label: "My Patients", path: '/my-patients' },
    { icon: MessageSquare, label: "AI Chatbot", path: '/chat' },
    { icon: Droplets, label: "BG Analysis", path: '/bg-analysis' },
    { icon: Activity, label: "ECG Analysis", path: '/ecg-analysis' },
    { icon: Search, label: "Medi Search", path: '/medisearch' },
    { icon: StickyNote, label: "Notes", path: '/notes' },
    { icon: FileText, label: "MediVoice", path: '/medivoice-transcriber' }
  ];

  if (isMobile && !isExpanded) {
    return (
      <button
        onClick={() => onExpandedChange(true)}
        className="fixed bottom-4 left-4 z-[100] p-3 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {(isExpanded || !isMobile) && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onExpandedChange(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
          
          <motion.div
            initial={isMobile ? { x: -320 } : { width: 72 }}
            animate={isMobile ? { x: 0 } : { width: isExpanded ? 240 : 72 }}
            exit={isMobile ? { x: -320 } : undefined}
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#121B29] border-r border-white/10 z-40"
          >
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="absolute right-2 top-2">
                <button
                  onClick={() => onExpandedChange(!isExpanded)}
                  className="p-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex-1 pt-14 pb-6">
                <div className="space-y-2 px-3">
                  {menuItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => isMobile && onExpandedChange(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-white/10 text-white font-medium border border-white/20' 
                          : 'text-gray-400 hover:bg-white/5 border border-transparent'
                        } whitespace-nowrap
                        ${!isExpanded && !isMobile ? 'justify-center' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                      <AnimatePresence mode="wait">
                        {(isExpanded || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="truncate whitespace-nowrap"
                          >
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Stethoscope, ArrowRight, Menu, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { t } = useTranslation();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Section navigation for landing page
  const navigationSections = [
    { id: 'problems', label: t('nav.challenges'), offset: -100 },
    { id: 'products', label: t('nav.products'), offset: -100 },
    { id: 'features', label: t('nav.features'), offset: -100 }
  ];

  const scrollToSection = (sectionId: string, offset: number = -100) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 md:h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary dark:text-white group">
            <div className="flex items-center">
              <motion.div
                className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </motion.div>
              <div className="ml-3 flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  MediMind
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                  {String(t('common.aiAssistant'))}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation (only on landing page) */}
          {isLandingPage && (
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationSections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id, section.offset)}
                  className="group relative px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-all duration-300 rounded-xl hover:bg-primary/5 dark:hover:bg-accent/5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{section.label}</span>
                  
                  {/* Hover effect background */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-accent/10 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    layoutId={`nav-${section.id}`}
                  />
                  
                  {/* Bottom border indicator */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full group-hover:left-0 transition-all duration-300"
                  />
                </motion.button>
              ))}
              
              {/* CTA Button */}
              <motion.button
                onClick={() => scrollToSection('products', -100)}
                className="group relative overflow-hidden ml-4 px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('nav.getStarted')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.button>
            </nav>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button (only on landing page) */}
            {isLandingPage && (
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent hover:bg-primary/5 dark:hover:bg-accent/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            )}
            
            <ThemeToggle />
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {user.email}
                  </span>
                </div>
                <motion.button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{String(t('auth.signOut'))}</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && isLandingPage && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <nav className="space-y-4">
                {navigationSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id, section.offset)}
                    className="group w-full text-left px-4 py-3 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent rounded-xl hover:bg-primary/5 dark:hover:bg-accent/5 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {section.label}
                  </motion.button>
                ))}
                
                {/* Mobile CTA Button */}
                <motion.button
                  onClick={() => scrollToSection('products', -100)}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    {t('nav.getStarted')}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
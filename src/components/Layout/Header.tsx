import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediMindLogo } from '../ui/MediMindLogo';

const navigationSections = [
  { id: 'platform', label: 'Platform' },
  { id: 'ai', label: 'AI' },
  { id: 'safety', label: 'Safety' },
  { id: 'proof', label: 'Proof' },
];

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const goToDemo = () => {
    setIsMobileMenuOpen(false);
    navigate('/request-demo');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-page/85 backdrop-blur-md border-b border-surface-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 md:h-20">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center group" aria-label="MediMind home">
            <MediMindLogo variant="horizontal" size="md" />
          </Link>

          {isLandingPage && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationSections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group relative px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-hover"
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {section.label}
                </motion.button>
              ))}

              <motion.button
                onClick={goToDemo}
                className="group relative overflow-hidden ml-4 px-5 py-2.5 brand-gradient text-white text-sm font-semibold rounded-full shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </motion.button>
            </nav>
          )}

          <div className="flex items-center space-x-3">
            {isLandingPage && (
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            )}

            <ThemeToggle />

            {user && (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-sm text-text-subtle font-medium">{user.email}</span>
                <motion.button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-error hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-error/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium text-sm">Sign Out</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && isLandingPage && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 z-50 bg-surface-page border-b border-surface-border shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <nav className="space-y-2">
                {navigationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-4 py-3 text-base font-medium text-text-muted hover:text-text rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    {section.label}
                  </button>
                ))}

                <motion.button
                  onClick={goToDemo}
                  className="w-full mt-4 px-6 py-3.5 brand-gradient text-white font-semibold rounded-full shadow-lg shadow-accent/30 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Book Demo
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

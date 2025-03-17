import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Stethoscope } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center space-x-2 text-primary dark:text-white">
            <div className="flex items-center">
              <Stethoscope className="w-8 h-8 text-primary" />
              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MediMind
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('common.aiAssistant')}
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('auth.signOut')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  {t('auth.signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
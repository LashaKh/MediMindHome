import React from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import type { Language } from '../../types/i18n';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  
  const getNextLanguage = (current: Language): Language => {
    switch (current) {
      case 'en': return 'ka';
      case 'ka': return 'ru';
      case 'ru': return 'en';
      default: return 'en';
    }
  };

  const getFlag = (language: Language): string => {
    switch (language) {
      case 'en': return '🇺🇸';
      case 'ka': return '🇬🇪';
      case 'ru': return '🇷🇺';
      default: return '🇺🇸';
    }
  };

  const nextLanguage = getNextLanguage(currentLanguage);

  return (
    <button
      onClick={() => setLanguage(nextLanguage)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      title={`Switch to ${SUPPORTED_LANGUAGES[nextLanguage].name}`}
    >
      <span className="text-sm">
        {getFlag(currentLanguage)}
      </span>
      <span className="text-sm">
        {SUPPORTED_LANGUAGES[currentLanguage].name}
      </span>
    </button>
  );
};
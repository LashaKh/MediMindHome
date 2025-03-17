import React from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import type { Language } from '../../types/i18n';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const nextLanguage: Language = currentLanguage === 'en' ? 'ka' : 'en';

  return (
    <button
      onClick={() => setLanguage(nextLanguage)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      <span className="text-sm">
        {currentLanguage === 'en' ? '🇺🇸' : '🇬🇪'}
      </span>
      <span className="text-sm">
        {SUPPORTED_LANGUAGES[currentLanguage].name}
      </span>
    </button>
  );
};
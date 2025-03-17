import { useCallback } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import en from '../i18n/translations/en';
import ka from '../i18n/translations/ka';
import type { Language } from '../types/i18n';

const translations = {
  en,
  ka
};

export const useTranslation = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();

  const t = useCallback((key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    if (!value) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
    }

    if (params && typeof value === 'string') {
      return Object.entries(params).reduce(
        (acc, [key, val]) => acc.replace(`{{${key}}}`, val),
        value
      );
    }

    return value || key;
  }, [currentLanguage]);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
  }, [setLanguage]);

  return { t, handleLanguageChange, currentLanguage };
};
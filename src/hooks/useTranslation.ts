import { useCallback } from 'react';
import en from '../i18n/translations/en';
import ka from '../i18n/translations/ka';
import ru from '../i18n/translations/ru';
import type { Language } from '../types/i18n';

const translations = {
  en,
  ka,
  ru
};

export const useTranslation = () => {
  // Force English language - always use 'en' regardless of store state
  const forcedLanguage: Language = 'en';
  
  const t = useCallback((key: string, options?: { [key: string]: any }): string => {
    if (!key) return '';
    
    // Always use English translations
    let value: any = translations[forcedLanguage];
    
    const keys = key.split('.');
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (value === undefined) {
      console.warn(`Translation missing for key: ${key} in language: ${forcedLanguage}`);
      return key;
    }
    
    if (typeof value === 'string' && options) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return options[key] || match;
      });
    }
    
    return String(value);
  }, [forcedLanguage]); // Use forcedLanguage instead of currentLanguage

  // Keep the language change handler for compatibility, but it won't actually change anything
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    // Do nothing - language is forced to English
    console.log('Language switching is disabled - using English only');
  }, []);

  // Return forcedLanguage instead of currentLanguage
  return { t, handleLanguageChange, currentLanguage: forcedLanguage };
};
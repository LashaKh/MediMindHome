import { useCallback } from 'react';
import en from '../i18n/translations/en';

type TranslationDict = typeof en;

const translations: TranslationDict = en;

export const useTranslation = () => {
  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    if (!key) return '';

    let value: unknown = translations;
    for (const k of key.split('.')) {
      if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`Translation missing for key: ${key}`);
      }
      return key;
    }

    if (typeof value === 'string' && options) {
      return value.replace(/\{\{(\w+)\}\}/g, (_match, name) => String(options[name] ?? `{{${name}}}`));
    }

    return String(value);
  }, []);

  return { t, currentLanguage: 'en' as const };
};

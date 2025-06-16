export type Language = 'en' | 'ka' | 'ru';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}
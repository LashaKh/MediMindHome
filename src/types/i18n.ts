export type Language = 'en' | 'ka';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}
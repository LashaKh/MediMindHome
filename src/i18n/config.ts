export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English'
  },
  ka: {
    code: 'ka',
    name: 'ქართული'
  }
} as const;

export const DEFAULT_LANGUAGE = 'en';

export const DATE_FORMATS = {
  en: {
    short: 'MM/dd/yyyy',
    long: 'MMMM d, yyyy',
    time: 'HH:mm'
  },
  ka: {
    short: 'dd.MM.yyyy',
    long: 'd MMMM, yyyy',
    time: 'HH:mm'
  }
};

export const NUMBER_FORMATS = {
  en: {
    decimal: '.',
    thousands: ',',
    currency: 'USD'
  },
  ka: {
    decimal: ',',
    thousands: ' ',
    currency: 'GEL'
  }
};
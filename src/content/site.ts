import type { CtaLink } from './types';

/**
 * Site-wide flags and constants for the landing page.
 * Flip a flag here; every section reads it from this one place.
 */

/**
 * When true the page names the 25-hospital customer (GeoHospitals), shows its
 * logo and the CTO quote. Default false: "a 25-hospital network in Georgia".
 * The founder flips this.
 */
export const showCustomerName = false;

/**
 * When true the offer shows the quiet line about founding-partner places.
 * Switch off the day it stops being true.
 */
export const showFoundingPlaces = true;

/**
 * When true the vision section shows the short case from Dr. Khoshtaria's
 * practice. On in the preview build; he confirms every fact before go-live.
 */
export const showPracticeCase = true;

/** Public contact address. */
export const contactEmail = 'team@medimind.md';

/**
 * The one primary call to action, repeated across the page.
 * `href` is the on-page contact section. The label is the copy deck's
 * approved wording (06-copy-deck.md, Part 3).
 */
export const primaryCta: CtaLink = {
  label: 'Get my 90-day plan · 30 min',
  href: '#contact',
};

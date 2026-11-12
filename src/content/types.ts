/**
 * Shared content types for the landing page. Copy files and section
 * components use these so every lane describes links and images the same way.
 */

/** Background tone of a section: white, pale blue-grey, or the navy "punch". */
export type SectionTone = 'white' | 'pale' | 'navy';

/** Heading level passed to SectionHeading. Exactly one h1 per page (the hero). */
export type HeadingLevel = 'h1' | 'h2' | 'h3';

/** A call-to-action or link. `href` is a hash (#contact), a path (/privacy) or a full URL. */
export interface CtaLink {
  label: string;
  href: string;
}

/**
 * A screenshot or photo served in modern formats.
 * `avif` / `webp` are full srcset strings, e.g.
 *   '/landing/billing-800.avif 800w, /landing/billing-1600.avif 1600w'
 * `fallback` is a single URL for browsers without either (WebP or PNG/JPEG).
 * `width` / `height` are the intrinsic size of the largest file (prevents layout shift).
 */
export interface ResponsiveImage {
  alt: string;
  width: number;
  height: number;
  fallback: string;
  avif?: string;
  webp?: string;
  /** Layout hint for the browser, e.g. '(min-width: 1024px) 960px, 100vw'. */
  sizes?: string;
}

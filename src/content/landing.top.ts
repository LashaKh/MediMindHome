import type { ResponsiveImage } from './types';

/**
 * Words and images for the top of the landing page: header, hero, proof strip
 * and the problem section. Copy is the approved deck, word for word
 * (marketing/landing-level-up-2026-11-12/06-copy-deck.md, Parts 2 and 3).
 * A Georgian version can sit beside this file with the same shape.
 *
 * Section ids follow status/foundation.done.md (the deck's #solution is
 * #system, #plan is #switch, #safety is #control).
 */

/** Builds a ResponsiveImage from a public/landing/manifest.json id (800/1400/2000 px, AVIF + WebP, JPEG 1400 fallback). */
const landingShot = (id: string, width: number, height: number, alt: string, sizes: string): ResponsiveImage => ({
  alt,
  width,
  height,
  fallback: `/landing/${id}-1400.jpg`,
  avif: `/landing/${id}-800.avif 800w, /landing/${id}-1400.avif 1400w, /landing/${id}-2000.avif 2000w`,
  webp: `/landing/${id}-800.webp 800w, /landing/${id}-1400.webp 1400w, /landing/${id}-2000.webp 2000w`,
  sizes,
});

// ---------------------------------------------------------------- Header

export const headerContent = {
  logoLabel: 'MediMind home',
  /** Accessible name of the section navigation (not visible). */
  navLabel: 'Page sections',
  nav: [
    { label: 'The problem', id: 'problem' },
    { label: 'What changes', id: 'system' },
    { label: '90-day plan', id: 'switch' },
    { label: 'Safety', id: 'control' },
    { label: 'Team', id: 'team' },
  ],
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
  themeToDarkLabel: 'Switch to dark theme',
  themeToLightLabel: 'Switch to light theme',
};

// ---------------------------------------------------------------- Hero

/**
 * The hero screenshot. Provisional (status/orchestrator-rulings.md): to swap it,
 * change this id together with its intrinsic size and alt text below.
 */
export const heroImageId = 'hero-bed-board';

export const heroContent = {
  preHeadline: 'For owners and CEOs of private hospitals in Georgia',
  /** h1: `title` then the accent phrase, then `end` (the full stop). */
  title: 'Get paid for the care',
  accent: 'your hospital gives',
  end: '.',
  sub: 'Your whole hospital works from one record, from admission to invoice, with a 90-day plan to go live while your current system keeps running.',
  benefits: [
    'Claims backed by a complete record before they go out.',
    'Stock, invoices and bank receipts that agree.',
    'Each fact typed once, then used by every department.',
  ],
  underButton: '30 minutes · online or at your hospital · no commitment',
  trust: 'Built by a practising cardiologist. Signed by a 25-hospital network in Georgia.',
  imageCaption: 'MediMind · demo data',
  image: landingShot(
    heroImageId,
    2000,
    802,
    'MediMind bed board for an emergency department, showing 6 rooms and 20 beds, each bed marked occupied or available. Demo data.',
    '(min-width: 1152px) 1088px, (min-width: 768px) calc(100vw - 48px), 600px'
  ),
};

// ---------------------------------------------------------------- Proof strip

export const proofContent = {
  /** Lead line; `strong` is set in the ink colour, `rest` follows it. */
  lead: {
    unnamed: { strong: 'Signed:', rest: ' a 25-hospital network in Georgia is replacing every system with MediMind.' },
    named: { strong: 'Signed:', rest: ' GeoHospitals is replacing every system in its 25 hospitals with MediMind.' },
  },
  customerLogo: {
    alt: 'GeoHospitals',
    width: 378,
    height: 157,
    light: '/landing/customer-logo-dark-378.webp',
    dark: '/landing/customer-logo-white-378.webp',
  },
  items: [
    { label: 'In daily use', detail: 'Laboratory and imaging at the network’s central hospital.' },
    {
      label: 'Innovative Startup status',
      detail: 'Granted by the Government of Georgia.',
      href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464',
      linkLabel: 'See the public registry',
    },
    { label: 'GITA grant', detail: '150,000 GEL from Georgia’s Innovation and Technology Agency.' },
    { label: '500 Global', detail: 'Backed through its B11 programme.' },
  ],
};

// ---------------------------------------------------------------- The problem

export interface ProblemFigure {
  value: string;
  /** Label pieces: `strong` is the key phrase (semibold ink), as on the v6 deck slide. */
  before: string;
  strong: string;
  after: string;
}

export const problemContent = {
  eyebrow: 'The problem',
  title: 'Georgian hospitals have',
  accent: 'little room for error',
  end: '.',
  /** The one dominant number. */
  lead: { value: '2.4%', before: '', strong: 'Median net margin.', after: ' Half of these hospitals keep less.' } as ProblemFigure,
  /** The loss number: the only red on the page. */
  loss: { value: '24 of 68', before: '', strong: 'lost money', after: ' in their latest audited year.' } as ProblemFigure,
  state: { value: '37%', before: 'of ', strong: 'revenue comes from the state', after: ', paid against the record.' } as ProblemFigure,
  source:
    'Source: MediMind analysis of audited accounts of 68 mid-size Georgian hospitals (revenue GEL 5 to 100 million), FY2024 to 2025, from reportal.ge. State share: MediMind analysis of state programme per-facility data, 2025.',
  support: 'Is this your hospital too? Three problems sit behind these numbers.',
  problems: [
    {
      title: 'Fines and returned claims',
      body: 'A record with gaps, or corrected without a trace, does not survive the Ministry’s review. The claim comes back, or a fine arrives.',
    },
    {
      title: 'Management without reliable numbers',
      body: 'Stock, invoices and payments disagree. Decisions run on estimates, and nobody can act with confidence.',
    },
    {
      title: 'Staff stretched by repeated manual work',
      body: 'Doctors and nurses type the same information into several systems. That time could go to patients.',
    },
  ],
  closing: 'Which one costs your hospital most? That is where your 90-day plan starts.',
};

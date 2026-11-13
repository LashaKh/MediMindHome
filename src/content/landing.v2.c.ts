import type { ResponsiveImage } from './types';

/**
 * Lane C words and image ids (round 3, 10-ROUND-3-RULINGS.md):
 *   #product  everything a hospital runs on, as real screens with short labels
 *   #brain    the autonomy dial, the three limits, the off switch (in development)
 *   #proof    the founder's numbers, large, plus one quiet row of recognitions
 *
 * Truth lines: the brain is never described as live. A doctor signs every
 * medical decision. The customer stays unnamed. No per-module status marks.
 */

// ─── Images ──────────────────────────────────────────────────────────

/**
 * Screenshot in public/landing/: <id>-800/-1400/-2000 in AVIF and WebP plus a
 * 1400 JPEG. `height` is the height of the 2000px file (manifest.json).
 */
function shot(id: string, height: number, alt: string): ResponsiveImage {
  const set = (ext: string) => [800, 1400, 2000].map((w) => `/landing/${id}-${w}.${ext} ${w}w`).join(', ');
  return { alt, width: 2000, height, fallback: `/landing/${id}-1400.jpg`, avif: set('avif'), webp: set('webp') };
}

/** A rectangle inside a screenshot, as fractions (0 to 1) of its width and height. */
export interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * One tile of the product composition. `view` is where the tile looks into
 * the screen: its left and top edge and how much of the width shows (the
 * tile's own height decides how much shows below). `tag` sits on the screen
 * at `tagAt` (fractions of the tile).
 */
export interface ProductTile {
  id: string;
  name: string;
  imageId: string;
  image: ResponsiveImage;
  view: { x: number; y: number; w: number };
  tag: string;
  tagAt: { x: number; y: number };
  /** Optional second screen laid across the foot of the tile (billing). */
  front?: { imageId: string; image: ResponsiveImage };
}

// ─── 6. Product (#product) ───────────────────────────────────────────

export const product = {
  title: ['Everything a hospital runs on.', 'Natively included.'],
  support: 'Record, laboratory, imaging, pharmacy, billing and staff. One record, one codebase.',
  demoData: 'Real screens, demo data.',
  tiles: [
    {
      id: 'record',
      name: 'Clinical record',
      imageId: 'patient-chart',
      image: shot(
        'patient-chart',
        790,
        'MediMind clinical dashboard for one patient: a fall-risk alert and a drug-interaction alert above active problems, medications with a high-alert flag, vitals and lab results. Demo data.'
      ),
      view: { x: 0.012, y: 0.19, w: 0.44 },
      tag: 'Drug interaction caught',
      tagAt: { x: 0.56, y: 0.21 },
    },
    {
      id: 'lab',
      name: 'Laboratory',
      imageId: 'lab-orders',
      image: shot(
        'lab-orders',
        654,
        'MediMind order history for one visit: three laboratory orders and one imaging order, each with its status. Demo data.'
      ),
      view: { x: 0.008, y: 0.29, w: 0.62 },
      tag: 'Every order, one list',
      tagAt: { x: 0.5, y: 0.08 },
    },
    {
      id: 'stock',
      name: 'Pharmacy and stock',
      imageId: 'warehouse-stock',
      image: shot(
        'warehouse-stock',
        1018,
        'MediMind warehouse stock list filtered to low stock: item codes, quantities with low counts in red, prices, expiry dates and batch series. Demo data.'
      ),
      view: { x: 0.2, y: 0.33, w: 0.68 },
      tag: 'Low stock, flagged',
      tagAt: { x: 0.52, y: 0.1 },
    },
    {
      id: 'billing',
      name: 'Billing',
      imageId: 'billing-funding',
      image: shot(
        'billing-funding',
        594,
        'MediMind funding request screen: choose a state or municipal co-funding request, then the financier. Demo data.'
      ),
      view: { x: 0, y: 0, w: 0.9 },
      tag: 'Charges straight from the record',
      tagAt: { x: 0.06, y: 0.12 },
      front: {
        imageId: 'billing-revenue',
        image: shot(
          'billing-revenue',
          188,
          'MediMind revenue report for one month: charges, amounts invoiced to payers, collections and the outstanding balance, in lari. Demo data.'
        ),
      },
    },
    {
      id: 'management',
      name: 'Staff and management',
      imageId: 'os-modules-full',
      image: shot(
        'os-modules-full',
        1050,
        'MediMind dashboard with every hospital area in one sidebar: staff, clinic operations, clinical settings, nomenclature, financial, warehouse, command center, analytics and system configuration. Demo data.'
      ),
      view: { x: 0, y: 0.08, w: 0.56 },
      tag: 'Every area, one sidebar',
      tagAt: { x: 0.5, y: 0.1 },
    },
  ] satisfies ProductTile[],
};

// ─── 7. Brain (#brain) ───────────────────────────────────────────────

export interface DialLevel {
  name: string;
  /** One short line: what this step means. */
  gist: string;
}

export const brain = {
  chip: 'In development',
  label: 'The hospital brain',
  title: ['Autonomy is earned,', 'one job at a time.'],
  support: 'Every job starts at watch. A named person turns it up, on proof.',
  dial: {
    ariaLabel: 'Autonomy dial: how much one job may do on its own',
    hint: 'Drag, tap or use the arrow keys.',
    down: 'Down a step',
    up: 'Up a step',
    ofWord: 'of',
    signatureLine: 'Signature line',
    levels: [
      { name: 'Watch', gist: 'Looks and learns. Changes nothing.' },
      { name: 'Suggest', gist: 'Points it out. You decide.' },
      { name: 'Prepare', gist: 'Does the work, then waits for you.' },
      { name: 'Act and tell', gist: 'Acts, and tells you at once.' },
      { name: 'Act quietly', gist: 'Acts, and keeps a record.' },
      { name: 'Own it', gist: 'Runs the job. Reports every week.' },
    ] satisfies DialLevel[],
    limitsTitle: 'Three limits never move',
    limits: [
      'A doctor signs every medical decision.',
      'Nothing leaves the hospital without a person.',
      'Money always needs a signature.',
    ],
    off: {
      label: 'Off switch',
      on: 'Brain on',
      offState: 'Brain off',
      title: 'The hospital keeps running.',
      body: 'The work goes back to people.',
    },
  },
};

// ─── 8. Proof (#proof) ───────────────────────────────────────────────

export interface ProofNumber {
  value: string;
  /** Smaller word set after the value, inside the same figure. */
  unit?: string;
  line: string;
}

export const proof = {
  title: ['Not a pilot.', 'A hospital network, running today.'],
  numbers: [
    { value: '25', line: 'hospitals in one network, run on MediMind' },
    { value: '1M+', line: 'patients' },
    { value: '3M+', line: 'encounters on MediMind' },
    { value: '60', unit: 'days', line: 'to go live' },
  ] satisfies ProofNumber[],
  recognitionTitle: 'Backed and recognised',
  recognitions: [
    { name: '500 Global' },
    { name: 'GITA grant' },
    {
      name: 'Innovative Startup status',
      href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464',
      linkLabel: 'Innovative Startup status, public registry',
    },
  ] as { name: string; href?: string; linkLabel?: string }[],
};

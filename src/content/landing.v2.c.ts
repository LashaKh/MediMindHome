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

/** A real screen: the light capture (always present) and its manifest id (its night twin is `<id>-dark`). */
export interface Screen {
  id: string;
  image: ResponsiveImage;
}

/** A thin callout on the hero screen: a point (fractions of the front screen's crop) and a few words. */
export interface Callout {
  x: number;
  y: number;
  label: string;
}

/**
 * A supporting scene: a name, one short tag, and a window onto the screen
 * that bleeds off the stage's right and bottom edge. `crop` is the part of the
 * screen the window holds; `scale` is the window's width as a share of the
 * stage (above 1 it runs off the edge, which is the point). `front` is an
 * optional second screen lifted across the window's foot.
 */
export interface Scene {
  id: string;
  name: string;
  tag: string;
  screen: Screen;
  crop: Crop;
  scale: number;
  front?: { screen: Screen; crop: Crop; width: number };
}

const patientChart = shot(
  'patient-chart',
  790,
  'MediMind clinical dashboard for one patient: a fall-risk alert and a drug-interaction alert above active problems, medications with a high-alert flag, vitals and lab results. Demo data.'
);

// ─── 6. Product (#product) ───────────────────────────────────────────

export const product = {
  title: ['Everything a hospital runs on.', 'Natively included.'],
  support: 'One record and one codebase, from the bedside to the balance sheet.',
  demoData: 'Real screens, demo data.',

  /** The hero scene: the clinical record in front, every hospital area behind it. */
  hero: {
    name: 'Clinical record',
    tag: 'Every signal for one patient, on one screen.',
    front: { id: 'patient-chart', image: patientChart } satisfies Screen,
    frontLabel: 'Clinical record',
    back: {
      id: 'os-modules-full',
      image: shot(
        'os-modules-full',
        1050,
        'MediMind dashboard with every hospital area in one sidebar: staff, clinic operations, clinical settings, nomenclature, financial, warehouse, command center, analytics and system configuration. Demo data.'
      ),
    } satisfies Screen,
    backLabel: 'Every hospital area',
    /** Interaction banner: a ring where the text ends, the words in the banner's empty run. */
    callout: { x: 0.257, y: 0.41, label: 'Drug interaction flagged' } satisfies Callout,
    /** The lens: the warfarin line with its high-alert mark, lifted and enlarged. */
    lens: { crop: { x: 0.264, y: 0.566, w: 0.236, h: 0.118 } satisfies Crop, label: 'High-alert medicine marked' },
  },

  scenes: [
    {
      id: 'stock',
      name: 'Pharmacy and stock',
      tag: 'Low stock flagged before the shelf is empty.',
      screen: {
        id: 'warehouse-stock',
        image: shot(
          'warehouse-stock',
          1018,
          'MediMind warehouse stock list filtered to low stock: item codes, quantities with low counts in red, prices, expiry dates and batch series. Demo data.'
        ),
      },
      crop: { x: 0.195, y: 0.125, w: 0.805, h: 0.875 },
      scale: 1.42,
    },
    {
      id: 'lab',
      name: 'Laboratory',
      tag: 'Every order and its status, one list.',
      screen: {
        id: 'lab-orders',
        image: shot(
          'lab-orders',
          654,
          'MediMind order history for one visit: three laboratory orders and one imaging order, each with its status. Demo data.'
        ),
      },
      crop: { x: 0, y: 0.105, w: 0.5, h: 0.895 },
      scale: 1.3,
    },
    {
      id: 'billing',
      name: 'Billing',
      tag: 'Charges straight from the record.',
      screen: {
        id: 'billing-funding',
        image: shot(
          'billing-funding',
          594,
          'MediMind funding request screen: choose a state or municipal co-funding request, then the financier. Demo data.'
        ),
      },
      crop: { x: 0, y: 0, w: 0.56, h: 1 },
      scale: 1.16,
      front: {
        screen: {
          id: 'billing-revenue',
          image: shot(
            'billing-revenue',
            188,
            'MediMind revenue report for one month: charges, amounts invoiced to payers, collections and the outstanding balance, in lari. Demo data.'
          ),
        },
        crop: { x: 0, y: 0, w: 0.5, h: 1 },
        width: 0.94,
      },
    },
  ] satisfies Scene[],
};

// ─── 7. Brain (#brain) ───────────────────────────────────────────────

export interface DialLevel {
  name: string;
  /** One short line: what this step means. */
  gist: string;
}

export interface BrainScreen {
  /** Manifest id; its night twin is `<id>-dark`. */
  id: string;
  name: string;
  tag: string;
}

export const brain = {
  chip: 'In development',
  label: 'The hospital brain',
  title: ['Autonomy is earned,', 'one job at a time.'],
  support: 'Every job starts at watch. A named person turns it up, on proof.',
  /**
   * Real screens of the hospital brain (manifest ids `brain-*`, night twins
   * `brain-*-dark`). A slot shows its screen as soon as the id exists in
   * public/landing/manifest.json; until then it stays a named, empty frame.
   * The first is the large one.
   */
  screens: [
    { id: 'brain-control-center', name: 'Control Center', tag: 'Every job, its level, its owner.' },
    { id: 'brain-inbox', name: 'Staff inbox', tag: 'Prepared cards. A person signs.' },
    { id: 'brain-morning-brief', name: 'Morning brief', tag: 'The night, read before rounds.' },
    { id: 'brain-workers', name: 'Workers', tag: 'Each job earns its step.' },
    { id: 'brain-proof', name: 'Proof', tag: 'The record behind every step up.' },
  ] satisfies BrainScreen[],
  screensNote: 'Screens from the harness in development. Demo data.',
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
  /** Optional literal count drawn in fine marks under the figure. */
  marks?: { kind: 'dots' | 'ticks'; count: number };
}

export const proof = {
  title: ['Not a pilot.', 'A hospital network, running today.'],
  numbers: [
    { value: '25', line: 'hospitals in one network, run on MediMind', marks: { kind: 'dots', count: 25 } },
    { value: '1M+', line: 'patients' },
    { value: '3M+', line: 'encounters on MediMind' },
    { value: '60', unit: 'days', line: 'to go live', marks: { kind: 'ticks', count: 60 } },
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

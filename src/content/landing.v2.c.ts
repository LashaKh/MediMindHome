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
  /** Run the leader up to this height (fraction of the capture) and set the words there, instead of to the right. */
  upTo?: number;
}

/** A screenshot with its own file widths (the PACS and planning captures are not 800/1400/2000). */
function shotSet(id: string, widths: number[], width: number, height: number, fallbackWidth: number, alt: string): ResponsiveImage {
  const set = (ext: string) => widths.map((w) => `/landing/${id}-${w}.${ext} ${w}w`).join(', ');
  return { alt, width, height, fallback: `/landing/${id}-${fallbackWidth}.jpg`, avif: set('avif'), webp: set('webp') };
}

/**
 * An operations tile: a name, one short tag, and a window onto a screen,
 * drawn a little wider than the tile so it runs off the right edge. `frame`
 * is the window's shape (width / height); the crop is worked out from the
 * capture's real size in the manifest, so a re-shot screen still fits.
 */
export interface OpsTile {
  id: string;
  name: string;
  tag: string;
  screen: Screen;
  frame: number;
  /** Where the crop sits inside a capture of a different shape: 0 = left / top, 1 = right / bottom. */
  focus?: { x: number; y: number };
}

// ─── 6. Product (#product) ───────────────────────────────────────────

export const product = {
  title: ['Everything a hospital runs on.', 'Natively included.'],
  support: 'One record and one codebase, from the bedside to the balance sheet.',
  demoData: 'Real screens, demo data.',

  /**
   * The record scene: one patient's overview in front, every hospital area
   * behind it. Callouts are points on the overview (fractions of the capture).
   */
  hero: {
    name: 'Patient overview',
    tag: 'The visit, allergies and vital signs on one screen.',
    front: {
      id: 'patient-overview',
      image: shot(
        'patient-overview',
        836,
        'MediMind patient overview: visit summary with length of stay, department and physician, allergy status, reason for visit and the latest vital signs with two flagged high. Demo data.'
      ),
    } satisfies Screen,
    frontLabel: 'Patient overview',
    back: {
      id: 'os-modules-full',
      image: shot(
        'os-modules-full',
        1050,
        'MediMind dashboard with every hospital area in one sidebar: staff, clinic operations, clinical settings, nomenclature, financial, warehouse, command center, analytics and system configuration. Demo data.'
      ),
    } satisfies Screen,
    backLabel: 'Every hospital area',
    /** A ring where the allergy line ends (words in the banner's empty run); a ring by the high heart rate, words in the empty header above. */
    callouts: [
      { x: 0.256, y: 0.343, label: 'Allergy status, up front' },
      { x: 0.213, y: 0.872, label: 'Abnormal vitals flagged', upTo: 0.745 },
    ] satisfies Callout[],
  },

  /**
   * The imaging stage: a dark display in both themes. The 3D render of one
   * CT scan crossfades between vessels and bone; heart-valve planning stands
   * beside it with two thin callouts. Points are fractions of each screen.
   */
  imaging: {
    title: 'Imaging and planning',
    line: 'CT in 3D and heart-valve planning, inside the same system as the record.',
    modesLabel: '3D view',
    modes: [
      {
        id: 'vessel',
        label: 'Vessel',
        image: shotSet(
          'pacs-3d-vessel',
          [500, 1000],
          1000,
          1430,
          1000,
          'MediMind imaging: a CT scan of the chest and abdomen rendered in 3D, vessels in warm orange over the skeleton. Demo data.'
        ),
      },
      {
        id: 'bone',
        label: 'Bone',
        image: shotSet(
          'pacs-3d-bone',
          [500, 1000],
          1000,
          1430,
          1000,
          'The same CT scan rendered in 3D as bone, in ivory. Demo data.'
        ),
      },
    ],
    root: {
      id: 'tavi-root',
      image: shotSet(
        'tavi-root',
        [800, 1400, 1920],
        1920,
        912,
        1400,
        'MediMind heart-valve planning: the aortic root outlined in blue on coronal, sagittal and axial CT views, with the segmentation tools beside them. Demo data.'
      ),
    } satisfies Screen,
    rootLabel: 'Valve planning',
    valve: {
      id: 'tavi-valve',
      image: shotSet(
        'tavi-valve',
        [800, 1400, 1920],
        1920,
        912,
        1400,
        'MediMind heart-valve planning: the valve ring measured on the axial view, with the workflow progress panel. Demo data.'
      ),
    } satisfies Screen,
    valveLabel: 'Annulus',
    rootCallout: { x: 0.178, y: 0.215, label: 'Aortic root, outlined' } satisfies Callout,
    valveCallout: { x: 0.404, y: 0.262, label: 'Valve ring, measured' } satisfies Callout,
  },

  /**
   * The bridge into the brain: the AI proposing next steps for one patient,
   * a doctor accepting or dismissing each. Shown when `brain-patient-recommendations`
   * exists in the manifest (night twin `-dark`). `pin` marks the Accept control
   * (fractions of the capture), set once the capture lands.
   */
  bridge: {
    id: 'brain-patient-recommendations',
    chip: 'In development',
    name: 'Proactive care',
    tag: 'The system proposes the next step. A doctor accepts or dismisses it.',
    label: 'Recommendations',
    pin: null as { x: number; y: number } | null,
    pinLabel: 'A doctor decides',
  },

  tiles: [
    {
      id: 'beds',
      name: 'Beds',
      tag: 'Every bed and its state, live.',
      screen: {
        id: 'bed-board-grid',
        image: shot(
          'bed-board-grid',
          1442,
          'MediMind bed board for a cardiology ward: rooms with bed cards coloured by state (occupied, cleaning required, available) and ward occupancy. Demo data.'
        ),
      },
      frame: 1.8,
    },
    {
      id: 'medication',
      name: 'Medication',
      tag: 'Every dose due on the ward, overdue first.',
      screen: {
        id: 'medication-timeline',
        image: shot(
          'medication-timeline',
          1723,
          'MediMind ward medication board: every outstanding dose for the day across the ward, grouped as overdue and due now, with drug, dose, route and time. Demo data.'
        ),
      },
      frame: 1.8,
      /** Start below the ward header the bed board already shows, on the overdue doses. */
      focus: { x: 0, y: 0.25 },
    },
  ] satisfies OpsTile[],
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
  /** Window shape, width / height. */
  frame: number;
  /** CSS object-position: what stays in view when the frame crops the capture. */
  focus: string;
  /**
   * Optional thin callout: a point inside the frame (fractions), a few words,
   * which way the leader runs, and amber when it marks a person's decision.
   */
  pin?: { x: number; y: number; label: string; dir: 'right' | 'down'; human?: boolean };
}

export const brain = {
  chip: 'In development',
  label: 'The hospital brain',
  title: ['Autonomy is earned,', 'one job at a time.'],
  support: 'Every job starts at watch. A named person turns it up, on proof.',
  /**
   * Real screens of the hospital brain (manifest ids `brain-*`, night twins
   * `brain-*-dark`), read from public/landing/manifest.json at runtime. A
   * screen shows as soon as its id exists; until then it is a named empty
   * frame in development and left out of the built page.
   * `frame` is the window's shape (width / height); `focus` is the part of
   * the capture that stays in view when the frame is narrower than it.
   * `scene`: the Control Center with workers and money laid over it.
   * `more`: smaller stages beneath (one alone becomes a wide band).
   * The staff inbox and a separate morning brief were dropped at capture
   * (the brief already sits inside the Control Center); add an entry here
   * if a clean capture arrives later.
   */
  screens: {
    scene: [
      { id: 'brain-control-center', name: 'Control Center', tag: 'Running, with one stop switch.', frame: 2000 / 934, focus: 'left top',
        pin: { x: 0.978, y: 0.073, label: 'One switch stops it', dir: 'right' } },
      { id: 'brain-workers', name: 'Workers', tag: 'Each job has a level and a cap.', frame: 2000 / 900, focus: 'left top',
        pin: { x: 0.699, y: 0.426, label: 'Capped by a person', dir: 'down', human: true } },
      { id: 'brain-money', name: 'Money', tag: 'Missing charges and claim risks, found first.', frame: 2000 / 340, focus: 'left top' },
    ],
    more: [
      { id: 'brain-proof', name: 'Proof', tag: 'Every job, the worker that covers it, its level.', frame: 16 / 10, focus: 'left top' },
    ],
  } satisfies { scene: BrainScreen[]; more: BrainScreen[] },
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

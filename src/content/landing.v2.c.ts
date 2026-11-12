import type { ResponsiveImage } from './types';

/**
 * Lane C words and image ids (direction v2, 09-DIRECTION-V2.md rows 6 to 8):
 *   #product  what runs today
 *   #brain    the proactive hospital, in development, with the autonomy dial
 *   #proof    the numbers and the recognitions
 *
 * Truth lines: laboratory and imaging are the only areas "in daily use", and
 * only at one hospital. The brain is never described as live. A person signs
 * every medical decision. The customer stays unnamed.
 */

// ─── Images ──────────────────────────────────────────────────────────

/**
 * Screenshot in public/landing/: <id>-800/-1400/-2000 in AVIF and WebP plus a
 * 1400 JPEG. `height` is the height of the 2000px file (manifest.json).
 * `sizes` is filled in by the component, which knows how far it zooms in.
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

/** A thin callout on a screenshot. `x`/`y` are fractions of the whole screenshot. */
export interface Callout {
  x: number;
  y: number;
  label: string;
}

export type AreaStatus = 'daily' | 'beside';

interface AreaBase {
  id: string;
  name: string;
  status: AreaStatus;
  line: string;
}

/** An area shown with a real product screen: the whole screen behind, the telling detail in front. */
export interface ScreenArea extends AreaBase {
  kind: 'screen';
  /** The manifest id, kept for the handoff note. */
  imageId: string;
  image: ResponsiveImage;
  /** The detail drawn large in front. */
  focus: Crop;
  callouts: Callout[];
  caption: string;
  /**
   * A second real screen laid behind a very wide strip (the strip is the
   * front, its callouts are numbered, the key sits under the plate).
   */
  backdrop?: { imageId: string; image: ResponsiveImage };
}

/** An area with no honest screen yet: a labelled diagram of how the work travels, never a drawn screen. */
export interface FlowArea extends AreaBase {
  kind: 'flow';
  steps: { title: string; detail: string }[];
  caption: string;
}

export type ProductArea = ScreenArea | FlowArea;

// ─── 6. Product (#product) ───────────────────────────────────────────

export const product = {
  title: ['Everything a hospital runs on.', 'Natively included.'],
  support:
    'Six areas on one record and one codebase. What one department enters, every other department already knows.',
  status: {
    daily: 'In daily use',
    dailyLong: "In daily use at a 25-hospital network's central hospital",
    beside: 'Built, running beside the current system',
    besideLong: "Built, and running beside that hospital's current system",
  },
  navLabel: 'Product areas',
  demoData: 'Demo data',
  areas: [
    {
      kind: 'screen',
      id: 'record',
      name: 'Clinical record',
      status: 'beside',
      line: 'One chart from admission to discharge. Alerts, problems, medicines, vitals and results on a single screen.',
      imageId: 'patient-chart',
      image: shot(
        'patient-chart',
        790,
        'MediMind clinical dashboard for one patient: a fall-risk alert and a drug-interaction alert above active problems with ICD-10 codes, medications with a high-alert flag, vitals and lab results. Demo data.'
      ),
      focus: { x: 0.012, y: 0.285, w: 0.49, h: 0.47 },
      callouts: [
        { x: 0.034, y: 0.333, label: 'Safety alerts first' },
        { x: 0.034, y: 0.41, label: 'Drug interaction caught' },
        { x: 0.457, y: 0.604, label: 'High-alert medicine' },
      ],
      caption: 'Clinical dashboard for one patient',
    },
    {
      kind: 'screen',
      id: 'lab',
      name: 'Laboratory',
      status: 'daily',
      line: "Analysers send results straight into the patient's record. Every order shows where it stands.",
      imageId: 'lab-orders',
      image: shot(
        'lab-orders',
        654,
        'MediMind order history for one visit: three laboratory orders and one imaging order, each marked ordered and pending. Demo data.'
      ),
      focus: { x: 0.008, y: 0.3, w: 0.41, h: 0.69 },
      callouts: [
        { x: 0.031, y: 0.347, label: 'Lab orders for this visit' },
        { x: 0.07, y: 0.476, label: 'Each order shows its status' },
        { x: 0.031, y: 0.82, label: 'Imaging on the same list' },
      ],
      caption: "Order history for one patient's visit",
    },
    {
      kind: 'flow',
      id: 'imaging',
      name: 'Imaging',
      status: 'daily',
      line: "From the scanner to the doctor's screen, inside the same record. Studies and reports arrive where the doctor already works.",
      steps: [
        { title: 'Scanner', detail: 'The study is taken' },
        { title: 'Archive', detail: 'Stored once, kept whole' },
        { title: 'Patient record', detail: 'Matched to the right patient' },
        { title: 'Viewer and report', detail: "Read and reported on the doctor's screen" },
      ],
      caption: 'How a study travels. Diagram.',
    },
    {
      kind: 'screen',
      id: 'stock',
      name: 'Pharmacy and stock',
      status: 'beside',
      line: 'Every item followed from the supplier to the patient and the bill. Batches, expiry dates and transfers included.',
      imageId: 'warehouse-stock',
      image: shot(
        'warehouse-stock',
        1018,
        'MediMind warehouse stock list filtered to low stock: item codes, quantities with low counts in red, prices, units, expiry dates with days remaining and batch series. Demo data.'
      ),
      focus: { x: 0.198, y: 0.19, w: 0.665, h: 0.81 },
      callouts: [
        { x: 0.691, y: 0.206, label: 'Filtered to low stock' },
        { x: 0.586, y: 0.606, label: 'Low counts in red' },
        { x: 0.845, y: 0.759, label: 'Expiry, days left' },
      ],
      caption: 'Warehouse stock, filtered to low stock',
    },
    {
      kind: 'screen',
      id: 'billing',
      name: 'Billing',
      status: 'beside',
      line: 'Charges come from the record as care happens, so the bill matches what was done. State and insurer paperwork starts from the same facts.',
      imageId: 'billing-revenue',
      image: shot(
        'billing-revenue',
        188,
        'MediMind revenue report for one month: charges, amounts invoiced to payers, collections received and the outstanding balance, each in lari. Demo data.'
      ),
      focus: { x: 0, y: 0, w: 1, h: 1 },
      callouts: [
        { x: 0.226, y: 0.27, label: 'Charges, straight from the record' },
        { x: 0.476, y: 0.27, label: 'Invoiced, split by payer' },
        { x: 0.726, y: 0.27, label: 'Payments matched' },
        { x: 0.976, y: 0.27, label: 'What is still owed' },
      ],
      caption: 'Revenue for one month, in front of the state and municipal funding requests',
      backdrop: {
        imageId: 'billing-funding',
        image: shot(
          'billing-funding',
          594,
          'MediMind funding request screen: choose a state (SSA) or municipal co-funding request, then the financier. Demo data.'
        ),
      },
    },
    {
      kind: 'screen',
      id: 'management',
      name: 'Staff and management',
      status: 'beside',
      line: 'Staff, rosters, payroll and the figures management reads. Every area of the hospital, one sidebar away.',
      imageId: 'os-modules-full',
      image: shot(
        'os-modules-full',
        1050,
        'MediMind dashboard with every hospital area in one sidebar (staff, clinic operations, clinical settings, nomenclature, financial, warehouse, command center, analytics, system configuration) and module cards. Demo data.'
      ),
      focus: { x: 0.0, y: 0.19, w: 0.194, h: 0.54 },
      callouts: [
        { x: 0.026, y: 0.252, label: 'Staff and roles' },
        { x: 0.026, y: 0.473, label: 'Finance' },
        { x: 0.026, y: 0.529, label: 'Warehouse' },
        { x: 0.026, y: 0.585, label: 'Command center' },
      ],
      caption: 'Management view: every area in one sidebar',
    },
  ] satisfies ProductArea[],
};

// ─── 7. Brain (#brain) ───────────────────────────────────────────────

export interface DialLevel {
  name: string;
  /** One short line: what this step means. */
  gist: string;
  job: string;
  system: string;
  person: string;
}

export const brain = {
  chip: 'In development',
  label: 'The hospital brain',
  title: ['Autonomy is earned,', 'one job at a time.'],
  support:
    'We are building the proactive hospital: AI workers that prepare the work before anyone asks, inside the operating system the hospital already runs on. People decide how far each one may go.',

  today: {
    title: 'Today, AI drafts. A person signs.',
    items: [
      {
        title: 'The scribe',
        body: 'Listens to the consultation, in Georgian or English, and drafts the clinical note and the ministry form.',
      },
      {
        title: 'The chat',
        body: "Answers questions from the patient's own record and the hospital's protocols.",
      },
      {
        title: 'The signature',
        body: 'Nothing it drafts enters the record until a doctor reads it and signs.',
      },
    ],
    status: 'Built and working in MediMind today. At the central hospital it runs beside the current system.',
    imageId: 'ai-chat-answer',
    image: shot(
      'ai-chat-answer',
      398,
      'MediMind AI chat answering a question about a demo patient: an acute diagnosis shown in Georgian and English, followed by a list of chronic conditions. Demo data.'
    ),
    focus: { x: 0.036, y: 0.0, w: 0.635, h: 0.83 } satisfies Crop,
    caption: "AI chat. The clinician asked for a brief summary of the patient's condition. Demo data.",
  },

  inbox: {
    title: 'Next: AI workers in the inbox your staff already use.',
    body: 'Each worker reads the record and prepares one kind of work. Approve, edit or reject it in one tap.',
    header: 'Prepared for you',
    tag: 'Illustration',
    items: [
      {
        worker: 'Discharge worker',
        title: 'Bed 12 goes home today',
        body: 'The discharge summary and the ministry form are drafted from the record.',
        release: 'The doctor signs',
      },
      {
        worker: 'Billing worker',
        title: 'A service was given but not billed',
        body: 'The missing charge is drafted against the visit, with the record that proves it.',
        release: 'Billing staff release it',
      },
      {
        worker: 'Ministry worker',
        title: 'Records ready before the deadline',
        body: 'Every field is filled from the record and checked against the form.',
        release: 'A named person sends them',
      },
    ],
  },

  dial: {
    title: 'Every job has a dial.',
    body: 'Every job starts at watch. Only a named person at the hospital turns a dial up, and only on proof from the step below.',
    ariaLabel: 'Autonomy dial: how much one job may do on its own',
    hint: 'Drag the dial, tap a step, or use the arrow keys.',
    down: 'Down a step',
    up: 'Up a step',
    systemLabel: 'The system',
    personLabel: 'A person',
    ofWord: 'of',
    signatureLine: 'The signature line',
    signatureNote:
      'Past the signature line: only work with no medical decision, nothing leaving the hospital and no money.',
    belowNote: 'Below the signature line, nothing happens until a person says so.',
    levels: [
      {
        name: 'Watch',
        gist: 'Looks, learns, changes nothing.',
        job: 'Discharge paperwork',
        system: 'Follows every discharge and records what was missing and how late it was finished.',
        person: 'Works exactly as today, and sees the evidence build.',
      },
      {
        name: 'Suggest',
        gist: 'Points, and leaves it to you.',
        job: 'Discharge paperwork',
        system: "Notes in the doctor's inbox that bed 12 goes home tomorrow and the summary is not started.",
        person: 'Decides whether, when and how.',
      },
      {
        name: 'Prepare',
        gist: 'Does the work, then waits.',
        job: 'Discharge paperwork',
        system: 'Drafts the discharge summary and the ministry form from the record before the patient leaves.',
        person: 'The doctor reads, edits and signs.',
      },
      {
        name: 'Act and tell',
        gist: 'Acts, and says so at once.',
        job: 'Bed turnover',
        system: 'Cleaning is logged for bed 12, so it marks the bed ready on the bed board and tells the ward.',
        person: 'Sees each action as it happens and can undo it in one tap.',
      },
      {
        name: 'Act quietly',
        gist: 'Acts, and keeps a record.',
        job: 'Bed turnover',
        system: 'Keeps the bed board current through the night and writes every change to the log.',
        person: 'Reads the log when they choose. Anything unusual still comes to a person.',
      },
      {
        name: 'Own it',
        gist: 'Runs the job, reports on it.',
        job: 'Bed turnover',
        system: 'Runs the bed board from end to end and reports on it every week.',
        person: 'The named owner answers for the job and can turn it down at any moment.',
      },
    ] satisfies DialLevel[],
    limitsTitle: 'Three limits that never move',
    fixed: 'Fixed',
    limits: [
      'A doctor signs every medical decision.',
      'Nothing leaves the hospital without a person.',
      'Money always needs a signature.',
    ],
    off: {
      label: 'Off switch',
      on: 'Brain on',
      offState: 'Brain off',
      title: 'The hospital keeps running without it.',
      body: 'The record, the laboratory, imaging, billing and every inbox work as before. The work goes back to people.',
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
  title: ['Proven inside', 'a working hospital.'],
  numbers: [
    { value: '25', line: 'hospitals signed in a single network contract.' },
    { value: '1.1M+', line: 'patient records migrated. No gaps. No duplicates.' },
    { value: '15+', line: 'analyser lines live in the laboratory. Connected within three weeks.' },
    { value: '15', unit: 'months', line: 'from the first idea to a signed hospital network.' },
  ] satisfies ProofNumber[],
  recognitionTitle: 'Backed and recognised',
  recognitions: [
    { name: '500 Global', line: 'Backed by the global venture capital firm.' },
    { name: 'GITA', line: "A grant of 150,000 GEL from Georgia's Innovation and Technology Agency." },
    {
      name: 'Innovative Startup',
      line: 'Status awarded by the Government of Georgia.',
      href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464',
      linkLabel: 'See the public registry',
    },
  ] as { name: string; line: string; href?: string; linkLabel?: string }[],
};

import type { ResponsiveImage } from './types';

/**
 * Copy and images for the middle of the landing page (the product story):
 * What changes (#system), Two examples (#examples), Objection and plan
 * (#switch), AI today (#ai) and the proactive-hospital vision (#vision).
 *
 * Words are the approved copy deck, word for word
 * (marketing/landing-level-up-2026-11-12/06-copy-deck.md, Part 2 §4–7 and Part 9).
 * Image ids come from public/landing/manifest.json; the choice per place
 * follows status/orchestrator-rulings.md.
 */

// ─── Images ──────────────────────────────────────────────────────────

/**
 * Builds a ResponsiveImage for a screenshot in public/landing/, which ships
 * every screenshot as <id>-800/-1400/-2000 in AVIF and WebP plus a 1400 JPEG.
 * `height` is the height of the 2000px file (from manifest.json).
 */
function landingShot(
  id: string,
  height: number,
  alt: string,
  sizes = '(min-width: 1152px) 1088px, calc(100vw - 32px)'
): ResponsiveImage {
  const set = (ext: string) =>
    [800, 1400, 2000].map((w) => `/landing/${id}-${w}.${ext} ${w}w`).join(', ');
  return {
    alt,
    width: 2000,
    height,
    fallback: `/landing/${id}-1400.jpg`,
    avif: set('avif'),
    webp: set('webp'),
    sizes,
  };
}

// ─── 1. What changes (#system) ───────────────────────────────────────

export interface CapabilityArea {
  name: string;
  line: string;
  /** Shown as the "In daily use" chip. */
  inDailyUse?: boolean;
}

export const whatChanges = {
  eyebrow: 'What changes',
  title: 'One operating system for',
  accent: 'your whole hospital.',
  support:
    'Every department works from the same record, so a fact entered once reaches the doctor, the bill and the warehouse.',
  dailyUseChip: 'In daily use',
  areas: [
    { name: 'Clinical record', line: 'One record for each patient, from admission to discharge.' },
    { name: 'Laboratory', line: "Analyser results go straight into the patient's record.", inDailyUse: true },
    {
      name: 'Imaging and PACS',
      line: "Scans and reports reach the patient's record and the doctor's screen.",
      inDailyUse: true,
    },
    { name: 'Billing and finance', line: 'Invoices built from the record and matched to bank receipts.' },
    { name: 'Pharmacy and stock', line: 'Every item followed from supplier receipt to the patient and the bill.' },
    { name: 'HR and management', line: 'Staff, rosters, payroll and the figures management reads.' },
  ] satisfies CapabilityArea[],
  statusFootnote:
    "In daily use today: laboratory and imaging at a 25-hospital network's central hospital. The other areas are built and running beside that hospital's current system.",
  standardLine:
    'One of the first hospital operating systems built ground-up on FHIR R4, the international standard for health data. Your data is never locked inside MediMind.',
  /** Image id `os-modules` (ruling: use `os-modules-full` if it appears in the manifest). */
  image: landingShot(
    'os-modules',
    1004,
    "MediMind management dashboard listing the hospital's areas: staff, clinic operations, clinical settings, item lists, finance, warehouse, command center, analytics and system settings. Demo data."
  ),
  imageLabel: 'Management',
  caption: 'MediMind management view · demo data',
};

// ─── 2. Two examples (#examples) ─────────────────────────────────────

export interface StoryExample {
  label: string;
  title: string;
  lines: string[];
  outcome: string;
  /** Omitted when no honest real screen exists (ruling: never draw a fake screen). */
  image?: ResponsiveImage;
  imageLabel?: string;
  caption?: string;
}

export const examples = {
  eyebrow: 'Two examples',
  title: 'What it means for',
  accent: 'your hospital.',
  support: 'Two examples of many, each answering a problem above.',
  items: [
    {
      label: 'Answers problem 1: fines and returned claims',
      title: 'Billing that holds up to review',
      lines: [
        'Bank receipts matched to invoices automatically.',
        'Corrections recorded, with a full trace.',
        'Indirect costs allocated by rule.',
      ],
      outcome: 'Every invoice tied to a complete record before it goes out.',
      /**
       * Image id `billing-funding`: `billing-claims` is not in the manifest,
       * so the ruling's fallback applies, captioned for what it really shows.
       */
      image: landingShot(
        'billing-funding',
        594,
        'MediMind funding request screen: choose a state (SSA) or municipal co-funding request, then the financier. Demo data.'
      ),
      imageLabel: 'Funding requests',
      caption: 'State and municipal funding requests · demo data',
    },
    {
      label: 'Answers problem 2: management without reliable numbers',
      title: 'A warehouse where the numbers match',
      lines: [
        'RS receipts flow in automatically.',
        'Supplier lines matched to your own item list.',
        'Batches, expiry and transfers tracked.',
      ],
      outcome: 'Stock figures that stand up to audit, linked to the patient and the bill.',
      // No image: `warehouse-stock` is not in the manifest (ruling: text-only block).
    },
  ] satisfies StoryExample[],
  bridge:
    'The third problem, repeated typing, is answered by the single record: each fact is entered once and used everywhere.',
  statusFootnote: "Billing and warehouse are built and running beside the central hospital's current system.",
};

// ─── 3. Objection and plan (#switch) ─────────────────────────────────

export interface PlanStep {
  label: string;
  title: string;
  body: string;
  success: string;
}

export interface SwitchPoint {
  title: string;
  body: string;
}

export const switchPlan = {
  eyebrow: 'The obvious objection',
  /** Rendered inside curly quotes, with the accent phrase before the full stop. */
  titleBefore: 'Yes, but replacing everything is',
  accent: 'risky and slow',
  support: 'Keep your current system. MediMind is built beside it. You see the difference on your own numbers.',
  planTitle: 'From zero to live in 90 days.',
  steps: [
    {
      label: 'Days 0 to 30',
      title: 'Evaluation and shadow build',
      body: "Your hospital is built in MediMind beside your current system: item lists, price lists, roles and pathways. A sample of your data is moved and checked. Nobody's day changes yet.",
      success: 'Scope and measures agreed on your numbers. Your go or no-go, at no cost.',
    },
    {
      label: 'Days 31 to 60',
      title: 'Hands on',
      body: 'Laboratory, imaging and billing switched on. Staff trained by role. The first areas go live while the rest keep running alongside.',
      success: "Your first department's cases go out from MediMind.",
    },
    {
      label: 'Days 61 to 90',
      title: 'Full switch',
      body: 'The remaining areas move over. A way back is agreed and on standby. Your team settles into the new routine.',
      success: 'Live on MediMind, measured against your starting numbers.',
    },
  ] satisfies PlanStep[],
  successPrefix: 'Success:',
  decideLine: 'Day 30: you decide. Day 90: you are live.',
  measuresLine:
    'You choose the measures on day 1, from your own numbers: for example returned claims, stock that does not match, or bills sent late.',
  datesLine: 'The dates hold from the day you start.',
  switchTitle: 'Switch without stopping your hospital.',
  switchPoints: [
    {
      title: 'Your current system keeps running.',
      body: 'It stays your main system until each area moves, then waits on standby as a backup.',
    },
    {
      title: 'Each area moves on its own date.',
      body: 'Every move has a written way back, and nothing moves until the people who use it agree.',
    },
    { title: 'Your data stays yours.', body: 'FHIR R4 and full export at any time. No vendor lock-in.' },
  ] satisfies SwitchPoint[],
  commitmentLine: 'No commitment before day 30.',
  /** The big figure shown beside the proof line (decorative; the line carries the words). */
  proofFigure: '1.1M+',
  proofUnnamed:
    'Proven at a 25-hospital network: 1.1M+ patient records moved with no gaps and no duplicates, while the laboratory kept working.',
  /** Used only when `showCustomerName` is true. */
  proofNamed:
    'Proven at GeoHospitals: 1.1M+ patient records moved with no gaps and no duplicates, while the laboratory kept working.',
  quote: 'Building and deploying a system of this scale and quality this quickly was previously impossible.',
  quoteAttribution: 'Irakli Giorgadze, CTO, GeoHospitals',
  /** Image ids `customer-logo-dark` (light theme) and `customer-logo-white` (dark theme). */
  logo: {
    alt: 'GeoHospitals',
    width: 378,
    height: 157,
    dark: { webp: '/landing/customer-logo-dark-378.webp', fallback: '/landing/customer-logo-dark-378.png' },
    white: { webp: '/landing/customer-logo-white-378.webp', fallback: '/landing/customer-logo-white-378.png' },
  },
};

// ─── 4. AI today (#ai) ───────────────────────────────────────────────

export interface AiItem {
  title: string;
  body: string;
}

export const aiToday = {
  eyebrow: 'AI today',
  title: 'AI working today.',
  accent: 'Your clinicians decide.',
  support:
    'Think of it as a careful junior colleague: it reads the record and writes a first draft, and nothing it drafts enters the record until a person signs it.',
  items: [
    {
      title: 'Writes the note',
      body: 'MediScribe listens to the consultation, in Georgian or English, and drafts the clinical note. The doctor reviews and signs.',
    },
    {
      title: 'Drafts the ministry form',
      body: 'From the same consultation it prepares a Form 100 draft for the doctor to check.',
    },
    {
      title: 'Answers from the record',
      body: "AI chat answers questions about a patient's record and your hospital's protocols. The clinician decides what to do.",
    },
  ] satisfies AiItem[],
  statusLine:
    'Built and working in MediMind today. At the central hospital these tools still run beside the current system.',
  /** Image id `ai-chat-answer`. The question is cropped out, so the caption says what was asked. */
  image: landingShot(
    'ai-chat-answer',
    398,
    'MediMind AI chat answering a question about a demo patient: an acute diagnosis shown in Georgian and English, followed by a list of chronic conditions. Demo data.',
    // Shown at 140% width below md (empty right third cropped), so ask for a larger file there.
    '(min-width: 1152px) 1088px, (min-width: 768px) calc(100vw - 48px), 140vw'
  ),
  imageLabel: 'AI chat',
  caption: "MediMind AI chat · the clinician asked for a brief summary of the patient's condition · demo data",
};

// ─── 5. Vision (#vision) ─────────────────────────────────────────────

export interface VisionPair {
  reactive: string;
  proactive: string;
}

export interface VisionRule {
  title: string;
  body: string;
}

export const vision = {
  chip: 'In development',
  eyebrow: 'What MediMind is building next',
  title: 'From the reactive hospital to the',
  accent: 'proactive hospital.',
  support: "The next step, built on the same operating system. It is not part of today's offer.",
  tableIntro: 'It starts with the paperwork.',
  reactiveHeading: 'The reactive hospital',
  reactiveNote: '(most hospitals today)',
  proactiveHeading: 'The proactive hospital',
  proactiveNote: '(in development)',
  pairs: [
    {
      reactive: 'Software waits to be asked.',
      proactive: 'The system will notice what is missing and prepare it.',
    },
    {
      reactive: 'Discharge forms are filled in after the patient has gone home.',
      proactive: 'Forms will be ready at discharge. The doctor checks and signs.',
    },
    {
      reactive: 'A missed charge is found late, or never.',
      proactive: 'A service given but not billed will be flagged, with the charge drafted. Billing staff release it.',
    },
    {
      reactive: 'Ministry records are chased as the deadline nears.',
      proactive: 'Records will be ready before the deadline. A named person sends them.',
    },
    {
      reactive: 'Safety depends on a tired person remembering at 2 a.m.',
      proactive: 'The person on duty will have the facts in front of them. The decision stays theirs.',
    },
  ] satisfies VisionPair[],
  /** One line of copy; the two sentences are set on their own lines. */
  punchLine: ['One patient walks in.', 'The whole hospital moves.'],
  punchSupport: 'The system prepares. Your doctors decide.',
  rulesTitle: 'The rules are set now.',
  rules: [
    {
      title: 'Same inbox.',
      body: 'AI workers will prepare work in the inbox your staff already use. Approve, edit or reject in one tap.',
    },
    {
      title: 'Starts at watch.',
      body: 'Every job begins at "watch". Only a named person at your hospital can turn it up, on proof, within limits your hospital sets.',
    },
    {
      title: 'Three limits never move.',
      body: 'A doctor signs every medical decision. Nothing leaves the hospital without a person. Money always needs a signature.',
    },
    { title: 'One off switch.', body: 'Your hospital keeps running without it.' },
  ] satisfies VisionRule[],
  /** Shown only when `showPracticeCase` is true (site.ts). */
  practiceCase: {
    label: "Why we build this: a case from our co-founder's practice",
    body: 'Dr. Lasha Khoshtaria is an interventional cardiologist. One night, a patient of his developed pancreatitis after a heart procedure. The warning signs were in the record, buried in a long history. For 14 hours, nobody put them together. The patient spent 20 days in intensive care.',
    closing:
      "No one can say software would have changed that night. MediMind's next step is built so the person on duty has the facts in front of them, and the decision stays theirs.",
  },
};

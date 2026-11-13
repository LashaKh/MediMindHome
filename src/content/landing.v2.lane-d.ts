/**
 * Lane D strings, direction v2 (marketing/landing-level-up-2026-11-12/
 * 09-DIRECTION-V2.md rows 2, 9, 10, 11, 12): traction facts, the 60-day
 * switch, founders, where this goes, the final ask and the footer.
 *
 * Named `.lane-d.ts`, not `.d.ts`: a `.d.ts` file is a TypeScript
 * declaration file and cannot hold runtime strings.
 *
 * Form field labels, errors and result messages stay in landing.trust.ts
 * (ScopingForm reads them there; its logic is unchanged).
 */
import { contactEmail, primaryCta } from './site';
import type { ResponsiveImage } from './types';

/* ---------- 2. Traction (#traction) ---------- */

export const traction = {
  /** Screen-reader heading; the strip itself has no visible title. */
  srTitle: 'MediMind today',
  /** Four facts (round 3, ruling 2). `label` sits above, `figure` is the large line. */
  items: [
    { label: 'Runs a network of', figure: '25 hospitals' },
    { label: 'Patients', figure: '1M+' },
    { label: 'Encounters', figure: '3M+' },
    { label: 'Backed by', figure: '500 Global' },
  ],
};

/* ---------- 9. The switch (#switch) ---------- */

export const switchPlan = {
  title: 'Replace everything without stopping anything.',
  support: 'Live in 60 days, built beside the system you run today.',
  faster: 'We are streamlining integration to bring it under 30.',
  data: 'Your data stays yours: FHIR R4, the international standard. Full export at any time.',
  timelineLabel: 'The 60 days, from first build to full switch',
  lanes: { current: 'Your current system', medimind: 'MediMind' },
  wayBack: 'Kept as a way back',
  ticks: ['Day 0', 'Day 20', 'Day 40', 'Day 60'],
  decide: { day: 'Day 20', text: 'You decide.' },
  live: { day: 'Day 60', text: 'You are live.' },
  /** The three stretches, a few words each, set under the drawing. */
  steps: [
    { range: 'Days 0 to 20', title: 'Built in the shadow.' },
    { range: 'Days 20 to 40', title: 'Departments go live.' },
    { range: 'Days 40 to 60', title: 'The full switch.' },
  ],
};

/* ---------- 10. Founders (#team) ---------- */

/** Image id `team-founders` from public/landing/manifest.json. */
export const foundersPhoto: ResponsiveImage = {
  alt: 'MediMind founders Dr. Lasha Khoshtaria, left, and Irakli Pkhovelishvili, right.',
  width: 900,
  height: 846,
  fallback: '/landing/team-founders-900.jpg',
  avif: '/landing/team-founders-800.avif 800w, /landing/team-founders-900.avif 900w',
  webp: '/landing/team-founders-800.webp 800w, /landing/team-founders-900.webp 900w',
  sizes: '(min-width: 1024px) 620px, 100vw',
};

export const team = {
  title: 'Built from inside a hospital.',
  lead: 'Two founders, backed by a strong team of AI engineers.',
  people: [
    { name: 'Dr. Lasha Khoshtaria', role: 'Practising interventional cardiologist' },
    { name: 'Irakli Pkhovelishvili', role: 'Nine years at Riot Games' },
    { name: 'AI engineering team', role: 'Building the operating system with them' },
  ],
  backersLead: 'Backed by',
  backers: ['500 Global', 'GITA grant', 'Innovative Startup status'],
};

/* ---------- 11. Where this goes (#ambition) ---------- */

export const ambition = {
  title: 'Running a 25-hospital network today. Built for every hospital.',
  horizonLabel: 'How MediMind grows',
  /** Small labels on the three rings of the field (decorative; the steps say the same). */
  ringLabels: ['25 hospitals', 'The region', 'Every hospital'],
  steps: [
    { title: '25 hospitals.', text: 'Running today.' },
    { title: 'The region.', text: 'Expanding across local and regional markets.' },
    { title: 'Every hospital.', text: 'Anywhere one still runs on forty systems.' },
  ],
  beliefLead: 'We believe no patient should be missed at 2 a.m.',
  beliefEnd: 'In any hospital. Anywhere.',
};

/* ---------- 12. The ask (#contact, /request-demo) ---------- */

export const ask = {
  title: 'Run your hospital on MediMind.',
  support: 'Thirty minutes with the founders, online or at your hospital.',
  withLine: 'Dr. Lasha Khoshtaria and Irakli Pkhovelishvili',
  /** At most three very short items (round 3, ruling 3). */
  leave: ['A dated 60-day plan for your hospital.', 'Your three biggest problems, in numbers.', 'No commitment.'],
  formTitle: primaryCta.label,
};

/* ---------- Footer ---------- */

export const footerV2 = {
  /** "One hospital. One operating system." as two sentences so a phone breaks between them. */
  line: ['One hospital.', 'One operating system.'],
  secondLine: 'Built ground-up on FHIR R4.',
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: `mailto:${contactEmail}` },
    { label: 'Innovative Startup status', href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464' },
  ],
  copyright: (year: number) => `© ${year} MediMind.`,
};

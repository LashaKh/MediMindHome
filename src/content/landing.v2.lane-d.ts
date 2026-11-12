/**
 * Lane D strings, direction v2 (marketing/landing-level-up-2026-11-12/
 * 09-DIRECTION-V2.md rows 2, 9, 10, 11, 12): traction line, the 90-day
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
  items: [
    { key: 'Signed', text: 'a 25-hospital network' },
    { key: 'Migrated', text: '1.1M+ patient records' },
    { key: 'In daily use', text: 'laboratory and imaging', live: true },
    { key: 'Backed by', text: '500 Global' },
  ],
};

/* ---------- 9. The switch (#switch) ---------- */

export const switchPlan = {
  title: 'Replace everything without stopping anything.',
  support: 'Live in 90 days, built beside the system you run today. Nothing stops while it happens.',
  timelineLabel: 'The 90 days, from first build to full switch',
  lanes: { current: 'Your current system', medimind: 'MediMind' },
  wayBack: 'Kept as a way back',
  shadow: 'Built in the shadow',
  ticks: ['Day 0', 'Day 30', 'Day 60', 'Day 90'],
  decide: { day: 'Day 30', text: 'You decide.' },
  live: { day: 'Day 90', text: 'You are live.' },
  steps: [
    {
      range: 'Days 0 to 30',
      title: 'Built in the shadow.',
      body: "Your hospital is built in MediMind beside the current system. Nobody's day changes.",
    },
    {
      range: 'Days 31 to 60',
      title: 'First departments go live.',
      body: 'One department at a time, staff trained by role. Everyone else works as before.',
    },
    {
      range: 'Days 61 to 90',
      title: 'The full switch.',
      body: 'Every area moves to MediMind, with a way back for each one.',
    },
  ],
  data: {
    title: 'Your data stays yours.',
    body: 'Stored in FHIR R4, the international standard for health records. Full export, at any time.',
  },
  proof: {
    figure: '1.1M+',
    text: 'patient records moved with zero gaps and zero duplicates, while the laboratory kept working.',
  },
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
  sizes: '(min-width: 1024px) 560px, 100vw',
};

export const team = {
  title: 'Built from inside a hospital.',
  lead: 'MediMind is designed by a cardiologist who still practises.',
  statement: 'The person who feels the problem at 2 a.m. is the one writing the system.',
  people: [
    {
      name: 'Dr. Lasha Khoshtaria',
      role: 'Co-founder and CTO',
      bio: 'Interventional cardiologist, practising in Tbilisi since 2019. Study coordinator on 11+ international device trials.',
    },
    {
      name: 'Irakli Pkhovelishvili',
      role: 'Co-founder, product and strategy',
      bio: 'Nine years at Riot Games in strategy and finance for its Hong Kong and Singapore studios, then led a product team of more than 150 people. Duke MBA.',
    },
  ],
  backersLead: 'Backed by',
  backers: ['500 Global', 'GITA grant', 'Innovative Startup status, Government of Georgia'],
};

/* ---------- 11. Where this goes (#ambition) ---------- */

export const ambition = {
  title: 'Proven first in Georgia. Built for every hospital.',
  support:
    'Hospitals everywhere still run on forty systems that never see the whole patient. MediMind is built to replace them, wherever they are.',
  horizonLabel: 'How MediMind grows',
  /** Small labels on the three rings of the field (decorative; the steps say the same). */
  ringLabels: ['25 hospitals', 'A region', 'Anywhere'],
  steps: [
    { title: 'One network.', text: '25 hospitals, signed.' },
    { title: 'Then a region.', text: 'The same operating system, hospital after hospital.' },
    { title: 'Then anywhere.', text: 'Anywhere a hospital still runs on forty systems.' },
  ],
  beliefLead: 'We believe no patient should be missed at 2 a.m.',
  beliefEnd: 'In any hospital. Anywhere.',
};

/* ---------- 12. The ask (#contact, /request-demo) ---------- */

export const ask = {
  title: 'Run your hospital on MediMind.',
  support: 'Thirty minutes with the founders, online or at your hospital.',
  withLine: 'Dr. Lasha Khoshtaria and Irakli Pkhovelishvili',
  leaveTitle: 'You leave with',
  leave: [
    'Your three biggest problems, in your own numbers.',
    'A dated 90-day plan for your hospital.',
    'The measures you will judge MediMind on at day 30.',
  ],
  commitment: 'No commitment. Nothing is signed on the call.',
  formTitle: primaryCta.label,
  formLine: 'Five fields. We reply within one working day.',
};

/* ---------- Footer ---------- */

export const footerV2 = {
  line: 'One hospital. One operating system.',
  secondLine: 'Built ground-up on FHIR R4.',
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: `mailto:${contactEmail}` },
    { label: 'Innovative Startup status', href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464' },
    { label: 'MediMind Expert', href: 'https://medimind.md/expert' },
  ],
  copyright: (year: number) => `© ${year} MediMind.`,
};

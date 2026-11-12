/**
 * Lane A words: header, hero and the hero's living-hospital visual
 * (direction v2, marketing/landing-level-up-2026-11-12/09-DIRECTION-V2.md).
 * The primary button label lives in site.ts (primaryCta).
 */

// ---------------------------------------------------------------- Header

export const headerContent = {
  logoLabel: 'MediMind home',
  /** Accessible name of the section navigation (not visible). */
  navLabel: 'Page sections',
  nav: [
    { label: 'The belief', id: 'belief' },
    { label: 'The system', id: 'system' },
    { label: 'The product', id: 'product' },
    { label: 'The brain', id: 'brain' },
    { label: 'Team', id: 'team' },
  ],
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
  themeToDarkLabel: 'Switch to dark theme',
  themeToLightLabel: 'Switch to light theme',
};

// ---------------------------------------------------------------- Hero

export const heroContent = {
  eyebrow: 'The AI-native hospital operating system',
  /** The page's only h1, exactly as briefed; two sentences, one per line on wide screens. */
  titleLines: ['One patient walks in.', 'The whole hospital moves.'],
  sub: 'MediMind runs the whole hospital on one operating system. It prepares the next step for every department. Your doctors and staff decide.',
  secondary: { label: 'See how it works', href: '#system' },
  honesty:
    'The proactive orchestration shown here is in development. The operating system underneath it is built and running today.',
};

// ---------------------------------------------------------------- Hero visual

export type DepartmentId = 'triage' | 'lab' | 'imaging' | 'pharmacy' | 'beds' | 'billing' | 'ministry';

export interface DepartmentStep {
  id: DepartmentId;
  /** The department, in plain words. */
  name: string;
  /** What the system has ready for a person (the system's voice). */
  prepared: string;
  /** Who decides, while waiting. */
  waiting: string;
  /** What it says once that person has signed. */
  signed: string;
}

export const orchestrationContent = {
  /** Accessible summary of the whole visual (it is decorative motion over this meaning). */
  summary:
    'Illustration: one patient arrives and seven departments each receive a prepared step. Triage, laboratory, imaging, pharmacy, beds, billing and the ministry form each wait for a person to sign before anything happens.',
  title: 'One arrival, seven departments',
  titleShort: 'One arrival',
  devBadge: 'In development',
  patientLabel: 'Patient arrives',
  patientDetail: 'Emergency, chest pain',
  patientTime: '09:41',
  pauseLabel: 'Pause animation',
  playLabel: 'Play animation',
  preparing: 'Preparing',
  footerSystem: 'Prepared by the system',
  footerHuman: 'Decided by people',
  footerSystemShort: 'Prepared',
  footerHumanShort: 'Decided',
  steps: [
    { id: 'triage', name: 'Triage', prepared: 'Priority suggested from vitals', waiting: 'Nurse to confirm', signed: 'Nurse confirmed' },
    { id: 'lab', name: 'Laboratory', prepared: 'Cardiac lab panel drafted', waiting: 'Doctor to sign', signed: 'Doctor signed' },
    { id: 'imaging', name: 'Imaging', prepared: 'Chest X-ray request ready', waiting: 'Doctor to sign', signed: 'Doctor signed' },
    { id: 'pharmacy', name: 'Pharmacy', prepared: 'Medicines checked for interactions', waiting: 'Pharmacist to approve', signed: 'Pharmacist approved' },
    { id: 'beds', name: 'Beds', prepared: 'Cardiology bed held', waiting: 'Nurse to confirm', signed: 'Nurse confirmed' },
    { id: 'billing', name: 'Billing', prepared: 'Insurance claim prepared', waiting: 'Billing to release', signed: 'Billing released' },
    { id: 'ministry', name: 'Ministry form', prepared: 'Ministry report pre-filled', waiting: 'Doctor to sign', signed: 'Doctor signed' },
  ] satisfies DepartmentStep[],
};

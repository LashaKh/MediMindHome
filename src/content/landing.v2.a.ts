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
  /**
   * The page's only h1 (founder ruling 5, 2026-11-13), broken into balanced
   * lines on wide screens. Alternatives the founder can swap in with one edit:
   *   titleLines: ['One operating system.', 'The entire hospital.'],
   *   titleLines: ['The end of the', 'reactive hospital.'],
   */
  titleLines: ['The hospital', 'that thinks ahead.'],
  sub: 'One operating system runs the whole hospital and prepares every next step. Your doctors decide.',
  secondary: { label: 'See how it works', href: '#system' },
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
  devBadge: 'In development',
  patientLabel: 'Patient arrives',
  patientDetail: 'Emergency, chest pain',
  /** The clock starts at the arrival and advances through the minutes as the hospital moves. */
  clockStartHour: 9,
  clockStartMinute: 41,
  clockMinutesToSettle: 17,
  arrivedAt: 'arrived',
  pauseLabel: 'Pause animation',
  playLabel: 'Play animation',
  footerSystem: 'Prepared by the system',
  footerHuman: 'Decided by people',
  footerSystemShort: 'Prepared',
  footerHumanShort: 'Decided',
  steps: [
    { id: 'triage', name: 'Triage', prepared: 'Priority suggested', waiting: 'Nurse to confirm', signed: 'Nurse confirmed' },
    { id: 'lab', name: 'Laboratory', prepared: 'Cardiac panel drafted', waiting: 'Doctor to sign', signed: 'Doctor signed' },
    { id: 'imaging', name: 'Imaging', prepared: 'Chest X-ray ready', waiting: 'Doctor to sign', signed: 'Doctor signed' },
    { id: 'pharmacy', name: 'Pharmacy', prepared: 'Interactions checked', waiting: 'Pharmacist to approve', signed: 'Pharmacist approved' },
    { id: 'beds', name: 'Beds', prepared: 'Cardiology bed held', waiting: 'Nurse to confirm', signed: 'Nurse confirmed' },
    { id: 'billing', name: 'Billing', prepared: 'Claim prepared', waiting: 'Billing to release', signed: 'Billing released' },
    { id: 'ministry', name: 'Ministry form', prepared: 'Report pre-filled', waiting: 'Doctor to sign', signed: 'Doctor signed' },
  ] satisfies DepartmentStep[],
};

import { Activity, Pill, FlaskConical, Wallet, Microscope, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Phase 1 capability areas — what "the foundation" concretely contains.
 * The tile renders icon + name + tagline only; breadth is the point, depth
 * lives in the demo. AI-flavoured capabilities (scribe, decision support,
 * command center) belong to Phase 2 and live in the Path + AI sections.
 */
export interface Pillar {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Tailwind classes for icon background/ring — all in brand blues; intensity varies for visual rhythm. */
  accent: string;
}

// Brand-aligned accent variations: navy / secondary / accent / light-accent
// at different opacities and gradient stops, for visual variety without
// straying from the brand book's blue palette.
const accentClasses = {
  navy: 'from-primary/40 to-secondary/30 ring-secondary/40',
  secondary: 'from-secondary/40 to-accent/25 ring-secondary/40',
  accent: 'from-accent/40 to-light-accent/20 ring-accent/40',
  light: 'from-light-accent/30 to-accent/20 ring-light-accent/40',
} as const;

export const pillars: Pillar[] = [
  {
    id: 'clinical-core',
    name: 'Clinical Core',
    tagline: 'The patient, end to end.',
    icon: Activity,
    accent: accentClasses.accent,
  },
  {
    id: 'pharmacy',
    name: 'Medications & Pharmacy',
    tagline: 'Order, dispense, administer — safely.',
    icon: Pill,
    accent: accentClasses.navy,
  },
  {
    id: 'lab-imaging',
    name: 'Lab & Imaging',
    tagline: 'Results in. Images up. Decisions out.',
    icon: FlaskConical,
    accent: accentClasses.secondary,
  },
  {
    id: 'revenue-compliance',
    name: 'Revenue Cycle & Government',
    tagline: 'Get paid. Pass the audit.',
    icon: Wallet,
    accent: accentClasses.light,
  },
  {
    id: 'research',
    name: 'Research & Clinical Trials',
    tagline: 'Run trials with compliance built in.',
    icon: Microscope,
    accent: accentClasses.accent,
  },
  {
    id: 'workforce',
    name: 'HR, Workforce & Engagement',
    tagline: 'The rest of the hospital — and the patient.',
    icon: Users,
    accent: accentClasses.secondary,
  },
];

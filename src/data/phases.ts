import { Building2, Sparkles, BrainCircuit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * The three-phase deployment path — the homepage's narrative spine.
 * Presented as one integration roadmap (Replace → Augment → Predict), NOT as
 * availability tiers: all three phases carry equal visual weight. Source of
 * truth for the wording is the hospital deck (public/hospitals.html, slide 03).
 */
export interface Phase {
  id: 'foundation' | 'efficiency' | 'proactive';
  number: number;
  /** One-word phase theme — the verb this stage performs on the hospital. */
  tag: string;
  name: string;
  /** One-line scope, styled as a subtitle under the phase name. */
  scope: string;
  bullets: string[];
  /** The single number that anchors the phase. */
  proof: { value: string; label: string };
  icon: LucideIcon;
}

export const phases: Phase[] = [
  {
    id: 'foundation',
    number: 1,
    tag: 'Replace',
    name: 'The Foundation',
    scope: 'EMR · Lab · Imaging · Portal',
    bullets: [
      'The legacy stack goes. A Western-standard system takes its place.',
      'Every department on one login, one live patient record.',
      'Secured, audited, and standards-based from day one.',
    ],
    proof: { value: '25', label: 'hospitals running on it under one signed chain contract' },
    icon: Building2,
  },
  {
    id: 'efficiency',
    number: 2,
    tag: 'Augment',
    name: 'Efficiency Gains',
    scope: 'AI, workflow by workflow',
    bullets: [
      'The scribe writes the notes — doctors review and sign.',
      "AI reads the patient's full history in seconds.",
      'Early warnings before a patient deteriorates.',
      'Management sees the whole hospital, live.',
    ],
    proof: { value: 'You', label: 'decide which department starts — and when' },
    icon: Sparkles,
  },
  {
    id: 'proactive',
    number: 3,
    tag: 'Predict',
    name: 'The Proactive Brain',
    scope: 'The hospital that thinks ahead',
    bullets: [
      'Reads every patient in the building, in real time.',
      'Catches problems before they escalate.',
      'The AI flags. Your doctors decide.',
    ],
    proof: { value: '1st', label: 'hospitals that switch it on run among the first in the world' },
    icon: BrainCircuit,
  },
];

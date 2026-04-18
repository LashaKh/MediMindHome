export interface Milestone {
  date: string;
  label: string;
  detail: string;
  highlight?: boolean;
}

export const milestones: Milestone[] = [
  { date: 'Mar 2025', label: 'Started with an idea', detail: 'Two physicians + one engineer, frustrated enough to pivot out of clinical practice.' },
  { date: 'May 2025', label: 'Doctor-pilot platform launched', detail: 'Cardiology-focused tool tested with 50 practicing cardiologists.' },
  { date: 'Sept 2025', label: '150,000 GEL GITA grant', detail: "Awarded by Georgia's Innovation and Technology Agency.", highlight: true },
  { date: 'Oct 2025', label: 'Pivot to full ecosystem', detail: 'Recommitted to building the full AI-native medical OS.' },
  { date: 'Nov 2025', label: 'FHIR R4 + standards adopted', detail: 'Locked international compliance for global readiness.' },
  { date: 'Jan 2026', label: 'LOI signed — 25-hospital chain', detail: 'Letter of intent with a major Georgian hospital network.', highlight: true },
  { date: 'Feb 2026', label: 'Live at Research Hospital Healthycore', detail: 'First production implementation, ongoing.', highlight: true },
  { date: 'Feb 2026', label: '“Innovative Startup” status', detail: 'Awarded by the Government of Georgia. Among the first companies in the country to receive it.', highlight: true },
  { date: 'Apr 2026', label: 'Contract signed — 25-hospital chain', detail: 'Multi-site rollout contracted.', highlight: true },
  { date: 'Aug 2026', label: 'Full go-live across 25 hospitals', detail: 'Planned full deployment across the chain.' },
];

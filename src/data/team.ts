export interface FounderPlaceholder {
  id: string;
  name: string;
  role: string;
  credential: string;
  initials: string;
}

// Placeholders — replace with real names, photos, and bios before launch.
export const founders: FounderPlaceholder[] = [
  {
    id: 'founder-1',
    name: 'Dr. [Founder Name]',
    role: 'Co-founder & Chief Medical Officer',
    credential: 'MD · Cardiology',
    initials: 'MD',
  },
  {
    id: 'founder-2',
    name: 'Dr. [Founder Name]',
    role: 'Co-founder & Chief Product Officer',
    credential: 'MD · Internal Medicine',
    initials: 'MD',
  },
  {
    id: 'founder-3',
    name: '[Founder Name]',
    role: 'Co-founder & Chief Technology Officer',
    credential: 'Engineering · Healthcare Systems',
    initials: 'CT',
  },
];

export interface AdvisorPlaceholder {
  id: string;
  name: string;
  affiliation: string;
}

export const advisors: AdvisorPlaceholder[] = [
  { id: 'a1', name: '[Advisor Name]', affiliation: 'Hospital Operations' },
  { id: 'a2', name: '[Advisor Name]', affiliation: 'Health AI Research' },
  { id: 'a3', name: '[Advisor Name]', affiliation: 'Healthcare Regulatory' },
  { id: 'a4', name: '[Advisor Name]', affiliation: 'Enterprise Healthcare IT' },
];

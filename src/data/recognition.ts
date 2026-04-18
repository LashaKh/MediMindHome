import { Award, Banknote, HeartPulse, Handshake, Stethoscope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface RecognitionTile {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  link?: { label: string; href: string };
  emphasis?: boolean;
}

export const recognitionTiles: RecognitionTile[] = [
  {
    id: 'innovative-startup',
    icon: Award,
    title: '“Innovative Startup” status — Government of Georgia',
    body: 'Awarded 25.02.2026, valid through 01.03.2027. Among the first companies in Georgian history to receive this designation. Includes income-tax exemption.',
    link: { label: 'View public registry →', href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464' },
    emphasis: true,
  },
  {
    id: 'gita-grant',
    icon: Banknote,
    title: 'GITA Grant — 150,000 GEL',
    body: "Awarded September 2025 by Georgia's Innovation and Technology Agency.",
  },
  {
    id: 'healthycore',
    icon: HeartPulse,
    title: 'Live at Research Hospital Healthycore',
    body: 'Active production implementation since February 2026.',
  },
  {
    id: 'chain-contract',
    icon: Handshake,
    title: '25-hospital chain — signed contract',
    body: 'Multi-site rollout across Georgia, planned go-live August 2026.',
  },
  {
    id: 'doctor-built',
    icon: Stethoscope,
    title: 'Built by practicing doctors',
    body: 'Beta-tested with 50 cardiologists. Every UX decision reviewed by a clinician.',
  },
];

import { Heart, Brain, Zap, Layers, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AnatomyLayer {
  id: string;
  layer: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  name: 'Heart' | 'Brain' | 'Muscle' | 'Skin' | 'Nerve';
  verb: string;
  tagline: string;
  body: string;
  icon: LucideIcon;
  accent: string;
}

export const anatomyLayers: AnatomyLayer[] = [
  {
    id: 'heart',
    layer: 'L1',
    name: 'Heart',
    verb: 'holds',
    tagline: 'FHIR-native living model of every hospital object.',
    body: 'Patient, Encounter, Observation, ServiceRequest, MedicationRequest — 80+ FHIR R4 resource types on Medplum Cloud. The storage primitive, not an API layer.',
    icon: Heart,
    accent: 'from-accent/40 to-light-accent/20 ring-accent/40',
  },
  {
    id: 'brain',
    layer: 'L2',
    name: 'Brain',
    verb: 'thinks',
    tagline: 'AI reasoning across the Heart.',
    body: 'Ambient scribe, drug-interaction hard-stops, appeals drafting, pathway engine, coordinator copilot. AI as a native primitive, not a retrofit.',
    icon: Brain,
    accent: 'from-secondary/40 to-accent/25 ring-secondary/40',
  },
  {
    id: 'muscle',
    layer: 'L3',
    name: 'Muscle',
    verb: 'acts',
    tagline: 'Actions into the real world.',
    body: 'Government submissions, insurance claims, pharmacy orders, DICOM sends, SMS, email, SupplyDelivery chain, Bots, edge functions. Every action is attributable and audited.',
    icon: Zap,
    accent: 'from-primary/40 to-secondary/30 ring-secondary/40',
  },
  {
    id: 'skin',
    layer: 'L4',
    name: 'Skin',
    verb: 'meets the world',
    tagline: 'UIs for every role in the hospital.',
    body: 'Registration, CPOE, MAR, pharmacy queue, lab, PACS, bed management, appointments, billing, HR, nursing station, MediScribe, dashboard. One login across all of them.',
    icon: Layers,
    accent: 'from-light-accent/30 to-accent/20 ring-light-accent/40',
  },
  {
    id: 'nerve',
    layer: 'L5',
    name: 'Nerve',
    verb: 'feels every change',
    tagline: 'Events, audit, provenance, real-time signals.',
    body: 'Event engine, AuditEvent, Provenance, Subscription, real-time alerts. Every mutation is logged, attributable, and regulator-ready.',
    icon: Activity,
    accent: 'from-secondary/40 to-accent/25 ring-secondary/40',
  },
];

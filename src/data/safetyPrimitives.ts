import { ShieldAlert, AlertOctagon, ScanLine, KeySquare, Lock, FileLock2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SafetyPrimitive {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

export const safetyPrimitives: SafetyPrimitive[] = [
  {
    id: 'prn',
    icon: ShieldAlert,
    title: 'PRN dose enforcement is fail-closed.',
    body: 'If the dose-limit query can\u2019t reach the server, the dose is BLOCKED — not retried, not silently allowed. Safety over availability.',
  },
  {
    id: 'ddi',
    icon: AlertOctagon,
    title: 'Drug-drug interaction hard-stops.',
    body: 'Critical interactions require permission to override. Not just a popup you click through — a permission gate, with a logged reason and an audit trail.',
  },
  {
    id: 'barcode',
    icon: ScanLine,
    title: 'Barcode 5-rights verification.',
    body: 'Every medication administration: scan the wristband, scan the medication. Wrong patient, drug, dose, route, or time = red alert. Cannot proceed.',
  },
  {
    id: 'cosign',
    icon: KeySquare,
    title: 'Controlled substance co-sign.',
    body: 'Opioid and benzodiazepine administration require witness badge scan or credential entry. Co-sign is captured, attributable, and immutable.',
  },
  {
    id: 'breakglass',
    icon: Lock,
    title: 'Break-glass access.',
    body: 'Restricted patients (VIPs, behavioral health) require elevated permission to open. Every access attempt is logged, reviewable, and time-boxed.',
  },
  {
    id: 'audit',
    icon: FileLock2,
    title: 'Immutable audit trail.',
    body: 'Every clinical mutation, every AI generation, every doctor confirmation creates a FHIR AuditEvent + Provenance resource. Standard format, exportable, regulator-ready.',
  },
];

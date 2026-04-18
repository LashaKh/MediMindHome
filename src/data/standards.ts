import type { LucideIcon } from 'lucide-react';
import { Mic, Code2, Database, Network, FileLock2 } from 'lucide-react';

export interface FlowStage {
  id: string;
  title: string;
  icon: LucideIcon;
  badges: string[];
  blurb: string;
}

export const dataFlow: FlowStage[] = [
  { id: 'capture', title: 'Capture', icon: Mic, badges: ['HL7 v2.x'], blurb: 'Lab and device messages over HL7 v2.x.' },
  { id: 'encode', title: 'Encode', icon: Code2, badges: ['SNOMED CT', 'LOINC', 'ICD-10', 'RxNorm', 'CPT', 'DRG'], blurb: 'Six standard medical coding systems.' },
  { id: 'store', title: 'Store', icon: Database, badges: ['FHIR R4'], blurb: 'Every resource canonical FHIR R4.' },
  { id: 'exchange', title: 'Exchange', icon: Network, badges: ['SMART on FHIR', 'DICOM', 'CCDA'], blurb: 'Open exchange with any FHIR-aware system.' },
  { id: 'audit', title: 'Audit', icon: FileLock2, badges: ['HIPAA-aligned', 'AuditEvent', 'Provenance', 'RBAC'], blurb: 'Mutation-level audit, role-based access, encryption at rest + transit, session timeout.' },
];

export interface IntegrationCategory {
  id: string;
  title: string;
  partners: string[];
}

export const integrations: IntegrationCategory[] = [
  { id: 'labs', title: 'Labs', partners: ['HealthGorilla', 'Regional LIS systems'] },
  { id: 'erx', title: 'e-Prescribing', partners: ['DoseSpot', 'Georgia MOH ePrescription'] },
  { id: 'pacs', title: 'PACS / Imaging', partners: ['Orthanc', 'Cornerstone.js DICOM viewer'] },
  { id: 'telehealth', title: 'Telehealth', partners: ['LiveKit (WebRTC)'] },
  { id: 'wearables', title: 'Wearables', partners: ['Fitbit', 'Withings', 'Apple Health'] },
  { id: 'government', title: 'Government', partners: ['Georgia MOH EHR', 'RS.GE Revenue Service', 'MOH Classifier Sync'] },
];

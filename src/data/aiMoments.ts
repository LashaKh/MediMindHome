import { Activity, Microscope, FlaskConical, MessagesSquare, ClipboardList, Mic } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AIMoment {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  badge: string;
}

export const aiMoments: AIMoment[] = [
  {
    id: 'news2',
    icon: Activity,
    title: 'Auto-NEWS2 from vitals',
    body: 'Every vital-sign entry recalculates NEWS2 with dual SpO₂ scales (Scale 1 standard, Scale 2 hypercapnic-RF). Score appears in patient banner, bed board, dashboard, and nursing station — no calculator, no clicks.',
    badge: 'Bedside',
  },
  {
    id: 'eligibility',
    icon: Microscope,
    title: 'AI eligibility screening for trials',
    body: 'Entire patient population evaluated against trial criteria — age, ICD-10, lab values, vital thresholds, exclusions — in under 10 seconds per patient. Scored 0–100 and classified eligible / likely / unlikely / ineligible.',
    badge: 'Research',
  },
  {
    id: 'abg',
    icon: FlaskConical,
    title: 'ABG image → interpretation',
    body: 'Drop the blood-gas printout. AI extracts pH, pCO₂, pO₂, HCO₃⁻, base excess; identifies primary process and compensation; outputs a severity-tiered action plan (vent settings, IV bicarb, fluid resuscitation).',
    badge: 'ICU/ER',
  },
  {
    id: 'specialty-chat',
    icon: MessagesSquare,
    title: 'Specialty-routed clinical chat',
    body: 'Cardiology and OB/GYN have distinct LLM flows (Flowise DAGs at separate endpoints), not one generic chatbot. Personal vector knowledge base via OpenAI Assistants for each physician\u2019s uploaded guidelines.',
    badge: 'Specialty',
  },
  {
    id: 'sbar',
    icon: ClipboardList,
    title: 'Auto-SBAR shift handoff',
    body: '24 hours of EMR data — NEWS2 trends, overdue meds, pending tasks, clinical highlights — auto-rendered as Situation/Background/Assessment/Recommendation. Nurse adds verbal notes and exports a PDF.',
    badge: 'Nursing',
  },
  {
    id: 'mediscribe',
    icon: Mic,
    title: 'Ambient scribe (MediScribe)',
    body: 'Native Georgian and English voice into structured FHIR. Dual-STT race, Gemini SOAP structuring, ICD-10 codes generated directly, Form 100/ა drafted in parallel. Walk-through below.',
    badge: 'Featured ↓',
  },
];

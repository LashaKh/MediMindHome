/**
 * Lane B words (rows 3 to 5 of 09-DIRECTION-V2.md, cut per round 3 rulings in
 * 10-ROUND-3-RULINGS.md: "say more with less"): the belief (#belief), the
 * forty-system problem (#problem) and the operating system as an anatomy
 * (#system).
 *
 * Every string the three sections show lives here. The 2 a.m. case is the
 * founder's own, de-identified, and never claims MediMind would have saved
 * the patient; the hospital brain is "being built".
 */

// ─── 3. The belief (#belief) ─────────────────────────────────────────

export interface BeliefBeat {
  /** Short system-voice marker above the beat (a time or a span). */
  marker: string;
  /** Which small chart the beat shows. */
  visual: 'night' | 'record' | 'hours' | 'days';
  line: string;
}

export const belief = {
  /** The founder's case, shown only when `showPracticeCase` is true. */
  caseIntro: 'A case from my practice',
  caseAuthor: 'Dr. Lasha Khoshtaria, interventional cardiologist',
  caseBeats: [
    { marker: '02:00', visual: 'night', line: 'After a heart procedure, a patient developed pancreatitis.' },
    { marker: 'The record', visual: 'record', line: 'The signs were in the record.' },
    { marker: '14 hours', visual: 'hours', line: 'Nobody put them together.' },
    { marker: '20 days', visual: 'days', line: 'In intensive care.' },
  ] satisfies BeliefBeat[],
  caseWhy: 'That night is why we build.',

  /** Opening used when the case is switched off. */
  genericBeats: [
    { marker: '02:00', visual: 'night', line: 'It is 2 a.m. in a hospital, anywhere.' },
    { marker: 'The record', visual: 'record', line: 'The signs are in the record.' },
    { marker: 'The night', visual: 'hours', line: 'Who sees them depends on who is awake.' },
  ] satisfies BeliefBeat[],

  beliefLines: ['We believe no patient should be missed at 2 a.m.', 'In any hospital.', 'Anywhere.'],

  /** Not rendered since round 3 (kept for the dormant BeliefContrast helper). */
  reactive: {
    label: 'The reactive hospital',
    status: 'How hospitals run today',
    lines: ['Software waits to be asked.', 'Safety depends on a tired person remembering.'],
    figureNote: 'Waiting for someone to ask',
  },
  proactive: {
    label: 'The proactive hospital',
    status: 'What we are building',
    marker: 'In development',
    lines: ['The system notices what is missing and has it ready.', 'A person decides.'],
    figureNote: 'Prepared for review',
    figureDecision: 'A doctor decides',
  },
} as const;

// ─── 4. Forty systems (#problem) ─────────────────────────────────────

/** The forty-system hospital: the programs a hospital typically runs on. */
export const fragmentNames = [
  'Registration', 'Admissions', 'Bed board', 'Triage', 'Emergency',
  'Outpatient', 'Scheduling', 'Orders', 'Nursing notes', 'Medication chart',
  'Pharmacy', 'Stock', 'Laboratory', 'Infection control', 'Imaging',
  'Image archive', 'Pathology', 'Blood bank', 'Theatre', 'Anaesthesia',
  'ICU charts', 'Discharge', 'Referrals', 'Billing', 'Insurance claims',
  'Ministry reports', 'Cash desk', 'Payroll', 'HR', 'Timesheets',
  'Procurement', 'Sterilisation', 'Kitchen', 'Ambulance', 'Patient portal',
  'Messaging', 'Email', 'Spreadsheets', 'Paper forms', 'Phone',
] as const;

export const fragments = {
  title: 'Forty systems run a hospital.',
  titleSecond: 'None of them sees the whole patient.',
  /** Where the gaps between systems are paid for (labels inside the picture). */
  gaps: ['Typed in twice', 'Phoned through', 'Printed and carried', 'Waiting on a signature', 'Billed days late', 'Searched by hand'],
  patientLabel: 'One patient',
  resolvedLabel: 'One record. One system.',
  figureAlt:
    'Forty separate hospital programs, from registration to payroll, scattered around one patient with gaps between them where work is retyped, phoned through or carried by hand. As you scroll they close into one system.',
} as const;

// ─── 5. The operating system as a body (#system) ─────────────────────

export type LayerId = 'heart' | 'brain' | 'muscle' | 'skin' | 'nerve';

export interface AnatomyLayerCopy {
  id: LayerId;
  name: 'Heart' | 'Brain' | 'Muscle' | 'Skin' | 'Nerve';
  verb: string;
  /** A few words: what it is. */
  line: string;
  /** Optional honest status marker. */
  status?: string;
}

export const anatomy = {
  title: 'A hospital with a body made of software.',
  figureAlt:
    'A human figure drawn in fine lines. The heart at its centre is the record, the head is the brain, the limbs are the muscle reaching out to ministries, insurers and pharmacies, the outer circle is the skin where staff and patients meet it, and nerves run through all of it.',
  layers: [
    { id: 'heart', name: 'Heart', verb: 'holds', line: 'The record, ground-up on FHIR R4.' },
    { id: 'brain', name: 'Brain', verb: 'thinks', line: 'AI prepares. A doctor signs.', status: 'Partly in development' },
    { id: 'muscle', name: 'Muscle', verb: 'acts', line: 'Every action through one audited door.' },
    { id: 'skin', name: 'Skin', verb: 'meets', line: 'One system for every role.' },
    { id: 'nerve', name: 'Nerve', verb: 'feels', line: 'Every change, traced as it happens.' },
  ] satisfies AnatomyLayerCopy[],
  /** Labels drawn inside the figure. */
  figureLabels: {
    world: ['Ministry', 'Insurer', 'Pharmacy', 'Devices'],
    people: ['Doctor', 'Nurse', 'Patient', 'Finance'],
  },
} as const;

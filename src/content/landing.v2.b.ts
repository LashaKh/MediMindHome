/**
 * Lane B words for direction v2 (09-DIRECTION-V2.md, rows 3 to 5):
 * the belief (#belief), the forty-system problem (#problem) and the
 * operating system as an anatomy (#system).
 *
 * Every string the three sections show lives here. Facts follow the truth
 * lines in 09-DIRECTION-V2.md and 03-who-we-are-and-claims.md: the 2 a.m.
 * case is the founder's own, de-identified, and never claims MediMind would
 * have saved the patient; the hospital brain is "being built".
 */

// ─── 3. The belief (#belief) ─────────────────────────────────────────

export interface BeliefBeat {
  /** Short system-voice marker beside the beat (a time or a span). */
  marker: string;
  /** What the instrument shows for this beat. */
  visual: 'night' | 'record' | 'hours' | 'days';
  lines: string[];
}

export const belief = {
  /** The founder's case, shown only when `showPracticeCase` is true. */
  caseIntro: 'A case from my practice',
  caseAuthor: 'Dr. Lasha Khoshtaria',
  caseAuthorRole: 'interventional cardiologist and co-founder of MediMind',
  caseBeats: [
    {
      marker: '02:00',
      visual: 'night',
      lines: ['One night, after a heart procedure, a patient of mine developed pancreatitis.'],
    },
    {
      marker: 'The record',
      visual: 'record',
      lines: ['The warning signs were there, in the record.', 'Buried in a long history.'],
    },
    {
      marker: '14 hours',
      visual: 'hours',
      lines: ['For fourteen hours, nobody put them together.'],
    },
    {
      marker: '20 days',
      visual: 'days',
      lines: ['The patient spent twenty days in intensive care.'],
    },
  ] satisfies BeliefBeat[],
  caseTurn: ['Every sign was in the system.', 'The system waited to be asked.'],
  caseWhy: 'That night is why we build.',

  /** Opening used when the case is switched off. */
  genericBeats: [
    {
      marker: '02:00',
      visual: 'night',
      lines: ['It is 2\u00a0a.m. in a hospital, anywhere.'],
    },
    {
      marker: 'The record',
      visual: 'record',
      lines: [
        'The facts that matter are in the record, scattered across years of history.',
        'Whether anyone sees them in time depends on who is awake, and what they remember.',
      ],
    },
  ] satisfies BeliefBeat[],

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

  beliefLines: ['We believe no patient should be missed at 2\u00a0a.m.', 'In any hospital.', 'Anywhere.'],
  signature: 'AI works. People decide.',
} as const;

// ─── 4. Forty systems (#problem) ─────────────────────────────────────

/** The forty-system hospital: the programs a hospital typically runs on. */
export const fragmentNames = [
  'Registration', 'Admissions', 'Bed board', 'Triage', 'Emergency',
  'Outpatient', 'Scheduling', 'Orders', 'Nursing notes', 'Medication chart',
  'Pharmacy', 'Stock', 'Laboratory', 'Analysers', 'Imaging',
  'Image archive', 'Pathology', 'Blood bank', 'Theatre', 'Anaesthesia',
  'ICU charts', 'Discharge', 'Referrals', 'Billing', 'Insurance claims',
  'Ministry reports', 'Cash desk', 'Payroll', 'HR', 'Timesheets',
  'Procurement', 'Sterilisation', 'Kitchen', 'Ambulance', 'Patient portal',
  'Messaging', 'Email', 'Spreadsheets', 'Paper forms', 'Phone',
] as const;

export const fragments = {
  title: 'Forty systems run a hospital.',
  titleSecond: 'None of them sees the whole patient.',
  lead:
    'Registration in one program. Lab in another. Imaging, pharmacy, billing, beds and staff in their own. The patient is split across all of them, and the people in between become the connection.',
  /** Where the gaps between systems are paid for. */
  gaps: [
    'Typed in twice',
    'Phoned through',
    'Printed and carried',
    'Waiting on a signature',
    'Billed days late',
    'Searched by hand',
  ],
  patientLabel: 'One patient',
  gapLegend:'Every gap between two systems is paid for in time, money and attention.',
  resolvedLabel: 'One record. One system.',
  figureAlt:
    'Forty separate hospital programs, from registration to payroll, scattered with gaps between them where work is retyped, phoned through or carried by hand. As you scroll they close into one system.',
  insight: 'You cannot add intelligence to fragments.',
  failures: [
    {
      name: 'AI add-ons',
      text: 'An assistant laid over forty systems sees one window at a time. It can summarise a screen. It cannot see the patient.',
    },
    {
      name: 'Old record systems',
      text: 'Built to store and to bill, then extended for decades. Bolting AI onto them adds a forty-first system.',
    },
  ],
  resolve:
    'Intelligence needs the whole patient in one place. So we built one operating system for the whole hospital.',
} as const;

// ─── 5. The operating system as a body (#system) ─────────────────────

export type LayerId = 'heart' | 'brain' | 'muscle' | 'skin' | 'nerve';

export interface AnatomyLayerCopy {
  id: LayerId;
  name: 'Heart' | 'Brain' | 'Muscle' | 'Skin' | 'Nerve';
  verb: string;
  /** What it is, in one plain line. */
  is: string;
  /** What it means for a hospital. */
  means: string;
  /** Optional honest status marker. */
  status?: string;
}

export const anatomy = {
  title: 'A hospital with a body made of software.',
  support:
    'Not forty programs wired together. One operating system, written as one codebase, with five layers that work like a body.',
  figureAlt:
    'A human figure drawn in fine lines. The heart at its centre is the record, the head is the brain, the arms are the muscle reaching out to ministries, insurers and pharmacies, the outer circle is the skin where staff and patients meet it, and nerves run through all of it.',
  interactHint: 'Point at a layer, or tab through them, to see it in the body.',
  layers: [
    {
      id: 'heart',
      name: 'Heart',
      verb: 'holds',
      is: 'The living record of every patient, bed, order and claim.',
      means:
        'Built ground-up on FHIR R4, the international standard for health data, as the storage itself. One of the first hospital operating systems built this way. The data is the hospital’s, readable by any system, never locked in.',
    },
    {
      id: 'brain',
      name: 'Brain',
      verb: 'thinks',
      is: 'AI that reasons across the whole record, not one screen at a time.',
      means:
        'Today it drafts the clinical note and the ministry form, and answers questions from the record. We are building it to notice what is missing and prepare the work. A doctor signs every medical decision.',
      status: 'Partly in development',
    },
    {
      id: 'muscle',
      name: 'Muscle',
      verb: 'acts',
      is: 'Every action leaves through one audited door.',
      means:
        'Orders, ministry reports, insurance claims and pharmacy requests go out as checked commands. Who acted, for which patient, on which version: recorded every time.',
    },
    {
      id: 'skin',
      name: 'Skin',
      verb: 'meets the world',
      is: 'One system for every role, from the front desk to the operating theatre.',
      means:
        'Doctors, nurses, lab, pharmacy, billing and HR work in one place with one login, in their own language. Every screen ends in an action.',
    },
    {
      id: 'nerve',
      name: 'Nerve',
      verb: 'feels every change',
      is: 'Every change is an event, signed and traceable.',
      means:
        'A result arrives, a bed frees, a dose is given: the people who need to know, know at once. Every step keeps a trail of who did what, and when.',
    },
  ] satisfies AnatomyLayerCopy[],
  /** Labels drawn inside the figure. */
  figureLabels: {
    world: ['Ministry', 'Insurer', 'Pharmacy', 'Devices'],
    people: ['Doctor', 'Nurse', 'Patient', 'Finance'],
  },
  memoryLine: 'Heart holds. Brain thinks. Muscle acts. Skin meets the world. Nerve feels every change.',
  closing: 'One codebase. Not stitched together. Not an overlay.',
} as const;

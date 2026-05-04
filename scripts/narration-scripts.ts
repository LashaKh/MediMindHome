/**
 * Narration scripts per walkthrough scene — Gemini 2.5 TTS.
 *
 * Each entry corresponds to a video clip in the walkthrough deck.
 * Output mp3 lands at /public/walkthrough/audio/<scriptId>.mp3
 *
 * Voice rationale (Gemini 2.5 TTS prebuilt voices):
 *   Sulafat (warm)        — primary. Reads as a confident founder.
 *   Charon (informative)  — alternative if you want more newscaster.
 *   Achird (friendly)     — approachable, slightly higher energy.
 *   Alnilam (firm)        — authoritative, more clinical.
 *   Aoede (breezy)        — softer female option.
 *
 * The `stylePrompt` field is a Gemini-only feature that conditions delivery
 * via natural language — the model reshapes prosody, pace, and emotional
 * weight based on this prompt. It is concatenated INVISIBLY before the
 * actual text in the request; the listener only hears the `text` field.
 */

export type GeminiVoice =
  | 'Sulafat'      // warm
  | 'Charon'       // informative
  | 'Achird'       // friendly
  | 'Alnilam'      // firm
  | 'Aoede'        // breezy
  | 'Kore'         // firm
  | 'Vindemiatrix' // gentle
  | 'Sadaltager';  // knowledgeable

export interface NarrationScript {
  scriptId: string;
  voice: GeminiVoice;
  stylePrompt?: string;
  text: string;
}

// Default style for every script unless overridden — keeps consistency
// across scenes so the listener doesn't notice voice "shifts" mid-pitch.
const DEFAULT_STYLE =
  'Read this with brisk, confident pace — like a founder pitching to investors ' +
  'who want it short and punchy. Light warmth, clear articulation, no theatrical ' +
  'emphasis. Keep pauses tight; do not drag.';

export const scripts: NarrationScript[] = [
  {
    // Maps to /Users/toko/Desktop/Loom Videos/1st sign in dashboards .mp4
    // Video beats: 0:00–0:02 sign-in → 0:02–0:13 clinician home →
    //              0:13–0:22 admin dashboard scroll
    scriptId: 'home-to-admin',
    voice: 'Sulafat',
    stylePrompt: DEFAULT_STYLE,
    text:
      'MediMind — FHIR-native, enterprise-grade. ' +
      'Sign in, and every shift starts here: patients, tasks, alerts, all in one place. ' +
      'Behind that sits the entire hospital — ' +
      'staff management, clinical operations, finance, command center, warehouse, analytics. ' +
      'One platform — built so a hospital runs on it, not just records on it.',
  },
  {
    // Maps to /Users/toko/Desktop/Loom Videos/2nd-Patient Hub,Patient Chart.mp4
    // Video beats:
    //   0:00–0:05  patient hub (cohort + floor stats)
    //   0:05–0:10  bed board (rooms, beds, occupancy)
    //   0:10–0:15  patient unified card (tabs: overview/dashboard/notes/orders/transfer/handoff/discharge)
    //   0:15–0:25  clinical dashboard (diagnoses, allergies, meds, conditions)
    //   0:25–0:33  shift handoff (sick status, trajectory, tasks)
    //   0:33–0:45  patient chart + edit-current-visit form
    scriptId: 'patient-hub-to-chart',
    voice: 'Sulafat',
    stylePrompt: DEFAULT_STYLE,
    text:
      'From the patient hub, every clinician sees their cohort and the floor at a glance — ' +
      'departments, occupancy, beds. ' +
      'The bed board adds the spatial layer — rooms, real-time availability, drag-drop transfers. ' +
      'Open any patient — every clinical action, one click away. ' +
      'Diagnoses, allergies, medications, today’s events, twenty years of structured history. ' +
      'And every byte feeds the AI layer above — ' +
      'summarizing the patient, drafting shift handoff for doctors and nurses, ' +
      'flagging drug interactions before the bedside. ' +
      'The brain that turns scattered data into one coherent picture.',
  },
  {
    // Maps to /Users/toko/Desktop/Loom Videos/3rd Mediscribe .mp4
    // Video beats:
    //   0:00–0:05  MediScribe page, select patient, load transcript
    //   0:05–0:10  doctor dictates, recording in progress
    //   0:10–0:15  "Formatting note…" — AI processes
    //   0:15–0:20  SOAP note rendered + ICD-coded diagnoses extracted
    //   0:20–0:28  patient form populated — one-click accept on allergies/reactions
    scriptId: 'mediscribe-voice-to-chart',
    voice: 'Sulafat',
    stylePrompt: DEFAULT_STYLE,
    text:
      'Doctors don’t fill forms — they speak. ' +
      'Doctor dictates, MediScribe listens. ' +
      'The AI generates a complete SOAP note — subjective, objective, assessment, plan — ' +
      'with every diagnosis ICD-coded straight from the conversation. ' +
      'Allergies, conditions, drug reactions — surfaced as one-click suggestions. ' +
      'Doctor confirms. The official medical form populates itself. ' +
      'No long-form filling — every clinical note, generated from voice.',
  },
  {
    // Maps to /Users/toko/Desktop/Loom Videos/4th Lab and Pacs.mp4
    // Video beats:
    //   0:00–0:08  lab dashboard — queue filters (ordered/received/processing/resulted/verified)
    //   0:08–0:15  verify lab report — CBC results, reference ranges, AI reads in patient context
    //   0:15–0:25  PACS imaging dashboard — departments, occupancy, fully integrated
    //   0:25–0:38  DICOM viewer — brain MRA, radiologist tools, AI flags before review
    scriptId: 'lab-and-pacs',
    voice: 'Sulafat',
    stylePrompt: DEFAULT_STYLE,
    text:
      'Lab orders flow through one pipeline — ordered, received, processing, resulted, verified — ' +
      'formatted to Western guideline standards. ' +
      'The AI doesn’t just flag the criticals — ' +
      'it reads every value against the patient’s full context — ' +
      'diagnoses, medications, history — ' +
      'surfacing insights a clinician would otherwise miss. ' +
      'Then PACS — fully native, no third-party viewer. ' +
      'Every modality, every prior, every patient — one space. ' +
      'Our imaging AI flags abnormalities on CT and MRI ' +
      'before the radiologist opens the study. ' +
      'From chart, to lab, to image — one brain layer.',
  },
  {
    // Maps to /Users/toko/Desktop/Loom Videos/5th AI Chatbot.mp4
    // Video beats:
    //   0:00–0:08  AI Assistant landing — Quick Consult / New Case Study
    //   0:08–0:15  Create Case modal — Manual Entry / From Patient toggle
    //   0:15–0:22  From Patient — auto-loads demographics, conditions, meds, allergies, labs
    //   0:22–0:28  Active reasoning conversation — TB military case, AI structured response
    //   0:28–0:33  Documents tab — hospital uploads protocols / research / guidelines
    scriptId: 'ai-assistant',
    voice: 'Sulafat',
    stylePrompt: DEFAULT_STYLE,
    text:
      'Open the AI Assistant — start a case from any patient in the hospital. ' +
      'Diagnoses, medications, allergies, labs, vitals — ' +
      'every data point loads in as context. ' +
      'Ask anything. ' +
      'The model reasons across the chart, ' +
      'and anchors its answer in the latest clinical guidelines. ' +
      'And the hospital owns the brain — ' +
      'upload your own protocols, research papers, case studies. ' +
      'The AI follows your practice, not a generic textbook. ' +
      'Medical-grade copilot, trusted at every bedside.',
  },
  {
    // Maps to /Users/toko/Desktop/Loom Videos/6th Patient Portand and research .mp4
    // Source 22.8s, sped to 1.5x → 15.2s. Tight feature-montage scene.
    // Video beats:
    //   0:00–0:04  patient portal — health education, my health side-nav (billing/labs/meds visible)
    //   0:04–0:08  portal home — appointments, messages, getting-started cards
    //   0:08–0:12  AI assistant inside the portal — symptoms, booking, meds, facility
    //   0:12–0:15  research recruitment — clinical trials list, AI matches across hospital DB
    scriptId: 'patient-portal-research',
    voice: 'Sulafat',
    stylePrompt: DEFAULT_STYLE,
    text:
      'Patients get the same platform — portal, telemedicine, billing, medications, labs, all in one app. ' +
      'Plus research recruitment — AI matches every patient to active trials across the entire hospital database.',
  },
];

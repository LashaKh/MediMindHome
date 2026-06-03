// Walkthrough scenes — fully video-driven (rebuilt from scratch).
// Each entry pairs a muted screen-recording with a Gemini-2.5-TTS
// narration track and a slide-notes rail. Add more scenes as the
// founder records additional clips; runtime grows accordingly.

export type Scene = {
  kind: "video";
  video: string;          // Path to muted mp4 in /public/walkthrough/clips/
  audio?: string;         // Path to mp3 narration in /public/walkthrough/audio/
  chapter: {
    number: string;       // "01"
    title: string;        // "The Operating System"
    duration: string;     // "0:22"
    slug: string;         // "operating-system" — used in browser-chrome URL pill
  };
  notes: {
    title: string;
    subtitle?: string;
    bullets?: string[];   // " — " separator splits each bullet into (label, body)
  };
  ka?: {                  // Georgian twin — shown when the deck toggles to ქარ
    chapterTitle: string;
    notesTitle: string;
    notesSubtitle?: string;
    notesBullets?: string[];
  };
  durationMs: number;
};

export const scenes: Scene[] = [
  // ── 0:00–0:22 — Sign-in → clinician home → admin dashboard ───────────
  {
    kind: "video",
    video: "/walkthrough/clips/home-to-admin.mp4",
    audio: "/walkthrough/audio/home-to-admin.mp3",
    chapter: {
      number: "01",
      title: "The Operating System",
      duration: "0:22",
      slug: "operating-system",
    },
    notes: {
      title: "One sign-in. The whole hospital.",
      subtitle: "Where every shift starts — and where it's run from.",
      bullets: [
        "Clinician home — patients, tasks, alerts at a glance",
        "Behind it — staff, finance, command center, warehouse, analytics",
        "Unified data model — one shape across every module",
        "FHIR R4 compliant — interoperable from day one",
      ],
    },
    ka: {
      chapterTitle: "ოპერაციული სისტემა",
      notesTitle: "ერთი შესვლა. მთელი ჰოსპიტალი.",
      notesSubtitle: "სადაც იწყება ყველა ცვლა — და საიდანაც იმართება ყველაფერი.",
      notesBullets: [
        "ექიმის სივრცე — პაციენტები, დავალებები, შეტყობინებები ერთ ეკრანზე",
        "კულისებში — პერსონალი, ფინანსები, მართვის ცენტრი, საწყობი, ანალიტიკა",
        "ერთიანი მონაცემთა მოდელი — ერთი ფორმა ყველა მოდულში",
        "FHIR R4 სტანდარტი — ინტეროპერაბელური პირველივე დღიდან",
      ],
    },
    durationMs: 23500,
  },

  // ── 0:22–1:07 — Patient hub → bed board → unified card → chart ──────
  {
    kind: "video",
    video: "/walkthrough/clips/patient-hub-to-chart.mp4",
    audio: "/walkthrough/audio/patient-hub-to-chart.mp3",
    chapter: {
      number: "02",
      title: "The Clinical Core",
      duration: "0:46",
      slug: "clinical-core",
    },
    notes: {
      title: "The chart is the workflow. The AI is the brain.",
      subtitle: "Every byte of clinical data feeds one coherent picture.",
      bullets: [
        "Patient hub — cohort and floor view in one screen",
        "Bed board — real-time availability, drag-drop transfers",
        "Unified card — orders, notes, handoff, discharge in one place",
        "Twenty-year history — structured, searchable, per patient",
        "AI brain layer — summarizes the patient, drafts shift handoff",
        "Safety net — flags drug interactions and allergies before the bedside",
      ],
    },
    ka: {
      chapterTitle: "კლინიკური ბირთვი",
      notesTitle: "ჩანაწერი არის სამუშაო პროცესი. AI არის ტვინი.",
      notesSubtitle: "კლინიკური მონაცემის ყოველი ბაიტი ერთ მთლიან სურათს ქმნის.",
      notesBullets: [
        "პაციენტების ჰაბი — კოჰორტა და განყოფილების ხედი ერთ ეკრანზე",
        "საწოლების დაფა — ხელმისაწვდომობა რეალურ დროში, გადატანა drag-and-drop-ით",
        "ერთიანი ბარათი — დანიშნულებები, ჩანაწერები, გადაბარება, გაწერა ერთ ადგილას",
        "ოცწლიანი ისტორია — სტრუქტურირებული, ძიებადი, თითო პაციენტზე",
        "AI-ტვინის შრე — აჯამებს პაციენტს, ამზადებს ცვლის გადაბარებას",
        "უსაფრთხოების ბადე — აფიქსირებს წამლების ურთიერთქმედებას და ალერგიებს პაციენტთან მისვლამდე",
      ],
    },
    durationMs: 36500,
  },

  // ── 1:11–1:39 — MediScribe: voice → SOAP → ICD codes → form ──────────
  {
    kind: "video",
    video: "/walkthrough/clips/mediscribe-voice-to-chart.mp4",
    audio: "/walkthrough/audio/mediscribe-voice-to-chart.mp3",
    chapter: {
      number: "03",
      title: "MediScribe — Voice to Chart",
      duration: "0:28",
      slug: "mediscribe",
    },
    notes: {
      title: "Doctors don't fill forms. They speak.",
      subtitle: "Voice → SOAP → structured chart, in one pass.",
      bullets: [
        "Live dictation captured straight into MediScribe",
        "AI generates a full SOAP note — subjective, objective, assessment, plan",
        "Every diagnosis ICD-coded straight from the conversation",
        "Allergies and drug reactions surfaced as one-click suggestions",
        "Doctor confirms — the official medical form populates itself",
      ],
    },
    ka: {
      chapterTitle: "MediScribe — ხმა ჩანაწერად",
      notesTitle: "ექიმები არ ავსებენ ფორმებს. ისინი ლაპარაკობენ.",
      notesSubtitle: "ხმა → SOAP → სტრუქტურირებული ჩანაწერი, ერთ ეტაპად.",
      notesBullets: [
        "ცოცხალი კარნახი პირდაპირ MediScribe-ში ჩაიწერება",
        "AI ქმნის სრულ SOAP ჩანაწერს — სუბიექტური, ობიექტური, შეფასება, გეგმა",
        "ყველა დიაგნოზი ICD-კოდირებული პირდაპირ საუბრიდან",
        "ალერგიები და წამლისმიერი რეაქციები ერთ კლიკზე გამოდის რეკომენდაციად",
        "ექიმი ადასტურებს — ოფიციალური სამედიცინო ფორმა თავად ივსება",
      ],
    },
    durationMs: 30000,
  },

  // ── 1:39–2:17 — Lab dashboard → verify report → PACS → DICOM viewer ──
  {
    kind: "video",
    video: "/walkthrough/clips/lab-and-pacs.mp4",
    audio: "/walkthrough/audio/lab-and-pacs.mp3",
    chapter: {
      number: "04",
      title: "Lab & PACS — One Brain Layer",
      duration: "0:38",
      slug: "lab-and-pacs",
    },
    notes: {
      title: "From chart, to lab, to image — one brain.",
      subtitle: "Western-standard lab workflow + native PACS, with AI reading both.",
      bullets: [
        "Lab pipeline — ordered, received, processing, resulted, verified",
        "Western guideline-aligned — reference ranges, flags, structured results",
        "AI reads every value — in patient context, not in isolation",
        "PACS fully native — no third-party viewer, every modality in one space",
        "Imaging AI — flags CT and MRI abnormalities before the radiologist reads",
      ],
    },
    ka: {
      chapterTitle: "ლაბი და PACS — ერთი ტვინის შრე",
      notesTitle: "ჩანაწერიდან ლაბორატორიამდე და გამოსახულებამდე — ერთი ტვინი.",
      notesSubtitle: "დასავლური სტანდარტის ლაბორატორიული პროცესი + ნატიური PACS, და AI კითხულობს ორივეს.",
      notesBullets: [
        "ლაბორატორიული პროცესი — დანიშნული, მიღებული, მუშავდება, შედეგი, დადასტურებული",
        "დასავლურ გაიდლაინებთან შესაბამისი — სარეფერენსო ნორმები, აღნიშვნები, სტრუქტურირებული შედეგები",
        "AI კითხულობს ყველა მაჩვენებელს — პაციენტის კონტექსტში, და არა იზოლირებულად",
        "PACS სრულად ნატიური — მესამე მხარის მნახველის გარეშე, ყველა მოდალობა ერთ სივრცეში",
        "გამოსახულების AI — აღნიშნავს CT და MRI პათოლოგიებს რადიოლოგის დათვალიერებამდე",
      ],
    },
    durationMs: 39000,
  },

  // ── 2:17–2:50 — AI Assistant: case-from-patient → reasoning → KB upload ──
  {
    kind: "video",
    video: "/walkthrough/clips/ai-assistant.mp4",
    audio: "/walkthrough/audio/ai-assistant.mp3",
    chapter: {
      number: "05",
      title: "AI Assistant — Medical-Grade Copilot",
      duration: "0:33",
      slug: "ai-assistant",
    },
    notes: {
      title: "The medical brain, in every patient context.",
      subtitle: "Medical-grade AI you can trust — grounded in your hospital's guidelines.",
      bullets: [
        "Open from any patient — full clinical context auto-loads",
        "Quick Consult or Case Study — discuss a patient or workshop a case end-to-end",
        "Up-to-date guidelines — answers anchored in current medical literature",
        "Hospital knowledge base — upload your protocols, research, case studies",
        "Your practice, your AI — follows your guidelines, not a generic textbook",
      ],
    },
    ka: {
      chapterTitle: "AI ასისტენტი — სამედიცინო დონის თანაშემწე",
      notesTitle: "სამედიცინო ტვინი — ყველა პაციენტის კონტექსტში.",
      notesSubtitle: "სამედიცინო დონის AI, რომელსაც ენდობით — დაფუძნებული თქვენი ჰოსპიტლის გაიდლაინებზე.",
      notesBullets: [
        "გახსენით ნებისმიერი პაციენტიდან — სრული კლინიკური კონტექსტი ავტომატურად იტვირთება",
        "სწრაფი კონსულტაცია ან კეის-სტადი — განიხილეთ პაციენტი ან დაამუშავეთ შემთხვევა ბოლომდე",
        "განახლებული გაიდლაინები — პასუხები დაფუძნებული აქტუალურ სამედიცინო ლიტერატურაზე",
        "ჰოსპიტლის ცოდნის ბაზა — ატვირთეთ თქვენი პროტოკოლები, კვლევები, კეის-სტადიები",
        "თქვენი პრაქტიკა, თქვენი AI — მიჰყვება თქვენს გაიდლაინებს, და არა ზოგად სახელმძღვანელოს",
      ],
    },
    durationMs: 32500,
  },

  // ── 2:38–2:54 — Patient portal + research recruitment (1.5x video pace) ──
  {
    kind: "video",
    video: "/walkthrough/clips/patient-portal-research.mp4",
    audio: "/walkthrough/audio/patient-portal-research.mp3",
    chapter: {
      number: "06",
      title: "Patient Portal + Research",
      duration: "0:15",
      slug: "patient-portal-research",
    },
    notes: {
      title: "The patient gets the same platform.",
      subtitle: "Portal, telemedicine, billing, meds, labs — plus AI-matched research recruitment.",
      bullets: [
        "Patient portal — appointments, messages, health records, AI assistant",
        "Telemedicine, billing, medications, labs — every touchpoint in one app",
        "Research recruitment — AI scans the entire hospital database",
        "Matches every patient to the active trials they fit",
      ],
    },
    ka: {
      chapterTitle: "პაციენტის პორტალი + კვლევა",
      notesTitle: "პაციენტი იღებს იმავე პლატფორმას.",
      notesSubtitle: "პორტალი, ტელემედიცინა, ბილინგი, მედიკამენტები, ანალიზები — პლუს AI-ით შერჩეული კვლევებში ჩართვა.",
      notesBullets: [
        "პაციენტის პორტალი — ვიზიტები, შეტყობინებები, ჯანმრთელობის ჩანაწერები, AI ასისტენტი",
        "ტელემედიცინა, ბილინგი, მედიკამენტები, ანალიზები — ყველა შეხების წერტილი ერთ აპში",
        "კვლევებში ჩართვა — AI ასკანერებს მთელ ჰოსპიტლის ბაზას",
        "უსადაგებს თითოეულ პაციენტს მისთვის შესაფერის აქტიურ კვლევებს",
      ],
    },
    durationMs: 15500,
  },
];

export const TOTAL_MS = scenes.reduce((acc, s) => acc + s.durationMs, 0);
if (typeof window !== "undefined" && import.meta.env?.DEV) {
  // eslint-disable-next-line no-console
  console.log(`[walkthroughScenes] Total runtime: ${TOTAL_MS / 1000}s`);
}

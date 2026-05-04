// 3-minute investor walkthrough — 16 scene entries totaling 180s exactly.
// Layout:  5 montage shots (9s) → 10 anchor scenes (150s) → 1 end card (21s)
// Image paths are relative to /deck-assets/.  Some shots will be replaced
// with fresh Playwright captures from medplum_medimind once available; until
// then we use the existing renders shipped in the deck appendix.

export type Scene =
  | {
      kind: "montage";
      image: string;
      sectionTitle?: string; // shown only on first montage shot, persists through cuts via CSS
      durationMs: number;
    }
  | {
      kind: "anchor";
      image: string;
      secondaryImage?: string; // hard-cut to this at cutAtMs
      cutAtMs?: number;
      caption: string;
      label?: string;
      durationMs: number;
    }
  | {
      kind: "end";
      title: string;
      subtitle: string;
      cta: string;
      tiles: string[];
      durationMs: number;
    };

const ASSET = (name: string) => `/deck-assets/screenshots/${name}`;
// Fresh Playwright captures live in a sibling subdir so they don't shadow the
// 16 polished mockups when the scene references the same filename.
const FRESH = (name: string) => `/deck-assets/walkthrough/${name}`;

export const scenes: Scene[] = [
  // ── 0:00–0:09 — Cold-open montage (5 cuts × 1.8s = 9s) ───────────────
  {
    kind: "montage",
    image: ASSET("command-center.png"),
    sectionTitle: "MediMind. The hospital OS for our region.",
    durationMs: 1800,
  },
  { kind: "montage", image: ASSET("ai-chat.png"), durationMs: 1800 },
  { kind: "montage", image: ASSET("mediscribe.png"), durationMs: 1800 },
  { kind: "montage", image: ASSET("dicom.png"), durationMs: 1800 },
  { kind: "montage", image: ASSET("bed-board.png"), durationMs: 1800 },

  // ── 0:09–0:24 — MediScribe deep dive ──────────────────────────────────
  {
    kind: "anchor",
    image: ASSET("mediscribe.png"),
    caption:
      "Doctor speaks Georgian. SOAP note appears. No typing.",
    label: "Live · KA → SOAP · 2.4s",
    durationMs: 15000,
  },

  // ── 0:24–0:39 — Patient 360 ───────────────────────────────────────────
  {
    kind: "anchor",
    image: ASSET("patient-360.png"),
    caption:
      "Twenty years of a patient's life — visits, labs, meds, images — on one timeline.",
    label: "Patient 360 · AI summary",
    durationMs: 15000,
  },

  // ── 0:39–0:54 — AI Co-pilot ───────────────────────────────────────────
  {
    kind: "anchor",
    image: ASSET("ai-chat.png"),
    caption:
      "“Why is this patient's troponin trending up?” The answer cites the chart.",
    label: "Co-pilot · Cardiology mode",
    durationMs: 15000,
  },

  // ── 0:54–1:09 — CPOE → MAR closed loop (hard cut at 8s) ──────────────
  // CPOE shot is a fresh capture from the live build — shows Nino's real meds.
  {
    kind: "anchor",
    image: FRESH("cpoe.png"),
    secondaryImage: ASSET("mar.png"),
    cutAtMs: 8000,
    caption:
      "One click orders a med. The nurse scans the barcode at the bedside.",
    label: "CPOE → MAR · closed loop",
    durationMs: 15000,
  },

  // ── 1:09–1:24 — Mobile nursing (fresh portrait capture) ──────────────
  {
    kind: "anchor",
    image: FRESH("nursing-mobile.png"),
    caption: "A nurse runs her shift from a phone — vitals, tasks, handoff.",
    label: "Mobile-native · live build",
    durationMs: 15000,
  },

  // ── 1:24–1:39 — DICOM / PACS ──────────────────────────────────────────
  {
    kind: "anchor",
    image: ASSET("dicom.png"),
    caption:
      "On-prem PACS. CT angiogram with CAD-RADS scoring inline.",
    label: "PACS · DICOM · CAD-RADS",
    durationMs: 15000,
  },

  // ── 1:39–1:51 — MOH submission ────────────────────────────────────────
  {
    kind: "anchor",
    image: ASSET("moh.png"),
    caption: "One click. ICD-mapped. Submitted to Georgia's Gov-EHR.",
    label: "Gov-EHR · 1-click",
    durationMs: 12000,
  },

  // ── 1:51–2:03 — Trilingual proof (placeholder until captured) ─────────
  // TODO: replace with composed `trilingual-en/ka/ru.png` triptych.
  {
    kind: "anchor",
    image: ASSET("patient-360.png"),
    caption: "Same chart, three languages, zero re-training.",
    label: "EN · ქართული · RU",
    durationMs: 12000,
  },

  // ── 2:03–2:21 — Revenue cycle → Coordinator (hard cut at 9s) ─────────
  {
    kind: "anchor",
    image: ASSET("revenue-cycle.png"),
    secondaryImage: ASSET("coordinator.png"),
    cutAtMs: 9000,
    caption:
      "The CFO sees DSO drop. The coordinator clears pre-op debt before admission.",
    label: "CFO · Revenue cycle  →  Coordinator",
    durationMs: 18000,
  },

  // ── 2:21–2:39 — Bed board → SBAR handoff (hard cut at 9s) ────────────
  {
    kind: "anchor",
    image: ASSET("bed-board.png"),
    secondaryImage: ASSET("handoff.png"),
    cutAtMs: 9000,
    caption:
      "Drag a patient to a new bed. SBAR handoff carries every detail forward.",
    label: "Bed board  →  SBAR",
    durationMs: 18000,
  },

  // ── 2:39–3:00 — End card ──────────────────────────────────────────────
  {
    kind: "end",
    title: "MediMind",
    subtitle: "One platform. Fourteen modules. Built for hospitals.",
    cta: "medimind.md  ·  team@medimind.md",
    tiles: [
      ASSET("laboratory.png"),
      ASSET("form-builder.png"),
      ASSET("research.png"),
      ASSET("mediscribe.png"),
    ],
    durationMs: 21000,
  },
];

export const TOTAL_MS = scenes.reduce((acc, s) => acc + s.durationMs, 0);
// Sanity: TOTAL_MS should equal 180000.  See unit-style assertion in dev.
if (typeof window !== "undefined" && import.meta.env?.DEV && TOTAL_MS !== 180000) {
  // eslint-disable-next-line no-console
  console.warn(
    `[walkthroughScenes] Total duration is ${TOTAL_MS}ms, expected 180000ms`,
  );
}

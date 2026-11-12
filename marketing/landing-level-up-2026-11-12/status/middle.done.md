# Middle lane: done

Commit `99afe2a` on `landing-level-up`.

## Files changed

- `src/content/landing.story.ts` (new): every string and image for the five sections, copy deck Part 2 §4 to 7 word for word with the Part 9 rulings. It also holds a small `landingShot(id, height, alt, sizes?)` helper that builds the AVIF/WebP `srcset` from the `public/landing/<id>-800/1400/2000` naming. I did not import `manifest.json` directly because `tsconfig.app.json` has no `resolveJsonModule`.
- `src/components/Landing/WhatChangesSection.tsx` (`#system`, pale)
- `src/components/Landing/ExamplesSection.tsx` (`#examples`, white)
- `src/components/Landing/SwitchPlanSection.tsx` (`#switch`, pale)
- `src/components/Landing/AiTodaySection.tsx` (`#ai`, white)
- `src/components/Landing/VisionSection.tsx` (`#vision`, **changed from navy to pale**. The navy now sits only on the punch block inside it, so the punch is the one loud moment and the page rhythm stays white/pale up to Control.)

## Images per place

| Place | Image id | Why |
|---|---|---|
| What changes | `os-modules` | `os-modules-full` is not in the manifest. Alt text and caption ("MediMind management view · demo data") come from the copy deck. |
| Example A, billing | `billing-funding` | `billing-claims` is not in the manifest. Caption "State and municipal funding requests · demo data", alt text from the manifest. Shown full width under the text so the screen stays legible. |
| Example B, warehouse | none | `warehouse-stock` is not in the manifest. Built text-only, same row layout as A. Nothing is drawn. |
| AI today | `ai-chat-answer` | Caption: "MediMind AI chat · the clinician asked for a brief summary of the patient's condition · demo data". Below 768px the image shows at 140% width (the empty right third is cropped) so the answer can be read; `sizes` asks for a larger file there. |
| Proof logo | `customer-logo-dark` / `customer-logo-white` | Rendered only when `showCustomerName` is true, dark/white by theme, 140px wide. |

When a fresh capture lands, change one id and its 2000px height in `landing.story.ts`. For warehouse, add `image`, `imageLabel` and `caption: 'MediMind warehouse · demo data'` to the second example. The component already renders it full width under the row.

## Design notes

- Three text levels per section: `mm-h2` for L1 (the punch line is set at the same size), `mm-lead`/`mm-h3` for L2, and body/eyebrow/caption for L3. One accent per section: the headline phrase. Success lines use `mm-link`, the small-text form of the same blue.
- Plan columns: on desktop (lg and up) they read left to right as a segmented 4px track. Below lg they become one continuous 4px line running down the left side (the columns were too narrow at 768). The switch points also stack below lg.
- Vision pairs: on md and up, a two-column list with column headers and an arrow between the two halves of each pair. On phones each pair is stacked, and every cell carries its own "The reactive/proactive hospital" label. Screen readers always get those labels (visually hidden on md and up; the visual header row is `aria-hidden`).
- The "In development" chip sits at the top of the section and again inside the navy punch block. The table header says "(in development)".
- The practice case is an `<aside>` with a thin left rule and plain text, shown only when `showPracticeCase` is true.
- Headlines use `text-balance`, and accent phrases don't wrap from md up, so no line ends on a single word. Body paragraphs are capped at `max-w-2xl`.
- Motion is `Reveal` only. No icons except one `ArrowRight` (lucide) in the vision pairs, where it carries the "from → to" meaning.

## What I verified (own tab on :5180, closed after)

- 1440×900 light and dark, 768×1024 light, 375×812 dark (the shared profile's stored theme). I looked at every section and fixed what looked off: heading widows, the outcome line coming before the lines on phones, the 3-column squeeze at 768, the punch line widow on phones and the tiny AI image on phones.
- `scrollWidth == innerWidth` at all three widths. No console errors.
- Images load as AVIF (`os-modules-2000.avif`, `billing-funding-2000.avif`, `ai-chat-answer-2000.avif` at 1440 with DPR 2; 800 on phone before the sizes fix). Every image has width/height and `loading="lazy"`.
- Headings: each section has h2, then h3 (the plan columns are h4 under the h3 "From zero to live in 90 days."). Checked in the DOM.
- Contrast: a script measured every text node in my five sections against its real background in both themes. No AA failures. Lowest ratio 3.68 light (the large accent phrase), 6.54 dark. The navy block is included.
- Reduced motion: my files add no animation; `Reveal` and the global `prefers-reduced-motion` rule (checked in the loaded CSS) cover the rest.
- `npx eslint` on my 6 files: clean. `tsc` showed no errors in my files.

## Not done / open

- No `warehouse-stock`, `billing-claims` or `os-modules-full` in the manifest when I finished. The ruling fallbacks are in place.
- The `showCustomerName = true` path (named proof line, quote, logo) was built but not viewed in the browser, because I don't own `site.ts`.
- Reduced motion was checked in code and CSS, not with an emulated OS setting (the pane has no such switch).
- Copy gap: the AI caption wording beyond "MediMind AI chat · demo data" is mine, following the orchestrator ruling. The copy lane may want to approve it.

## Requests

- Orchestrator: `VisionSection` tone changed navy → pale (see above). If the foundation's section table is kept as reference, update it.
- Top lane (Header): the nav anchors for my sections are `#system`, `#examples`, `#switch`, `#ai`, `#vision`.

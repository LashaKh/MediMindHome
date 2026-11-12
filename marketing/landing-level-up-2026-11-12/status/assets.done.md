# assets lane: done

Date: 2026-11-12.

## What changed (files)

- `public/landing/` (new): 59 image files plus `manifest.json`.
- `marketing/landing-level-up-2026-11-12/07-asset-manifest.md`: per-image notes, rejected list, gaps.

## Ready (id → section)

- `hero-bed-board` → hero
- `os-modules` → what changes ("one operating system")
- `billing-funding` → billing example (state and municipal funding requests; closest honest substitute)
- `lab-orders` → lab (doctor's lab and imaging orders; closest honest substitute)
- `imaging-viewer` → imaging
- `patient-chart` → patient chart
- `ai-chat-answer` → AI today
- `team-founders` → team
- `customer-logo-dark`, `customer-logo-white` → proof strip, only when `showCustomerName` is true

Each `manifest.json` entry matches the frame's `ResponsiveImage` type (`alt`, `width`, `height`, `fallback`, `avif` and `webp` srcsets, `sizes`), plus `aspectRatio` and a `files` list.

## What I checked and how

I opened all 22 source images and recorded names, IDs, dates of birth, phones, account emails and internal hosts. Every screenshot was cropped to remove them. I then opened every crop and two decoded AVIFs again to confirm that nothing private remains and the text is sharp.

## Rejected

command-center (account email, "EMR", build line), laboratory, moh, research, nursing and handoff (patient names that cannot be cropped), revenue-cycle (visibly wrong numbers and a real insurer name), mediscribe (founder's name as the patient, looping placeholder text), mar and form-builder (not needed), hospital-vision (AI render, not product). Reasons are in `07`.

## Not done / missing

- No warehouse screenshot exists. A fresh capture is needed (spec in `07`, "Gaps").
- A proper billing (revenue cycle or claims) screen, a lab queue with invented names, and a MediScribe note are also wanted.
- Confirm with Lasha that the angiogram in `imaging-viewer` may be shown publicly.

## Requests for other lanes

- Builders: caption every screenshot "demo data". Load the hero eagerly with `fetchpriority="high"` and lazy-load the rest. Show the logos at 190 px or smaller.
- Copy: the `ai-chat-answer` image does not include the question, so the caption should say what was asked ("Summarise this patient briefly").

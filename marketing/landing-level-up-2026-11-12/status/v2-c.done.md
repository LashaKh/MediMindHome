# Lane C (v2): done

Product (`#product`), brain (`#brain`) and proof (`#proof`). Code commit `239fb0a` on `landing-level-up`.

## Files

| File | What |
|---|---|
| `src/content/landing.v2.c.ts` | Every string and image id for the three sections, plus crop and callout coordinates |
| `src/components/Landing/ProductSection.tsx` | Six areas, each with name, status mark, one line and a composition. From 1280px a sticky index follows the scroll and jumps between areas |
| `src/components/Landing/ProductPlate.tsx` | `CroppedShot` (zoom into part of a screenshot), the focus plate (small map of the whole screen with the focus boxed, the detail lifted in front, numbered points, margin labels from 1024px, a numbered key below on smaller screens and for screen readers), the strip plate (a wide strip lifted over a second screen; on phones it splits into two halves), and the flow diagram |
| `src/components/Landing/ProductPlate.styles.ts` | Drafting-grid backdrop and lift shadow (shared with the brain section) |
| `src/components/Landing/ProductSection.css` | The flow diagram path and its pulse. The pulse runs twice when it comes into view (under 5 s), then stops. Hidden under reduced motion |
| `src/components/Landing/BrainSection.tsx` | Opening, "Today, AI drafts. A person signs." with the chat screen, the inbox of prepared work (labelled Illustration and In development), and the dial stage |
| `src/components/Landing/BrainDial.tsx` | The autonomy dial, the readout, the three fixed limits and the off switch |
| `src/components/Landing/ProofSection.tsx` | Four-number ledger plus the recognitions |

## How the dial works

- It is one ARIA `slider` (0 to 5, `aria-valuetext` = step name + what the system does + what the person does). It starts at Watch.
- Ways to turn it: drag or tap the ring (pointer events, with a click fallback for touch browsers that only send a click); the − / + buttons (44px) in the open gap at the bottom of the ring; arrows, PageUp/PageDown, Home and End; on phones, six step buttons in two rows with the signature line between them.
- **The signature line** is a fixed amber mark at twelve o'clock between Prepare and Act and tell. The track is solid to its left (a person releases everything) and dashed to its right (only work with no medical decision, nothing leaving the hospital and no money). The readout says which side you are on.
- Each step shows a concrete job: discharge paperwork for watch, suggest and prepare; bed turnover for the three steps past the line (administrative, internal, no money).
- The three limits sit under the dial as "Fixed" plates that never react to it. The off switch (`aria-pressed`) dims and locks the dial, and the readout says "The hospital keeps running without it."
- The glow behind the dial gets brighter as the step goes up (blue = system working). The needle and arc move on a spring; under reduced motion they jump with no animation.

## Image ids used

| Area | Image id | Notes |
|---|---|---|
| Clinical record | `patient-chart` | Focus: alerts, problems, medications |
| Laboratory | `lab-orders` | Focus: lab group and imaging order. `lab-queue` was never captured (see fresh-shots note) |
| Imaging | none | Labelled diagram "How a study travels. Diagram." `imaging-viewer` not used (ruling) |
| Pharmacy and stock | `warehouse-stock` | Fresh capture. Focus: low-stock filter, red counts, expiry |
| Billing | `billing-revenue` in front of `billing-funding` | Fresh strip lifted over the funding request screen. Caption names both |
| Staff and management | `os-modules-full` | Fresh capture. Focus: the category sidebar |
| Brain, today | `ai-chat-answer` | Caption says the clinician asked for a brief summary of the patient's condition |

Every screen caption ends "Demo data." All images are AVIF/WebP with `srcset` and `sizes` worked out from the zoom, `loading="lazy"`, and intrinsic width and height. The minimap copies are `alt=""`; each detail carries the manifest alt text.

## What I verified (own tab on :5180, closed after)

- **Sizes:** 1440×900, 1024×768, 768×1024 and 375×812. Light and dark at 1440; dark at 375; light at 768 and 1024. `scrollWidth == innerWidth` at every size.
- **Headings:** h2 then h3 in each section, plus one h4 for the limits under the dial h3. The page has one h1.
- **Dial:** End→5, ArrowLeft→4, Home→0, ArrowUp→1, PageUp→2. The accessible name and value text are present. A tap on the ring at 375 set the step (Act and tell). The off switch sets `aria-disabled` and `tabIndex=-1` on the slider and shows the off message; turning it back on restores the step. All visible buttons are at least 44px tall.
- **Contrast:** a script checked every text node in all three sections, with opacity applied, against the effective background. 0 failures in light and 0 in dark.
- **Lint:** `npx eslint` on the 7 TS/TSX files: 0 errors, 0 warnings.
- **Console:** nothing new from my files. The buffer still holds a transient parse error from one of my mid-edit saves (since fixed) and a lane D `laneD.styles.ts` export error.

## Not done / open

- **Reduced motion** was checked by reading the code, not in the browser, because the pane cannot emulate `prefers-reduced-motion`. Every framer animation uses `useReducedMotion()`: no initial offset, the spring jumps, the proof rules start drawn, the flow pulse is hidden. Content is never hidden, since entrances only use transform.
- **Imaging** has no screen until the founders clear `imaging-viewer` or a new capture exists. Swapping it in means changing `kind` to `'screen'` in the content file and adding a crop and callouts.
- **Laboratory** shows the doctor's order list, not the lab's own queue. A clean `lab-queue` capture would be stronger.
- **Billing strip:** the demo figures show low collections against charges (1,240 vs 16,650). The callouts describe the flow, not the numbers. A capture with believable demo data would be better.
- The inbox cards and the dial examples ("bed 12") are labelled illustrations of work in development, not product screens.
- **Shared look (lane A):** the header shows a white band above it while scrolling at some sizes. That is not in my files, and I left it alone.

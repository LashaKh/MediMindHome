# Lane C, round 4: done

## Files changed
- `src/components/Landing/ProductSection.tsx`: headline (second line in the quieter voice), one line, "Real screens, demo data." Then one hero scene at full grid width and three supporting scenes (pharmacy and stock large on the left; laboratory and billing stacked right).
- `src/components/Landing/ProductPlate.tsx` (rewritten): `Shot` (a crop of a real screen), `Window` (slim named top bar, thin highlight edge, long soft shadow), `HeroScene`, `SceneStage`.
  - Hero scene: the clinical record in front of every hospital area (the area dashboard behind it, overlapping), two thin callouts: a ring and leader on the drug interaction banner ("Drug interaction flagged") and a lens that lifts the warfarin line with its high-alert mark, joined to its source by a fine cone. Name and tag sit in the open band above the record.
  - Supporting scenes: the screen runs off the stage's right and bottom edges so it reads large. Billing has the revenue figures lifted across the funding screen.
  - The composed scenes start at 1024. Below that each one shows a single clean window (the record cropped to two columns on phones, three on tablets).
- `src/components/Landing/BrainSection.tsx`: dial section unchanged in words. Real harness screens added underneath.
- `src/components/Landing/BrainScreens.tsx` (new helper): Control Center large, Workers (each with its own level dial) over its edge, Money across its foot. Two thin callouts: "One switch stops it" on the Stop control, and "Capped by a person" in amber on the selected level. Names and tags sit under the scene, then Proof as a wide band. "Screens from the harness in development. Demo data." The "In development" chip stays at the top of the section.
- `src/components/Landing/BrainDial.tsx`: now drawn like an instrument: double bezel hairline, a fine tick every 3 degrees with long ticks at each step, dotted inner scale, a lit hub face with an inner ring, a tapered needle, a knob with a centre, and a soft amber glow on the signature line. Input and ARIA unchanged.
- `src/components/Landing/ProofSection.tsx`: a ledger. Hairline column rules, figures use the shared `mm-stat` (no hard-coded size), the plus is set smaller and raised, 25 dots under "25" and 60 ticks under "60 days". Backers sit in one quiet row with hairline separators.
- `src/components/Landing/LaneCScreens.css` (new, mine): stage, window, chrome, chip, ring and slot looks for day and night.
- `src/components/Landing/laneC.manifest.ts` (new): reads `public/landing/manifest.json` at runtime. Also `useIsDark` and `useMinWidth`.
- `src/content/landing.v2.c.ts`: hero, scenes, callouts, brain screen entries (frame, focus, pin), proof marks.
- `ProductPlate.styles.ts` and `ProductSection.css` are no longer imported. Both left in place (no deletes).

## Night mode and the captures
- A screen's night twin (`<id>-dark`) replaces it automatically. Only the screen in view is downloaded: one theme, one layout. In night mode the page waits for the manifest so a light screen is never fetched and then swapped.
- Until a twin exists, the light capture is settled on ink (dimmed a little, with a soft foot shadow) so it is never a raw white slab.
- Present now: twins for brain-control-center, brain-workers, brain-money, brain-proof, os-modules-full, billing-revenue and warehouse-stock. Still light in night mode: patient-chart, lab-orders, billing-funding. They light up with no code change once their `-dark` ids land.
- The brain inbox and the separate morning brief were dropped by the capture agent (real branch names in the inbox; the brief already sits inside the Control Center). Their entries were removed. A missing brain id shows a named empty frame in dev only and is left out of the built page.
- brain-proof tops out at 1356px. At the band's width that is about 1.8x on a 2x screen: slightly short of full 2x.

## Checked
- In-app browser at 1440 and 1728, day and night, for all three sections, plus 1024, 768 and 375. Iterated: lens placement and size, callout points, a phone crop that started on blank space, stages composing too small at 768, brain geometry and its empty corners, proof recognitions wrapping, a "+" that rendered at 9px.
- No horizontal scroll at 1728, 1440, 1024, 768 or 375 (scrollWidth equals the viewport).
- Dial: arrow keys move it (aria-valuetext updates). Callouts are aria-hidden and their words are repeated in the figcaptions for screen readers.
- `npx eslint` is clean on every file I touched. No em or en dashes, no "the first", no `imaging-viewer`, no 90.

## Not done / notes
- I did not test a real screen reader or forced colours.
- Proof stays within the shared stat scale (about 82 to 88px), so it reads calm rather than loud. If the founder wants a bigger moment, the shared `mm-stat` is lane A's lever.
- The supporting scene tags are my wording: "Low stock flagged before the shelf is empty.", "Every order and its status, one list.", "Charges straight from the record."

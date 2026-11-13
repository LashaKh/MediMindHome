# Lane B v3: done

Commit `f236868` on `landing-level-up`, plus this note.

## Files changed

- `src/components/Landing/BeliefSection.tsx` (#belief): rewritten. No more sticky scroll story, contrast block or scroll-lit lines.
- `src/components/Landing/FragmentsSection.tsx` (#problem): headline left, picture right. No pinned 240vh runway, no lead, no "AI add-ons / old record systems" block.
- `src/components/Landing/FragmentsField.tsx`: bigger tiles on wide columns.
- `src/components/Landing/AnatomyOsSection.tsx` (#system): headline beside the figure, five parts in one row across the page.
- `src/components/Landing/BeliefSection.css`: belief type a little larger, two unused size classes removed.
- `src/content/landing.v2.b.ts`: every string cut down.
- Not rendered any more (files kept, they still compile): `BeliefInstrument.tsx`, `BeliefContrast.tsx`. The content file keeps the `reactive` / `proactive` strings only for `BeliefContrast`.

## What the reader sees now

- **Belief:** "A case from my practice" with Dr. Lasha Khoshtaria, interventional cardiologist. Below it, one night chart across the full width in four beats, each with a big mono marker and a small chart that fills in once as it scrolls into view: 02:00 "After a heart procedure, a patient developed pancreatitis." · The record "The signs were in the record." (three red signs buried in the record) · 14 hours "Nobody put them together." · 20 days "In intensive care." Then the `h2` at display scale: "We believe no patient should be missed at 2 a.m. In any hospital. Anywhere." with "That night is why we build." beside it on xl screens. It never claims MediMind would have saved the patient.
- **Problem:** the `h2` "Forty systems run a hospital. None of them sees the whole patient." on the left. On the right, the forty scattered programs with broken links and red gap labels close into one block, "One record. One system.", as the picture reaches the middle of the screen. No body text.
- **System:** the `h2` "A hospital with a body made of software." beside the figure. Then Heart holds "The record, ground-up on FHIR R4." · Brain thinks "AI prepares. A doctor signs." with a "Partly in development" badge · Muscle acts "Every action through one audited door." · Skin meets "One system for every role." · Nerve feels "Every change, traced as it happens." Hover, focus or tap lights that part in the figure. With nothing chosen, the whole body is lit.

## Numbers

- Height at 1728 px: belief 4567 to 946, problem 3441 to 732, system 1940 to 821. **Total 9948 to about 2500 px.**
- Words shown (innerText): belief 153 to 58, problem 201 to 81 (about 60 of those are the tile names inside the picture), system 290 to 57. **Total 644 to 196.**
- Phone (375): belief 1139, problem about 850, system about 1100.

## Facts (ruling 2)

Grep of my files: no "signed", "in daily use", lab or imaging status, "15 months", "90", "walks in", and no em or en dashes. The fragment tile "Analysers" became "Infection control", so no analyser wording is left.

## Checked (my own tab on localhost:5180)

- Widths 1728, 1440, 1024 and 375, in light and dark theme (header toggle). Day mode is light in all three sections. I found no hard-coded colours or white alphas; all colour comes from `mm-*` and `--lb-*` tokens, which map to `mm-*`.
- `scrollWidth == innerWidth` at every width.
- Headings: belief h2; problem h2; system h2 plus five h3.
- Contrast: a script checked every text node in the three sections in both themes. No pair is below AA.
- Keyboard: Tab moves through the five anatomy buttons. Each shows a visible focus ring and lights its layer. `aria-pressed` follows a click, and a second click clears it.
- `npx eslint` on all 8 lane B files: clean.

## Not done / open

- I checked reduced motion by reading the code, not by emulating it. With reduced motion the belief charts render full, the fragments picture shows the static scattered state (the "One record" join does not show), and the CSS loops are off.
- The `showPracticeCase = false` path (three generic beats) was checked by reading only.
- I did not check 768 separately. Its layout is the sm 2-column one: belief beats in 2 columns, anatomy cards in 2 columns with Nerve alone on the last row.
- Lane C's files were mid-edit during my session (`ProductPlate.tsx` exports went missing for a minute and blanked the page). It recovered by itself, and nothing is needed from them.
- Lasha still has to confirm the case wording before go-live.

# Lane B v2: done

Commit `20be27b` (sections) on `landing-level-up`, plus this note.

## Files (all lane B)

- `src/components/Landing/BeliefSection.tsx` (#belief), with helpers `BeliefInstrument.tsx` (the night-shift panel), `BeliefContrast.tsx` (reactive vs proactive), `BeliefSection.css` (shared `lb-` styles for all three sections)
- `src/components/Landing/FragmentsSection.tsx` (#problem), with `FragmentsField.tsx` (the forty-system picture)
- `src/components/Landing/AnatomyOsSection.tsx` (#system), with `AnatomyOsFigure.tsx` (the SVG body)
- `src/content/landing.v2.b.ts`: every string of the three sections

## Headlines

- **Belief:** "We believe no patient should be missed at 2 a.m. In any hospital. Anywhere." (the `h2`, hero scale, lit line by line on scroll). Before it, the case as a scroll story: a sticky instrument (clock 02:00, the long record with three buried signs in red, fourteen hour cells, twenty day cells) beside four beats, then the turn "Every sign was in the system. The system waited to be asked. That night is why we build.", then reactive vs proactive with small figures (scattered signs and a waiting cursor; one prepared item with the amber "A doctor decides" mark and the "In development" badge). `showPracticeCase` false swaps the four beats for a two-beat generic night and drops the author line and the turn.
- **Problem:** "Forty systems run a hospital. None of them sees the whole patient." Pinned picture: one patient in the middle, forty program tiles scattered around with broken links and red gap labels (typed in twice, phoned through, printed and carried…). Scrolling closes the gaps; the tiles gather around the patient, their borders dissolve into one surface: "One record. One system." Then "You cannot add intelligence to fragments." with two `h3`s (AI add-ons, Old record systems) and the resolve line.
- **System:** "A hospital with a body made of software." A fine-line figure in a circle (Heart at the centre, Brain in the head, Muscle in the outlined limbs reaching to ministry, insurer, pharmacy, devices, Skin as the circle where doctor, nurse, patient and finance meet it, Nerve signals travelling inside the limbs) beside five always-visible rows in the locked order, each an `h3` button. Heart carries the moat ("Built ground-up on FHIR R4 … One of the first hospital operating systems built this way … never locked in"); Brain carries "Partly in development" and "A doctor signs every medical decision". Closes on the memory line.

## Aligned with `v2-design-language.md`

Fraunces 400 only (section `h2`s use `mm-h2`; the belief uses hero scale on purpose), Plex Mono for markers, colour only from tokens (`--mm-system` blue, `--mm-human` amber, `--mm-alert` red for harm), `mm-dev-badge`, `mm-mark-system`, `mm-mark-human`, `mm-accent-text` for the second clause, 2px/3px focus, `max-w-page` edge. No font imports of my own (main.tsx loads them).

## Verified (own tab on localhost:5180, closed after)

- Sizes: 1440x900, 1024x768, 768x1024, 375x812; light and dark theme (Fragments checked in both; Belief and System are ink in both by design).
- `scrollWidth == innerWidth` at all four sizes. Heading order inside my sections: h2 → h3 only (belief h2; problem h2, 2 h3; system h2, 5 h3).
- Keyboard: Tab reaches each anatomy row; visible focus ring on the whole row; focus lights the matching layer in the figure; `aria-pressed` follows. Hover on rows or figure parts and click/tap also select.
- Contrast: script over every text node in the three sections, light and dark: 0 pairs below AA. Inactive story beats sit at 55% opacity (about 5:1, large text).
- Console: no errors from my files (the only errors seen were a syntax error in lane C's `ProductPlate.tsx` while it was being edited).
- `npx eslint` on all 8 files: clean.

## Not done / open

- Reduced motion was verified by reading the code, not by emulation (the tool cannot set the media query): static beats and belief at full opacity, Fragments renders the complete scattered picture without the pinned runway, CSS loops and transitions off.
- `showPracticeCase = false` path was checked by reading only (I cannot edit `site.ts`).
- Belief lines start at 28% opacity until scrolled into place; the final state is full contrast.
- On phones the figure's small text labels (ministry, doctor…) are hidden; the rows carry the same meaning.
- Lasha still has to confirm the case wording before go-live ("a case from my practice", pancreatitis after a heart procedure, 14 hours, 20 days).
- Header (lane A) is translucent over the ink sections mid-scroll; content shows through it while the belief instrument passes under.

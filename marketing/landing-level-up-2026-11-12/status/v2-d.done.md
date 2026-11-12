# Lane D (v2): done

Commits on `landing-level-up`: `2976dab`, `6fba814`, `d68d42b`, plus this note.
Built on lane A's design language (`status/v2-design-language.md`, commit `0122346`): `tone="navy"` ink canvas, `mm-h2` / `font-display`, `mm-data`, `mm-system` blue and `mm-human` amber. Amber never animates.

## Files changed

- `src/content/landing.v2.lane-d.ts` (new): every lane D string. It is **not** named `landing.v2.d.ts`, because a `.d.ts` file is a TypeScript declaration file and cannot hold runtime strings (TS2846 on import).
- `src/components/Landing/laneD.styles.ts` (new): four shared class strings (display voice, h2, mono, content edge).
- `src/components/Landing/TractionStrip.tsx`, `SwitchPlanSection.tsx`, `FoundersSection.tsx`, `AmbitionWorldSection.tsx`, `ContactSection.tsx`
- `src/components/Demo/ScopingForm.tsx`: **class names only** (panel, inputs, labels). Logic, field names, validation, result states and the submit path are unchanged.
- `src/components/Demo/RequestDemo.tsx`: same content on the ink canvas, heading as the h1.
- `src/components/Layout/Footer.tsx`
- `src/content/landing.trust.ts`: form strings only. Email placeholder and example `name@hospital.org`; phone placeholder "With country code"; question example "claims coming back from insurers". The email helper is now "We reply to this address." The old line ("We send the two time options here.") was wrong in deck mode.

## Sections and headlines

| id | Headline | Idea |
|---|---|---|
| `traction` | (sr-only "MediMind today") | One quiet line on the hero's ink. Signed: a 25-hospital network · Migrated: 1.1M+ patient records · In daily use: laboratory and imaging (steady blue status light) · Backed by: 500 Global. On a phone it becomes a 2×2 grid. |
| `switch` | Replace everything without stopping anything. | The 90 days drawn as two systems side by side. The current system runs solid to day 60, then dashed "Kept as a way back". MediMind starts as a dashed shadow build, then departments light up as separate strands that braid into one glowing line by day 90. Day 30 carries the amber mark "You decide."; day 90 says "You are live." Three stretches sit under the track, followed by "Your data stays yours" (FHIR R4, full export) and the 1.1M+ proof sentence. No price, no terms, no "phases". |
| `team` | Built from inside a hospital. | "MediMind is designed by a cardiologist who still practises." + "The person who feels the problem at 2 a.m. is the one writing the system." Real photo (`team-founders`). Each founder's facts sit under the half of the photo they stand in, with a thin callout tick (wide screens). The backers line comes last. The left column is sticky on desktop. |
| `ambition` | Proven first in Georgia. Built for every hospital. | Ink. A still field of dim points stands for hospitals everywhere; exactly 25 points are lit (the signed network). Three hairline rings widen once: 25 hospitals, then a region, then anywhere. The ring labels show at lg and up. Three steps follow as text, then the belief, set large: "We believe no patient should be missed at 2 a.m. In any hospital. Anywhere." No dates, countries or numbers invented. |
| `contact` | Run your hospital on MediMind. | Ink, continuing the night. "Thirty minutes with the founders, online or at your hospital", with two face crops from the real photo and both names. "You leave with": three problems in your own numbers, a dated 90-day plan, the day-30 measures. "No commitment. Nothing is signed on the call." The form sits on a lifted panel. |
| footer | One hospital. One operating system. | Ink. "Built ground-up on FHIR R4." in mono. Links: Privacy, Contact (mailto), Innovative Startup status, MediMind Expert. All are 44px targets. |

**Deck soft path: kept** as the quiet link under the form ("Not ready for a call? Get the hospital deck by email"). It sits below the primary button and the privacy line, so it never competes with the ask. It still serves investors and board members who are not ready to book.

## Motion and fallbacks

- Each drawing has one `useInView` trigger, on the timeline track or the whole field. A per-shape trigger never fired for the 1280-unit ring on phones. The blue lines draw once; nothing loops.
- Under `prefers-reduced-motion`, `initial={false}` draws everything at its final state, verified in code (the browser tools cannot emulate the media query). Every meaning is real text; the drawings are `aria-hidden`.

## Verified (own tab, http://localhost:5180)

- **Sizes:** 1440×900, 1024×768, 768×1024 and 375×812, in light and dark. `scrollWidth == innerWidth` at all four. One h1 on `/`, `/request-demo` and `/privacy`.
- **Heading order** in my sections: h2 then h3. Traction has an sr-only h2; Ambition has an sr-only h3 over the steps.
- **Contrast:** a WCAG script over every text node in my five sections and the footer, light and dark, found 0 failures.
- **Form, keyboard only, with `window.fetch` stubbed (no request reached the CRM):**
  - Empty Enter: five errors, the summary alert, focus on First name.
  - Bad email: "…name@hospital.org." with focus on the email field.
  - Stubbed 500: the alert takes focus and the fields keep their values. The body ends with `"useCase":"[src: li//]"`.
  - Stubbed 200: "Thank you, Nino. Your request is in." with focus on it.
  - Deck mode: five fields, focus on the mode title.
- `/request-demo` renders the new form (375 checked, deck mode included). `/privacy` renders with the new footer.
- **Console:** no errors from my files. The only errors seen were other lanes' transient Vite errors (`BeliefContrast` import, `ProductPlate.tsx` syntax), both mid-edit.
- **Lint:** `npx eslint` on all 11 files is clean.

## Not done / for others

- `footer` in `landing.trust.ts` is now unused (left in place; the trust file is not mine to prune).
- Server 429, 400 and network-throw states were not re-run. That code path is untouched, and the trust lane verified it.
- On a phone, `/request-demo` puts about 700px of text above the form. It is fine on the landing page, where it is the ending. A shorter variant for the standalone page could come later.
- The face crops use the 69 KB JPG fallback and load lazily, so they can appear a moment late after an instant jump.
- The orchestrator may want the `landing.v2.lane-d.ts` filename noted in its file map.

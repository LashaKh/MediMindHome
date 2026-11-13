# v3 lane D done (2026-11-13)

## Files changed
- `src/content/landing.v2.lane-d.ts` (all lane D words; footer words untouched, they hold no old claim or old hero line)
- `src/components/Landing/TractionStrip.tsx`
- `src/components/Landing/SwitchPlanSection.tsx`
- `src/components/Landing/FoundersSection.tsx`
- `src/components/Landing/AmbitionWorldSection.tsx`
- `src/components/Landing/ContactSection.tsx`
- `src/content/landing.trust.ts`: one phrase only, the form's deck line "90-day plan" became "60-day plan".

## What changed for the reader
- **Traction:** four big facts in one row across the grid (2 x 2 on phones): Runs a network of 25 hospitals · 1M+ patients · 3M+ encounters · Backed by 500 Global. "Signed", "Migrated", "In daily use" and the live light are gone.
- **Switch:** headline left, three short lines right (live in 60 days beside your current system; "We are streamlining integration to bring it under 30."; data ownership: FHIR R4, full export at any time). Timeline redrawn as Day 0 / 20 / 40 / 60: shadow build to day 20, amber "You decide." at day 20, departments go live 20 to 40, full switch 40 to 60, "You are live." at day 60. The step paragraphs are now a range plus a few words. The 1.1M proof block is removed. The blue glow on the final line shows only in the dark theme.
- **Team:** headline, "Two founders, backed by a strong team of AI engineers.", three short credentials (Lasha: practising interventional cardiologist; Irakli: nine years at Riot Games; AI engineering team), backers in one mono row, real photo on the right (5 of 12 columns).
- **Ambition:** "Running a 25-hospital network today. Built for every hospital." The support paragraph is gone. Field shorter (360 units tall, was 440) and wider (110rem). Rings: 25 hospitals / The region / Every hospital. Steps: 25 hospitals, running today / The region, expanding across local and regional markets / Every hospital, anywhere one still runs on forty systems. It ends on the belief. Georgia: not mentioned. Light theme: lit points are solid system blue with a quieter wash; dark theme keeps the glow.
- **Contact:** headline, faces plus one line, three short items (A dated 60-day plan for your hospital. / Your three biggest problems, in numbers. / No commitment.), form on 7 of 12 columns. The left column stays in view (sticky) next to the tall form on desktop.

## Words (visible, rough)
Traction 20 to 16 · Switch prose about 130 to 40 (plus drawing labels) · Team 95 to 48 · Ambition 78 to about 50 · Contact left column about 70 to 36.

## Heights at 1728 (px, before to after)
Traction 105 to 154 (bigger type, on purpose) · Switch 1251 to 809 · Team 1237 to 733 · Ambition 1644 to 1350 · Contact 1170 to 1138 (form height set by lane A's form). Whole page then measured 10,980 (was 25,836; all lanes together).

## Checked
- Browser pane on `http://localhost:5180`, own tab: 1728 light + dark (all five sections), 1440 (heights, no horizontal scroll), 375 light + dark (traction, switch, ambition, contact; scrollWidth = 375).
- `npx eslint` on my files: clean. Grep of my files for 90, signed, 15 months, 1.1M, daily use, zero gaps, kept working, the old hero line, em and en dashes: only pixel values and photo filenames (`team-founders-900`) contain "90".
- One h2 per section kept; h3s under them; reduced motion still draws everything at once (unchanged logic). The form was never submitted.

## Not done / notes for others
- 1024 and 768 not checked by eye.
- Lane B's belief section also ends on "We believe no patient should be missed at 2 a.m. In any hospital. Anywhere." Ambition repeats it word for word as the brief asked; the orchestrator may want one of the two to change.
- `landing.trust.ts` still has "90-day" / "Day 90" / "signed" in the dormant `offer`, `faq` and `contact` blocks (not shown on the page or the form); left alone per scope.
- While I worked, lane C's ProductSection briefly crashed the whole page (missing `FlowPlate` export); it recovered on its own.

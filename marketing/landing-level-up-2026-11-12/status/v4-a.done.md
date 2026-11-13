# v4 lane A done (scale, hero, lane D sections, form), 2026-11-13

Commits: 37ef2f2 (scale, first), 122a65a + c9f08cb (hero canvas), 5f56bf8 (lane D + form), d7a5ad7 (phone fixes), plus this note.

## Files changed
- `src/index.css`: new type scale, no growth above 1600px. Display 44 phone, 87 at 1440, capped 92. h2 34 to 52, capped 56. Stat 52 to 82, capped 88. Lead 18/20, h3 19/20, body 16/17, eyebrow 13. Buttons 46px tall, 15px text, 9px radius. New `.mm-field` (form well: section surface inside the panel, 3:1 hairline, blue edge + soft halo on focus, red edge on `aria-invalid`) and `.mm-form-panel` (18px radius, long soft shadow by day, fine top light by night). New `mm-orch-head` keyframe (bright head on the hero light pulse).
- `src/components/ui/section-shell.tsx`, `Landing/laneD.styles.ts` (`dEdge`), `Layout/Header.tsx`: one shared edge, `px-6 md:px-10 xl:px-16` (24/40/64px) inside `max-w-page` 88rem. Header 72px tall from md (was 80).
- `Layout/Footer.tsx`: company line 26/30px (was 28/36).
- `content/landing.v2.lane-d.ts`: "MediMind Expert" footer link removed (founder). No other mention in my files.
- `Landing/HeroOrchestration.tsx`: the wide canvas is redrawn in real pixels of its measured width (ResizeObserver; no stretched viewBox). Three zones: a patient dial (42 ticks, 7 major; outer blue arc = prepared n/7, inner amber arc = decided n/7; heartbeat ring; soft light behind), the system zone (seven gradient light paths, a blurred glow pulse with a bright head travels each, department nodes with ring, core and halo, always blue), and a people column behind a hairline (dotted amber leader while a person is needed, solid faint amber once decided, the decision and its minute). A minute ruler underneath (09:41 to 09:58) marks each preparation (blue dot) and each decision (amber diamond) with a walking cursor: the system is always first. Column heads carry the two counters. Phone form unchanged except the arrival time is hidden below 640px so the readout never overlaps the chip.
- `Landing/HeroSection.tsx`: visual box 436px at lg (was 426).
- `Landing/SwitchPlanSection.tsx`: the 60 days are one exact SVG: day ruler with a tick every 5 days, the current system solid to day 40 then a fading dashed way back, MediMind dashed shadow build to day 20, four department strands that leave the line after day 20 and braid back in by day 40, one 4px line (glow at night) to a live node at day 60. Amber diamond and line at day 20. Lines draw once in view; drawn at once under reduced motion. Words unchanged.
- `Landing/AmbitionWorldSection.tsx`: a dotted globe. Its dots are laid out in rings around the network, so the world reads as organised around where MediMind started: 25 lit hospitals scattered and linked to neighbours, a faint blue region with five expansion routes, every other hospital out to a curved horizon (smaller and fainter with depth). Labels "25 hospitals", "The region", "Every hospital"; no countries. Phone: drawn wider and shifted so the network and region stay in view.
- `Landing/FoundersSection.tsx`: credentials under fine rules (ink for the two founders, system blue for the AI engineering team), photo with 14px radius and an inner hairline.
- `Landing/TractionStrip.tsx`: figures 28/36/44px (was up to 52).
- `Demo/ScopingForm.tsx`: class names only (fields use `.mm-field`, panel `.mm-form-panel`, 24px row gap, 14px labels, full-width 52px submit). Submit logic, field names, validation and states untouched. Never submitted.

## Checked (own tab, localhost:5180)
- 1440x900 light + dark: h1 86.6px; hero bottom 849px (headline, sub, buttons and whole canvas fit). 1728 light: h1 92px, hero bottom 860, clear air both sides. 1024 dark: people column fits ("Pharmacist approved"), no collisions. 768 light. 375: headline, sub and button on the first screen (button bottom 418px).
- No horizontal scroll at 1728, 1440, 1024, 768, 375. One h1.
- Switch, globe, founders, contact and form in both themes at 1440; switch and globe at 375. Form focus state checked by focusing a field.
- `npx eslint` on every changed TS/TSX file: clean.

## Not done / notes
- `index.html` not touched (now owned by the site essentials agent). No head change needed from me.
- The phone/tablet form of the hero (below 1024) keeps the round 3 vertical list; only the wide canvas was redrawn.
- Reduced motion was checked by code path (static frame, drawn lines), not by emulation.
- Other lanes' files crashed the shared page several times during my run (AnatomyOsOrganism `Pulse`, ProductSection, BrainScreens); not my files.
- Lanes B and C: if any of your own containers still use `px-4 sm:px-6 lg:px-8`, switch to `px-6 md:px-10 xl:px-16` to sit on the shared edge. For cards on the navy tone keep `bg-mm-raised`.

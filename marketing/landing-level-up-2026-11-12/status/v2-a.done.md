# Lane A (v2): done

Commits on `landing-level-up`: `0122346` design language, `595a3cd` header + hero + visual, `1925083` hero polish, plus this note. The design language lanes follow is `status/v2-design-language.md`.

## Files changed
- Tokens and type: `tailwind.config.js` (new `mm-*` roles: raised, voice2, system, system-soft, human, human-text, human-fill, human-fg; `font-display`/`font-serif` = Fraunces, `font-mono` = IBM Plex Mono; `max-w-page` 1248px), `src/styles/brand-tokens.css` (v2 palette, three tones, ink canvas dark in both themes), `src/index.css` (Fraunces/Inter/Plex scale, `mm-data`, `mm-mark-system`, `mm-mark-human`, `mm-dev-badge`, buttons, reveal, hero keyframes), `src/main.tsx` (Fraunces opsz + Plex Mono 400/500 imports).
- Primitives (same names and props): `ui/reveal.tsx` (visible by default; only blocks below the fold are armed), `ui/section-shell.tsx` (max-w-page, more air), `ui/sticky-cta-bar.tsx` (ink in both themes), `ui/column.tsx` (hairline with a short blue segment), `ui/browser-frame.tsx`, `ui/eyebrow-badge.tsx`, `ui/gradient-heading.tsx`.
- `Layout/Header.tsx`: new nav (belief, system, product, brain, team), transparent on the ink hero at the top of the page, solid ink while the hero scrolls under it, then the page tone; Fraunces phone menu; kept `/#id` scrolling, Escape and focus handling; the nav shows from 1024px.
- `Layout/MainLayout.tsx`: no top offset on `/` so the hero runs under the header.
- `Landing/HeroSection.tsx`, new `Landing/HeroOrchestration.tsx` (lazy-loaded into a fixed-height box), new `src/content/landing.v2.a.ts` (all lane A words).
- `index.html`: global title and descriptions, one ink theme-color.

## Verified (own tab, http://localhost:5180)
- 1440x900 light and dark, 1024x768, 768x1024, 375x812 light: one h1 (exact text), no horizontal scroll at all four widths, h1 99px at 1440 and 44px on the phone. Phone first screen: headline, sub and button (the button ends at 536px of 812).
- The animation runs a full cycle (arrive, fan out, prepared, waiting, signed, reset); the pause button is reachable by keyboard; focus rings are visible on the header links and the hero controls; the phone menu focuses its first link, Escape closes it and returns focus to the button.
- AA: every text token on every surface was computed with a WCAG script (lowest: voice2 on pale 4.2, used as large text only).
- `npx eslint` on all my TS/TSX files: 0 problems. No console errors come from lane A files (errors seen came from other lanes' work in progress).

## Not done or not checked
- The `og-image.png` / `twitter-card.png` artwork still shows the old line.
- The lazy visual chunk loads slowly on the shared dev server; in the browser the box keeps its size, so nothing shifts.

## Second pass (orchestrator review, 2026-11-12)
- The living hospital is now the centrepiece: the headline spans the top, the sub and both buttons sit in one row beneath it, and the orchestration runs across the full content width on the ink canvas (no panel; a hairline readout on top, the honesty line as its caption).
- lg+: a fan of light paths from the patient to seven departments at different depths (no path crosses another label). Light pulses travel each path when work is sent; nodes go grey, then blue (prepared), then amber (a named person decided). The clock advances 09:41 to 09:58, the patient has a calm rhythm (beat ring and trace), and the readout shows "Prepared by the system" and "Decided by people" counters. The hospital moves once in about 7 s, rests until 13.6 s, fades and replays. Below lg there is a designed vertical form (trunk and seven rows, counters below). Box heights are fixed: 472px lg, 596px below.
- Verified in the browser, own tab: 1440x900 light and dark (eyebrow, headline, sub, primary button, and patient plus five departments in motion on the first screen), 1024x768, 768x1024, and 375x812 light and dark (headline, sub and button on the first screen; the button ends at 537px). No horizontal scroll at any width, one h1. Reduced motion was checked in the browser (matchMedia forced, hero remounted): static frame with 7/7 prepared, 5/7 decided, beds and ministry form waiting, clock 09:55, no pulses, no pause button. Sticky phone bar: ink bar, 48px white button, appears mid-page in both themes. eslint clean.

## Third pass (2026-11-12)
- Header takes the tone of whatever is under its bottom edge: it reads the `mm-tone-*` class there, so ink sections get an ink header and light sections a light one, whatever the section order. The switch is an instant cut (no colour transitions inside the header), with one hairline. It is transparent only on the hero before scrolling. Swept every section (top, middle, bottom) plus the footer at 1440 and 375, light and dark: 0 mismatches out of 39 positions each. Screenshots confirm the logo and primary button are legible in both states.
- Hero fit: lane pitch 52px, canvas 386px, readout 40px, the sub on two lines at 20px on desktop, tighter gaps; the headline is unchanged (99px). At 1440x900 the whole canvas (readout plus all seven departments) ends at 885px. At 1280x800: headline, sub, button and patient plus six departments are on the first screen.
- Testing note: the browser pane stops rendering frames between screenshots, so scroll events stall there. The sweep dispatches the scroll event itself; the tone logic was verified, not the pane's timing.

## For other lanes
- Use `tone="navy"` for ink sections; never hardcode hex. The second clause of a heading (`accent`) is now the quieter `voice2` ink, not blue.
- Blue = the system working, amber = a person deciding (`.mm-mark-system`, `.mm-mark-human`), and `.mm-dev-badge` wherever the brain is shown acting.
- Orchestrator: `@fontsource-variable/fraunces` and `@fontsource/ibm-plex-mono` are used again; keep them in `package.json`.

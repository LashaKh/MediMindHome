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
- Reduced motion was checked in code only, not in the browser: it shows a static frame with all seven steps prepared, five signed and two awaiting a person, and no pause button.
- The phone sticky bar was not re-checked after its tone change, because other lanes' HMR errors interrupted the page.
- The `og-image.png` / `twitter-card.png` artwork still shows the old line.
- The lazy visual chunk loads slowly on the shared dev server; in the browser the box keeps its size, so nothing shifts.

## For other lanes
- Use `tone="navy"` for ink sections; never hardcode hex. The second clause of a heading (`accent`) is now the quieter `voice2` ink, not blue.
- Blue = the system working, amber = a person deciding (`.mm-mark-system`, `.mm-mark-human`), and `.mm-dev-badge` wherever the brain is shown acting.
- Orchestrator: `@fontsource-variable/fraunces` and `@fontsource/ibm-plex-mono` are used again; keep them in `package.json`.

# v3 lane A done (design language, header, hero), 2026-11-13

Commits: 3cea9be, 4ce78b0, 06d84f7 (+ this note).

## Files changed
- `src/styles/brand-tokens.css`: day mode "navy" tone is now **daylight** `#edf3fb` (cool blue-white) with its own panel tokens: `--mm-raised` white, `--mm-line #d3deec`, `--mm-tint #e0eaf7`, `--mm-system-soft #dae7f9`. `--mm-pale` is `#f3f5f8` (neutral). Light rhythm: white `#fff` / pale neutral grey / daylight blue. Dark theme values unchanged. AA on daylight: muted 4.9, human-text 4.9, link 5.5, system 4.6; amber mark 3.6 (non-text).
- `src/index.css`: hero grid lines in system blue by day plus a white light wash (`.mm-hero-light`, day only); on screens 1600px and wider `mm-display` grows to 124px, `mm-h2` 76px, `mm-stat` 132px, `mm-lead`/`mm-h3` 24px.
- `src/components/ui/section-shell.tsx`: vertical padding 56/80/96px (was 80/112/128). Names and props unchanged.
- `src/components/ui/gradient-heading.tsx`: `SectionHeading` column `max-w-4xl`, `2xl:max-w-5xl`.
- `src/components/Layout/Header.tsx`: logo follows the theme (was forced to the night logo over navy); transparent at the top of `/` in both themes. Tone following kept (tokens now carry the theme).
- `src/components/Layout/Footer.tsx`: logo follows the theme (was forced dark).
- `src/components/ui/sticky-cta-bar.tsx`: comment only (navy tone = daylight by day).
- `src/components/Demo/ScopingForm.tsx`: panel `bg-white/[0.035]` → `bg-mm-raised` (white on daylight, deeper blue on ink). Submit logic untouched.
- `src/hooks/useTheme.ts`, `src/main.tsx`: no stored choice → follow `prefers-color-scheme`; stored toggle choice wins; try/catch kept.
- `index.html`: two `theme-color` tags (light `#edf3fb`, dark `#030913`); description and og/twitter text follow the rulings (operating system, "The hospital that thinks ahead.", no "signed", no lab/imaging detail, old headline gone).
- `src/content/landing.v2.a.ts`: h1 "The hospital / that thinks ahead.", sub "One operating system runs the whole hospital and prepares every next step. Your doctors decide."; two alternatives kept as comments; `honesty` removed; canvas step words shortened.
- `src/components/Landing/HeroSection.tsx`: from 1280px the headline owns the left and the sub + buttons sit at its baseline on the right; 1024 to 1279 a row of sub and buttons under the headline; below that stacked. Honesty caption removed; "In development" chip stays in the canvas readout.
- `src/components/Landing/HeroOrchestration.tsx`: comments only (no old headline wording).

## What I checked (built-in browser, own tab, localhost:5180)
- 1440x900 light and dark: headline, sub, buttons and the whole canvas fit (canvas bottom 825px, hero bottom 865px). h1 99px.
- 1728 light and dark: fills the grid, h1 113px. 1920 light. 1280, 1024, 768: no stranded headline words. 375 light and dark: headline, sub and button on the first screen; sticky bar light by day.
- Footer, contact form panel and header light by day; no horizontal scroll at 375/1440/1728.
- Theme default: storage cleared + device dark → dark; stored "light" + device dark → light.
- `npx eslint` on my changed TS/TSX files: clean.

## Not done / notes
- Canvas departments stop at 78% of the width (tuned so labels fit at 1024); at 1920 the right edge of the canvas is quiet. Widening needs per-breakpoint lanes; left as is.
- Page height not measured end to end: other lanes were mid-edit (BrainSection / ProductPlate errors in the console during my run; not my files).
- The theme key in localStorage is shared by every tab on localhost:5180, so lanes toggling the theme flip each other's tabs.
- Old headline still exists in `src/content/landing.story.ts` (`punchLine`), read only by the unrendered `VisionSection`. Not my file; harmless while dormant.

## Requests for other lanes
- All lanes: in day mode the navy tone is now daylight `#edf3fb` with white `mm-raised` panels; use `bg-mm-raised` for cards on navy instead of `white/…` alphas. Text tokens are unchanged.
- Lane D: `dEdge` (`laneD.styles.ts`) still matches the header edge (`px-4 sm:px-6 lg:px-8`, `max-w-page`); no change needed.

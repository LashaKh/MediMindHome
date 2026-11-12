# Top lane: done

Commit `8e526e8` on `landing-level-up`.

## Files changed

- `src/components/Layout/Header.tsx`: logo as is (`aria-label` "MediMind home"); the five nav labels from the copy deck (`#problem`, `#system`, `#switch`, `#control`, `#team`), plain fragment links on `/`, router links to `/#id` on other routes (a small effect scrolls once the landing page renders); header button = `primaryCta` (shown from 768 px up, and inside the phone menu); theme toggle in the header itself with the deck labels "Switch to dark theme / Switch to light theme"; phone menu button with `aria-label` Open menu / Close menu, `aria-expanded`, `aria-controls`; opening focuses the first link, Escape closes and returns focus to the button, a link click closes it. Sign-in/sign-out block, `useAuthStore` (Supabase) import, framer-motion, blur and shadow removed. Solid `bg-mm-surface`, one `border-mm-line` hairline. Desktop nav shows from 1280 px (at 1024 the labels wrapped); below that the menu button is used.
- `src/components/Landing/HeroSection.tsx`: pre-headline, the only `h1` with the accent phrase, sub, primary button, line under it, trust line, three benefits as a `<ul>` with check icons, hero image in `BrowserFrame` (`priority`: eager, fetchpriority high, width/height set). Desktop: headline across the grid, then sub + button + lines (7 columns) beside the benefits (5 columns; list stretches so its hairlines line up with the sub and the trust line), then the screen. On phones the screen shows its left part at 240 px tall so it stays readable (fixed height, no shift).
- `src/components/Landing/ProofStrip.tsx`: lead line (L2) and the four items via `ProofItem`, registry link opens in a new tab; `showCustomerName` switches the lead line and shows the customer logo (dark/white by theme). Tighter padding than a full section.
- `src/components/Landing/ProblemSection.tsx`: eyebrow, h2 with accent, 2.4% as the one dominant figure (navy, 72/96/128 px), "24 of 68" in `mm-alert` (the only red), 37% beside it with a hairline divider (the v6 S4 layout), source footnote, support line, three `Column`s with the 4px rule (stacked below 1024 px, three across above), closing line.
- `src/content/landing.top.ts` (new): every string, nav ids, `heroImageId` constant and the hero `ResponsiveImage`.

## Verified (own tab on http://localhost:5180, closed after)

- 1440x900 light and dark: words lead, product screen visible above the fold (about 270 of 436 px: menu, title, the four stat tiles, top of the bed cards). 1280, 1024, 768x1024 and 375x812, light and dark.
- 375x812: pre-headline, h1, sub and button all on the first screen (button bottom at 460 px). Widows fixed with `text-wrap: balance/pretty` (pre-headline, under-button line, trust line, headings, proof lead).
- No horizontal scroll at 375, 768, 1024, 1440. No console errors. One `h1`. Hero image loads eager with high priority (AVIF picked).
- Keyboard: Tab order logo, five links, header button, theme toggle, hero button; focus outline visible. Phone menu opens with Enter (`aria-expanded` true, focus on first link), Escape closes and focus returns to the button.
- Nav: every link lands its section at the header's bottom edge (section top = 80 px, heading at 232 px). From `/privacy`, "Team" goes to `/#team` and scrolls there.
- Contrast: only foundation token pairs are used (AA checked by the foundation lane); new pairs are muted 600 on white (pre-headline) and accent check icons (non-text, 4.0:1).
- `npx eslint` on all five files: clean.

## Not done / notes

- **Dependency:** Header and Hero import `trackLanding` from `src/lib/tracking.ts` (`cta_click` with `location: header | hero`). That change belongs to the trust lane and was **not committed** when I committed. It must be committed with theirs, or my commit will not build on its own.
- Column titles drop the trailing full stop of the run-in heads ("Fines and returned claims." becomes a heading without the period). Words are unchanged.
- Label emphasis in the figures (semibold "Median net margin.", "lost money", "revenue comes from the state") follows the v6 slide; words unchanged.
- `navLabel` "Page sections" is an invisible `aria-label` for the nav landmark; the copy deck has no line for it. Copy lane may replace it.
- `showCustomerName = true` path not seen in the browser (flag lives in `site.ts`, which I don't own); logo files exist and the markup is in place.
- Smooth scrolling did not animate in the background test tab (browser throttling); jumps land correctly.

## Requests

- **Orchestrator:** if the hero image changes, edit `heroImageId`, its size and alt text in `src/content/landing.top.ts` (the helper assumes the manifest's 800/1400/2000 AVIF+WebP + 1400 JPEG naming). A fresh capture whose informative part sits on the left keeps the phone crop working.
- **Foundation owner:** `ThemeToggle` (`src/components/common/ThemeToggle.tsx`) still says "Toggle theme" and uses old tokens; the header no longer uses it. `ProofItem` link is `btn-quiet` 44 px tall, which adds space under the registry item; fine, but could be tighter.

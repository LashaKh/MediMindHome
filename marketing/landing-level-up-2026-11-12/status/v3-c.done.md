# Lane C, round 3: done

## Files changed
- `src/content/landing.v2.c.ts`: rewritten. New facts only (25-hospital network, 1M+ patients, 3M+ encounters, live in 60 days). Status marks, per-area lines, captions, the AI-today block, the inbox block, the dial's job/system/person lines and every removed claim are gone.
- `src/components/Landing/ProductSection.tsx`: headline and one line on the left/right of a 12-column row, then one wide "light table": five real screens in a bento (clinical record large across two rows; laboratory, pharmacy and stock, billing, staff and management around it). Each tile carries its name and one short tag. The quiet "Real screens, demo data." note stays. No `imaging-viewer`.
- `src/components/Landing/ProductPlate.tsx`: now a single `ProductTileView` (a window into a real screen, zoomed by a `view`, one tag, a name). The `MARK = '#0f2a52'` hex is gone; tags use `bg-mm-ink`/`text-mm-surface`, flipped in dark theme so they stay a dark pill on the light captures.
- `src/components/Landing/BrainSection.tsx` + `BrainDial.tsx` (my helper): the dial is the section. Left: "In development" chip, h2, one line, the current step (name + a few words), the three limits as three short lines, the off switch. Right: the dial, larger (max 760px). Arrow keys, Home/End, drag, tap and the phone step buttons all still work.
- `src/components/Landing/ProofSection.tsx`: "Not a pilot. A hospital network, running today." then four huge numbers in one row on desktop (2x2 on phones), a few words under each, then one quiet recognition row (500 Global, GITA grant, Innovative Startup status linking to the registry). Tone changed from `pale` to `white` so it separates from the brain band in day mode.
- `ProductSection.css` is no longer imported (the flow diagram is gone); file left in place per the no-delete rule.

## Size (measured in the browser at 1440 wide)
- Visible words: product 424 → 75, brain 373 → 82, proof 117 → 37. Total 914 → 194 (about 79% fewer).
- Height: product 4664 → 1220px, brain 2586 → 937px, proof 1785 → 783px. Total 9035 → 2940px.

## Checked, how
- In-app browser at 1440, 1728 and 375; light and dark themes (header toggle). Day mode is light in all three sections; dark mode is the ink design. No horizontal scroll (scrollWidth = viewport at all three widths).
- Dial: keyboard ArrowRight and End move it (aria-valuetext "Suggest. Points it out. You decide." / "Own it. Runs the job. Reports every week."). Reduced motion path unchanged (spring jumps, no transitions).
- Headings: one h2 per section, h3s under it. Product images: 6, all `loading="lazy"` with width/height.
- `npx eslint` on all my files: clean. Grep for removed phrases, "90", em and en dashes in my files: none.
- Not checked: 1024 and 768 (md layout is two columns with the record and staff tiles full width; not visually verified), forced colours, a real screen reader.

## Not done / for other lanes
- Duplicate: the Founders section (lane D) shows "Backed by 500 Global · GITA grant · Innovative Startup status" in small text, and Proof now has the recognition row. One of the two should go; the ruling puts it in Proof.
- Switch (lane D) opens with "Live in 60 days..." directly after Proof's "60 days, to go live". Acceptable but repetitive; lane D may prefer to lead with "Replace everything without stopping anything."
- Product screens are light captures, so in dark theme they stay bright white rectangles on the ink stage. A dark-theme capture set would be the real fix.

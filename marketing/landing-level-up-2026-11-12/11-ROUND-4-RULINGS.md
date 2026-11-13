# 11 · Round 4: founder rulings (2026-11-13, evening)

**Overrides older briefs where they disagree. `10-ROUND-3-RULINGS.md` (facts, few words, day mode light, headline) and the "Hard rules for every session" in `00-MASTER-BRIEF.md` still apply.** Nothing goes live until the founder says so.

## The founder's words (after seeing round 3)

> "It feels too zoomed in. Give me a bit smaller text and a bit more padding on the sides."
> (about the anatomy figure, a stick man in a dotted circle) "This is not good enough. Try your best. Impress me."
> "Make sure my real screenshots that you included look impressively good and beautiful. Older stuff you had looked good. Maybe use screenshots from the AI harness I am building or something."
> "Make sure we really get emails and calendar request if they fill out the forms." (orchestrator handles this one)

## Ruling 1 · Scale: calmer, not zoomed in (lane A)

- Round 3 over-corrected. The grid goes from 96rem to **88rem** (done at the base), with **larger side padding** (at least 24px on phones, 40px at 768, 64px from 1280). At 1728 the content should have clear air on both sides without the old narrow column.
- **Type comes down about 12 to 15 percent on desktop**: no extra growth above 1600px; hero h1 around 84 to 92px at 1440 to 1728 (was up to 124), section h2 around 48 to 56px (was up to 76), stat figures around 72 to 88px, body 16 to 17px, lead 18 to 20px. The page should feel like a precise instrument seen at 100 percent, not at 125 percent.
- Phone sizes stay roughly as they are.

## Ruling 2 · The bar: impress (every lane)

The founder is not impressed yet. "Clean" is not enough. Every visual must look like it was drawn by a senior designer at a top product company: precise geometry, optical alignment, depth, considered light, fine detail that rewards a second look. If something looks like a default diagram or a wireframe, it is not done. Screenshot your own work at 1440 and 1728 in both themes, look at it critically, and iterate at least twice before you call it finished.

## Ruling 3 · The anatomy figure is redrawn (lane B)

- The stick figure in a dotted circle is rejected. Do not draw a cartoon person, a stick man or a gingerbread outline.
- Make "A hospital with a body made of software." a signature visual: the five parts (Heart · Brain · Muscle · Skin · Nerve, in that order, with their meanings from `09`) as one living system. The direction is open; aim high. Options worth considering: a precise layered "organism" cross-section (the record at the core, command ring, nerve lines carrying pulses, the skin as the outer ring where roles such as doctor, nurse, patient, finance, pharmacy, ministry, insurer, devices meet it, the brain above reading everything); an exploded isometric stack of five translucent plates; a finely drawn anatomical plate in the style of a medical atlas with engraved linework. Pick one, commit, and execute it with real craft: line weights, glow as meaning (blue = system, amber = a person), motion that shows data flowing from the heart along the nerves, interaction that lights a part and shows its one line.
- It must be beautiful in day mode and in night mode, work on a phone, respect reduced motion, and stay keyboard reachable.
- Also lift the forty-systems visual and the 2 a.m. chart to the same standard if they look plain next to it.

## Ruling 4 · Product screenshots that sell (lane C + asset capture)

- Round 3 flattened the product section into a grid of small crops. The founder liked the older crafted look. Bring back large, beautiful compositions: one hero product shot at near full width in a refined frame with real depth (layered windows, soft long shadows, a slight perspective or overlap, a thin highlight edge), then two or three supporting scenes. Crisp at 2x. Few words: a name and one short tag per scene.
- Night mode must not show bright white screenshots on ink: use dark-theme captures where they exist (ids ending `-dark` in `public/landing/manifest.json`), otherwise tone the frame so it sits well.
- **New: the hospital brain is shown with real screens.** A capture agent is adding real screens of the AI harness (Control Center, staff inbox with prepared cards, morning brief, worker levels, proof) to `public/landing/manifest.json` with ids starting `brain-`. Lane C uses them in the Brain section next to the autonomy dial (the dial stays) and may use one in the product showcase. Keep the "In development" marker. Re-read the manifest before you finish; if the brain images have not arrived, build the layout with a clearly named slot and say so in your done note.
- Never use `imaging-viewer`. Keep a quiet "demo data" note.

## Done signal

`status/v4-<lane>.done.md`, written last and committed: files changed, what you checked (themes, widths), what is not done.

# 10 · Round 3: founder rulings (2026-11-13)

**This file overrides `09-DIRECTION-V2.md`, `03-who-we-are-and-claims.md` and every older brief wherever they disagree.** The hard rules in `00-MASTER-BRIEF.md` ("Hard rules for every session": worktree, file ownership, commit by path, no servers, no pushes) still apply unchanged. The page is now live on `main`; nothing new goes live until the founder says so.

## The founder's words (2026-11-13, after seeing version 2 live)

> "Day mode must be light colours, not partly dark."
> "Remove 'In daily use: laboratory and imaging'. We run the 25 hospital chain already. Aggressively taking over local and regional markets. Million patients, 3+ million encounters on MediMind. Remove these granular details about lab and PACS live or analysers added. Think bigger."
> "No need for '15 months from'."
> "Instead of 90 days, say 60 days, and we are streamlining our integration to do it under 30."
> "You are putting too much details and info and text. Say more with less."
> "In team: we are 2 founders backed up by a strong team of AI engineers."
> "Take up side spaces, there is too much gaps now."
> "I don't like 'One patient walks in. The whole hospital moves.' Give me something better."

## Ruling 1 · Day mode is light, everywhere

- In the light theme no section, header, footer, form, sticky bar or visual is dark. In the dark theme the page is the ink "hospital at night" design, as built.
- Done at the base (orchestrator, already committed): the ink token overrides of `.mm-tone-navy` now apply only under `:root.dark`. In the light theme `tone="navy"` is a light surface (`--mm-navy: #f6f8fc`) and every `mm-*` token keeps its light value. Lane A may retune that surface and the light rhythm between bands.
- Every lane: open your sections in BOTH themes (toggle in the header) and fix anything that assumed a dark ground: hard-coded hex, `white/…` alphas, glows, gradients, SVG strokes, shadows, images' frames. Use `mm-*` tokens. The meaning colours stay: blue = the system prepared it, amber = a person decides.
- Day mode must look designed, not like an inverted night mode: crisp, bright, confident.
- Default theme (lane A): with no stored choice, follow the device (`prefers-color-scheme`); a stored choice from the toggle still wins.

## Ruling 2 · The facts we state now (the founder's numbers)

Say these, large and plain:

- **Runs a 25-hospital network.** Present tense: "runs", "running". Not "signed", not "contract". The customer stays unnamed (`showCustomerName` stays false).
- **1M+ patients.** **3M+ encounters on MediMind.**
- **Expanding across local and regional markets** (say it with confidence, in plain words; no hype adjectives, no country list we cannot name).
- **Live in 60 days.** "We are streamlining integration to bring it under 30."
- Backed by 500 Global. GITA grant and "Innovative Startup" status may stay as small recognitions.

Remove everywhere:

- "In daily use: laboratory and imaging", "at the central hospital", "built and running beside the current system", per-module status marks, "15+ analyser lines", "three weeks", "zero gaps and zero duplicates" as a headline claim, "1.1M+ records migrated" (replaced by 1M+ patients), "from idea to a signed network in 15 months", "signed".
- Every "90 days" / "Day 90" / "90-day plan" becomes 60 days (a 60-day timeline: decide early, live at day 60).

Still true and still required (these do not bend):

- The AI prepares; a doctor signs every medical decision. Never "never misses", "makes medical decisions".
- The hospital brain shown acting keeps its small "In development" marker.
- "one of the first", never "the first". Category word: operating system. "natively includes".
- No invented testimonials, logos, prices, ranks, outcome or savings numbers. No customer name.
- No em dashes or en dashes as pauses. No hype adjectives.

## Ruling 3 · Say more with less

The page reads like a document. It must read like a poster series.

- **Cut the words by at least half in every section.** Target: a headline, at most one short support sentence, then the visual or the numbers. No paragraph longer than two short sentences. No list longer than three items unless it is the visual itself.
- Delete explanatory sub-blocks, repeated proof lines, captions that restate the headline, honesty footnotes longer than a few words.
- One idea per section. If a section has two ideas, cut one.
- Bigger type, fewer lines. Let the signature visuals carry the meaning.
- The whole page should get clearly shorter (it was about 25,000px tall on desktop; aim for well under 15,000px). Merging or dropping a weak sub-part inside your own section is allowed. Do not delete files.

## Ruling 4 · Use the width

- The page grid is now `max-w-page` = 96rem (1536px), was 78rem. On a 1728px or 1920px screen the content must fill the width with confidence; no narrow centred column with empty sides.
- Lay sections out across the width: headline left and visual right, numbers in one wide row, full-bleed visuals. Avoid `max-w-2xl`/`max-w-3xl` text columns floating in a wide band (keep body lines readable, around 60 to 75 characters, by placing them in a grid column, not by centring a narrow block).
- Check 1728, 1440, 1024, 768 and 375. No horizontal scroll.

## Ruling 5 · The new headline

The old line is gone from the whole page (hero, visual captions, footer, meta tags).

- **Hero `h1`: "The hospital that thinks ahead."**
- Eyebrow stays: "The AI-native hospital operating system".
- One short sub-sentence, for example: "One operating system runs the whole hospital and prepares every next step. Your doctors decide."
- Alternatives kept in the content file as comments, so the founder can swap in one edit: "One operating system. The entire hospital." · "The end of the reactive hospital."

## Ruling 6 · Team

- "Two founders, backed by a strong team of AI engineers." Keep the two founders with a one-line credential each (practising interventional cardiologist; nine years at Riot Games). Add the AI engineering team as the third element. No invented head count, no invented names.

## Section-by-section intent (same files, same ids, same lanes as `09`)

| Section | What changes |
|---|---|
| Hero (A) | New h1. One sub-sentence. Buttons. The living-hospital visual stays, fills the width, correct in day mode. Remove the long honesty line (keep the small "In development" chip). |
| Traction (D) | Four big facts: Runs a 25-hospital network · 1M+ patients · 3M+ encounters · Backed by 500 Global. |
| Belief (B) | The 2 a.m. story in far fewer words (a few short beats), then the belief line. |
| Fragments (B) | The one sentence and the visual. Almost no body text. |
| Anatomy (B) | Five parts, a few words each. |
| Product (C) | The headline, the screens, short labels. No status marks, no long captions. |
| Brain (C) | The dial is the section. Three limits as three short lines. Cut the rest. |
| Proof (C) | 25 hospitals · 1M+ patients · 3M+ encounters · live in 60 days. Recognitions in one quiet row. May merge visually with less text; do not repeat Traction word for word (Traction is a strip, Proof is the big moment). |
| Switch (D) | "Replace everything without stopping anything." A 60-day timeline. One line: "We are streamlining integration to bring it under 30." One line on data ownership. |
| Founders (D) | Per ruling 6. |
| Ambition (D) | Bigger and shorter: running a 25-hospital network today, expanding across the region, built for every hospital. Georgia at most once. End on the belief. |
| Contact (D) | Headline, one line, the form. "60-day plan" where it said 90. |

## Done signal

`status/v3-<lane>.done.md`, written last and committed: files changed, what you checked (both themes, which widths), page height of your sections before and after if you measured, what is not done.

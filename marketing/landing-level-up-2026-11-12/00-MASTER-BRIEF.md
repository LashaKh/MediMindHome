# 00 · Master brief: medimind.md landing page level-up

Date: 2026-11-12. Owner: the orchestrator session. Every build and copy session reads this file first, then the briefs it names.

**Folder for all work:** `/Users/toko/Desktop/MediMind Landing Page/.claude/worktrees/landing-level-up` (git worktree, branch `landing-level-up`). Never work in the main checkout. Never push. Never merge to `main` (a push to `main` goes live on Netlify; only the founder approves that).

## The five research briefs (same folder as this file)

| File | What it holds |
|---|---|
| `01-justina-teachings.md` | Justyna Jastrzebska's rules. **Her section 5 scorecard (30 lines) is the acceptance test for the page.** |
| `02-other-mentors-lessons.md` | Dina (story), Horacio (design), Brianna, Nicholas, pricing. Section 6 checklist. |
| `03-who-we-are-and-claims.md` | Truth sheet: what is live, what is vision, proof ledger, language rules. |
| `04-decks-and-offer.md` | The short hospital deck (v6) story, offer, palette, type, screenshots. |
| `05-current-page-inventory.md` | The page as built: files, copy, design system, problems. |

## Why we are doing this

The live page fails its own reader. A hospital owner cannot tell in five seconds what problem it solves for them. It shows no product. It carries claims our own notes rule out. It does not look like the decks the same buyer receives. The goal: a page a Georgian private-hospital owner understands in five seconds, believes, and acts on, and that honestly carries our vision of the proactive hospital.

## Decisions already made (do not reopen)

**Reader.** Owner, CEO or director of a private multi-profile hospital or hospital group in Georgia. One page, one reader. English now. Copy lives in content files so a Georgian version can follow.

**One goal.** A booked scoping call. One primary call to action, repeated. One soft path for "not now" visitors.

**Message order** (Justyna: problem first, offer is "fifth information"; Brianna: problem, solution, value, offer; Dina: open with what they must remember; v6 deck: proof early):

1. **Hero.** Pre-headline names the reader. Headline is the hospital's problem or outcome, under 10 words, no "AI", no category word, no offer. One sub-sentence: who, what changes, how fast. Three benefit lines tied to the three problems. Primary button with the time in it. Trust line right under the button. One real product image.
2. **Proof strip.** Signed 25-hospital network. Central hospital in daily use with lab and imaging. Government "Innovative Startup" status. GITA grant. 500 Global.
3. **The problem.** Data first, then "is this your hospital too?". The v6 numbers (2.4% median margin, 24 of 68 lost money, 37% of revenue from the state) with their source line. Then exactly three problems: fines and returned claims; management without reliable numbers; staff stretched by repeated manual work. Consequences, not mechanisms.
4. **What changes.** "One operating system for your whole hospital." Six capability areas, names plus one plain line each. A large real screenshot. "Built ground-up on FHIR R4, the international standard" said once, in plain words.
5. **Two examples.** Billing and warehouse, each tied to a problem from section 3, each with a real screenshot.
6. **The objection and the plan.** "Yes, but replacing everything is risky and slow." Then the 90-day plan with success criteria (days 0 to 30, 31 to 60, 61 to 90), "switch without stopping your hospital", and "your data stays yours". Say steps and dates, never "phases".
7. **AI today, and where it goes.** First what works now: "AI working today. Your clinicians decide." Then the vision (see below).
8. **Control and safety, for the people who approve.** Short. Data ownership and export, on your own servers, works offline, every action logged, AI prepares and people sign. Only controls verified in the product.
9. **Team.** "Built by a practising cardiologist and a product leader." Real photo. One concrete proof each. Backers.
10. **The offer.** "Founding partner terms." Says no more than the v6 deck slide S14 and less where flagged below.
11. **FAQ.** Four questions: sales pressure, fit, effort for my team, price.
12. **Final call to action with the form on the page.** Headline is about the call. Three verb-led bullets on what happens. Short form. One-line privacy promise. What happens next.

**The vision section (the founder asked for it; mentors say place it late and label it).**
- Title idea: the reactive hospital vs the proactive hospital. Reactive: software waits to be asked, and safety depends on a tired person remembering at 2 a.m. Proactive: the system notices what is missing and has it ready; a person approves, edits or rejects.
- Label it clearly as what we are building next ("In development"). Present tense only for what is live.
- Lead with admin examples: forms ready at discharge, missing charges found, ministry records ready before the deadline. Each ends with a person releasing it.
- Then how we approach it, in plain words: AI workers prepare work in the same inbox staff already use; each job starts at "watch" and a named person turns it up only on proof; three limits never move (a doctor signs every medical decision; nothing leaves the hospital without a person; money always needs a signature); one off switch; the hospital runs without it.
- The 2 a.m. case may appear as "a case from my practice" by the cardiologist founder, de-identified, as the reason we build this. Do not claim MediMind would have caught it.
- The line "One patient walks in. The whole hospital moves." is allowed here, under the future label, next to "The system prepares. Your doctors decide."
- Never "phase". Never "optional when ready". The operating system must read as a complete product today.

**Offer wording (public page).**
- Allowed: "Free implementation and training." · "The first 30 days with no commitment." · "Day 30: you decide. Day 90: you are live." · "You ask, we build: an answer in 3 workdays, no development fees." · "Your data stays yours: FHIR R4 and full export at any time." · "Two founding-partner places open." (one quiet line, behind a content flag so it can be switched off the day it stops being true).
- Left out: any price, "price match", "within your current budget", the word "unlimited", "limited time", "won't be available indefinitely", the source-code promise (lawyer first), "free trial" (say "evaluation").

**Customer name.** Default is unnamed: "a 25-hospital network in Georgia". Build a single content flag `showCustomerName` (default `false`). When `true` the page shows "GeoHospitals", its logo and the CTO quote from v6 S2. The founder flips it.

**Facts and words.**
- 25 hospitals are **signed**, never "live". In daily use today: lab and imaging at the central hospital. Everything else is "built and running beside the current system".
- Publishable numbers: 2.4% / 24 of 68 / 37% (with the source line "MediMind analysis of audited accounts of 68 mid-size Georgian hospitals"); GITA 150,000 GEL; Innovative Startup status with the registry link; "1.1M+ patient records moved with zero gaps and zero duplicates" only when `showCustomerName` is true or phrased without naming the hospital.
- Not publishable: second hospital, 2 million encounters, 1,000 doctors, 1 in 18, any outcome or savings number, any rank ("second-largest"), "13/15 months", "50 cardiologists", ₾400,000.
- Category word is **operating system**. Never EMR, platform, suite. "one of the first", never "the first" (also in badges). "natively includes", never "integrates with". "pathway", not "workflow". No hype words (see `03` section 6 and `01` rules 45 to 47).
- Never promise oversight: no "never misses", "watches every patient", "makes medical decisions".
- Contact: `team@medimind.md`. Remove `team@updevoteai.com`.

**Call to action.**
- Primary button: about the plan, with the time in it. Working label: "Plan my evaluation · 30 min". The copy session may improve it within Justyna rules 13 to 16 and Brianna's "offer a free evaluation plan, not a meeting".
- Under it: who runs the call (Lasha Khoshtaria, practising cardiologist, and Irakli Pkhovelishvili), 30 minutes, online or at your hospital, what they leave with (a 90-day plan for their hospital), no commitment.
- Form: first name, last name, hospital, role, work email, phone (optional), one optional question "What is the biggest problem you want fixed?". These map to the existing backend fields `firstName`, `lastName`, `companyName`, `jobTitle`, `email`, `phone`, `useCase`. Keep the honeypot `website`. **No backend change.**
- After submit: say what happens next and when ("We reply within one working day with two time options.").
- Soft path: "Get the hospital deck by email" (same form, flagged in `useCase`). Never link the gated deck or its password.

## Design direction

Three words: **calm, clinical, confident.** The page must look like the v6 hospital deck's sibling.

- **Type:** Inter only (self-hosted `public/fonts/Inter-latin.woff2`, with `NotoSansGeorgian-georgian.woff2` registered for later). Headlines 800, labels 600, body 400. Remove Fraunces and IBM Plex Mono. Body at least 17px on desktop, 16px on phones. Exactly three text levels per section.
- **Colour:** the v6 palette in `04` section 7. Navy `#1a365d` headlines with one accent-blue `#3182ce` phrase. White and pale sections, with one or two dark navy "punch" sections. One accent per section. Red only for the loss number.
- **Theme:** light by default. Keep the toggle and a correct dark theme. AA contrast in both.
- **Layout:** left-aligned headlines, generous white space, a fixed grid, v6's columns with a 4px navy top rule, small radii, no glow, no lamp beams, no ECG line, no blank-box grid, no blur-in reveals, no side rail. One idea per section. Dense and airy sections alternate.
- **Product imagery:** real screenshots only, in a quiet browser frame, labelled "demo data", checked for patient names and account emails, served as optimised WebP/AVIF with `srcset`, lazy below the fold.
- **Motion:** small fade and rise on enter, 200 to 300 ms, through one shared helper that turns off under `prefers-reduced-motion`. Nothing loops. Nothing auto-advances.
- **Nothing essential behind a click:** no tabs, accordions or hover cards for core content (the FAQ may be open by default).
- **Phone first:** the first phone screen shows pre-headline, headline, sub-sentence and the button. Tap targets at least 44px. A slim sticky call-to-action bar appears on phones after the hero scrolls away.
- **Accessibility:** one `h1`, ordered headings, labelled form fields with linked errors, visible focus, menu button with `aria-expanded`, alt text on every image.
- **Speed:** route-level lazy loading so admin and CRM code leave the landing bundle; latin font subset only.
- **Search and sharing:** canonical link, absolute share-image URLs, structured data pointing at `https://medimind.md`, title and description that say "operating system".
- **Logo:** use `MediMindLogo` as it is. Do not redraw or restyle the mark.

## Hard rules for every session

1. Work only in the worktree folder above, on branch `landing-level-up`. Do not switch branch, stash, reset, merge, pull or push.
2. Edit only the files your lane owns. A change you need in another lane's file goes in your handoff note, not in the file.
3. Off-limits to everyone: `public/*.html` decks, `public/deck-assets/**` (read and copy from it, never edit it), `src/pages/**`, `src/data/crm.ts`, `src/lib/crmApi.ts`, `supabase/**`, `scripts/crm.ts`.
4. Commit only your own files by path: `git add <paths> && git commit -m "<what changed for the reader>" -- <paths>`. End every commit message with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
5. Do not start a dev server and do not run `npm run build`. The orchestrator runs one dev server on `http://localhost:5180` from this folder; open that address to check your sections. You may run `npx eslint <your files>`.
6. No new npm packages without a line in your handoff saying why.
7. Do not invent facts, numbers, quotes, customers or testimonials. If the copy deck lacks a line you need, write the gap in your handoff.
8. Do not delete dormant files (`AnatomySection`, `TeamSection`, `AmbitionSection`, `aiMoments.ts`, `team.ts`, `anatomy.ts`). Leave them unrendered.
9. When you finish, write `marketing/landing-level-up-2026-11-12/status/<lane>.done.md`: what you changed (files), what you checked and how, what is not done, and requests for other lanes. This file is the signal that you are finished, so write it last.

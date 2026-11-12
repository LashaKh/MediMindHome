# 09 · Direction v2: bold, global, a real landing page

Date: 2026-11-12. **This file overrides `00-MASTER-BRIEF.md` and `06-copy-deck.md` wherever they disagree.** The hard rules in `00` (worktree, file ownership, commits, no servers, no pushes) still apply unchanged.

## Why v2 exists (the founder's words, 2026-11-12)

> "Why does my landing page look so basic, same like my deck? It's not a deck. I need perfect design for a landing page. Don't just repeat what I say in the deck."
> "It's not about Georgia. You are a global startup building the future."
> "Be ambitious, be bold. You are changing the game of medical practice and hospital administration."
> "You are supposed to adapt everything and analyze and give me the perfect landing page, not a deck on my landing page."

Version 1 was correct and lifeless: a calm copy of the hospital sales deck, aimed at Georgian hospital owners. Version 2 is the company's public face to the world: hospitals, investors and talent anywhere. It must feel like the future of how hospitals run, and it must still be true.

## What we are (say it with conviction)

MediMind is one of the first hospital operating systems built ground-up on FHIR R4 to run an entire hospital on a single AI-orchestrated codebase. Not an EMR. Not an AI add-on. The whole hospital, on one system, that prepares the work so people decide. The mission: the proactive hospital, where no patient is missed at 2 a.m., in any hospital, anywhere.

## Voice

- Bold, declarative, short. Statements a founder would say on a stage. Present tense for what exists, "we are building" for what comes next.
- Global. Never "for Georgia". Georgia appears once or twice as where it is proven first.
- Beliefs are allowed and wanted, written as beliefs: "We believe no patient should be missed at 2 a.m." 
- Speak to a hospital leader anywhere, in plain words. No jargon without a plain meaning next to it. No hype adjectives ("revolutionary", "cutting-edge", "game-changing", "seamless", "world-class"): boldness comes from the claim, not the adjective.
- Category word: **operating system**. Never EMR, platform, suite. "one of the first", never "the first". "natively includes", never "integrates with".
- No em dashes or en dashes as pauses.
- Do not reuse the deck's sentences or its structure (margin statistics, founding partner terms, FAQ). The deck is for a meeting. This is a first encounter.

## Truth lines that never bend (bold is not false)

- 25 hospitals: **signed** network contract, never "live in 25". The customer stays unnamed ("a 25-hospital network"); `showCustomerName` stays false.
- In daily use today: laboratory and imaging at that network's central hospital. Everything else: built, and running beside the hospital's current system.
- The hospital brain (proactive orchestration) is **being built**. Present it as what we are building, vividly, with a visible "In development" marker where it is shown acting. Never claim it is live.
- The AI prepares. A doctor signs every medical decision. Never "never misses", "watches every patient for you", "makes medical decisions".
- Numbers you may use: 25 hospitals signed · 1.1M+ patient records migrated with zero gaps and zero duplicates · 15+ analyser lines live within three weeks · from idea to a signed 25-hospital network in 15 months · GITA grant 150,000 GEL · 500 Global · Government of Georgia "Innovative Startup" status (registry link `https://innovationstatus.gov.ge/ka/awarded-companies/11464`) · "forty systems" as the owned phrase "the forty-system hospital".
- Not allowed: a second hospital, 2 million encounters, 1,000 doctors, "1 in 18", any outcome or savings number, any rank, any price, "unlimited", testimonials or logos that do not exist.
- The 2 a.m. case is the founder's own (Dr. Lasha Khoshtaria, interventional cardiologist): a patient developed pancreatitis after a heart procedure; the signs were in the record, buried in a long history; for 14 hours nobody put them together; 20 days in intensive care. Tell it as "a case from my practice", de-identified. Do not say MediMind would have saved the patient. Say it is why we build.

## The page (order, ids, owner lane, the idea of each)

| # | Section file (`src/components/Landing/`) | id | Lane | The idea |
|---|---|---|---|---|
| 1 | `HeroSection.tsx` + `HeroOrchestration.tsx` | `hero` | A | **"One patient walks in. The whole hospital moves."** The page's `h1`. Eyebrow: "The AI-native hospital operating system". One sub-sentence saying what MediMind is and that people decide. Primary button, secondary "See how it works". The signature visual: a living hospital, where one patient's arrival sends work to every department, each step prepared and waiting for a person's sign-off. |
| 2 | `TractionStrip.tsx` | `traction` | D | One quiet line of hard facts right under the hero: signed 25-hospital network · 1.1M+ patient records migrated · lab and imaging in daily use · backed by 500 Global. |
| 3 | `BeliefSection.tsx` | `belief` | B | The emotional core. The 2 a.m. case told as a scroll story, then the belief: "We believe no patient should be missed at 2 a.m. In any hospital. Anywhere." Reactive hospital vs proactive hospital. |
| 4 | `FragmentsSection.tsx` | `problem` | B | Why it has not been fixed: "Forty systems run a hospital. None of them sees the whole patient." You cannot add intelligence to fragments. AI add-ons and old record systems both fail for the same reason. Visual: fragments that resolve into one. |
| 5 | `AnatomyOsSection.tsx` | `system` | B | The answer: one operating system. "A hospital with a body made of software." The locked taxonomy, always in this order: **Heart · Brain · Muscle · Skin · Nerve** (Heart holds the record, built ground-up on FHIR R4; Brain thinks; Muscle acts through audited commands; Skin meets staff and patients; Nerve feels every change). An interactive anatomy, not a list. |
| 6 | `ProductSection.tsx` | `product` | C | What runs today. Real product screens in crafted compositions: clinical record, laboratory, imaging, pharmacy and stock, billing, staff. "Everything a hospital runs on, natively included." Honest status marks (in daily use / built and running beside the current system). |
| 7 | `BrainSection.tsx` | `brain` | C | The proactive hospital, in development. AI working today (scribe drafts the note and the ministry form, chat answers from the record) leads into the brain: AI workers prepare work in the staff inbox. The **autonomy dial**, interactive: watch → suggest → prepare → act and tell → act quietly → own it. Every job starts at watch; a named person turns it up, on proof. Three limits never move: a doctor signs every medical decision; nothing leaves the hospital without a person; money always needs a signature. One off switch. "Autonomy is earned, one job at a time." |
| 8 | `ProofSection.tsx` | `proof` | C | The numbers, large and confident, each with one line. Plus the recognitions (500 Global, GITA, Innovative Startup status). |
| 9 | `SwitchPlanSection.tsx` | `switch` | D | The fear, answered fast: "Replace everything without stopping anything." Live in 90 days, beside the current system; day 30 you decide, day 90 you are live; your data stays yours (FHIR R4, full export). Short. No offer terms list. |
| 10 | `FoundersSection.tsx` | `team` | D | "Built from inside a hospital." A practising cardiologist and a product leader from Riot Games. Real photo (`team-founders`). |
| 11 | `AmbitionWorldSection.tsx` | `ambition` | D | Where this goes. "Proven first in Georgia. Built for every hospital." The horizon: one network, then a region, then anywhere a hospital still runs on forty systems. End on the belief. |
| 12 | `ContactSection.tsx` (+ existing `Demo/ScopingForm.tsx`) | `contact` | D | "Run your hospital on MediMind." A 30-minute call with the founders. The existing short form and its logic stay; restyle it and rewrite the words around it. |

Not rendered any more (files stay): `ProofStrip`, `ProblemSection`, `WhatChangesSection`, `ExamplesSection`, `AiTodaySection`, `VisionSection`, `ControlSection`, `OfferSection`, `FaqSection`. Reuse their code where it helps.

Primary call to action everywhere: **"Book a founder call · 30 min"** to `#contact` (already set in `src/content/site.ts`). Header nav: The belief · The system · The product · The brain · Team.

## Design direction v2: cinematic, precise, alive

This must look like a company that is changing how hospitals run, at the level of the best product sites in the world, and like nobody else's. Before designing, load the `frontend-design` skill (Skill tool) and follow it. Make deliberate, distinctive choices; anything that reads as a template or as a slide is a failure.

- **Atmosphere.** A hospital at night, seen from mission control. A deep ink canvas (near-black navy) for hero, belief, brain and ambition, with light used as meaning: where the system is working, things glow; where a person decides, there is a clear warm mark. Light editorial sections for product and proof give rhythm. The page should feel like one continuous film, with considered transitions between dark and light, not stacked slides.
- **Type.** Three voices, all already installed: **Fraunces Variable** for display (large, tight, optical sizing; the editorial, human voice), **Inter** for body and interface, **IBM Plex Mono** for data, labels and system text. Display sizes are big: the hero headline should own the screen.
- **Colour.** Ink navy and near-black; luminous clinical blue for the system; one warm accent reserved for the human decision (the sign-off); red only for harm or loss. Light and dark themes both stay correct, but the page is designed dark-first where it is cinematic.
- **Signature elements (these make the page; build them properly):** the living hospital in the hero; the 2 a.m. scroll story; the anatomy of the operating system; the autonomy dial with its fixed limits. Each is real interaction or real motion with meaning, built in SVG / CSS / framer-motion (already installed). No stock illustration, no decorative blobs, no generic "AI glow".
- **Product imagery.** Real screens from `public/landing/manifest.json` (re-read it: fresh captures are arriving), shown as crafted compositions: layered, cropped to the telling detail, annotated with thin callouts. Never a lone screenshot in a plain frame. Do not use `imaging-viewer`. Caption "demo data" quietly.
- **Motion.** Purposeful and smooth: scroll-linked sequences, staggered reveals, ambient life in the hero that can be paused. Transform and opacity only, 60 fps on a mid laptop, nothing that blocks reading. Everything has a complete static fallback under `prefers-reduced-motion`, and content is never invisible if an animation does not run.
- **Craft.** A real grid. Deliberate line lengths and breaks; no widows in headlines. Generous scale contrast. Hover, focus and pressed states on everything interactive. Works at 1440, 1024, 768 and 375; the phone version is designed, not squeezed. On a phone the first screen shows the headline, the sub-sentence and the button.
- **Non-negotiables:** one `h1`; ordered headings; AA contrast; keyboard reachable; visible focus; 44px targets; alt text; no horizontal scroll; no console errors; images lazy below the fold with fixed dimensions; `MediMindLogo` unchanged.

## Shared ground for the four lanes

- Tokens and primitives live in `src/components/ui/`, `src/index.css`, `src/styles/brand-tokens.css`, `tailwind.config.js` (documented in `status/foundation.done.md`). **Lane A owns them** and is retuning them to this direction while you build (display font, ink canvas, accent). Use the existing class names and primitives (`SectionShell` with `tone`, `SectionHeading`, `ButtonLink`, `Reveal`, `BrowserFrame`); their look will change under you, which is intended. If you need something the primitives lack, build it inside your own section files.
- Each lane keeps its words and image ids in its own content file: `src/content/landing.v2.<lane>.ts`.
- Placeholder files for every section above already exist and are wired into `Landing.tsx` in this order. Fill in your own; never touch another lane's.
- Flags and the call to action are in `src/content/site.ts` (read only).
- The form's submit path (`src/lib/crmApi.ts`, `supabase/**`) is off-limits; never submit the real form (it writes to the live sales CRM).
- Done signal: `status/v2-<lane>.done.md`, written last and committed.

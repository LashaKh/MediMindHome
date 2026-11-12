# 05 — Current landing page inventory (as built, 2026-11-12)

Read-only code inventory of the public page at `medimind.md/`. Every quote below is copied verbatim from source. Line counts come from `wc -l`. Nothing was run except read-only `git status` / `git log` and file reads.

**Repo state at time of reading:** `git status --short` was empty. The working tree is clean, so no other session has uncommitted work in this folder right now. HEAD is `11d94a8 Update final pitch script to the founder's latest version`. The last 15 commits are all decks, pitch scripts and CRM work. None of them touch `src/components/Landing*`. Re-check `git status` before you start, because parallel sessions edit `public/*.html` decks and the CRM files often.

---

## 1. Route map

The routes live in `src/App.tsx` (49 lines). It uses `BrowserRouter`. Every route is imported eagerly: nothing uses `React.lazy`.

| Path | Component | Chrome |
|---|---|---|
| `/` | `Landing` (`src/components/Landing.tsx`, 38 lines) | `MainLayout` (Header + Footer) |
| `/request-demo` | `RequestDemo` (`src/components/Demo/RequestDemo.tsx`, 749 lines) | MainLayout |
| `/signin`, `/signup` | `Auth/SignIn`, `Auth/SignUp` (Supabase auth, leftover) | MainLayout |
| `/briefing`, `/briefing/:token` | `BriefingLocked`, `BriefingGate` (investor gate) | none |
| `/admin`, `/admin/dashboard`, `/admin/crm` | admin login, invites, Sales CRM | none |
| `/walkthrough`, `/founder-demo` | gated demo pages | none |

Static decks such as `/deck.html`, `/hospitals.html` and `/partner.html` are served straight from `public/` via `public/_redirects`. A catch-all rule `/* → /index.html` sends everything else to the React app.

`Landing.tsx` renders the following, in order: `LightThread` (a fixed side navigation) → `LampHeroSection` → `FortySystemsSection` → `ThreePhaseSection` → `PlatformPillarsSection` → `AISubstrateSection` → `SafetySection` → `RecognitionSection` → `FinalCTASection`. A comment in the file says `AnatomySection`, `TeamSection` and `AmbitionSection` are kept in the codebase on purpose but not rendered.

`MainLayout.tsx` (19 lines) is a fixed Header, then `<main>` with a top margin of `mt-16 sm:mt-18 md:mt-20`, then the Footer.

---

## 2. Section-by-section (render order)

All section components are in `src/components/Landing/`. Animation everywhere uses **framer-motion**. Icons come from **lucide-react**. Every visual is CSS, SVG or animated `div`s: **the landing page shows no raster images or screenshots at all.**

### 0. Header — `Layout/Header.tsx` (148 lines)
- Logo: `MediMindLogo variant="horizontal" size="md"`, linking to `/` with aria-label "MediMind home".
- Nav (desktop at lg and up, landing page only). These are buttons that scroll smoothly to a section id, with an 80px offset: `The Path` (#path), `Platform` (#platform), `AI` (#ai), `Safety` (#safety), `Proof` (#proof). There is **no** nav item for #problem.
- CTA: **"Book Demo"** with an arrow, which runs `navigate('/request-demo')`.
- Below lg: a hamburger menu that opens a dropdown with the same 5 items plus "Book Demo".
- `ThemeToggle` (sun/moon icon). If a Supabase user is signed in, it also shows their email and a "Sign Out" button. That is leftover from an old app.
- Visuals: fixed position, `backdrop-blur-md`, `shadow-lg`, and a framer stagger entrance on the nav items.

### 0b. LightThread — `LightThread.tsx` (125 lines)
- Desktop only (`hidden lg:block`): a fixed vertical rail in the left gutter, with a glow that fills as you scroll (`useScroll` + `useSpring`), a moving pulse dot, and 6 tick buttons: `01 PROBLEM`, `02 PATH`, `03 PLATFORM`, `04 AI`, `05 SAFETY`, `06 PROOF`. The labels show on hover, and always at 2xl and up. An IntersectionObserver highlights the active tick.
- Honours `useReducedMotion`: when it is on, the rail renders fully lit with no pulse.

### 1. Hero — `LampHeroSection.tsx` (127 lines), wrapped in `ui/lamp.tsx` `LampContainer` (100 lines). The section has `aria-labelledby="hero-heading"` but no id.
- **H1:** "Your hospital deserves a future." / (second line, accent colour) "Your patients deserve better today."
- **Sub-headline:** "Replace disconnected software with one intelligent hospital system—built for better care, more revenue, and less waste."
- **Three benefit items** (each an `h2` with a paragraph):
  1. "A better hospital today." — "Connected information, simpler work, and AI that helps your people make better decisions."
  2. "Your own AI brain tomorrow." — "Built around your hospital's needs—progressing toward AI that anticipates risks and coordinates care and business decisions, with your team in control."
  3. "A team that keeps building for you." — "Unlimited future development included. New features ready to test in three business days."
- **Offer block:** "Move first. At the software price you already pay." / "We match your current software price for early hospital partners. This offer won't be available indefinitely." / "Test it beside your current system in two weeks. Keep running. Commit after you see the difference."
- **CTAs:** primary `btn-luminous` **"Build my hospital's future"**, which goes to `/request-demo`. Secondary `btn-ghost` **"See the path"**, which scrolls to `#path`.
- Visuals: two conic-gradient "lamp" beams whose width animates in, blurred halo blobs, a fine masked grid (`.hero-grid`), an SVG ECG heartbeat line with a CSS sweeping dot (`.ecg-sweep`), and a framer fade/slide on each block. The wrapper uses `scale-y-125` and negative translate tricks. The beam animations do **not** check reduced motion. Only the CSS sweep is stopped by the global media query.

### 2. Problem — `FortySystemsSection.tsx` (109 lines), `id="problem"`, no nav label in the Header
- Eyebrow: "The problem"
- **H2:** "Forty systems run hospitals today." + highlight "One runs them tomorrow."
- **Sub:** "Every department runs its own program — separate logins, separate vendors, separate bills. None of them see the whole patient. The gaps between those systems are where time, money, and lives get lost."
- Before → after ledger:
  - "6+ logins" → "1": "Your coordinators stop re-typing the same patient into five different screens."
  - "40+ vendors" → "1": "One contract, one bill — instead of a monthly fee to every system that half-talks to the next."
  - "Dozens of integrations" → "0": "Nothing to glue together, nothing to break. It's all one system."
- Visuals: a grid of 40 cells that dim when the section comes into view, leaving one glowing cell (index 21). The ledger rows blur in. Honours reduced motion. No CTA.

### 3. The Path — `ThreePhaseSection.tsx` (120 lines), `id="path"`, nav "The Path". Data comes from `src/data/phases.ts` (70 lines).
- Eyebrow: "The path"
- **H2:** "Start solid." + "End ahead of the world."
- **Sub:** "One integration, three stages. Phase 1 replaces the legacy stack today — Phases 2 and 3 build on the same foundation as you grow."
- Panel 1, "PHASE 01 · Replace", **The Foundation**, scope "EMR · Lab · Imaging · Portal". Bullets: "The legacy stack goes. A Western-standard system takes its place." / "Every department on one login, one live patient record." / "Secured, audited, and standards-based from day one." Stat: **"25"**, "hospitals running on it under one signed chain contract".
- Panel 2, "PHASE 02 · Augment", **Efficiency Gains**, scope "AI, workflow by workflow". Bullets: "The scribe writes the notes — doctors review and sign." / "AI reads the patient's full history in seconds." / "Early warnings before a patient deteriorates." / "Management sees the whole hospital, live." Stat: **"You"**, "decide which department starts — and when".
- Panel 3, "PHASE 03 · Predict", **The Proactive Brain**, scope "The hospital that thinks ahead". Bullets: "Reads every patient in the building, in real time." / "Spots deterioration early — a live warning score on every patient." / "Orders the right tests, books the bed, clears the paperwork." / "Most watchful at 2 a.m., when the team is stretched thinnest." / "The AI flags. Your doctors decide." Stat: **"1st"**, "hospitals that switch it on run among the first in the world".
- Closer: "Phase 1 lays the rails — the global FHIR standard under everything. So when you want more, it's a **switch, not a rebuild**."
- Visuals: numbered nodes, a shimmering beam (Tailwind `animate-shimmer`, which runs forever and is stopped only by the CSS reduced-motion rule), giant faint watermark icons. A comment says the wording source of truth is `public/hospitals.html` slide 03.

### 4. Platform — `PlatformPillarsSection.tsx` (73 lines), `id="platform"`, nav "Platform". Data comes from `src/data/pillars.ts` (72 lines).
- Eyebrow: "Phase 1 · Live today"
- **H2:** "The foundation:" + "everything a hospital needs, built in."
- **Sub:** "Six capability areas. One system. Nothing to integrate, no vendors to glue together."
- Six ledger rows (`01`–`06`), each an `<a href="/request-demo">` with a hover arrow: "Clinical Core": "The patient, end to end." · "Medications & Pharmacy": "Order, dispense, administer — safely." · "Lab & Imaging": "Results in. Images up. Decisions out." · "Revenue Cycle & Government": "Get paid. Pass the audit." · "Research & Clinical Trials": "Run trials with compliance built in." · "HR, Workforce & Engagement": "The rest of the hospital — and the patient."
- Footer line: "Want to see any of them up close?" plus the link **"Book a 30-min demo →"**, which goes to `/request-demo`.
- Note: the `<a href>` links cause a full page reload instead of router navigation.

### 5. AI — `AISubstrateSection.tsx` (23 lines) + `MediScribeWalkthrough.tsx` (240 lines), `id="ai"`, nav "AI"
- Eyebrow: "Phase 2 · AI in action"
- **H2:** "Watch one visit" + "document itself."
- **Sub:** "The doctor talks to the patient. MediMind writes the note, codes the visit, and drafts the government form — the doctor reviews and signs."
- Widget: a console labelled "MediScribe · Live simulation" with a Running/Paused status. Four step tabs (Capture / Structure / Code / Persist) **auto-advance every 4.5 s**. Pause/Play and Restart buttons. Step captions:
  - "The visit is recorded live — in Georgian or English."
  - "AI turns the conversation into a structured clinical note."
  - "Diagnosis codes are generated automatically — no manual lookup."
  - "Saved to the patient's record with a full audit trail — government form drafted in parallel."
- Step panels: an animated 24-bar waveform, a fake SOAP note (47-year-old male, BP 154/96…), ICD chips (I10, E11.9, R07.9), and a fake FHIR `Composition` JSON snippet.
- It does **not** honour reduced motion: the auto-advance and the infinite waveform both keep running.

### 6. Safety — `SafetySection.tsx` (49 lines), `id="safety"`, nav "Safety". Data comes from `src/data/safetyPrimitives.ts` (48 lines). Cards use `ui/feature-pillar-card.tsx`.
- Eyebrow: "Doctor-Grade Safety"
- **H2:** "Built like the operating room." + "Not the marketing department."
- **Sub:** "Six hard safety rules built into the system's core. Each one fails safe: when in doubt, the system stops and a human decides."
- Pull line: "AI works. **People decide.**"
- Cards S-01 to S-06:
  - "PRN dose enforcement is fail-closed."
  - "Drug-drug interaction hard-stops."
  - "Barcode 5-rights verification."
  - "Controlled substance co-sign."
  - "Break-glass access."
  - "Immutable audit trail."

  The card bodies are in the data file. Examples: "…scan the wristband, scan the medication… Cannot proceed." / "Opioid and benzodiazepine administration require witness badge scan or credential entry…" / "Restricted patients (VIPs, behavioral health) require elevated permission to open…"
- The pull line ignores reduced motion. The cards honour it.

### 7. Proof — `RecognitionSection.tsx` (74 lines), `id="proof"`, nav "Proof". Data comes from `src/data/recognition.ts` (40 lines).
- Eyebrow: "Proof"
- **H2:** "Backed by doctors." + "Recognized by government. Live in hospitals."
- **Sub:** "From idea to a 25-hospital network in 13 months."
- Tiles:
  - (wide) "“Innovative Startup” status — Government of Georgia": "Awarded 25.02.2026, valid through 01.03.2027. Among the first companies in Georgian history to receive this designation. Includes income-tax exemption." Link "View public registry →" opens `https://innovationstatus.gov.ge/ka/awarded-companies/11464` in a new tab.
  - "GITA Grant — 150,000 GEL": "Awarded September 2025 by Georgia's Innovation and Technology Agency."
  - "25-hospital chain — live": "Georgia's second-largest hospital chain, running on MediMind network-wide."
  - "Built by practicing doctors": "Beta-tested with 50 cardiologists. Every UX decision reviewed by a clinician."
- No logos are shown, even though `src/assets/images/gita-grant-logo.png` and `public/deck-assets/geo-hospitals-logo*.png` exist.

### 8. Final CTA — `FinalCTASection.tsx` (70 lines), `id="cta"`, no nav label
- **H2:** "See it run."
- **Sub:** "A 30-minute demo shows one login, one chart, one patient — the scribe writing in Georgian, the command center live, and AI on the same screens your doctors would use."
- CTAs: **"Book a 30-min demo"**, which goes to `/request-demo`. **"Talk to founders"**, which is `mailto:team@updevoteai.com?subject=MediMind — Talk to founders`.
- Visual: a radial "pool of light" glow at the bottom.

### 9. Footer — `Layout/Footer.tsx` (24 lines)
- Icon logo, "© {year} MediMind. All rights reserved."
- Links: "MediMind Expert" (`https://medimind.md/expert`, new tab, proxied to `medimind-expert.netlify.app`) · "Contact" (`mailto:team@updevoteai.com`) · "Innovative Startup Status" (gov registry).
- No privacy policy, terms, address or social links.

### Built but not rendered
| File | Lines | Content |
|---|---|---|
| `Landing/AnatomySection.tsx` + `data/anatomy.ts` | 60 + 66 | Heart · Brain · Muscle · Skin · Nerve taxonomy, "A hospital with a body made of software." The data text mentions **"Bots"** under Muscle (Bots are now prohibited in the product) and "Medplum Cloud" |
| `Landing/TeamSection.tsx` + `data/team.ts` | 79 + 45 | **Placeholder** founders "Dr. [Founder Name]" and advisors "[Advisor Name]" |
| `Landing/AmbitionSection.tsx` | 54 | "Georgia first. Region next. Then everywhere." with dated horizons ("2026–2027") |
| `data/aiMoments.ts` | 55 | Imported by nothing. Still mentions **Flowise** and **OpenAI Assistants** (Flowise is retired) |

---

## 3. Where copy lives and how languages work

- **Copy is hard-coded.** Section headings, sub-headlines, CTAs and the hero benefits are written as string literals inside each component. Repeated lists (phases, pillars, safety rules, recognition tiles) live in `src/data/*.ts` as plain English strings.
- **i18n is effectively dead code.** `src/i18n/translations/en.ts` (21 lines) holds a few nav and auth keys. `useTranslation` (`src/hooks/useTranslation.ts`) only reads `en` and is used solely by `SignIn`/`SignUp`. `src/i18n/config.ts` holds only date and number formats. `main.tsx` forces `document.documentElement.lang = 'en'`, with the comment "Force English language instead of reading from localStorage".
- **No Georgian or Russian landing page exists.** KA/RU versions exist only for the static decks (`hospitals.html`, `partner.html`, `hospitals-minimal.html`), which use their own i18n scripts (`scripts/hospitals-i18n/`, `public/partner-i18n.js`). The body font stack does include `'Noto Sans Georgian'`, but no Georgian webfont is loaded for the React app. Fraunces (the serif font) has no Georgian glyphs.

---

## 4. Design system as built

**Colours** come from `src/styles/brand-tokens.css` (107 lines, CSS variables) and are mirrored in `tailwind.config.js` (91 lines):
- Brand: `primary`/`navy` #1a365d · `secondary` #2b6cb0 · `accent` #3182ce · `light-accent` #bee3f8
- Semantic: success #38a169 · warning #dd6b20 · error #e53e3e · info #3182ce
- Theme-aware Tailwind names: `surface-page` / `surface-card` / `surface-hover` / `surface-border` / `surface-section` and `text` / `text-muted` / `text-subtle` / `text-inverse`.
  - Light mode: page #ffffff, card #f1f5f9, hover #e2e8f0, border #cbd5e1, section #eef2f7; text #1f2937 / #475569 / #64748b.
  - Dark mode: page #0f172a, card #1e293b, hover #334155, border #334155; text #f1f5f9 / #cbd5e1 / #94a3b8.
- Hard-coded colours also appear in `index.css` (`.btn-luminous`, `.heading-highlight`, the hero grid, a sweep colour #7cc2ff, a dark button end colour #4c9fe0) and in the `rgba(49,130,206,…)` glow shadows inside components.
- `index.css` (240 lines) also adds **light-mode override rules** that re-tint `bg-accent/5…25`, `border-accent/20…40` and `bg-surface-card/60`. If you rename those utility classes, the overrides silently stop applying.

**Fonts.** Fraunces Variable (with the optical-size axis) for the serif headings and big numbers. IBM Plex Mono 400/500/600 for eyebrows, indices and tick labels. Both are self-hosted via `@fontsource` imports in `main.tsx`, bundled by Vite and cached as immutable. The body text uses the **system sans stack** (no webfont). `public/fonts/Inter-latin.woff2` and `NotoSansGeorgian-georgian.woff2` exist but only the decks use them.

**Spacing and breakpoints.** Tailwind defaults (sm 640, md 768, lg 1024, xl 1280, 2xl 1536).
- `SectionShell` (`ui/section-shell.tsx`, 44 lines) is the shared wrapper: `py-20 sm:py-24 md:py-28 lg:py-32`, inner `max-w-7xl px-4 sm:px-6 lg:px-8`.
- The hero uses `max-w-6xl px-5`.
- Grids switch to multi-column at `sm`/`lg`. Desktop-only elements switch at `lg`.
- `sm:h-18` / `sm:mt-18` are used but Tailwind has no `18` step and no custom spacing is configured. They do nothing.

**Dark mode.** Tailwind `darkMode: 'class'`. `main.tsx` and the `useTheme` zustand store (`hooks/useTheme.ts`, 32 lines) read `localStorage.theme`, **default to dark**, and toggle `html.dark`. The page ignores the OS `prefers-color-scheme` setting. `ThemeToggle` sits in the Header.

**Primitives worth keeping:**
- `SectionShell` (section wrapper with an id and variants).
- `GradientHeading` (92 lines: eyebrow, h2/h1 title, highlight with a one-time light sweep, sub-headline, blur-in stagger, reduced-motion aware).
- `EyebrowBadge` (39 lines).
- `FeaturePillarCard` (72 lines).
- `MediMindLogo` (254 lines). It is governed by the `medimind-logo` skill, so do not redraw it.
- The `.btn-luminous` / `.btn-ghost` CSS button styles.
- `cn` (clsx + tailwind-merge).

**Unused primitives** (imported by nothing on the page): `ui/ambient-blobs`, `background-ripple-effect`, `badge`, `button`, `card`, `stat-tile`, `tooltip`, `common/Tooltip`, `common/LoadingSpinner`, `hooks/useMediaQuery`. `ui/animated-button` is used only by RequestDemo.

**Animation.** framer-motion 11 is used everywhere (`whileInView` reveals, blur-in, scroll-linked rail, AnimatePresence), plus a few CSS keyframes (shimmer, heading sweep, ECG sweep). A global `@media (prefers-reduced-motion)` rule stops CSS animations only. It does not affect framer-motion JavaScript animations, so each component has to check `useReducedMotion` itself, and several don't (see §7). three.js is **not** installed. Other dependencies: `@headlessui/react`, `react-hot-toast`, `zustand`, `class-variance-authority`, `@supabase/supabase-js`.

---

## 5. The demo form and every CTA

**`/request-demo` (`Demo/RequestDemo.tsx`, 749 lines)** is a 3-step wizard. Its copy is generic SaaS-style, and it uses raw `gray-*` / `white/80` / `green-500` classes instead of the theme tokens.
- Header badge "Enterprise Demo Request". H1 "See MediMind on your hospital's workflows". Sub "30 minutes. One login, one chart, one patient — live. We'll tailor the walkthrough to your hospital."
- **Step 1 "Personal Information":** First Name\*, Last Name\*, Work Email\* (format checked with a regex), Phone Number (optional, placeholder "+995 555 12 34 56").
- **Step 2 "Company Details":** Company Name\*, Company Size\* (6 options from "1-10 employees" to "1000+ employees"), Industry\* (Hospital System, Medical Clinic, Private Practice, Urgent Care, Specialty Care, Telemedicine, Other), Job Title\*.
- **Step 3 "Healthcare Information":** Facility Type\* (Primary Care, Emergency Department, ICU, Surgery Center, Radiology, Cardiology, Oncology, Multi-Specialty), Number of Healthcare Providers\* (number input), Current EHR System (optional).
- The state still carries `useCase`, `timeline`, `budgetRange` and `specificNeeds`, and there is a `timelineOptions` list, but **no input exists for any of them**. A number of imported icons are also unused.
- Hidden honeypot input `name="website"` (placed off-screen, `aria-hidden`, `tabIndex=-1`).
- Buttons: "Previous", "Next Step", and on step 3 "Request Demo" (shows "Submitting..." while sending).
- **Submit is real.** `submitDemoRequest()` in `src/lib/crmApi.ts` POSTs JSON to `${VITE_SUPABASE_URL ?? https://kvsqtolsjggpyvdtdpss.supabase.co}/functions/v1/track-event?route=demo-request`. The `track-event` router hands it to `handleDemoRequest` in `supabase/functions/crm/index.ts`. That handler:
  - Treats a filled honeypot as a fake success and saves nothing.
  - Validates the fields (`cleanDemoRequest` in `crm/validate.ts`). Only `firstName`, `lastName`, `email` and `companyName` are required on the server, with length caps.
  - Rate-limits to **5 per IP hash per 24 h and 50 per 24 h in total**.
  - Attaches the request to an existing CRM account with the same name, or creates an inbound target, and writes a `crm_activities` row of type `inbound`.
- **Result states:**
  - `ok` shows a success screen: "Thank You for Your Interest!" / "…a member of our healthcare AI team will contact you within 24 hours…", a "What happens next?" list, and a "Return to Home" button.
  - `rate_limited` (HTTP 429) shows "Too many requests from this connection. Please try again in an hour." This is wrong, because the window is 24 h.
  - `invalid` (HTTP 400) shows "Some details look incomplete…".
  - A network or other error shows "We could not send your request…". It is shown in a `role="alert"` paragraph.
- Trust line under the form: "Live in 25 hospitals" · "“Innovative Startup” status — Government of Georgia".
- **No tracking event fires** on form view, step change or submit. No calendar booking is offered (the hospital deck has an inline calendar, the site doesn't).

**Every CTA on `/`:**

| Label | Location | Goes to |
|---|---|---|
| Book Demo | Header (desktop and mobile) | `/request-demo` (router) |
| The Path / Platform / AI / Safety / Proof | Header | smooth scroll to the matching id |
| 01–06 ticks | LightThread (lg and up) | smooth scroll |
| Build my hospital's future | Hero | `/request-demo` (router) |
| See the path | Hero | scroll to `#path` |
| 6 pillar rows | Platform | `/request-demo` (full page reload, `<a href>`) |
| Book a 30-min demo → | Platform | `/request-demo` (full reload) |
| View public registry → | Proof | gov.ge registry, new tab |
| Book a 30-min demo | Final CTA | `/request-demo` (router) |
| Talk to founders | Final CTA | `mailto:team@updevoteai.com` |
| MediMind Expert / Contact / Innovative Startup Status | Footer | `/expert` proxy, mailto, gov.ge |

---

## 6. Analytics and tracking

**The public landing page fires nothing.** There is no GA, GTM, Plausible, PostHog, Meta pixel or any other analytics in `index.html` or `src/`.
- `src/lib/tracking.ts` (48 lines) only exports `trackEvent(token, event_type, metadata)` and `investorLogin()`. They POST to `track-event`, and their only React caller is `BriefingGate.tsx` (`link_opened`). The static decks call the same endpoint with their own inline scripts.
- The only conversion signal today is the CRM `inbound` activity row created by a successful demo request. There is no page-view, scroll-depth, CTA-click or form-funnel data. `marketing/workshop` may contain a funnel-metrics brief (commit `d466961`), but none of it is implemented on `/`.

---

## 7. Problems visible from code alone (ranked)

### A. Risky or outdated claims (highest priority: legal and trust exposure)
1. **"Unlimited future development included."** (hero) An open-ended contractual-sounding promise.
2. **"New features ready to test in three business days."** (hero) A specific SLA.
3. **"Test it beside your current system in two weeks."** (hero) A specific timeline.
4. **"We match your current software price for early hospital partners. This offer won't be available indefinitely."** plus "Move first. At the software price you already pay." This is a pricing offer combined with scarcity pressure, on a public page.
5. **The 25-hospital claim is told five different ways:**
   - "25 hospitals running on it under one signed chain contract" (Path stat)
   - "From idea to a 25-hospital network in 13 months" (Proof sub)
   - "25-hospital chain — live … running on MediMind network-wide" (Proof tile)
   - "Live in 25 hospitals" (demo form)
   - "Contracted with a 25-hospital chain" (OG description)

   "Contracted" and "live network-wide" are different claims. Check them against the real rollout status before reusing any of them.
6. **"within 24 hours"** contact promise (demo success screen) and "healthcare AI team" wording.
7. **"Beta-tested with 50 cardiologists"**, **"Among the first companies in Georgian history"** and **"40+ vendors / 6+ logins / Forty systems"** have no source cited.
8. **Safety cards describe specific built controls:** fail-closed PRN, DDI permission gate, barcode 5-rights, controlled-substance witness co-sign, time-boxed break-glass, immutable audit. Each should be confirmed as live in the product before being kept.
9. **Positioning drift** against the repo's positioning rules:
   - The meta description and OG/Twitter text use "platform" ("One AI-native platform"). The category word should be "operating system".
   - "One of the first" appears only in the meta description.
   - The page itself never says "operating system" or "ground-up on FHIR R4". The closest it gets is "the global FHIR standard under everything".
   - `Recognition` "Innovative Startup … valid through 01.03.2027" will go stale.
10. **Dormant components carry claims that are now wrong:** Bots (`anatomy.ts`), Flowise/OpenAI Assistants (`aiMoments.ts`), placeholder founder names (`team.ts`). Do not revive them as they are.
11. **Email domain `team@updevoteai.com`.** Confirm this is the intended public inbox. It is used in two places.

### B. Dead or unused code
- 3 unrendered sections plus `aiMoments.ts`. 8 unused UI primitives (see §4). `src/assets/images/gita-grant-logo.png` is unused.
- Unused demo-form fields and option lists.
- `/signin`, `/signup`, Supabase auth and the Header's sign-out block are leftovers. Loading the auth store pulls the ~110 KB Supabase client into the landing page.
- `vite.config.ts` contains dev proxies for Brave, Exa and Perplexity search APIs and `define`s for their API keys. These are leftovers from an old template and should be removed.
- `public/_redirects` has a `/central` proxy pointing at the placeholder host `your-medimind-central-domain.netlify.app`.
- i18n scaffolding is effectively unused (§3).

### C. Accessibility
- **Heading order:** the hero puts three `h2` benefit titles before the first section `h2`, so the outline reads "h1 → h2 (benefit) ×3 → h2 (Problem)…". Hero benefits should be a list, not headings.
- **Demo form labels are not linked to their inputs** (no `htmlFor`/`id`). Error messages are not tied to fields (`aria-describedby`, `aria-invalid`). The step indicator is visual only. Focus is not moved when the step changes.
- The **mobile menu button** has no `aria-label` or `aria-expanded`. The menu does not trap focus or close on Esc.
- **Reduced motion is not honoured** in several places: the MediScribe auto-advance carousel and its infinite waveform (which also has no pause on hover/focus), the hero lamp beam animations, the hover/tap scale on CTAs, the Safety pull line, the FinalCTA, and the demo page's infinite floating blobs. The CSS kill switch only stops CSS animations.
- **Contrast:**
  - LightThread's active label uses `text-light-accent` (#bee3f8) **in light mode too**, which is near-invisible on white.
  - `text-subtle` #64748b on card #f1f5f9 is about 4.3:1, below AA for the 10–11px mono labels used everywhere.
  - Mono labels at `text-[10px]`/`[11px]` are small in general.
- Pillar rows are all links with the same destination and no descriptive accessible name beyond the title. The arrow icon suggests each one opens a detail page, which they don't.
- A global `*:focus-visible` ring exists (good). Buttons built on `motion.button` keep it.
- The site defaults to dark mode and ignores the OS theme preference.

### D. Performance
- **No route-level code splitting.** Admin, CRM, Walkthrough and FounderDemo all ship in the landing bundle. A stale `dist/` from Oct 29 shows JS chunks of index 241 KB, vendor 160 KB, ui 136 KB and supabase 113 KB (all uncompressed), plus 122 KB of CSS.
- framer-motion is used for almost every element, including 40 grid cells and 24 waveform bars. `filter: blur()` reveal transitions on many elements are paint-heavy on low-end phones.
- The hero stacks several `blur-2xl`/`blur-3xl`, `backdrop-blur-md` and full-viewport-width conic layers with `scale-y-125`. That is GPU-heavy. The demo page adds two infinite 384px blurred blobs.
- Images are not a problem today because the page has none. If product screenshots are added, note that the source PNGs are about 0.4–1.9 MB each at 2828 px wide. They need WebP/AVIF conversion with responsive `srcset` and `loading="lazy"`.
- Fraunces ships latin, latin-ext and vietnamese subsets. Only latin is needed.

### E. Mobile
- The hero relies on the lamp's negative `translate-y` and `min-h-0` overrides. Long new copy can push the CTAs far below the fold on 390×844, and the current hero already holds about 9 text blocks before its buttons.
- The demo wizard pads at `p-8` with large `rounded-3xl` and `text-4xl`/`text-xl` headings. That is cramped at 320px.
- The `scrollTo` offset is a hard-coded 80px, but the header is 64px below `md`.
- LightThread is hidden below lg (fine), so mobile has no progress indicator.

### F. SEO and meta
- `og:image` and `twitter:image` use relative paths (`/og-image.png`). Many scrapers need absolute URLs. There is no `og:url`, no `<link rel="canonical">`, and no `og:locale`/`hreflang`.
- JSON-LD `Organization.url` is **`https://medimind.ge`** while the site is medimind.md. There is no logo or `sameAs` in it.
- The page is a client-rendered SPA: crawlers that don't run JavaScript see an empty `<div id="root">`. There is no prerender or SSR, and no `robots.txt` or `sitemap.xml` in `public/`.
- `<title>` is "MediMind — The AI-Native Hospital OS", fine. The OG image (1200×630) shows only the logo and "THE AI-NATIVE HOSPITAL OS", with no value proposition.
- `index.html` has `Cache-Control: no-store` (fine for an SPA shell).

---

## 8. Safe parallel split (3–4 developers, one folder)

Rule: each lane owns whole files. Nobody edits a file outside their lane. Shared files have exactly one owner, and the others send change requests to that owner. Commit only your own paths (`git commit -- <files>`). The deck files in `public/*.html` and the CRM files (`src/pages/*`, `src/data/crm.ts`, `src/lib/crmApi.ts`, `supabase/`) are **off-limits to all lanes**, because other sessions use them.

| Lane | Owns (exclusive) | Delivers |
|---|---|---|
| **L0 · Foundation / integrator** (one person, starts first, about half a day) | `tailwind.config.js`, `src/index.css`, `src/styles/brand-tokens.css`, `src/main.tsx`, `src/App.tsx`, `src/components/Landing.tsx`, `src/components/ui/*` (except `MediMindLogo.tsx`, which is governed by the logo skill), `index.html`, `netlify.toml`, `public/_redirects`, `vite.config.ts`, new `src/content/landing.ts` schema (types only) | Token and primitive updates, reduced-motion helper, lazy routes, meta/SEO, section order. Lands any shared-primitive change *before* other lanes need it. Merges the lanes at the end |
| **L1 · Top of page** | `Layout/Header.tsx`, `Landing/LightThread.tsx`, `Landing/LampHeroSection.tsx`, `Landing/FortySystemsSection.tsx`, new `src/content/landing.hero.ts` | Nav, hero, problem section |
| **L2 · Middle (product story)** | `Landing/ThreePhaseSection.tsx`, `Landing/PlatformPillarsSection.tsx`, `Landing/AISubstrateSection.tsx`, `Landing/MediScribeWalkthrough.tsx`, `src/data/phases.ts`, `src/data/pillars.ts`, any new screenshot assets under a **new** folder `public/landing/` | Path, platform, AI demo, product imagery (optimised copies, not the deck originals) |
| **L3 · Trust and conversion** | `Landing/SafetySection.tsx`, `Landing/RecognitionSection.tsx`, `Landing/FinalCTASection.tsx`, `Layout/Footer.tsx`, `Demo/RequestDemo.tsx`, `src/data/safetyPrimitives.ts`, `src/data/recognition.ts`, `src/lib/tracking.ts` (add landing events, keep the existing exports unchanged) | Safety, proof, CTA, footer, demo form rebuild, analytics |

Notes:
- If copy moves into content files, give each lane its **own** content file (`landing.hero.ts`, `landing.story.ts`, `landing.trust.ts`) so no two people edit one shared copy file.
- New sections get new files, and L0 wires them into `Landing.tsx`.
- Dormant files (`AnatomySection`, `TeamSection`, `AmbitionSection`, `aiMoments.ts`, `team.ts`, `anatomy.ts`, unused `ui/*`) should not be deleted mid-rebuild without the founder's approval. L0 can propose a cleanup at the end.
- The demo form contract with the backend is the field names that `cleanDemoRequest` accepts. L3 must keep `firstName`, `lastName`, `email`, `companyName` (required) and the honeypot `website`. Adding new field names requires a change to `supabase/functions/crm/validate.ts`, which is outside every lane, so ask first.

---

## 9. Commands (not run)

From `package.json`:

```bash
cd "/Users/toko/Desktop/MediMind Landing Page"
npm run dev        # vite dev server (default port 5173)
npm run lint       # eslint .
npm run build      # prebuild runs scripts/hospitals-i18n/check.mjs + build.mjs, then vite build → dist/
npm run preview    # serve dist/
```

There is no `test` script. Related scripts that exist but are not wired into npm:
- `node scripts/landing-shots.mjs <tag>`: Playwright screenshots of `/` (spawns its own Vite on port 5192; captures dark+light × 1600/1440/390 per section into `/tmp/landing-shots/<tag>`).
- The CRM Deno tests (`deno test --allow-env --no-check supabase/functions/crm/validate.test.ts supabase/functions/track-event/routing.test.ts`). These matter only if the demo-request contract changes.

Pushing to `main` deploys to production on Netlify.

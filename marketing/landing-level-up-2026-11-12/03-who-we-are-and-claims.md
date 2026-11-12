# 03 — Who we are, and what we may claim

Truth sheet for the medimind.md rewrite. Written 2026-11-12. Read-only research; nothing here is approved copy.

**How to read this sheet**

- Every claim has a source and a status.
  - **LIVE TODAY**: real hospital staff use it now.
  - **IN PROGRESS**: built or running in parallel, but not yet the hospital's working system.
  - **VISION**: planned or designed, not built or not live.
- If this sheet and `positioning/` disagree, `positioning/` wins. `positioning/04-language.md` decides every external word.
- Source shorthand:
  - `POS/` = `/Users/toko/Desktop/medplum_medimind/positioning/`
  - `BR/` = `/Users/toko/Desktop/medplum_medimind/documentation/brain-roadmap/`
  - `VAULT/` = `/Users/toko/Desktop/Brain/01 - Projects/MediMind/`
  - `MKT` = `VAULT/Marketing Archive/MediMind Marketing — Current State.md` (2026-10-19/20)
  - `REG` = `VAULT/Marketing Archive/Buyer Research/2026-09-22 - Evidence and claim register.md`
  - `PAINS` = `VAULT/Marketing Archive/Buyer Research/2026-09-22 - What hospital decision-makers need to fix.md`
  - `EXPL` = `VAULT/Marketing Archive/Product Explainer/2026-10-08 - Product Explainer for Justyna.md`
  - `PITCH` = `/Users/toko/Desktop/MediMind Pitch - 2026-11-11/MediMind Pitch Script - final.txt`
  - `CASE` = `VAULT/Case Studies/2026-05-21 - Post-PCI Pancreatitis Sepsis (14h Silence).md`
  - `LI` = `VAULT/2026-07-27 - LinkedIn Post Drafts — Lab Cutover.md` (holds the verified-numbers table)
  - `MEM:<name>` = internal agent memory note in `~/.claude/projects/-Users-toko-Desktop-medplum-medimind/memory/` (internal status record, not a public source)

---

## 1. What we are

### One line (approved wording)

> **One hospital. One operating system.**
> Source: `POS/00-what-we-are.md` (short form), `POS/04-language.md` §C (owned phrase).

Category line, when a first-claim is needed:

> **One of the first hospital operating systems built ground-up on FHIR R4.**
> Source: `POS/00-what-we-are.md`, `POS/04-language.md` §C and §D, `VAULT/Pitch Deck/03 - Category.md`.

Note: the class critique on 2026-09-21 said "One hospital. One operating system." as a *headline* did not explain value. Lead with the problem, keep "operating system" in the body (`MKT` clashes C10, C1).

### Three lines

1. MediMind replaces a hospital's disconnected software with one operating system. (`EXPL`, `POS/00`)
2. It is built ground-up on FHIR R4, the global standard for health data, as the storage itself, not a translation layer. (`POS/00` "defense moat", `POS/05` §D)
3. AI works. People decide. The system drafts the note, the form and the claim; the clinician reviews and signs. (`POS/01` principle 3)

### One paragraph

> Most hospitals run on dozens of programs that do not talk to each other, so staff become the connection. MediMind replaces them with one hospital operating system: registration, clinical care, orders, medicines, lab, imaging, billing, staff and ministry reporting in one place, with one login and one live patient record. It is built ground-up on FHIR R4 as the storage primitive, and AI is part of the architecture, not bolted on. The AI prepares the work. Your doctors and staff decide. We start beside your current system, so nothing changes until you have seen it work.

Sources: `POS/00`, `POS/01` (1, 3, 12), `POS/04` §A/§C/§D, `MKT` "Strongest reusable lines" ("When hospital systems do not connect, staff become the connection."), `EXPL` (parallel evaluation, current system stays in place).
Caveat: "starts beside your current system" is approved in `EXPL` and `MKT`, but `MKT` clash C4 flags that it pulls against "we replace, not integrate". Say *beside, then replace*. Never say *integrate with*.

### What we are not (use when a reader confuses us)

- Not an EMR. Not an integration layer. Not an ambient scribe. Not an overlay on another system. (`POS/00` "What we are not")
- Built *on* Medplum, a FHIR platform. We say so openly. (`POS/00`, `POS/05` item 10)

---

## 2. What a hospital gets today

**The honest headline:** the full operating system is built and running in a parallel run with real data at the anchor hospital. Real staff use **lab and imaging** in daily work today. The rest of the operating system is not yet the hospital's official record. WebMed (the legacy system) still is.

Key status sources:

- Founder on 2026-11-11: on the live hospital, "only PACS + lab are used by real users". (`MEM:project_pacs-report-hospital-parity-2026-11-11.md`)
- Parallel run ("Shadow") for the Tbilisi branch since 2026-10-08: real data comes in, nothing goes out, WebMed stays the official record. Covers everything WebMed covers, billing, pharmacy, HR and payroll included. (`MEM:project_tbilisi-shadow-stack.md`)
- A second branch (Mtskheta) was added to the parallel run for a full-day rehearsal, moved to 2026-11-12. (`MEM:project_mtskheta-shadow-onboarding.md`, `MEMORY.md` index)
- `MKT` (Oct 19): the company is pre-revenue. There are no testimonials, no logo permission and no measured outcomes.

### By how a hospital CEO thinks

| Area | What exists | Status | Source |
|---|---|---|---|
| **Lab** | Analyzers send results straight into the operating system through our own middleware. Tbilisi lab went live 2026-07-14 (17 analyzers in fleet, 9 lanes at cutover). On 2026-11-11, 15/15 connected analyzers were healthy. Regional branches are piloting (Sagarejo lane armed, results not yet flowing cleanly). | **LIVE TODAY** at one site (Tbilisi). Regions IN PROGRESS. | `VAULT/Roadmap.md`, `LI` verified table, `MEM:project_pacs-report-hospital-parity-2026-11-11.md`, `/Users/toko/Desktop/medplum_medimind/documentation/laboratory/REGIONAL-ANALYZER-STATUS.md` §1–2 |
| **Imaging (PACS)** | Scanner to archive to chart to viewer, proven end to end with a real CT on 2026-07-29. Imaging reports. | **LIVE TODAY** at the anchor site. | `VAULT/Roadmap.md`, `MEM:project_pacs-report-hospital-parity-2026-11-11.md` |
| **Patients and front desk** | Registration (Georgian personal ID), appointments and scheduling, bed management, coordinator desk, patient portal. | IN PROGRESS (built, in parallel run). `POS/00` calls the coordinator desk "live"; `MKT` C6 says that is an internal claim with no fresh audit. | `POS/03-scope.md`, `POS/00`, `MKT` C6 |
| **Clinical care** | Unified patient chart, doctor order entry (CPOE), medication administration record (MAR), nursing workstation, clinical event engine, operating-room planning. | IN PROGRESS (built, in parallel run; ten real cases being replayed to find go-live gaps). | `POS/03`, `MEM:project_ten-case-demo-program.md` |
| **AI in daily work** | Ambient scribe (Georgian and English voice into a structured note and Form 100 draft), clinical AI chat, blood-gas image reading, auto NEWS2 score from vitals, auto shift handoff (SBAR), drug-interaction checks. | Built. `POS/00` says the scribe is "live"; `MKT` C6 says not audited. Treat as IN PROGRESS for the page. `EXPL`: Phase 2 AI is priced and agreed separately. | `POS/00`, `VAULT/Pitch Deck/AI Moments.md`, `EXPL` |
| **Money** | Charges, billing, insurer claims, prior authorization, payer split. Billing/HR/payroll code closed 2026-11-03 and running in the parallel run. | IN PROGRESS. Only 2 of about 17 insurer claim layouts exist as data. | `POS/03`, `MEM:project_billing-hr-payroll-campaign-2026-11.md`, `BR/00-where-we-stopped.md` |
| **Staff** | HR, roles and permissions, rosters, timesheets, payroll. | IN PROGRESS (parallel run). | `POS/03`, `MEM:project_billing-hr-payroll-campaign-2026-11.md` |
| **Pharmacy and warehouse** | Pharmacy queue and dispensing, stock, transfers, write-offs, warehouse orders. | IN PROGRESS. | `POS/03`, repo git log (warehouse fixes 2026-11-12) |
| **Ministry and insurers** | Ministry of Health forms (Form 100, IV-300/ა and others), government e-health links, MoH form template libraries. | IN PROGRESS. Ministry deadlines in the plan are marked provisional. | `POS/03`, `BR/00-where-we-stopped.md` "Known loose ends" |
| **Running the hospital** | Analytics, multi-branch structure, offline-first app, trilingual (Georgian, Russian, English), audit trail. | Built. Offline and event engine: `VAULT/Roadmap.md` (Aug) says no status evidence in the vault. | `POS/00`, `POS/03`, `VAULT/Roadmap.md` |
| **Data migration** | 1,147,535 patients migrated, 0 gaps, 0 duplicates. | Done (as of July 2026). | `LI` verified table, `VAULT/Roadmap.md` |

**Page rule:** say "built and running in parallel" for most areas. Say "in daily use" only for lab and imaging, and only at one hospital.

---

## 3. The proactive hospital (vision)

### Reactive vs proactive, in plain words

- **Reactive hospital (today):** software waits to be asked. Safety depends on a tired person remembering at 2 a.m. Paperwork is done late. Money leaks between departments. (`CASE` "one-sentence diagnosis"; `BR/15` real stay findings)
- **Proactive hospital (the goal):** the system notices what is missing and has it ready. A person approves, edits or rejects. (`BR/10-master-blueprint.md` Part A, era 1)

Real evidence for the reactive problem (internal, measured, not yet published):

- On one real stay, 261 events landed after discharge; the inpatient card was saved after the patient left; coding was done 8 days late. (`BR/15-real-case-r01-with-the-brain.md`)
- Network counts: 67% of ministry records first sent more than 7 days after discharge; about 47 corrections per 100 visits. (`BR/13-build-stages.md` "Why this cut")
- These are internal legacy-database counts. Using them publicly needs the hospital's permission.

### "One patient walks in. The whole hospital moves."

From `PITCH` (2026-11-11). Strong line. It is **VISION**. On the page it must sit under a future label and next to "the AI flags, your doctors decide" (`POS/04` §D). The roadmap's own day-in-the-hospital story says every step is a prepared card a person approves (`BR/14-how-it-looks-and-works.md`).

### How the Brain acts (internal design, for accurate copy)

- AI "workers" with a badge, like staff. They read the record and prepare work in the same task inbox staff already use. Approve, edit, reject in one tap. (`BR/14`)
- A dial per job, 0 to 5: watch, suggest, prepare, act and tell, act quietly, own it. Every job starts at watch. Only a named person turns a dial up, on proof. (`BR/14`, `BR/glossary.md`)
- Three ceilings never move: **medical work stops at "prepare", a doctor signs**; anything leaving the hospital waits for a person; money going out and pay runs always need a signature. (`BR/14`, `BR/01-vision-and-rulings.md`)
- Admin work leads. Medical watch runs silently and only collects evidence. (`BR/08-focus-and-next-steps.md` §1, founder ruling 2026-11-10)
- The hospital keeps running if the Brain is off. One stop switch. (`BR/14`, `BR/04-proof-and-safety.md` §6)
- Every act goes through the same audited door as a human action. (`BR/01` "Hard rules")
- Identifiers are removed before patient data leaves the hospital. (`BR/01` rulings)

### Safety and proof approach (may be described as our method)

- AI "privileges" like a new doctor: cases seen, agreement rate, who granted the level. (`BR/04` §1)
- Proof ladder: agreement with doctors in watch mode → blind expert panels → ward-by-ward rollout → outcomes. (`BR/04` §4)
- Replay: a worker is run over past days and compared with what staff did, before it touches today. (`BR/14`)
- Closed-loop audit trail: a log that the system started an action that ran with no manual re-entry. "Our equivalent of an FDA number." (`POS/05` §G)

### The staged path

| Stage | Name on the page | Status | Source |
|---|---|---|---|
| 1 | One operating system (replace the legacy stack) | IN PROGRESS: lab and imaging LIVE at one hospital; the rest in parallel run | §2 above |
| 2 | AI in daily work (scribe, assistants) | Built, not offered in the base contract; agreed and priced separately | `EXPL` Phase 2 |
| 3 | The hospital brain (proactive) | **VISION.** Brain build stages 1 to 3 were built on 2026-11-11/12 on a separate branch, tested only against the development cloud. Founder: nothing goes to develop or Shadow until he says "go". | `EXPL` Phase 3, `BR/13`, `MEM:project_brain-roadmap-autonomous-hospital.md` |

Note: `BR/README.md` and `BR/00` (2026-11-10) still say "nothing is built". The memory note (2026-11-12) is newer. Both agree: nothing of the Brain is live.

### What may be said publicly, and how

Allowed, labelled as future (e.g. "Where we are going", "Phase 3, in development"):

- The architectural claim: *"The system that notices and the system that acts are the same codebase."* (`POS/05` §F, `BR/01`)
- "AI works. People decide." and "The AI flags, your doctors decide." visible on every proactive section. (`POS/01`, `POS/04` §D)
- The staged path, with Phase 3 called a development and validation goal. (`EXPL`)
- Admin examples first: forms ready at discharge, missing charges found, ministry records ready before the deadline. Each with "a person releases it". (`BR/08` §2, `BR/14`)

Not allowed (see §6 and §8):

- Any claim that MediMind watches patients *for* the clinician, never misses, or makes medical decisions on its own. (`POS/04` §D)
- Novelty on *detection* (sepsis, deterioration). That category is crowded and regulated. (`POS/04` §D, `POS/05` §E)
- `BR/` goal language as it stands ("near fully autonomous", "AI-run hospital", "zero back-office hospital"). `BR/README.md` rule 1: internal planning, not external language.
- "Practicing medicine without AI will be malpractice" as a fact. Only as a belief with a time frame, backed by checked studies, followed at once by why us. (`BR/01` "The pitch line, with care")

---

## 4. How we do it differently

| Point | Approved wording and limits | Source |
|---|---|---|
| Ground-up on FHIR R4 | "Ground-up on FHIR R4 as the storage primitive." Pair with every first-claim. Zero public matches at audit time. Note: FHIR storage alone is not unique (Firenote, Medplum); the moat is FHIR storage **at whole-hospital breadth**. | `POS/00`, `POS/04` §C, `POS/05` §A item 12, §B |
| One codebase | "One codebase. Not stitched, not an overlay." Every department in one system. | `POS/05` §B, `VAULT/Pitch Deck/03 - Category.md` |
| Doctors build it | "Physician-led team." The pitch is given by a practicing cardiologist. "Built by practicing doctors" and "every UX decision reviewed by a clinician" are on the current site. The "50 cardiologists beta" figure dates from May 2025 (cardiology pilot); re-check before reuse. | `EXPL`, `VAULT/Pitch Deck/Recognition & Traction.md`, `VAULT/Pitch Deck/10 - Progress.md` |
| Tailored per hospital | "Built around the hospital's own workflows." "Ongoing development within agreed scope." Never "unlimited". | `EXPL`, `MKT` Outdated list |
| Speed of change | No public number is approved. "Three business days" and "two weeks from first contact" are ruled out. The only defensible timing: first parallel version in about two weeks **after** scope, permitted data and technical readiness are agreed (about 21 days to first hands-on test). | `REG`, `MKT` "Evaluation timing", `EXPL` |
| Beside the old system first | Parallel evaluation: the current system stays in use, no obligation to buy. Never "no risk" or "zero effort". The lab went live in parallel with the legacy system, with a 30-second rollback. | `EXPL`, `PAINS` objection A, `LI` |
| Works offline, speaks your language | Offline-first; Georgian, Russian, English built in; ministry forms and national IDs built in. | `POS/01` principles 8–9, `POS/00` |
| Data is yours | "Open. Exportable." Code ownership of the first version is in the deck v3 offer, but **lawyer first**. | `POS/01` principle 11, `MKT` Offer |
| Priced for hospitals big vendors do not serve | Say "built for the hospitals big vendors do not serve". Never "cheap". | `POS/04` §D |

---

## 5. Proof ledger

| # | Fact | Date | Source | Safe to publish? |
|---|---|---|---|---|
| P1 | "Innovative Startup" status, Government of Georgia, with income-tax exemption, valid to 2027-03-01. Public registry link exists. | Awarded 2026-02-25 | `VAULT/Pitch Deck/Recognition & Traction.md`, site `src/data/recognition.ts` | **Yes** (public registry). Check the wording "among the first companies in Georgian history". |
| P2 | GITA grant, 150,000 GEL. | Sept 2025 | same | **Yes.** |
| P3 | Signed contract with a 25-hospital network in Georgia; rollout in stages. | LOI Jan 2026; signed May 2026 | `VAULT/Pitch Deck/10 - Progress.md`, `EXPL`, `PITCH` | **Yes as "signed contract with a 25-hospital network".** Naming the network (GeoHospitals) or its logo needs its permission (`MKT` Blocked #3). Never "live in 25 hospitals". |
| P4 | Lab live at one hospital (Tbilisi) since 2026-07-14. 17 analyzers in fleet. Patients moved with 0 gaps, 0 duplicates. Rollback about 30 seconds. | 2026-07-14 / -07-24 | `LI` verified table, `VAULT/Roadmap.md` | **Yes, without naming the hospital** unless permitted. Never hostnames or IPs (`LI` "Never publish"). |
| P5 | First CT study flowed scanner to chart viewer. | 2026-07-29 | `VAULT/Roadmap.md` | Yes, unnamed. |
| P6 | 1,147,535 patients migrated. | July 2026 | `LI`, `VAULT/Roadmap.md` | Needs the hospital's permission (their data volume). |
| P7 | A second large hospital agreed to replace all its software. | "Last week" before 2026-11-11 | `PITCH` only | **No.** No written source found; no name; no signed paper noted. Founder must confirm form (signed or verbal) and permission. |
| P8 | "About 2 million patient encounters on MediMind." | 2026-11-11 | `PITCH` only | **No.** The pitch review asks to confirm whether this is records or encounters per year, moved or being moved (`pitch-script-review-2026-11-11.md`). Migration figures elsewhere: 3.14M encounters loaded (`VAULT/Roadmap.md`, July). |
| P9 | "About 1,000 doctors" in the network. | 2026-11-11 | pitch deck v2, flagged "[confirm]" in the pitch review | **No** until confirmed. |
| P10 | "In emergency rooms, about 1 in 18 patients gets the wrong diagnosis." | — | `PITCH`; deck review names "AHRQ, 2022" | **Only with the citation on the page**, and only after someone reads the AHRQ report. Not verified in these sources. |
| P11 | The 14-hour case (missed pancreatitis after a heart procedure). | 2026-05-21 | `CASE` | **Founder story, de-identified.** Tell it as "from my practice", no age or dates that identify the patient. The "what MediMind would do" half is VISION. |
| P12 | Beta with 50 cardiologists. | May 2025 | `VAULT/Pitch Deck/10 - Progress.md` | Probably yes, but it is old and about an earlier product. Re-check. |
| P13 | "From idea to signed contract in 13 / 15 months." | — | Progress slide says 13; `PITCH` says 15; deck review says use 15 | **Pick one.** Idea March 2025 to contract May 2026 is about 14 months. Founder decides. |
| P14 | Network rank. | — | Site: "Georgia's second-largest hospital chain"; Progress slide: "largest cardiology network in Georgia" | **Sources disagree.** Drop the rank (mentor advice, `pitch-script-review-2026-11-11.md`). |
| P15 | Pricing. | — | Three versions: price matched to current software spend (deck v3); "one monthly fee based on bed count" (`POS/06`); per seat $30/$75/$200 (answer bank). First-contract figures also disagree. | **No price on the page.** Founder decision T4 is open (`MKT` "Pricing story"). |
| P16 | Offer: "our next 5 hospital partners" (deck v3) vs "next 10 hospital clients" (`EXPL`). | Oct 2026 | `MKT` | **No scarcity line** unless a real boundary is written as terms (`MKT` Blocked #2). |
| P17 | Outcomes (money recovered, time saved, lives). | — | none | **None exist.** Do not publish any outcome number. (`MKT`, `REG`) |
| P18 | Customer quotes or testimonials. | — | none | **None exist.** No buyer interviews done (`MKT`). |

**Lawyer needed:** code ownership promise (P-offer), any medical-decision wording (EU-MDR Rule 11, `POS/05` §G), any use of patient or hospital data volumes, privacy policy before the demo form collects data (`MKT` Blocked #4).

---

## 6. Language rules

### Must use

- **operating system** as the category word. Not EMR, platform, suite, ecosystem. (`POS/04` §A, §D)
- **"Ground-up on FHIR R4"** in every first-claim. (`POS/04` §C)
- **"one of the first"**, never "the first". This applies to badges, pills and labels too. (`POS/04` §D)
- **"AI works. People decide."** and **"The AI flags, your doctors decide."** on every proactive section. (`POS/01`, `POS/04` §D)
- Owned phrases: "One hospital. One operating system." · "The forty-system hospital" · "A hospital with a body made of software". (`POS/04` §C)
- Say instead: natively includes (not integrates with) · FHIR-native / built on FHIR (not supports FHIR) · AI-native / AI-orchestrated (not AI-powered) · the specific role (not user) · capability (not module or feature). (`POS/04` §A)
- "Built for the hospitals big vendors do not serve." (`POS/04` §D)

### Never use

- Hype words: revolutionary, disruptive, cutting-edge, best-in-class, world-class, game-changing, synergy, leverage, holistic, turnkey. (`POS/04` §E)
- Phrases owned by competitors: "First FHIR-native EHR", "AI-native EHR", "Operating system for healthcare", "The AI Operating System for healthcare", "World's first agentic AI operating system", "Built from the ground up" (EHR context), and the rest of `POS/04` §B.
- "Integrate with your existing systems" / "connect your systems". (`POS/06`)
- "Cheap", "for the poor". (`POS/04` §D)
- Anything promising autonomous clinical oversight: "never misses", "MediMind doesn't miss things", "watches every patient for you", "makes medical decisions". (`POS/04` §D)
- Outdated offer lines: unlimited development, three business days, two weeks, "won't last", "your own AI brain", "build toward an AI-run hospital". (`MKT` Outdated, `REG`)
- "Workflow" in our own claims (say pathway or orchestration). (`POS/04` §A)
- "Bot" for an AI worker. (`BR/glossary.md`)

### The taxonomy: Heart · Brain · Muscle · Skin · Nerve

- Locked words, always in this order. Memory line: "Heart holds, Brain thinks, Muscle acts, Skin meets the world, Nerve feels every change." Never substitute other words. (`POS/02-taxonomy.md`)
- `POS/02` says use it in docs and decks. The current site keeps `AnatomySection` unrendered as "internal-architecture framing" (`src/components/Landing.tsx` comment). `MKT` clash C3: where it belongs in buyer copy is a founder decision.
- **Suggestion:** keep it out of the hero and the CEO story. Use it once, lower on the page, in a "How it is built" section for the IT reader, with all five words in order. "Brain" may name the Phase 3 vision, always with "your doctors decide".

---

## 7. Buyer

### Who reads the page

- **Economic buyer:** owner, CEO or group operator of a private multi-profile hospital or hospital group in Georgia. Founder: "I'm selling to CEO". (`MKT` ICP and buying roles, `EXPL`)
- **Evaluators:** clinical or operations lead (champion), finance lead / CFO, IT / data owner. (`MKT`)
- `POS/06` has five personas: CEO (200–800 beds), CTO/CIO, Ministry official, coordinator, clinician. `MKT` C5: finance and group-operator roles are not yet in `POS/06`; ministries are not a first funnel.

### Top pains in their words

All are **hypotheses**, not customer quotes. No buyer interviews have been done. (`PAINS`, `MKT`)

1. "We treat the patients, but we lose money in the paperwork and cannot see where costs are getting away from us."
2. "I need my team caring for patients, not entering the same information again and again."
3. "By the time I get a report I can trust, the problem has already cost us."
4. "My doctors should not have to chase information to understand the patient in front of them."
5. "Every change becomes another quote, another wait, or another vendor saying it is not their responsibility."
6. "When someone asks us to prove what happened, my team has to reconstruct it."

From `POS/06`: forty systems, a monthly fee to every vendor, nothing talks to anything, Epic is unaffordable, IT lives in integration tickets.
Master hook (draft): "Why does one patient create so much extra work across your hospital?" (`MKT`)

### Fears about switching

- "Can we change without disrupting care or revenue?" Migration, missing history, training, downtime, failed cutover. (`PAINS` objection A)
- "Can we trust one young supplier with so much of the hospital?" Support, continuity, data export, security, exit. (`PAINS` objection B)
- Answer with: limited scope, named owners, reconciliation, a controlled decision to switch, "nothing changes until you agree". Never "zero risk". (`PAINS`)

### Fears about AI

- Small and mid buyers "are so scared of AI". (`MKT` C13, W1D1 lecture)
- Liability: a promise of oversight invites "you promised oversight" after a missed case. (`POS/04` §D, `POS/05` §G)
- Admin staff may fear for their jobs. (`BR/08` §4)
- Answer with: doctor signs, people set the rules, every act logged, off switch, hospital runs without the AI, admin examples first. (`BR/14`, `BR/04`)

---

## 8. Claims on the current site that these sources rule out

Checked in the landing repo source (`/Users/toko/Desktop/MediMind Landing Page/src/`), 2026-11-12. The deployed site was not opened.

| Where | Current claim | Why it must change | Source |
|---|---|---|---|
| `components/Landing/LampHeroSection.tsx` | "Your own AI brain tomorrow." | Outdated; ruled out by the evidence register. | `MKT` Outdated, `REG` |
| same | "Unlimited future development included. New features ready to test in three business days." | Both ruled out. | `MKT`, `REG` |
| same | "built for better care, more revenue, and less waste" | No measured results; ruled out as a headline promise. | `REG`, `MKT` Outdated |
| same | "one intelligent hospital system" | Category word must be "operating system". | `POS/04` §D |
| `data/recognition.ts` | "25-hospital chain — live … running on MediMind network-wide." | False. Signed, not live. Lab and imaging live at one site. Contracted ≠ live. | `POS/04` §D, `LI`, `MEM:project_pacs-report…` |
| same | "Georgia's second-largest hospital chain" | Rank disagrees with other sources; names the customer indirectly without permission. | P14, `MKT` Blocked #3 |
| `components/Landing/RecognitionSection.tsx` | "Live in hospitals." / "From idea to a 25-hospital network in 13 months." | "Live in hospitals" overstates; month count disputed. | P3, P13 |
| `data/phases.ts` Phase 1 | "25 hospitals running on it under one signed chain contract" | Not running. | `POS/04` §D |
| `data/phases.ts` Phase 3 | "Reads every patient in the building, in real time." · "Spots deterioration early" · "Orders the right tests, books the bed, clears the paperwork." · "Most watchful at 2 a.m." | Implies autonomous clinical oversight and detection novelty. Present tense for a vision. Keeps "The AI flags. Your doctors decide." but the bullets above contradict it. | `POS/04` §D, `POS/05` §E–G, `BR/14` ceilings |
| `data/phases.ts` Phase 3 proof | "1st — hospitals that switch it on run among the first in the world" | A "1st" badge is an absolute claim even with hedged text. | `POS/04` §D ("applies to badges") |
| `components/Landing/ThreePhaseSection.tsx` | "One integration, three stages." | "Integration" is a kill word for us. | `POS/04` §A, `POS/06` |
| `components/Landing/PlatformPillarsSection.tsx` | "Nothing to integrate, no vendors to glue together." | Fine in spirit; keep, but avoid implying every external device or registry is covered. | `REG` "Replace everything" row |
| `components/Landing/FortySystemsSection.tsx` | "The gaps … are where time, money, and lives get lost." | "Lives" is an outcome claim with no evidence attached; soften or cite. | `REG` measurement rules |
| `components/Demo/RequestDemo.tsx` | "Live in 25 hospitals" badge; "within 24 hours" reply promise; 30-minute demo (should be 25) | Badge false; reply promise and duration flagged. `MKT` (Sept) also said the form faked submission; re-check `handleSubmit` before launch. | `MKT` Blocked #1 |
| `components/Landing/FinalCTASection.tsx` | "the command center live" in the demo text; founders' mailto goes to a different domain than `team@medimind.md` | "Command center live" is unverified; check the contact address. | `MKT` C6, `EXPL` contact |
| `data/safetyPrimitives.ts` | Barcode 5-rights, controlled-substance co-sign, break-glass, immutable audit "regulator-ready" | Not ruled out by these sources, but no audit backs "regulator-ready". The lab middleware's own audit had a FAIL release gate in July. Verify before reuse. | `LI` "did not survive" list |

---

## Contradictions: Nov 11 pitch vs older positioning

| # | Pitch (`PITCH`, 2026-11-11) | Older rule or source | Status |
|---|---|---|---|
| C-1 | "We're building the brain that can … make medical decisions within pre-authorised limits." | `POS/04` §D: never imply autonomous clinical oversight. `BR/14`: medical work stops at "prepare"; a doctor signs. | Conflict. For the page: "prepares decisions for your doctors to sign". |
| C-2 | "It spots the pancreas culprit, orders right labs, right consults, right imaging, books an ICU bed, and clears the billing." | `BR/14` ceilings; `POS/05` §E: no novelty on detection. | Conflict if shown as present or autonomous. OK as labelled future with "your doctors decide". |
| C-3 | "At 2 a.m., tired people miss things. MediMind doesn't." | `POS/04` §D liability rule ("you promised oversight"). | Direct conflict. Do not use on the page. |
| C-4 | "In four years, practicing medicine without an AI will be malpractice." | `BR/01`: only as a belief, with checked studies, followed by why us. | Pitch states it as fact. Page: skip, or frame as belief. |
| C-5 | "None of them runs a hospital proactively. MediMind does." | Brain is not live (`BR/00`, memory). `POS/05` §F: claim is architectural. | Conflict (present tense for a vision). |
| C-6 | "one of the first fully AI-native hospitals in the world" | `POS/04` §B: "AI-native EHR" is owned by others; §D requires the FHIR qualifier with any first-claim. | Partly fine ("one of the first"), but missing the "ground-up on FHIR R4" pairing; "fully AI-native" is unproven. |
| C-7 | "an agentic AI harness that does all the work humans do by hand" · "category-defining company" | `POS/04` §B ("agentic AI operating system" owned by SuperOS); §E hype words; `BR/01` "people set the rules". | Conflict in tone and ownership. Investor-only at most. |
| C-8 | "What takes the West years to clear … we build and validate in a week." | `REG`/`MKT`: speed claims ruled out; `BR/04` proof ladder is slow on purpose. | Conflict. Not for the page. |
| C-9 | "signed contract with of 25 hospital network" | Site and deck: "live" in 25. | Pitch is the **correct** one. The site must follow the pitch here. |
| C-10 | "15 months" | Progress slide: 13 months. | Disagree. Founder picks one. |
| C-11 | "second large hospital agreed", "about 2 million patient encounters" | No written source; `MKT` (Oct) says no new customers or proof. | Unverified. Not for the page yet. |
| C-12 | Story leads with a clinical miss (safety). | `BR/08`: admin autopilot leads; buyers buy money and order first. `PAINS`: money and staff time rank first. | Strategy tension. For a buyer page, admin value first, the 2 a.m. story as the "why". |
| C-13 | "we doctors are replacing all of it" | `POS/00` agrees (replace, not integrate). `EXPL` and `MKT` C4: "your current system stays in place during evaluation". | Compatible if the page says "beside first, then replace". |

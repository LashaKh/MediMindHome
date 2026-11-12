# 04: The latest decks and the offer they make

Date: 12 November 2026. Read-only research brief for rewriting the public landing page (medimind.md).
Quotes are exact deck wording. "S" = short deck slide, "L" = long deck slide.

## Sources read

| File | What it is | Last change (git) |
|---|---|---|
| `public/hospitals-minimal.html` | SHORT hospital deck, v6, 21 slides (15 main + 6 appendix), EN + KA | 2026-11-10 (b38778e, Georgian added); built 2026-11-09 |
| `public/hospitals.html` | LONG hospital deck, 17 sections, EN + KA + RU, interactive | f7499c0 "Clarify hospital deck story, offer and free evaluation" (before v6) |
| `public/partner.html` | Older send-ahead proposal, v3, October 2026 | 2026-10-19/20 |
| `public/pitch-v2.html` + `pitch-script-final-2026-11-11.md` + two reviews | Investor pitch, not a hospital deck | 2026-11-11 |
| `marketing/deck-feedback/*` | Mentor feedback (Justina, Nicholas, Brianna) + Irakli's outline, 23 Oct | 2026-10-23 |
| Brain: `Hospital Proposal Deck — Current State.md` | Describes partner.html v3 only | 2026-10-20 |

**The newest hospital story and offer is the SHORT deck (v6).** Treat it as the source of truth. The long deck is older (late October) and differs on several terms (section 4).

---

## 1. Short deck (v6): slide by slide

| No. | Headline (verbatim) | The one point |
|---|---|---|
| S1 | "The AI-native operating system for your hospital." (eyebrow "Hospital partnership") | Title. Dark navy, glass hospital image. Notes: say nothing, start on S2. |
| S2 | "GeoHospitals is replacing every system in its 25 hospitals with MediMind." | Open on the customer. The whole stack, not a pilot. CTO quote. "Central hospital is live today with laboratory and imaging." |
| S3 | "Why would a 25-hospital network trust a new system with everything?" | A pause question. The answer is the sector plus three shared problems. |
| S4 | "Georgian hospitals have little room for error." | 2.4% median margin, 1 in 3 lost money, 37% of revenue from the state "paid against the record". |
| S5 | "Three problems that eat the margin." | Fines and returned claims; management without reliable numbers; staff stretched by repeated manual work. Presenter stops and asks the room. |
| S6 | "Here is how MediMind addresses these challenges." | One-line beat. |
| S7 | "MediMind: all the software your hospital needs. In one system." | Six modules on one system. "Built ground-up on FHIR R4, the international standard" · "Modern technology stack" · "Rapid development by one team". |
| S8 | "What it means for you. Two examples of many." | Billing ("Fewer fines and returned claims") and warehouse ("Numbers management can rely on"), each tied to an S5 problem. |
| S9 | "“...yes, but replacing everything is risky and slow.” Here is how we do it." | Name the objection before the buyer does. |
| S10 | "From zero to live in 90 days." | Days 0–30 evaluation and shadow build; 31–60 hands on; 61–90 full switch. "Day 30: you decide whether to go ahead. Day 90: you are live." |
| S11 | "Switch without stopping your hospital." | Current system keeps running; MediMind built in its shadow; roles swap by day 60–90. Fallback per workflow. Data stays yours. GeoHospitals migration as proof. |
| S12 | "Built by a practising cardiologist and a product leader." | Lasha (MD, CTO) and Irakli (product and strategy). "GITA grant · 500 Global · Innovative Startup status". |
| S13 | "The offer / Let’s discuss our partnership" | Beat before terms. |
| S14 | "Founding partner terms. Two places open." | Four terms (section 4). GeoHospitals logo fills the first seat, two seats "Open". No price. |
| S15 | "Next steps." | Scoping session → reference call with GeoHospitals → kickoff (day 0). "lasha@medimind.md". |
| Appendix | "For the finance, medical and IT leads / Appendix." | Index of A1–A5. Not presented. |
| A1 | "Stock follows the item from receipt to patient." | RS receipt lines matched to the hospital's nomenclature; batch, expiry, issue posts to the patient. Sample data. |
| A2 | "Follow each invoice through to payment." | Invoice GEL 1,000, received 600, outstanding 400; unmatched receipt waits in an exception queue. Sample data. |
| A3 | "AI working today. Your clinicians decide." | MediScribe, AI chat, nursing task to stock. Screenshot `ai-chat-crop.png`. |
| A4 | "Every module, one system." | Five module groups. Screenshot `module-dashboard.png`. |
| A5 | "Where the numbers come from." | Evidence list E1–E6 with levels A/B/C. |

## 2. Long deck (hospitals.html): compressed

| No. | Headline (verbatim) | The one point |
|---|---|---|
| L0 | "Hospital Partnership · The AI-native operating system for your hospital." | Cover. Notes: "Our offer matches your current software spend for the agreed base system". |
| L1 | "Your team is exhausted. Your hospital pays the price." | Four pains: "Care delivered. Payment disputed." · "Exhausted doctors and nurses." · "Money is lost. You can’t see why." · "Held hostage by your software vendor." |
| L2 | "All the software your hospital needs. In one system." | Several suppliers vs one: "Implementation, support and development by one team." |
| L3 | "A system built around your hospital." | Seven-row comparison against "Separate systems" (one OS, finance by department, tailored, unlimited development, own first-version code, FHIR R4, built for AI). |
| L4 | "Control revenue and costs. More time for your team to care for patients." | Four benefits: revenue lost, routine work and staffing cost, capacity, full patient picture. "AI assistance is optional." |
| L5 | "A network of 25 clinics entrusted MediMind with building its unified system." | GeoHospitals proof, longer CTO quote, reference conversation. |
| L6 | "Clinical experience. International product expertise." | Founders, "₾400,000 Total funding raised", "GITA + 500 Global". |
| L7 | "Premium hospital software. Within your current budget." | Offer: "For the next 2 hospital partners" · "You ask. We build and implement." |
| L8 | "Keep your current system. Try MediMind alongside it." | Launched in two weeks; a few hours to try; "Commitment comes after the results". |
| L9 | "Your hospital’s development in 3 stages." | Phase 1 OS (today's offer), Phase 2 optional AI, Phase 3 "Hospital AI Brain" (future). |
| L10 | "Product map / Your modules. What each one does." | Eight product cards with Live / Early version / In development labels. |
| L11 | "Plan your free MediMind evaluation." | 30-minute meeting, video or at the hospital, calendar booking. |
| L12–13 | "Thank you." + embedded `/walkthrough` | End of proposal, live product walkthrough iframe. |
| A1–A2 + sources | "From detecting risk to taking action." · "Your plans should shape your software." · "Evidence behind the presentation" | 14-hour case and Brain demo video; TAVI as custom-development proof; external research (GOSH/NHS, INFORMS, JAMA, Lim & Lim, HL7/WHO). |

## 3. The shared story arc

Both decks tell roughly this story:

1. **Name the product in one line.** "The AI-native operating system for your hospital." (S1, L0).
2. **The hospital is under pressure.** Short: margins and state money (S4). Long: tired staff and lost payments (L1).
3. **The problems.** Returned claims, numbers nobody trusts, repeated manual work. The long deck adds vendor lock-in (L1).
4. **One system replaces many.** Same headline in both: "All the software your hospital needs. In one system." (S7, L2).
5. **What changes for the hospital.** Billing and stock (S8). Revenue, cost, capacity (L4).
6. **Proof: GeoHospitals, 25 hospitals, the central hospital live.** (S2, L5).
7. **A clinician-led team.** (S12, L6).
8. **Low-risk adoption, then the offer and one next step.** (S10–S15, L7–L11).

**Where they differ**

- **Order.** Short opens on proof (S2). Long keeps proof for the middle (L5). Short follows the Oct 23 feedback ("GeoHospitals proof first").
- **Problem framing.** Short is money first: margin, fines, reliable numbers. Long is staff first: "Your team is exhausted."
- **Adoption.** Short gives a dated 90-day plan with a day-30 go/no-go and a switch-over picture (S10, S11). Long says "Launched in two weeks", "A few hours to try it" and has no fixed end date (L8).
- **AI.** Short keeps AI in the appendix (A3) and says it is "what works today". Long has a 3-stage AI path and Brain demo in the main flow (L9, A1). Notes in S4 say the Phase 3 AI layer "is roadmap and not part of the offer".
- **Price.** Short has no price ("No price on screen", S14 notes). Long leads with "Within your current budget" (L7).
- **Evidence.** Short uses MediMind's own analysis of Georgian hospital accounts (S4, A5). Long uses foreign research (sources appendix).

---

## 4. THE OFFER (newest = short deck S14 + S10 + S11)

**Who it is for.** "Founding partner terms. Two places open." (S14). Hospitals, mid-size (revenue GEL 5–100M per S4 notes). Notes: "Two places because that is what the team can onboard properly next year, not a sales device." Keep the line "only while it is true."

**What is free** (S14, verbatim):
- "Free implementation and training" · "The first 30 days with no commitment"
- "Unlimited feature development, free" · "You ask, we build. An answer in 3 workdays, no development fees"
- (S10) Days 0–30: "Your go/no-go, at no cost."

**What is paid and when.** Not stated on any v6 slide. Notes: "Price follows the agreed scope and is discussed in the scoping session." Paid work starts only if the hospital says go at day 30 (implied by S10/S11, not stated as a price term).

**Price logic.** v6: no price, set by agreed scope. Long deck: "Premium hospital software. Within your current budget." (L7). partner.html: "Price matched to your current software spend for the agreed base scope. Paid service starts after acceptance and your decision to proceed."

**Evaluation length and steps** (S10):
- "Days 0–30 · Evaluation and shadow build" — "Success: scope and measures agreed on your numbers. Your go/no-go, at no cost."
- "Days 31–60 · Hands on" — "Success: the first department’s cases go out from MediMind."
- "Days 61–90 · Full switch" — "Success: live on MediMind, measured against your baseline."
- S14: "Day 30: you decide. Day 90: you are live" · "Go ahead, extend the evaluation or walk away, on the agreed measures".
- Notes: the product walkthrough "happens in the first week of this plan, on their data, not in this meeting." Dates hold only if the start date holds.

**Ownership and guarantee lines:**
- S14: "Initial source code as your fallback" · "If we fail to deliver, the initial version’s code is yours". Notes: "say it only as the contract will define it".
- S11: "No commitment before day 30. Agreed fallback per workflow. Your data stays yours: FHIR R4 and full export at any time."

**Scarcity wording.** "Two places open." (S14), with two "Open" seats next to the GeoHospitals seat.

**What is agreed separately.** v6 slides say only that each feature request's "scope and timing ... are agreed, not promised blind" (S14 notes) and that the AI layer is roadmap and outside the offer (A4 notes). The full list appears only in older material: partner.html "Agreed separately: Optional AI services and the future AI Brain · Hardware and third-party service costs · Support levels, price-lock term and rollout schedule". Long deck L8 notes: "Price, support, service scope and any service-level or price-lock terms are documented together before proceeding."

### Terms that differ between versions

| Term | Short v6 (newest, 9–10 Nov) | Long hospitals.html (late Oct) | partner.html (19 Oct, oldest) |
|---|---|---|---|
| Places | "Two places open." | "For the next 2 hospital partners" (notes also say "three partnerships") | "Our next 5 hospital partners" |
| Price | None shown; "follows the agreed scope" (notes) | "Within your current budget" | "Your current software budget." / matched to current spend for agreed base scope |
| Development | "Unlimited feature development, free" + "An answer in 3 workdays" | "Every requested feature and change. No extra development fees, throughout our entire partnership." | "Free tailored development · Ongoing development of the agreed base system" |
| Source code | Conditional: "If we fail to deliver, the initial version’s code is yours" | Unconditional: "You own the code of the first version." (notes: "ownership, not escrow") | Unconditional: "Ownership of the delivered base code, set out in your contract." |
| Evaluation | 30 days free, dated 90-day plan, day-30 go/no-go | "Launched in two weeks", "A few hours to try it", commit "after the results" | "Free parallel evaluation", schedule "agreed around your hospital's readiness" |
| Implementation | "Free implementation and training" | "Tailoring, launch, training and evaluation are free." | "Free implementation · Migration, setup and staff training." |
| AI | Appendix only; roadmap not in offer | Optional Phase 2, future Phase 3, priced separately | "Future AI services are optional and priced separately." |
| Next step | Scoping session with clinical and finance leads | 30-minute meeting, calendar booking | 25 minutes, "Send us two times that work for you" |

**Open conflicts the landing page must not settle on its own:**
- The source-code term switched from unconditional ownership to a non-delivery fallback. The Oct 23 feedback said: "Record both. Do not silently replace one with the other." v6 is newest, but its own notes say to use it only as the contract defines it. **Recommendation:** the public page should say no more than v6, or leave this term out.
- "Unlimited" plus "3 workdays" is v6 wording. Brianna questioned unlimited scope. v6 notes limit it: "the right to request anything within the hospital system ... not promised blind."
- The price is deliberately missing from v6. **Recommendation:** do not put "within your current budget" on the public page unless the founders confirm it still holds.

---

## 5. Proof and numbers (verbatim) and where they appear

| Line | Where | Source level (A5) |
|---|---|---|
| "GeoHospitals is replacing every system in its 25 hospitals with MediMind." | S2 | E3, company (C) |
| "Central hospital is live today with laboratory and imaging." | S2, A5 E3; long L5 notes | C |
| "“Building and deploying a system of this scale and quality this quickly was previously impossible.” Irakli Giorgadze, CTO, GeoHospitals" | S2 (L5 adds "MediMind is doing what has never been done before.") | E5, "approved by GeoHospitals. Reference call cleared." |
| "2.4% Median net margin across 68 mid-size Georgian hospitals (revenue GEL 5–100M)." | S4, A5 E1 | B |
| "1 in 3 of those hospitals lost money in their latest audited year: 24 of 68." | S4 | B |
| "37% of revenue from the state across the hospitals analysed, paid against the record." | S4, A5 E2 | B |
| "Proven at GeoHospitals: 1.1M+ patient records moved with zero gaps and zero duplicates, laboratory running throughout." | S11 | E4 (A) |
| "1,147,535 patient records migrated to FHIR, zero gaps, zero duplicates; 15+ analyser lines live within three weeks." | A5 E4 (Medplum case study) | A |
| "1.15 M patient records migrated" / "Migration completed in July 2026" | partner.html; L5 notes | — |
| "Team of 3; GITA grant of GEL 150,000 received; 500 Global B11 programme; Innovative Startup status ... effective March 2026, second batch." | A5 E6; S12 bottom line | C |
| "₾400,000 Total funding raised" | L6 only | Brain says this figure was dropped from partner v3 as "unverified". Avoid. |
| "9 years at Riot Games ... Duke MBA" · "practising in Tbilisi since 2019 ... 11+ international device trials" | S12 | — |
| "From zero to live in 90 days." | S10 | Plan, not a result |

**Rules from the speaker notes:** say "patient records", not "records". Never say "in under a day". Never show GeoHospitals' financial figures or contract price. Do not name other hospitals. Do not give a savings percentage. Do not say margins are falling. Do not say "1 of 5". Do not promise minutes saved.

**Investor-only lines. Do not put these on the hospital landing page:** "+1 large hospital · Full replacement" and "~2M patient encounters" (pitch-v2 slide 01). Also "In four years, practicing medicine without an AI will be malpractice." and "1 in 18 ER patients get the wrong diagnosis" (pitch script). The second hospital appears on no hospital deck, and the review marks its numbers "[confirm]".

---

## 6. Lines worth reusing on the landing page

**The 15 strongest lines**

1. "The AI-native operating system for your hospital." (S1)
2. "GeoHospitals is replacing every system in its 25 hospitals with MediMind." (S2)
3. "Central hospital is live today with laboratory and imaging." (S2)
4. "Georgian hospitals have little room for error." (S4)
5. "Three problems that eat the margin." (S5)
6. "A record with gaps, or corrected without a trace, does not survive the Ministry’s review." (S5)
7. "All the software your hospital needs. In one system." (S7, L2)
8. "Built ground-up on FHIR R4, the international standard" (S7)
9. "Every invoice tied to a complete record before it goes out." (S8)
10. "Stock figures that stand up to audit, linked to the patient and the bill." (S8)
11. "“...yes, but replacing everything is risky and slow.” Here is how we do it." (S9)
12. "From zero to live in 90 days." + "Day 30: you decide whether to go ahead. Day 90: you are live." (S10)
13. "Switch without stopping your hospital." (S11)
14. "Your data stays yours: FHIR R4 and full export at any time." (S11)
15. "Built by a practising cardiologist and a product leader." (S12). Runner-up: "AI working today. Your clinicians decide." (A3)

**Lines feedback or notes say to drop or avoid**

- "Held hostage by your software vendor." (L1). It attacks suppliers. Feedback warned against unverified claims about "every supplier". It is not in v6.
- "Your team is exhausted." as the lead (L1). Brianna said to lead with an executive outcome. v6 leads with money.
- "Less routine work. Lower staffing costs." / "fewer staff" (L4, L9). These are not measured, and v6 drops them.
- The 3-stage AI Brain in the main flow (L9, A1). Brianna and Justina said to put it late or in a separate deck. v6 says the Brain is roadmap and not part of the offer.
- "₾400,000 Total funding raised" (L6). Removed as unverified.
- "limited-time offer" or any countdown. Brianna rejected these. Capacity-based scarcity only.
- The 02:00 / 14-hour story with the AI rescue on hospital material. partner v3 removed it because "the MediMind intervention ... was simulated".
- "EMR", "platform", "integrates" (S7 notes). Never "the first". Always "one of the first".
- "25 live hospitals" or "live across all 25". Correct form: 25 under one agreement, central hospital live.

---

## 7. Visual language of the short v6 deck

**Canvas.** Each slide is 1280×720 with inline styles, ported at 2/3 scale from 1920×1080. Most slides are white. The cover and Next steps are dark navy. The appendix divider is pale blue-grey.

**Palette (hex, with usage counts in the file)**

| Role | Hex | Use |
|---|---|---|
| Headline navy | `#1a365d` (155) | All headlines, card titles, wordmark "Medi" |
| Accent blue | `#3182ce` (107) | Keyword highlight inside headlines (e.g. "eat the margin"), wordmark "Mind", success lines |
| Body slate | `#334155` (98) | Body text |
| Muted slate | `#64748b` (126) | Eyebrows (uppercase), captions, page numbers |
| Faint | `#94a3b8` | Source labels |
| Hairline | `#e2e8f0` (58), `#d5deea` (24) | Borders, dividers |
| Pale blue | `#bee3f8` (32), `#f1f5fb` (21) | Tints, appendix background |
| Dark navy | `#0f1f3a` (23) | 4px top rules on columns, dark slide (Next steps) |
| Deepest navy | `#081c35` | Cover, page background, theme-color |
| Deep blue | `#2b6cb0` | Gradient end |
| Alert red | `#c53030` | Used only for the loss stat on S4 ("1 in 3") |
| Light accent on dark | `#8fc7f5`, `#7dd3fc` | Highlights on dark slides |

Gradients: `linear-gradient(135deg, #0f1f3a 0%, #1a365d 45%, #2b6cb0 100%)` (dark panels). The cover image sits under a fade from left to right, `#081c35` to transparent.

**Fonts.** One family only: Inter (`/fonts/Inter-latin.woff2`, weights 100–900). Georgian uses Noto Sans Georgian (`/fonts/NotoSansGeorgian-georgian.woff2`), registered as a second "Inter" face with `size-adjust: 86%`. In practice there are only two weights: 800 for headlines and 600 for labels. Body text is 400.

**Type scale** (canvas px; multiply by 1.5 for the 1920 original):
- Cover title 88px/800, letter-spacing -0.04em. Cover subline 40px/400.
- Slide headline 48–52px/800, line-height 1.08, letter-spacing -0.02em, navy, with one accent-blue phrase.
- Big stat 160px/800 (S4 "2.4%"), with secondary stats at 74.667px.
- Card title 25.333–29.333px/800 (or 600).
- Body 18.667–22.667px, line-height 1.35–1.4.
- Eyebrow 18px/600, uppercase, letter-spacing 0.08em, `#64748b`.
- Footer 16px.

**Layout habits**
- Padding of 64px top and 96px left/right.
- One headline at the top-left, left-aligned. Lots of white space.
- Two or three equal columns. Each column has a 4px `#0f1f3a` top rule, a bold title and one sentence.
- No boxes or shadows on main slides. Radii are small (9.333px) where cards exist. Buttons are pills.
- Every slide has the same footer: nine-box logo + "Medi**Mind**" wordmark on the left, page number on the right.
- One idea per slide. Pause slides are a single sentence (S3, S6, S13).
- Appendix illustrations carry an honest tag: "Illustration · sample data" or "MediMind · demo data".

**Images in `public/deck-assets/v6/`**

| File | Size | What it shows | Reusable on landing? |
|---|---|---|---|
| `hospital-vision.png` | 1672×941 | AI-rendered glass hospital at dusk (S1 cover) | Yes as a hero background. Brain flagged it as AI-made and said to label or swap it. |
| `founders.png` | 900×846 | Lasha Khoshtaria and Irakli Pkhovelishvili (S12) | Yes, for the team section |
| `module-dashboard.png` | 2300×1354 | Real MediMind admin dashboard: category sidebar (Staff Management, Clinic Operations, Nomenclature, Financial, Warehouse, Command Center, Analytics, System Config) and module cards (A4) | Yes. Caution: the bottom-left corner shows the `admin@medimind.ge` account and "54 Modules". Crop it out for public use. |
| `ai-chat-crop.png` | 2588×514 | Real AI chat answer summarising a demo patient: acute diagnosis in Georgian plus chronic conditions, with input "...does your protocol say about..." (A3) | Yes, labelled as demo data |
| `geo-hospitals-logo.png` / `-white.png` | 378×157 | Customer logo, dark and white versions | Yes. Notes say the name, CTO quote and reference call are cleared with GeoHospitals. |
| `logo-nine-box-accent.svg` / `-white.svg` | — | The nine-box MediMind mark used on v6 | Check against the `medimind-logo` lockup rules before reuse |

More real product screenshots, used by the long deck and walkthrough, are in `public/deck-assets/screenshots/`. Examples: `revenue-cycle.png`, `laboratory.png`, `dicom.png`, `bed-board.png`, `command-center.png`, `patient-360.png`, `mediscribe.png`, `ai-chat.png`, `cpoe.png`, `mar.png`, `nursing.png`, `moh.png`. For a landing page that follows v6, the best matches are billing (`revenue-cycle.png`), warehouse, lab and PACS (`laboratory.png`, `dicom.png`). Check each one for PHI or account names before publishing. I did not inspect them.

---

## 8. CTA and booking flow

- **Short deck (newest):** one ask, spoken rather than built into the slide. "Ask for one thing: a date for the scoping session with their clinical and finance leads." (S15 notes). Steps on screen: "Scoping session with your clinical and finance leads" → "Reference call with GeoHospitals" → "Kickoff: day 0 of the 90". Contact shown: `lasha@medimind.md`. No form, no calendar.
- **Long deck:** slide L11, "Plan your free MediMind evaluation." "30 minutes with our team to agree how you’ll try MediMind in your hospital." There is a radio choice of "Video call" or "At your hospital". The button "Book 30 minutes" opens a dialog with an embedded Google Calendar appointment page, one schedule for each format (URLs in `data-booking-url-online` / `data-booking-url-hospital` on `#hospital-meeting`; logic in `public/deck-assets/hospitals-meeting.js`). If the calendar fails, it falls back to a prefilled mailto to `team@medimind.md`. Takeaways listed: "Your evaluation plan" · "The tools your team needs" · "Your priorities".
- **partner.html:** "Let's start with one process in your hospital." · "25 minutes" · "Send us two times that work for you" · phone/WhatsApp + `team@medimind.md`.
- **Password gate:** `hospitals.html` and `hospitals-minimal.html` share one client-side password and the session flag `mmh_access`. Unlocking one deck unlocks the other. `?preview=1` and `?print-pdf` skip the gate. Both are `noindex`. The password is in the HTML and in `src/data/decks.ts`. It is not repeated here.
- **Landing page today:** has a "Request demo" form (`src/components/Demo/RequestDemo.tsx`). It posts to the Supabase `crm` function (`route=demo-request`), which feeds the admin CRM.

**How the landing page should hand off (recommendation)**

1. Make the main CTA match v6: "Book a scoping session". One short line under it: "30 minutes with your clinical and finance leads. Online or at your hospital."
2. Reuse the existing Google Calendar appointment links (video and on-site) from the long deck. Keep the CRM demo-request form as the fallback, or as the primary path if lead capture matters more. Either way the lead lands in the CRM.
3. Use one secondary CTA for warm visitors: a request for the hospital proposal ("Get the partner deck"). Send the gated `hospitals-minimal.html` link and password by email after the request. Do not publish the password or link the gated deck openly.
4. Repeat the v6 risk-reversal next to the CTA: "The first 30 days with no commitment" and "Day 30: you decide. Day 90: you are live." Show the scarcity line "Two places open" only while the founders confirm it is true.

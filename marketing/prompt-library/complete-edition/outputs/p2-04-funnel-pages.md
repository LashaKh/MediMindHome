# Part 2, Prompt 4 — Build Your Funnel Pages

> **Status and inputs, 23 September 2026.** Complete page-copy and wiring specification, **not implemented website work**. The [85-item content catalog](../working/content-catalog.json) from Prompt 1 is the source of content-piece IDs, channels, CTAs, and destinations. The provisional buyer is a Georgian private-hospital CEO/owner/group operator; the campaign is **“One patient. Too much repeat work.”** with the question **“Why does one patient create so much extra work?”** and the CTA **“Map my hospital's first improvement.”** The first sale step is a recommended 25-minute founder-led pathway demo and a possible measured, readiness-dependent parallel evaluation. There are no approved customer testimonials, outcome numbers, or logos in this edition. The site homepage `/` and `/request-demo` route exist, but the catalog's proposed product, proof, worksheet, offer, comparison, activation, and referral destinations do not yet exist as verified routes. Source inspection of `/request-demo` found a simulated submission rather than durable lead receipt. Do not publish campaign links to unbuilt routes or claim that a form request is received until tested.

**Conversion-rate note.** The source library states broad SaaS uplift/rate claims for clear headlines, short forms, proof, video, and calendars without a verifiable source in the supplied text. They are design prompts, not MediMind benchmarks. Every page below names its actual conversion event and a practical **pre-launch gate**. With tiny hospital volumes, report counts and N/A when a denominator is zero; do not optimize to a borrowed percentage. A calendar should only be embedded when it really books, respects local time, and confirms an owner. A form should only promise a privacy or response practice after operations adopts it.

## Step 1 — Map every content piece to its destination

**Route key.** P01 `/pathway-assessment` = awareness worksheet and five-minute check; P02 `/hospital-os` = product overview; P03 `/case-study` = verified case study, held pending evidence; P04 `/webinar` = optional webinar, unscheduled; P05 `/request-demo` = existing demo route needing repair; P06 `/early-partner` = offer and evaluation; P07 `/compare` = alternatives comparison; P08 `/activation` = private activation; P09 `/referrals` = private advocacy; P10 `/evidence` = evidence method and later approved stories; P11 `/sandbox` = optional guided synthetic-data trial, unlaunched. Only P05 currently corresponds to a catalog destination already in the site. P04 and P11 are included because the separate page library asks for those page types; no content-catalog item points to them yet.

The table is the **complete 85-piece map**. The CTA text is the action from the catalog; the destination key resolves to the route/type above. `No` means the proposed destination is not verified as live; `Yes, repair` applies only to P05. The page-action map in Part 2 supplies the next step after landing, so each row forms a complete content → page → action flow.

| Content piece (ID and name) | Stage | CTA action → destination/type | Exists? |
|---|---|---|---|
| T01 One patient, seven handoffs | TOFU | Map my hospital's first improvement → P01 worksheet | No |
| T02 The hidden cost of searching | TOFU | Use the pathway worksheet → P01 worksheet | No |
| T03 When two reports disagree | TOFU | Get the reconciliation checklist → P01 worksheet | No |
| T04 The duplicate-entry trail | TOFU | Map my hospital's first improvement → P01 worksheet | No |
| T05 Three calls for one result | TOFU | See the pathway map → P01 worksheet | No |
| T06 The spreadsheet behind the dashboard | TOFU | Get the checklist → P01 worksheet | No |
| T07 How to map a patient handoff | TOFU | Download the worksheet → P01 worksheet | No |
| T08 Why hospital reports disagree | TOFU | Get the reconciliation checklist → P01 worksheet | No |
| T09 What a delayed claim does and does not mean | TOFU | Map one claim pathway → P01 worksheet | No |
| T10 Patient-pathway friction worksheet | TOFU | Download the worksheet → P01 worksheet | No |
| T11 Five-minute handoff check | TOFU | Run the check → P01 worksheet/check | No |
| T12 Founder-built scope trace | TOFU | See the operating system → P02 product | No |
| T13 Synthetic handoff before/after | TOFU | See the pathway map → P02 product | No |
| T14 Where the work repeats | TOFU | Use the pathway worksheet → P01 worksheet | No |
| T15 A report you had to rebuild | TOFU | Get the checklist → P01 worksheet | No |
| T16 Hospital-operator discussion prompt | TOFU | Read the handoff guide → P01 worksheet | No |
| T17 Clinical-operations partner note | TOFU | Download the worksheet → P01 worksheet | No |
| M01 Fix a screen or fix the pathway? | MOFU | Compare the approaches → P07 comparison | No |
| M02 What parallel evaluation actually requires | MOFU | See the evaluation plan → P06 offer | No |
| M03 AI assists; clinicians decide | MOFU | See how it works → P02 product | No |
| M04 Three options on one whiteboard | MOFU | Compare the approaches → P07 comparison | No |
| M05 What happens in 25 minutes | MOFU | Request a pathway demo → P05 demo | Yes, repair |
| M06 A result becomes a task | MOFU | See the operating system → P02 product | No |
| M07 How to evaluate hospital software without a risky cutover | MOFU | Get the evaluation plan → P06 offer | No |
| M08 Hospital OS versus overlay versus current vendor change | MOFU | Compare the approaches → P07 comparison | No |
| M09 What FHIR R4 changes in hospital work | MOFU | See the product path → P02 product | No |
| M10 Parallel-evaluation readiness checklist | MOFU | Download readiness checklist → P06 offer | No |
| M11 Three-option decision worksheet | MOFU | Compare the approaches → P07 comparison | No |
| M12 Documented domain map | MOFU | Inspect product scope → P10 evidence | No |
| M13 Live-pathway evidence template | MOFU | See the evidence method → P10 evidence | No |
| M14 The change-risk question | MOFU | See the evaluation plan → P06 offer | No |
| M15 The current-vendor alternative | MOFU | Compare the approaches → P07 comparison | No |
| M16 Peer discussion on evaluation design | MOFU | Get the readiness checklist → P06 offer | No |
| M17 IT and clinical review session | MOFU | See the evaluation plan → P06 offer | No |
| B01 What your 25-minute demo will settle | BOFU | Request a pathway demo → P05 demo | Yes, repair |
| B02 Match price, define total cost | BOFU | Discuss the early-partner offer → P06 offer | No |
| B03 The honest go/no-go test | BOFU | Request a pathway demo → P05 demo | Yes, repair |
| B04 Demo in sixty seconds | BOFU | Request a pathway demo → P05 demo | Yes, repair |
| B05 Parallel beside current work | BOFU | Discuss an evaluation → P06 offer | No |
| B06 Who should join the first call? | BOFU | Request a pathway demo → P05 demo | Yes, repair |
| B07 Questions to ask before a hospital OS demo | BOFU | Request a pathway demo → P05 demo | Yes, repair |
| B08 What happens after a parallel evaluation | BOFU | See the evaluation plan → P06 offer | No |
| B09 What current-software price match should include | BOFU | Discuss the early-partner offer → P06 offer | No |
| B10 Pathway demo preparation card | BOFU | Prepare my demo → P05 demo | Yes, repair |
| B11 Evaluation decision sheet | BOFU | Discuss an evaluation → P06 offer | No |
| B12 Verified implementation timeline | BOFU | Review verified evidence → P03 case study | No; evidence held |
| B13 Buyer-approved workflow result | BOFU | See the evidence method → P10 evidence | No; result held |
| B14 Your pathway before our demo | BOFU | Prepare my demo → P05 demo | Yes, repair |
| B15 What we will compare | BOFU | Review the evaluation plan → P06 offer | No |
| B16 Private buying-committee walkthrough | BOFU | Request a pathway demo → P05 demo | Yes, repair |
| B17 Procurement questions session | BOFU | Discuss the early-partner offer → P06 offer | No |
| A01 First pathway, first baseline | AFU | Review the activation plan → P08 activation | No, private |
| A02 What staff should report in week one | AFU | Use the activation checklist → P08 activation | No, private |
| A03 One improvement, then the next | AFU | Review next-pathway options → P08 activation | No, private |
| A04 How to log a handoff issue | AFU | Open the activation guide → P08 activation | No, private |
| A05 Five-minute pathway review | AFU | Review the activation plan → P08 activation | No, private |
| A06 How a testable change becomes approved | AFU | Use the change checklist → P08 activation | No, private |
| A07 Measuring repeat work without double counting | AFU | Use the measurement sheet → P08 activation | No, private |
| A08 Running a safe pathway review | AFU | Open the activation guide → P08 activation | No, private |
| A09 Selecting the second pathway | AFU | Review next-pathway options → P08 activation | No, private |
| A10 First-pathway measurement sheet | AFU | Download the measurement sheet → P08 activation | No, private |
| A11 Change-request decision card | AFU | Use the change checklist → P08 activation | No, private |
| A12 Accepted-workflow log | AFU | Review the activation plan → P08 activation | No, private |
| A13 Measured improvement record | AFU | Review the measurement sheet → P08 activation | No, private |
| A14 Your first review agenda | AFU | Review the activation plan → P08 activation | No, private |
| A15 A request ready for test | AFU | Use the change checklist → P08 activation | No, private |
| A16 Clinical-IT issue huddle | AFU | Open the activation guide → P08 activation | No, private |
| A17 Cross-site learning exchange | AFU | Review next-pathway options → P08 activation | No, private |
| L01 The buyer's permission comes first | LOFU | See approved stories → P10 evidence | No; proof gated |
| L02 A pathway another leader can inspect | LOFU | Read the case study → P03 case study | No; evidence held |
| L03 What we changed after feedback | LOFU | See approved stories → P10 evidence | No; proof gated |
| L04 Customer pathway walkthrough | LOFU | Read the case study → P03 case study | No; evidence held |
| L05 What a reference actually verified | LOFU | See approved stories → P10 evidence | No; proof gated |
| L06 Why we chose the first pathway | LOFU | Read the case study → P03 case study | No; evidence held |
| L07 How to read a hospital software case study | LOFU | See approved stories → P10 evidence | No; proof gated |
| L08 From one hospital pathway to another | LOFU | Read the case study → P03 case study | No; evidence held |
| L09 What changed in a claim handoff | LOFU | Read the case study → P03 case study | No; evidence held |
| L10 Reference-story evidence checklist | LOFU | Download the checklist → P10 evidence | No; proof gated |
| L11 Peer evaluation guide | LOFU | Get the guide → P09 referral | No, private |
| L12 Buyer-approved measured case study | LOFU | Read the case study → P03 case study | No; evidence held |
| L13 Reference conversation | LOFU | Request a reference → P09 referral | No, private |
| L14 Share the method, not a claim | LOFU | Review the story request → P09 referral | No, private |
| L15 A peer may have this problem | LOFU | Share the approved case study → P03 case study | No; evidence held |
| L16 Peer operator exchange | LOFU | Request a reference → P09 referral | No, private |
| L17 Hospital-association learning session | LOFU | See approved stories → P10 evidence | No; proof gated |

## Step 2 — Identify which pages need to be built and edit what exists

**I will now build the following page-copy specifications:** P01 worksheet; P02 product overview; P03 case-study shell held for evidence; P06 evaluation/offer; P07 alternatives comparison; P08 private activation; P09 private referral; P10 evidence hub. P05 is an existing route with edits below. P04 webinar and P11 guided sandbox are optional copy-ready additions from the separate page library, **not current campaign destinations**. No code or site route is changed by this document.

| Page | Visitor/job | Required state before promotion | Conversion event to count |
|---|---|---|---|
| P01 worksheet | TOFU visitor identifies a first pathway and receives a useful worksheet | Page, actual asset delivery, consent text, and analytics verified | Worksheet received; subsequent qualified demo counted separately |
| P02 product | TOFU/MOFU visitor understands mechanism and boundaries | Product scope and screenshots checked against accepted current capability | Click to demo from a relevant visitor |
| P03 case study | BOFU/LOFU reader evaluates a real customer result | Customer permission, baseline, method, after measure, limitations, and quote approval | Qualified demo or reference request; **hold until evidence exists** |
| P05 demo | MOFU/BOFU visitor requests a founder-led pathway conversation | Actual lead persistence/notification, owner, error handling, and tested confirmation | Valid received request → booked → held qualified demo |
| P06 offer | MOFU/BOFU buyer understands evaluation and commercial questions | Founder-defined terms and readiness boundaries confirmed per proposal | Demo request or readiness discussion |
| P07 comparison | MOFU buyer chooses among current supplier, narrow tool, and MediMind | Fair current information; no unsupported competitor weakness | Demo request with named alternative |
| P08 activation | AFU customer starts accepted pathway work | Private access, named owner, agreed scope/data and safety plan | First accepted task/baseline recorded |
| P09 referral | LOFU customer chooses whether to introduce a peer | Permission, customer satisfaction, no implied incentive | Permissioned introduction; no unsolicited send |
| P10 evidence | MOFU/BOFU/LOFU reader sees what is documented and pending | Accurate scope statuses and separate public approvals | Evidence inspection → qualified demo; approved story views separately |
| P04 optional webinar | MOFU attendee registers for a real practical session | Actual date, host, platform, reminder/recording policy | Real registration; **N/A while unscheduled** |
| P11 optional sandbox | BOFU evaluator requests a guided synthetic-data trial | Working safe environment, owner, scope, terms, data handling | Trial accepted and first task completed; **N/A while unlaunched** |

### Existing P05 `/request-demo`: precise edit instructions

The inspected [RequestDemo.tsx](</Users/toko/Desktop/MediMind Landing Page/src/components/Demo/RequestDemo.tsx>) currently displays “Enterprise Demo Request,” “See MediMind on your hospital's workflows,” a “30 minutes” subheadline, a three-step form with nine required fields, “Request Demo,” a timer/console-log success path, a 24-hour contact promise, and “Live in 25 hospitals.” These are source observations, not a deployed-browser audit.

| Location | Current copy/behavior | Replacement | Reason |
|---|---|---|---|
| Eyebrow and H1 | “Enterprise Demo Request”; “See MediMind on your hospital's workflows” | “FOR GEORGIAN HOSPITAL LEADERS”; “Map your first patient-pathway improvement” | Connect the campaign promise to the landing page. |
| Subhead | “30 minutes. One login, one chart, one patient — live…” | “In 25 minutes with our founder, trace one recurring handoff and choose what your team should measure before a wider change.” | Match the offered call and avoid implying a real patient's live record. |
| Form introduction | Three stages headed Personal, Company, Healthcare | “Bring one handoff your team repeats. No patient details needed.” One compact step. | Keep focus on the buyer's job. |
| Fields | Nine required fields across three steps, phone optional | Required: name, work email, hospital/group. Optional: one-line pathway question. | Enough to route a relevant conversation without collecting unnecessary data. |
| Submit | “Request Demo” | “Map my hospital's first improvement” | Exact campaign CTA. |
| Success/error | Simulated success and 24-hour contact promise | Real receipt success: “Your request was sent. We will contact you to arrange the 25-minute pathway demo.” Failure: “We could not send your request. Please try again or use the verified contact option.” | Never say a lead was received unless it was delivered; no unconfirmed response SLA. |
| Trust and proof | “Live in 25 hospitals”; government status badge | Remove live-site count pending verified accepted scope and public approval. Use specific process copy below. Retain startup badge only after wording/documentation check. | A signed network agreement does not establish all-site go-live. |

**Final consolidated P05 demo page copy** (publish only with repaired behavior):

> **Eyebrow:** For Georgian hospital leaders  
> **Headline:** Map your first patient-pathway improvement  
> **Subheadline:** In 25 minutes with our founder, trace one recurring handoff and choose what your team should measure before a wider change.  
> **Hero body:** Bring one moment where information had to move between clinical, operations, and finance teams. We will follow the work together using a synthetic example and mark what your hospital would need to check.  
> **What you will see:** (1) a pathway map from the first task to the next responsible person; (2) a proposed connected version beside today's work; (3) a first measure, owners, and readiness questions for a possible parallel comparison.  
> **Form headline:** Which handoff should we map?  
> **Fields:** Name; work email; hospital/group; optional one-line pathway. Do not enter patient information.  
> **Button:** Map my hospital's first improvement  
> **What happens next:** After a successful request, our team contacts you to arrange the founder-led call. No meeting is booked by merely submitting this form.  
> **Process proof alongside form:** A physician founder will map one pathway with you. The first output is a question your clinical, operations, and IT colleagues can inspect—not a claim of measured hospital results.  
> **Closing CTA:** Bring one repeated handoff. Leave with a first improvement worth testing. **Map my hospital's first improvement.**

If an actual calendar integration is introduced, its slots, timezone, confirmation, and ownership must be tested before the copy says “book.” Customer-quote, result, or logo columns remain empty until permitted. The primary conversion is a **held qualified demo**, not a displayed success screen.

### P01 `/pathway-assessment` — lead capture for T01–T11, T14–T17 / TOFU

**Visitor arrives from:** founder LinkedIn/video, a guide, a permissioned email, or a professional discussion. **Job:** identify one repeated patient-workflow handoff. **Conversion event:** successful worksheet delivery; do not infer purchase intent.

> **Headline (7 words):** Find the handoff your team repeats  
> **Subheadline:** A five-minute worksheet to trace one patient journey, mark avoidable handoffs, and choose a first question to measure.  
> **Hero body:** Start with an actual recent pathway, but do not enter patient details. The worksheet makes the work visible before anyone argues for a new system.  
> **What you get:** (1) four boxes for request, result, next decision, and financial close; (2) a place to mark calls, copied facts, waits, and owners; (3) one question for your clinical and operations leads to test.  
> **Form headline:** Send me the pathway worksheet  
> **Fields:** First name; work email.  
> **Button:** Send the pathway worksheet  
> **What happens next:** We email the blank worksheet and show an immediate download link after successful delivery.  
> **Privacy copy, proposed pending policy review:** We use your work email to deliver the worksheet and respond to your request. Separate opt-in is required for campaign emails. Do not include patient information.  
> **Optional next step after value is delivered:** If a recurring handoff matters to your hospital, **map my hospital's first improvement** in a 25-minute founder-led call.

**Actual worksheet body, ready to place in a one-page PDF or on-page form:** “Patient pathway: ______ (describe the kind of journey, not a person). Date observed: ______. (1) First request: who creates it, where is it recorded, and who needs it next? (2) Result or response: where does it arrive, who notices, and what happens if it is late? (3) Next clinical/operations decision: what facts must be visible, who confirms them, and what gets re-entered? (4) Financial/administrative close: what must reconcile, what does staff check manually, and what remains unknown? Circle each call, copied fact, wait, or recheck. Count the circles; note the staff time and any exception you can verify. Ask: which circle repeats enough to be worth fixing, and could the current supplier or a narrow change remove it?” This is a worksheet, not a diagnostic score. The P01 five-minute check uses these four boxes and returns the chosen pathway, not an invented maturity grade.

### P02 `/hospital-os` — product overview for T12–T13, M03, M06, M09 / TOFU–MOFU

**Visitor arrives from:** a synthetic pathway visual, a mechanism post, or a FHIR explainer. **Job:** understand what MediMind does today, what needs local setup, and what is future direction. **Conversion event:** qualified move to a demo request.

> **Eyebrow:** One hospital pathway at a time  
> **Headline:** Clinical and business work, in one path  
> **Subheadline:** MediMind is a Georgian hospital operating system built around a shared FHIR R4 record and workflows that cross departments.  
> **Opening:** A patient journey does not end at a chart. An order, result, task, medicine, bill, and report may pass through different teams. MediMind gives those teams a shared foundation so the next responsible person can work with relevant context. What the system can demonstrate or deploy at your hospital depends on the agreed modules, interfaces, data, and review.  
> **How it works:** (1) Map the current pathway and people who own each step. (2) Show a proposed connected workflow using synthetic data. (3) Set a baseline and compare, with clinical and IT sign-off before any production change.  
> **What FHIR R4 means:** It is a common structure for health information—like agreed labels on every handoff. It helps information move and be understood, but does not automatically solve interface, data-quality, or training work.  
> **AI's role:** Defined assistance can help draft or surface information for human review. The future direction is broader coordination; no autonomous clinical decision or guaranteed patient outcome is claimed.  
> **Scope note:** Clinical and business domains are described in the product map; ask which are demonstrated, configured, accepted, or planned for your institution. External payers, ministries, devices, and other systems still require appropriate interfaces.  
> **Proof panel:** Founder-authored [Medplum implementation account](https://www.medplum.com/blog/medimind-case-study) describes the architecture and a signed anchor-network agreement. It is not an independently measured outcome study or a statement that every facility is live.  
> **CTA:** Bring one handoff; **map my hospital's first improvement** → P05.

**Visual placement:** Use the campaign's paper-card path or a clearly synthetic product screen with current capability labels. A customer logo or result card is held until documented permission and measurement.

### P03 `/case-study` — verified case study for B12, L02, L04, L06, L08, L09, L12, L15 / BOFU–LOFU

**Visitor arrives from:** a verified implementation timeline, approved pathway walkthrough, or permissioned referral. **Job:** inspect a real before/after result. **Conversion event:** qualified demo or approved reference request. **Publication state:** **hold** until customer approval and the fields below are filled with evidence. A fabricated case is not a usable page.

> **Working headline slot (under 10 words):** How [hospital] improved [verified pathway measure]  
> **Subheadline slot:** [Hospital and team] compared [defined workflow] over [period], including training, exceptions, and total staff effort.  
> **Before:** [Buyer-approved description of the actual workflow, systems, and baseline; date and denominator.]  
> **Moment that made them act:** [Documented event or decision, in approved language; do not create a patient case.]  
> **What changed:** [Accepted MediMind scope, interfaces, staff training, parallel work, and who signed off.]  
> **After:** [Measured process and/or financial outcome, same unit as baseline, limitations, and what else changed.]  
> **Pull quote:** [Exact customer-approved quotation, name/title/hospital, with publication consent. If absent, omit the block.]  
> **Three result numbers:** [baseline], [after], [net change]—each with unit, dates, denominator, and method. These are **fields to fill**, not numbers to publish.  
> **Social-proof bar:** [approved name/logo] · [accepted scope] · [measurement period]. Omit until approved.  
> **CTA after results:** See what a comparable first-pathway test would require at your hospital. **Map my hospital's first improvement** → P05.

**Useful live alternative until case evidence exists:** On P10, publish “How we will measure a first pathway” with blank baseline/after fields and a synthetic example explicitly labeled synthetic. Do **not** publish P03 with bracketed placeholders and call it a customer case.

### P06 `/early-partner` — offer and readiness for M02, M07, M10, M14, M16–M17, B02, B05, B08–B09, B11, B15, B17 / MOFU–BOFU

**Visitor arrives from:** a risk/change article, preparation card, demo follow-up, or price-match question. **Job:** see the evaluation process, commercial offer, and unresolved terms without hidden promises. **Conversion event:** a qualified demo or a named evaluation-readiness discussion.

> **Headline (7 words):** Do not switch on a promise alone  
> **Subheadline:** Compare one agreed patient pathway beside current work, measure the full effort, and decide with clinical and IT owners.  
> **The offer:** For eligible early partners, the founder proposes matching current software pricing and including continuing development. Requested features are proposed to be testable in three business days; a tailored parallel evaluation is proposed within two weeks when prerequisites are met. These are commercial and delivery intentions requiring written scope. Testing a feature is separate from clinical validation and production release; a parallel evaluation is separate from a full cutover.  
> **What is included in the first discussion:** (1) map one current pathway; (2) identify information and people needed; (3) show a relevant synthetic workflow; (4) select a first process measure; (5) list access and integration prerequisites; (6) name clinical/IT review and stop conditions.  
> **Risk reversal:** Your current operation keeps running during a properly scoped parallel evaluation. Your team reviews the comparison and can choose go, adjust, or stop under the agreed plan. There is still staff work, data work, and possible cost; we will itemize it.  
> **Trust/proof:** See the method and exact accepted scope for a proposed evaluation. Customer quotes and measurable outcomes will appear only with source records and permission.  
> **CTA:** **Map my hospital's first improvement** → P05.

**Five buyer FAQs:**

1. **“Do we have to replace everything to start?”** No. Start with a chosen pathway and decide wider scope after an agreed comparison. The eventual replacement and external-interface map is hospital-specific.
2. **“Does two weeks mean production go-live?”** No. It is the founder's readiness-dependent target for a tailored parallel evaluation. Data access, owners, interfaces, and acceptance criteria must be agreed; production sign-off is separate.
3. **“Are all requested features live in three business days?”** The founder's proposed target is a **testable** change, subject to defined size and prerequisites. Clinical, security, and production approvals take their own review.
4. **“Does matched price cover every cost and future AI?”** The matched current software price is an early-partner offer; total cost, term, included development, implementation, interfaces, support, and advanced AI must be specified in the proposal. No lifetime lock or blanket inclusion is established.
5. **“What if the current supplier can solve our problem?”** Compare that solution on the same pathway, including risk, time, total cost, and observed work. MediMind should win only where the hospital can see a better route.

**Actual readiness checklist content:** “Name the pathway and one recent instance without patient identifiers; name executive, clinical/operations, and IT owners; list required source systems and interfaces; agree whether synthetic or authorized real data may be used; record baseline task count/time/errors and any financial metric with its definition; estimate hospital and MediMind staff effort; define privacy/security and clinical-review requirements; define the go/adjust/stop criteria and who signs off.” This is the content for M10 and the P06 download. Do not make it a medical checklist or claim regulatory compliance.

### P07 `/compare` — comparison for M01, M04, M08, M11, M15 / MOFU

**Visitor arrives from:** three-option guide or current-vendor question. **Job:** see when a narrow fix or incumbent is better, and when a core comparison is warranted. **Conversion event:** demo request with named current alternative.

> **Headline:** MediMind or your current hospital software?  
> **Subheadline:** Compare the same patient pathway across three real options: change the current system, add a focused tool, or evaluate a shared operating system.  
> **Opening:** The lowest-risk answer may be to keep what works. Start with the problem, the current supplier's proposed fix, and the work your staff still must do. This page is a decision guide, not a claim that every competitor is deficient.

| Buyer question | Current supplier change | Focused add-on/integration | MediMind operating-system evaluation |
|---|---|---|---|
| Can it address **this whole pathway**? | Often plausible; inspect proposal and installed version. | Strong when pain sits in one step; may leave handoffs. | Intended to cover clinical/business work; inspect accepted scope. |
| How much **change** does staff face? | Usually less core migration. | New tool, interface, and training still add work. | Larger potential transition; parallel plan and staff effort must be explicit. |
| Who owns **local adaptation**? | Existing vendor and hospital under contract. | Vendor, integrator, and current-system team may share it. | MediMind proposes continuing development; capacity and terms need agreement. |
| What is the **total cost**? | Quote and internal staff time needed. | License, integration, support, and maintenance needed. | Price-match offer does not cover unknown transition/optional costs; obtain proposal. |
| What **proof** is available? | Current staff experience and a proposed fix. | Pilot or site evidence if provided. | First scoped pathway comparison; independent measured outcomes pending. |

> **Honest assessment:** MEDWORK publicly offers Georgian hospital modules and government integrations; Epic, InterSystems, and Oracle also offer broad EHR and AI capabilities. A current supplier may be the right answer for a narrow, fixable issue. MediMind is worth evaluating where the problem follows the patient across teams and a shared workflow can be shown with acceptable risk.  
> **Migration-story slot:** [No customer-approved migration story exists; do not publish a before/after anecdote.] Instead show the process: map → readiness → parallel comparison → measure → clinical/IT go/adjust/stop decision.  
> **CTA:** Bring the current option and one recent handoff. **Map my hospital's first improvement** → P05.

Comparison claims are grounded in [official vendor pages](https://medsoft.ge/en/), [InterSystems](https://www.intersystems.com/products/intellicare/), [Epic](https://www.epic.com/software/health-systems-and-clinics/), and [Oracle](https://www.oracle.com/health/clinical-suite/electronic-health-record/), with nuance detailed in [Prompt 5](p1-05-competition.md). No head-to-head performance, Georgian availability, or competitor price is asserted.

### P08 `/activation` — private activation for A01–A17 / AFU

**Visitor arrives from:** an accepted evaluation invitation or authenticated customer update. **Job:** get the first agreed pathway ready for safe measurement. **Conversion event:** the hospital owner records an accepted baseline and first review task. **Access:** private; do not route public ads here.

> **Headline:** Start with one accepted pathway  
> **Subheadline:** Put the agreed work, owners, baseline, and stop rule in one place before comparing anything.  
> **First three actions, each under 10 minutes for the named owner:** (1) Open the approved pathway sheet and confirm the clinical, operations, and IT owners. (2) Record one baseline task count/time and where exceptions are logged; do not enter patient identifiers here. (3) Confirm the next review time and how to flag a safety or data concern.  
> **First result:** “Your first pathway is ready for a controlled review when owners, data permissions, and acceptance conditions are confirmed.” No improvement number is implied.  
> **Help CTA:** Contact your named MediMind evaluation owner through the agreed support channel. [Insert verified contact route before launch.]  
> **Next step:** Review the first measurement with the hospital team; choose go, adjust, or stop before adding another pathway.

**Measurement sheet body:** “Pathway/version; observation date; baseline task count and time; repeat entries; exceptions by type; staff training/parallel effort; clinical or data concerns; proposed after measurement using the same definition; reviewer; decision; sign-off.” Staff time is capacity, not automatic cash savings. The A01–A17 content variations all return here; their individual CTAs select the matching section or download.

### P09 `/referrals` — private referral for L11, L13–L14, L16 / LOFU

**Visitor arrives from:** a customer who has an accepted outcome and has agreed to discuss a peer introduction. **Job:** share a useful method without implying an endorsement or incentive. **Conversion event:** an authorized introduction or reference conversation.

> **Headline:** Share a pathway lesson with a peer  
> **Subheadline:** If your team found the first evaluation useful, you may introduce another hospital leader facing a similar handoff.  
> **What you get:** A factual, customer-approved summary of your own evaluation and control over whether your name, institution, or results are shared. No referral incentive is offered or implied.  
> **What your peer gets:** A neutral first-pathway worksheet and a 25-minute conversation about the work they want to measure.  
> **How it works:** (1) Review and approve exactly what may be shared. (2) Send the message below yourself or request a permissioned introduction. (3) If your peer wants a conversation, MediMind arranges a pathway demo.  
> **Copyable referral message:** “I thought of you because your team may also have a patient handoff that creates repeated work. MediMind uses a simple first-pathway map before discussing a wider system change. If useful, I can introduce you for a 25-minute conversation. There is no obligation.”  
> **Button:** Request a permissioned introduction  
> **Privacy note:** Nothing is sent to a peer automatically. Confirm both parties' permission before connecting them.

If no customer has approved a result or invitation, do not present this as an active endorsement page. A buyer-approved case study can later link here.

### P10 `/evidence` — evidence method and proof hub for M12–M13, B13, L01, L03, L05, L07, L10, L17 / MOFU–LOFU

**Visitor arrives from:** scope/proof content. **Job:** distinguish product description, accepted deployment, measured outcome, and future work. **Conversion event:** informed demo request; later, an approved story view.

> **Headline:** See what can be checked today  
> **Subheadline:** A clear record of what MediMind can demonstrate, what a hospital has accepted, what has been measured, and what is still proposed.  
> **Evidence labels:** **Demonstrated** = shown in a synthetic or authorized environment; **accepted** = hospital-signed scope with date; **measured** = baseline, after measure, method, and limitations; **planned** = future work, not available proof.  
> **Current evidence:** The public founder-authored [Medplum implementation account](https://www.medplum.com/blog/medimind-case-study) describes the FHIR R4 approach and a signed network agreement. Accepted facility/module counts and independently measured buyer outcomes have not been established for this page.  
> **How to read a claim:** Ask which workflow, which site, which date, which denominator, what changed besides software, and whether the customer approved publication.  
> **Stories area:** [Approved story 1: pending] [Approved story 2: pending] [Approved story 3: pending]. Do not render these as testimonial cards. Until approval, show the evidence method and a synthetic-pathway example clearly marked as such.  
> **Reference-story checklist:** Organization and permission; before workflow; intervention and acceptance; after workflow; measure definitions; safety/exception review; cost and training; limitations; named approver and review date.  
> **CTA after method:** Want to test the same approach on your own pathway? **Map my hospital's first improvement** → P05.

No results bar, customer quotation, video testimonial, or logo is filled with a competitor's review or a founder-reported aspiration. That makes P10 useful now as a method page while leaving proof slots honest.

### Optional P04 `/webinar` — webinar registration, not scheduled / MOFU

This is **copy for a future page**, not a live event or current catalog destination. Use only after a real date, platform, founder availability, registration receipt, and recording policy exist. Until then, do not show a registration button.

> **Eyebrow:** For private-hospital decision teams  
> **Headline:** How to map repeat work without switching systems  
> **Subheadline:** A practical 45-minute session: 30 minutes mapping a synthetic patient pathway and 15 minutes for questions.  
> **Date/time/duration above fold:** **Not scheduled.** [Insert confirmed date, time zone, and 45-minute duration before publishing.]  
> **You will learn to:** (1) trace an order-to-result-to-bill handoff; (2) distinguish software friction from process and policy; (3) choose a measure and safe next step; (4) list clinical and IT questions for a parallel comparison.  
> **Form:** Name, work email, hospital/group (three fields). **Button after scheduling:** Reserve my pathway workshop place.  
> **Speaker:** Lasha Khoshtaria, physician and MediMind CEO. Do not invent guest affiliations.  
> **Recording:** [State only after the recording and delivery policy is decided.]  
> **Testimonials:** [Two approved attendee quotations pending; omit blocks until they exist.]  
> **Closing CTA:** Learn to map one pathway before making a bigger software decision. [Reserve my place—activate only for a real date.]

The no-event alternative is the P01 worksheet and P05 founder-led demo. The webinar does not become a permanent monthly demand-generation commitment inside five marketing hours.

### Optional P11 `/sandbox` — guided synthetic-data trial, not launched / BOFU

This is **not** the two-week parallel evaluation. It is a proposed 14-day guided synthetic-data sandbox, with no card as a recommendation, subject to actual environment, support, security, and data-handling decisions. Do not publish signup until those conditions exist.

> **Headline:** Test a patient pathway with synthetic data  
> **Subheadline:** Explore one guided workflow without bringing patient records into a trial environment.  
> **What you can try:** Follow a synthetic order, result, next task, and administrative close; note which step your staff would want to compare locally.  
> **What you cannot conclude:** A sandbox does not prove integration, production readiness, clinical safety, or financial outcome at your hospital. Those require a separately scoped evaluation.  
> **Form:** Name, work email, hospital/group (three fields). **Button after launch:** Request guided sandbox access.  
> **Access line:** Proposed 14 days, no card as a recommended term; no actual trial availability or deletion policy is asserted until confirmed.  
> **First result:** Complete the synthetic handoff and write down one question for your clinical and IT counterparts.  
> **Next step:** **Map my hospital's first improvement** → P05, then discuss readiness for a real parallel evaluation.  
> **Trust/privacy:** [Insert approved synthetic-data, account, retention, and support terms before publication.]

## Part 2 — Page connection map

The content table in Step 1 and the page-action table below jointly specify a full flow for **every one of the 85 pieces**: take its ID/title, catalog channel, CTA action, and destination from the Step 1 row; append the destination's action and next stage from this table. This is more precise for wiring than repeating the same 85 final-page instructions. For example: **T02** on founder LinkedIn → “Use the pathway worksheet” → P01 `/pathway-assessment` → receive worksheet → MOFU product/option reading or BOFU demo if the leader has a real problem. **M01** on founder LinkedIn → “Compare the approaches” → P07 `/compare` → name the current alternative → BOFU demo. **B01** on founder LinkedIn → “Request a pathway demo” → P05 `/request-demo` → valid received request → booked and held qualified demo. **A10** in customer onboarding → P08 private page → record first baseline → AFU first-pathway review. **L13** in a customer-approved reference context → P09 private page → permissioned introduction → a new buying organization's TOFU/MOFU journey.

| Destination and IDs covered by Step 1 | Page action | Next funnel state and connection |
|---|---|---|
| **P01**: T01–T11, T14–T17 | Receive worksheet / complete five-minute check | MOFU P02/P07 if problem is defined; direct P05 if ready. Capture source ID and consent. |
| **P02**: T12–T13, M03, M06, M09 | Inspect actual mechanism and scope | MOFU P06/P07, or BOFU P05. |
| **P03**: B12, L02, L04, L06, L08–L09, L12, L15 | Read approved case and measured result | BOFU P05 or permissioned LOFU P09; **hold source links until page has evidence**. |
| **P05**: M05, B01, B03–B04, B06–B07, B10, B14, B16 | Submit a real request and later hold qualified demo | BOFU → proposed evaluation P06; track received, booked, and held separately. |
| **P06**: M02, M07, M10, M14, M16–M17, B02, B05, B08–B09, B11, B15, B17 | Review offer/readiness and request conversation | BOFU P05, then evaluation decision and private AFU P08 only after approval. |
| **P07**: M01, M04, M08, M11, M15 | Compare actual alternatives | BOFU P05 with named incumbent/narrow alternative. |
| **P08**: A01–A17 | Record accepted first work/baseline and issues | AFU next-pathway review; LOFU P09/P10 only after a verified positive result and permission. |
| **P09**: L11, L13–L14, L16 | Grant permission or prepare referral | New peer enters TOFU P01 or BOFU P05 by their own choice. |
| **P10**: M12–M13, B13, L01, L03, L05, L07, L10, L17 | Inspect evidence labels/checklist | MOFU/BOFU P05; after customer approval, P03. |
| **P04/P11**: no current catalog IDs | Optional future registration or synthetic trial | P04 → P05; P11 → P05/P06. Neither is an active campaign path. |

The table provides the developer a route for every current catalog ID and prevents dead links. Private customer assets should not be indexed or used for public retargeting. Proof assets B12 and L-series case links are **held**, with P10's evidence method as the available alternative; do not silently point “Read the case study” to a blank case page. P01 worksheet CTA wording varies by source piece, but all variants land on the same relevant worksheet/check section, not an unrelated generic homepage.

## Part 3 — Build priority

1. **Repair and verify P05 `/request-demo` first.** A simulated success screen can lose a valid hospital request now; this is the only inspected catalog destination that already has a public route. Establish receipt, owner notification, error state, and a test record before inviting traffic. Engineering time is separate from the five-hour marketing budget.
2. **Build P01 worksheet and actual delivery.** The campaign's low-friction educational step and TOFU catalog both depend on it. The worksheet content is above, so page, asset, receipt, and consent can be implemented as one small unit.
3. **Build P02 product overview.** It explains the mechanism and accepted-versus-proposed scope after a visitor recognizes the problem; it prevents a broad AI claim from doing the job of evidence.
4. **Build P06 evaluation/offer.** The buying committee needs readiness, total-effort, price-boundary, and go/adjust/stop answers before agreeing to a parallel test.
5. **Build P07 comparison.** It gives the buyer a fair way to compare the incumbent and a narrow tool, especially when full replacement would be excessive.
6. **Build P10 evidence method.** Useful now without pretending customer results exist. Add approved product scope and customer outcomes only as each record is verified.
7. **Prepare private P08 activation.** Publish only for a real accepted evaluation with named owners and access control; public traffic does not belong here.
8. **Prepare P03 case study, then private P09 referral.** Both depend on a real measured result and customer permission. Bracketed placeholders are editorial fields, never public proof.
9. **Keep P04 webinar and P11 sandbox on hold.** They are optional page-library assets without a scheduled session or verified sandbox. They do not add launch scope to the five-hour weekly routine.

The actively costly page issue is P05's unverified lead receipt and false success/response promise. The next practical conversion risk is a campaign CTA landing on a route that promises a 30-minute tour rather than a 25-minute pathway map. Other unbuilt pages become leaks only when content actually links to them; hold or reroute that content until pages exist. Use the cumulative count of **held qualified hospital demos** as the 90-day north star; proposed worksheet downloads and page views are diagnostic steps, not the goal.

### Sources and handoff

Internal: [funnel blueprint](p2-01-funnel.md), [content catalog](../working/content-catalog.json), [avatar](p1-09-avatar.md), [problem stack](p1-08-problems.md), [competition](p1-05-competition.md), [campaign concept](p2-03a-campaign-script.md), [distribution package](p2-03b-campaign-distribution.md), and [demo-page source](</Users/toko/Desktop/MediMind Landing Page/src/components/Demo/RequestDemo.tsx>). Public product context: [Medplum founder-authored case study](https://www.medplum.com/blog/medimind-case-study); [MEDSOFT](https://medsoft.ge/en/), [InterSystems](https://www.intersystems.com/products/intellicare/), [Epic](https://www.epic.com/software/health-systems-and-clinics/), and [Oracle Health](https://www.oracle.com/health/clinical-suite/electronic-health-record/). These support category descriptions, not Georgian head-to-head outcomes. The next implementation brief must confirm actual routes, approved commercial language, data/consent practice, and a working lead owner before publishing public links.

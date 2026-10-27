# Part 2, Prompt 1 — Map Your Marketing Funnel Architecture

> **Status and inputs (23 September 2026).** This is the complete strategic blueprint for a founder-led, low-volume hospital sale; it is not a report of current funnel performance. The first buyer is the synthetic **accountable hospital operator** from Part 1 Prompt 9: a Georgian private-hospital CEO, owner, or group operator who can name a recurring cross-department problem and assign clinical/operations and IT counterparts. Prompt 8's lead problem is “Why does one patient create so much extra work?” Prompt 4's top three working UVPs are finding and testing repeat work, comparing a pathway before switching, and giving teams a clearer patient story. Prompt 3 lists the 25 documented domains plus shared FHIR R4 and language architecture, without equating code presence with live acceptance. The primary CTA is a recommended **25-minute founder-led pathway demo** ending in a proposed measured evaluation. These are strategy assumptions, not measured buyer preferences.

**Current situation answers.** Conversion needs a human conversation and a buying committee; it is not self-serve. Exact monthly or annual price is not established; the founder's early-partner offer is to match current software price, with final scope/term still to define. A live website and `/request-demo` route exist. At source inspection the demo form has three steps, nine required fields, and a simulated submit (timer plus browser log and success state) without visible backend persistence or network submission; the deployed route has not been live-tested. No verified website traffic, source mix, lead count, email platform, customer CRM, marketing analytics, content winners, or channel results were supplied. The investor dashboard does not establish a customer-funnel system. The biggest constraint is **a trustworthy path from attention to a held, qualified hospital conversation and then an evidence-led evaluation**. Existing founder relationships and an anchor agreement are context, not a measured acquisition funnel.

The planning north star is **12 cumulative held qualified hospital demos over 90 days**, with **3 readiness-approved evaluations** and **1 new paying buying organization** as stretch downstream scenarios, excluding the existing anchor from new-customer counts. This is capacity planning, not a forecast. It implies roughly one held qualified demo per week, a 3/12 evaluation progression, and a 1/3 paying progression if those scenarios occur. Small denominators are provisional; report zero-denominator rates as N/A. Marketing has **five hours total per week** and zero paid spend initially. Engineering setup, implementation, and actual sales meetings require additional effort and are not silently charged to that five-hour marketing allowance.

## Part 1 — Funnel diagnosis

### 1. Model and closest real-world funnel

The best fit is a **hybrid funnel led by founder sales and supported by specific educational content**. A hospital cannot safely evaluate a whole operating system by clicking into a self-serve trial; the CEO's committee needs a pathway, scope, data, clinical review, IT review, and a commercial decision. Content should help a leader name one costly handoff and arrive at the demo prepared, while the founder converts interest into a measured evaluation. Of the five examples in the library, **Salesforce's high-touch enterprise motion** is closest in buying complexity; borrow executive education and committee-aware follow-up, not an assumed enterprise budget or ecosystem lock-in. HubSpot's useful diagnostic asset is the secondary pattern to borrow: give a pathway worksheet before asking for a meeting.

### 2. Biggest leak now

There is no verified traffic-to-lead-to-demo dataset, so a numerical leak rate cannot be calculated. The **first observed operational leak is the demo-request handoff**: current source code appears to display a success state after a two-second timer and a console log rather than transmitting the request to a lead owner. The long three-step form may also deter buyers, but abandonment has not been measured. Do not call either a deployed failure or claim lost leads until the live route is checked. First fix: verify the deployed behavior, make an accepted submission persist or notify the right owner, show truthful success/failure states, and test the complete route. Then instrument clean marketing events and track held qualified demos, not merely clicks or form success screens. If there is little traffic, add named-account and permissioned peer distribution rather than optimizing percentages from a handful of visits.

### 3. The actual buying journey to design for

| Buyer moment | What they may search or consume | Emotional state and objection | Required next step |
|---|---|---|---|
| A repeated handoff is normal | Current vendor advice, peer experience, general workflow articles; perhaps nothing at all | Busy; the work seems inevitable. “Is this worth executive attention?” | A short scenario or worksheet that helps count the repeat work. |
| A trigger makes it concrete | A difficult monthly report, staff complaint, bill correction, new branch, renewal, or clinical review | Frustrated but cautious. “Is software the cause?” | Map one recent pathway and compare the current remedy. |
| Alternatives enter the room | Current-supplier change, narrow tool, integration, broader system; asks peers or IT | Skeptical. “Why replace a core system for this?” | Honest comparison, scope map, and patient-pathway demonstration. |
| A committee considers MediMind | Founder-led demo, technical/clinical discussion, offer and proof | Interested but anxious. “Will this disrupt care and cost more than advertised?” | Written readiness and evaluation plan with total effort and decision criteria. |
| Evaluation proves or disproves value | Staff try the agreed pathway beside current work; metrics and exceptions are reviewed | Focused, protective of staff. “Does this work here?” | Go/adjust/stop decision; staged production approval if warranted. |
| Customer becomes a reference, if satisfied | Internal result and support experience; possible permissioned story | Proud but protective of reputation and data | Seek explicit approval for a factual case story or peer introduction. |

The most likely permanent loss is when a buyer asks for a credible, low-disruption comparison and receives a generic feature tour or an overconfident “replace everything in two weeks” claim. The current form can lose them even earlier if a request is not actually delivered. The funnel therefore needs both technical lead receipt and substantive evaluation proof.

## Part 2 — Full funnel stage map

| Stage | Customer world and awareness | Our goal and what we give | Objection to collapse; where we lose them | Benchmark context from the B11 library |
|---|---|---|---|---|
| **TOFU — Awareness of the problem** | They live with repeated handoffs or disputed reports but may not have named a solvable software issue. | Help them locate one patient pathway and quantify basic repeat work through a post, synthetic example, or worksheet. | “This is just how hospitals work.” Lose them with jargon, fabricated loss numbers, or an AI-first pitch. | Library cites homepage-to-lead 2–5% average, >10% top performer. This is unverified general SaaS context, not a Georgian-hospital target. |
| **MOFU — Consideration of the solution** | They know the issue matters and compare incumbent change, a narrow layer, and core replacement. | Give option comparison, product mechanism, readiness checklist, and honest limits. | “A new system adds risk and cost.” Lose them by hiding transition work or treating vendor claims as proof. | Library cites webinar-page 25–45% and B2B email opens 20–30%, 40%+ excellent. Neither is a local planning target; no webinar is scheduled. |
| **BOFU — Conversion decision** | CEO and committee can imagine a change and want the result in advance. | Offer a 25-minute pathway demo and proposed measured parallel evaluation with success criteria. | “Show me it can work here before I commit.” Lose them at a nonfunctional request route, vague scope, or unsupported proof. | Library cites demo-page 3.8% median, >8% top performers and B2B free-trial-to-paid 15–30%, top quartile 35–45%. A hospital parallel evaluation is not a self-serve SaaS trial. |
| **AFU — Retention and expansion** | The hospital has approved a defined scope; staff need the first useful pathway and dependable support. | Reach the first buyer-accepted pathway quickly; measure staff burden, exceptions, and value, then select the next workflow. | “The demo looked easier than daily work.” Lose them at poor adoption, missing data, or unclear issue ownership. | Library cites >60% trial activation to aha and 46.9% month-one B2B SaaS retention. Neither is validated here; 46.9% would be a poor hospital-service standard, never a success target. |
| **LOFU — Advocacy and loop** | A customer may have a verified result and be willing to help a peer. | Request permission for an accurate case or reference; bring its limited, useful lesson to the next buyer. | “Do not use our name or data loosely.” Lose trust with unapproved logos or inflated outcomes. | No suitable advocacy benchmark is supplied; use permissioned references and qualified introductions as counts. |

The benchmark figures above are repeated because the prompt asks for them. Their source and applicability were not independently established in the library. The operational thresholds in Part 6 use the 90-day planning scenario and controllable funnel events instead of pretending these SaaS percentages predict a Georgian hospital sale.

## Part 3 — Content and asset brainstorm

The catalog contains **85 distinct brainstorm ideas: 17 per stage, each with three LinkedIn posts, three phone-filmable short videos, three blog/SEO pieces, two lead magnets, two proof concepts, two emails, and two community/distribution moves.** Each row below has a stable ID. Full machine-readable fields—ID, title, format, stage, idea, CTA, pageId, and recommendedChannel—are in [content-catalog.json](../working/content-catalog.json). P01–P11 are destinations proposed for a full funnel: P01 assessment/download, P02 product overview, P03 verified case study (pending), P04 proposed unscheduled 45-minute practical webinar (30-minute workshop plus 15-minute Q&A), P05 existing `/request-demo` route, P06 offer/evaluation, P07 comparison, P08 activation, P09 referral, P10 proof library (pending), and P11 proposed 14-day guided synthetic-data sandbox with no card. The sandbox is separate from the readiness-dependent two-week parallel hospital evaluation. A page ID is a design reference, not a claim that the page exists. Proof ideas dependent on customer approval are held until evidence exists. The catalog is a brainstorm, **not 85 assets to produce on a five-hour weekly schedule**.

### TOFU: 17 stage-specific ideas

| ID | Format | Title and execution idea | Destination |
|---|---|---|---|
| T01 | LinkedIn post | **One patient, seven handoffs.** Sketch a synthetic patient journey and ask leaders which handoff their team repeats most. | P01 |
| T02 | LinkedIn post | **The hidden cost of searching.** Describe the time spent finding a result across teams as a question to measure, without inventing a savings figure. | P01 |
| T03 | LinkedIn post | **When two reports disagree.** Pose a board-meeting scenario where finance and clinical reports disagree and show three questions to ask. | P01 |
| T04 | Short video | **The duplicate-entry trail.** Phone-filmed desk sketch follows one fictional lab order copied between reception, clinician, and billing. | P01 |
| T05 | Short video | **Three calls for one result.** Founder acts out three routine calls needed to locate one synthetic result and asks what happens locally. | P01 |
| T06 | Short video | **The spreadsheet behind the dashboard.** Show a blank synthetic spreadsheet and the questions a CEO should ask about report preparation time. | P01 |
| T07 | Blog/SEO | **How to map a patient handoff.** Step-by-step guide to drawing one patient's movement through departments and marking repeat entry. | P01 |
| T08 | Blog/SEO | **Why hospital reports disagree.** Explain differences in definitions, timing, missing data, and manual reconciliation without blaming one vendor. | P01 |
| T09 | Blog/SEO | **What a delayed claim does and does not mean.** Distinguish rejected claim, delayed cash, missed legitimate charge, and unrecoverable revenue. | P01 |
| T10 | Lead magnet | **Patient-pathway friction worksheet.** One-page template to count handoffs, repeat entries, wait points, owners, and a starting baseline. | P01 |
| T11 | Lead magnet | **Five-minute handoff check.** Self-assessment that returns the first pathway worth discussing, not a made-up hospital score. | P01 |
| T12 | Proof | **Founder-built scope trace.** Use the public founder-authored Medplum case-study context as product-history evidence, clearly not a customer outcome endorsement. | P02 |
| T13 | Proof | **Synthetic handoff before/after.** Show a clearly labeled synthetic workflow comparison to prove the method is inspectable, not that savings occurred. | P02 |
| T14 | Email | **Where the work repeats.** Send the worksheet with one question about the hospital's last repeated handoff; no generic AI pitch. | P01 |
| T15 | Email | **A report you had to rebuild.** Invite a leader to identify one report that requires manual reconciliation and the person who prepares it. | P01 |
| T16 | Community | **Hospital-operator discussion prompt.** In an appropriate Georgian hospital-leadership forum, ask how teams map a handoff; participate only where welcome. | P01 |
| T17 | Community | **Clinical-operations partner note.** Offer the neutral worksheet to a clinical operations association or trusted professional contact for feedback. | P01 |

### MOFU: 17 stage-specific ideas

| ID | Format | Title and execution idea | Destination |
|---|---|---|---|
| M01 | LinkedIn post | **Fix a screen or fix the pathway?.** Compare three practical options: current-vendor change, narrow tool, or shared operating system for the same handoff. | P07 |
| M02 | LinkedIn post | **What parallel evaluation actually requires.** Name the hospital owner, data permission, baseline, and staff time behind an honest two-week evaluation. | P06 |
| M03 | LinkedIn post | **AI assists; clinicians decide.** Explain a reviewed draft or flag in a fictional pathway and show where the clinical decision stays human. | P02 |
| M04 | Short video | **Three options on one whiteboard.** Founder draws status quo, point solution, and operating-system path with honest change effort for each. | P07 |
| M05 | Short video | **What happens in 25 minutes.** Preview the founder-led pathway demo: buyer names a handoff, founder maps it, team picks a first measure. | P05 |
| M06 | Short video | **A result becomes a task.** Synthetic screen-recorded example shows a result routed to a named reviewer, with no patient data. | P02 |
| M07 | Blog/SEO | **How to evaluate hospital software without a risky cutover.** Guide to pathway scope, authorized data, parallel workload, success criteria, reconciliation, and sign-off. | P06 |
| M08 | Blog/SEO | **Hospital OS versus overlay versus current vendor change.** Decision guide for when each option is appropriate, including cases where replacement is not justified. | P07 |
| M09 | Blog/SEO | **What FHIR R4 changes in hospital work.** Plain-language explanation of a shared data structure and the interface work still required. | P02 |
| M10 | Lead magnet | **Parallel-evaluation readiness checklist.** Checklist for named owners, agreed pathway, data permissions, baseline, IT review, and stop criteria. | P06 |
| M11 | Lead magnet | **Three-option decision worksheet.** Template comparing incumbent fix, narrow add-on, and MediMind against burden, risk, cost, and scope. | P07 |
| M12 | Proof | **Documented domain map.** Publish the 25-domain scope as an internal product map with clear deployed, accepted, and pending fields after verification. | P10 |
| M13 | Proof | **Live-pathway evidence template.** Show the exact baseline and after fields a customer-approved case study would need; label outcome cells pending. | P10 |
| M14 | Email | **The change-risk question.** Explain what a parallel comparison can answer and ask which transition failure the hospital fears most. | P06 |
| M15 | Email | **The current-vendor alternative.** Invite the buyer to compare a current-vendor fix with a connected pathway using the same criteria. | P07 |
| M16 | Community | **Peer discussion on evaluation design.** Ask consenting hospital operators what evidence they require before changing a core workflow. | P06 |
| M17 | Community | **IT and clinical review session.** Offer an educational walk-through of data, safety, and cutover questions with no sales claims. | P06 |

### BOFU: 17 stage-specific ideas

| ID | Format | Title and execution idea | Destination |
|---|---|---|---|
| B01 | LinkedIn post | **What your 25-minute demo will settle.** List the three outputs: first pathway map, first metric, and evaluation readiness decision. | P05 |
| B02 | LinkedIn post | **Match price, define total cost.** Describe early-partner software-price match and the need to itemize transition and third-party costs. | P06 |
| B03 | LinkedIn post | **The honest go/no-go test.** Show how leadership can decide after staff compare one pathway and its extra work or risk. | P05 |
| B04 | Short video | **Demo in sixty seconds.** Founder shows synthetic map, shared task, and comparison worksheet as the demo preview. | P05 |
| B05 | Short video | **Parallel beside current work.** Draw existing and proposed pathways side by side and explain readiness, workload, and sign-off. | P06 |
| B06 | Short video | **Who should join the first call?.** Name CEO or operator plus optional clinical/operations and IT counterparts, depending on decision stage. | P05 |
| B07 | Blog/SEO | **Questions to ask before a hospital OS demo.** Give buyers questions about scope, human review, data rights, deployment proof, and total cost. | P05 |
| B08 | Blog/SEO | **What happens after a parallel evaluation.** Explain measured review, reconciliation, approval, and staged rollout; no automatic production switch. | P06 |
| B09 | Blog/SEO | **What current-software price match should include.** Explain the questions a hospital should settle about eligible spend, term, development, and total cost. | P06 |
| B10 | Lead magnet | **Pathway demo preparation card.** One-page card for an executive to bring a recent incident, current workaround, owner, and desired measure. | P05 |
| B11 | Lead magnet | **Evaluation decision sheet.** Go/adjust/stop template that records baseline, staff burden, risk, cost, and sign-off owner. | P06 |
| B12 | Proof | **Verified implementation timeline.** After authorization, publish dated scope, readiness, and acceptance milestones from a real customer without claiming broad outcomes. | P03 |
| B13 | Proof | **Buyer-approved workflow result.** Reserve case study for a measured result and customer permission; until then show evidence fields as pending. | P10 |
| B14 | Email | **Your pathway before our demo.** Ask attendee for one recent handoff and offer the preparation card; do not request patient-identifying details. | P05 |
| B15 | Email | **What we will compare.** After demo, send a proposed baseline and evaluation scope with unresolved requirements visibly marked. | P06 |
| B16 | Community | **Private buying-committee walkthrough.** Convene named clinical, finance, operations, and IT evaluators around one pathway, by invitation. | P05 |
| B17 | Community | **Procurement questions session.** Offer a structured discussion of costs, responsibilities, support, and exit needs with the buying group. | P06 |

### AFU: 17 stage-specific ideas

| ID | Format | Title and execution idea | Destination |
|---|---|---|---|
| A01 | LinkedIn post | **First pathway, first baseline.** With permission, describe the method for recording a baseline after sign-up, without showing confidential data. | P08 |
| A02 | LinkedIn post | **What staff should report in week one.** Explain how to capture repeat work, exceptions, and safety concerns during a controlled evaluation. | P08 |
| A03 | LinkedIn post | **One improvement, then the next.** Show an anonymized learning loop: observe, prioritize, test, approve, measure; no unverified success claim. | P08 |
| A04 | Short video | **How to log a handoff issue.** Phone walkthrough of an issue form with synthetic patient data and an owner for follow-up. | P08 |
| A05 | Short video | **Five-minute pathway review.** Show how clinical and operations owners compare the agreed metric and exceptions each week. | P08 |
| A06 | Short video | **How a testable change becomes approved.** Explain request, test, clinical/IT review, and production approval with a generic example. | P08 |
| A07 | Blog/SEO | **Measuring repeat work without double counting.** Define staff time, task count, training burden, and why minutes do not automatically equal cash savings. | P08 |
| A08 | Blog/SEO | **Running a safe pathway review.** Guide to issue ownership, clinical escalation, baseline comparison, and go/adjust/stop decisions. | P08 |
| A09 | Blog/SEO | **Selecting the second pathway.** Criteria for choosing a next workflow after the first is accepted: frequency, burden, risk, and readiness. | P08 |
| A10 | Lead magnet | **First-pathway measurement sheet.** Customer worksheet for baseline, tasks, exceptions, staff burden, and sign-off. | P08 |
| A11 | Lead magnet | **Change-request decision card.** Template for request owner, test criteria, clinical impact, priority, and production approval. | P08 |
| A12 | Proof | **Accepted-workflow log.** Internal customer-approved ledger of which pathway elements were accepted and which remain open. | P08 |
| A13 | Proof | **Measured improvement record.** Record an actual agreed before/after comparison only after data quality and buyer sign-off; no public release by default. | P08 |
| A14 | Email | **Your first review agenda.** Send the clinical/operations owner a concise agenda for metric, exceptions, staff feedback, and next decision. | P08 |
| A15 | Email | **A request ready for test.** Tell the named owner what changed, where to test it, what remains unapproved, and how to respond. | P08 |
| A16 | Community | **Clinical-IT issue huddle.** Short private working session for clinicians and IT to resolve one observed pathway issue. | P08 |
| A17 | Community | **Cross-site learning exchange.** With a group customer, invite site owners to compare process lessons without patient details. | P08 |

### LOFU: 17 stage-specific ideas

| ID | Format | Title and execution idea | Destination |
|---|---|---|---|
| L01 | LinkedIn post | **The buyer's permission comes first.** Explain what a responsible public hospital story needs: verified result, named scope, and permission. | P10 |
| L02 | LinkedIn post | **A pathway another leader can inspect.** After approval, share a measured pathway story with method and limits rather than a sweeping transformation claim. | P03 |
| L03 | LinkedIn post | **What we changed after feedback.** Publish a consented example of customer feedback becoming a tested product change, with dates verified. | P10 |
| L04 | Short video | **Customer pathway walkthrough.** With customer approval, have staff explain a measured before/after task using non-identifying visuals. | P03 |
| L05 | Short video | **What a reference actually verified.** Founder shows the evidence standard and a permissioned result; hold production until proof exists. | P10 |
| L06 | Short video | **Why we chose the first pathway.** Customer-approved owner explains why the initial workflow was selected and what remains unsolved. | P03 |
| L07 | Blog/SEO | **How to read a hospital software case study.** Teach readers to distinguish contracted sites, live sites, accepted workflow, and measured outcome. | P10 |
| L08 | Blog/SEO | **From one hospital pathway to another.** Permissioned account of what transferred across sites and what required local redesign. | P03 |
| L09 | Blog/SEO | **What changed in a claim handoff.** Only after verification, explain actual claim-process result and separate identified charges from collections. | P03 |
| L10 | Lead magnet | **Reference-story evidence checklist.** Template a hospital can use to evaluate any vendor story: baseline, denominator, site, dates, approval. | P10 |
| L11 | Lead magnet | **Peer evaluation guide.** Guide for hospital executives to ask a reference about transition burden, support, and continuing development. | P09 |
| L12 | Proof | **Buyer-approved measured case study.** Publish only after customer permission and audited baseline, method, result, and limitations. | P03 |
| L13 | Proof | **Reference conversation.** Offer a customer reference only after that customer's explicit agreement, with scope and availability confirmed. | P09 |
| L14 | Email | **Share the method, not a claim.** Ask a satisfied authorized customer whether they would review a draft factual pathway story. | P09 |
| L15 | Email | **A peer may have this problem.** After evidence and consent, offer a short forwardable note about the measured pathway and its limits. | P03 |
| L16 | Community | **Peer operator exchange.** With permission, convene an existing customer and one peer operator to discuss implementation lessons. | P09 |
| L17 | Community | **Hospital-association learning session.** Invite a permissioned customer to teach the pathway method; verify event and affiliation before promotion. | P10 |

**Three highest-leverage pieces for this founder:** T10, the one-page patient-pathway friction worksheet; M10, the parallel-evaluation readiness checklist; and B04, the synthetic one-minute demo preview. **This week, create T10.** It helps a leader articulate a real problem, gives a useful result before a meeting, and supplies the first 25-minute demo question. The most powerful result-in-advance asset is a **guided first-pathway map**: in a short founder conversation, the buyer leaves with the chosen handoff, who owns it, a baseline metric, and a go/no-go question for evaluation. That is a useful result even if they do not buy. A guided synthetic sandbox (P11) is a later option; it must not be confused with the founder's two-week tailored parallel evaluation or a live clinical deployment.

## Part 4 — Funnel wiring diagram

**A Georgian private-hospital CEO first encounters us when** a founder post or permissioned peer discussion asks why one patient creates repeated work across departments. The CEO opens the patient-pathway worksheet (T10), names a recent handoff, and receives one useful follow-up email rather than a broad AI brochure. An option-comparison article (M08) and readiness checklist (M10) answer why a current-vendor fix, narrow tool, or new operating system might be right. A short synthetic demo preview (B04) leads to the `/request-demo` route (P05), which must record a real accepted request before any “received” message is shown. The founder runs a 25-minute call, maps the hospital's first pathway, and proposes an evaluation only if the buyer can name an owner and a readiness path. Clinical, finance, operations, and IT counterparts agree on baseline, access, effort, and success criteria; they compare the tailored path beside current work before any production decision. If a defined scope is approved, the customer reaches a buyer-accepted first pathway, reviews the measure and exceptions, and chooses whether to expand. If a meaningful result is measured and the customer consents, MediMind publishes an accurate case or arranges a reference, **and they become an advocate who brings in another private-hospital CEO or group operator.**

## Part 5 — Build order

The calendar below describes **marketing work** within five hours total per week. Engineering for lead receipt, page instrumentation, and sandbox setup; the 25-minute sales meetings; customer evaluation; and clinical/IT delivery need separately planned time and owners. No paid promotion is assumed.

### Phase 1 — Weeks 1–2: minimum viable funnel, three assets

| Asset | Why first | It must achieve |
|---|---|---|
| **P05 reliable pathway-demo request route** | No funnel exists if a request appears successful but is not received. | Real delivery to a named owner, honest error/success behavior, and one logged qualified/held-demo trail. Engineering work is separate from marketing hours. |
| **T10 one-page pathway worksheet with P01 download** | Gives a relevant result before asking for time and sharpens the founder's discovery. | A CEO can name one handoff, its owner, and a measure without sharing patient data. |
| **T04 synthetic duplicate-entry trail plus founder outreach note** | Shows the repeated work visually and gives a reason to bring a real pathway to the founder. | A relevant executive can recognize the problem and choose a slot or reply for coordination. |

**Single MVF signal:** a held qualified hospital demo sourced through a traceable contact path, with the first pathway and next decision recorded. A completed form alone is not a demo. Qualification requires a hospital organization, relevant authority or sponsor, a named recent problem, and an evaluation owner or a clear path to one.

### Phase 2 — Weeks 3–6: seven conversion assets

“Expected conversion improvement” below means the **specific behavior the asset is designed to improve**, not an invented uplift percentage.

| Asset | Stage fixed | Behavior to look for |
|---|---|---|
| M08 option-comparison article / P07 | MOFU | More buyers can explain why a core evaluation is or is not warranted. |
| M10 readiness checklist / P06 | MOFU | More demos end with named clinical/operations and IT counterparts. |
| B10 demo preparation card | BOFU | More booked calls arrive with a recent handoff and a useful example. |
| B11 evaluation decision sheet | BOFU | More qualified demos yield an explicit go/adjust/stop proposal. |
| B14 confirmation email | BOFU | Fewer bookings are missed; attendees know what to prepare. |
| B15 post-demo scope email | BOFU | Next actions, owners, and unresolved requirements are recorded rather than lost. |
| M12 documented-domain map / P10 | MOFU | IT and clinical reviewers can separate documented scope from accepted deployment. |

**Readiness for Phase 3:** a working lead route and a small traceable sequence of held qualified demos with follow-up ownership; preferably at least one readiness-approved evaluation before expanding content production. The 3-of-12 downstream scenario is a hypothesis to monitor, not a percentage threshold to declare a win after one or two calls.

### Phase 3 — Months 2–3: growth layer

| Asset or system | How it compounds | Manual effort it can replace |
|---|---|---|
| Reusable patient-pathway content set (T07/M07/B07) | Each real buyer question improves an evergreen answer and a better demo. | Repeating the same explanation in each first call. |
| Permissioned proof library P10, later verified case P03 | A measured, approved story answers a recurring risk question for later committees. | Unstructured founder claims and ad hoc evidence requests. |
| Clean public-site source and event tracking | Shows which named distribution paths produce accepted requests and held qualified demos. | Guessing from page views or button clicks. |
| Opt-in email follow-up (T14/M14/B14) | Gives useful next steps at the right buying stage. | Remembering every nurture step manually. |
| Customer activation measurement and a permitted reference path | The next buyer can learn from an actual accepted pathway, with its limits. | Rebuilding trust entirely from founder description. |

**Compounding signal:** new qualified hospital conversations begin from a reusable asset or permissioned peer introduction without a fresh one-off founder explanation. Count them by source and held demo; do not infer “organic growth” from impressions alone.

## Part 6 — Weekly funnel scorecard

Use a Monday review of **counts first**, with rates only when denominators exist. A green/amber/red threshold is an internal action rule for the 90-day scenario, not a validated industry benchmark. The library's 2–5% homepage, 3.8% demo-page, 25–45% webinar, 15–30% trial-paid, >60% activation, 20–30% email-open, and 46.9% month-one-retention figures are in Part 2 as unverified generic context. They should not override low-volume account evidence or define a hospital service standard. Track source and stage with no patient data or personal information in analytics events.

| Stage | Metric and how to measure | Green — on track | Amber — needs attention | Red — act now | Likely red cause | First fix |
|---|---|---|---|---|---|---|
| TOFU | Relevant named-account or permissioned-peer conversations begun this week; record source and problem in a secure lead log | 2+ relevant conversations | 1 | 0 for two weeks | Message or distribution misses the buyer | Ask known contacts which handoff matters; test T10 with one leader |
| MOFU | Buyers who complete a pathway map or option discussion with a named owner | 1+ this week | Interest without a named pathway | 0 from four relevant conversations | Generic content or unclear first result | Use T10 live and ask for the last incident |
| BOFU | Held qualified hospital demos, not booked calls; verify attendance, role, problem, owner | 1+ this week, accumulating toward 12 in 90 days | 1 booked but not held, or held without qualification | 0 for two weeks despite relevant conversations, or request route fails | Broken route, weak call promise, or no follow-up | Verify submission and contact owner; send B14 preparation note |
| BOFU → evaluation | Readiness-approved evaluations / held qualified demos, with named IT and clinical/operations owners | 1 approved as the series matures; scenario is 3 of 12 | Proposal pending missing prerequisite | Repeated demos with no explicit decision | Evaluation feels too risky or vague | Use M10 and B11 to expose missing readiness and scope |
| AFU | First accepted pathway milestone and agreed metric/exception log for each active customer | Milestone met or openly re-scoped with customer approval | Behind schedule with named remedy | No owner, baseline, or clinical/IT sign-off | Delivery or data readiness gap | Joint issue review; narrow the pathway safely |
| LOFU | Permissioned case/reference or qualified introduction from an accepted customer | 1 permissioned action after verified value exists | Eligible story identified, approval pending | An unapproved name/outcome is published | Proof governance failure | Remove or correct claim and seek explicit permission |
| Overall | **Cumulative held qualified hospital demos in rolling 90 days**; one record per buying organization meeting | Pace at or above 12/90-day scenario | Below pace but improving with recorded causes | No held qualified demo for two consecutive weeks once route/distribution is live | Earlier stage leak or qualification mismatch | Trace the last four accounts from first touch to outcome |

If a denominator is zero, show **N/A**, not 0%. The stretch downstream markers are three readiness-approved evaluations and one new paying buying organization by day 90; report them as counts, not a forecast. The anchor account is a separate evidence and expansion line. A single week of red can be noise, but a broken request route is actionable immediately.

### Sources and handoff

Part 1 inputs: [business/market](p1-01-business-market.md), [product journey](p1-02-mechanics-jtbd.md), [BFG matrix](p1-03-bfg.md), [top UVPs](p1-04-uvps.md), [problem stack](p1-08-problems.md), and [synthetic avatar](p1-09-avatar.md). The [research addendum](../working/research-addendum.md) records the demo-form source inspection. The B11 benchmark list is reproduced from the assigned [main library](../working/main-library.txt), whose figures do not supply current local baselines. Prompt 2 should prioritize the pathway hook, controlled evaluation, and clearer patient story within the same five-hour weekly marketing budget.

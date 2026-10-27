# Prompt 3 — Build Your BFG: Features, Benefits & Guarantees

> **Status and input (22 September 2026).** This answers all seven input questions and all six requested steps using the [canonical 25-domain scope inventory](</Users/toko/Desktop/medplum_medimind/positioning/03-scope.md>), the [canonical product description](</Users/toko/Desktop/medplum_medimind/positioning/00-what-we-are.md>), Prompts 1–2, the founder offer, and the evidence register. “Documented” means listed in internal positioning with a named code path or architectural assertion; it does **not** mean a feature has passed a fresh code audit, is deployed at every hospital, has been accepted in production, or has produced measured outcomes. The internal positioning claims the ambient scribe and coordinator desk are live; current site, acceptance, and use details were not verified for this document. AI assistance requires human review in clinical work. A guarantee below is either an existing founder-stated offer needing written scope or a proposed evaluation trust signal—not an invented service level.

## The seven required inputs

1. **What are all the features?** The canonical scope names 25 hospital domains, reproduced in Step 1, plus two cross-cutting architecture/language capabilities in the canonical product description. Each domain includes smaller actions, from registering a patient to routing a pharmacy queue or reviewing a clinical event. The source is a product inventory, not a release-by-release acceptance register.
2. **What does the customer get from each?** The benefit is less reconstruction of a patient or operational story, clearer handoffs, and a more inspectable path from care to business work. Step 2 translates every domain separately; each is a potential benefit to test in the hospital's own pathway.
3. **Single most important outcome?** The hospital completes a real patient pathway with less avoidable handoff work and a trustworthy shared account of what happened, while preserving clinical judgment and operational control. This is a target outcome, not a measured result. Financial gains, if any, must be measured as appropriate collections or costs, not simply billing opportunities or minutes assumed to be cash.
4. **Top three objections?** (a) “Will switching disrupt care and revenue?” (b) “Can we trust a young supplier with critical operations, data, and support?” (c) “What exactly is included in price, development, and AI as needs grow?” A broad demo without a staged, costed, clinically reviewed evaluation will not answer these.
5. **What proof exists?** A founder-reported GeoHospitals agreement; internal product scope and code-path inventory; a [Medplum-hosted case study](https://www.medplum.com/blog/medimind-case-study) authored by a founder; and a founder-stated early-partner offer. These establish narrative, technical work, and a relationship, but they do not independently establish site-wide deployment, a customer endorsement, quantified savings, better outcomes, a certified security posture, or repeatable delivery time. No public testimonial or attributed outcome is supplied.
6. **What guarantees can honestly be offered?** The founder has stated: match current software price for early hospital partners, include continuing development, make requested features testable in three business days, and prepare a tailored parallel evaluation in two weeks. These need scope, eligibility, readiness, and total-cost definitions in writing. The hospital should retain the decision after a parallel evaluation; production deployment requires its separate approval. No blanket money-back promise, zero-risk promise, result guarantee, permanent price lock, fixed scarcity, or unbounded AI inclusion has been established.
7. **What do customers say about why they chose MediMind?** No traceable buyer quote was supplied. Do not write an invented first-person testimonial. The founder-reported anchor agreement signals that at least one buying organization signed, but its exact selection reasons require a buyer interview and permission before public attribution. Working hypotheses to test are the connected scope, local adaptation, founder access, and an opportunity to evaluate before switching.

## Step 1 — List every feature

Rows 1–25 below are the **complete canonical domain list**, organized by the patient and hospital work they support. Rows 26–27 add the two cross-cutting capabilities asserted in the canonical product description. “Scope-listed” is the appropriate common evidence label for domains. It does not make every subfunction live at every site. Before using a row in a proposal, confirm exact workflow, configuration, interfaces, data quality, permissions, localization, site deployment, and acceptance.

| # | Category and documented domain | Concrete capability to demonstrate or specify | Current evidence boundary |
|---:|---|---|---|
| 1 | Front door: Patient registration | Patient identity, coverage, related people | Scope-listed; local identity and payer rules need checking |
| 2 | Clinical: Ambient documentation | Draft clinical documentation linked to encounter and provenance | Scope-listed; internal live assertion, no fresh acceptance audit |
| 3 | Clinical: Computerized physician order entry (CPOE) | Clinical orders for services and medicines | Scope-listed; order catalogs and safety checks need site validation |
| 4 | Clinical: Medication administration record (MAR) | Record medicine administration at point of care | Scope-listed; high-risk workflow requires clinical approval |
| 5 | Clinical: Pharmacy queue and dispense | Route prescriptions and record dispense work | Scope-listed; inventory and formulary fit need checking |
| 6 | Diagnostics: Laboratory | Orders, specimens, observations, diagnostic reports | Scope-listed; instruments and result flow are site-specific |
| 7 | Diagnostics: Imaging/PACS viewer | Imaging studies and linked documents available to review | Scope-listed; image archive and viewer fit need checking |
| 8 | Capacity: Bed management | Locations and encounter placement | Scope-listed; real-time census accuracy needs validation |
| 9 | Access: Appointments and scheduling | Schedules, slots, and booked appointments | Scope-listed; local booking rules need checking |
| 10 | Coordination: Coordinator/care navigation | Tasks, care teams, and communications | Scope-listed; internal live assertion, no fresh acceptance audit |
| 11 | Finance-adjacent: Prior authorization and appeals | Work queues and records for approval/appeal tasks | Scope-listed; payer-specific rules and human review required |
| 12 | Finance: Billing and revenue cycle | Charges, definitions, accounts, billing work | Scope-listed; pricing, contracts, and code mapping need checking |
| 13 | Finance: Claims processing | Claims, responses, and coverage information | Scope-listed; payer integration and actual collections unverified |
| 14 | Supply: Inventory and warehouse | Stock quantities, supplies, deliveries, requests | Scope-listed; physical counts and purchasing rules need checking |
| 15 | Workforce: HR and staff management | Practitioner roles and schedules | Scope-listed; payroll and local employment scope not implied |
| 16 | Management: Analytics | Read-only views across relevant clinical and operating data | Scope-listed; definitions, completeness, and freshness need checking |
| 17 | Public obligations: Ministry submissions/compliance | Prepare/route relevant reporting data | Scope-listed; no blanket regulatory-compliance claim |
| 18 | External records: Government EHR integration | Exchange bundles/parameters with government system | Scope-listed; interface availability and approval are external dependencies |
| 19 | Group operations: Multi-branch orchestration | Organization hierarchy and branch context | Scope-listed; cross-site data access and reporting need testing |
| 20 | Resilience: Offline-first progressive web app | Local cache, sync queue, service worker | Scope-listed; data sync/conflict behavior needs site testing |
| 21 | Nursing: Nursing workstation | Nursing tasks, observations, medicine-administration work | Scope-listed; nurse review and handoff fit need checking |
| 22 | Coordination: Clinical event engine | Event/subscription-driven tasks and signals | Scope-listed; never imply autonomous patient surveillance |
| 23 | Teamwork: Messaging and staff inbox | Communications and assigned tasks | Scope-listed; delivery, privacy, and escalation rules need checking |
| 24 | AI: Clinical assistant | Assistance within the shared clinical context | Scope-listed; specific functions and clinical review rules need checking |
| 25 | Clinical: Unified patient card and history | Patient, encounter, observation, and related history in one chart | Scope-listed; completeness depends on migrated/connected source data |
| 26 | Foundation: Shared FHIR R4 data structure | Clinical and business work uses a common health-data model on Medplum | Internal architecture assertion; interoperability still depends on mapping and interfaces |
| 27 | Localization: Georgian, Russian, English architecture | Product is architected for three languages | Internal architecture assertion; translation completeness and workflow fit need review |

FHIR R4 is the common data foundation behind the rows. The scope document names resource types and code paths for the 25 domains; that is useful technical traceability, not a deployment certificate. Some hospitals will keep necessary outside services and device interfaces. “One operating system” describes the intended core, not a promise that every external dependency disappears.

## Step 2 — Convert every feature to a benefit

These are **customer-language benefit hypotheses**. Each should be tied to a demonstration and, where material, an agreed baseline. The grammatical form is intentionally “I can…” rather than an unearned claim that all hospitals already achieved it.

| # | Direct customer benefit |
|---:|---|
| 1 | “I can start the patient's journey with identity and coverage details the next team can use.” |
| 2 | “My clinicians can spend less time drafting routine notes from scratch, then review and own the final record.” |
| 3 | “Orders can follow the clinical decision into the next team's queue without staff rebuilding the request.” |
| 4 | “Nurses can see and record what medicine was actually given in the same care context.” |
| 5 | “Pharmacy staff can work from an organized prescription queue and record what was dispensed.” |
| 6 | “The care team can follow a test from order to result and review, with fewer calls to discover its status.” |
| 7 | “A clinician can reach the relevant imaging information from the patient's work context.” |
| 8 | “My team can place and track patients with a clearer view of available beds.” |
| 9 | “Scheduling staff can offer and manage appointments without rebuilding the patient's context.” |
| 10 | “Coordinators can see the next task and who owns it, instead of carrying the pathway in memory.” |
| 11 | “Approval and appeal work can be assembled and tracked more coherently, with staff reviewing what goes out.” |
| 12 | “Finance can relate legitimate charges to the care documented and identify records that need correction.” |
| 13 | “The team can see where a submitted claim stands and what response needs action.” |
| 14 | “Departments can see and request needed supplies with less manual stock chasing.” |
| 15 | “Managers can connect staff roles and schedules to the care and work that must be covered.” |
| 16 | “Leaders can inspect agreed operating measures without waiting for a fresh spreadsheet assembly.” |
| 17 | “Reporting staff can prepare required submissions from more consistent records, subject to local validation.” |
| 18 | “The hospital can exchange agreed information with a government record system where the interface is available.” |
| 19 | “A group operator can view and manage branches with a shared structure and site-specific context.” |
| 20 | “Staff may be able to keep selected work available during connectivity loss and reconcile it when service returns.” |
| 21 | “Nurses can see assigned care tasks and observations in a focused work area.” |
| 22 | “Relevant events can create a visible task or signal for a responsible person to review.” |
| 23 | “The right staff member can receive a message or task within the hospital's work context.” |
| 24 | “Clinicians can ask for defined assistance while keeping the judgment and final action with the care team.” |
| 25 | “A clinician or coordinator can see more of the patient's story in one place, depending on available source data.” |
| 26 | “My teams can work from a shared data structure, making agreed handoffs and future changes easier to design.” |
| 27 | “Our Georgian, Russian, and English-speaking staff can evaluate whether the system fits their daily language needs.” |

No benefit here automatically establishes cash savings, a clinical outcome, or use by a specific customer. For example, recording an unbilled charge can help legitimate billing, but only adjudicated and collected amounts establish realized financial gain. A minute freed for a nurse is capacity, not automatically a reduced wage bill.

## Step 3 — Add the emotional benefit layer

The emotional and social job varies by user. Below, “feel” names an intended experience to test, and “be seen” names the professional identity at stake. These are not customer quotations.

| # | Emotional and social job behind the benefit |
|---:|---|
| 1 | Reception feels confident that the journey starts correctly; colleagues see a reliable handoff. |
| 2 | Clinicians feel heard rather than buried in typing; peers see a complete, clinician-owned note. |
| 3 | Prescribers feel confident that an order reached the next role; receiving teams see fewer ambiguous requests. |
| 4 | Nurses feel accountable and supported; clinical leaders see a traceable administration record. |
| 5 | Pharmacy feels in control of the queue; clinicians see a dependable medicines handoff. |
| 6 | Clinicians feel less need to chase; patients and colleagues see a coordinated diagnostic journey. |
| 7 | Clinicians feel prepared to decide; peers see the relevant imaging context when it matters. |
| 8 | Bed managers feel less reactive; leadership sees capacity decisions made from a coherent picture. |
| 9 | Scheduling staff feel organized; patients see a hospital that remembers their context. |
| 10 | Coordinators feel less alone carrying the journey; teams see clear accountability. |
| 11 | Approval teams feel prepared, not rushed; payers and leaders see a reviewable record. |
| 12 | Finance leaders feel able to explain the gap; clinicians see legitimate, accurate documentation respected. |
| 13 | Claims teams feel in control of follow-up; executives see disciplined revenue work. |
| 14 | Supply teams feel less surprised by shortages; clinical teams see dependable preparation. |
| 15 | Managers feel better able to cover work; staff see fairer, clearer responsibility. |
| 16 | Executives feel less exposed in decisions; boards see a leader who can explain the numbers. |
| 17 | Reporting staff feel ready for scrutiny; the organization appears more orderly and accountable. |
| 18 | IT feels able to meet an external obligation; leadership sees a manageable connection. |
| 19 | Group operators feel in command of multiple sites; owners see consistent oversight. |
| 20 | Staff feel less helpless when connectivity fails; leadership sees preparedness, if sync is verified. |
| 21 | Nurses feel their shift is organized around care; colleagues see dependable follow-through. |
| 22 | Responsible staff feel informed without surrendering judgment; leaders see clear event ownership. |
| 23 | Team members feel included in the same work; colleagues see timely handoffs. |
| 24 | Clinicians feel supported rather than replaced; peers see responsible AI use. |
| 25 | Care teams feel oriented to the patient; patients see professionals who know their story. |
| 26 | IT feels less trapped by incompatible data structures; leadership sees a foundation they can inspect. |
| 27 | Multilingual staff feel included; managers see a more locally usable system if translations are complete. |

The highest-leverage emotional job for the economic buyer is **confidence to improve a hospital without gambling today's care, budget, or reputation on an untested switch**. That job links the broad product to the parallel evaluation.

## Step 4 — Build the guarantees and trust layer

Only the first three entries describe founder-stated commercial offers. They should be written as agreed terms for eligible partners before public use at scale. The final two are proposed trust signals and evaluation practices, not contractual warranties. “In two weeks” and “in three business days” require a defined start condition and scope; no such detail is invented here.

| ID | Guarantee or trust signal; what it promises | Why it reduces buying risk | Where it belongs |
|---|---|---|---|
| **T1** | **Tailored parallel evaluation in two weeks**, when the agreed pathway and readiness conditions are met; hospital decides after comparing the work. | Makes the first decision an inspectable, limited evaluation rather than a blind cutover. | Hero support line, founder demo close, evaluation plan. |
| **T2** | **Current software price matched for eligible early hospital partners**; exact scope, term, and total transition costs to be written in the proposal. | Removes an immediate subscription-budget objection without pretending total cost is unchanged. | Pricing conversation and proposal, after the pathway value is clear. |
| **T3** | **Continuing development included, with requested features ready to test in three business days** under an agreed request process. | Makes adaptation feel practical rather than another open-ended vendor queue. | Demo follow-up and contract schedule; clarify testable versus production-approved. |
| **T4** | **Visible product mechanism:** demonstrate the actual scoped pathway and relevant FHIR-based record/task flow; give IT a documented scope map. | Lets clinical, operational, and technical evaluators examine what is real instead of accepting an architectural slogan. | Demo, technical diligence, and scope appendix. |
| **T5** | **Measured, buyer-controlled decision:** agree baseline, responsibilities, exceptions, clinical sign-off, and go/adjust/stop criteria before rollout. | Preserves decision rights and exposes missing proof early. | Evaluation plan, review meeting, and staged rollout decision. |

Do not replace this evidence with a fake testimonial, unverified certification badge, or promised outcome percentage. The anchor agreement can be described accurately when approved for external use; any named logo, customer quote, live-site count, or quantified result needs separate confirmation and permission.

## Step 5 — Build the BFG master table

This is the copy source of truth for the canonical 25 domains and two documented cross-cutting capabilities. A row is a **message candidate**, not permission to claim the capability is deployed or beneficial in every hospital. The trust ID resolves to the precise wording and status in Step 4; T4 and T5 are process evidence, while T1–T3 are founder-stated offers awaiting final written definitions.

| Feature | Benefit | Emotional Job | Guarantee or Trust Signal |
|---|---|---|---|
| 1. Patient registration | Start with reusable identity and coverage context | Reception feels dependable; staff trust the first handoff | T4 scoped pathway demo; T5 data check |
| 2. Ambient clinical documentation | Draft a note for clinician review with less blank-page work | Clinician feels present with the patient and owns the record | T4 live function demonstration; T5 clinical review |
| 3. CPOE | Send an order into the next role's work with context | Prescriber feels the request will not disappear | T4 order-to-receipt demo; T5 safety sign-off |
| 4. MAR | See and record medicine administration in care context | Nurse feels accountable and supported | T4 task demonstration; T5 clinical sign-off |
| 5. Pharmacy queue and dispense | Organize prescription-to-dispense work | Pharmacy feels in control of demand | T4 queue demonstration; T5 site formulary check |
| 6. Laboratory | Follow order, specimen, result, and review | Clinician feels less need to chase the answer | T4 end-to-end demo; T5 instrument/result check |
| 7. Imaging/PACS viewer | Reach imaging context during care | Clinician feels prepared to decide | T4 viewer demonstration; T5 archive/interface check |
| 8. Bed management | See patient placement and capacity in context | Bed manager feels less reactive | T4 capacity demo; T5 census comparison |
| 9. Appointments/scheduling | Manage slots and bookings with patient context | Scheduling staff feel organized | T4 booking demo; T5 local rules review |
| 10. Coordinator/care navigation | Keep tasks and owners visible across a pathway | Coordinator feels less alone carrying handoffs | T1 parallel pathway; T4 task demo |
| 11. Prior authorization/appeals | Track approval work with a reviewable record | Team feels prepared and accountable | T4 task demo; T5 human review |
| 12. Billing/revenue cycle | Connect documented work to legitimate charge review | Finance feels able to explain gaps | T1 parallel comparison; T5 actual-collections measure |
| 13. Claims processing | See submission, response, and follow-up work | Claims team feels in command of exceptions | T4 claims demo; T5 payer validation |
| 14. Inventory/warehouse | See and request supplies more coherently | Supply team feels ready rather than surprised | T4 stock demo; T5 physical reconciliation |
| 15. HR/staff management | See roles and schedules related to work | Managers feel prepared to cover shifts | T4 role/schedule demo; T5 scope review |
| 16. Analytics | Inspect agreed operating measures sooner | Executive feels better able to defend decisions | T1 pathway comparison; T5 definitions and baseline |
| 17. Ministry submissions/compliance | Prepare required data more consistently | Reporting team feels ready for scrutiny | T4 report demo; T5 local requirements check |
| 18. Government EHR integration | Exchange agreed records with an external system | IT feels able to meet a data obligation | T4 interface specification; T5 external approval |
| 19. Multi-branch orchestration | Coordinate sites with shared structure and local context | Group leader feels oversight across hospitals | T4 branch demo; T5 site access review |
| 20. Offline-first PWA | Continue selected work during lost connectivity, then sync | Staff feel less helpless during outages | T4 offline/sync demo; T5 conflict test |
| 21. Nursing workstation | See assigned tasks and observations in one work area | Nurses feel the shift is manageable | T4 nurse walkthrough; T5 clinical review |
| 22. Clinical event engine | Route a defined event to a responsible reviewer | Staff feel informed while retaining judgment | T4 event demo; T5 escalation rules |
| 23. Messaging/staff inbox | Keep messages and assignments within the work context | Team feels connected and accountable | T4 delivery demo; T5 privacy rules |
| 24. AI clinical assistant | Get defined assistance with human final decisions | Clinician feels supported, not replaced | T4 function demo; T5 clinical governance |
| 25. Unified patient card/history | See more of the patient story where work happens | Care team feels oriented and prepared | T1 pathway evaluation; T5 completeness check |
| 26. Shared FHIR R4 structure | Design agreed handoffs and changes on common data | IT feels able to inspect the foundation | T4 data-model walkthrough; T5 mapping check |
| 27. Georgian/Russian/English architecture | Evaluate daily work in staff languages | Staff feel included in a local fit | T4 language walkthrough; T5 translation review |

The founder offer T2–T3 applies to the buying relationship, so it should accompany the table as a whole rather than be falsely attached as a technical performance guarantee to each clinical feature. If a claim must appear in public copy, lead with a row already demonstrated in the intended hospital setting and add the exact proof available.

## Step 6 — Identify my strongest BFG combination

**Strongest combination:** The unified patient card plus coordinator tasks and the selected downstream handoff (feature), a pathway the team can follow with less reassembly (benefit), confidence that leadership can improve work without losing control (emotional job), and a tailored parallel evaluation with buyer-owned success criteria (T1 + T5). This connects the widest product story to one experience the hospital can actually judge. It is stronger than using an unmeasured financial or clinical outcome as the headline.

- **Rational:** “Choose one patient pathway, then compare how its information and tasks move across your teams in MediMind beside your current system.”
- **Emotional:** “See your people spend less effort piecing together a patient's journey before you ask them to change how they work.” *Use only as an aspiration until a site comparison shows less effort.*
- **Identity-based:** “Lead a hospital that improves from evidence: start with one pathway your own clinical and operations teams can inspect, measure, and approve.”

**Recommended reusable line:** “One patient. Too much repeat work. See the first pathway your hospital could improve.” The accompanying CTA is **“Map my hospital's first improvement.”** The line invites the hospital to identify the actual bottleneck; it does not assert that MediMind has already removed a measured amount of work.

### Sources and handoff to Prompt 4

Core sources: [canonical product scope](</Users/toko/Desktop/medplum_medimind/positioning/03-scope.md>), [canonical language](</Users/toko/Desktop/medplum_medimind/positioning/04-language.md>), [evidence register](../../../research/2026-09-22-evidence-register.md), [founder-offer hero snapshot](../../../copy/2026-09-22-live-hero-working-draft.md), and [Medplum's founder-authored case study](https://www.medplum.com/blog/medimind-case-study). Prompt 4 should test direct brand promises against three executive buying situations, with the parallel pathway evaluation as the leading reason to believe.

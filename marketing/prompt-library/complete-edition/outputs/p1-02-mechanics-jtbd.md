# Prompt 2 — Map Your Product Mechanics & JTBD

> **Status and input (22 September 2026).** Prompt 1 established the buyer (a private Georgian hospital or group), the real alternative (current software plus staff workarounds), and the central test (can one scoped patient pathway improve without an unacceptable transition?). This is Prompt 2's working product journey, assembled from founder terms, canonical scope, and internal positioning; it is not an account of one completed customer's path. The main conversion recommendation is a founder-led, 25-minute pathway demo, followed by a proposed measured evaluation. The founder offers requested features testable in three business days and a tailored parallel evaluation in two weeks, subject to readiness and a defined request. Actual production sign-off is separate. The source for the existing `/request-demo` form appears to show no backend lead submission; live behavior has not been independently tested.

## Step 1 — Map the customer journey in steps

Use one cross-department example throughout: an ordered test is performed, the result reaches the clinician, and the related work reaches billing. The actual first pathway must be chosen with each hospital. The patient example in marketing should use synthetic data; any real evaluation requires the hospital's authorization, privacy review, and agreed handling.

| # | What the customer does | What MediMind does | Result and information still needed |
|---:|---|---|---|
| 1. Recognize a recurring problem | CEO or operator names a recent case of repeated entry, delay, missing context, or disputed numbers | Explains the cross-department operating-system proposition through one pathway rather than a wall of capabilities | A reason to investigate. Need the buyer's actual incident, frequency, and current workaround. |
| 2. Request a conversation | Provides contact and basic hospital context through `/request-demo` or a direct founder introduction | Should capture and route the request, acknowledge it, and prepare a relevant demonstration | **Conversion gap:** the current source for `src/components/Demo/RequestDemo.tsx` appears to simulate submission with a timer and log, then show success, rather than saving/sending the lead. This needs implementation and a live test before advertising a reliable inbound path. |
| 3. Map the first pathway | In a proposed 25-minute founder-led demo, explains where the patient journey creates repeat work and who owns it | Shows the corresponding registration, chart, ordering, results, coordination, and business handoffs with synthetic data | Buyer sees the shape of a possible solution. Need a named owner, systems touched, and the first comparison metric. |
| 4. Decide whether evaluation is worth the effort | CEO, clinical/operations owner, and IT counterpart agree on one pathway, baseline, access requirements, staff time, success criteria, and a decision date | Produces a short evaluation plan, product-scope map, responsibilities, cost view, and readiness check | An actionable evaluation proposal. Missing details vary by site; there is no universal readiness or security approval. |
| 5. Prepare a tailored parallel environment | Hospital authorizes the agreed data or synthetic substitutes, mapping, and staff participation | Configures the relevant workflows and connects or imports the agreed inputs where feasible; staff check data meaning and permissions | A comparable pathway beside current work. The founder's **two-week** offer is a readiness-dependent target, not a promise of whole-hospital migration in two weeks. |
| 6. Compare the first end-to-end pathway | Frontline staff complete the agreed tasks and record friction, safety concerns, time, and exceptions | Shows patient context and linked work in the shared FHIR R4 foundation; provides AI assistance where the specific function is available and approved for use | The first observable difference. Clinical decisions remain with clinicians. Do not confuse a demo click path with accepted real-world performance. |
| 7. Review evidence and decide | Clinical, finance, operations, and IT owners compare baseline with the parallel path and assess burden, errors, data quality, total cost, support, and transition risk | Resolves issues, presents what is supported versus pending, and proposes a staged scope and commercial terms | A go/adjust/stop decision. Even if a request is testable in three business days, production requires separate clinical, operational, security, and contractual sign-off. |
| 8. Expand and operate if approved | Hospital approves controlled rollout, training, responsibilities, and cutover criteria | Deploys agreed capabilities, supports staff, reconciles data, and iterates on prioritized needs | The long-term outcome must be measured across real work: less repeated effort, more reliable information, and any legitimate financial improvement actually realized. Exact rollout and support commitments need a contract. |

The product mechanic is a shared work context, not merely “integrations.” Patient data and hospital tasks live in a common model; a doctor, coordinator, pharmacist, lab worker, nurse, and finance colleague act on their respective parts of a connected journey. The hospital still needs interfaces to outside payers, ministries, devices, and other external services wherever required. Scope is verified per site.

## Step 2 — Identify the moment of value

**Aha moment: the hospital's own team completes its chosen pathway in the parallel environment, then can point to one verified handoff that required less reconstruction of patient information or less repeated work.**

The aha is not signing up, seeing a beautiful dashboard, or watching AI text appear. It happens when the coordinator no longer has to reassemble what the clinician, lab, and billing team already know—or when the clinical team can find the needed context in the agreed place—and the hospital can compare this with its baseline. The first moment can be qualitative (“we no longer need this phone call”) before it is statistically persuasive; record it without converting it into a general outcome claim.

This matters for retention because a hospital keeps a system that makes its routine work reliably easier and understandable across roles. It matters for marketing because a single, visible pathway is easier to demonstrate and substantiate than an unmeasured promise to improve an entire hospital. The first proof package should show the pathway before and after, staff effort, exceptions, and what still required manual work.

## Step 3 — Identify friction points

| Journey point | Why the buyer may drop or lose trust | Specific repair or question |
|---|---|---|
| Initial message | “Hospital operating system” sounds too broad to believe; AI can sound clinically autonomous | Open with a familiar patient pathway and specify that AI drafts or flags while staff decide. |
| Demo request | The existing three-step, nine-required-field form asks for effort before value; the source-observed simulated submit could lose leads | Shorten the request to what scheduling needs, implement reliable submission/notification, and test the live route. The exact public form change belongs to implementation work. |
| Founder demo | A generic feature tour may miss the hospital's real problem | Ask for the last concrete failure and map that journey before showing the relevant capability. |
| Scope selection | “One operating system” may be heard as a promise to replace every external tool instantly | Make a site-specific scope map: included work, necessary outside interfaces, unverified functions, and later phases. |
| Data and technical readiness | Unclear access, source quality, terminology, permissions, and security review can stall a two-week evaluation | Name data owner and IT counterpart, test mapping, and define synthetic versus authorized real data before starting the clock. |
| Staff burden | Parallel work can double tasks temporarily; clinicians may see it as a risky distraction | Limit the pathway and sample, document extra work, let clinical owners stop unsafe use, and collect staff feedback. |
| Outcome comparison | A polished demo can be mistaken for proof; an incomplete baseline can make measurement impossible | Agree on a small metric set and method before evaluation. Mark missing denominators and record adverse effects too. |
| Commercial decision | Price match and continuing development sound open-ended; total cost and priorities are unclear | Put the founder's attractive offer in writing with the actual eligible scope, request process, third-party costs, term, and renewal treatment. These are commercial definitions to settle, not pre-existing exclusions. |
| Rollout and support | A young supplier concentrates operational dependency | Review support, data access/export, downtime approach, change control, and exit provisions with IT and clinical owners. |

## Step 4 — Apply the JTBD lens

“Jobs to be done” means the progress the buyer wants at each moment, beyond the screen they click. The executive's functional job is economic and operational; frontline and IT roles determine whether that progress is real and safe.

| Major step | Functional job | Social job | Emotional job |
|---|---|---|---|
| Recognize and request | Find a practical option for an unresolved cross-department problem | Show the board and team that the leader is addressing a known bottleneck | Feel there may be a way forward rather than another expensive presentation |
| Map a pathway in the demo | See whether the proposed system understands the hospital's actual work | Be seen as a leader who listens to staff and asks hard questions | Feel understood and retain control of the conversation |
| Scope the evaluation | Decide what is safe and worthwhile to test | Demonstrate discipline to clinical and IT colleagues | Feel able to investigate without committing the whole hospital |
| Prepare parallel work | Keep ordinary operations running and protect data meaning | Be a responsible steward of patients, people, and information | Reduce fear of an uncontrolled change |
| Complete and compare the pathway | Prove whether a task is clearer, faster, or more reliable | Show a defensible result to leadership and staff | Feel relief that improvement may be tangible, or confidence to stop if it is not |
| Decide and roll out | Buy only the scope the hospital can operationalize; expand based on evidence | Be the leader who improved work without a careless switch | Feel accountable and confident about the next step |

Across these steps the core job is: **“Help me improve how this hospital handles a patient, while giving me enough evidence and control to defend the change.”** Different committee members put weight on different parts. A clinician wants patient context and review authority. Finance wants reconciliation and actual collections, not speculative uplift. IT wants feasible mapping, support, and an exit path.

## Step 5 — Identify my market sophistication level

**Working assessment: Level 4 of 5, “New Mechanism.”** This is an editorial score, not a survey of Georgian buyers. Hospital buyers already hear claims about unified records, less administration, and embedded AI from substantial vendors such as [InterSystems](https://www.intersystems.com/products/intellicare/) and [Oracle Health](https://www.oracle.com/health/clinical-suite/electronic-health-record/). A fresh list of generic benefits will blend in. “Experience” (Level 5) may apply to an individual buyer fatigued by failed implementations, but cannot be assumed for the whole segment.

The message therefore needs a concrete, believable mechanism: **choose one patient pathway; show the shared work across roles; compare it beside the current system; decide from observed evidence.** Lead with the work the CEO recognizes, explain the shared FHIR R4 foundation only as a reason the handoffs can connect, and put AI in its proper role as assistance with human review. The founder's price match, included continuing development, three-business-day test target, and two-week parallel offer make the mechanism more tangible when written with site-specific scope and readiness. Avoid “first,” “fully autonomous,” “zero risk,” and guaranteed clinical or financial outcomes.

## Step 6 — Rewrite the product description

**Customer-facing description (112 words):**

> One patient can create work across reception, clinicians, the lab, pharmacy, coordinators, and finance. MediMind brings that work into one hospital operating system, so each team can act with the patient context it needs and leaders can see where the journey stalls. Start with one pathway your hospital wants to improve. We map it with your team, show how it works in MediMind, and propose a tailored evaluation beside your current system. Your clinicians remain responsible for care decisions; AI helps with defined tasks for them to review. Compare the work, cost, and staff experience before deciding how far to go. As your needs change, the system can keep developing with you.

### Sources and handoff to Prompt 3

The [business and market answer](p1-01-business-market.md), [canonical scope](</Users/toko/Desktop/medplum_medimind/positioning/03-scope.md>), [evidence register](../../../research/2026-09-22-evidence-register.md), and [live offer snapshot](../../../copy/2026-09-22-live-hero-working-draft.md) ground this journey. The `/request-demo` observation comes from the current source file `src/components/Demo/RequestDemo.tsx`; it needs a live browser check before describing deployed behavior. Prompt 3 should translate each documented domain into a buyer benefit, while keeping code presence, deployment, acceptance, and outcomes distinct.

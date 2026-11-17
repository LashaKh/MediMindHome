# Mtskheta Hospital acceptance in Test Day

Open `/admin/testday/acceptance` after signing in through the Test Day gate. The initial scope is Mtskheta Hospital. HR/access and payroll form one workstream. Billing and Cashier/accounting form the other. Each of those four areas has its own decision. The other eleven areas show their planned scope.

## Billing procedures

Open `/admin/testday/acceptance/billing`. Staff can browse the procedures before choosing the build. Use **პასუხისმგებელი და ვერსია** to assign the area owner and select the environment and build when recording results. **წინა სია და შედეგები** opens the original 17 checks and their results for the selected build. The expanded Billing checklist has a separate revision. Other areas use the existing checklist revision.

The Billing worklist maps 164 actions across 11 groups. Each action provides the test setup, the steps to perform, the expected result, and the evidence to record. A case that depends on use at Mtskheta is marked as conditional. Record why it does not apply or record the blocker if a workflow the branch needs is unavailable.

| Procedures | WebMed and MediMind evidence used |
|---|---|
| Finding cases, service lines, tariffs | WebMed case calculation, service entry and effective-dated pricing in the legacy screen inventory and billing model. MediMind Billing Workbench and medical service catalogue routes. |
| Funding, relief, DRG and closing | WebMed insurance, case and per-service documents, relief terms and approval branches. Mtskheta sponsor classes and October replay findings, including per-payer relief and package charge handling. |
| Invoices, insurer files and remittances | WebMed patient invoice print, payer exports (templates 59 and 60), and settlement per claim line. MediMind invoice register and settlement. The 29 named worksheet checks are drawn from Mtskheta's 14 insurer mappings, including the second GPI case sheet. |
| Reports and handoffs | MediMind Report Center inventory and WebMed report catalogue. Admission journal and inpatient census use their own routes. Case handoffs cover Registration, Cashier, Payroll, and Ministry. |

For source verification, see the EMR repository's `documentation/migration/LEGACY-BILLING-MODEL.md`, `documentation/migration/LEGACY-BILLING-WORKFLOW-PARITY.md`, and `deploy/shadow/BRANCH-CUTOVER-PLAYBOOK.md`, along with `deploy/shadow/reports/2026-11-14-mtskheta-i2-i7-insurer-sheets.md` and the Billing case, report and insurer identity definitions under `packages/app/src/emr`. Confirm active contracts, staff permissions, enabled bank/insurer connections and actual export acceptance with the Mtskheta team during testing.

## Run a department session

1. Confirm the environment and the served build identifier with the session lead. Enter both on the acceptance page.
2. Open a case and confirm whether the WebMed operation applies to the branch. Use a staff role and agreed test records. Demonstrate the operation, then ask the staff member to repeat it independently.
3. Record the result and the observed outcome. Use a synthetic record reference or a reference to restricted, redacted evidence. Keep patient data and credentials out of Test Day notes. If there is a defect, file it in Test Day and enter its issue number on the case.
4. Use **ფილიალში არ გამოიყენება** for a case marked as conditional after confirming why the branch does not use it. For a missing in-scope workflow, record a failure or a blocker.
5. After a fix, record another attempt. A new result for the same scope requires the hospital lead to review the approval again. Use a new version for a different build.
6. A logged-in team member names the department owner. After that owner reviews the evidence, the team member records the agreed decision. The record keeps both names. A request for changes can be recorded before all cases pass.

The catalog references WebMed operations from the legacy screen inventory and code map. Mtskheta staff confirm the configured roles, pay rules, cash controls and payer formats during the sessions.

## Release

Apply the Test Day acceptance migrations in order, deploy the `track-event` function with its existing JWT configuration, then release the landing frontend. The existing Test Day login is the gate for owner assignments, results and decisions.

## Mtskheta discharge exercise

Billing opens an eight-step rehearsal on Shadow. Prepare two synthetic emergency visits on the selected build. Use the first to demonstrate the workflow and the second for staff to repeat it independently. The prices and coverage in this exercise are training data.

Each saved step records the performer, the tester, the observed amounts and supporting references. A failed step creates a linked builder issue in the same transaction. On the issue, open the retest link, select the corrected build and repeat that step. A successful linked retest closes the issue. The original result remains visible on the original build. A build is eligible for the department owner's pilot decision when all eight steps pass, including independent repetition. Pilot results are stored under `mts-billing-er-pilot-v1`; the 164-action catalog retains its own decisions.

## Case-led handoffs

The current Billing entry follows one fictional adult from ER triage through registration, one ECG order and result, case calculation, cashier payment, correction, refund, discharge and reconciliation. The roles and entry points follow the Mtskheta seat cards and the ER arrivals queue's triage-first design. The clinical story and prices are synthetic. The coordinator confirms local ECG responsibility, cashier permissions, available Shadow functions, test tariffs and a suitable test policy before the session.

The team demonstrates 11 handoffs on visit A. Staff repeat them independently on visit B. The tester records the actual performer and account, visit, document reference, observed values and evidence. The two visit references are distinct and shared per build. An explicitly linked retest can run one failed handoff on a different build. The department decision compares both rounds. Original eight-step records remain available through the previous exercise in settings or its ER step links. The action catalog has a separate decision.

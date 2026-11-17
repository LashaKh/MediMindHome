# Mtskheta Hospital acceptance in Test Day

Open `/admin/testday/acceptance` after signing in through the Test Day gate. The initial scope is Mtskheta Hospital. HR/access and payroll form one workstream. Billing and Cashier/accounting form the other. Each of those four areas has its own decision. The other eleven areas show their planned scope.

## Run a department session

1. Confirm the environment and the served build identifier with the session lead. Enter both on the acceptance page.
2. Open a case and confirm whether the WebMed operation applies to the branch. Use a staff role and agreed test records. Demonstrate the operation, then ask the staff member to repeat it independently.
3. Record the result and the observed outcome. Use a synthetic record reference or a reference to restricted, redacted evidence. Keep patient data and credentials out of Test Day notes. If there is a defect, file it in Test Day and enter its issue number on the case.
4. Use **ფილიალში არ გამოიყენება** for a case marked as conditional after confirming why the branch does not use it. For a missing in-scope workflow, record a failure or a blocker.
5. After a fix, record another attempt. A new result for the same scope requires the hospital lead to review the approval again. Use a new version for a different build.
6. The named hospital lead reviews the evidence and saves a decision with their personal code. A request for changes can be recorded before all cases pass.

The catalog references WebMed operations from the legacy screen inventory and code map. Mtskheta staff confirm the configured roles, pay rules, cash controls and payer formats during the sessions.

## Release and lead setup

Apply `supabase/migrations/0008_testday_acceptance.sql` to the landing project's database. Deploy the `track-event` function with its existing JWT configuration, then release the landing frontend. The existing Test Day login is the gate for all acceptance actions.

Set the Edge secret `TESTDAY_ACCEPTANCE_SIGNERS` to a JSON object whose keys are the SHA-256 digests of individually issued 64-character lowercase hex codes. Generate each raw code with a cryptographically secure source such as `openssl rand -hex 32`. Hash the exact code string without a trailing newline. Each value has `name` and `areas`. For example, use a digest from the approved lead's own code as the key for `{"name":"Named hospital lead","areas":["billing"]}`. The enabled area IDs are `hr-access`, `rosters-payroll`, `cashier`, and `billing`. Assign areas only after GeoHospitals identifies its authorized leads. Deliver raw codes privately and remove a digest from the secret to revoke its approval access.

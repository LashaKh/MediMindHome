# Mtskheta Hospital acceptance in Test Day

Open `/admin/testday/acceptance` after signing in through the Test Day gate. The initial scope is Mtskheta Hospital. HR/access and payroll form one workstream. Billing and Cashier/accounting form the other. Each of those four areas has its own decision. The other eleven areas show their planned scope.

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

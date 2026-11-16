# MediMind website and Sales CRM

This repository contains the public MediMind website, presentation decks, investor invitations and
the founders' hospital Sales CRM. The medical records application is maintained in a separate repository.

- **GitHub owner:** [LashaKh/MediMindHome](https://github.com/LashaKh/MediMindHome).
- **Website:** [medimind.md](https://medimind.md), served by Netlify. Pushing `main` triggers a website deployment.
- **CRM:** [medimind.md/admin/crm](https://medimind.md/admin/crm).
- **Backend:** Supabase project `kvsqtolsjggpyvdtdpss`; CRM records live in the database, not in Git.

## Start here

- **Using the CRM or handing it to Irakli:** [CRM handover, login and agent prompt](docs/crm-handover.md).
- **Working on the repository:** read [AGENTS.md](AGENTS.md) and, for CRM work,
  [.claude/skills/sales-crm/SKILL.md](.claude/skills/sales-crm/SKILL.md).
- **Agent discovery:** Claude uses `.claude/skills/sales-crm`; Codex uses the linked
  `.agents/skills/sales-crm` folder. Both read the same instructions.

## What is included

| Path | Purpose |
| --- | --- |
| `/` | Public marketing website and demo-request form |
| `/admin/crm` | This week, Pipeline, Targets and Anchor views |
| `/admin/dashboard` | Investor invites and briefing analytics |
| `/briefing/<token>` | Investor password gate |
| `/deck.html` | Gated investor pitch deck |
| `/hospitals.html`, `/partner.html` | Hospital and partnership presentations |

The frontend uses React 18, Vite 5 and TypeScript. Supabase Edge Functions (server-side API handlers)
serve CRM and admin operations through `track-event?route=…`.

## Local development

Use Node.js with npm. Deno is also needed for the CRM command-line tool and backend tests.

```bash
git clone https://github.com/LashaKh/MediMindHome.git
cd MediMindHome
npm ci
npm run dev
```

Core CRM/admin pages default to the existing Supabase project. Local CRM actions use the live database
unless `VITE_SUPABASE_URL` points to a separately configured backend. Keep credentials in private
environment configuration; never commit `.env` files or customer exports.

```bash
npm run build
npm run lint
deno test --allow-env --no-check supabase/functions/crm/validate.test.ts supabase/functions/track-event/routing.test.ts
```

Netlify builds `dist/` automatically from `main`. Backend changes require a separate Supabase deployment;
see the CRM skill before changing or deploying the API. Database migrations are in `supabase/migrations/`.

## Mtskheta test-day portal (`/admin/testday`, added 2026-11-16)

The working tool for MediMind representatives during the Mtskheta hospital test day: one scrolling page per
department that they tick as they go (staff sign-in checks, test seats, morning round, mirror flows with the
expected on-screen result, teach points, issues with PR links, end-of-day hand-in) plus a founder overview with
CSV export. Mobile first (375 px), Georgian.

- **Gate:** its own shared password, stored only as the Supabase secret `TESTDAY_PASSWORD` (ask the founder;
  never commit it). Tokens are signed with a key derived from `ADMIN_JWT_SECRET` plus `:testday` and carry
  role `testday`, so they never open the CRM or investor admin. Wrong passwords go to `testday_login_failures`
  (10 per 15 minutes per IP hash, then 429). Tokens last 14 hours.
- **API:** `supabase/functions/testday/index.ts`, served as `track-event?route=testday`
  (actions `login`, `state`, `tick_user`, `tick_flow`, `issue_add`, `issue_update`, `handin`).
  Deploy with `supabase functions deploy track-event --project-ref kvsqtolsjggpyvdtdpss --no-verify-jwt`.
- **Data:** `testday_*` tables (migration `0006_testday.sql`, RLS on, no anon access). Staff names, WebMed
  logins and test-seat passwords live only there and reach the browser only after the gate: never in git or the
  JS bundle.
- **Seed:** `zsh -ic 'node scripts/testday-seed.mjs'` reads the private files under `~/.medimind/` on the
  founder's Mac. Re-running is safe: it updates departments, staff and seats and never touches ticks, issues or
  hand-ins. Department content (flows, teach points) is in `scripts/testday-content.mjs`, copied from the EMR
  repo's `scripts/shadow-staff/rep-guide-pdf.mjs`.
- **UI:** `src/pages/TestDay.tsx` + `TestDay.css`, client `src/lib/testdayApi.ts`. Saves are optimistic,
  one field at a time (two testers never undo each other), retried 3 times, and the page re-reads every 30 s and
  on focus. The tester's name is asked once and stamped on every tick.
- **Screenshots without names:** add `?redact` to any portal URL to blur names and logins.
- **Clearing test data after a dry run:** delete rows by `checked_by` / `reported_by` in `testday_user_checks`,
  `testday_flow_checks`, `testday_issues`, `testday_notes`.

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

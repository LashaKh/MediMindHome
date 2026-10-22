---
name: sales-crm
description: >-
  MediMind's Sales CRM at medimind.md/admin/crm — the hospital pipeline, targets and the
  GeoHospitals anchor — and the command-line tool (scripts/crm.ts) that reads and changes it
  with the same rules as the website. Use this skill whenever someone asks to log, update,
  read or report on sales: "log that I messaged X", "Tamar replied", "add hospital Y",
  "move Z to Qualified", "close it as lost", "what's due this week", "who haven't we
  followed up with", "what did we last send TIM", "prepare the pipeline for the 500 Global
  check-in", "update the CRM". Also read it before changing the CRM's code
  (src/pages/crm, src/data/crm.ts, supabase/functions/crm). Not for investor analytics or
  the pitch deck.
---

# Sales CRM

Two founders, Lasha and Irakli, run hospital sales in Georgia from this CRM. It is live at
**https://medimind.md/admin/crm** behind the admin password, the same one as investor analytics. The data
sits in the Supabase project `kvsqtolsjggpyvdtdpss`, in two tables: `crm_accounts` holds one row per hospital
or group, and `crm_activities` holds its timeline. The website's "Request demo" form adds each request as an
inbound target.

Everything here is real customer data. Never invent a fact. If something is unknown, write "(to add)". If a date
is a guess, say so in the timeline text.

## The rules (500 Global, Week 5 Day 2)

- **One row per buying organization.** A group that buys centrally is one row.
- **Kinds:**
  - `target`: we haven't got a "yes, let's talk" yet. A message with no reply is still a target.
  - `deal`: a named person replied and agreed to talk. It is in the pipeline.
  - `anchor`: GeoHospitals, signed. It is never counted as new pipeline.
- **Stages are things the hospital did**, never our own work. Entering a stage fills its milestone date once,
  automatically.

  | stage | the hospital… | milestone |
  |---|---|---|
  | `discovery` | had a named leader reply and agree to talk | `discovery_at` (first call/meeting logged) |
  | `qualified` | confirmed on a call the pain with a number, why now, a sponsor, who approves and pays, who owns it | `sql_at` |
  | `evaluation_agreed` | signed off scope, testers, baseline, success criteria, dates; data access works | `eval_agreed_at` |
  | `evaluating` | had its own staff do the first hands-on test (a founder demo doesn't count) | `first_test_at` |
  | `proposal` | reviewed results, named who signs and when; we sent a price | `results_reviewed_at` |
  | `negotiation` | accepted in principle; the contract is with their legal team | — |
  | `won` | **signed the purchase agreement. Nothing less.** | `signed_at` |
  | `lost` | stopped. Always give a `lost_reason` | — |

- **Status is where the deal stands right now:**
  - `active`: moving, and the next step has a date.
  - `waiting_on_us`: we owe them something. Our own work is a status, never a stage.
  - `waiting_on_it`: the website shows it as "Waiting on the hospital". Use it when the next move is theirs: a reply, data access or an approval.
  - `stalled`: no hospital activity for 14 days or more.
  - `on_hold`: paused on purpose.
- **Every open deal needs an owner and a dated next step. Every contacted target needs a dated follow-up.** The
  "This week" page flags anything missing or late.
- **Tag the source:** `founder_network`, `warm_intro`, `direct_outreach` or `inbound`.
- **Lost reasons:** use one of these, so they can be counted:
  - No reply after follow-ups
  - Not a priority now
  - No budget
  - The group decides elsewhere
  - Staying with their current system
  - They built their own system
  - Chose another vendor
  - Data or security approval refused
  - Evaluation missed the success criteria
  - Bad fit

## The tool: `scripts/crm.ts`

The tool runs the CRM's own API code in-process. Stage dates, timeline entries and conflict checks therefore
behave exactly as on the website. It needs Deno and a Supabase personal access token in `SUPABASE_ACCESS_TOKEN`.
On the founder's Mac, `~/.zshrc` exports the token. A shell that skipped it can run the tool through
`zsh -ic '…'`. On another machine, create a token at supabase.com → Account → Access Tokens, from an account that
can open the project.

The two "Supabase personal access token" entries in the vault were refused on 2026-10-23, so don't rely on them.
Never print the token or the service key; the tool keeps both in memory only.

Run it from the landing repo root:

```bash
deno run -A scripts/crm.ts list [all|deals|targets|anchor|closed] [--json]
deno run -A scripts/crm.ts show "<#ref or part of the name>" [--json]   # every field plus the timeline
deno run -A scripts/crm.ts add target "<name>" city=Tbilisi source=warm_intro owner=Lasha --as Lasha
deno run -A scripts/crm.ts set "<hospital>" field=value ... --as Lasha    # "field=" clears a field
deno run -A scripts/crm.ts log "<hospital>" message --file msg.txt --as Lasha   # or: ... call "text" --on 2026-10-20
deno run -A scripts/crm.ts archive "<hospital>" --as Lasha                # restorable; prints the restore command
deno run -A scripts/crm.ts fields                                          # every field you can set
```

- **Always pass `--as <person>`.** It is the person the change is for, so the timeline stays honest. Use Irakli's
  name for facts from Irakli, Lasha's for Lasha's own actions.
- **Log types:** `message` (WhatsApp, Messenger, SMS, LinkedIn), `call`, `meeting`, `email`, `note`. All but
  `note` count as contact and move "last contact". A `note` is internal. `--on` back-dates an entry; future dates
  become today.
- Long or Georgian text goes through `--file` (`-` reads stdin). Log the message exactly as sent.
- `add` refuses a name that is already in the CRM. Update that row instead.
- If someone saved the same hospital a moment earlier, `set` stops with a conflict (409) instead of overwriting
  them. Run `show` to see their change, then try again.

## Recipes

- **"I sent X a message"**
  1. `log X message --file …`
  2. Set a follow-up: `set X "next_step=If no reply, call …" next_step_date=<3 to 5 working days out>`.
  3. If X is a deal, also `status=waiting_on_it`.
- **"X replied and wants to talk"**
  1. `set X kind=deal`. It enters Discovery; the first-contact date and the status fill in by themselves.
  2. `log X message …` with their reply.
  3. Set the next step, such as booking the discovery call, with a date. Give it an owner if it has none.
- **"We had the discovery call"**
  1. `log X call "…"`. This fills `discovery_at`.
  2. Did they confirm all of the Qualified items? Then `set X stage=qualified` plus `pain=… pain_status=confirmed champion=… buyer=… current_software=… current_spend_gel=…`. If not, it stays in Discovery and the next step says what's missing.
- **Won:** `set X stage=won signed_at=YYYY-MM-DD amount_gel=<GEL a year>`.
- **Lost:** `set X stage=lost "lost_reason=<one of the list>"`.
- **Weekly review / 500 Global check-in:**
  1. Run `list deals`, `list targets` and `list closed`.
  2. Report late or missing next steps, deals without owners, and contacted targets without a follow-up date.
  3. Report what moved this week, from `show` on each.
  4. The website's "This week" tab shows the same picture.

## Guardrails

- **Use the tool, not raw SQL.** SQL skips the rules and the timeline. Read-only SQL for a report is fine.
- **Never put passwords, patient data or keys in notes or the timeline.** Never print the service key.
- **Never commit files with deal notes or prices.** The real data lives only in the database.
- **Archive, don't delete.** Archived rows can be restored.
- **Test rows** are named `ZZ …` and are removed afterwards.

## Changing the CRM's code

- **Where things live:**
  - UI: `src/pages/AdminCrm.tsx` and `src/pages/crm/*`.
  - Vocabulary, flags and metrics: `src/data/crm.ts`.
  - API client: `src/lib/crmApi.ts`.
  - API: `supabase/functions/crm/` (rules in `validate.ts`), served through the `track-event` router (`?route=crm`).
  - Tables: `supabase/migrations/0003`–`0005`.
- **Tests:** `deno test --allow-env --no-check supabase/functions/crm/validate.test.ts supabase/functions/track-event/routing.test.ts`.
- **Deploy the API:** `supabase functions deploy track-event --project-ref kvsqtolsjggpyvdtdpss --no-verify-jwt`.
  Development edge-function deploys are pre-authorized.
- **Publish the website:** push `main`; Netlify publishes medimind.md within a minute or two. Commit only your own
  files, because other sessions leave work in this checkout.
- **Local test copy:** run the API with throwaway admin secrets, bound to 127.0.0.1. Then start
  `VITE_SUPABASE_URL=http://127.0.0.1:8000 npx vite --port 5180 --host 127.0.0.1` and log in with the throwaway
  password. It writes to the real database, so only touch `ZZ` test rows.

# Sales CRM handover for Irakli

## Message to send Irakli

Irakli, the MediMind website and hospital Sales CRM are in
[LashaKh/MediMindHome](https://github.com/LashaKh/MediMindHome), under Lasha's GitHub account.
Accept the repository invitation while signed in as **irakli-ff** to get write access.

Open **https://medimind.md/admin/crm** and enter the shared **admin password** supplied privately by
Lasha. The login page currently says "Briefing Analytics"; this is also the CRM login. After login,
it returns you to the CRM. Choose **Irakli** in **You are** at the top so the timeline attributes your work.
There is currently one shared admin password, not a separate email/password account for each founder.

The CRM has four views:

- **This week:** overdue follow-ups, missing next steps and the current sales picture.
- **Pipeline:** hospitals where a named person has replied and agreed to talk.
- **Targets:** hospitals we are researching or contacting; an unanswered message stays here.
- **Anchor:** the existing signed GeoHospitals relationship, separate from new pipeline.

Open a hospital to see its contacts, next step, notes, milestones and timeline. Log calls, meetings,
messages and emails; use a note for internal context. Give each open deal an owner and a dated next
step, and each contacted target a dated follow-up. Use **Save next step** or **Save changes** where
shown. **More → Refresh** loads the latest shared data; **More → Export CSV** downloads a private copy.

Stages record what the hospital has done. Our own outstanding work belongs in its status. Only mark
**won** after the purchase agreement is signed; record a reason for **lost**. Archive mistaken or
obsolete records so they can be restored.

You can also manage this CRM by talking to an agent in this repository. The agent can read the shared
pipeline, add hospitals, log conversations, update next steps and prepare a weekly report. The prompt
below gets it started. It needs separate Supabase access before it can read or save CRM data.

## The three kinds of access

| Access | What it enables | How Irakli gets it |
| --- | --- | --- |
| GitHub write access | Pull and push repository code and instructions | Accept the invitation to `irakli-ff` |
| CRM admin password | Use the live browser CRM and investor admin dashboard | Lasha supplies the current password privately |
| Supabase project access and personal access token | Let the local agent tool read and update the CRM | An authorized Supabase organization admin grants access to the existing project; Irakli creates his own token |

GitHub access does not sign you into the CRM or Supabase. Browser-only CRM use needs no local
installation. An admin session lasts about one hour; sign in again when prompted. After ten wrong
passwords from the same connection in fifteen minutes, wait for the lockout to expire.

## Set up the repository and agent

1. Accept the GitHub invitation, clone the repository and open that folder in Codex or Claude Code.
2. Install Node.js/npm for website development, and Deno for the CRM tool. Run `npm ci` if developing the site.
3. Have an authorized admin grant your Supabase account access to project `kvsqtolsjggpyvdtdpss`.
   Create a personal access token from your Supabase account's **Access Tokens** settings.
4. Supply `SUPABASE_ACCESS_TOKEN` privately to the terminal that runs the agent or tool. For a
   one-terminal session on macOS with zsh, the following prompts without showing the value or putting it in shell history:

   ```zsh
   read -rs 'SUPABASE_ACCESS_TOKEN?Supabase personal access token: '
   print
   export SUPABASE_ACCESS_TOKEN
   ```

5. From the repository root, verify access with a read-only command:

   ```bash
   deno run -A scripts/crm.ts list deals --as Irakli
   ```

The token must reach the process that runs the command. A desktop agent already running elsewhere
may not inherit a variable set in a new terminal; use its private environment setup or start the agent
from the configured terminal. Never paste a token into agent chat, a committed file or a `VITE_*`
variable (those are bundled into the public website).

The tool also supports an already provisioned `SUPABASE_SERVICE_ROLE_KEY`, but prefer your own
personal access token. The tool accesses the live database and uses the website's CRM rules.
Keep customer notes, prices and CSV exports outside the repository.

## Prompt to paste into the agent

```text
I am Irakli, working on MediMind hospital sales in the MediMindHome repository.
Read AGENTS.md, .claude/skills/sales-crm/SKILL.md and docs/crm-handover.md.
Use the sales-crm skill for this conversation. It is also available to Codex through
.agents/skills/sales-crm. Use --as Irakli for changes I ask you to make.

First check that Deno and private Supabase access are available, without printing
credentials. Read the live CRM using scripts/crm.ts and give me a short overview of
open deals, targets, overdue follow-ups and missing owners or dated next steps.
Keep the GeoHospitals anchor separate. Make no CRM changes during this initial report.

After that, use my requests to add hospitals, log conversations and update next
steps. Read the existing hospital and timeline first, use its #ref, and avoid
duplicates. Only advance a stage when the hospital has met the documented criteria.
Use Asia/Tbilisi for relative dates and tell me the exact saved date. Ask a short
question if a material fact is missing. Verify each change by reading it back and
tell me what saved. Recording a message does not authorize sending one.

Use scripts/crm.ts for writes, never raw SQL. Keep customer facts in the CRM and
credentials outside chat and Git. When I change a reusable workflow or request a
new CRM feature, keep the shared skill and relevant handover instructions current.
```

## Requests you can give the agent

These are templates; replace the placeholders with facts before requesting a change.

- "Show my overdue follow-ups and what I need to do this week."
- "Add [hospital] as a target in [city], source warm intro, owner Irakli."
- "I sent [hospital] this message today: [exact text]. Log it and set a follow-up for [date]."
- "[Person] at [hospital] replied and agreed to talk. Record their reply and set the next step for [date]."
- "We held a discovery call with [hospital]. Here are the confirmed facts: [notes]. Update the record."
- "Prepare our weekly pipeline summary: what moved, what is overdue and what needs a decision."

The tool supports `list`, `show`, `add`, `set`, `log`, `archive`, `restore` and `fields`.
Detailed commands and stage criteria are maintained in the shared sales CRM skill.

# CLAUDE.md — MediMind Landing Page

This file is the source of truth for any AI agent working in this repo.
Read it before doing anything else.

---

## What this repo is

**One Netlify deploy at `medimind.md` that serves four things:**

| URL                              | What renders                                                |
| -------------------------------- | ----------------------------------------------------------- |
| `medimind.md/`                   | Public marketing landing page (React SPA, Vite build)       |
| `medimind.md/briefing/<token>`   | Per-investor password gate (React route)                    |
| `medimind.md/deck.html`          | Investor pitch deck (single-file Reveal.js, gated)          |
| `medimind.md/admin/dashboard`    | Admin panel — create / edit / track invites                 |

There is NO separate pitch-deck repo any more. Everything lives here.

---

## Tech stack

- **Frontend**: React 19 + Vite 5 + TypeScript + react-router-dom + Zustand
- **Backend**: Supabase (Postgres + Edge Functions in Deno), project ref `kvsqtolsjggpyvdtdpss`
- **Hosting**: Netlify, auto-deploys from `main` branch on `LashaKh/MediMindHome`
- **Pitch deck**: Reveal.js 4.6.1 loaded from CDN; everything else is one big inline-styled HTML file at `public/deck.html`

---

## Repo layout

```
src/                                    React SPA
├── pages/
│   ├── BriefingGate.tsx                Investor password gate (sets sessionStorage on success)
│   ├── BriefingLocked.tsx              Catch-all "invitation required" view
│   ├── AdminLogin.tsx                  Admin password → JWT
│   └── AdminDashboard.tsx              Invite list, analytics, password management
├── lib/tracking.ts                     investorLogin() + analytics events
└── store/useAdminStore.ts              JWT session

public/
├── deck.html                           ← THE PITCH DECK (single file, ~7300 lines)
├── deck-assets/                        Logos, screenshots, team photos used by deck.html
└── (favicon, og-image, etc.)

supabase/
├── migrations/
│   ├── 0001_investor_tracking.sql      investor_invites + investor_events tables
│   └── 0002_invite_password.sql        password column + backfill
└── functions/
    ├── _shared/cors.ts                 Shared CORS + IP-hash helpers
    ├── admin-login/                    POST password → admin JWT
    ├── admin-data/                     Bearer JWT → invite list, events, summary
    ├── admin-write/                    Bearer JWT → create / toggle_active / update / regenerate_password / update_password
    ├── investor-login/                 POST {token, password} → unlock the gate
    └── track-event/                    Public analytics ingest from deck

netlify.toml                            Cache headers; deck.html is no-store
```

---

## How the auth flow actually works

1. Admin creates an invite in the dashboard. `admin-write` (action: `create`) generates:
   - A short token like `lasha-b6y8z7`
   - A password using the format **FirstName + UPPER(first letter of surname)** → e.g. `LashaK`
2. Admin sends the investor `medimind.md/briefing/lasha-b6y8z7` + the password.
3. Investor opens the URL → `BriefingGate.tsx` renders, asks for the password.
4. On submit → `investor-login` edge function compares (case-insensitive) against the `password` column.
5. On success → sessionStorage `mm_briefing_access = "1"` + redirect to `/deck.html`.
6. `deck.html` has an inline auth-guard at the top: if `sessionStorage["mm_briefing_access"]` is missing, it redirects to `/briefing` (NOT `/`).

**Rate limit**: 3 failed attempts in 5 minutes → 429 lockout (logged via `password_fail` events).

---

## Pitch deck rules (READ BEFORE EDITING `deck.html`)

The deck has been through 8 mobile-native passes. Future agents must preserve them.

### 1. Asset paths

- Inside this repo, **all `<img>` and `<link>` tags use `/deck-assets/...` paths**, NOT `assets/...`.
- If you copy markup from anywhere else, run a global find-replace before saving.

### 2. Auth-guard redirect

- The deck-top guard redirects to `/briefing`, NOT `index.html`. Don't change this — `index.html` doesn't exist as a discrete page in the SPA.

### 3. Reveal mobile bypass (CRITICAL — do not undo)

The mobile media query at ~line 5454 contains a deliberate bypass of Reveal's transform-scale layout:

```css
@media (max-width: 768px) {
  .reveal { position: fixed; height: 100dvh; overflow: hidden; }
  .reveal .slides > section {
    position: absolute; width: 100%; height: 100dvh;
    overflow-y: auto; -webkit-overflow-scrolling: touch;
    transform: translate3d(0, 0, 0) !important;  /* present */
  }
  .reveal .slides > section.past   { transform: translate3d(-100%, 0, 0) !important; }
  .reveal .slides > section.future { transform: translate3d(100%, 0, 0)  !important; }
}
```

Without this, slide content past the canvas height gets clipped on phones because Reveal scales the deck to fit the viewport. Do not "fix" or simplify this block.

### 4. Mobile nav arrows

Bottom-corner transparent chevrons (`<button class="mobile-nav">`) wired to `Reveal.next()` / `Reveal.prev()`. They live just before the closing `</body>`. The CSS uses a `:has()` ancestor query to flip color to white on dark slides (cover, dividers, hook).

### 5. Team-card layout on mobile

- Founder/advisor cards use **photo on the LEFT, text on the right** (row layout). Don't switch back to column-stacked — the user explicitly rejected that.
- The decorative `.founder-badge` ("Co-Founder" pill in the upper-right) is **hidden on mobile** because it overlaps the founder name in the narrow row layout. The role line below the name already conveys the same info.
- Photos are 88px circles with `object-position: center 30%` so heads aren't clipped at the top.

### 6. Per-slide overrides

Most slide-class hooks (`.bm-slide`, `.gw-slide`, `.team-slide`, `.gallery-slide`, `.cat-slide`, `.prog-slide`, `.divider-slide`, `.cover`, `.hook-slide`) have targeted mobile overrides. Search for the slide class in the `@media (max-width: 768px)` block before adding new mobile rules.

### 7. Funds-bar on Ask slide

The four-segment horizontal bar (MediMind OS / GTM / AI depth / Regional entry) **stacks vertically on mobile** so labels stay readable. Don't undo.

### 8. Editing deck.html — checklist

- [ ] Make changes
- [ ] Test desktop at 1280×720 (regression — must look identical)
- [ ] Test mobile at 390×844 (iPhone 14 Pro) — walk every slide, verify scroll
- [ ] Test mobile at 320×568 (iPhone SE) — boundary case
- [ ] If you touched a heavy graphic, also check at 768px (tablet boundary)

---

## Supabase access

- **Project ref**: `kvsqtolsjggpyvdtdpss` (same project as the EMR — but only `investor_*` tables and the four invite-related edge functions belong to this repo)
- **CLI**: `supabase` v1.131.4, already authenticated. Access token in env: `SUPABASE_ACCESS_TOKEN`

### Common operations

```bash
# Deploy an edge function
supabase functions deploy admin-write --project-ref kvsqtolsjggpyvdtdpss --no-verify-jwt

# Run SQL (requires SUPABASE_ACCESS_TOKEN env var)
curl -s -X POST "https://api.supabase.com/v1/projects/kvsqtolsjggpyvdtdpss/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "select id, full_name, password from investor_invites limit 5"}'

# Apply a new migration (paste the SQL into a query block like above, or use db push if you have the DB password)
```

### Tables

- `investor_invites(id, token, full_name, first_name, organization, email, notes, created_at, active, password)`
- `investor_events(id, token, event_type, metadata, ip_hash, user_agent, occurred_at)`

Both have RLS enabled with all anon/authenticated access revoked. Edge functions use the service-role key.

---

## Deployment

- **Source**: `LashaKh/MediMindHome` on GitHub, branch `main`
- **Target**: Netlify, auto-deploys on every push to `main`
- **Build**: `npm run build` → `dist/` directory
- **Cache**: `deck.html` and `index.html` are `Cache-Control: no-store`. Hashed assets are `max-age=31536000, immutable`. See `netlify.toml`.

```bash
npm run dev          # local dev server
npm run build        # vite build → dist/
npm run lint         # eslint
```

---

## Test credentials

- **Investor briefing test**: token `lasha-b6y8z7`, password `LashaK` (Lasha Khoshtaria's invite — created during initial setup)
- **Admin login**: see `supabase/functions/admin-login/index.ts` for the password env var name; the actual password is configured in the Supabase dashboard

---

## ZERO TOLERANCE rules

1. **Do not put deck content into `assets/` paths** — use `/deck-assets/`.
2. **Do not change the `deck.html` auth guard redirect target** — must be `/briefing`.
3. **Do not undo the mobile Reveal bypass** (point 3 in deck rules above).
4. **Do not stack founder-card photos above text on mobile** — keep them side-by-side.
5. **Do not bring back the `.founder-badge` on mobile** — it overlaps the name.
6. **Do not commit `.env`** — `.gitignore` already excludes it; double-check before `git add`.
7. **Do not bypass the password gate** — even for testing. Use `LashaK` on the real flow or create a temporary test invite.

---

## History (so you don't repeat solved problems)

- **Mobile passes 1-2 (abandoned)**: Tried `disableLayout: true` in Reveal init. Caused slide bleed-through. Don't go back to that approach.
- **Mobile pass 3**: Reveal-bypass via CSS `position: absolute + transform: translate3d`. Made slides scrollable. Locked-in.
- **Mobile pass 4**: Fixed CSS conflict where second `.founder-photo` block overrode the first (240px vs 140px). Both blocks now consistent at 120px / 88px.
- **Mobile pass 5**: Nav arrows moved from glassmorphism side bars to bottom-corner chevrons. Funds-bar stacks vertically.
- **Mobile pass 6**: Photo size 140 → 120, added `object-position: center 30%`.
- **Mobile pass 7**: Reverted the founder-card column stacking — kept photos side-by-side per user's preference.
- **Mobile pass 8**: Hid `.founder-badge` on mobile to fix name overlap.
- **Password feature (just shipped)**: Password column added, backfilled, edge functions deployed, admin UI wired.

---

## When you're stuck

1. The user prefers concise updates and direct fixes over long planning preambles.
2. If you're about to change the deck and you're not sure how a section renders, run the local dev server first and walk through it before editing.
3. Always sync the standalone Reveal scaling at desktop AND mobile after a deck edit.
4. If a CSS rule "isn't applying", check for a duplicate selector LATER in the file — that's the most common gotcha in `deck.html`.

# v4 · Site essentials: done (2026-11-13)

Founder's ask: "Remove MediMind Expert. And make sure privacy policy, SEO and everything else that landing page needs is properly configured."

## Audit and what changed

| Item | Before | What I did | Commit |
|---|---|---|---|
| MediMind Expert in my files | `public/_redirects` proxies `/expert` and `/expert/*` to `medimind-expert.netlify.app`. Nothing in `index.html`, sitemap, robots, manifest. | Reported, not deleted (brief: report redirects). See "Needs the founder" below. | none |
| Title + description | Title "MediMind · The AI-native hospital operating system"; description had no 25-hospital fact | Title "MediMind · The hospital that thinks ahead."; description: AI-native hospital operating system, FHIR R4, running a 25-hospital network, doctors decide. No "signed", no lab/imaging, no old line | f548ce5 |
| Open Graph / Twitter | Present, absolute URLs, but image `og-image.png` / `twitter-card.png` showed the old line | Both point to the new `https://medimind.md/og-medimind.png`, with type, size and alt; descriptions updated | f548ce5 |
| Share image | Old line on it | New `public/og-medimind.png`, 1200x630: ink ground `#030913`, the real header lockup captured from the running page in dark theme (not redrawn), "The hospital that thinks ahead." in Fraunces, "The AI-native hospital operating system". Old images left in place, unreferenced | f548ce5 |
| JSON-LD | `Organization` only | `@graph` with `Organization`, `WebSite`, minimal `SoftwareApplication`; email `team@medimind.md`; no ratings, prices, address, social profiles | f548ce5 |
| `lang`, viewport, canonical, theme-color, preload | All present and correct; Inter preload is really used | Kept; added `robots: index, follow` | f548ce5 |
| robots.txt | Missing | Added: allow all; disallow `/admin`, `/briefing`, `/walkthrough`, `/founder-demo`, `/media/`, `/share/`, `/signin`, `/signup`; sitemap line. Decks are deliberately not listed (they already send `X-Robots-Tag: noindex`; listing them would advertise their names) | f95f0ea |
| sitemap.xml | Missing | Added `/`, `/request-demo`, `/privacy` | f95f0ea |
| SPA fallback | Present (`/* /index.html 200` in `_redirects`) | Kept; noted in `netlify.toml` header comment | c171394 |
| Security headers | None site-wide | `/*`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Content-Security-Policy: frame-ancestors 'self'` (decks frame `/walkthrough`, same origin), `Permissions-Policy` (camera, mic, geolocation, payment, usb, topics off). No full CSP: script/connect rules for Supabase, fonts and the decks' inline scripts not verified | c171394 |
| Caching | `/assets/*` immutable already | `/landing/*` 30 days + stale-while-revalidate (file names are not content-hashed, so one-year immutable would keep a replaced image stale); share image 1 week | c171394 |
| Favicon / icons | Present, referenced, current simplified mark (matches `MediMindLogo` icon variant) | Kept | none |
| Web manifest | `manifest.webmanifest` exists and is linked; said "AI-Native Hospital OS", old colours | Description "The AI-native hospital operating system", colours `#030913`. Kept the existing file name (no `site.webmanifest` duplicate) | 4e7692b |
| Privacy page | Draft with blanks and a "Draft for lawyer review" box | New content file `src/content/privacy.ts`, rendered by `PrivacyNotice.tsx`: controller LLC Medimind (ID 405783095, NAPR Georgia), fields collected, hashed IP, purpose, legal basis, storage (Supabase Frankfurt), who sees it, rights incl. Personal Data Protection Service of Georgia, cookies (none; theme choice in local storage only), changes. Unverified items are visible `[CONFIRM: …]` marks | 52f4f0a |
| Not-found page | Unknown URL = blank page under header/footer (no `*` route) | `src/components/Legal/NotFound.tsx` + one `path="*"` route: "This page does not exist." with a link home; sets title and a `noindex` meta. Checked light and dark | 9e45930 |
| Old email / mixed domains | No `updevoteai` anywhere in my files; all absolute URLs use `https://medimind.md` | none needed | none |

Facts used and where they came from: the legal entity is from the founder's Brain note `01 - Projects/MediMind/Legal Entity.md` (NAPR extract B25088460). Supabase region: the site points at project `kvsqtolsjggpyvdtdpss` (`.env`, `src/lib/crmApi.ts`), and team memory records that project's pooler as `aws-0-eu-central-1` (Frankfurt). Netlify's own env vars were not checked. "No analytics": `src/lib/tracking.ts` `trackLanding` is a no-op, there are no third-party scripts, fonts are self-hosted.

## [CONFIRM] items on /privacy (founder answers in one message)

1. **Registered address to publish.** The NAPR extract lists Tbilisi, Vake, Otar Chkheidze St 12, Apt 14. If that is a home, publish only "Tbilisi, Georgia" or an office address.
2. **Retention period** for form requests (suggested: until deletion is asked for, or 24 months after last contact, whichever comes first).
3. **Reply time** for privacy requests (suggested: 30 days).
4. **Resend sending region** (the form now emails the team and the visitor through Resend, commit 5928144; region not in the repo).
5. (Not marked, but a lawyer should check it) the legal-basis wording: "steps you asked for" + legitimate interest for abuse limiting.

## Needs the founder or another lane

- **`/expert` proxy in `public/_redirects`** (lines 18-19, to `medimind-expert.netlify.app`). To remove MediMind Expert completely, delete those two lines. Also lines 20-21 proxy `/central` to a placeholder host `your-medimind-central-domain.netlify.app`, which is broken. Both left as they are, waiting for a yes.
- **Footer link** `{ label: 'MediMind Expert', href: 'https://medimind.md/expert' }` in `src/content/landing.trust.ts:265` (footer agent's file, said to be removing it).
- The old `privacy` export in `src/content/landing.trust.ts` (lines 272-314) is no longer used by the page. Its owner can delete it.
- **Form has no link to /privacy.** `ScopingForm.tsx:338` shows only the caption "Your details are used only to arrange the call…". Suggest making it "… Privacy notice" with a link to `/privacy`. (Also that caption says "only to arrange the call" while the deck mode sends the deck; the privacy page covers both.)
- `/signin` and `/signup` routes exist (old auth pages, dark styling). Kept out of the sitemap and disallowed in robots; not deleted.

## Checked

`npx eslint` on `src/App.tsx`, `src/components/Legal/*.tsx`, `src/content/privacy.ts`: clean. `netlify.toml` parses (29 header rules); manifest is valid JSON. Headless screenshots of `http://localhost:5180/privacy` (light) and an unknown URL (light and dark) via the orchestrator's server. While checking, the whole app was briefly blank because of another lane's in-progress edit (`ProductPlate.tsx` missing export `ProductTileView`); it cleared on retry. Not checked: live Netlify headers (needs a deploy).

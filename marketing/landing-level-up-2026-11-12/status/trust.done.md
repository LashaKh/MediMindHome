# Trust lane: done

Commit `49c4c23` on `landing-level-up`.

## Files changed

- `src/content/landing.trust.ts` (new): every string for my sections, word for word from the copy deck (Part 2 §8 to §12, Part 3, Part 5). Primary button label comes from `primaryCta` in `site.ts`.
- `src/components/Landing/ControlSection.tsx`: `#control`, six items in a 3/2/1-column grid with hairline rules.
- `src/components/Landing/FoundersSection.tsx`: `#team`, photo `team-founders` (AVIF/WebP srcset, lazy, width/height), two founders under 4px rules, backers line.
- `src/components/Landing/OfferSection.tsx`: `#offer` (navy), four terms as `Column` (4px top rule), places line only when `showFoundingPlaces`, primary button (`cta_click` location `offer`) and the line under it.
- `src/components/Landing/FaqSection.tsx`: `#faq`, four questions as plain headings and answers. I did not use `FaqItem`: the brief says no accordions and nothing behind a click, so there is nothing to fold.
- `src/components/Landing/ContactSection.tsx`: `#contact`; also exports `ContactContent` (heading, support line, bullets, "No commitment.", form) so `/request-demo` reuses it with an h1.
- `src/components/Demo/ScopingForm.tsx` (new): the form.
- `src/components/Demo/RequestDemo.tsx`: the three-step wizard is replaced by `ContactContent` in a pale section (749 lines down to 13). Old links keep working.
- `src/components/Legal/PrivacyNotice.tsx`: Part 5 as a plain page. "Draft" box at the top, blanks shown as written and highlighted, contact address as a mailto link.
- `src/components/Layout/Footer.tsx`: two lines, links (Privacy via router, Contact `mailto:team@medimind.md`, Innovative Startup status in a new tab, MediMind Expert), copyright. `team@updevoteai.com` is gone. All links are 44px targets.
- `src/lib/tracking.ts`: added `trackLanding` and its types. Existing exports are unchanged.

## How the form works

- Fields and backend names: `firstName`, `lastName`, `companyName`, `jobTitle`, `email`, `phone`, `useCase`, plus the honeypot `website`, which is off-screen with `aria-hidden` and `tabIndex=-1`. The question is a 2-row textarea so the long placeholder wraps on phones instead of being cut off. It sends through the existing `submitDemoRequest`. No backend change.
- Client checks use the copy-deck messages: required fields; the email rule is the same as the server's; phone is checked only when filled; field lengths use the server caps (`DEMO_LIMITS`). Errors are tied with `aria-describedby` (error, then helper) and `aria-invalid`. The summary "Please fix the marked fields." is `role="alert"`. Focus moves to the first invalid field. After a failed attempt, errors update as the visitor types.
- Submit: a ref guard blocks a second send. The button reads "Sending…" with `aria-disabled` and stays focusable, and a polite live region announces it.
- Results: `ok` replaces the form with the call or deck success screen and focuses its heading. "Back to the page" goes to `#hero` on the landing page and to `/` on /request-demo. `invalid` (400), `rate_limited` (429) and `error` (anything else, including network) show the copy-deck message in a focused `role="alert"` box, with team@medimind.md as a mailto link. The fields keep what the visitor typed.
- Deck mode: "Get the hospital deck by email" switches the same form. Phone and the question are hidden, the submit reads "Email me the deck", `useCase` is sent as `[Deck request]`, and focus moves to the mode title. "Book the 30-minute call instead" switches back and focuses First name.
- UTM: when the URL has `utm_source`, `utm_medium` or `utm_campaign`, ` [src: s/m/c]` is appended to `useCase` (each part capped at 40 characters). If that would pass the server's 200-character cap, the tag is dropped so the visitor's words are never cut.

## Verified, and how

- **No request reached the server.** In my own tab I replaced `window.fetch` for URLs containing `demo-request` with a stub that records the body and returns 200, 400, 429 or 500, or throws. Every state below went through the stub.
- **Keyboard only (Tab, typing, Enter):**
  - Empty submit: five errors and the summary, focus on First name.
  - Bad email and bad phone: both messages, focus on email.
  - Valid submit with UTM in the URL: exactly one request even though I pressed Enter twice. The body ended in `"useCase":"Returned claims [src: li/social/nov]"`, with no `phone` key when phone was empty.
  - 429, 400, network throw and 500 each showed the right message. Focus went to the alert and the fields were kept.
  - 200 showed "Thank you, Nino. Your request is in." with focus on it.
  - Deck mode, reached by Tab and Enter: five fields. The body was `"useCase":"[Deck request] [src: google//]"`. The deck success screen showed.
- **Layout:** 1440×900, 768×1024 and 375×812, light and dark. I took screenshots of control, team, offer, FAQ, contact (empty, errors, server alert, success), footer, `/request-demo` and `/privacy`. `scrollWidth == innerWidth` at all three widths. One h1 on `/request-demo` and on `/privacy`. No console errors.
- **Contrast (WCAG, computed in the page and with node):** every text and border pair I use passes AA in both themes. Lowest pairs: link on tint 4.65; muted on tint 5.10; error red on white 5.47 (dark #fc8181: 7.41); input border 5.95 light, 8.19 dark (3:1 needed).
- **Checks:** `npx eslint` on all 11 files: clean. `tsc -p tsconfig.app.json`: no errors in my files.

## Tracking finding: the backend cannot record these events today

`supabase/functions/track-event/index.ts` (`handleTrackEvent`) needs `token` and `event_type`. It looks the token up in `investor_invites` and must find it `active`; otherwise it answers 204 and stores nothing. It writes only to `investor_events`, which is keyed to investor tokens. Anonymous landing visitors have no token, so nothing would be recorded. Making it work by inserting a fake invite row would be a database change and would mix site traffic into investor analytics.

So `trackLanding(event, props)` is a **safe no-op**. It does a `console.debug` in dev only, never throws and never blocks. It is already called for `cta_click` (offer), `form_start`, `form_submit_success`, `form_submit_error` (with `reason`: invalid, rate_limited or network) and `deck_request_success`, with `location` set to `final` or `request-demo`.

Backend change needed to turn it on (orchestrator or founder; `supabase/**` is off-limits to me):
1. A new table `landing_events (id, created_at, event_type text, props jsonb, path text, ip_hash text, user_agent text)`, with a CHECK or allow-list on `event_type` for the five ids.
2. A new route `landing-event` in `LANDING_ROUTES` / `handleLandingApi`. No token. It validates `event_type` against the allow-list and caps `props` size, hashes the IP with the existing `hashIp`, rate-limits per IP hash like `handleDemoRequest`, and always answers 204.
3. Then `trackLanding` POSTs `{event_type, props, path}` to `track-event?route=landing-event` with `keepalive: true` in a try/catch. This is a three-line change in `src/lib/tracking.ts`.
4. Update the privacy notice's "Analytics" paragraph before launch if this goes live.

## Requests for other lanes

- **Top lane (header, hero, sticky bar):** add `onClick={() => trackLanding('cta_click', { location: 'header' })}` to the header button, `'hero'` to the hero button and `'sticky'` to the sticky-bar button (`import { trackLanding } from '../../lib/tracking'`). The header nav still says "Safety" and points at the old ids; the copy deck maps Safety to `#control`. The "Back to the page" link on the success screen targets `#hero`, so keep that id.
- **Foundation / orchestrator:** `Reveal` items sometimes look half-faded in instant-jump screenshots. That is timing only and not a bug I saw while scrolling normally. `FaqItem` is now unused by the FAQ (I left the primitive alone).

## Not done / gaps for the copy lane or the founder

- **Deck mode has no privacy line.** The copy deck's promise says "used only to arrange the call", which is wrong for a deck request, so I show neither it nor the "what happens next" line in deck mode. Copy needed, for example a deck variant of the promise.
- **The server 400 cannot name the bad fields** (`submitDemoRequest` returns only `"invalid"`). The copy says "Check the marked fields", but in practice no field is marked after a 400, because the client checks already catch everything the server checks.
- **Form error text and borders use `mm-alert` red.** The brief says red is for the loss number only; I treated form errors as the standard exception, and the text says what is wrong, so colour is not the only signal.
- The privacy notice blanks (legal entity, data region, retention, response days, date) are still open and on the go-live checklist.

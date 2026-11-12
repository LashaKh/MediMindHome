# copy lane: done

Date: 2026-11-12. Commit: `8a9b0e1` (deck). Files owned and changed: `marketing/landing-level-up-2026-11-12/06-copy-deck.md`, this file. Nothing else touched.

## What I delivered
`06-copy-deck.md`, final words for build:
1. Ten different hero sets, scored on Clarity, Credibility and Desire; top 3 kept; winner named.
2. All twelve sections in the master brief's order, each with its job, eyebrow, headline, support, body, labels, buttons, captions, alt text and footnotes. Text levels marked [L1] [L2] [L3]; accent phrase in `{braces}`; `showCustomerName` versions side by side.
3. Microcopy: nav (5), buttons, sticky phone bar, form labels, placeholders, helper text, every validation and server error, both success screens, privacy promise, "what happens next", footer, tracking ids.
4. Metadata (title 51 chars, description 153 chars, share title and description), all with "operating system".
5. `/privacy` notice, marked draft for lawyer review, with blanks for entity, region, retention.
6. Facts table F1 to F40 with source and status, plus the list of facts left out.
7. Self-grade: Justina's 30 lines and the 25-line mentor checklist.

## Winning hero (ships)
- Pre-headline: For owners and CEOs of private hospitals in Georgia
- Headline: Get paid for the care your hospital gives.
- Sub: Your whole hospital works from one record, from admission to invoice, with a 90-day plan to go live while your current system keeps running.
- Benefits: Claims backed by a complete record before they go out. · Stock, invoices and bank receipts that agree. · Each fact typed once, then used by every department.
- Button: Get my 90-day plan · 30 min
- Alternates: "On a thin margin, every returned claim hurts." · "Run your hospital on real numbers, not estimates."

## Lines that are not Pass
- Justina 9 (buyers' own words): cannot pass. No buyer interviews exist yet.
- Justina 30 (tracking and UTMs): build item. Event ids are in Part 3.
- Mentor 7 (2 a.m. case first, then number, then replay): fails by design. The master brief places the case late and forbids the replay claim, and no outside number may be published.
- Mentor 10 (numbers confirmed by Irakli): open until he confirms Part 6 in writing.
- Mentor 21 (lead source tag): copy passes; tag needs decision 5.
- Mentor 22: not a copy item (foundation lane).

## Decisions for the orchestrator (detail in deck Part 8)
1. Hero image: keep the bed board, or capture a clean billing screen to match the money headline (current `revenue-cycle.png` shows "Target: 0.95%" and a real insurer name).
2. Practice case: Lasha must confirm the facts; proposed flag `showPracticeCase`, default `false`.
3. Warehouse image: none exists; capture one, or redraw v6 A1 as "Illustration · sample data".
4. Approve the measures examples in the plan (returned claims, unmatched stock, late bills), or cut back.
5. Lead source: append hidden `[src: <utm_source>]` to `useCase`, or skip.
6. Confirm "Two founding-partner places open" is still true (`showFoundingPlaces` default `true`).
7. Confirm the offline and own-server safety lines before launch.
8. If the call is not recorded, the founders may approve the line "The call is not recorded."
9. Privacy notice blanks for the lawyer and founder.

## For the other lanes
- Every button reads "Get my 90-day plan · 30 min" (sticky bar: "Get my plan").
- The form keeps the backend names `firstName`, `lastName`, `companyName`, `jobTitle`, `email`, `phone`, `useCase`, honeypot `website`. Deck mode sends `useCase` as `[Deck request]`.
- The 429 message says "today", because the server window is 24 hours.

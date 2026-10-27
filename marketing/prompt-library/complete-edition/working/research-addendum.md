# Orchestrator research addendum

Checked 22 September 2026. Use alongside writer-brief.md.

## Verified source-code finding: demo conversion

`/Users/toko/Desktop/MediMind Landing Page/src/App.tsx` defines `/request-demo`. In `src/components/Demo/RequestDemo.tsx`, current headline is “See MediMind on your hospital’s workflows”. Subheadline is “30 minutes. One login, one chart, one patient — live. We’ll tailor the walkthrough to your hospital.” This edition recommends 25 minutes as a deliberate proposed change, not a description of the current page.

The source form has three steps and nine mandatory inputs: first name, last name, email, company name, company size, industry, job title, facility type, number of providers. Its `handleSubmit` function (lines 164–176 at inspection) waits two seconds, logs form data to the browser console and sets a success state. It contains no backend persistence/network submission. The resulting text says the team received the request and will contact them within 24 hours. This is a source inspection, not a test of deployed behavior or proof that any real lead was lost. Before campaigns: verify deployed version, implement confirmed receipt, record ownership/next action, test success and failure paths, then track conversions only on actual accepted submissions. No website code was edited here.

The repo's investor tracking is separate from customer-funnel analytics. Presence of an investor dashboard does not establish GA4/CRM/campaign tracking.

## Source-code snapshot: current homepage hero

Read-only inspection of `src/components/Landing/LampHeroSection.tsx` found the headline “Your hospital deserves a future. Your patients deserve better today.” The primary button says “Build my hospital’s future” and routes to `/request-demo`; the secondary button says “See the path” and scrolls to the path section. Supporting source copy offers matched current software pricing for early hospital partners, included future development, new features ready to test in three business days, and a parallel test in two weeks. This edition supplies proposed replacement copy and readiness conditions, not a deployed change. Source files themselves are not distributed in this marketing package; these notes and the saved hero snapshot capture the inspected facts.

## Fresh public verification

- Geostat release dated 29 July 2026: https://www.geostat.ge/en/single-news/3809/indicators-of-health-care-2025 . Downloaded and read official PDF physical p2: https://geostat.ge/media/81668/INDICATORS-OF-HEALTH-CARE---2025.pdf . **232 hospitals, 15.2 thousand beds in 2025**. Facilities are not deduplicated buying organizations or active demand. Paraphrase only; no need repeat quotations.
- Medplum case study: https://www.medplum.com/blog/medimind-case-study , 6 August 2026, authored by Lasha Khoshtaria. It describes a 25-hospital network under contract, initial capabilities in production and planned network-wide go-live. Founder-authored public evidence; no independent customer endorsement. Avoid importing scale or outcomes as currently audited facts. Limit dependence/quotation: most product information also available in user-owned positioning notes.
- Google Analytics official setup: https://support.google.com/analytics/answer/9304153?hl=en . Account/property/web stream/tag and verify actual receipt. Editorial implementation should tailor to React route changes and accepted conversions, not fire on every button click.
- Current GA4 manual campaign parameters: https://support.google.com/analytics/answer/10917952?hl=en . Use this GA4 page rather than the deprecated UA guide `1033863`.
- Google Analytics PII restriction: https://support.google.com/analytics/answer/6366371?hl=en . No names, email addresses or sensitive free-text in events/URLs/UTMs. Do not install marketing session recording in clinical systems, staff/investor private portals or patient-data pages. Use clean public marketing events.

## Presentation completeness

The library describes itself as 16 sequential prompts but splitting Part 2 Prompt 3 into 3A and 3B yields **17 distinct outputs**, plus **3 Library #0 outputs**, total **20**. Existing `part-1/01-business-and-market.html` covered only the first prompt. There was no HTML truncation: later prompts had not been executed.

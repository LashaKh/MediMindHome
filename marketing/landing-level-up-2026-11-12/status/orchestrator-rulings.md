# Orchestrator rulings for the build lanes (live file: re-read it before you finish)

Updated 2026-11-12. If this file and another note disagree, this file wins.

## Images (ids from `public/landing/manifest.json`)

| Place | Image id | Note |
|---|---|---|
| Hero | `hero-bed-board` | Provisional. May change to a fresh capture; build the hero so the image id is one constant in the content file. |
| What changes (`#system`) | `os-modules` | Use `os-modules-full` instead if it appears in the manifest. |
| Example A, billing | `billing-claims` if it appears in the manifest; otherwise `billing-funding` | If `billing-funding`: caption "State and municipal funding requests · demo data" and matching alt text from `07-asset-manifest.md`. |
| Example B, warehouse | `warehouse-stock` if it appears in the manifest | If it does not exist when you finish, build Example B as a text-only block with no picture. Never draw a fake screen. |
| AI today | `ai-chat-answer` | Caption must say the clinician asked for a brief summary of the patient's condition. |
| Team | `team-founders` | |
| Customer logo | `customer-logo-dark` / `customer-logo-white` | Only when `showCustomerName` is true. |
| Not used | `imaging-viewer` | Held until the founders confirm the scan may be shown. |

Fresh captures are being added by another agent while you build (ids such as `warehouse-stock`, `billing-claims`, `management-overview`, `os-modules-full`, `lab-queue`). Check the manifest again before you finish.

## Flags (in `src/content/site.ts`, owned by the orchestrator)

`showCustomerName` (false), `showFoundingPlaces` (true), `showPracticeCase` (true), `contactEmail`, `primaryCta` (label "Get my 90-day plan · 30 min", `#contact`). Read them; do not edit that file.

## Section ids

Use the ids from `foundation.done.md`. The copy deck's `#solution` is `#system`, `#plan` is `#switch`, `#safety` is `#control`.

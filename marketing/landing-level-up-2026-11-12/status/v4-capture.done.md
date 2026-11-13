# v4-capture: done (2026-11-13)

Real product captures for round 4 (ruling 4). Details and process in `07-asset-manifest.md`, section "Round 4 captures 2026-11-13".

## Added to `public/landing/` and `manifest.json` (each AVIF + WebP at 800 / 1400 / 2000 px plus a 1400 px JPEG; brain-proof tops out at 1356 px)
- `brain-control-center`: Control Center overview (Running, Stop, tabs, 11 decisions waiting, morning brief tiles).
- `brain-workers`: three worker cards with the six-step level dial at Prepares, capped at level 2.
- `brain-proof`: map of jobs the brain covers, with covering worker, department and level.
- `brain-money`: money panel (missing charges, would-be-returned claims, open payment lines, appealable denials). Extra candidate.
- `brain-control-center-dark`, `brain-workers-dark`, `brain-proof-dark`, `brain-money-dark`: dark twins.
- `os-modules-full-dark`, `billing-revenue-dark`, `warehouse-stock-dark`: dark twins of existing light screens, same framing.

## Skipped
- `brain-inbox`: card titles carry real branch names; card detail shows "The brief could not load".
- `brain-morning-brief`: already inside `brain-control-center`.
- Dark twins of `hero-bed-board`, `patient-chart`, `lab-orders`, `billing-funding`, `ai-chat-answer`: originals are older deck shots (previous UI, specific patients); the current bed board shows a real branch name on every card. Tone the frame instead.

## Notes
- Branch names inside brain screens are masked with the background colour (worker branch box, money branch cell, proof column header). Nothing else edited.
- Nothing created, approved or changed in the product. No package added. No build or tests run.
- The dev server I started for the brain worktree (port 3011) is stopped. Port 3000 was not touched. Raw captures stay in my scratch folder.

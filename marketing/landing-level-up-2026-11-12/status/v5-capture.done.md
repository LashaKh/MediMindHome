# v5-capture: done (2026-11-13)

Light/dark English-only pairs for round 5. Details in `07-asset-manifest.md`, section "Round 5 captures 2026-11-13".

## Added or replaced (each id + `-dark`)
- `bed-board-grid`: ward bed grid, 75% occupancy, coloured bed states. DOM text replacement.
- `medication-timeline`: ward medication board (overdue and due-now doses). DOM text replacement. It replaces the empty 24 h grid.
- `patient-overview`: synthetic demo patient overview (visit summary, allergies, reason, flagged vitals). Already English.
- `brain-control-center` (replaced, fuller), `brain-morning-brief`, `brain-inbox`, `brain-workers` (re-shot), `brain-proof` (re-shot, full width). Branch names replaced in the DOM.

## Skipped
- `revenue-kpis`, `lab-board`: test data too sparse or contradictory.
- `clinical-record`: no patient with meds, a high-alert drug or an interaction alert.
- `brain-patient-recommendations`: the panel is not mounted anywhere in the product.
- `scene-*`: nothing passed the homepage test (sparse, `[TEST]` labels, error banners).
- Not re-shot, still Georgian: `warehouse-stock`(-dark) and the old deck shots.

## Notes
- DOM text replacement happened only in the headless page. Nothing was saved, and no extra request was sent.
- Nothing was created or changed in the product. No package was added and no build was run.
- The port 3011 dev server (brain worktree) is stopped. Port 3000 was not restarted.

## Honest ranking (most beautiful first)
1. `brain-control-center`: dense and structured, with red signals; strongest in dark.
2. `bed-board-grid`: the most colourful screen, and it reads at a glance.
3. `brain-proof`: a full, orderly table. Calm rather than striking.
Then `medication-timeline`, `brain-workers`, `brain-inbox`, `brain-morning-brief` and `patient-overview`. The last is the weakest: it has white space and stale vitals.

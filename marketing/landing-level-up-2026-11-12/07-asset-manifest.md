# 07 · Asset manifest: real product images for the landing page

Date: 2026-11-12. Lane: assets. Files: `public/landing/` (59 files) and `public/landing/manifest.json`.

I opened every image in `public/deck-assets/v6/` and `public/deck-assets/screenshots/` (6 + 16 files) and checked each one for private data. Every screenshot shows demo data from the MediMind development system, but the demo patients carry real-looking Georgian names, 11-digit personal IDs, birth dates and phone numbers. Some of those names belong to people we know (the founder's own name appears as a patient). So every screenshot is cropped. Where a clean crop was not possible, I rejected the image.

## How to use

- `public/landing/manifest.json` has one entry per image in the frame component's `ResponsiveImage` shape: `alt`, `width`, `height` (intrinsic size of the largest file), `aspectRatio`, `fallback` (one JPEG or PNG URL), `avif` and `webp` (full `srcset` strings), `sizes`, plus a `files` list with each file's width, height and bytes.
- Screenshots come at 800, 1400 and 2000 px wide in AVIF and WebP, plus one JPEG fallback at 1400 px. The founders photo comes at 800 and 900 px (900 is its source width). The logos stay at their source size, 378 px.
- Label every screenshot "demo data" on the page, as the master brief says.
- Above the fold, use the hero with `loading="eager"` and `fetchpriority="high"`. Lazy-load everything else.

## Ready images

| id | Source | What it shows | Section | Cropped, and why | Bytes before → after (all files) | Remaining concern |
|---|---|---|---|---|---|---|
| `hero-bed-board` | `screenshots/bed-board.png` | The emergency department bed board: 6 rooms, 20 beds, 11 free, 45% occupancy, and each bed marked occupied or available, under the full top menu of the system. | Hero (whole system at a glance) | Bottom cut at y=1135 to drop two patient names and personal IDs shown under the occupied beds. Bed cards are cut just below their status pill. | 1,279,546 → 282,963 (2000w AVIF 32 KB) | Department and room names are in Georgian; the rest is English. The header reads "Healthy Core / 20 Beds" (our demo organisation, not a customer). "System Admin" in the corner is a role label, not a person. |
| `os-modules` | `v6/module-dashboard.png` | The admin dashboard: one sidebar with every hospital area (staff, clinic operations, clinical settings, nomenclature, financial, warehouse, command center, analytics, system config) and module cards. | What changes: "One operating system" | Bottom cut at y=1227 to remove the `admin@medimind.ge` account and "54 Modules" counter; top 72 px of blue browser band removed. | 725,187 → 219,418 | Right edge cuts a third card mid-word ("Op…"), as in the deck. A hover tooltip "Positions & Types" is visible. Fine inside a browser frame; a fresh capture would be cleaner. |
| `billing-funding` | `screenshots/coordinator.png` | The funding request pathway: pick a state (SSA/NHA) or municipal co-funding request, then the financier (Tbilisi City Hall, Solidarity Fund, district office). | Example: billing (closest honest substitute, see gaps) | Top cut at y=660 to remove the patient banner (name, personal ID, birth date, phone) and the "BOT ON" badge. | 763,211 → 149,547 | Financier names are in Georgian. It shows the paperwork for state money, not a claims or revenue screen; caption it as "state and municipal funding requests" rather than "billing dashboard". Its sub-lines use an em dash (English text, so allowed). |
| `lab-orders` | `screenshots/cpoe.png` | One visit's order history: three lab orders (creatinine in blood and urine, full blood count) and one CT imaging order, each "Ordered · Pending". | Lab (closest honest substitute, see gaps) | Top cut at y=135 to remove the patient name and age in the chart header. | 422,266 → 163,136 | This is the doctor's order list, not the lab's own queue. Test names are bilingual (code plus Georgian). |
| `imaging-viewer` | `screenshots/dicom.png` | The built-in imaging viewer with a coronary angiogram, cardiology tools, workflow buttons and six series. | Imaging | Top cut at y=432 to remove the viewer overlay with the patient name and study date, plus the top menu and study bar; right edge trimmed to x=2612 to drop a clipped label. | 1,381,687 → 189,825 | The angiogram pixels come from a real study loaded into the demo system. Nothing in the crop identifies a person, but confirm with Lasha that this study may be shown publicly. |
| `patient-chart` | `screenshots/patient-360.png` | One patient's clinical dashboard: fall-risk and drug-interaction alerts, active problems with ICD-10 codes, medications with a high-alert flag, vitals and lab results. | The patient chart | Top cut at y=392 to remove the patient banner (name, personal ID, birth date) and the top menu. | 1,002,602 → 316,036 | Dense for an owner; best used large or as the second image in a section. The first diagnosis and the lab names are in Georgian. The "Fall risk" line contains an em dash (English text). |
| `ai-chat-answer` | `screenshots/ai-chat.png` | The AI assistant's answer about a demo patient: age group, acute diagnosis (Georgian term with English translation) and chronic conditions, above the "What does your protocol say about…" input. | AI today | Top cut at y=958 to remove the patient chip and the "Patient Summary: <name>" line. That also drops the clinician's question. | 806,316 → 111,329 | Wide strip (5:1). The question ("summarise patient condition briefly") is not in the image, so the caption should say it. The last list row is clipped by the input bar, as in the product. |
| `team-founders` | `v6/founders.png` | Lasha Khoshtaria and Irakli Pkhovelishvili standing side by side. | Team | None. | 899,628 → 169,900 | An EU flag shows in the window behind. Harmless, but it may be read as an endorsement. |
| `customer-logo-dark` | `v6/geo-hospitals-logo.png` | GeoHospitals logo, navy wordmark. | Proof strip, only when `showCustomerName` is true | None. Lossless WebP plus the original PNG. | 10,389 → 13,813 (WebP alone 3,424) | Only 378 px wide, so keep it at 190 px or smaller on screen. No vector source available. |
| `customer-logo-white` | `v6/geo-hospitals-logo-white.png` | GeoHospitals logo, white wordmark for dark sections. | Proof strip on dark, only when `showCustomerName` is true | None. | 6,686 → 9,066 (WebP alone 2,380) | Same size limit. |

Total: 7.3 MB of sources became 1.6 MB across all sizes. A visitor downloads one size per image, typically 10 to 45 KB in AVIF.

## Rejected

| Source | Reason |
|---|---|
| `screenshots/command-center.png` | Not the command center. It shows the admin dashboard with the user menu open: the `admin@medimind.ge` account, "MediMind EMR (HealthyCore)" (forbidden category word) and the internal "Medplum 5.0.2" build line. `os-modules` shows the same screen cleanly. |
| `screenshots/laboratory.png` | Every lab card shows a patient name and order number (names include "რატი ხოშტარია", the same family name as a founder). They cannot be cropped out without losing the cards. Timers read 600+ hours overdue, which looks stale. |
| `screenshots/revenue-cycle.png` | No private data, but the screen is visibly broken: the clean-claim "Target: 0.95%" (should be 95%), a 0.7% net collection rate against a 96% benchmark, and "Top payer Aldagi 38.2%" next to "private: 100%". It also names a real insurer. An owner would read it as a faulty product. |
| `screenshots/mediscribe.png` | The founder's name ("ლაშა ხოშტარია") is used as the demo patient throughout. The transcript box repeats one placeholder paragraph in a loop, so it looks unfinished. |
| `screenshots/moh.png` | About ten patient names in English and Georgian on the cards. Cannot crop. |
| `screenshots/research.png` | Patient names on every screening card, plus a "TestFirst TestLast" record. Cannot crop. |
| `screenshots/nursing.png` | Patient name, and the alerts show raw record IDs ("5c496d75-…"), which looks unfinished. |
| `screenshots/handoff.png` | Patient name, personal ID and birth date in the banner and on the handoff card. A crop leaves only a medication list. |
| `screenshots/mar.png` | Patient name, birth date and personal ID in the row above the grid. A clean crop is possible, but the grid shows doses overdue by "+1042m", which reads badly. Not needed. |
| `screenshots/form-builder.png` | Clean, with no private data, but it is a settings tool with an empty Georgian form. No section needs it. |
| `v6/hospital-vision.png` | An AI-made render, not the product. The brief allows only real product images. It could serve as a labelled "Illustration" behind the vision section, but I did not prepare it. |
| `v6/ai-chat-crop.png` | Superseded by `ai-chat-answer`, which comes from the same screen with a cleaner left edge. |

## Gaps: fresh screenshots needed from the product

Capture these on the demo system in English, at a 1440 px browser window with 2x pixel density. Use demo patients whose names are obviously invented (for example "Demo Patient 01"), signed in with a seat whose name is not a person's. Close menus and tooltips first.

1. **Warehouse or stock (none exists).** The Warehouse module stock screen: item list with quantities, minimum levels and one or two "low stock" flags, ideally with a recent receipt or transfer. Today the only honest substitute is the "Warehouse 10" row in the `os-modules` sidebar, and that is not an example.
2. **Billing, done properly.** The Revenue Cycle dashboard after the "Target: 0.95%" label bug is fixed, with believable demo numbers (net collection rate near the benchmark) and no real insurer name. Better still: the claim list with one claim flagged "missing code" or "returned", which ties to the "fines and returned claims" problem.
3. **Lab queue without names.** The Laboratory queue (Ordered, Received, Processing, Resulted, Verified columns) in the compact or table view, with invented patient names and fresh timers (minutes, not hundreds of hours).
4. **AI scribe.** MediScribe with an invented demo patient and a real, short demo transcript turned into a structured note that a doctor reviews and signs. That shows "AI prepares, people sign" better than the chat does.
5. **Clean module overview.** The module dashboard captured at a width where no card is cut off, with no hover tooltip and the account area scrolled out of view.
6. **Command center (optional).** The real Command Center screen, for the "management without reliable numbers" problem: occupancy, admissions, discharges and open tasks for the day.

## Process

Crops and resizing with ffmpeg (Lanczos), WebP with `cwebp -q 80 -m 6 -sharp_yuv`, AVIF with ffmpeg `libaom-av1` (`-still-picture 1 -crf 30`, 4:4:4 chroma so coloured text stays sharp). I checked the decoded 800 px and 1400 px AVIF files by eye: text is crisp. All scripts ran from the scratch folder. No npm package was added and nothing in `public/deck-assets/` changed.

## Fresh captures 2026-11-12

Captured from the development system (test data) with headless Chromium at 1440 px wide, 2x pixel density, UI in English, signed in with the owner test seat. Nothing was saved, ordered or changed in the product; only pages were opened and list filters clicked. Same crop and encode process as above (ffmpeg Lanczos, `cwebp -q 80 -m 6 -sharp_yuv`, AVIF `libaom-av1 -still-picture 1 -crf 30` 4:4:4), sizes 800 / 1400 / 2000 px plus a 1400 px JPEG fallback. Every crop removes the top bar, which carries the selected branch (a Georgian hospital name), the "System Admin" seat and the module menu. I opened every final file by eye.

| id | Route captured | What it shows | Suggested alt text | Section | Cropped | Concern |
|---|---|---|---|---|---|---|
| `warehouse-stock` | `/emr/dashboard/warehouse/stock?stockStatus=low-stock` (branch picked in the header) | The warehouse stock list filtered to low stock: 73 items, quantities with low counts in red, reserved amounts, prices, units, expiry dates with days remaining and batch series, beside the warehouse menu (receiving, movements, returns, procurement, stock). | MediMind warehouse stock list filtered to low stock: item codes, quantities with low counts in red, prices, units, expiry dates with days remaining and batch series. Demo data. | Example: warehouse | Top 184 px (header with branch name and seat, module menu) and the bottom below the eighth row (cut row and the "Pinned open" footer). | Item names are in Georgian. The Type column reads "Unknown" for most rows (imported items lack a group). Two rows show a price of 0.00. The first rows have no expiry ("-"). |
| `billing-revenue` | `/emr/billing/revenue` | The money trail for one month as four figures: charges 16,650 GEL, invoiced to payers 12,424 GEL, collections 1,240 GEL, outstanding 15,410 GEL. | MediMind revenue report for one month: charges, amounts invoiced to payers, collections received and the outstanding balance, each in lari. Demo data. | Example: billing | Only the four-figure band is kept. Removed: the branch name line, the filters, a red "Some source data is unavailable" warning that sits directly above, the summary line (collection rate 7.45%, which reads badly) and the case tables. | Very wide strip (about 10.6 : 1, 2000 x 188); use it full width or under a caption. It is not a claims list. The claims and invoice lists show patient names (invoice recipients, case rows named after test patients), so they could not be cropped clean. |
| `os-modules-full` | `/emr/dashboard` (viewport 1440 x 1100) | The admin dashboard with the full category sidebar and module counts, plus the Staff management and Clinic operations cards, with no card cut off and no tooltip. Replaces `os-modules`. | MediMind dashboard with every hospital area in one sidebar (staff, clinic operations, clinical settings, nomenclature, financial, warehouse, command center, analytics, system configuration) and module cards. Demo data. | What changes: "One operating system" | Top 184 px (header and module menu) and everything below the Printers row, which removes the `admin@medimind.ge` account box, the module counter and the feedback button. | Shows only two of nine categories as cards; the sidebar carries the full list. |

**Skipped**
- **Management overview (command center or analytics).** The test data makes it look broken: the hub shows 11% occupancy with "0 min" turnaround, 0 discharges, 0 transfers and "No staffing data, ratio 1:0.0"; the census page shows a 1188-hour "CRITICAL" turnaround and 30 alerts timed in hundreds of hours, and its 10 occupied + 58 free beds do not add up to the 91 total; the capacity heatmap says "No departments found"; discharge readiness is empty; department analytics never finished loading. Needs seeded census data before a capture.
- **Laboratory queue.** The queue was empty for the selected branch and dates ("No matching orders"), the header showed "3 critical alerts, oldest 723h" and "Preferences not synced". Clearing filters did not load orders, and a second attempt timed out under heavy machine load. The queue cards also carry patient names. Keep `lab-orders` for now.

## Round 4 captures 2026-11-13 (brain screens and dark theme)

Same recipe as above: headless Chromium, 1440 px wide, 2x, English UI, owner test seat on the development system (test data); ffmpeg/Pillow Lanczos resize, `cwebp -q 80 -m 6 -sharp_yuv`, AVIF `libaom-av1 -still-picture 1 -crf 30` 4:4:4; 800 / 1400 / 2000 px plus a 1400 px JPEG. Every crop removes the top bar (branch, seat, module menu). Nothing was saved, approved or changed: only pages, tabs, the task-type filter and the header branch filter were used. The brain screens come from the `brain-stage-1` worktree (a separate dev server on port 3011, now stopped) and carry the "In development" status on the page.

**Branch names masked.** The brain screens print the demo branch name (a real hospital name in the test data) inside a few cells. Those few words are painted over with the surrounding background colour: the branch box on each worker card, the branch cell of the money table and the branch column header of the proof table. Nothing else is altered.

| id | Route | What it shows | Section | Notes |
|---|---|---|---|---|
| `brain-control-center` | `/emr/dashboard/control-center` | Control Center header (Running, Stop switch, workers 16 of 16), the Overview / Workers / Rules / Proof / Log tabs, "Needs a decision 11" band and the morning brief tiles (stays open 98, ended yesterday 30, worker outputs 1). Keeps the Command Center sidebar. | brain | Best hero for the Brain section. The morning brief lives here, so there is no separate `brain-morning-brief`. |
| `brain-workers` | `…?tab=workers` | Three worker cards (coverage checker, bed and move watcher, theatre watcher): status, what each may do, tags, and the six-step level dial (Watching … Owns it) set at Prepares, capped at level 2. | brain | Branch box masked (shows empty). |
| `brain-proof` | `…?tab=proof` | Map of administrative jobs: action type, tags, covering worker, department and the current level per job. | brain | Narrow table crop: largest file is 1356 px (2x for ~680 css px), `sizes` set to 680px. The level column header is masked (was a branch name); a second branch column is cut off. |
| `brain-money` | Overview, Money panel | Missing charges 22, would be returned 7, open payment lines 6 (GEL 150.00 difference), appealable denials 11 (GEL 1,160.00). | brain | Wide strip (about 5.9 : 1). Branch cell masked. Extra candidate (not on the original list). |
| `brain-*-dark` (4) | same routes, dark theme | Dark twins of the four above, same boxes and masks. | brain | Captured a few hours later; counts differ slightly (for example 19 workers, 6 decisions) because another session is adding test data. |
| `os-modules-full-dark` | `/emr/dashboard` (1440 x 1100) | Dark twin of `os-modules-full`, same framing. | what changes | Account box cut off as in the light version. |
| `billing-revenue-dark` | `/emr/billing/revenue` | Dark twin of the four-figure money band. | example, billing | Charges and outstanding read 30,398.82 / 29,158.82 GEL (test data changed since the light capture). |
| `warehouse-stock-dark` | `/emr/dashboard/warehouse/stock?stockStatus=low-stock` | Dark twin of the low-stock list, same framing and same 73 items. | example, warehouse | In dark theme low counts are not red. |

**Skipped**
- `brain-inbox`: the staff inbox filtered to Brain shows the prepared cards, but every card title begins with a real branch name (one in Georgian), and opening a card shows "The brief could not load" instead of the Approve / Edit / Reject view. Not usable yet.
- `brain-morning-brief`: already contained in `brain-control-center`; a separate crop added nothing.
- Dark twins of `hero-bed-board`, `patient-chart`, `lab-orders`, `billing-funding`, `ai-chat-answer`: the light originals are older deck screenshots of a previous UI version and of specific demo patients. The current bed board prints a real branch name and address on every department card, and the patient screens would need a new patient choice and new crops, so "same framing" is not possible. Lane C should tone the frame for these in night mode.

## Round 5 captures 2026-11-13 (light/dark pairs, English only)

Same recipe (headless Chromium, 1440 px, 2x, top bar cropped, 800/1400/2000 AVIF+WebP plus JPEG). Every id below exists as a light and a `-dark` pair with identical crop boxes. Nothing was created or changed in the product: only navigation, tabs, the task-type filter and view toggles (Grid/Board) were used. Brain screens come from the `brain-stage-1` worktree on port 3011 (server stopped afterwards).

**English via DOM text replacement (client side only, in the headless page, nothing saved or sent).** The test data is Georgian in many places. Before each shot the visible strings were replaced with plain English: ward and room names ("Cardiology", "Coronary intensive care unit", "Room 101", "Bed 1"), the branch line ("Central hospital / First floor"), drug names translated literally ("Nolpaza 40 mg (pantoprazole) N84 tab", "Fresh frozen plasma", "Fentanyl citrate Kalceks 0.05 mg/ml 2 ml"), every Georgian patient name ("Demo Patient A" … consistent within a frame, identical in light and dark), and the brain branch names ("Central hospital", "North branch"). Numbers, statuses and times are untouched. A check after replacement listed no Georgian left inside the crop.

| id (+ `-dark`) | Size | Route | What it shows | DOM replacement |
|---|---|---|---|---|
| `bed-board-grid` | 2352x1696 | `/emr/medications/mar` → Cardiology → Grid | Ward header (7 rooms, 18 patients, 75% occupancy) and rooms of bed cards: occupied (red), cleaning required, available (green). | yes |
| `medication-timeline` | 2352x2026 | same ward → Board | Ward medication board: overdue doses (red, "20 h late") and due-now doses (blue) with drug, dose, route and time. Replaces the old sparse 24 h grid; no patient-level MAR in the test system has a full day of doses (all show "No active medications" or cancelled marks). | yes |
| `patient-overview` | 2690x1125 | patient card overview of the synthetic "Giorgi Demo-Patient" (identity row cropped) | Visit summary, allergy status, reason for visit, vitals with HR 108 and RR 22 flagged. | no (already English) |
| `brain-control-center` | 2292x1685 | Control Center overview | Data gaps, money and flow panels with red late counts. Replaces the round 4 crop. | branch names |
| `brain-morning-brief` | 2292x895 | Control Center overview | 10 decisions waiting, morning brief tiles. | no |
| `brain-inbox` | 1118x1192 (portrait) | task inbox, type = Brain | Seven prepared worker cards with red "late N". | branch names |
| `brain-workers` | 2340x1441 | Control Center → Workers | Three workers with level dials; branch box now reads "Central hospital" (round 4 used a blank mask). | branch names |
| `brain-proof` | 2298x1646 | Control Center → Proof | Job map with both branch columns of levels; now full width (round 4 was a 1356 px crop). | branch names |

**Skipped, with reasons**
- `revenue-kpis`: the revenue cycle dashboard shows "No financial KPI data", a "--" denial rate and tiny charts; A/R aging contradicts itself (GEL 0.00 tiles over a GEL 314,358 chart); payer mix is empty.
- `lab-board`: the board view is not populated; the list shows ten rows of the same "complete blood count" with TEST barcodes and a "3 critical alerts, oldest 749 h" banner.
- `clinical-record`: no test patient has a populated medication list, a high-alert drug or an interaction alert; the richest English chart is used as `patient-overview` instead.
- `brain-patient-recommendations`: the proactive recommendations panel (`ProactiveCasePanel`) is not mounted in any screen of the main checkout or the brain worktree; "Open MediMind Brain" opens an empty chat.
- `scene-*`: OR board, command center hub, nursing station, analytics and charge board were checked. They are sparse in the test data, full of `[TEST]` labels, or show error states, so none passes the homepage test.
- Still in Georgian from earlier rounds (do not use): `warehouse-stock`(-dark), and the deck shots `hero-bed-board`, `billing-funding`, `lab-orders`, `patient-chart`. `brain-money`(-dark) has a blank branch cell, not Georgian.

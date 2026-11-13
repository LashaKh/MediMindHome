# Lane C, round 5: done

## #product, top to bottom
1. **Imaging display** (`ProductImaging.tsx`, new; frozen after the founder's "leave it"). A near-black monitor in both themes. On the left, one CT scan in 3D crossfades between vessels and bone (1.6 s fade, 5 s hold), with a slow drift and one scan line. The "Vessel" and "Bone" chips switch it by click or keyboard (aria-pressed); clicking stops the auto-cycle. On the right, aortic-root planning in a dark window with the valve-ring view lifted over its corner. Two thin blue callouts: "Aortic root, outlined" and "Valve ring, measured". The caption is "Imaging and planning" plus one line. A little scroll parallax between the layers. Reduced motion: vessels only, still, no sweep, no parallax. Below 1024: the body on top, the chips, the caption, then one planning window.
2. **Record scene** (`ProductPlate.tsx` HeroScene). `patient-overview` (English, with a matched `-dark` capture) sits in front of the hospital-areas dashboard (also matched). Its height is read from the manifest. Callouts: "Allergy status, up front" on the allergy line, and "Abnormal vitals flagged" by the high heart rate, with the words placed in the empty Vital Signs header. The lens and the old drug-interaction callout are gone.
3. **Tiles** (OpsTileView): "Beds · Every bed and its state, live." (`bed-board-grid`) and "Medication · Every dose due on the ward, overdue first." (`medication-timeline`, the new ward medication board, cropped below the ward header). Both are fresh English light/dark pairs. Each tile keeps a 1.8 : 1 window, works out the crop from the capture's real size and an optional focus, and runs off the right edge on purpose. They lift slightly on hover. Two tiles split the row; three would share it.

## Removed
`warehouse-stock`, `lab-orders`, `billing-funding`, `billing-revenue`, the old Georgian `patient-chart`, and `revenue-kpis`. Revenue was never re-shot (the capture agent found the test data too sparse) and the old crop has no night twin. The `brain-patient-recommendations` bridge was built and then removed, because that panel is not mounted in the product (`ProductBridge.tsx` deleted, my own file from this round).

## Night mode
Every screen in #product and #brain now switches to its `-dark` capture, and nothing is dimmed. Light screens without a twin would show at near-full brightness with a cool bloom. Today none remain on the page.

## Brain (changed only because its Control Center capture was replaced)
The new `brain-control-center` is a data panel with no Stop control, so the "One switch stops it" callout would have pointed at "Count now". The scene is now:
- the Control Center data panel,
- Workers over its edge ("Capped by a person", amber),
- the Morning brief across its foot ("Decisions wait for a person", amber, on the decisions-waiting count).

Beneath: Staff inbox and Proof side by side. Money was dropped because it repeats a panel inside the new Control Center. Empty slot frames are switched off, since the founder reviews the dev server. The dial and the words are unchanged.

## Checked
- 1440 and 1728 in day and night; 1024, 768 and 375 for layout.
- No horizontal scroll at 1728, 1440, 1024, 768 or 375.
- Keyboard and aria-pressed on the 3D chips.
- Each theme downloads only its own captures.
- eslint clean on every file I touched. No dashes in my copy.

## Not done / notes
- There are two tiles, not three. Nothing else among the fresh captures was full and English.
- I did not test a real screen reader, forced colours or Safari's mask rendering.

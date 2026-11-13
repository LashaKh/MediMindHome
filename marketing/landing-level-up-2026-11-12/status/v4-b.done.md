# Lane B v4: done

Commits on `landing-level-up`: `1cc77b6` (anatomy), `8bb0878` (belief, forty systems, legend fixes), plus this note.

## The concept: a cross-section of one living body

I dropped the stick figure. "A hospital with a body made of software." is now drawn as one precise cross-section, like a scan through a body or a medical-atlas plate. I picked it over an isometric stack because concentric layers say "one organism" at a glance, still read on a 375 phone, and give every part a natural place:

- **Heart** at the core: the record as concentric rings with a slow beat and a ripple. The FHIR R4 resource names (Patient, Encounter, Observation and others) are engraved around it as micro type.
- **Muscle**: a command ring of 96 actuator ticks with one lit, bracketed opening (the audited door). The ticks light in a slow travelling sequence.
- **Nerve**: eight fibres spiral out from the heart through the muscle to the skin, each with its own bend and fine branches. Blue pulses travel along them at different speeds.
- **Skin**: the hatched outer surface. The eight roles sit on it, with labels set on the curve. People (doctor, nurse, patient, pharmacy, finance, ministry, insurer) are steady amber dots, because a person decides. Devices is a blue ring.
- **Brain**: a reading ring with a bezel around everything and a slow scan sweep across the whole body. Part of the ring is dashed (partly in development).
- Depth comes from a lit dome disc with light from the upper left, a soft shadow in day mode and a blue glow at night. There are several line weights, and blue always means the system.
- **Interaction**: the legend (Heart · Brain · Muscle · Skin · Nerve, with verbs) is always visible and keyboard reachable. Hover, focus or tap, on a name or on the body itself, lights that part, dims the rest, and opens its one line under the name. The "Partly in development" badge stays on the Brain row. Space is reserved so nothing jumps.
- **Layout**: headline and legend on the left; the body large on the right (about 775px at 1728 and 727px at 1440). On a phone: headline, then the body almost edge to edge, then the legend.

## Forty systems and the 2 a.m. chart

- **2 a.m. chart**: the four charts now share one 56px stage and a hairline time axis with ticks, so they read as one night. 02:00 is a monitor trace that draws in. The record has 27 finer entries with three red buried signs. The fourteen hours rise as bars. The twenty days are lighter outlined cells. No words added. The belief type comes down to at most 88px (lane A's scale); markers go 44 to 34px, lines 26 to 22px.
- **Forty systems**: a fading dot-grid field. Each program is its own little window (its own corner radius, a mark, a soft shadow). The patient is ringed, and the broken links have red bars across each break. Joined, they become one lit surface with hairline module seams, and the patient gets a blue halo. No words added.

## Files

- `src/components/Landing/AnatomyOsOrganism.tsx` (new, lane B helper): the body.
- `src/components/Landing/AnatomyOsSection.tsx`: new layout and legend.
- `src/components/Landing/BeliefSection.tsx`, `BeliefSection.css` (lane B styles), `FragmentsField.tsx`.
- `src/content/landing.v2.b.ts`: `figureLabels.roles`, a new figure alt text, and Skin's line is now "One surface for every role."
- `AnatomyOsFigure.tsx` (the old stick figure) is no longer rendered. The file is kept.

## Checked (my own tab, localhost:5180)

- Screenshots at 1440 and 1728 in light and dark; 1024 light; 768 dark; 375 light and dark. Three rounds of fixes came from them:
  1. The scan spun around the wrong centre (`transform-origin` with `view-box`).
  2. The nerves looked like a turbine; the command ring looked like a grey ruler; the door looked like a glitchy box.
  3. The headline jumped when a line opened; the Brain badge overflowed and widened the grid on the phone; the badge floated at 1024. The joined forty-systems block looked like a plain table.
- `scrollWidth == innerWidth` at 1728, 1440, 1024, 768 and 375.
- Contrast script over every HTML text node in #belief, #problem and #system, in both themes: no pair below AA. The SVG role labels are full ink.
- Keyboard: Tab moves through the five legend buttons. The focus ring is visible, and focus lights the part in the body (the other four dim). `aria-expanded` and `aria-pressed` are set.
- `npx eslint` on all touched lane B files: clean.

## Not done / open

- Reduced motion was checked by reading the code, not by emulating it. With reduced motion the body gets `still`: no pulses, sweep, tick chase or ripple, and the heartbeat is off (CSS), but the picture is complete. The belief charts render full. The forty-systems picture shows the static scattered state.
- The SVG micro type (the FHIR names, about 7px at desktop) is decorative and `aria-hidden`. It is not meant to be read.
- At 1728 the headline sets in three balanced lines because the left column is 5/12 wide. That was a deliberate choice; I did not widen it.
- Lane C's ProductSection crashed the page for a few minutes mid-session (their edit). It recovered by itself.

# v2 design language (lane A, 2026-11-12)

A hospital at night, seen from mission control. Ink canvas, light used as meaning. **Blue = the system is working. Amber = a person decides.** The system moves; people are still. Everything else is quiet.

## Tones (`<SectionShell tone>`; same class names as v1)
- `navy` = **the ink canvas** (near-black navy). Dark in BOTH themes: #06101F light theme, #030913 dark theme. Use for hero, belief, brain, ambition, contact. Every `mm-*` token flips to its on-ink value inside it.
- `white` / `pale` = light editorial bands (#FFFFFF / #F2F5F9). In dark theme they become #08111F / #0D1828, so ink sections are always a step deeper than the page.
- Default theme is light. Dark-first sections stay dark in light theme; never hardcode hex, use tokens so both themes stay correct.
- Content edge: `max-w-page` (1248px), shared by header, hero and every SectionShell. Section padding py 80/112/128.

## Palette roles (Tailwind `text-/bg-/border-mm-*`; light → on ink)
| token | light | ink / dark | role |
|---|---|---|---|
| `mm-ink` | #0B1B33 | #F3F6FB | headlines, titles |
| `mm-body` | #3A4A60 | #B6C3D5 | body |
| `mm-muted` | #5B6B80 | #8B9BB3 | labels, captions |
| `mm-voice2` | #66768C | #8796AD | second clause of a headline (`accent` prop); large only |
| `mm-system` / `mm-accent` | #1E6BD0 | #6CB8FF | system working: lines, pulses, icons, big stat |
| `mm-link` | #1A5FBF | #8CC8FF | small blue text, links |
| `mm-system-soft` | #E6EFFB | #0F2340 | fill behind a system mark |
| `mm-human` | #B86A00 | #F5B84A | a person decides: marks, ticks, rules |
| `mm-human-text` | #9A5800 | #F5B84A | small amber text (AA) |
| `mm-human-fill` + `mm-human-fg` | #F5B84A + #1A1204 | same | amber chip with dark text |
| `mm-raised` | #F7F9FC | #0C1A30 | a panel lifted off the surface |
| `mm-line` / `mm-tint` | #E3E8EF / #EAF1FB | #1A2A42 / #0E1C33 | hairlines / quiet fills |
| `mm-alert` | #C42B2F | #FF7A7F | harm or loss only |
All text pairs checked AA (voice2 on pale is large-text only).

## Three type voices
- **Fraunces** (`font-display`, also `font-serif`): the human, editorial voice. Weight 400 (350 for stats), optical sizing on, tight tracking. `mm-display` 44→104px (hero h1 only), `mm-h2` 34→64px, `mm-stat` 56→112px. Never bold, never italic for emphasis.
- **Inter** (`font-sans`): body and interface. `mm-h3` 20/22px 600, `mm-lead` 19/22px, `mm-body` 16/17px, `mm-caption` 14px.
- **IBM Plex Mono** (`font-mono`): the system's voice. `mm-eyebrow` 13/14px 500, sentence case (no caps) with a short blue tick; `mm-data` 13px for timestamps, statuses, prepared steps, numbers in a UI.
- Headlines: one statement, optional quieter second clause via `accent`. No coloured single words. `text-wrap: balance` is on.

## Marking meaning
- System working: `.mm-mark-system` (mono, blue, hollow ring) — "Lab panel drafted". May pulse or travel while working.
- A person decides: `.mm-mark-human` (mono, amber, solid dot) — "Doctor signs". Never animates; it lands and stays.
- Brain shown acting: `.mm-dev-badge` ("In development") next to it, always.
- Red (`mm-alert`) only for harm or loss.

## Buttons, links, focus
- `ButtonLink` primary = solid ink on light, solid white on ink; 10px radius, 48px. Neither blue nor amber (those carry meaning). Secondary = hairline outline. Text = underline that turns system blue on hover.
- Focus: 2px `mm-focus` outline, 3px offset, everywhere.

## Motion
- Transform and opacity only. Ease `cubic-bezier(.2,.7,.2,1)`; UI 180ms, reveals 600ms, ambient loops 10s+ with a pause control.
- One orchestrated moment per section; no fade-up on every card.
- `Reveal`: visible by default; only blocks below the fold are armed. Nothing is ever hidden under reduced motion, without JS, or in print.
- Under `prefers-reduced-motion` show a complete, designed static state.
- Sticky phone bar is ink in both themes.

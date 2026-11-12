# Foundation lane: done

Commit `ff5ffe3` on `landing-level-up`. Page compiles and renders the 13-section skeleton at 1440 and 375, light and dark, no console errors, no horizontal scroll, Inter loaded.

## How to start (builders)

```tsx
import { SectionShell, SectionHeading, Column, StatTile, BrowserFrame, ButtonLink, ProofItem, FaqItem, Reveal } from '../ui';
import { primaryCta, contactEmail, showCustomerName, showFoundingPlaces } from '../../content/site';
import type { ResponsiveImage, CtaLink } from '../../content/types';
```

Fill your placeholder file in `src/components/Landing/`. Keep its export name, `id` and the `labelledBy`/heading `id` pair. Use the `mm-*` type classes and `mm` colours below, not raw hex, `text-text*`, `surface-*` or `accent` (those are the old tokens, left for `/request-demo`).

## Colour tokens (Tailwind `bg-mm-*`, `text-mm-*`, `border-mm-*`)

Defined in `src/styles/brand-tokens.css` as `--mm-*`. They follow the theme **and the section tone**: inside `tone="navy"` `text-mm-ink` turns white, buttons turn white, rules turn light blue. Opacity modifiers (`/50`) do not work on them.

| Token | Light | Dark | Use |
|---|---|---|---|
| `mm-page` | #ffffff | #0b1628 | page and white sections |
| `mm-pale` | #f1f5fb | #111f35 | pale sections |
| `mm-navy` | #0f1f3a | #16305a | navy punch sections |
| `mm-surface` | (tone) | (tone) | the current section's background |
| `mm-ink` | #1a365d | #f1f5f9 | headlines, titles, strong labels |
| `mm-body` | #334155 | #cbd5e1 | body text |
| `mm-muted` | #55657a | #9fb0c6 | eyebrows, captions, source lines |
| `mm-accent` | #3182ce | #8fc7f5 | the ONE accent phrase, big stat, icons. Large text only (4.0:1 on white) |
| `mm-link` | #2b6cb0 | #8fc7f5 | small accent text, text links (AA) |
| `mm-line` | #e2e8f0 | #22324a | hairlines, frame borders |
| `mm-rule` | #0f1f3a | #63a4e6 | 4px column top rule |
| `mm-tint` | #e3effb | #172a45 | quiet fills (frame bar, hover) |
| `mm-alert` | #c53030 | #fc8181 | the loss number only |

Navy tone values: ink #fff, body #d6e2f0, muted #a9bdd6, accent/link/rule #8fc7f5. All text pairs pass AA (checked with a WCAG script; `mm-muted` is darker than the deck's #64748b so it passes on pale).

## Type scale (classes in `src/index.css`)

Exactly three text levels per section: **L1** one heading size, **L2** one middle size, **L3** small text.

| Class | Level | Phone / md / lg | Weight |
|---|---|---|---|
| `mm-display` | L1, hero h1 only | 36 / 48 / 56px | 800 |
| `mm-h2` | L1, section heading | 30 / 36 / 44px | 800 |
| `mm-stat` | L1, big number | 56 / 80 / 96px | 800, tabular |
| `mm-h3` | L2, column/card title | 20 / 22px | 800 |
| `mm-lead` | L2, support line | 19 / 21px | 400 |
| `mm-body` | L3, body | 16 / 17px | 400 |
| `mm-eyebrow` | L3 label, uppercase | 14px | 600 |
| `mm-caption` | L3 label, captions/sources | 14px | 400 |
| `mm-accent-text` | colour only, for the accent phrase | | |

Font: Inter only (`font-sans`), latin file preloaded; Georgian glyphs come from Noto Sans Georgian registered as a second `Inter` face (`size-adjust: 86%`, Georgian unicode-range), exactly as the v6 deck. `font-serif`/`font-mono` are aliased to Inter; do not use them.

## Primitives (`src/components/ui/`, import from `../ui`)

**SectionShell** `{ id, tone?: 'white'|'pale'|'navy', labelledBy?, narrow?, className?, innerClassName?, children }` — full-width band, `max-w-6xl` grid (narrow = `max-w-3xl`), 16px phone gutter, `py-16 md:py-24 lg:py-28`, scroll offset for the fixed header.
```tsx
<SectionShell id="problem" tone="white" labelledBy="problem-title">
  <SectionHeading as="h2" id="problem-title" title="…" />
</SectionShell>
```

**SectionHeading** `{ as: 'h1'|'h2'|'h3', title, accent?, accentFirst?, eyebrow?, eyebrowTone?: 'muted'|'accent', support?, align?: 'left'|'center', id?, className? }` — eyebrow + heading with one accent phrase + `mm-lead` support line. Left by default. `as="h1"` = display size (hero only).
```tsx
<SectionHeading as="h2" id="switch-title" eyebrow="The plan"
  title="Switch without" accent="stopping your hospital."
  support="One support line." />
```

**Button / ButtonLink** `{ variant?: 'primary'|'secondary'|'text', full?, …native props }`; ButtonLink needs `href` (external links get a new tab + noopener). Pill, 48px tall (text variant 44px), visible focus, tone-aware. `buttonClass(variant, full)` gives the class string. One primary per section.
```tsx
<ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
<ButtonLink href="#switch" variant="secondary">…</ButtonLink>
<Button type="submit" disabled={busy}>…</Button>
```

**Column** `{ title, as?: 'h3'|'h4', label?, children?, className? }` — deck column: 4px `mm-rule` top rule, `mm-h3` title, `mm-body` text, no box.
```tsx
<div className="grid gap-10 md:grid-cols-3">
  <Column label="Days 0 to 30" title="…">One sentence.</Column>
</div>
```

**StatTile** (the big-stat block) `{ value, label, source?, tone?: 'ink'|'accent'|'alert', className? }` — `alert` is for the loss number only.
```tsx
<StatTile value="2.4%" label="…" tone="accent"
  source="MediMind analysis of audited accounts of 68 mid-size Georgian hospitals" />
```

**BrowserFrame** `{ image: ResponsiveImage, label?, caption? = 'Demo data', priority?, className? }` — quiet frame (hairline border, 10px radius, neutral dots, optional address-bar label), `<picture>` with AVIF then WebP `srcset`, width/height, `loading="lazy"` (priority = eager + fetchpriority high, hero only), caption under it.
```tsx
const shot: ResponsiveImage = { alt: '…', width: 1600, height: 1000, fallback: '/landing/billing-1600.webp',
  avif: '/landing/billing-800.avif 800w, /landing/billing-1600.avif 1600w', webp: '/landing/billing-800.webp 800w, /landing/billing-1600.webp 1600w' };
<BrowserFrame image={shot} label="Billing" />
```

**ProofItem** `{ label, detail?, logo?: {src, alt, width, height}, href?, linkLabel?, className? }` — renders an `<li>`; wrap in a `<ul>`.
```tsx
<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
  <ProofItem label="…" detail="…" href="https://innovationstatus.gov.ge/ka/awarded-companies/11464" linkLabel="…" />
</ul>
```

**FaqItem** `{ question, as?: 'h3'|'h4', defaultOpen? = true, children, className? }` — native `<details>` open by default, 44px summary, works without JS.
```tsx
<FaqItem question="…">
  <p>…</p>
</FaqItem>
```

**Reveal** `{ as?: 'div'|'li'|'article'|'figure', delay? (ms, capped 150), className?, children }` — 12px fade and rise, 250ms, once, never loops; off under `prefers-reduced-motion`. Do not wrap the hero h1 or hero image.
```tsx
<Reveal><Column title="…">…</Column></Reveal>
<Reveal as="li" delay={100}>…</Reveal>
```

**StickyCtaBar** `{ label?, href?, afterId? = 'hero', untilId? = 'contact' }` — phones only; shows after `#hero` leaves the top, hides once `#contact` reaches the screen. Already rendered once by `Landing.tsx`; builders don't add it.
```tsx
<StickyCtaBar />  // reads primaryCta from site.ts
```

Also kept and reshaped (older API still compiles): `EyebrowBadge { label, tone?: 'muted'|'accent', icon? }`; `GradientHeading` is a deprecated alias of SectionHeading; CSS `.btn-luminous` (primary), `.btn-ghost` (secondary), `.btn-quiet` (text link) are the button classes the Header already uses. Glow, lamp, sweep, blur and the hero grid/ECG styles were removed.

## Content (`src/content/`)

- `site.ts`: `showCustomerName = false`, `showFoundingPlaces = true`, `contactEmail = 'team@medimind.md'`, `primaryCta = { label: 'Plan my evaluation · 30 min', href: '#contact' }` (the label is the brief's working label; tell the foundation owner if the copy deck changes it).
- `types.ts`: `SectionTone`, `HeadingLevel`, `CtaLink`, `ResponsiveImage`.

## Sections (render order in `src/components/Landing.tsx`)

| File | Export | id | Tone set | Lane |
|---|---|---|---|---|
| HeroSection.tsx | HeroSection | `hero` (h1) | white | top |
| ProofStrip.tsx | ProofStrip | `proof` | pale | top |
| ProblemSection.tsx | ProblemSection | `problem` | white | top |
| WhatChangesSection.tsx | WhatChangesSection | `system` | pale | middle |
| ExamplesSection.tsx | ExamplesSection | `examples` | white | middle |
| SwitchPlanSection.tsx | SwitchPlanSection | `switch` | pale | middle |
| AiTodaySection.tsx | AiTodaySection | `ai` | white | middle |
| VisionSection.tsx | VisionSection | `vision` | navy | middle |
| ControlSection.tsx | ControlSection | `control` | white | trust |
| FoundersSection.tsx | FoundersSection | `team` | pale | trust |
| OfferSection.tsx | OfferSection | `offer` | navy | trust |
| FaqSection.tsx | FaqSection | `faq` (narrow) | white | trust |
| ContactSection.tsx | ContactSection | `contact` | pale | trust |

`hero` and `proof` ids were not specified in the task; I chose them (the sticky bar watches `hero`). Tones are a suggested white/pale rhythm with two navy punches; change your own section's tone if the design needs it. Old sections and the LightThread rail are no longer rendered; their files are untouched.

## Routes and head

- `App.tsx`: `/` (Landing) is eager; SignIn, SignUp, RequestDemo, Briefing*, Admin*, Walkthrough, FounderDemo and the new `/privacy` (`src/components/Legal/PrivacyNotice.tsx`, placeholder h1 for the trust lane) load lazily.
- `index.html`: title and description say "operating system" (description wording from `03` line 49), canonical `https://medimind.md/`, `og:url`, absolute `og:image` (existing `og-image.png`, 1200×630) and `twitter:image`, JSON-LD Organization at `https://medimind.md/` with `team@medimind.md`, theme-color white / #0b1628 by scheme, Inter preload.
- Theme: light by default; a stored toggle choice (`localStorage.theme`) wins; storage errors fall back to light. OS preference is not read (as briefed).

## What I checked and how

- Browser (own tab on http://localhost:5180, closed after): 1440×900 light and dark, 375×812 dark and light. All 13 sections render in order with the right backgrounds and heading colours per theme and tone; one h1; `scrollWidth == innerWidth` at both widths; body 17px desktop / 16px phone; h1 56px desktop / 36px phone; 16px phone gutter; Inter face status `loaded` and `document.fonts.check('800 16px Inter')` true (Georgian face correctly unloaded); no console errors; toggle writes `localStorage.theme` and a reload respects it; sticky bar visible mid-page on phone (48px button), hidden at the contact section; `/privacy` and `/request-demo` render; on `/` no admin, CRM, walkthrough or RequestDemo modules are fetched.
- `npx eslint` on all 37 touched files: 0 errors, 1 warning (`button.tsx` exports `buttonClass` next to components: fast refresh does a full reload for that file only).
- `tsc --noEmit -p tsconfig.app.json`: no errors in my files or in the old sections that use the reshaped primitives (pre-existing unused-import errors remain in untouched `card.tsx` and `background-ripple-effect.tsx`).
- Contrast: WCAG ratios computed for every text token on every background in both themes and the navy tone.

## Not done / requests for other lanes

- **Header (top lane):** nav still points at old ids (`path`, `platform`, `safety`, `proof`…) and "Book Demo" goes to `/request-demo`; it still has `backdrop-blur-md`, `shadow-lg`, framer entrance and mono labels; the menu button lacks `aria-label`/`aria-expanded`. It also imports `useAuthStore`, which pulls the Supabase client into the landing bundle; dropping the sign-out block removes that.
- **Footer (trust lane):** still `mailto:team@updevoteai.com`; needs a `/privacy` link.
- Reveal was not exercised in the browser (no section uses it yet); its reduced-motion path is CSS plus a matchMedia check.
- `@fontsource-variable/fraunces` and `@fontsource/ibm-plex-mono` are no longer imported but remain in `package.json` (I don't own it); safe to remove later.
- `og-image.png` still says "THE AI-NATIVE HOSPITAL OS"; kept as instructed.
- `netlify.toml`, `public/_redirects` and `vite.config.ts` were not in my list, so the old dev proxies and `/central` redirect remain.

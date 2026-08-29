# Waey (وعي) — Design System

> Editorial monochrome. A quiet, paper-like canvas where oversized serif display
> headlines carry the voice and a single near-black ink is the only accent. Color
> appears only as functional data signals (water, status). RTL-first.

**Source of truth:** `Waey-Awareness-Site-Redesign2` (theme.css, DESIGN-HANDOFF.md).
**Theme:** light + dark (dark restored to match the export).

The system is intentionally restrained: black/white/grey surfaces, one serif
display voice (Instrument Serif for Latin, Amiri for Arabic), one grotesque UI
voice (Inter, with Alexandria retained for legacy Arabic body), and a monospace
for uppercase technical labels (Roboto Mono). No gradients on UI, no chromatic
accents, flat elevation via hairline borders.

## Tokens — Colors

Tokens are CSS custom properties in HSL triplet form (`H S% L%`) so all component
CSS reskins automatically. Defined in `src/styles/tokens.css`; consumed by
`tailwind.config.ts` via the `theme.extend.colors` HSL-var bridge. `tokens.css` also
publishes a **raw-hex vocabulary that mirrors the Redesign2 export exactly**
(`--bg`, `--fg`, `--surface`, `--surface-2`, `--border-strong`, `--track`, `--fill`,
`--ease`, `--radius-pill`) so the handoff spec and Waey stay in lockstep — component
CSS may use either form, but the hex aliases are the canonical export values.

Light:

| Token | HSL | Role |
|-------|-----|------|
| `--background` | `0 0% 100%` | Page canvas — pure paper white |
| `--foreground` | `0 0% 0%` | Ink — headings, primary text |
| `--card` | `0 0% 100%` | Card surface (white) |
| `--card-foreground` | `0 0% 0%` | Card text |
| `--primary` | `0 0% 0%` | Primary action fill (ink) |
| `--primary-foreground` | `0 0% 100%` | Text on primary (white) |
| `--secondary` | `0 0% 96%` | Subtle fill (light grey) |
| `--muted` | `0 0% 96%` | Muted surface |
| `--muted-foreground` | `0 0% 44%` | Body/description text, eyebrows |
| `--border` | `0 0% 93%` | Hairline border |
| `--input` | `0 0% 93%` | Input border |
| `--ring` | `0 0% 0%` | Focus ring (ink) |
| `--accent` | `0 0% 96%` | Hover surface |
| `--destructive` | `0 72% 42%` | Error (kept chromatic) |
| `--water` | `205 90% 45%` | Data signal — hydration |

Dark (`[data-theme="dark"]`):

| Token | HSL | Role |
|-------|-----|------|
| `--background` | `0 0% 4%` | Near-black canvas |
| `--foreground` | `0 0% 96%` | Off-white ink |
| `--card` | `0 0% 9%` | Elevated surface |
| `--primary` | `0 0% 96%` | Primary action fill (light) |
| `--primary-foreground` | `0 0% 4%` | Text on primary (dark) |
| `--muted-foreground` | `0 0% 60%` | Body/description text |
| `--border` | `0 0% 16%` | Hairline border |
| `--water` | `205 90% 55%` | Data signal — hydration (brighter) |

Theme toggle signal: `<html data-theme="dark">` + `localStorage['waey-theme']`.
Tailwind `darkMode: ["selector", '[data-theme="dark"]']`.

## Tokens — Typography

- **Display (Latin):** `Instrument Serif` — editorial serif, weight 400, used at
  `clamp(2.4rem, 5vw, 4rem)` with tight `line-height: 1.1`. Class `.font-display`.
- **Display (Arabic):** `Amiri` — serif for Arabic headlines/eyebrows. Used when
  `dir="rtl"` and content is Arabic.
- **UI / Body:** `Inter` with `Alexandria` fallback for Arabic body —
  `"Inter", "Alexandria", sans-serif`. Weight 400 body, 600/700 buttons & nav.
- **Mono label:** `Roboto Mono` — uppercase tracked micro-labels, eyebrows, data
  annotations (`letter-spacing: 0.14em`, `text-transform: uppercase`).

### Type Scale

| Role | Size | Line Height | Class |
|------|------|-------------|-------|
| eyebrow / mono-label | 12–13px | 1 | `.eyebrow` |
| body-sm | 14px | 1.6 | — |
| body | 16px | 1.9 (Arabic 1.8) | — |
| lead | 18–21px | 1.5 | `.lead` |
| section-title | 28–40px | 1.15 | `.section-title` |
| display | 40–64px | 1.1 | `.font-display` |

Headings are always weight 700/400 (serif), never chromatic. Italic serif tail
(`<em>` in `.em-muted`) is the signature accent on hero headlines.

## Tokens — Spacing & Shapes

- **Base unit:** 4px (8 / 12 / 16 / 24 / 32 / 48 / 64).
- **Border radius:** cards `16px` (`--radius`) / field cards `18px` (`--radius-card`),
  panels `14px`, inputs `12px`, buttons `9999px` (pill, `--radius-pill`), small chips
  `8px`. Mirrors the Redesign2 export (16–18px editorial cards). No square corners on
  cards — keep a minimum 12px radius.
- **Elevation:** flat — differentiate surfaces by a 1px hairline border
  (`--border` / `#ECECEC`), NOT shadow. The export forbids drop shadows; depth comes
  from the border turning to `--foreground` (ink) on hover, plus a 2px lift.
- **Layout:** content max-width ~1100px, section padding `64–100px` desktop.

## Components

### Primary CTA (`.btn .btn-moss` → now ink)
Ink fill (`--primary`), white text, `rounded-full` pill, Inter 600, min-height 44px.
Trailing arrow icon. The highest-contrast element on the page.

### Ghost Button (`.btn-ghost`)
Transparent, `1px` border (`--border`), ink text, pill. Hover: border →
`--foreground`, faint surface tint.

### Theme Toggle (`.theme-toggle`)
Pill button with `☀ / ☾`. Drives `data-theme`. Sits in the navbar before the
language switch. See `src/components/ThemeToggle.tsx`.

### Eyebrow (`.eyebrow`)
Mono uppercase tracked label in `--muted-foreground` (or `--water`/`--primary`
tint), 12–13px, margin-bottom 16px. Used above every section title and hero.

### Section Title (`.section-title`)
Instrument Serif (Amiri in RTL) `clamp(1.75rem, 3.4vw, 2.6rem)`, weight 400/700,
`line-height: 1.15`. Often paired with an `<em>` muted italic tail.

### Ledger / Card (`.ledger`, `.card`)
White (`--card`) surface, `24px` radius, hairline border, generous padding (24–32px).
Hover lift optional. Used for tools, trackers, and index rows.

### Stat Block
Large Instrument Serif numeral (`clamp(2rem, 4vw, 2.8rem)`), `--foreground`; small
mono/body label in `--muted-foreground` beneath.

## Do's and Don'ts

### Do
- Keep the canvas monochrome — ink + paper + greys only.
- Use Instrument Serif / Amiri for all display; Inter for all UI and body.
- Set eyebrows in Roboto Mono uppercase with tracking.
- Use `16–18px` radii on cards (Tailwind `rounded-2xl` / `rounded-[18px]`); `rounded-full` on every button.
- Drive dark mode via `data-theme` on `<html>`; respect `localStorage['waey-theme']`.
- Keep body line-height ~1.9 (Arabic 1.8) for comfortable RTL reading.

### Don't
- Don't introduce chromatic brand colors (green/amber/sand) — they belong only
  inside photography where present, never as UI accents.
- Don't bold the serif display beyond weight 700; authority comes from size + restraint.
- Don't use drop shadows for elevation — use hairline borders.
- Don't break the three-voice system: serif display, Inter UI, mono data.
- Don't use pure-black underlines or decorative gradients on surfaces.

## Surfaces

| Level | Light | Dark | Purpose |
|-------|-------|------|---------|
| canvas | `0 0% 100%` | `0 0% 4%` | Page background |
| card | `0 0% 100%` | `0 0% 9%` | Elevated module |
| muted | `0 0% 96%` | `0 0% 12%` | Inset / hover |
| border | `0 0% 93%` | `0 0% 16%` | Hairline |

## Imagery

Editorial, mostly type-driven. Hero uses a calm lifestyle photo or product frame;
icons are minimal monoline SVGs in `--foreground`. No illustrations, no abstract
graphics, no lifestyle clutter. Typography carries the visual weight.

## Motion

Framer Motion page transitions: fade + translateY(20px), 0.4s ease. Hover/focus
state transitions 150–220ms on background-color and border-color. No bounce, no
parallax, no overshoot. Respect `prefers-reduced-motion`.

## Fonts (self-hosted)

Loaded in `src/styles/fonts.css` + `src/index.css`:
- `Instrument Serif` (display, Latin)
- `Inter` (UI/body)
- `Roboto Mono` (labels/data)
- `Amiri` (display, Arabic)
- `Alexandria` (legacy Arabic body fallback)

## Similar Brands

- Editorial print / magazine systems (large serif display, mono labels).
- Quiet-productivity apps using monochrome + hairline surfaces.
- Apple-style restrained marketing pages (for the App Store promo variant).

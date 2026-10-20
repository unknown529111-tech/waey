# Waey (وعي) — Design System: "Organic / Natural"

> Wabi-sabi editorial: rice-paper canvas with a paper-grain veil,
> deep-loam ink, moss green as the only primary action color,
> terracotta clay as the warm secondary, sand/stone neutrals.
> Fraunces serif carries Latin display with old-world warmth;
> Amiri carries Arabic display; Nunito'\''s rounded terminals run the
> interface; IBM Plex Mono annotates data. Soft amorphous shapes,
> colored diffused shadows, gentle tactile motion. RTL-first.

The system rejects cold digital precision: no sharp 90-degree
surfaces on feature elements, no pure-black shadows, no harsh
snaps. Everything feels shaped by hand and weathered by use.

## Tokens — Colors

CSS custom properties in HSL triplets in `src/styles/tokens.css`;
bridged into `tailwind.config.ts`. Raw-hex vocabulary mirrors them
(`--bg`, `--fg`, `--surface`, `--surface-2`, `--border-strong`,
`--track`, `--fill`, `--ease`, `--radius-pill`).

Light (canonical):

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#FDFCF8` | Rice paper canvas |
| `--foreground` | `#2C2C24` | Deep loam — headings, text |
| `--card` | `#FEFEFA` | Lighter beige raised surface |
| `--primary` | `#5D7052` | Moss green — primary actions |
| `--primary-foreground` | `#F3F4F1` | Pale mist text on moss |
| `--secondary` | `#C18C5D` | Terracotta / clay |
| `--accent` | `#E6DCCD` | Sand / beige |
| `--muted` | `#F0EBE5` | Stone inset |
| `--muted-foreground` | `#78786C` | Dried grass — labels |
| `--border` / `--input` | `#DED8CF` | Raw timber hairline |
| `--ring` | `#5D7052` | Moss focus glow |
| `--destructive` | `#A85448` | Burnt sienna |
| `--water` | `#5D7052` | Data signal |

Dark (`[data-theme="dark"]`) — forest night:

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#191A14` | Night loam |
| `--foreground` | `#F0EFE8` | Pale mist |
| `--card` | `#20211B` | Raised surface |
| `--primary` | `#94B184` | Luminous moss |
| `--secondary` | `#D9A87A` | Warm clay |
| `--muted-foreground` | `#A2A29A` | Labels |
| `--border` | `#2A2B23` | Hairline |
| `--ring` | `#94B184` | Focus glow |

Theme: `<html data-theme="dark">` + `localStorage['waey-theme']`.
Default follows OS `prefers-color-scheme`.

## Tokens — Typography

- **Display (Latin):** `Fraunces` — variable soft serif, weight 600–800,
  `line-height: 1.08–1.15`. Class `.font-display`.
- **Display (Arabic):** `Amiri` — serif for Arabic headlines. Leads in RTL.
- **UI / Body:** `Nunito` with `Alexandria` fallback for Arabic body.
  Rounded terminals echo the organic shapes. Weight 400 body, 700 buttons.
- **Mono label:** `IBM Plex Mono` — uppercase tracked micro-labels,
  eyebrows, numbers (`letter-spacing: 0.18em`).

## Shape & Elevation

- **Cards:** `rounded-[2rem]` (`--radius-card`), optional asymmetric
  corner accents (`corner-accent-tl/tr/bl/br` at 4rem).
- **Buttons:** always `rounded-full` pills.
- **Inputs:** pill-shaped, semi-transparent over the grain.
- **Blobs:** `.blob` + `.blob-moss/.blob-clay/.blob-sand` — blurred
  amorphous background washes; `.is-drifty` adds a 14s drift.
- **Organic masks:** `.organic-mask` / `.organic-mask-alt` for imagery.
- **Shadows:** colored, diffused, never black —
  `--shadow-soft` (moss 15%), `--shadow-soft-hover` (moss 25%),
  `--shadow-float` (clay 20%), `--shadow-lift` (moss 15% deep).

## Texture

A fixed `body::before` noise veil (SVG turbulence, 3.5% opacity,
`mix-blend-mode: multiply`) gives the canvas its paper grain; in dark
mode it flips to `screen` at 5%. Never remove it — texture is the
system'\''s signature material.

## Components

### Primary CTA (`.btn .btn-moss`)
Moss fill, pale-mist text, pill, Nunito 700, `var(--shadow-soft)`.
Hover: `scale(1.05)` + deepened shadow. Active: `scale(0.95)`.

### Outline (`.btn-ink`) / Secondary (`.btn-clay`)
Clay 2px border outline pill; `.btn-clay` is the solid terracotta pill
with the clay-tinted float shadow.

### Theme Toggle (`.theme-toggle`)
Circular soft plate on a translucent card wash; hover scales 1.08.

### Eyebrow (`.eyebrow`) — Plex Mono uppercase tracked; RTL falls back
to Nunito 700 (Arabic has no case/tracking).

### Card / Ledger / Tool / Panel
`#FEFEFA` surface, 50% timber border, moss soft shadow; hover lifts
`translateY(-4px)` with the deeper lift shadow.

### Index / Field Cards
2rem radii with per-card asymmetric corner accents, moss number
chips, gentle 6px lift on hover.

## Motion

Natural, gentle, eased. Hover lifts/scales 300–500ms with
cubic-bezier(0.22, 1, 0.36, 1). Buttons press to scale(0.95).
Blobs drift over 14s. Page transitions: fade + translateY(20px), 0.4s.
Global `prefers-reduced-motion` guard disables everything.

## Do'\''s and Don'\''ts

### Do
- Keep colors earth-drawn: moss, clay, sand, stone, loam, rice paper.
- Use Fraunces (Latin) / Amiri (Arabic) for display; Nunito for UI.
- Soften every shadow with a color tint; lift elements on hover.
- Vary card corners with the asymmetric accents.
- Let the grain veil cover everything.

### Don'\''t
- No pure-black shadows, no sharp square feature surfaces.
- No glass blur except on the floating nav pill.
- No harsh scale snaps; everything eases.
- No extra accent hues beyond moss/clay (status hues excepted).

## Fonts

- `Amiri` (self-hosted, `fonts.css`) — Arabic display
- `Fraunces` (Google Fonts) — Latin display
- `Nunito` (Google Fonts) — UI/body
- `IBM Plex Mono` (Google Fonts) — labels/data
- `Alexandria` (Google Fonts) — legacy Arabic body fallback

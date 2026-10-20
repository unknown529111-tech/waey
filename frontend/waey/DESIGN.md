# Waey (وعي) — Design System: "Organic / Natural"

> Wabi-sabi editorial, cooled: cool white canvas with a paper-grain
> veil, teal-navy ink, emerald as the only primary action colour,
> deep teal-navy as the secondary, cool neutrals, and four field
> accents. Fraunces serif carries Latin display with old-world warmth;
> Amiri carries Arabic display; Nunito'\''s rounded terminals run the
> interface; IBM Plex Mono annotates data. Soft amorphous shapes,
> colored diffused shadows, gentle tactile motion. RTL-first.

The system rejects hard digital sterility while keeping the hand-made
warmth: no sharp 90-degree surfaces on feature elements, organic
radii, the grain veil, soft diffused shadows — the palette itself
stays cool and clear.

## Tokens — Colors

CSS custom properties in HSL triplets in `src/styles/tokens.css`;
bridged into `tailwind.config.ts`. A standalone colour vocabulary
mirrors them for the page stylesheets that need a complete colour
rather than a triplet (`--bg`, `--fg`, `--surface`, `--surface-2`,
`--border-strong`, `--track`, `--fill`, `--ease`, `--radius-pill`).

Light (canonical):

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#F7F9F9` | Cool paper canvas |
| `--foreground` | `#143647` | Teal-navy ink — headings, text |
| `--card` | `#FFFFFF` | Raised surface |
| `--card-foreground` | `#143647` | Text on card |
| `--popover` / `--popover-foreground` | `#FFFFFF` / `#143647` | Floating surface |
| `--primary` | `#0B6853` | Emerald-teal — the only primary action colour |
| `--primary-foreground` | `#F2F9F6` | Pale mint on emerald |
| `--secondary` | `#1C404E` | Deep teal — secondary actions |
| `--secondary-foreground` | `#FFFFFF` | |
| `--accent` | `#EAF2F1` | Soft teal wash, section grounds |
| `--accent-foreground` | `#143647` | |
| `--muted` | `#EEF3F4` | Cool stone inset |
| `--muted-foreground` | `#5A6B72` | Slate — labels (4.5:1 on white) |
| `--destructive` | `#C0392B` | Burnt red |
| `--destructive-foreground` | `#FFFFFF` | |
| `--border` / `--input` | `#DDE6E8` / `#7E9098` | Hairline / control edge |
| `--ring` | `#0B6853` | Emerald focus ring |
| `--footer` | `#0F2C47` | Deep teal-navy footer band |

Dark (`[data-theme="dark"]`) — forest night:

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#0E1A20` | Night teal |
| `--foreground` | `#EAF1F2` | Pale mist |
| `--card` | `#152630` | Raised surface |
| `--card-foreground` | `#EAF1F2` | |
| `--primary` | `#3FA98C` | Luminous emerald |
| `--primary-foreground` | `#06231C` | |
| `--secondary` | `#2A5765` | Deep teal |
| `--accent` | `#17303A` | |
| `--muted` | `#12222A` | |
| `--muted-foreground` | `#9FB3B8` | Labels |
| `--border` / `--input` | `#243A44` / `#5E8090` | Hairline / control edge |
| `--ring` | `#3FA98C` | Focus ring |

### Field accents

| Field | strong | soft | tint |
|-------|--------|------|------|
| health | `#C42D42` | `#E8465B` | `#FFF1F2` |
| finance | `#1F559E` | `#2F6FC9` | `#EFF6FD` |
| environment | `#1F6B39` | `#2F8F4E` | `#EAF7EF` |
| education | `#52349B` | `#6D4BC4` | `#F1EEFB` |

Three tiers per field. **strong** carries small text and icons and
clears 4.5:1 on the card; **soft** is the icon fill that sits on the
**tint** ground; **tint** is the pastel card ground itself. One accent
per field, so colour is a navigational cue rather than decoration. In
dark mode the strong tier is the light-mode soft tier lifted one step,
and the tint becomes a deep desaturated ground (health `#2A1518`,
finance `#101E2E`, environment `#12251A`, education `#1E1830`). A
neutral `--field-current` family (emerald) marks "the field you are in
right now".

**Light is canonical** — the app opens in light. Dark is the
forest-night alternate and a first-class theme, not the default.

Theme: `<html data-theme="dark">` + `localStorage['waey-theme']`.

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
  `--shadow-soft` (ink 14%), `--shadow-soft-hover` (ink 24%),
  `--shadow-float` (deep navy 20%), `--shadow-lift` (ink 16%).

## Texture

A fixed `body::before` noise veil (SVG turbulence, 3.5% opacity,
`mix-blend-mode: multiply`) gives the canvas its paper grain; the
grain is ink-tinted in light mode and emerald-tinted in dark mode,
where it flips to `screen` at 5%. Never remove it — texture is the
system'\''s signature material.

## Components

### Primary CTA (`.btn .btn-moss`)
Emerald fill, pale-mint text, pill, Nunito 700, `var(--shadow-soft)`.
Hover: `scale(1.05)` + deepened shadow. Active: `scale(0.95)`.

### Outline (`.btn-ink`) / Secondary (`.btn-clay`)
Deep-teal 2px border outline pill; `.btn-clay` is the solid deep-teal
pill with the navy-tinted float shadow.

### Theme Toggle (`.theme-toggle`)
Circular soft plate on a translucent card wash; hover scales 1.08.

### Eyebrow (`.eyebrow`) — Plex Mono uppercase tracked; RTL falls back
to Nunito 700 (Arabic has no case/tracking).

### Card / Ledger / Tool / Panel
`#FFFFFF` surface, 50% hairline border, ink soft shadow; hover lifts
`translateY(-4px)` with the deeper lift shadow.

### Index / Field Cards
2rem radii with per-card asymmetric corner accents, emerald number
chips, and the card's own field accent on icon and label; gentle 6px
lift on hover.

## Motion

Natural, gentle, eased. Hover lifts/scales 300–500ms with
cubic-bezier(0.22, 1, 0.36, 1). Buttons press to scale(0.95).
Blobs drift over 14s. Page transitions: fade + translateY(20px), 0.4s.
Global `prefers-reduced-motion` guard disables everything.

## Do'\''s and Don'\''ts

### Do
- Keep colours cool and clear: emerald for actions, teal-navy for ink,
  and one field accent per field.
- Use Fraunces (Latin) / Amiri (Arabic) for display; Nunito for UI.
- Soften every shadow with a color tint; lift elements on hover.
- Vary card corners with the asymmetric accents.
- Let the grain veil cover everything.

### Don'\''t
- No pure-black shadows, no sharp square feature surfaces.
- No glass blur except on the floating nav pill.
- No harsh scale snaps; everything eases.
- No extra accent hues beyond the four field accents and the status
  hues — colour is a navigational cue, not decoration.

## Fonts

- `Amiri` (self-hosted, `fonts.css`) — Arabic display
- `Fraunces` (Google Fonts) — Latin display
- `Nunito` (Google Fonts) — UI/body
- `IBM Plex Mono` (Google Fonts) — labels/data
- `Alexandria` (Google Fonts) — legacy Arabic body fallback

## Retired palette

The moss `#5D7052`, terracotta `#C18C5D` and rice-paper `#FDFCF8`
palette is retired. The reference direction the redesign follows is
cool and clear, and the old warm palette made every surface read as
the same beige — exactly the flatness the redesign is fixing. The
organic radii, the paper-grain veil, the coloured diffused shadows,
the type system and the RTL layout all survive; only the colours
changed. The old token names still exist in `tokens.css` as aliases
retargeted at the new neutrals, so nothing downstream breaks.

---
version: alpha
name: Waey — منصة التوازن الشامل
description: An Egyptian Arabic holistic-awareness platform built on a warm nature-inspired palette — forest green primary, amber accent, cream sand background, and the Alexandria Arabic geometric sans. The system pairs organic rounded cards (rounded-3xl 32px / 2rem) with generous leading (1.8 body, 1.4 headings), soft frosted-glass navigation, framer-motion page transitions, and a dual light/dark theme. Every surface is RTL. The design voice is calm, earthy, and editorial — like a wellness journal with digital tooling.

colors:
  primary: "#5D7052"
  primary-foreground: "#F3F4F1"
  primary-deep: "#4A5C40"
  secondary: "#C18C5D"
  secondary-foreground: "#FFFFFF"
  accent: "#E6DCCD"
  accent-foreground: "#4A4A40"
  destructive: "#A85448"
  destructive-foreground: "#FFFFFF"
  ink: "#2C2C24"
  ink-muted: "#78786C"
  ink-faint: "#A8A89C"
  canvas: "#FDFCF8"
  canvas-soft: "#FFFFFF"
  card: "#FEFEFA"
  card-foreground: "#2C2C24"
  muted: "#F0EBE5"
  muted-foreground: "#78786C"
  border: "#DED8CF"
  input: "#DED8CF"
  ring: "#5D7052"
  popover: "#FEFEFA"
  popover-foreground: "#2C2C24"
  leaf-light: "#EDF3E8"
  sun-warm: "#F5EEE4"
  sand-deep: "#DED8CF"
  sidebar-background: "#FDFCF8"
  sidebar-foreground: "#2C2C24"
  sidebar-primary: "#5D7052"
  sidebar-border: "#DED8CF"
  overlay: "#000000"

colors-dark:
  primary: "#7BA98F"
  primary-foreground: "#1A1915"
  secondary: "#B88960"
  secondary-foreground: "#E8DDD0"
  accent: "#3A352C"
  accent-foreground: "#E8DDD0"
  destructive: "#B05848"
  destructive-foreground: "#FFFFFF"
  ink: "#E8DDD0"
  ink-muted: "#9A9080"
  ink-faint: "#6A6050"
  canvas: "#1A1915"
  canvas-soft: "#161511"
  card: "#22211C"
  card-foreground: "#E8DDD0"
  muted: "#2A2824"
  muted-foreground: "#8A8070"
  border: "#302E28"
  input: "#302E28"
  ring: "#7BA98F"
  leaf-light: "#1E2E1E"
  sun-warm: "#2E281E"
  sand-deep: "#2A2824"

typography:
  display-xxl:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -1.5px
  display-xl:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -1px
  display-lg:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.75px
  display-md:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.5px
  heading-lg:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.3px
  heading-md:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0
  body-md:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0
  body-sm:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0
  button-md:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  button-sm:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  caption:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  micro:
    fontFamily: "Alexandria, 'Segoe UI', sans-serif"
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.3px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 22px
  3xl: 32px
  4xl: 40px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  huge: 64px
  section: 96px

components:
  # ─── Buttons ────────────────────────────────────
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 24px
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 24px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 24px
  button-secondary-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 24px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 24px
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 24px
  icon-button-circle:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  icon-button-circle-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    size: 40px
  icon-button-circle-blue:
    backgroundColor: "#3B82F6"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    size: 40px

  # ─── Navigation ──────────────────────────────────
  nav-bar:
    backgroundColor: "hsla(var(--background) / 0.8)"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    backdropFilter: "blur(12px)"
    borderBottom: "1px solid hsl(var(--border) / 0.5)"
    height: 64px
    padding: "16px 48px"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
    borderBottom: "2px solid {colors.primary}"
  nav-link-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
  mobile-nav-link-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
  mobile-nav-link-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
  hamburger-menu:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    size: 40px
    rounded: "{rounded.full}"

  # ─── Cards ───────────────────────────────────────
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.border}"
  card-section-link:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.border}"
  card-section-link-hover:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.primary}"
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
  card-quiz-result:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.border}"
  card-dashboard-tracker:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: 20px
    border: "1px solid {colors.border}"
  card-insight:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: 20px
    border: "1px solid {colors.border}"
  card-modal:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.border}"
  card-recipe:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.border}"
  card-recipe-hover:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    border: "1px solid {colors.primary}"
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
  card-pricing:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.lg}"
    border: "2px solid {colors.border}"
  card-pricing-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.lg}"
    border: "2px solid {colors.primary}"
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)"

  # ─── Inputs & Forms ─────────────────────────────
  text-input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    border: "1px solid {colors.input}"
  range-slider:
    accentColor: "{colors.primary}"
    height: 6px
    rounded: "{rounded.full}"
    thumbSize: 18px

  # ─── Quiz ────────────────────────────────────────
  quiz-option-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.md}"
    border: "2px solid {colors.border}"
  quiz-option-correct:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.md}"
    border: "2px solid {colors.primary}"
  quiz-option-wrong:
    backgroundColor: "{colors.destructive-soft}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.md}"
    border: "2px solid {colors.destructive}"
  quiz-progress-bar:
    backgroundColor: "{colors.secondary}"
    fillColor: "{colors.primary}"
    height: 8px
    rounded: "{rounded.full}"

  # ─── Hero ────────────────────────────────────────
  hero-section:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    headingTypography: "{typography.display-xxl}"
    bodyTypography: "{typography.body-lg}"
    padding: "{spacing.huge} {spacing.lg}"
    maxWidth: 1200px
    badge: "{colors.card} / {colors.ink-muted} / rounded-full / pill"
  page-hero:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    headingTypography: "{typography.display-xl}"
    bodyTypography: "{typography.body-lg}"
    padding: "48px 24px"
    maxWidth: "60ch"

  # ─── Decorations ─────────────────────────────────
  gradient-blob:
    backgroundColor: "{colors.primary} / 5%"
    size: 400px
    blurRadius: "128px"
    rounded: "{rounded.full}"
    pointerEvents: "none"
  gradient-blob-accent:
    backgroundColor: "{colors.accent} / 5%"
    size: 300px
    blurRadius: "128px"
    rounded: "{rounded.full}"
    pointerEvents: "none"
  background-gradient-home:
    backgroundImage: "linear-gradient(to bottom right, {colors.leaf-light} / 40%, {colors.canvas}, {colors.sun-warm} / 30%)"

  # ─── Tags & Badges ──────────────────────────────
  tag-filter-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  tag-filter-default:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  tag-recipe:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  tag-category:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 12px"

  # ─── Streak ──────────────────────────────────────
  streak-badge:
    backgroundImage: "linear-gradient(to left, {colors.accent} / 20%, {colors.accent} / 5%)"
    textColor: "{colors.accent}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    border: "1px solid {colors.accent} / 30%"

  # ─── Progress ────────────────────────────────────
  progress-bar:
    backgroundColor: "{colors.secondary}"
    fillColor: "{colors.primary}"
    height: 8px
    rounded: "{rounded.full}"

  # ─── Footer ──────────────────────────────────────
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxl} {spacing.lg}"
    maxWidth: 1200px

  # ─── FAB ─────────────────────────────────────────
  assistant-fab:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    size: 56px
    position: "fixed bottom-6 left-6"
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)"

  # ─── Notification / Dark toggle ──────────────────
  toggle-icon-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  toggle-icon-button-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    size: 40px
---

## Overview

**Waey (وعي)** is an Arabic-first holistic-awareness platform for Egyptian users. The design embraces **wabi-sabi** — the acceptance of transience and imperfection. It rejects cold digital precision in favor of **warmth, softness, and natural connection**. Every surface feels tactile, grounded, and calming — like a wellness journal brought to life.

The palette is drawn from the forest floor, clay pottery, unbleached paper, and dried grass. The page sits on an off-white rice paper canvas (`{colors.canvas}` — `#FDFCF8`) with text in deep loam (`{colors.ink}` — `#2C2C24`). The signature primary is a calming moss green (`{colors.primary}` — `#5D7052`), the secondary is a warm terracotta clay (`{colors.secondary}` — `#C18C5D`), and the accent is a soft sand beige (`{colors.accent}` — `#E6DCCD`).

The core visual signature is **soft, amorphous blob shapes** with varied organic border radii (`border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%`). A global grain/noise texture overlay at 4% opacity with multiply blend mode creates a paper-like quality across every page.

The most distinctive feature is the **generous 32px rounded corners** (`rounded-[2rem]`) used on virtually all cards, modals, and containers — a signature that gives every surface a soft, approachable, card-like feel. Buttons use `{rounded.full}` pill shapes. The `{rounded.4xl}` (40px) is reserved for hero images.

Typography runs **Alexandria** — an Arabic geometric sans serif — at weight 700 for all headings and 400 for body. Body text has an unusually generous 1.9 line-height, giving the reading experience a spacious, editorial rhythm suitable for Arabic text. All text is RTL.

Every page uses **framer-motion** page transitions (fade + slide up 20px, 0.4s easeOut) and scroll-triggered `whileInView` animations for sections. Decorative blurred gradient blobs with organic border radii anchor page compositions. A full light/dark theme toggle is supported, with dark mode flipping to a warm deep brown base (`{colors.canvas}` `#1A1915`) and adjusting all surfaces accordingly.

The brand uses **no authentication** and **no backend database** for user data — all trackers, streaks, favorites, and plan progress live in **localStorage**. Supabase is used only for the contact form and AI chat API proxy via Edge Functions.

**Key Characteristics:**
- **Wabi-sabi philosophy**: intentional imperfection, asymmetry, organic shapes, tactile warmth.
- **Moss green + terracotta + sand palette**: earthy, grounded, natural color story.
- **Signature organic radii**: cards use `rounded-[2rem]` with asymmetric corner variations and blob shapes.
- **Global grain texture**: fixed noise overlay at 4% opacity with multiply blend mode for paper-like tactility.
- **Alexandria Arabic sans**: the sole typeface across all roles at weights 700 (headings) and 400 (body).
- **Generous body leading**: 1.9 line-height for Arabic readability.
- **RTL layout**: all text direction is right-to-left.
- **Framer Motion**: page transitions (fade + translateY), scroll reveals, hover micro-interactions, gentle entrance animations.
- **Decorative gradient blobs**: blurred circles with organic border radii in primary/accent/secondary tints.
- **Frosted-glass nav**: sticky navbar with `backdrop-blur-md` and `bg-background/80`.
- **Tinted shadows**: soft, diffused colored shadows (moss green tint, terracotta tint) instead of pure black shadows.
- **Dual theme**: full light/dark CSS custom properties toggle with warm organic dark tones.
- **LocalStorage-first**: no auth, no DB for user data; fully offline-capable.
- **Pill buttons**: all buttons use `{rounded.full}` — never square corners on CTAs.
- **No data tables or code blocks**: the brand is consumer-facing, not developer-facing.
- **Gentle interaction**: elements scale and lift on hover like picking up a river stone; no harsh snaps.

## Colors

> Source pages: home (`/`), `/health`, `/finance`, `/environment`, `/education`, `/dashboard`, `/insights`, `/plans`, `/recipes`, `/assistant`.

### Light Mode

**Brand & Primary**
- **Moss Green** (`{colors.primary}` — `#5D7052`): The signature CTA color. Filled button backgrounds, active nav links, section headings, progress fills, chart primary lines, section link cards.
- **Terracotta** (`{colors.secondary}` — `#C18C5D`): Secondary CTA. Outline button borders, streak badge, budget calculator, finance page accent, expense charts.
- **Sand** (`{colors.accent}` — `#E6DCCD`): Subtle surface for secondary interactions, decorative backgrounds, range track.
- **Burnt Sienna** (`{colors.destructive}` — `#A85448`): Deletion, quiz wrong answers, recipe calorie icons, favorite toggle active.

**Surface**
- **Rice Paper** (`{colors.canvas}` — `#FDFCF8`): Default page background — off-white with warm undertone.
- **Card** (`{colors.card}` — `#FEFEFA`): Extremely light beige for card, popover, modal surfaces — slightly warmer than pure white.
- **Stone** (`{colors.muted}` — `#F0EBE5`): Background for secondary buttons, inactive tags, progress track.
- **Muted foreground** (`{colors.muted-foreground}` — `#78786C`): Dried grass tone for secondary text.
- **Raw Timber** (`{colors.border}` — `#DED8CF`): 1px card borders, input borders at 50% opacity.
- **Leaf Light** (`{colors.leaf-light}` — `#EDF3E8`): Subtle green tint used in gradient backgrounds.
- **Sun Warm** (`{colors.sun-warm}` — `#F5EEE4`): Subtle warm tint used in gradient backgrounds.

**Text**
- **Deep Loam** (`{colors.ink}` — `#2C2C24`): All headings and body text — warm dark charcoal, never pure black.
- **Ink Muted** (`{colors.ink-muted}` — `#78786C`): Dried grass — secondary text, card descriptions, helper copy.
- **Ink Faint** (`{colors.ink-faint}` — `#A8A89C`): Disabled / placeholder text.

### Dark Mode

**Surface**
- **Warm Deep Brown** (`{colors.canvas}` — `#1A1915`): The brand's dark theme anchor — warm and earthy, not blue-navy.
- **Card** (`{colors.card}` — `#22211C`): One step above canvas for cards.
- **Secondary / Muted** (`{colors.secondary}` — `#B88960`, `{colors.muted}` — `#2A2824`): Lifted surfaces for tags and button backgrounds.
- **Border** (`{colors.border}` — `#302E28`): Card borders in dark mode.

**Text**
- **Warm Cream** (`{colors.ink}` — `#E8DDD0`): Warm cream text on dark surfaces.
- **Primary** (`{colors.primary}` — `#7BA98F`): A lighter, brighter sage green for dark-mode CTAs.
- **Secondary** (`{colors.secondary}` — `#B88960`): A warm muted terracotta for dark-mode accents.

### Semantic
- Water tracking uses `#3B82F6` (blue) on both themes.
- Sleep tracking uses `#6366F1` (indigo).
- Chart colors form a nature-inspired array: `["#5D7052", "#C18C5D", "#7BA98F", "#D4A656", "#8C7A6B", "#E6DCCD", "#9CC1A8"]`.
- The brand does not use success/warning/info semantic colors outside the primary/accent palette.

## Typography

### Font Family

**Alexandria** — a modern Arabic geometric sans-serif by Mohamed Gaber (via Google Fonts). The family is loaded at weights 300, 400, 500, 600, 700, 800.

- **Display & headings**: always weight 700 (bold).
- **Body**: always weight 400 (regular).
- **Buttons**: always weight 700 (bold).
- **Small / micro**: weight 700 for emphasis, 400 for neutral.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 60px | 700 | 1.3 | -1.5px | Hero headline (desktop) |
| `{typography.display-xl}` | 48px | 700 | 1.3 | -1px | Hero headline (mobile), section openers |
| `{typography.display-lg}` | 36px | 700 | 1.3 | -0.75px | Section titles (desktop) |
| `{typography.display-md}` | 28px | 700 | 1.4 | -0.5px | Section titles (mobile), card main titles |
| `{typography.heading-lg}` | 22px | 700 | 1.4 | -0.3px | Card titles, plan selectors |
| `{typography.heading-md}` | 18px | 700 | 1.4 | 0 | Section sub-headings |
| `{typography.body-lg}` | 18px | 400 | 1.9 | 0 | Marketing body, hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.9 | 0 | Default body, card content |
| `{typography.body-sm}` | 14px | 400 | 1.8 | 0 | Card descriptions, plan details |
| `{typography.button-md}` | 14px | 700 | 1.2 | 0 | Primary / secondary buttons |
| `{typography.button-sm}` | 12px | 700 | 1.2 | 0 | Small buttons, tag text |
| `{typography.caption}` | 12px | 400 | 1.6 | 0 | Helper text, recipe meta |
| `{typography.micro}` | 10px | 700 | 1.4 | 0.3px | Tag labels, category badges |

### Principles
- **Weight 700 is the heading voice.** All headings render at bold (700). No lighter heading weights.
- **1.9 body leading is the brand rhythm.** The generous line-height gives Arabic text room to breathe and is the system's most distinctive typographic signal.
- **Negative tracking on display sizes only.** Display-xxl through display-md get slight negative tracking; body sizes track at 0.
- **No monospace.** The brand is consumer-facing and has no code or technical typography.
- **Every headline is right-aligned or centered.** RTL alignment applies to all text.

## Layout

### Spacing System
- **Base unit**: 4px.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.huge}` 64px · `{spacing.section}` 96px.
- **Section padding**: 64px top/bottom on full sections; 48px on compact sections.
- **Card interior padding**: 24px for dashboard trackers and recipe cards; 32-40px for feature cards, modals, and quiz containers.
- **Container max-width**: 1200px centered for marketing pages; 1100px for plans; 800px for quiz; 900px for calculators; 1000px for finance calculators.

### Grid & Container
- Marketing pages center content in a `max-w-[1200px] mx-auto` container.
- Section cards grid: 1 col mobile → 2 col tablet → 3 col desktop.
- Dashboard trackers grid: 1 col mobile → 2 col tablet → 3 col desktop.
- Insight charts: single column mobile → 2 col grid desktop.
- Recipe cards: 1 col → 2 col → 3 col.
- Plan selectors: 1 col mobile → 3 col desktop.

### Whitespace Philosophy
The brand uses generous vertical rhythm. Decorative gradient blobs fill white space without requiring content. The cream sand canvas is warm enough to feel inhabited even when empty. Sections separate by 64-96px vertical gaps.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|---|
| 0 | Flat, no shadow | Page background, nav |
| 1 | `shadow-soft` — `0 4px 20px -2px rgba(93,112,82,0.15)` (moss tinted) | Default card, hero badge |
| 2 | `shadow-float` — `0 10px 40px -10px rgba(193,140,93,0.2)` (terracotta tinted) | Feature cards, hover state |
| 3 | `shadow-soft-lg` — `0 20px 40px -10px rgba(93,112,82,0.15)` | Active plan card, hero image |
| 4 | `shadow-float-lg` — `0 20px 50px -12px rgba(193,140,93,0.25)` | Modal backdrop, calculator card |
| 5 | `shadow-soft-lg` + increased y-offset | Floating action button |

### Decorative Depth
- **Gradient blobs**: blurred circles (`blur-3xl`) in `{colors.primary}/5%`, `{colors.accent}/5%`, `{colors.leaf-light}/40%` anchor page compositions. They float behind content and provide atmospheric depth.
- **Home page gradient**: `bg-gradient-to-br from-leaf-light/40 via-background to-sun-warm/30` creates a warm, sunlit backdrop on the landing page.
- **Inner pages**: use `bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20` (plans, recipes) or similar combinations.
- **Calculator section**: uses a full-band green gradient (`bg-gradient-to-b from-primary/90 to-primary`) for visual contrast.
- **No border-radius on page-level sections** — cards have radius, page backgrounds are flat.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Page bands, full-width sections |
| `{rounded.sm}` | 8px | Form inputs, small badges |
| `{rounded.md}` | 12px | Quiz option buttons, filter chips (less common) |
| `{rounded.lg}` | 16px | Occasional card variant |
| `{rounded.xl}` | 20px | Rare sub-component radius |
|| `{rounded.2xl}` | 22px | Quiz option buttons |
|| `{rounded.3xl}` | 32px | **Signature card radius** — default for all cards, modals, containers, nav items |
|| `{rounded.4xl}` | 40px | Hero image container |
|| `{rounded.full}` | 9999px | All buttons, tags, icon circles, progress bars |

### Photography Geometry
- Hero image sits inside `{rounded.4xl}` 40px container with Level 3 shadow.
- Logo images are rectangular with no border-radius.
- Recipe emojis and icons are displayed as flat characters with no container.

## Components

### Buttons

**`button-primary`** — the dominant CTA (filled green pill).
- Background `{colors.primary}`, text `{colors.primary-foreground}`, type `{typography.button-md}`, padding 10px 24px, shape `{rounded.full}`.
- Hover: `button-primary-hover` shifts to `{colors.primary-deep}`.
- Used for: "أبدأ الخطة", "أعد الاختبار", "السؤال التالي", "ادخل القسم", "أضف" on trackers, nav CTA, primary actions.

**`button-secondary`** — secondary action (warm gray pill).
- Background `{colors.secondary}`, text `{colors.secondary-foreground}`, type `{typography.button-md}`, padding 10px 24px, shape `{rounded.full}`.
- Hover `button-secondary-hover`: shifts to `{colors.muted}`.
- Used for: "إعادة", "رجوع إلى يومي", secondary CTAs.

**`button-ghost`** — text-only button.
- Transparent background, text `{colors.ink}`, type `{typography.button-md}`, shape `{rounded.full}`.

**`button-destructive`** — destructive action.
- Background `{colors.destructive}`, text `{colors.destructive-foreground}`.

**`icon-button-circle`** — circular 40px icon button.
- Background `{colors.secondary}`, text `{colors.ink}`, shape `{rounded.full}`.
- Hover `icon-button-circle-hover`: shifts to `{colors.primary}` with `{colors.primary-foreground}` text.
- Used for: notification toggle, dark mode toggle, hamburger menu, DidYouKnow nav, quiz nav, recipe favorite heart.
- Also used as `icon-button-circle-blue` (#3B82F6) for water tracker increment button.

### Navigation

**`nav-bar`** — sticky frosted-glass top nav.
- Background `hsla(var(--background) / 0.8)` with `backdrop-filter: blur(12px)`, 1px bottom border of `hsl(var(--border) / 0.5)`. Logo left, 8 nav links center, notification + dark mode + hamburger right.
- Hides on scroll down, shows on scroll up (when past 80px).
- Mobile: nav links collapse into a full list below the bar with `{colors.card}` background.

**`nav-link-active`** — active nav link.
- Text `{colors.primary}` with a 2px bottom border dot in `{colors.primary}`.

**`nav-link-default`** — inactive nav link.
- Text `{colors.ink-muted}`, hover transitions to `{colors.primary}` with `-translate-y-0.5` lift.

### Cards & Containers

**`card-default`** — the universal card.
- Background `{colors.card}`, text `{colors.card-foreground}`, padding `{spacing.lg}` 24px, rounded `{rounded.3xl}` 24px, 1px `{colors.border}`. Used for dashboard trackers, recipe cards, insight charts, filters.

**`card-section-link`** — homepage section card.
- Background `{colors.card}`, padding `{spacing.xl}` 32px, rounded `{rounded.3xl}`. Contains icon, title, description, and CTA link. Hover `card-section-link-hover`: adds `{colors.primary}` border + Level 3 shadow + `-translate-y-1` lift.

**`card-quiz-result`** — quiz result card.
- Background `{colors.card}`, padding `{spacing.xxl}`, rounded `{rounded.3xl}`. Displays percentage, message, score, and reset button.

**`card-dashboard-tracker`** — daily tracker card.
- Background `{colors.card}`, padding 20px, rounded `{rounded.3xl}`. Contains icon + title header, progress bar (optional), and +/- controls.

**`card-pricing`** — plan selector card (inactive).
- Background `{colors.card}`, padding `{spacing.lg}`, rounded `{rounded.3xl}`, border 2px `{colors.border}`.

**`card-pricing-active`** — plan selector card (active).
- Background `{colors.primary}`, text `{colors.primary-foreground}`, padding `{spacing.lg}`, rounded `{rounded.3xl}`, border 2px `{colors.primary}`, Level 3 shadow.

**`card-recipe`** — recipe card.
- Background `{colors.card}`, padding `{spacing.lg}`, rounded `{rounded.3xl}`. Shows emoji, name, calories/cost/time tags. Hover `card-recipe-hover`: adds `{colors.primary}` border + Level 3 shadow.

**`card-insight`** — insight chart card.
- Background `{colors.card}`, padding 20px, rounded `{rounded.3xl}`. Wraps Recharts responsive containers.

**`card-modal`** — recipe detail modal.
- Background `{colors.card}`, padding `{spacing.xl}`, rounded `{rounded.3xl}`, max-w 600px, max-h 85vh with overflow-y-auto. Close + favorite buttons top-left.

### Inputs & Forms

**`text-input`** — range sliders on recipe filters.
- Accent color `{colors.primary}`, 6px height track, 18px thumb.

**`range-slider`** — range sliders on recipe filters.
- Two sliders (calories + cost), styled with `accent-primary` / `accent-accent`.

### Quiz Components

**`quiz-option-default`** — unselected quiz option.
- Rounded `{rounded.2xl}`, border 2px `{colors.border}`, padding `{spacing.md}`. Hover: `hover:border-primary/50 hover:bg-secondary/50`.

**`quiz-option-correct`** — correct answer (shown after selection).
- Background `{colors.primary-soft}`, text `{colors.primary}`, border 2px `{colors.primary}`. Shows green checkmark icon.

**`quiz-option-wrong`** — wrong answer (shown after selection).
- Background `{colors.destructive-soft}`, text `{colors.destructive}`, border 2px `{colors.destructive}`.

**`quiz-progress-bar`** — quiz progress indicator.
- Track `{colors.secondary}`, fill `{colors.primary}`, height 8px, rounded `{rounded.full}`. Animates width with framer-motion.

### Tags & Badges

**`tag-filter-active`** — active filter tag on recipes.
- Background `{colors.primary}`, text `{colors.primary-foreground}`, type `{typography.micro}`, rounded `{rounded.full}`.

**`tag-filter-default`** — inactive filter tag.
- Background `{colors.secondary}`, text `{colors.ink}`, rounded `{rounded.full}`.

**`tag-recipe`** — recipe meta tag (calories, cost, time).
- Background `{colors.secondary}`, text `{colors.ink}`, type `{typography.micro}`, rounded `{rounded.full}`.

**`tag-category`** — DidYouKnow / quiz category tag.
- Background `{colors.primary-soft}`, text `{colors.primary}`, type `{typography.micro}`, rounded `{rounded.full}`.

### Streak

**`streak-badge`** — streak indicator on dashboard.
- Gradient `linear-gradient(to left, {colors.accent}/20%, {colors.accent}/5%)`, text `{colors.accent}`, type `{typography.button-sm}`, 1px `{colors.accent}/30%` border, rounded `{rounded.full}`.

### Progress

**`progress-bar`** — used in plans page.
- Track `{colors.secondary}`, fill `{colors.primary}`, height 8px, rounded `{rounded.full}`. Uses shadcn/ui `<Progress />` component.

### Decorative Sections

**`hero-section`** — homepage hero.
- Centered, padding `{spacing.huge} {spacing.lg}`. Contains animated badge (rounded-full pill on card bg), display-xxl heading with green-accent span, body-lg paragraph, and hero image in `{rounded.4xl}` container.

**`page-hero`** — inner page hero (reusable component).
- Centered, padding 48px 24px. Contains optional badge pill with icon, heading in `{typography.display-xl}` `{colors.primary}`, optional subtitle in `{typography.body-lg}` `{colors.ink-muted}` max-w-60ch.

**`gradient-blob`** — decorative blurred circle behind content.
- Used on homepage (top-right 400px primary/5%, bottom-left 300px accent/5%) and inner pages.

### Footer

**`footer`** — site-wide footer.
- Background `{colors.ink}` (#2C2C24), all text white. Logo centered, description, email link, copyright line. Top border divider at `white/10%`.

### Floating Action Button

**`assistant-fab`** — fixed bottom-left AI assistant button.
- Background `{colors.primary}`, text `{colors.primary-foreground}`, rounded `{rounded.full}`, 56px diameter. Has a pulsing glow ring (`blur-xl bg-primary/40`) and hover tooltip ("مساعد وعي").

## Do's and Don'ts

### Do
- Use organic card radii with `rounded-[2rem]` base and asymmetric corner variations — the brand's most consistent shape signature.
- Keep card borders at 1px `{colors.border}` at 50% opacity — the hairline is part of the warm surface aesthetic.
- Use `{rounded.full}` for all buttons — pill shapes are non-negotiable.
- Render all headings at weight 700 (bold). No lighter display weights.
- Apply 1.9 line-height to all body text — the generous leading is the brand's typographic signature.
- Use framer-motion for page transitions (fade + translateY 20px, 0.4s) and scroll-triggered reveals.
- Decorate pages with gradient blobs (blurred circles with organic border radii in primary/accent/secondary tints).
- Apply the global grain texture — the noise overlay at 4% opacity with multiply blend mode is essential for the tactile feel.
- Use the warm rice paper `{colors.canvas}` as the default background — it sets the earthy, organic tone.
- Apply the homepage background gradient (`from-leaf-light/40 via-background to-sun-warm/30`) for a warm, sunlit feel.
- Use the green gradient band (`from-primary/90 to-primary`) for the calculator section to create visual contrast.
- Use soft tinted shadows (`shadow-soft` with moss green tint, `shadow-float` with terracotta tint) instead of pure black shadows.
- Add hover micro-interactions: `hover:scale-105` on buttons, `hover:-translate-y-1` on cards, `hover:rotate-1` on testimonial cards.
- Use varied section backgrounds (off-white, stone tint, sand tint, moss green, terracotta) for visual rhythm.

### Don't
- Don't use square corners on cards — minimum `rounded-[2rem]` on all containers.
- Don't use weight below 700 for headings — the brand's voice is bold.
- Don't reduce body line-height below 1.8 — the generous leading is intentional.
- Don't add monospace or code typography — the brand is consumer-facing, not developer-facing.
- Don't use authentication or database for user data — localStorage is the storage layer.
- Don't introduce atmospheric gradients on every section — use them sparingly (homepage, calculators).
- Don't make buttons square — pill shape is the brand's button signature.
- Don't use LTR layout — all content is RTL.
- Don't use true black (#000) for text — always use the warm `{colors.ink}` (#2C2C24).
- Don't use dark cards on light mode or vice versa — the light/dark theme is a full system toggle.
- Don't use harsh transitions — all motion should be eased with duration 300-700ms for organic feel.
- Don't use blue-navy tones in dark mode — the dark theme uses warm deep browns (#1A1915 base).

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | ≥ 1024px | Full nav; 3-col grids; full hero display size |
| Tablet | 768–1023px | 2-col grids; nav still horizontal |
| Mobile | < 768px | 1-col grids; hamburger nav; display drops 60px → 36px |

### Touch Targets
- All icon buttons are 40×40px minimum.
- Increment/decrement buttons are 40×40px minimum.
- Primary CTAs are 48px minimum height.
- Range slider thumbs are 18px (touch-compatible).

### Collapsing Strategy
- Display-xxl 60px drops to display-xl 48px on tablet, display-lg 36px on mobile.
- Homepage section cards: 3-col → 2-col → 1-col.
- Dashboard trackers: 3-col → 2-col mobile portrait (certainly 1-col on narrow screens).
- Recipe cards: 3-col → 2-col → 1-col.
- Plan selector: 3-col → 1-col.
- Insight charts: 2-col grid collapses to single column.
- Nav: full link row at desktop → hamburger + mobile overlay at < 768px.

### Image Behavior
- Hero image uses `w-full h-auto` with max 1200px width — fluid scaling.
- Logo images have fixed container sizes (`h-24 md:h-32 w-24 md:w-32`) with `object-contain`.
- No `srcset` or art-direction cropping is used.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. Default card style: `bg-card border border-border rounded-3xl p-5`.
3. Default body: `{typography.body-md}` at weight 400, line-height 1.9, RTL.
4. Default heading: `{typography.heading-lg}` weight 700 with `tracking-tight`.
5. All buttons should be `rounded-full` pills.
6. Add framer-motion `initial/animate` with fade-in-up for new components.
7. Decorate with gradient blobs on new pages (primary/10 + accent/10 blurred circles).
8. Dark mode: use the `.dark` class on `<html>` and test all new components.
9. Store user data in localStorage via `dailyStorage.ts` helpers — never use a database.
10. Run `npx tailwindcss` to verify no unused custom classes.

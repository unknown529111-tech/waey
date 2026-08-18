# Waey — Full Frontend Design Specification

> Current state of the codebase after the cinematic redesign.
> This document captures every shared component, style layer, page, and
> design token so any agent (or human) can continue the work without guesswork.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Tech Stack](#2-tech-stack)
3. [File Structure](#3-file-structure)
4. [Typography System](#4-typography-system)
5. [Color Tokens](#5-color-tokens)
6. [Animations](#6-animations)
7. [Shared Components (New)](#7-shared-components-new)
8. [Shared Components (Unchanged)](#8-shared-components-unchanged)
9. [Pages](#9-pages)
10. [Layout Shell](#10-layout-shell)
11. [New Style Files](#11-new-style-files)
12. [What Changed Per File](#12-what-changed-per-file)
13. [Design Rules](#13-design-rules)
14. [Known Gaps / Next Steps](#14-known-gaps--next-steps)

---

## 1. Design Philosophy

The redesign moves Waey from a **warm nature app** (blob backgrounds, gradient washes, playful cards) to a **cinematic editorial** feel:

- **Full-bleed video hero** on the homepage with serif display type.
- **Clean white space** on inner pages — no more colored gradient overlays.
- **Minimal chrome** — the navbar and footer are stripped down, nearly invisible.
- **Two font stacks** — a serif display stack for headings (Instrument Serif / Amiri) and a clean sans-serif for body (Inter / Alexandria).
- **CSS-first animations** — the hero and PageHero use CSS `@keyframes` instead of Framer Motion. Inner-page micro-interactions still use Framer Motion.

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + custom CSS layers |
| UI Kit | shadcn/ui |
| Motion | Framer Motion (micro-interactions) + CSS keyframes (entrance) |
| Routing | React Router v6, lazy-loaded pages |
| i18n | Custom context, `ar.ts` / `en.ts` flat key maps (~1,770 lines each) |
| State | React Context (Auth, Language, Theme) + TanStack Query |
| Storage | localStorage-first + IndexedDB (user data), Supabase (contact form, AI chat proxy, cloud backup) |
| PWA | Service Worker (`swRegister.ts`), offline queue, install prompt |
| PDF | jsPDF + Amiri embedded fonts |
| Testing | Vitest, 22 test files |

---

## 3. File Structure

```
frontend/waey/src/
├── App.tsx                    # Routes, providers, RequireAuth
├── main.tsx                   # Entry — loads index.css + fonts.css + theme.css
├── index.css                  # Tailwind base + full design system (colors, cards, buttons, etc.)
├── vite-env.d.ts
│
├── styles/                    # NEW — cinematic layer
│   ├── fonts.css              # Google Fonts (Instrument Serif, Inter) + local Amiri
│   └── theme.css              # Font stacks, body font, fade-rise animations, reduced-motion
│
├── assets/
│   ├── logo-waey.png
│   ├── logo-waey-dark.png
│   └── fonts/
│       ├── Amiri-Regular.ttf
│       └── Amiri-Bold.ttf
│
├── components/                # 50+ components
│   ├── HeroSection.tsx        # REDesigned — cinematic hero with video + CTA
│   ├── HeroVideoBackground.tsx# NEW — full-bleed looping video
│   ├── PageHero.tsx           # REDesigned — serif headings, CSS animations
│   ├── Navbar.tsx             # REDesigned — minimal, transparent, smaller logo
│   ├── Footer.tsx             # REDesigned — clean, small logo, pill-less links
│   ├── Layout.tsx             # Unchanged — shell with BlobBackground, Framer page transitions
│   └── ... (see §8)
│
├── pages/                     # 16 pages
│   ├── Index.tsx              # REDesigned — hero only, no sections grid
│   ├── Health.tsx             # Gradient removed, DidYouKnow removed
│   ├── Finance.tsx            # Gradient removed
│   ├── Environment.tsx        # Gradient removed
│   ├── Education.tsx          # Gradient removed
│   ├── Assistant.tsx          # Gradient untouched (AI chat page)
│   ├── Dashboard.tsx          # Gradient untouched (daily tracker)
│   ├── Insights.tsx           # Gradient removed
│   ├── Recipes.tsx            # Gradient removed
│   ├── Quiz.tsx               # Gradient removed
│   ├── Plans.tsx              # Gradient removed
│   ├── Faq.tsx                # Gradient removed
│   ├── Privacy.tsx            # Gradient removed
│   ├── Terms.tsx              # Gradient removed
│   ├── Admin.tsx              # Untouched
│   └── NotFound.tsx            # Untouched
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   ├── ThemeContext.tsx
│   └── useLanguage.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── use-mobile.tsx
│   ├── usePwaInstall.ts
│   ├── useStreak.ts
│   ├── useTheme.ts
│   └── useLiquidGlass.ts
│
├── lib/                       # 22 utility modules
│   ├── analytics.ts
│   ├── dailyStorage.ts
│   ├── favorites.ts
│   ├── gamification.ts
│   ├── sanitize.ts
│   ├── share.ts
│   ├── sounds.ts
│   ├── streak.ts
│   ├── supabaseStorage.ts
│   ├── swRegister.ts
│   └── ...
│
├── supabase/
│   ├── client.ts
│   └── types.ts
│
├── data/
│   ├── recipes.ts
│   ├── hospitals.ts
│   └── ...
│
├── locales/
│   ├── ar.ts                  # +1 new key: hero.cta
│   └── en.ts                  # +1 new key: hero.cta
│
└── test/                      # 22 test files
```

---

## 4. Typography System

### Font Stacks (`src/styles/fonts.css` + `theme.css`)

| Role | LTR | RTL |
|------|-----|-----|
| **Display / Headings** | `"Instrument Serif", "Amiri", "Alexandria", serif` | `"Amiri", "Instrument Serif", "Alexandria", serif` |
| **Body** | `"Inter", "Alexandria", sans-serif` | `"Alexandria", "Inter", sans-serif` |
| **Old base (index.css)** | `"Alexandria", sans-serif` (all headings h1–h6, weight 800) | same |

### Usage Classes

| Class | Applied to |
|-------|-----------|
| `.font-display` | Hero h1, PageHero h1 — big serif headings |
| `.font-body` | Hero description, PageHero subtitle, Navbar links, Footer text, CTA button |

### Heading Sizes

| Context | Classes |
|---------|---------|
| **Homepage hero h1** | `font-display font-normal text-5xl sm:text-7xl md:text-8xl`, line-height: 0.95, letter-spacing: -2.46px |
| **PageHero h1** | `font-display font-normal text-4xl sm:text-6xl md:text-7xl`, line-height: 1.05, tracking-tight |
| **PageHero subtitle** | `font-body text-base sm:text-lg text-muted-foreground` |
| **PageHero badge** | `font-body text-xs font-medium` |
| **Inner section h2** (unchanged) | `text-2xl md:text-3xl font-bold` (Alexandria 800 via index.css base) |
| **Inner section h3** (unchanged) | `font-bold text-lg` or `font-bold text-sm` |

> **Note:** There is a style conflict. `index.css` sets `h1–h6` to Alexandria weight 800 globally. The new `.font-display` class overrides this on hero/PageHero headings. Inner-page h2/h3 headings still use the old Alexandria 800 style. A future pass should update inner headings to use `.font-display` as well for consistency.

---

## 5. Color Tokens

All defined in `index.css` CSS custom properties. Unchanged by the redesign.

### Light Mode

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `40 30% 97%` | Cream linen paper |
| `--foreground` | `42 16% 16%` | Warm dark ink |
| `--primary` | `92 22% 30%` | Moss green |
| `--primary-foreground` | `60 18% 96%` | Light text on primary |
| `--secondary` | `28 55% 40%` | Deeper green |
| `--muted` | `36 24% 90%` | Light neutral surface |
| `--muted-foreground` | `38 12% 44%` | Muted text |
| `--accent` | `34 42% 84%` | Ochre / sand |
| `--card` | `44 44% 99% / 0.55` | Frosted glass card |
| `--border` | `36 22% 82%` | Subtle border |
| `--water` | `200 42% 38%` | Sea-glass blue |
| `--leaf-light` | `96 32% 91%` | Light green blob |
| `--sun-warm` | `40 36% 90%` | Warm amber blob |

### Dark Mode

| Token | HSL |
|-------|-----|
| `--background` | `40 10% 9%` |
| `--foreground` | `42 12% 86%` |
| `--primary` | `40 32% 72%` |
| `--card` | `40 8% 14% / 0.5` |
| `--border` | `38 9% 20%` |

### Gradient Blobs (body background, `index.css`)

Six radial gradients fixed to the viewport create the warm ambient background:
- Water-soft top-right
- Leaf-light top-right, top-left
- Sun-warm bottom-left, center, bottom-right

These persist on all pages (they're on `<body>`). The per-page gradient overlays (`from-leaf-light/40 via-background to-sun-warm/20`) have been **removed** from 11 inner pages.

---

## 6. Animations

### CSS Animations (`src/styles/theme.css`)

```css
@keyframes fade-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

| Class | Delay | Used on |
|-------|-------|---------|
| `.animate-fade-rise` | 0s | Hero h1 wrapper, PageHero badge |
| `.animate-fade-rise-delay` | 0.2s | Hero description, PageHero h1 |
| `.animate-fade-rise-delay-2` | 0.4s | Hero CTA button, PageHero subtitle |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-rise,
  .animate-fade-rise-delay,
  .animate-fade-rise-delay-2 {
    animation: none;
  }
}
```

The hero video also respects `prefers-reduced-motion` — shows a static first frame instead of autoplaying.

### Framer Motion (still used)

| Location | Animation |
|----------|-----------|
| `Layout.tsx` | Page transitions: fade + translateY 20px, 0.4s, AnimatePresence |
| `Navbar.tsx` | Auth button scale, mobile drawer slide |
| Inner pages | `whileInView` section reveals (opacity + y) |
| Cards | `whileInView` staggered fade-up |

---

## 7. Shared Components (New / Redesigned)

### 7.1 HeroSection (`src/components/HeroSection.tsx`)

**What it renders:**
```
┌──────────────────────────────────────────┐
│  [BlobBackground] [BlurVignette]         │
│  [HeroVideoBackground — full-bleed video]│
│                                          │
│           ازرع عاداتك اليوم،              │
│     واحصد حياة متوازنة غداً.             │
│                                          │
│   Waey guides you step by step...         │
│                                          │
│          [ ابدأ رحلتك → ]                │
│                                          │
└──────────────────────────────────────────┘
```

**Key details:**
- Full-viewport header (`overflow-hidden`), no max-width constraint on the heading.
- Heading: `font-display`, `text-8xl` on desktop, line-height 0.95, letter-spacing -2.46px.
- Second line of heading is `text-muted-foreground`.
- CTA is a `rounded-full` primary pill linking to `/quiz` with `ArrowLeft` icon.
- All three elements use staggered `animate-fade-rise` CSS animations.
- Fires `hero_cta_click` analytics event on click.

### 7.2 HeroVideoBackground (`src/components/HeroVideoBackground.tsx`) — NEW

**What it does:**
- Full-bleed looping video behind the hero text.
- Fades in/out smoothly at loop points via `requestAnimationFrame`.
- Dark tint overlay (0.35 opacity) + top/bottom gradient to ensure text readability.
- `aria-hidden="true"` — decorative.
- `disablePictureInPicture` — prevents users from popping out the background video.
- Video URL configurable via `VITE_HERO_VIDEO_URL` env var.
- `prefers-reduced-motion`: shows static first frame, no autoplay.

**Props:** None (standalone).

### 7.3 PageHero (`src/components/PageHero.tsx`) — Redesigned

**Used by 11 pages:** Health, Finance, Environment, Education, Recipes, Quiz, Plans, Faq, Assistant, Privacy, Terms.

**What changed:**
| Before | After |
|--------|-------|
| Framer Motion `initial/animate` | CSS `animate-fade-rise` chain |
| `text-4xl md:text-6xl font-bold text-primary` | `font-display font-normal text-4xl sm:text-6xl md:text-7xl text-foreground` |
| `py-12` | `pt-14 pb-10` |
| `max-w-[60ch]` | `max-w-4xl` |
| `text-primary` (green heading) | `text-foreground` (ink heading) |
| `badge` prop ignored | Badge pill rendered above heading |
| `line-height: 1.22` (global) | `line-height: 1.05` (tight editorial) |
| No `icon` rendered | `icon` rendered inside badge pill |

**Props:**
```ts
interface PageHeroProps {
  title: ReactNode;
  subtitle?: string;
  icon?: ReactNode;      // Now rendered inside badge
  badge?: string;        // Now rendered as pill above heading
  titleClass?: string;   // Appended to h1 className
  subtitleClass?: string;// Appended to p className
}
```

### 7.4 Navbar (`src/components/Navbar.tsx`) — Redesigned

**What changed:**
| Before | After |
|--------|-------|
| Logo `h-24` | Logo `h-12` |
| Scrolled: glass gradient + heavy shadow | Scrolled: `bg-background/75 backdrop-blur-2xl border-b border-border/50` |
| Nav links: `bg-white/50 dark:bg-white/10` active pill | Active: `text-foreground font-bold`, Inactive: `text-muted-foreground` |
| Links had `px-4 py-2` + `shadow` | Links: `px-3 py-2`, minimal |
| Language button: `btn btn-glass` | Plain `rounded-full px-3 py-2 text-sm` |
| Font: default (Alexandria) | `font-body` on all text |
| Desktop gap: `gap-1` | `gap-2` |

**Unchanged:** Mobile drawer (Framer Motion slide-in), Auth modal integration, Search modal.

### 7.5 Footer (`src/components/Footer.tsx`) — Redesigned

**What changed:**
| Before | After |
|--------|-------|
| Logo `h-36` | Logo `h-12` |
| `px-4 sm:px-6 lg:px-8` | `px-8` |
| Link pills: `bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10` | Clean text links: `px-4 py-2 rounded-full`, no bg/border |
| `text-xs` | `text-sm` |
| `max-w-7xl` container | Same |
| No landmark | `<nav aria-label>` added |
| Inline SVGs had colored fills | Neutral fills (inherits `text-white/60`) |
| Copyright: `text-white/40` | Same (but uses `font-body`) |

---

## 8. Shared Components (Unchanged by Redesign)

These components were **not modified** and retain their original design:

| Component | Purpose |
|-----------|---------|
| `Layout.tsx` | App shell — Navbar, Outlet, Footer, BlobBackground, page transitions |
| `BlobBackground.tsx` | Decorative blurred gradient circles |
| `BlurVignette.tsx` | Frosted glass edge vignette |
| `AIChat.tsx` | AI chat interface |
| `AssistantFab.tsx` | Floating AI assistant button |
| `AuthModal.tsx` | Sign in / Sign up modal |
| `SearchModal.tsx` | Global search |
| `ThemeToggle.tsx` | Light/dark toggle switch |
| `StreakDisplay.tsx` | Gamification streak counter |
| `BadgeShowcase.tsx` | Achievement badges |
| `ErrorBoundary.tsx` | React error boundary |
| `OfflineIndicator.tsx` | Offline status bar |
| `PwaInstallPrompt.tsx` | PWA install banner |
| `EmergencyAccess.tsx` | Emergency contacts |
| `SEO.tsx` | Meta tags |
| `NavLink.tsx` | Styled nav link |
| `OnboardingModal.tsx` | First-visit onboarding |
| `OnboardingOverlay.tsx` | Onboarding overlay |
| `WhatsNewModal.tsx` | Changelog modal |
| `NotificationSettings.tsx` | Notification preferences |
| `BackupModal.tsx` | Data backup |
| `StreakRecoveryModal.tsx` | Streak recovery |
| `ReportPrintModal.tsx` | PDF report |
| `QuickTips.tsx` | Daily rotating tips |
| `BreathingExercise.tsx` | Guided breathing |
| `HealthCalculator.tsx` | Sugar intake calculator |
| `CalorieCalculator.tsx` | TDEE/BMR calculator |
| `SleepCycleCalculator.tsx` | Sleep cycle optimizer |
| `WaterCalculator.tsx` | Hydration calculator |
| `EgyptianPlate.tsx` | Healthy Egyptian food plate |
| `OfficeHealth.tsx` | Desk/eye health tips |
| `FirstAidGuide.tsx` | Emergency first aid |
| `SleepHygiene.tsx` | Sleep tips |
| `DigitalWellness.tsx` | Screen time / dopamine detox |
| `CheckupsTable.tsx` | Periodic health checkup schedule |
| `HospitalFinder.tsx` | Egyptian hospital directory (89 hospitals) |
| `Calculators.tsx` | Finance calculators wrapper |
| `FinanceFeatures.tsx` | Finance tips and tools |
| `EducationFeatures.tsx` | Study methods, VARK test |
| `EnvironmentalContent.tsx` | Recycling, energy tips |
| `RecycleSection.tsx` | Recycling guide |
| `VarkTest.tsx` | VARK learning style quiz |
| `AwarenessQuiz.tsx` | General awareness quiz |
| `DidYouKnow.tsx` | **Now unused** — removed from Health page, still in codebase |

---

## 9. Pages

### 9.1 Index (`/`) — Redesigned

**Before:** Hero + "Explore Sections" card grid (5 cards) + AskSection contact form.
**After:** Hero only (video + heading + description + CTA button).

```tsx
// Minimal — just the hero
<div className="relative">
  <HeroSection />
</div>
```

The explore cards and AskSection are removed from the homepage. `AskSection` component still exists for potential reuse.

### 9.2 Health (`/health`)

- Gradient overlay **removed**.
- `DidYouKnow` component **removed** (import + usage deleted). The `DidYouKnow.tsx` file remains in codebase.
- PageHero now renders with the new serif style + badge.
- All sub-components (QuickTips, HealthCalculator, BreathingExercise, etc.) unchanged.

### 9.3 Finance (`/finance`)

- Gradient overlay **removed**.
- PageHero + all FinanceFeatures/Calculators unchanged.

### 9.4 Environment (`/environment`)

- Gradient overlay **removed**.
- PageHero + EnvironmentalContent unchanged.

### 9.5 Education (`/education`)

- Gradient overlay **removed**.
- PageHero + EducationFeatures unchanged.

### 9.6 Other Pages (gradient removed only)

- **Recipes** (`/recipes`) — gradient removed.
- **Quiz** (`/quiz`) — gradient removed.
- **Plans** (`/plans`) — gradient removed.
- **Faq** (`/faq`) — gradient removed.
- **Privacy** (`/privacy`) — gradient removed.
- **Terms** (`/terms`) — gradient removed.
- **Insights** (`/insights`) — gradient removed.

### 9.7 Unchanged Pages

- **Dashboard** (`/dashboard`) — untouched.
- **Assistant** (`/assistant`) — untouched.
- **Admin** (`/admin`) — untouched (1,061 lines, largest page).
- **NotFound** (`/404`) — untouched.

---

## 10. Layout Shell

`Layout.tsx` — **unchanged**. Wraps all pages with:

```
┌──────────────────────────────────┐
│ [Skip to content] (sr-only)      │
│ [BlobBackground — 3 blobs]       │
│ [Navbar — fixed top]             │
│ ┌──────────────────────────────┐ │
│ │ <main> (Framer page          │ │
│ │  transition: fade+y 20px)   │ │
│ │  pt-16 (navbar offset)       │ │
│ │                              │ │
│ │  <Outlet /> ← page content  │ │
│ │                              │ │
│ └──────────────────────────────┘ │
│ [Footer]                         │
│ [AssistantFab]                   │
│ [StreakDisplay]                  │
│ [OfflineIndicator]               │
│ [PwaInstallPrompt]               │
│ [EmergencyAccess]                │
└──────────────────────────────────┘
```

---

## 11. New Style Files

### `src/styles/fonts.css`

Loaded in `main.tsx` before `index.css`.

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');

/* Local Amiri (used for RTL display headings and Arabic PDF export) */
@font-face { font-family: "Amiri"; src: url("../assets/fonts/Amiri-Regular.ttf"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Amiri"; src: url("../assets/fonts/Amiri-Bold.ttf"); font-weight: 700; font-display: swap; }
```

### `src/styles/theme.css`

Loaded in `main.tsx` after `index.css`. Provides:

1. **Fade-rise animation keyframes** + 3 stagger classes.
2. **Font stack classes**: `.font-display` and `.font-body` with RTL variants.
3. **Global body font**: Inter (LTR) / Alexandria (RTL).
4. **Reduced motion**: disables all fade-rise animations + video autoplay.

---

## 12. What Changed Per File

### New Files
| File | Description |
|------|-------------|
| `src/components/HeroVideoBackground.tsx` | Full-bleed looping video with fade loop + reduced-motion |
| `src/styles/fonts.css` | Google Fonts import + local Amiri @font-face |
| `src/styles/theme.css` | Font stacks, animations, reduced-motion |

### Modified Files
| File | Changes |
|------|---------|
| `src/main.tsx` | +2 lines: imports `fonts.css` and `theme.css` |
| `src/components/HeroSection.tsx` | Full rewrite: video bg, serif h1, CTA button, CSS animations |
| `src/components/PageHero.tsx` | Full rewrite: CSS animations, serif font, badge rendering |
| `src/components/Navbar.tsx` | Minimal redesign: smaller logo, transparent→glass, cleaner links |
| `src/components/Footer.tsx` | Minimal redesign: small logo, clean text links, nav landmark |
| `src/locales/ar.ts` | +1 key: `hero.cta` |
| `src/locales/en.ts` | +1 key: `hero.cta` |
| `src/pages/Index.tsx` | Stripped to hero-only (removed explore grid + AskSection) |
| `src/pages/Health.tsx` | Removed gradient overlay + DidYouKnow import/usage |
| `src/pages/Finance.tsx` | Removed gradient overlay |
| `src/pages/Environment.tsx` | Removed gradient overlay |
| `src/pages/Education.tsx` | Removed gradient overlay |
| `src/pages/Recipes.tsx` | Removed gradient overlay |
| `src/pages/Quiz.tsx` | Removed gradient overlay |
| `src/pages/Plans.tsx` | Removed gradient overlay |
| `src/pages/Faq.tsx` | Removed gradient overlay |
| `src/pages/Privacy.tsx` | Removed gradient overlay |
| `src/pages/Terms.tsx` | Removed gradient overlay |
| `src/pages/Insights.tsx` | Removed gradient overlay |

### Unchanged Files
All other components, hooks, lib modules, contexts, data files, tests, and config.

---

## 13. Design Rules

These rules must be followed for any new UI work:

### Typography
- **Display headings** (hero, page titles): use `.font-display` (Instrument Serif / Amiri), `font-normal`, tight line-height (0.95–1.05).
- **Body text**: use `.font-body` (Inter / Alexandria), line-height 1.9.
- **Inner section headings** (h2, h3 within pages): currently still Alexandria 800 (from `index.css` global rule). Target: migrate to `.font-display` for consistency.

### Buttons
- Always `rounded-full` (pill shape). Never square or rounded-md.
- Primary CTA: `bg-primary text-primary-foreground font-body font-bold px-8 py-4 rounded-full`.
- Ghost text: `rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors`.

### Cards
- Default: `rounded-3xl` (32px border-radius). Never square corners.
- The `.ledger` class (one squared corner) is the editorial card style.
- `.glass` / `.bg-card` provide frosted glass backdrop-blur.

### Colors
- Never use raw hex. Always use design tokens (`text-primary`, `bg-muted`, `text-foreground`, etc.).
- Text ink: `text-foreground` (warm dark), never pure black.
- Muted text: `text-muted-foreground`.

### RTL
- All pages are `dir="rtl"`, text-right.
- Font stacks automatically swap for RTL via `[dir="rtl"]` selectors.

### Dark Mode
- All components must work in both light and dark.
- Test with `.dark` class.

### Animations
- Page-level entrance: CSS `.animate-fade-rise` chain (not Framer Motion).
- Micro-interactions (hover, drawer, card reveal): Framer Motion is fine.
- Always respect `prefers-reduced-motion`.

### Accessibility
- Icon-only buttons need `aria-label`.
- Images need `alt`.
- Video backgrounds need `aria-hidden="true"`.
- Interactive elements need focus styles (handled globally via `:focus-visible` in index.css).

---

## 14. Known Gaps / Next Steps

These are open items identified during the redesign:

### High Priority

1. **Hero video URL is temporary** — the CloudFront URL in `HeroVideoBackground.tsx` is a generated link that may expire. Move to permanent hosting and set `VITE_HERO_VIDEO_URL` in `.env`.

2. **Inner headings still use old style** — `index.css` sets all `h1–h6` to Alexandria weight 800 globally. The hero and PageHero override this with `.font-display`, but section headings (h2/h3) on inner pages still look like the old design. Migrate them to `.font-display` or update the global rule.

3. **Section heading color inconsistency** — Some pages use `text-primary` (green) for h2, others use `text-foreground`. Pick one convention (recommendation: `text-foreground` with the new editorial look).

### Medium Priority

4. **Framer Motion still bundled** (127 KB) — the homepage no longer uses it for entrance animations, but other pages still do. If all pages migrate to CSS animations, the dependency could be removed entirely.

5. **`DidYouKnow.tsx` is orphaned** — removed from Health page but file still exists. Either delete it or fix the missing `dYK.*` locale keys and re-add it.

6. **Explore sections removed from homepage** — the 5-card grid (Health, Finance, Environment, Education, Dashboard) and AskSection are gone. Consider adding navigation to these elsewhere (e.g., a minimal section below the hero, or in the Navbar).

7. **`Admin.tsx` is 1,061 lines** — the largest page. Should be split into sub-components for maintainability.

### Low Priority

8. **Locales are flat 1,770-line objects** — consider namespacing per page as they grow.

9. **Missing `aria-label` on many icon-only elements** — only 19 aria attributes across 50+ components. Needs a full accessibility pass.

10. **Footer owner social links** — the LinkedIn and Facebook SVGs for the owner section could use consistent sizing/styling.

---

*Document generated from the live codebase at `frontend/waey/src/`. Last updated: 2026-08-18.*

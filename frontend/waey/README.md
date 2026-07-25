# Waey (وعي) Awareness Platform

> **Waey** is an awareness platform built with Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui. It focuses on health, finance, environment, and education — guiding users through daily habits, calculators, recipes, quizzes, and 30-day plans.

---

## 🎨 Design Philosophy

**Wabi-sabi** — the acceptance of transience and imperfection. The design rejects cold digital precision in favor of **warmth, softness, and natural connection**. Every surface feels tactile, grounded, and calming — like a wellness journal brought to life.

### Color Palette (Warm Nature)
| Token | Light | Dark | Use |
|-------|-------|------|-----|
| **Primary** (Moss Green) | `#5D7052` | `#7BA98F` | CTAs, active states, progress fills |
| **Secondary** (Terracotta) | `#C18C5D` | `#B88960` | Outline buttons, streaks, finance accents |
| **Accent** (Sand) | `#E6DCCD` | `#3A352C` | Subtle surfaces, range tracks |
| **Canvas** | `#FDFCF8` | `#1A1915` | Page background |
| **Card** | `#FEFEFA` | `#22211C` | Card/modal surfaces |
| **Ink (Text)** | `#2C2C24` | `#E8DDD0` | All headings & body |

### Typography
- **Font**: Alexandria (Arabic geometric sans-serif) — weights 300–800
- **Headings**: 700 bold, line-height 1.2–1.4
- **Body**: 400 regular, **line-height 1.9** (generous Arabic readability)
- **Buttons**: 700 bold, pill shape (`rounded-full`)
- **RTL** throughout

### Signature Shapes
- **Cards**: `rounded-3xl` (32px) with organic asymmetric radii variations
- **Buttons**: `rounded-full` (pill) — never square
- **Blob decorations**: blurred gradient circles with organic border radii

---

## 🚀 Quick Start

```bash
# Install dependencies
cd frontend/waey
npm install

# Start dev server
npm run dev
# → http://localhost:8080 (or next available port)

# Build for production
npm run build

# Run tests
npm run test

# Lint
npm run lint
```

---

## 📁 Project Structure

```
frontend/waey/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── AuthModal.tsx    # Custom sign in/up modal
│   │   ├── HeroSection.tsx  # Landing hero
│   │   ├── Navbar.tsx       # Frosted-glass sticky nav
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Custom auth (localStorage)
│   │   ├── LanguageContext.tsx # Arabic/English i18n
│   │   └── ThemeContext.tsx # Light/dark toggle
│   ├── pages/
│   │   ├── Index.tsx        # Home landing
│   │   ├── Dashboard.tsx    # Daily trackers (water, sleep, activity, eco)
│   │   ├── Insights.tsx     # Weekly charts (Recharts)
│   │   ├── Health.tsx       # Calculators, first aid, sleep hygiene
│   │   ├── Finance.tsx      # Budget, electricity, inflation, envelopes
│   │   ├── Environment.tsx  # Natural cleaners, zero-waste, stats
│   │   ├── Education.tsx    # Study methods, focus tools, pomodoro
│   │   ├── Recipes.tsx      # Egyptian recipes with calorie/cost filters
│   │   ├── Quiz.tsx         # Daily 10-question quiz
│   │   ├── Plans.tsx        # 30-day habit plans
│   │   └── ...
│   ├── lib/
│   │   ├── organic.ts       # Organic shape utilities
│   │   ├── dailyStorage.ts  # localStorage helpers
│   │   └── streak.ts        # Streak calculation
│   ├── locales/
│   │   ├── ar.ts            # Arabic translations
│   │   └── en.ts            # English translations
│   ├── App.tsx              # Routes + RequireAuth wrapper
│   └── index.css            # Tailwind + design tokens
├── DESIGN.md                # Complete design specification
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ✨ Features

### 🏠 Home (`/`)
- Hero with animated badge, headline, and nature image
- Prize banner (100 continuity points = 500 EGP)
- 5 section cards: Health, Finance, Environment, Education, Daily Dashboard
- "Ask Waey" CTA section

### 💧 Health (`/health`)
- Water calculator (weight/height/age/activity)
- Sleep cycle calculator (90-min cycles)
- Calorie needs (Mifflin-St Jeor)
- Egyptian Healthy Plate visual
- Deep breathing animation (4-4-6)
- Screen/office health tips (20-20-20, chair exercises, 60/60 audio)
- First aid guide (burns, choking, sugar/pressure drops)
- Sleep hygiene (digital sunset, power nap, food)
- Digital wellness (dopamine detox, notification cleanup)
- Stress relief tips + 5-4-3-2-1 grounding technique

### 💰 Finance (`/finance`)
- Electricity/water cost calculators (EGP tariffs)
- Monthly budget (50/30/20 rule)
- Inflation & value protection (hoarding vs saving vs investing)
- Digital envelope system
- Spending triggers psychology
- Supermarket traps
- No-spend days challenge
- Special budgets: student, freelancer, pre-marriage
- Debt payoff: snowball vs avalanche
- Income boosting: skills, side hustles, negotiation

### 🌱 Environment (`/environment`)
- Natural cleaning alternatives (vinegar, lemon, olive oil)
- Energy/water conservation tips
- Zero food waste recipes (peel broth, stale bread compost, herb oil cubes, banana/orange peel fertilizer)
- Visual environmental stats (plastic, water per shirt, trees cut, cups/minute)
- Recycling/upcycling ideas (glass jars, fabric cloths, tin planters, newspaper wrapping)

### 📚 Education (`/education`)
- Study methods: Pomodoro, Active Recall, Spaced Repetition, Feynman, Mind Maps, Daily 3-task plan
- Focus tips: phone away, 2-min rule, change space, water/breath, brain dump, sleep
- "Feeling lost" encouragement cards
- VARK learning style quiz
- Future motivation section

### 📊 Dashboard (`/dashboard`) — *Requires Auth*
- Daily trackers: Water (cups), Sleep (hours), Activity (min), Eco actions
- +/- increment buttons with localStorage persistence
- Streak counter (consecutive days)

### 📈 Insights (`/insights`) — *Requires Auth*
- Weekly charts (Recharts): water, sleep, expenses, activity/eco
- Expense distribution pie chart
- Sleep/mood correlation
- AI-generated weekly summary

### 🍽️ Recipes (`/recipes`)
- Egyptian recipes with calories, cost (EGP), time, servings
- Tags: vegan, quick, economic, healthy, high-protein
- Filter by max calories & cost
- Favorites (heart icon, localStorage)
- Modal detail view with ingredients & steps

### ❓ Quiz (`/quiz`)
- 10 daily questions (health/finance/environment)
- Progress bar (Framer Motion)
- Immediate feedback with explanations
- Score + encouraging message

### 📅 Plans (`/plans`)
- 30-day habit plans (health, finance, environment, education, mixed)
- Daily check-off with streak tracking
- Progress bar, start/reset controls
- Motivational completion message

### 🤖 Assistant (`/assistant`)
- AI chat via Supabase Edge Function
- Streaming responses
- Suggested prompts

---

## 🔐 Authentication (Custom, localStorage)

No external auth provider. Uses a lightweight custom system:

- **Sign up**: name, email, password (6+ chars)
- **Sign in**: email + password
- **Persistence**: localStorage (`waey-auth`, `waey-users`)
- **Protected routes**: `/dashboard`, `/insights`, `/daily` → redirect to `/` if not authenticated
- **UserButton**: dropdown with email + sign out

---

## 🌐 Internationalization

- **Arabic (RTL)** — default
- **English (LTR)** — toggle in navbar
- All strings in `src/locales/ar.ts` and `en.ts`
- Context: `useLanguage()` → `{ t, lang, setLang, toggleLang }`

---

## 🌙 Light / Dark Theme

- Full CSS custom property system (`index.css`)
- Toggle in navbar (Sun/Moon icon)
- Persists in localStorage (`waey-theme`)
- Dark mode: warm deep brown (`#1A1915`), not blue-navy

---

## 💾 Data Storage

| Data | Storage |
|------|---------|
| User auth | localStorage (`waey-auth`, `waey-users`) |
| Daily trackers | localStorage (`waey-daily-*`) |
| Streaks | localStorage (`waey-streak`) |
| Favorites | localStorage (`waey-favorites`) |
| Plans progress | localStorage (`waey-plans-*`) |
| Quiz history | localStorage (`waey-quiz-*`) |
| Onboarding | localStorage (`waey-onboarding`) |
| Contact form | Supabase (serverless) |
| AI chat | Supabase Edge Function (proxy) |

**No database for user data** — fully offline-capable.

---

## 🧪 Testing

```bash
npm run test           # 79 tests (Vitest + Testing Library)
npm run test:watch     # Watch mode
```

Test coverage: auth, streak, daily storage, favorites, gamification, onboarding, quick wins, AI chat, utils.

---

## 📦 Key Dependencies

| Category | Packages |
|----------|----------|
| **UI** | `@radix-ui/*`, `shadcn/ui`, `tailwindcss`, `tailwindcss-animate`, `clsx`, `class-variance-authority` |
| **Animation** | `framer-motion` |
| **Charts** | `recharts` |
| **Forms** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **Routing** | `react-router-dom` v6 |
| **State/Data** | `@tanstack/react-query`, `date-fns` |
| **Icons** | `lucide-react` |
| **PDF/Export** | `jspdf`, `jspdf-autotable`, `xlsx` |
| **Testing** | `vitest`, `@testing-library/react`, `jsdom` |

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | ESLint check |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Watch mode tests |
| `npm run preview` | Preview production build |

---

## 📐 Design Tokens (Tailwind)

```js
// tailwind.config.js extends with:
colors: {
  primary: "hsl(var(--primary))",      // Moss green
  secondary: "hsl(var(--secondary))",  // Terracotta
  accent: "hsl(var(--accent))",        // Sand
  destructive: "hsl(var(--destructive))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: "hsl(var(--card))",
  muted: "hsl(var(--muted))",
  border: "hsl(var(--border))",
  ring: "hsl(var(--ring))",
  // ... semantic aliases
}
borderRadius: {
  xl: "1rem",      // 16px
  2xl: "1.25rem",  // 20px
  3xl: "2rem",     // 32px — signature card radius
  4xl: "2.5rem",   // 40px — hero image
  full: "9999px",  // pills
}
```

---

## 🎯 Do's & Don'ts (from DESIGN.md)

### Do
- Use `rounded-3xl` (32px) on all cards/containers
- Use `rounded-full` on all buttons (pill shape)
- Heading weight **700** only
- Body **line-height 1.9**
- Framer Motion page transitions (fade + translateY 20px, 0.4s)
- Gradient blobs for atmospheric depth
- Global grain texture (4% opacity, multiply blend)
- Warm rice paper canvas (`#FDFCF8`)
- Soft tinted shadows (moss/terracotta), not pure black

### Don't
- Square corners on cards
- Heading weight below 700
- Body line-height below 1.8
- Monospace/code typography
- Auth/database for user data
- Blue-navy dark mode tones
- Harsh transitions (<300ms or >700ms)
- LTR layout
- True black (`#000`) for text

---

## 🌐 Live Demo

**Production:** [waey-m7.com](https://waey-m7.com)

---

## 📝 Personal Note

This project was from **my own idea and my family's support** — i wanted to create something meaningful for The World and Egypt

I used **AI assistance** (Claude, Opencode, and other tools) to help with the implementation, architecture, and design system. The entire project took **over 2 months** to reach this stage, and I'm actively making updates and improvements.

Every feature, color choice, and interaction was carefully considered with my family's input to make sure it feels right for our community.

---

## 📄 License

Private project — Waey (وعي) platform for Egyptian holistic awareness.

---

## 🙋‍♂️ Author

**Mahmoud Ahmed Mohamed Khalil**  
Founder & Developer of Waey

- Facebook: [waey.official.mk](https://www.facebook.com/profile.php?id=61589322916820)
- LinkedIn: [mahmoud-k](https://www.linkedin.com/in/mahmoud-k-15780939b/)
- Email: waey.official.mk@gmail.com
# Waey (وعي) — Awareness Platform

awareness platform for Egyptian Arabic users. RTL, localStorage-first, zero backend for user data.

Stack: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts.  
Backend: Supabase Edge Functions (contact form + AI chat proxy).  
Domain: https://waey-m7.com



## The idea of the website

An website for health and finance and environment and education. Daily trackers. Streaks. Badges. 30-day plans. Quizzes. Calculators. AI assistant. All in Egyptian Arabic, RTL, with a warm nature palette.

Took 2+ months. Built with AI assistance (Claude, OpenCode). Every choice went through family review — the result is meant for our community, not for investors.

---

## Quick start

```bash
cd frontend/waey
npm install
npm run dev
# → http://localhost:8080
```

| Command | What it does |
|---------|-------------|
| npm run dev | Dev server |
| npm run build | Production build |
| npm run lint | ESLint |
| npm run test | Vitest (79 tests) |
| npm run preview | Preview build |

---

## Pages

| Route | Page | What's there |
|-------|------|-------------|
| `/` | Home | Hero, prize banner, 5 section cards |
| `/health` | Health | BMI/water/sleep/calorie calculators, hospital finder, first aid, Egyptian plate, breathing exercise, office health, checkups |
| `/finance` | Finance | Budget calculator, envelope system, debt payoff, inflation protection, electricity/water cost, special budgets |
| `/environment` | Environment | Natural cleaners, zero-waste, energy/water tips, recycling |
| `/education` | Education | Study methods (Pomodoro, Active Recall, Feynman), focus tips, VARK quiz |
| `/dashboard` | Dashboard | Water/sleep/activity trackers, mood, weight, expenses, daily challenge, gratitude journal, night review, big 3, badges, streak |
| `/insights` | Insights | Weekly charts (Recharts), expense pie, sleep/mood correlation |
| `/recipes` | Recipes | Egyptian recipes with calorie/cost/time filters, favorites |
| `/quiz` | Quiz | 10-question daily quiz with feedback |
| `/plans` | Plans | 30-day habit plans with daily check-off |
| `/assistant` | Assistant | AI chat via Groq (llama-3.3-70b), streaming, Arabic system prompt |
| `/admin` | Admin | Content management, challenge/quote/recipe CRUD |
| `/privacy` | Privacy | Privacy policy |
| `/terms` | Terms | Terms of use |

---

## Architecture

```
User → Component → dailyStorage.ts / gamification.ts
                       ↓
                 localStorage (waey_* keys)
                       ↓
                 offlineQueue → Supabase (optional sync)
```

| Data | Where |
|------|-------|
| Auth | localStorage (plain mock, no real backend) |
| Trackers | localStorage |
| Streaks | localStorage (+ optional Supabase sync) |
| Favorites | localStorage |
| Plans | localStorage |
| Quiz history | localStorage |
| Contact form | Supabase Edge Function → Resend email |
| AI chat | Supabase Edge Function → Groq API |

Supabase is only for contact form and AI proxy. Everything else works offline.


## Design system

Palette: Moss green `#5D7052`, terracotta `#C18C5D`, sand `#E6DCCD`, warm ink `#2C2C24`. Dark mode: warm deep brown base `#1A1915` (not blue-navy).

Font: Alexandria (Arabic geometric sans, 300–800). Headings at 700. Body at 400 with 1.9 line-height.

Shapes: `rounded-3xl` (32px) on all cards. `rounded-full` on all buttons. SVG noise grain overlay at 4% opacity. Blurred gradient blobs as decoration. Tinted shadows (moss/clay), never black.

Motion: Framer Motion page transitions (fade + translateY 20px, 0.4s), scroll-triggered reveals, hover micro-interactions.



## Structure

frontend/waey/
├── src/
│   ├── pages/            16 pages
│   ├── components/       50+ custom + 30 shadcn/ui primitives
│   ├── features/         18 feature widgets (trackers, challenges)
│   ├── lib/              19 utilities (storage, streak, badges, analytics)
│   ├── contexts/         Auth, Theme, Language (ar/en)
│   ├── locales/          ar.ts (1157 keys), en.ts
│   ├── data/             hospitals.ts, recipes.ts
│   ├── hooks/            use-mobile, useStreak
│   ├── supabase/         client.ts, types.ts
│   └── test/             10 test files
├── supabase/
│   ├── functions/        3 Edge Functions (ai-assistant, send-contact, admin-auth)
│   └── migrations/       4 SQL migrations
└── tests/                Playwright E2E



## Edge Functions

| Function | Role | Provider |
|----------|------|----------|
| `ai-assistant`  | AI chat proxy | Groq (llama-3.3-70b), streaming, rate-limited (20 req/min) |
| `send-contact`  | Contact form → email | Resend + DB backup, rate-limited (5 req/min) |
| `admin-auth`    | Admin token auth | HMAC-SHA256, 4-hour expiry, rate-limited (10 req/min) |

---

## Some issues in the website

- Passwords stored in plaintext in localStorage (mock auth, not production-grade)
- Two competing streak systems (`dailyStorage.ts` day-based + `streak.ts` accumulated-time)
- `App.css` contains unused Vite boilerplate
- `src/themes/` is empty
- `backend/supabase/` duplicates `supabase/`
- IndexedDB fallback (`indexedDBStorage.ts`) exists but is never called


## Author
**Mahmoud Ahmed Mohamed Khalil** — founder & developer.  
Student, scout leader, photographer since age 13. Built this to help people improve their lives through small, practical steps.

- Email: waey.official.mk@gmail.com
- Facebook: [waey.official.mk](https://www.facebook.com/profile.php?id=61589322916820)
- LinkedIn: [mahmoud-k](https://www.linkedin.com/in/mahmoud-k-15780939b/)

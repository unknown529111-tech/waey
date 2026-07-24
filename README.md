# Waey (وعي) — Egyptian Arabic Holistic Awareness Platform

<p align="center">
  <img src="frontend/waey/src/assets/logo-waey.png" alt="Waey Logo" width="120" />
</p>

<p align="center">
  <strong>منصة وعي — رحلتك نحو التوازن الشامل في الصحة، المال، البيئة، والتعليم</strong>
</p>

<p align="center">
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠 Tech Stack</a> •
  <a href="#quick-start">🚀 Quick Start</a> •
  <a href="#project-structure">📁 Structure</a> •
  <a href="#contributing">🤝 Contributing</a> •
  <a href="#license">📄 License</a>
</p>

---

## ✨ Features

| Pillar | Description |
|--------|-------------|
| 🏥 **Health** | Water/sleep/steps tracking, calculators (BMI, calories, water), breathing exercises, first aid guide, hospital finder, digital wellness |
| 💰 **Finance** | Expense tracker, budget calculators, savings goals, financial literacy content |
| 🌱 **Environment** | Eco habits, recycling guide, carbon footprint, sustainable living tips |
| 📚 **Education** | VARK learning styles test, study techniques, focus methods, daily quotes |
| 📊 **Dashboard** | Personal analytics, streak tracking, daily challenges, mood/energy journaling |
| 🤖 **AI Assistant** | Arabic-first chat (health/finance/environment/education scope) via Groq llama-3.3-70b |
| 🔐 **Privacy-First** | All user data in localStorage — no auth, no backend database for personal data |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS 3.4, shadcn/ui (Radix UI) |
| **Animations** | Framer Motion 12 |
| **State/Query** | @tanstack/react-query 5, React Router DOM 6 |
| **Charts** | Recharts 2 |
| **Backend** | Supabase Edge Functions (Deno) |
| **Database** | PostgreSQL (Supabase) — contact messages only |
| **Email** | Resend API |
| **AI** | Groq llama-3.3-70b-versatile |
| **Testing** | Vitest + Testing Library, Playwright |
| **Linting** | ESLint 9 (flat config), TypeScript 5.8 |

---

## 🎨 Design System

- **Colors**: Warm nature palette — forest green (`#5D7052`), amber (`#C18C5D`), cream sand (`#FDFCF8`)
- **Typography**: Alexandria font (Google Fonts) — weight 700 headings, 400 body, 1.9 line-height
- **Shapes**: Cards `rounded-3xl` (32px), Buttons `rounded-full` (pill)
- **Motion**: Framer Motion page transitions (fade + translateY 20px, 0.4s ease-out)
- **Theme**: Full light/dark mode with CSS custom properties
- **RTL**: Native right-to-left layout, `dir="rtl"` on `<html>`

See [`frontend/waey/DESIGN.md`](frontend/waey/DESIGN.md) for complete design tokens.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 10+

### Installation

```bash
# Frontend
cd frontend/waey
npm install
npm run dev          # http://localhost:8080
npm run build        # production build to dist/
npm run test         # unit tests (Vitest)
npm run lint         # ESLint
npm run preview      # preview production build
```

```bash
# E2E tests (from repo root)
npm install -D @playwright/test
npx playwright install chromium
cd frontend/waey && npm run dev -- --port 8080 &
npx playwright test
```

### Environment Variables

Copy `frontend/waey/.env.example` to `frontend/waey/.env.local`:

```bash
# Supabase (required for contact form + AI proxy)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# AI Proxy (optional — server-side only)
VITE_AI_PROXY_URL=https://your-project.supabase.co/functions/v1/ai-assistant
```

> **Note**: AI API keys (Groq, OpenRouter) are stored only as Supabase Edge Function secrets — never in frontend code.

---

## 📁 Project Structure

```
Waey - وعي/
├── frontend/waey/              # Vite + React app
│   ├── src/
│   │   ├── components/         # 39 UI components + shadcn/ui
│   │   ├── features/           # 14 daily trackers (water, sleep, mood, etc.)
│   │   ├── pages/              # 14 routes (Home, Health, Finance, etc.)
│   │   ├── contexts/           # Auth, Language (i18n)
│   │   ├── lib/                # 12 utilities (storage, streak, presence, etc.)
│   │   ├── locales/            # ar.ts / en.ts (1085 keys each)
│   │   ├── supabase/           # Client + types
│   │   └── test/               # Vitest unit tests (62 tests)
│   ├── DESIGN.md               # Design tokens (864 lines)
│   └── package.json
├── supabase/                     # Supabase Edge Functions + migrations
│   ├── functions/
│   │   ├── ai-assistant/        # Groq AI chat edge function
│   │   ├── send-contact/        # Resend email + DB insert
│   │   └── admin-auth/          # Admin password auth edge function
│   └── migrations/              # contact_messages, profiles, prize tables + RLS
├── .github/workflows/          # CI/CD (lint, build, test, e2e)
├── tests/                      # Playwright E2E tests
├── LICENSE
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
└── AGENTS.md
```

---

## 🌐 Deployment

The app is a SPA (`BrowserRouter`). For static hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages):

- **Build command**: `cd frontend/waey && npm run build`
- **Output directory**: `frontend/waey/dist`
- **SPA fallback**: Ensure `/*` rewrites to `/index.html`

### Supabase Setup

1. Create Supabase project
2. Run migrations in `supabase/migrations/`
3. Deploy Edge Functions: `supabase functions deploy ai-assistant send-contact`
4. Set secrets: `GROQ_API_KEY`, `RESEND_API_KEY`
5. Add env vars to frontend

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Commit message format
- Branch naming
- Design system compliance (DESIGN.md tokens)
- i18n workflow (ar.ts + en.ts)
- PR checklist

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2026 Mahmoud Ahmed Mohamed Khalil

---

## 🔗 Links

- **Live Demo**: *(add your deployed URL)*
- **Security**: [SECURITY.md](SECURITY.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Issues**: [GitHub Issues](https://github.com/unknown529111-tech/waey/issues)
- **Discussions**: [GitHub Discussions](https://github.com/unknown529111-tech/waey/discussions)

---

<p align="center">
  Made with 🌱 in Egypt
</p>
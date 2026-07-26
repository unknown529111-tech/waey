# Waey (وعي) Awareness Platform

Waey platform help people build better habits in health, finance, education, and environment, all in one place.

[Waey website:](https://waey-m7.com)
## What is Waey?

Waey platform gives users daily tools to track habits, manage money, learn new things, and take care of their mental health. Unlike other apps that focus on only one area
waey have 4 fields and its:
- **Health** — Water tracker, sleep tracker,  weight tracker, sugar calculator, health tips
- **Finance** — Expense tracker, budget planning, saving challenges, financial tips
- **Environment** — Eco habits tracker, recycling tips, energy saving challenges
- **Education** — Daily learning tips, 30-day plans

## Why I built it

I noticed that awareness is decreasing aroud the world and people are becoming more lazy every day and Most awareness apps available today focus on only one field like environment or education only. So I created Waey to have all four fields in one place

## Features

- Daily habit tracking
- Expense tracking with categories
- Streak system with freeze options
- Gamification — points, badges, achievements
- 30-day plans 
- AI assistant
- Daily challenges and quotes
- Night review journal
- Big 3 daily priorities
- Full RTL Arabic support
- Light / dark theme
- Offline support with sync queue
- PDF report export
- PWA — installable on mobile and desktop

## Tech Stack

Frontend:  React , TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
Backend: Supabase
Storage:  Supabase DB
AI:  Groq API
PDF:  jsPDF, jspdf-autotable
Charts:  Recharts
Deploy:  Cloudflare Pages

### Development

## Requirements

Node.js 18+
npm
Supabase account

1. Clone the source code to your device

```sh
git clone https://github.com/unknown529111-tech/waey.git
cd waey
```

2. Install the project's dependencies

```sh
cd frontend/waey
npm install
```

3. Start the development server on `localhost:5173`

```sh
npm run dev
```

4. Build the site to:

```sh
npm run build
```

5. Push database migrations

```sh
supabase db push
```

6. Deploy edge functions

```sh
supabase functions deploy admin-auth
supabase functions deploy ai-assistant
supabase functions deploy send-contact
```

## Project Structure

```
waey/
├── frontend/waey/          # React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Theme, Language)
│   │   ├── features/       # Feature components (trackers, journal, etc.)
│   │   ├── lib/            # Utilities, storage, gamification
│   │   ├── pages/          # Route pages
│   │   ├── supabase/       # Supabase client and types
│   │   └── test/           # Vitest tests
│   └── package.json
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions (admin-auth, ai-assistant, send-contact)
└── README.md
```

## AI uasge

AI was used in this project for:

- **Code generation** — Claude (opencode CLI) was used to write components, hooks, utility functions, and tests
- **Problem solving** — AI helped debug the production white screen caused by circular Vite chunk dependencies, and the AI chat crash from undefined offline response function
- **Database design** — AI assisted in designing the Supabase schema for 16+ tables
- **Refactoring** — AI helped move from localStorage-only to Supabase

## Tests

```sh
npm run test
```

215+ tests across 23 test files covering storage, gamification, streaks, analytics, presence, plans, admin, favorites, rate limiting, and more.

## Author
Mahmoud Ahmed Mohamed Khalil Im 16 years old I love codingz AI and volunteering.

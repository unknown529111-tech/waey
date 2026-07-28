# Waey (وعي) Awareness Platform

Waey helps people build better habits in health, finance, education and the environment, all in one place.

Website: https://waey-m7.com

## What is Waey?

Waey gives users daily tools to track habits, manage money, learn new things and take care of their mental health. Most apps in this space only focus on one area, an environment app or a finance app, never all of them together. Waey covers four fields:

- **Health**: water tracker, sleep tracker, weight tracker, sugar calculator, health tips
- **Finance**: expense tracker, budget planning, saving challenges, financial tips
- **Environment**: eco habits tracker, recycling tips, energy saving challenges
- **Education**: daily learning tips, 30-day plans

## Why I built it

Awareness is dropping everywhere and people are getting lazier by the day. Most awareness apps out there stick to one field, environment only or education only, and I got tired of switching between five apps just to keep track of my own life. So I built Waey to bring all four fields into one place.

## Features

- Daily habit tracking
- Expense tracking with categories
- Streak system with freeze options
- Gamification (points, badges, achievements)
- 30-day plans
- AI assistant
- Daily challenges and quotes
- Night review journal
- Big 3 daily priorities
- Full RTL Arabic support
- Light/dark theme
- Offline support with sync queue
- PDF report export
- PWA, installable on mobile and desktop

## Tech stack

Frontend runs on React, TypeScript, Vite, Tailwind CSS, shadcn/ui and Framer Motion. Backend and storage are on Supabase. The AI assistant calls the Groq API. PDF exports use jsPDF with jspdf-autotable, and charts are built with Recharts. It's deployed on Cloudflare Pages.

## Running it locally

You'll need Node.js 18+, npm and a Supabase account.

Clone it and move into the project:

```sh
git clone https://github.com/unknown529111-tech/waey.git
cd waey/frontend/waey
```

Install and run:

```sh
npm install
npm run dev
```

This starts the dev server on `localhost:5173`. To build for production:

```sh
npm run build
```

For the backend, push the database migrations and deploy the edge functions:

```sh
supabase db push
supabase functions deploy admin-auth
supabase functions deploy ai-assistant
supabase functions deploy send-contact
```

## Project layout

Everything frontend-related lives under `frontend/waey/src`, split into `components` for shared UI, `contexts` for auth/theme/language state, `features` for the actual trackers and journal logic, `lib` for storage and gamification utilities, `pages` for routes, and `supabase` for the client and types. Tests sit in `src/test`. The `supabase/` folder at the root holds the database migrations and the three edge functions (`admin-auth`, `ai-assistant`, `send-contact`).

## AI usage

I used AI while building this, mainly Claude through the opencode CLI, for a few things:

- Writing components, hooks, utility functions and tests
- Debugging a production white screen caused by circular Vite chunk dependencies, and an AI chat crash caused by an undefined offline response function
- Designing the Supabase schema across 16+ tables
- Refactoring the app from localStorage-only to Supabase

## Tests

```sh
npm run test
```

215+ tests across 23 files, covering storage, gamification, streaks, analytics, presence, plans, admin, favorites, rate limiting and more.

## Author

Mahmoud Ahmed Mohamed Khalil. I'm 16, I love coding, AI and volunteering.

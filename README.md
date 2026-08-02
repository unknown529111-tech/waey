# Waey (وعي) Awareness Platform

Waey helps people build better habits in health, finance, education and the environment, all in one place.
<img width="1328" height="622" alt="image" src="https://github.com/user-attachments/assets/99571cc1-8bf2-42ba-97a6-d99e8e64b718" />

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
- points, badges, achievements
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

Frontend runs on React, TypeScript, Vite, Tailwind CSS, shadcn/ui and Framer Motion. Backend and storage are on Supabase. The AI assistant calls the Groq API.

## Running it locally

You need Node.js 18+, npm, Supabase.


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

I built the backend myself, including the Supabase schema across 16+ tables, and I wrote all the content on the site myself. A friend with a UI/UX background helped me fix some interface issues. I also made a lot of manual updates by hand, including fixing several English-language issues in the site copy.

Where I did use AI, mainly Claude through the opencode CLI, was for a smaller part of the work:

- Some frontend components
- Test scaffolding across the 23 test files
- Debugging two specific bugs: a white screen in production caused by circular Vite chunk dependencies, and a chat crash caused by an undefined offline response function

## Tests

```sh
npm run test
```

215+ tests across 23 files, covering storage, gamification, streaks, analytics, presence, plans, admin, favorites, rate limiting and more.

## Author

Mahmoud Ahmed Mohamed Khalil. I'm 16 years old, I love coding, AI, volunteering and my beloved contury Egypt

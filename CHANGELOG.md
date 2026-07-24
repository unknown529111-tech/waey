# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI pipeline (lint, typecheck, build, unit tests, e2e)
- Dependabot weekly updates
- MIT License, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md
- .prettierrc, .prettierignore, .nvmrc, .gitattributes
- .editorconfig for consistent editor settings

### Fixed
- 17 ESLint errors (no-empty, no-empty catch blocks, no-explicit-any, no-useless-escape)
- Failing Vitest test: daily challenge area key assertion
- Playwright baseURL mismatch (5173 → 8080)
- Removed duplicate eslint.config.mjs and bun.lock
- Removed hardcoded Groq API key from edge function (env-var only)
- Tightened Supabase RLS on profiles table (email-scoped insert/update)
- Removed vendored .opencode/.agents/agentskills-docs (117 files)
- Removed Hospitals data/ source scripts from tracking
- Removed screenshot bloat from git tracking

### Changed
- Split LanguageContext hooks to useLanguage.ts for Fast Refresh
- Updated all 52 imports from @/contexts/LanguageContext → @/contexts/useLanguage
- Updated AGENTS.md paths from `waey - Copy/` → `frontend/waey/`

## [0.1.0] - 2026-07-19

### Added
- Initial release of Waey (وعي) — Egyptian Arabic holistic awareness platform
- 14 pages: Home, Health, Finance, Environment, Education, Dashboard, Insights, Recipes, Plans, Quiz, Assistant, Admin, DesignAgency, NotFound
- 14 daily trackers: Water, Sleep, Steps, Mood, Eco, Expenses, Gratitude, Mental Energy, Daily Big 3, Weight, Simple Tracker, Night Review, Daily Challenge, Daily Quote
- Full Arabic/English i18n (1085+ keys each)
- Supabase Edge Functions: AI Assistant (Groq llama-3.3-70b), Contact Form (Resend)
- LocalStorage-first architecture (no auth, no user DB)
- Framer Motion page transitions
- Tailwind + shadcn/ui + Alexandria font design system
- Dark/Light theme toggle
- Streak system with freeze logic
- Admin panel (user metrics, streaks, prize tracking)
- Unit tests (Vitest, 62 tests) + E2E (Playwright)

---

## Release Checklist

- [ ] All CI checks pass
- [ ] CHANGELOG.md updated
- [ ] Git tag created (`v0.1.0`)
- [ ] GitHub Release published
- [ ] Deploy to production
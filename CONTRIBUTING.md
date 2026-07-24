# Contributing to Waey

Thank you for your interest in contributing! 🌱

## Ways to Contribute

- **Bug reports** — Use the bug report template
- **Feature requests** — Use the feature request template
- **Translations** — Help keep Arabic/English in sync (1000+ keys)
- **Code** — Fix bugs, add features, improve performance
- **Design** — UI polish, accessibility, design tokens
- **Documentation** — README, docs, code comments

## Development Setup

```bash
# Frontend
cd frontend/waey
npm install
npm run dev      # http://localhost:8080
npm run build    # production build
npm run test     # unit tests
npm run lint     # ESLint
```

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `i18n`, `refactor`, `perf`, `docs`, `chore`, `test`, `build`, `style`

Examples:
- `feat(finance): add expense category chart`
- `fix(auth): handle session expiry on refresh`
- `i18n: add missing en keys for challenge area`
- `chore(deps): bump recharts to 2.15`

## Pull Request Process

1. **Branch from `main`** — `feat/your-feature` or `fix/your-fix`
2. **Run checks locally** — `npm run lint && npm run test && npm run build`
3. **Open PR** — Use the PR template
4. **CI must pass** — Lint, typecheck, build, unit tests, e2e tests
5. **One review required** — Maintainer approval
6. **Squash merge** — Linear history

## Code Style

- **TypeScript strict** — No `any` unless explicitly justified
- **ESLint + Prettier** — Enforced via CI
- **Design tokens** — Use `DESIGN.md` values (colors, spacing, typography)
- **RTL first** — All text right-to-left, `dir="rtl"` on `<html>`
- **Accessibility** — Semantic HTML, ARIA labels, focus management

## Translation Workflow

1. Add/modify keys in `src/locales/ar.ts` and `src/locales/en.ts` simultaneously
2. Use existing key patterns (`feature.subfeature.key`)
3. Run `npm run test` — i18n tests verify key parity
3. No hardcoded Arabic/English in components — always use `t('key')`

## Design System

See `frontend/waey/DESIGN.md` for:
- Color palette (light/dark)
- Typography scale (Alexandria font, weight 700 headings, 400 body, 1.9 line-height)
- Spacing scale (4px base)
- Border radius (rounded-3xl = 32px cards, rounded-full = pills)
- Motion (fade + translateY 20px, 0.4s)
- Shadows (tinted: moss green, terracotta)

## Questions?

Open a discussion or email waey.official.mk@gmail.com
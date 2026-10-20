# Implementation Plan: Waey Redesign — "وعي" platform rebuild on the new design direction

**Date:** 2026-10-20
**Author:** EXECUTOR (with the M7 crew)
**Status:** Approved to execute — owner: "redesign the platform, make it really useful, fix the UI/UX, no time limit, quality over speed"
**Scope:** `/home/m7/Projects/Waey - وعي` · frontend at `frontend/waey` · live at https://waey-m7.com

---

## 1. What this is

A full visual and structural redesign of Waey, driven by the nine design references in
`/home/m7/Projects/New Waey design/` and by a live-browser audit of the app as it
actually runs today. The references are **evidence, not a template**: they are a
different product ("Better Tomorrow", English, article-led). What we take from them is
the *information architecture and visual discipline* — light-first canvas, teal-navy
ink, emerald primary, one accent colour per field, card grids, a tips checklist, a
stats band, a newsletter band, a sidebar dashboard. What we keep is Waey's own
identity: **Arabic-first RTL**, the `وعي` name and logo, the localStorage privacy
model, the real trackers, streaks, badges, journal, recipes, AI assistant, and the
existing type system (Amiri / Fraunces / Nunito / IBM Plex Mono).

Result target: a platform that is *useful first* — every page earns its place, the
dashboard shows real progress, and the four fields are visually distinguishable at a
glance.

---

## 2. Audit findings this plan is built on (all measured, not guessed)

### Blockers (must clear first)

| # | Finding | Proof |
|---|---------|-------|
| B1 | **The build is broken.** `npm run build` fails: `src/pages/Dashboard.tsx(203,45): error TS2554: Expected 0 arguments, but got 1.` — `getDailyQuote(lang)` is called with an argument but `getDailyQuote()` takes none. HEAD typechecks clean, so the error came in with the 25 uncommitted redesign files. | `npx tsc -p tsconfig.app.json --noEmit` → exit 2; `vite build` alone succeeds in 12.9s, so only the `tsc` gate blocks it |
| B2 | **Node 26 on this box breaks the test suite** — 139 failures in 13 files, all `TypeError: Cannot read properties of undefined (reading 'clear')` on `localStorage.clear()`. Node 26 ships a global `localStorage` that is `undefined` without `--localstorage-file`; vitest's `populateGlobal` then skips jsdom's working copy. Not a code defect: CI is green on Node 20 (`.nvmrc`). | Node 26: `139 failed / 67 passed`. Node 24.21.0: **24/24 files, 208/208 pass in 5.07s** |
| B3 | **Port collision.** An Air SCOUT vite server owns `[::1]:5173`; Waey was started on 5173 and `127.0.0.1:5173` fell through to the wrong app. Waey now runs on **5174**. | `ss -ltnp` → pid 161275 = `Air SCOUT/source/node_modules/.bin/vite` on `[::1]:5173` |

### Real UI/UX defects found in the browser

| # | Defect | Proof |
|---|---------|-------|
| D1 | **Pages are too thin to be useful.** Home = 1,619 chars of text; Assistant = 654; Insights = 1,038; Shopping list = 453; Admin = 328. The references show dense, content-rich pages. | `document.body.innerText.length` per route |
| D2 | **7 WCAG AA contrast failures in light mode** — 4 nav links at 4.42 (need 4.5), hero description 4.34, and `.btn-ink` at **2.91** (a primary CTA). | measured sRGB luminance ratio, first 700px of the page |
| D3 | **Field pages are strips.** `/health`, `/finance`, `/environment`, `/education` render most sections at 114–182px tall with 19–100 chars each — the content exists but has no room, hierarchy, or per-field identity. | per-`<section>` geometry + text length |
| D4 | **12 duplicate `id="card"` elements on `/dashboard`.** Invalid DOM; breaks label/aria targeting and in-page anchors. | section census on `/dashboard` |
| D5 | **3 tap targets under 24px** on `/finance`. | measured `getBoundingClientRect().height` |
| D6 | **One image per page** (the logo) and no imagery on home — against a reference system that is image-led. | `document.querySelectorAll('img').length` = 1 on every route |
| D7 | **Dead features in copy.** `nav.design` ("تصميم الوكالة" / "Design Agency") is a leftover template key referenced nowhere. `/plans` and `/quiz` both redirect to `/`, but the README and `fields.educationDesc` advertise "30-day plans". | grep + `App.tsx` routes |
| D8 | **No `/about` page** and no landing for "what is Waey" beyond a 751-char section. | route list in `App.tsx` |
| D9 | **Homepage has no hero video or imagery** even though five 1.7–2.9 MB hero videos sit in `public/`. | `/` → `videos: 0, imgs: 1` |

### Environment facts (so no one re-derives them)

- Toolchain: **Node 24.21.0** (`~/.local/share/mise/installs/node/24.21.0/bin`) — the box default is Node 26, which breaks the suite. Node 20 is what CI uses.
- `node_modules` was missing rollup's native optional dep; fixed with `npm i --no-save @rollup/rollup-linux-x64-gnu` (`package.json`/lockfile untouched).
- **OpenCode + DeepSeek works**: `opencode run --model opencode/deepseek-v4.1-flash-free` answers, and with `-f <image>` it **reads reference images** — it correctly described a reference page's nav and background from the JPEG alone. The OpenRouter id `openrouter/deepseek/deepseek-v4.1-flash` is *not* usable (needs paid credits).
- Current real numbers: **24 test files, 208 tests** (the README's "215+ across 23 files" is wrong on both counts).
- Palette sampled from the references: ink `#073644 / #143647 / #1C404E / #274950` · primary `#0B6853` emerald · blue accent `#3080C5` · stat band `#104B54` · footer `#0F2C47` · field tints: health `#FFF1F1` (red), finance `#E3F4FE` (blue), environment `#EAFAEF` (green), education `#EDEAFD` (purple) · light grounds `#E7F5F9 / #EAF6F1 / #EFF7FA / #F8F9FB`.

---

## 3. Architecture decisions

1. **New token layer, not a patch on the old one.** The wabi-sabi palette (moss `#5D7052`, clay `#C18C5D`, rice paper) is replaced by the reference direction: teal-navy ink, emerald primary, cool neutrals, and **four field accents** (health red, finance blue, environment green, education purple). The grain veil, organic radii (16–32px), and coloured diffused shadows survive — they are the house signature, not the palette.
2. **Light-first.** The app currently opens in dark on a dark-preferring OS. The references are light. Light becomes canonical; dark stays as a first-class forest-night theme, and `prefers-color-scheme` no longer decides it.
3. **Per-field colour identity** is the single biggest usability win: colour becomes a navigational cue, not decoration. Health is red, finance blue, environment green, education purple — on the card, the icon, the progress ring, the section eyebrow.
4. **One primitive layer, then pages.** New shared components (`SectionHeading`, `FieldCard`, `ToolCard`, `TipList`, `StatBand`, `NewsletterBand`, `ArticleCard`, `PageHero`, `ProgressRing`, `StatTile`) carry the look. Pages compose them; no page re-invents a card.
5. **Bilingual quotes are real.** `dailyStorage.ts` already holds 100 Arabic `QUOTES` and 100 English `EN_QUOTES`. `getDailyQuote(lang)` selects between them. The redesign's broken call becomes a feature, not a deleted argument.
6. **RTL-first layout, not RTL-flavoured LTR.** Grid order, icon mirroring, arrow direction, and numeric formatting are all authored RTL; English mode flips the document, it does not get a second layout.
7. **Accessibility is a build gate, not a pass at the end.** Contrast, target size, focus order, and reduced motion are checked per task.
8. **Truthful numbers.** Every stat, badge, and figure on a page comes from the app's own data or from a source we can cite. No invented user counts.

---

## 4. Task list

Tasks live on the **M7 board** (`hermes kanban`) — one card per task, so the owner sees the
redesign as it moves. This document is the index; the card body is the contract.

### Phase 0 — Unblock and baseline (EXECUTOR, direct)

| Card | Task | Depends on |
|------|------|-----------|
| P0-1 | Fix `getDailyQuote(lang)` → locale-aware quote selection; build green | — |
| P0-2 | Land the `setup.ts` localStorage polyfill so 208/208 pass on Node 24 **and** 26 | — |
| P0-3 | Commit the 25-file uncommitted redesign in logical chunks once green | P0-1, P0-2 |
| P0-4 | Document the Node-24 + port-5174 requirement in `AGENTS.md` | P0-2 |

### Checkpoint: Foundation
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run test` → 208/208 on Node 24 and on Node 26
- [ ] working tree clean, redesign committed, nothing unpushed

### Phase 1 — Design system foundation (FRONTEND ENGINEER)

| Card | Task | Depends on |
|------|------|-----------|
| P1-1 | New token layer: teal-navy ink, emerald primary, 4 field accents, light + dark | P0-1 |
| P1-2 | Typography scale, spacing scale, radius/shadow tokens re-anchored | P1-1 |
| P1-3 | Primitive components: `SectionHeading`, `PageHero`, `FieldCard`, `ToolCard`, `TipList`, `StatBand`, `NewsletterBand`, `ArticleCard`, `ProgressRing`, `StatTile` | P1-2 |
| P1-4 | Navbar + Footer rebuild to the reference pattern (sticky, search, CTA pill, 4-column dark footer) | P1-3 |
| P1-5 | Light-first theme default; `prefers-color-scheme` no longer overrides | P1-1 |

### Checkpoint: Design system
- [ ] Tokens documented in `DESIGN.md`; no raw hex in component CSS
- [ ] All 10 primitives render in both themes with no console errors
- [ ] Contrast of every token pairing ≥ 4.5:1 (3:1 for large text)

### Phase 2 — Home page rebuild (FRONTEND ENGINEER)

| Card | Task | Depends on |
|------|------|-----------|
| P2-1 | Hero: eyebrow + headline + sub + primary CTA + 4 trust chips + real imagery | P1-4 |
| P2-2 | Four field cards with per-field accent + one-line promise + arrow | P2-1 |
| P2-3 | "Latest insights" article row fed from the app's own real content | P2-2 |
| P2-4 | Tools grid — the calculators Waey actually has (BMI, calorie, water, sugar, sleep) | P2-3 |
| P2-5 | Quick-tips checklist + stats band + newsletter band | P2-4 |

### Checkpoint: Home
- [ ] `/` matches the reference's information architecture, in Arabic RTL, with real content
- [ ] No contrast failure; no target under 44px; hero LCP under 2.5s on a cold load

### Phase 3 — Field pages (FRONTEND ENGINEER, one card per field)

| Card | Task | Depends on |
|------|------|-----------|
| P3-1 | `/health` — field hero, tools, tips, stats, CTA | P2-5 |
| P3-2 | `/finance` | P3-1 |
| P3-3 | `/environment` | P3-1 |
| P3-4 | `/education` | P3-1 |
| P3-5 | Shared field-page template so the four stay identical in structure | P3-1 |

### Phase 4 — Dashboard (FRONTEND ENGINEER) — the "really useful" core

| Card | Task | Depends on |
|------|------|-----------|
| P4-1 | Sidebar shell + welcome + overall progress ring (real gamification data) | P3-5 |
| P4-2 | Per-field progress cards with the new field accents | P4-1 |
| P4-3 | Recent activity + achievements + quick-stats rail | P4-2 |
| P4-4 | Remove the 12 duplicate `id="card"` elements | P4-1 |

### Phase 5 — Supporting pages (FRONTEND ENGINEER + CONTENT WRITER)

| Card | Task | Depends on |
|------|------|-----------|
| P5-1 | `/insights` — weekly insights with real data, real empty state | P4-4 |
| P5-2 | `/assistant` — chat with empty state, suggested prompts, clear failure handling | P5-1 |
| P5-3 | `/shopping-list` + `/recipes` — real empty states, working add/remove | P5-2 |
| P5-4 | `/about` — what Waey is, in Arabic (CONTENT WRITER) | P5-3 |
| P5-5 | `/faq`, `/privacy`, `/terms`, `/admin`, 404 — consistent, readable, on-brand | P5-4 |
| P5-6 | Delete the dead `nav.design` key; make `/plans` and `/quiz` real or remove the promise | P5-5 |

### Phase 6 — Accessibility, responsive, performance (QA ENGINEER + FRONTEND ENGINEER)

| Card | Task | Depends on |
|------|------|-----------|
| P6-1 | Fix every remaining contrast failure (D2) | P5-6 |
| P6-2 | 320 / 768 / 1024 / 1440 pass on all 14 routes, no overflow, no overlap | P6-1 |
| P6-3 | Keyboard: full tab order, visible focus, skip link, modal focus trap | P6-2 |
| P6-4 | Target size ≥ 44px everywhere; reduced-motion honoured | P6-3 |
| P6-5 | Image and video budget: real hero imagery, compressed, lazy below the fold | P6-4 |

### Checkpoint: Quality gate
- [ ] axe-core clean on all routes, both themes
- [ ] 0 console errors, 0 broken images, 0 dead internal links
- [ ] `npm run build` / `lint` / `test` green; e2e green
- [ ] 208+ tests still pass, plus new tests for the primitives and the new pages

### Phase 7 — Ship (EXECUTOR + DEVELOPER)

| Card | Task | Depends on |
|------|------|-----------|
| P7-1 | CHANGELOG entry; commit; push to `main` | P6-5 |
| P7-2 | Deploy to Vercel; verify https://waey-m7.com in a real browser | P7-1 |
| P7-3 | Vault note + activity log + final report to the owner | P7-2 |

---

## 5. How the crew executes

- **EXECUTOR** owns the plan, the briefs, the verification and the report. Nothing ships unverified.
- **FRONTEND ENGINEER** (child of DEVELOPER) writes the UI, driving **OpenCode with `opencode/deepseek-v4.1-flash-free`** as its implementation engine inside the repo, with the reference JPEGs attached via `-f`.
- **CONTENT WRITER** writes the Arabic copy that needs a human voice.
- **QA ENGINEER** proves the result in a browser, both themes, four widths.
- **DEVELOPER** handles the build, the deploy and anything structural.
- One card per task, run **sequentially** — the slices share `tokens.css`, the primitives and the Navbar, so two writers in the same tree would collide.
- Every card carries its own acceptance criteria, the exact commands, and the exact files. The seat never has to explore to find out how something works.

## 6. Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| DeepSeek Flash is a small model and may produce generic or off-brand UI | High | The brief carries the exact tokens, class names, file paths and a reference image; EXECUTOR reviews and re-briefs every slice. Small model does the typing, not the judgement. |
| The four field pages drift apart | Medium | One shared template card (P3-5) lands before the field cards; the field cards only fill content. |
| The redesign re-introduces a broken build | Medium | Every card ends with build + lint + test; EXECUTOR re-runs them before the next card starts. |
| Light-mode contrast regresses while adding the new palette | Medium | Contrast is a per-card acceptance criterion, checked in a real browser, not by eye. |
| The 25 uncommitted redesign files are lost or half-merged | Medium | P0-3 commits them in logical chunks before any new work lands. |
| Five hero videos (11 MB) bloat the new pages | Medium | P6-5 sets the media budget; only one hero video ships, the rest lazy. |
| The uncommitted redesign conflicts with the new direction | Low | It is committed as-is in P0-3 (nothing is thrown away), then superseded slice by slice; git history keeps it recoverable. |

## 7. Open questions

- **Push and deploy** happen at the end of Phase 7, and the deploy is the owner's live site. The owner has said to work without interruption; nothing goes live until the quality gate passes, and the deploy is announced before it happens.
- Nothing else is blocked. Copy, layout, and content decisions are the crew's to make and are made per task.

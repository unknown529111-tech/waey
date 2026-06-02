# Waey — Project Agent Instructions

## Project Overview
**Waey (وعي)** — An Egyptian Arabic holistic-awareness platform (RTL).
- **Stack**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Backend**: Supabase (contact form + AI chat proxy only)
- **Storage**: localStorage-first (no auth, no DB for user data)
- **Theme**: Full light/dark toggle
- **Design**: Warm nature palette (forest green, amber, cream sand), Alexandria font, 24px rounded-3xl cards, pill buttons

---

## 1. Initial Scan — Every Time You Enter This Project

- [ ] Read `AGENTS.md`, `.agents/marketplace.json`, `opencode.config.json` to understand config
- [ ] Read `waey - Copy/DESIGN.md` for design tokens (colors, typography, spacing, components)
- [ ] Read `waey - Copy/package.json` scripts section for available commands
- [ ] Read recent git log: `git log --oneline -10` to understand recent changes
- [ ] Run `git status` to check working tree state
- [ ] Identify which skills under `.agents/skills/` are relevant to the current task

---

## 2. RELEVANT SKILLS (use these when tasks match)

### Quality & Verification
- `verification-before-completion` — BEFORE claiming any task is done, run fresh verification commands
- `requesting-code-review` — Dispatch code reviewer after completing major features
- `code-reviewer` — Review code for bugs, design issues, edge cases
- `test-driven-development` — Write tests before implementation code
- `systematic-debugging` — For any bug, test failure, or unexpected behavior
- `adversarial-reviewer` — Stress-test code for edge cases and security

### Frontend & Design
- `frontend-design` — Building UI components, pages, interfaces
- `impeccable` — Polishing, redesigning, auditing frontend quality
- `design-review` — Visual audit before shipping UI
- `stitch-loop` — Iterative design-to-code feedback loop
- `ui-ux-pro-max` — UI/UX design reference
- `a11y-debugging` — Accessibility audit and fixes
- `a11y-audit` — Comprehensive accessibility checking

### API & Backend
- `api-design-best-practices` — Next.js API routes with Zod validation
- `api-design-reviewer` — Review API design
- `api-test-suite-builder` — Build API test suites

### Project Management
- `writing-plans` — Before starting multi-step tasks, write a plan
- `executing-plans` — Execute written implementation plans
- `subagent-driven-development` — Dispatch parallel agents for independent tasks
- `finishing-a-development-branch` — When implementation is complete

### Testing
- `webapp-testing` — Interact with/test local web app using Playwright
- `gstack` — Headless browser QA testing
- `agent-browser` — Browser automation/inspection

---

## 3. Pre-Completion Verification Checklist

**BEFORE marking any task complete, run ALL relevant checks:**

### Build Check
```
cd waey - Copy
npm run build
```
- [ ] Build exits with code 0
- [ ] No TypeScript errors
- [ ] No module resolution failures

### Lint Check
```
cd waey - Copy
npm run lint
```
- [ ] Lint exits with code 0
- [ ] No ESLint errors

### Test Check (if tests exist or were modified)
```
cd waey - Copy
npm run test
```
- [ ] All tests pass (0 failures)
- [ ] New tests verify the fix/feature (red-green cycle confirmed)

### Hermes Agent Skills (imported from NousResearch/hermes-agent)
- `hermes-opencode` — OpenCode CLI orchestration
- `hermes-codex` — OpenAI Codex CLI orchestration
- `hermes-claude-code` — Claude Code CLI orchestration
- `hermes-github-code-review` — Inline PR review via gh/REST
- `hermes-github-pr-workflow` — Full PR lifecycle: branch → commit → open → CI → merge
- `hermes-codebase-inspection` — Codebase LOC/language analysis via pygount
- `hermes-github-issues` — GitHub issue management
- `hermes-github-repo-management` — GitHub repo administration
- `hermes-architecture-diagram` — Architecture diagram generation
- `hermes-creative-ideation` — Structured brainstorming/ideation
- `hermes-excalidraw` — Hand-drawn excalidraw diagrams
- `hermes-p5js` — p5.js generative/algorithmic art
- `hermes-arxiv` — arXiv paper search/analysis
- `hermes-blogwatcher` — Blog monitoring
- `hermes-llm-wiki` — LLM knowledge base wiki
- `hermes-obsidian` — Obsidian vault management

### Bug Bounty & Security Research Skills
- `bb-bb-methodology` — Bug bounty methodology master orchestrator
- `bb-bug-bounty` — Full bug bounty hunting workflow (recon → vuln → report)
- `bb-meme-coin-audit` — Token/rug-pull security audit (Solana/EVMs)
- `bb-report-writing` — Bug bounty report writing for H1/Bugcrowd/Immunefi
- `bb-security-arsenal` — Payloads, bypass tables, wordlists, always-rejected list
- `bb-security-ownership-map` — Git-based security ownership topology
- `bb-security-threat-model` — Repository-grounded threat modeling
- `bb-triage-validation` — Pre-report finding validation (7-Question Gate)
- `bb-web2-recon` — Subdomain enum, URL crawl, JS analysis, directory fuzzing
- `bb-web2-vuln-classes` — 20 web2 bug classes with bypass tables & exploit patterns
- `bb-web3-audit` — Smart contract security audit (10 DeFi bug classes)
- `bb-ai-security` — AI/LLM application security testing
- `bb-red-team` — Red team operations and adversary simulation
- `bb-security-pen-testing` — Penetration testing methodologies
- `bb-threat-detection` — Threat detection and monitoring
- `bb-secrets-vault-manager` — Secrets management and vault security
- `bb-security-best-practices` — Security best practices reviews
- `bb-cybersec-skills` — 754 cybersecurity skills (from mukul975/Anthropic-Cybersecurity-Skills)
- `bb-claude-bug-bounty` — Claude Bug Bounty agent framework, commands, MCP configs, web3 audits, wordlists (from shuvonsec/claude-bug-bounty)
- `bb-osmedeus` — Osmedeus automated reconnaissance engine (from j3ssie/osmedeus)
- `bb-tpotce` — T-Pot honeypot platform Docker deployment (from telekom-security/tpotce)

**Note:** j3ssie/osmedeus and telekom-security/tpotce are security **tools** (Go scanner, Docker honeypot), not skill collections — referenced here for tool access during hunts. trickest/inventory failed to clone (empty/restricted).

### PM Claude Skills (imported from mohitagw15856/pm-claude-skills)
- `pm-ab-test-planner` — A/B test planning and experiment design
- `pm-accessibility-audit` — Web accessibility auditing
- `pm-api-docs-writer` — API documentation writing
- `pm-architecture-decision-record` — ADR documentation
- `pm-changelog-generator` — Changelog generation
- `pm-chart-data-extractor` — Chart data extraction
- `pm-code-review-checklist` — Code review checklist
- `pm-competitive-analysis` — Competitive landscape analysis
- `pm-competitive-intelligence-monitor` — Competitor monitoring
- `pm-competitor-signal-tracker` — Competitor signal tracking
- `pm-competitor-teardown` — Competitor deep-dive analysis
- `pm-content-calendar` — Content calendar planning
- `pm-dashboard-brief` — Dashboard design briefs
- `pm-data-analysis-standard` — Data analysis methodology
- `pm-debugging-log-analyser` — Debug log analysis
- `pm-design-critique` — Design critique facilitation
- `pm-design-handoff-brief` — Design-to-dev handoff
- `pm-discovery-interview-guide` — User discovery interview guide
- `pm-docx-tracked-changes` — DOCX tracked changes workflow
- `pm-email-campaign` — Email campaign strategy
- `pm-experiment-designer` — Experiment design
- `pm-feature-prioritisation` — Feature prioritisation frameworks
- `pm-figma-annotation-guide` — Figma annotation standards
- `pm-figma-component-audit` — Figma component library audit
- `pm-figma-design-brief` — Figma design briefs
- `pm-figma-design-critique-pm` — Figma design critique for PMs
- `pm-figma-design-qa` — Figma design QA
- `pm-figma-design-review` — Figma design review
- `pm-figma-prototype-plan` — Figma prototype planning
- `pm-figma-spacing-system` — Figma spacing system design
- `pm-figma-user-flow-planner` — Figma user flow planning
- `pm-figma-variant-matrix` — Figma variant matrix design
- `pm-go-to-market` — Go-to-market strategy
- `pm-go-to-market-planner` — GTM launch planning
- `pm-incident-postmortem` — Incident postmortem writing
- `pm-job-story-mapper` — Job story mapping
- `pm-launch-readiness` — Launch readiness assessment
- `pm-literature-review` — Literature review
- `pm-media-pitch` — Media/press pitch writing
- `pm-meeting-notes` — Meeting notes capture
- `pm-metrics-framework` — Metrics/KPI framework design
- `pm-multi-source-signal-synthesiser` — Multi-source signal synthesis
- `pm-okr-builder` — OKR creation and tracking
- `pm-pm-weekly-review` — PM weekly review structure
- `pm-pr-description-writer` — PR description writing
- `pm-prd-template` — PRD templating
- `pm-press-release` — Press release writing
- `pm-pricing-strategy` — Pricing strategy analysis
- `pm-process-documentation` — Process documentation
- `pm-product-health-analysis` — Product health metrics
- `pm-product-launch-checklist` — Product launch checklist
- `pm-project-status-report` — Status report generation
- `pm-proposal-writer` — Proposal writing
- `pm-research-protocol` — Research protocol design
- `pm-retention-analysis` — User retention analysis
- `pm-retro-analysis` — Retrospective analysis
- `pm-rice-impact-matrix` — RICE impact matrix
- `pm-rice-prioritisation` — RICE prioritisation
- `pm-roadmap-narrative` — Roadmap narrative writing
- `pm-roadmap-presentation` — Roadmap presentation
- `pm-runbook-writer` — Runbook/SOP writing
- `pm-seo-content-brief` — SEO content briefs
- `pm-sop-writer` — SOP documentation
- `pm-sprint-brief` — Sprint brief creation
- `pm-sprint-planning` — Sprint planning guide
- `pm-sql-query-explainer` — SQL query explanation
- `pm-stakeholder-influence-mapper` — Stakeholder mapping
- `pm-stakeholder-update` — Stakeholder updates
- `pm-strategic-narrative-generator` — Strategic narrative creation
- `pm-technical-spec-template` — Technical spec writing
- `pm-test-strategy-doc` — Test strategy documentation
- `pm-user-interview-synthesis` — User interview synthesis
- `pm-user-research-synthesis` — User research synthesis
- `pm-ux-research-plan` — UX research planning
- `pm-workshop-facilitation-guide` — Workshop facilitation

---

### Design & Visual Check
- [ ] New components match DESIGN.md tokens (colors, spacing, rounded corners, typography)
- [ ] All cards use `rounded-3xl` (24px) unless specifically exempted
- [ ] All buttons are `rounded-full` pills
- [ ] Headings are weight 700, body has 1.9 line-height
- [ ] RTL layout: `dir="rtl"` on all pages, text-right on content
- [ ] Dark mode: test all new components in `.dark` class
- [ ] Framer Motion page transitions applied (fade + translateY 20px, 0.4s)
- [ ] Responsive: check mobile (<768px), tablet (768-1023px), desktop (>=1024px)

### Functional Check
- [ ] If localStorage was changed, data migration from old format is handled
- [ ] No console errors in browser
- [ ] Edge cases handled (empty state, loading state, error state)

### Git & PR Ready (before committing/pushing)
- [ ] No `.env`, credentials, or secrets in committed files
- [ ] No debug code, console.log, commented-out code
- [ ] Commit message follows project style (check `git log`)
- [ ] Branch is up to date with base branch

---

## 4. Key Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | ESLint check |
| `npm run test` | Run Vitest tests |
| `npm run preview` | Preview production build |

---

## 5. Common Pitfalls

- **RTL**: All text is right-to-left. Never use LTR layout. `dir="rtl"`, `text-align: right`.
- **No auth/DB for user data**: All trackers, streaks, favorites go in localStorage. Supabase is only for contact form + AI chat proxy.
- **Alexandria font**: The only typeface. Weight 700 for headings/buttons, 400 for body.
- **Body leading**: Always 1.9 line-height on body text.
- **Card radius**: Default is `rounded-3xl` (24px). NEVER use square corners on cards.
- **Button shape**: Always `rounded-full` (pill). NEVER square buttons.
- **Colors**: Use DESIGN.md tokens, never raw hex. Text uses warm `#392B21` ink, never pure black.
- **Gradient blobs**: Decorate pages with blurred circles in primary/accent tints.
- **Design integrity**: Before marking UI work complete, load `impeccable` or `design-review` skill for a visual audit.

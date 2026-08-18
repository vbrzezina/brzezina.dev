# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Pre-build. The stack and architecture are locked via a wayfinder planning effort — read the map before starting any implementation work:

- **Map**: `.scratch/brzezina-dev-portfolio/map.md`
- **Issue tracker**: `.scratch/brzezina-dev-portfolio/issues/` (local markdown — see `docs/agents/issue-tracker.md` for conventions)

## Confirmed stack

- **Framework**: Next.js (App Router, TypeScript), Vercel hosting, public GitHub repo
- **Styling**: Emotion CSS-in-JS — confirmed; MUI is under consideration (see ticket 05), not decided
- **Analytics**: Vercel Analytics + GA4 via GTM + Google Search Console
- **CMS**: None initially; Keystatic as the upgrade path when editing friction materialises
- **Accessibility**: WCAG 2.1 AA target

## Git workflow

Trunk-based development with conventional commits. **Never push or merge directly to `main`.**

### Branch naming
```
feat/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
```

### Commit format (enforced by commitlint)
```
<type>(<optional-scope>): <short description>

Types: feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
```

### PR workflow
1. Create a branch from `main`
2. Commit with conventional commit messages
3. Push the branch and open a PR via `gh pr create`
4. Never run `git push origin main` — the Claude Code hook will block it

## Jira workflow

Build-phase implementation work (`task`-type tickets) is tracked in Jira alongside the local markdown system. Research, grilling, and prototype tickets stay in local markdown only.

- **Site**: `vbrzezina.atlassian.net`
- **cloudId**: `46be3ae8-1a03-4806-ba4a-c989577a1976`
- **Project key**: `KAN` (rename via Jira UI if desired)

### Agent lifecycle rules

1. **When creating a `task` ticket** in `.scratch/`: create a Jira issue in `KAN` via the Atlassian MCP and record the key in frontmatter as `Jira: KAN-NN`.
2. **When starting work on a task** with a `Jira:` key: transition it to "In Progress" via `transitionJiraIssue`.
3. **When opening a PR**: include the issue key in the PR description and transition to "In Review".
4. **When a PR merges**: transition to "Done".
5. **At session start**: run `searchJiraIssuesUsingJql` with `project = KAN AND statusCategory != Done ORDER BY updated DESC` to surface open work as context.

## Open decisions — do not treat research recommendations as approved

The following are **not yet decided** — work the relevant ticket before coding against them:

| Decision | Ticket | Notes |
|----------|--------|-------|
| `output: 'export'` vs Vercel-native SSG | `10` | Unresolved; affects i18n library and contact form |
| Contact form approach | depends on `10` | Resend via route handler (Vercel-native) vs external service (static export) |
| i18n library | `06` (blocked by `10`) | next-intl recommended by research; not HITL-approved; next-i18next still viable |
| MUI adoption depth | `05` (blocked by `04`) | Emotion confirmed; MUI itself not decided |
| Design direction | `04` | Visual identity, dark/light, typography, palette, motion |
| CMS strategy | `07` | No-CMS recommended by research; not HITL-approved |
| Mailer selection | `08` | Resend recommended by research; not HITL-approved |

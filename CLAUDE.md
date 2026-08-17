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

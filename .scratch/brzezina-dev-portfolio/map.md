# brzezina.dev portfolio — wayfinder map
Type: wayfinder:map

## Background

Started: 2026-08-17. This is a completely new portfolio site — no previous site existed. The motivation was to build a public online presence for contractor work and headhunter visibility.

**Early wrong turns (for case study):**
- shadcn/ui evaluated and rejected: copy-paste pattern is not a real design system, no centralized updates, every component becomes a maintenance liability
- Tailwind evaluated and rejected: utility-class approach creates friction with a bespoke visual identity; the terminal/CLI aesthetic requires precise, named abstractions not inline utilities
- CSS Modules evaluated and rejected: adequate but doesn't scale well with dynamic theming and prop-driven variant styling; Emotion/styled-components is the chosen CSS-in-JS approach

**Stack decisions still open as of 2026-08-18:** deployment mode (ticket 10), CMS (ticket 07), mailer (ticket 08), i18n library (ticket 06, blocked by 10), Radix Primitives vs Radix Themes as the component layer

## Destination

A finalized spec for brzezina.dev — a bilingual (EN/CS) personal portfolio site for Václav Brzezina, a senior full-stack TypeScript/React engineer offering contractor services and visible to headhunters. The spec locks all architectural, design, content, and infrastructure decisions so a build session can proceed without ambiguity.

## Notes

- Stack: Next.js (App Router, TypeScript), Vercel hosting, public GitHub repo
- **Styling**: Radix UI (Primitives or Themes — open) + Emotion/styled-components + CSS custom properties. CSS Modules, Tailwind, shadcn, MUI all rejected. See `ui-library-decision-summary.md` for option analysis.
- **Deployment mode**: `output: 'export'` (static) vs Vercel-native SSG — open question, see ticket 10
- **i18n library**: next-intl is the research recommendation (ticket 01) but the HITL decision is ticket 06; next-i18next remains viable; choice may depend on deployment mode (ticket 10)
- **Contact form**: approach depends on ticket 10 — Vercel route handler (Resend) if Vercel-native; external service if static export
- Audience: dual — freelance clients (contractor services) + headhunters/employers
- Positioning: technical depth and 9 years seniority, not leadership-first; services are Full-stack TS/React, AWS Serverless, NestJS backend, frontend architecture
- Pages: Home, About, Services, Work (empty, grows over time), Contact (form), CV download
- i18n: English default, Czech via `/cs/` URL prefix
- Analytics: Vercel Analytics + GA4/GTM + Google Search Console
- SEO: Open Graph, JSON-LD Person schema, i18n canonical alternates, sitemap, robots.txt
- Accessibility: WCAG 2.1 AA
- All secrets in Vercel env vars only — never committed
- Design: bold, expressive, personal — not default MUI component aesthetic
- Skills to invoke: frontend-design for design direction, grilling + domain-modeling for other decisions
- **Plan, don't build** — this map resolves decisions only; implementation follows via /to-spec then /to-tickets

## Decisions so far

<!-- one line per resolved ticket — populated as tickets close -->
- [i18n options for Next.js App Router static export](.scratch/brzezina-dev-portfolio/issues/01-i18n-static-export-research.md) — use `next-intl` with `app/[locale]/` folder routing and `output: 'export'`; middleware is skipped, locale prefix is always required, JSON message files are the translation source of truth
- [CMS options for a Next.js static export portfolio](.scratch/brzezina-dev-portfolio/issues/02-cms-options-research.md) — Start with no-CMS (TypeScript/JSON in git); Keystatic is the natural upgrade path when editing friction grows; Decap/Tina/Sanity are all disproportionate for a solo static-export portfolio.
- [Contact form mailer for Vercel serverless functions](.scratch/brzezina-dev-portfolio/issues/03-mailer-options-research.md) — Use Resend: free tier (3k/month) covers all portfolio traffic, single env var, HTTPS-native (no SMTP cold-start), first-class Next.js support; Formspree free cap is too low, Nodemailer+Gmail is fragile, AWS SES setup overhead is unjustified without existing AWS footprint.
- [Design direction and visual identity](issues/04-design-direction.md) — Developer-dark-first; Space Grotesk + DM Sans + JetBrains Mono; teal oklch accent on deep navy; CSS transitions only; sharp corners
- [MUI adoption depth](issues/05-mui-adoption-depth.md) — MUI rejected; Radix UI + CSS custom properties + CSS Modules confirmed
- [Hero section visual prototype](issues/09-visual-prototype.md) — Prototype at https://github.com/vbrzezina/brzezina-blueprint; design direction confirmed, ready for build phase
- Styling library — `@radix-ui/react-*` Primitives + `@emotion/react` + `@emotion/styled`; Radix Themes, Chakra, Mantine, CSS Modules, Tailwind, shadcn all rejected; see `case-study-log.md` for rationale

## Not yet specified

- Specific page copy and content (emerges after design direction and CMS strategy are settled)
- Portfolio section data structure (fields: title, description, tech stack, link, image — needs CMS strategy first)
- Services section structure and engagement model copy
- Deployment workflow (preview deployments, branch strategy — can be decided at build time)
- Blog section (in-scope, explicitly deferred — may graduate once core site is specced)

## Out of scope

- Blog (explicitly deferred — separate effort when the core site is live)
- Backend API beyond the contact form serverless function
- Authentication, user accounts, or login-gated content
- E-commerce or payment processing

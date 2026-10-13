# brzezina.dev

Personal portfolio of Václav Brzezina — a bilingual (EN/CS) site for freelance clients and recruiters.
Next.js App Router, TypeScript, Emotion + Radix Primitives, next-intl. Hosted on Vercel.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript, statically rendered per locale |
| Styling | Emotion (`styled`) over Radix Primitives; design tokens are CSS custom properties in `src/styles/tokens.css` |
| i18n | next-intl 4 — `/en` and `/cs`, copy in `messages/*.json`, no locale cookie |
| Contact form | `src/app/api/contact/route.ts` → [Resend](https://resend.com) |
| Analytics | Vercel Analytics + Speed Insights (cookieless); GA4 through GTM **only after opt-in consent** |
| Hosting | Vercel |

## Getting started

```bash
nvm use              # Node 22 (see .nvmrc)
npm install
cp .env.example .env.local   # all variables are optional for local work
npm run dev          # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Contact form: Resend key with *Sending access*, scoped to the sending domain |
| `CONTACT_TO_EMAIL` | Contact form: inbox that receives messages |
| `CONTACT_FROM_EMAIL` | Optional sender address on the verified domain (default `contact@brzezina.dev`) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container. Unset → no consent banner and nothing from Google loads |

Without the contact variables the form shows its error state with an email fallback; it never claims a
message was sent.

## Scripts

| Command | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` | `tsc --noEmit` (translation keys are type-checked against `messages/en.json`) |
| `npm run lint` | ESLint — `next/core-web-vitals`, TypeScript, and `jsx-a11y` rules |
| `npm test` | Vitest: the contact API route, shared form rules, EN/CS message parity |
| `npm run e2e` | Playwright against a production server (run `npm run build` first): both locales, the form, axe accessibility checks |
| `npm run format` | Prettier. Staged files are formatted on commit (lint-staged) |

Locally, set `PLAYWRIGHT_CHROMIUM_PATH` to use an existing Chromium instead of Playwright's download.

## Workflow

Trunk-based, with conventional commits (enforced by commitlint). Never push to `main`: branch, open a PR, and
CI must pass — type check, lint, unit tests, build, a check that the pages are still **pre-rendered**, then the
browser tests. A pre-commit hook formats and lints staged files and type-checks the project.

## Where things are

- `docs/design/redesign-2026-10.md` — the design spec (tokens, type ramp, components, layout)
- `docs/adr/` — architecture decisions (framework, styling, i18n, mailer, analytics/consent, SEO and rendering)
- `.scratch/brzezina-dev-portfolio/` — planning map, tickets, and the running case-study log
- `src/lib/seo.ts`, `src/app/sitemap.ts` — page metadata and the sitemap; new pages need an entry in both

## Adding a page

1. Create `src/app/[locale]/<page>/page.tsx`; call `setRequestLocale(locale)` first (see `src/i18n/locale.ts`) so it stays static.
2. Export `generateMetadata` using `pageMetadata()` from `src/lib/seo.ts`.
3. Add it to `PATHS` in `src/app/sitemap.ts`, and its copy to both `messages/*.json` (`npm test` checks parity).
4. Wrap it in `ContentPage` for the standard header and footer.

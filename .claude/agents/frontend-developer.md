---
name: frontend-developer
description: Use for implementing Next.js App Router pages and layouts, React components, Emotion/MUI styled components, next-intl translations, TypeScript types, and client-side logic. Invoke for all UI component work, routing, state, and i18n string wiring.
---

# Frontend Developer Agent

You build the UI for brzezina.dev: Next.js App Router pages, React components, Emotion styling, MUI theming, and next-intl bilingual content.

## Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js (App Router, TypeScript) | Confirmed |
| Deployment | Vercel — static export vs Vercel-native SSG | **Open — ticket 10** |
| Styling | Emotion CSS-in-JS | Confirmed |
| Styling provider | `@mui/material-nextjs` `AppRouterCacheProvider` | If MUI adopted |
| Components | MUI component library | **Open — ticket 05** |
| i18n | next-intl OR next-i18next — `app/[locale]/` routing, EN default, `/cs/` | **Open — ticket 06** |
| State | TBD — keep local/server until decided | Open |
| Forms | React Hook Form | Planned |

**Do not start implementing i18n wiring or MUI component usage until tickets 06 and 05 are resolved.**

## File structure conventions

```
app/
  [locale]/
    layout.tsx        ← NextIntlClientProvider wraps here
    page.tsx          ← Home
    about/page.tsx
    services/page.tsx
    work/page.tsx
    contact/page.tsx
  api/
    contact/route.ts  ← serverless function (backend-developer owns this)
  layout.tsx          ← root layout, minimal passthrough
messages/
  en.json             ← English strings (source of truth)
  cs.json             ← Czech strings
components/           ← shared components
  ui/                 ← purely presentational
  layout/             ← Header, Footer, etc.
lib/                  ← utilities, types
```

## i18n patterns

**i18n library is undecided (ticket 06, blocked by ticket 10).** The patterns below are next-intl — if next-i18next is chosen, the API differs. Do not implement either until ticket 06 is resolved.

```tsx
// next-intl example (if chosen):
import { getTranslations } from 'next-intl/server'; // Server Component
import { useTranslations } from 'next-intl'; // Client Component

// Both libraries use app/[locale]/ folder structure and generateStaticParams
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'cs' }];
}
```

Translation keys will live in `messages/en.json` (source of truth). Always add both EN and CS strings together.

## Emotion/MUI patterns

```tsx
// Emotion styled component
import { styled } from '@mui/material/styles';
const HeroSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

// AppRouterCacheProvider in root layout
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
```

Never use inline `sx` prop for complex styling — prefer `styled()` for reusability and readability.

## Pages and their purpose

| Page | Route | Notes |
|------|-------|-------|
| Home | `/` → `/en` | Hero + positioning statement |
| About | `/[locale]/about` | Photo, background, 9 years experience |
| Services | `/[locale]/services` | Technical skills, service offerings |
| Work | `/[locale]/work` | Empty structure, grows over time |
| Contact | `/[locale]/contact` | Form (POST to `/api/contact`) |
| CV | `/[locale]/cv` | Download link to PDF |

## Development workflow

1. Check wayfinder map — no open design/architecture decisions should block your work
2. Invoke `/superpowers:test-driven-development` before implementing non-trivial components
3. After implementation: `/superpowers:verification-before-completion`
4. Commit: `/commit-commands:commit`

## Skills to invoke

| Task | Skill |
|------|-------|
| TDD for components | `/mattpocock-skills:tdd` or `/superpowers:test-driven-development` |
| Debug rendering issues | `/mattpocock-skills:diagnosing-bugs` |
| Review React patterns | `/vercel:react-best-practices` |
| Next.js App Router questions | `/vercel:nextjs` |
| Before completing feature | `/superpowers:verification-before-completion` |
| Finishing a dev branch | `/superpowers:finishing-a-development-branch` |

## Key constraints

- WCAG 2.1 AA: all interactive elements need keyboard support and proper ARIA
- Bilingual: every user-facing string must have an entry in both `messages/en.json` and `messages/cs.json`
- No secrets in client code — `NEXT_PUBLIC_` prefix only for genuinely public values
- **Emotion is confirmed** — always use `styled()` from `@mui/material/styles` or `@emotion/styled`
- **MUI is not confirmed** — do not import MUI components until ticket 05 is resolved
- **i18n library is not confirmed** — do not wire next-intl or next-i18next until ticket 06 is resolved
- **Deployment mode is not confirmed** — do not assume API routes work (ticket 10)

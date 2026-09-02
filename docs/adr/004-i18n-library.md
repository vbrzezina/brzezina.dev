# ADR-004: i18n library — next-intl vs next-i18next

**Status:** accepted  
**Date:** 2026-08-18  
**Decider:** Václav Brzezina

---

## Context

The site is bilingual: English (default) and Czech (`/cs/` URL prefix). All user-facing strings live in translation files. The routing structure is `app/[locale]/`. Two libraries dominate the App Router i18n space: `next-intl` and `next-i18next`.

`next-intl` is currently installed and in use. This TDR records the full comparison so the decision can be revisited if circumstances change.

---

## Head-to-head comparison

### Origin and design intent

| | next-intl | next-i18next |
|---|---|---|
| Designed for | App Router from the ground up | Pages Router; App Router support added later |
| Underlying runtime | Own ICU-based runtime | Wraps `react-i18next` → `i18next` |
| App Router support | First-class, officially maintained | Community-maintained adapter layer |
| Static export support | Explicitly documented, tested | No official story; workarounds exist |

`next-i18next` was the standard choice for Next.js i18n from ~2020–2023. Its Pages Router wiring (`_app.tsx` wrapping, `serverSideTranslations` HOC, `useTranslation` hook) is well-established. The library accumulated a large user base and extensive plugin ecosystem (`i18next-browser-languagedetector`, `i18next-http-backend`, etc.).

When the App Router landed in Next.js 13, `next-intl` was purpose-built for the new paradigm. `next-i18next` added App Router compatibility but it is not the library's primary focus — the Pages Router is still the officially documented path.

---

### App Router integration

**next-intl:**
- `createNextIntlPlugin` wraps `next.config.ts` — one HOC, no other config
- `i18n/routing.ts` defines locales and default locale via `defineRouting`
- `i18n/request.ts` uses `getRequestConfig` to load locale from the `[locale]` segment and import the matching JSON
- `useTranslations('namespace')` works in both Client and Server Components
- `getTranslations('namespace')` is the Server Component / RSC-safe async variant
- `NextIntlClientProvider` serialises only the required namespace to the client bundle — not the entire message file
- No prop-drilling of locale; Server Components read locale from the request context automatically

**next-i18next:**
- Designed around `appWithTranslation` HOC on `_app.tsx` — no direct equivalent in App Router
- App Router usage requires creating a custom `i18n/client.ts` and `i18n/server.ts` that manually initialise `i18next` instances
- `useTranslation` hook works in Client Components
- Server Components require `initReactI18next` configuration and manual `i18next.getFixedT` calls — not ergonomic, not officially documented
- The translation provider must be added manually to the layout chain
- Community guides exist but each slightly differs; no canonical approach

**Verdict:** next-intl is significantly cleaner for App Router. next-i18next's App Router story is a series of workarounds.

---

### Static export support

**next-intl:**
- Explicitly documented for `output: 'export'`
- `localePrefix: 'always'` required — all routes include the locale segment (`/en/`, `/cs/`)
- No middleware in static export (no server-side locale negotiation)
- `generateStaticParams` in `app/[locale]/layout.tsx` pre-renders all locale trees
- Known limitations are documented and not blocking for this project

**next-i18next:**
- No official `output: 'export'` documentation
- Static export workarounds exist (load translations via `import()` at build time) but are community-authored and fragile
- `serverSideTranslations` does not apply in a static export context — must be replaced entirely
- If static export is needed, next-intl is the safer choice

**Verdict:** next-intl wins for static export. If Option A in ADR-003 is confirmed (Vercel-native), this advantage is less material — but the App Router story still favours next-intl.

---

### Translation file format and type safety

**next-intl:**
- JSON per locale (`messages/en.json`, `messages/cs.json`)
- Nested keys supported (`{ "nav": { "about": "About" } }`)
- ICU message syntax for plurals, dates, numbers, lists — handled natively via `Intl` APIs
- Type safety: `createMessagesDeclaration` points to the English JSON file; TypeScript generates a declaration so `t('nav.about')` is checked at compile time
- Unknown translation keys are a type error

**next-i18next / i18next:**
- JSON per namespace per locale (e.g., `public/locales/en/nav.json`, `public/locales/cs/nav.json`)
- Namespace-per-file approach works well in large apps with many independent sections
- ICU support available via `i18next-icu` plugin — not included by default
- Type safety: possible via `i18next` TypeScript type augmentation (`declare module 'i18next'`) but requires manual setup; less ergonomic than next-intl's declaration approach
- The `t` function signature is looser by default

**Verdict:** next-intl's type safety is tighter out of the box. For a bilingual portfolio with ~100–200 strings, next-intl's single-namespace-per-section JSON is a better fit than i18next's namespace-per-file approach, which is designed for larger multi-team codebases.

---

### Developer experience

**next-intl:**
```tsx
// Server Component
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('hero');
return <h1>{t('heading')}</h1>;

// Client Component
'use client';
import { useTranslations } from 'next-intl';
const t = useTranslations('hero');
return <h1>{t('heading')}</h1>;
```

**next-i18next (App Router):**
```tsx
// Client Component
'use client';
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('hero');
return <h1>{t('heading')}</h1>;

// Server Component (non-standard, community pattern)
import { createInstance } from 'i18next';
import initTranslations from '@/app/i18n';
const { t } = await initTranslations(locale, ['hero']);
return <h1>{t('heading')}</h1>;
```

**Verdict:** next-intl's API is simpler, symmetric between Server and Client Components, and requires no boilerplate initialisation.

---

### Bundle size

| | next-intl | next-i18next |
|---|---|---|
| Direct dependency | `next-intl` (~30 kB gzip) | `next-i18next` + `react-i18next` + `i18next` (~55 kB gzip combined) |
| Client bundle impact | Only the namespace used by the page is serialised via `NextIntlClientProvider` | Full translation resources loaded unless manually chunked |

For a portfolio with 5–6 sections, the difference is marginal in absolute terms. next-intl's namespace-scoping is a cleaner pattern regardless.

---

### Ecosystem and maintenance

**next-intl:**
- Maintained by Tobias Bleckert; active development, responsive to Next.js releases
- Explicit Next.js 15 and 16 compatibility
- Smaller plugin ecosystem (not needed for this use case)
- ~2M weekly npm downloads (2026)

**next-i18next / i18next:**
- `i18next` is one of the most downloaded npm packages: 25M+ weekly downloads
- Massive plugin ecosystem: language detection, backend loaders, ICU plugin, React Native, etc.
- `next-i18next` itself is less actively maintained; most energy is in `i18next` core
- For a project that doesn't need the plugin ecosystem, the ecosystem size is noise

**Verdict:** next-intl is better maintained for the App Router use case. i18next's ecosystem advantage is irrelevant for this project's scale and requirements.

---

## When to reconsider next-i18next

The decision would be worth revisiting if:

1. **Migration from Pages Router** — if an existing next-i18next setup needs to be preserved or merged, the migration cost of switching to next-intl could be significant
2. **Large team with translator workflows** — i18next's namespace-per-file approach and `.po` file support (via plugin) are better fits for professional localisation platforms
3. **Complex pluralisation in many languages** — i18next's built-in plural forms for 40+ languages is broader than next-intl's ICU-based approach; for EN/CS only, this is not a differentiator
4. **React Native sharing** — `react-i18next` works in React Native; `next-intl` is Next.js-specific

None of these apply to this project.

---

## Decision

**Use `next-intl`.** Already implemented. JSON message files in `messages/en.json` and `messages/cs.json`. Locale routing via `app/[locale]/`. `useTranslations` in Client Components, `getTranslations` in Server Components.

## Open questions from ticket 06

| Question | Status |
|----------|--------|
| Translation file format | Resolved — flat nested JSON, `messages/` directory |
| Routing structure | Resolved — `app/[locale]/` with `localePrefix: 'always'` |
| Content scope | Partially — all sections EN/CS; some Czech translations still to be written |
| Maintenance workflow | Open — how does Václav update Czech content? Git + editor for now; Keystatic if editing friction grows (see ADR-005) |

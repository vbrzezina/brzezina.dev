# i18n content management approach

Type: grilling
Status: resolved
Blocked by: 01, 02, 10

## Question

Which i18n library should be used, and how should bilingual (EN/CS) content be managed for brzezina.dev?

This decision depends on:
- "i18n options for Next.js App Router static export" (ticket 01) — research surfaced next-intl as the recommendation for static export
- "CMS options for a Next.js static export portfolio" (ticket 02) — no-CMS recommended
- "Static export vs Vercel-native SSG" (ticket 10) — if static export is dropped, next-i18next becomes viable again

Resolve:
1. **i18n library**: next-intl vs next-i18next — confirm the choice given the deployment mode decided in ticket 10
2. **Translation file format**: JSON per locale, TypeScript constants, or CMS-managed?
3. **Routing structure**: confirm `app/[locale]/` folder layout and library-specific wiring
4. **Content scope**: is all content bilingual, or are some sections EN-only?
5. **Maintenance workflow**: how does Václav update Czech content going forward?

## Answer

**next-intl**, as built. Resolved with ticket 10 (Vercel-native) on 2026-10-13; the library was chosen in August and has run in production since.

1. **Library:** next-intl v4 (next-i18next rejected: singleton concurrency footgun with the App Router).
2. **Format:** nested JSON, `messages/en.json` and `messages/cs.json`. Translation keys are type-checked against `en.json`, and a Vitest test enforces EN/CS key parity.
3. **Routing:** `app/[locale]/` with `localePrefix: 'always'` (`/en`, `/cs`); both locales are pre-rendered.
4. **Scope:** all content is bilingual.
5. **Maintenance:** edit the JSON files in git. Keystatic remains the upgrade path (ticket 07) if that becomes a burden.

See `docs/adr/004-i18n-library.md`.

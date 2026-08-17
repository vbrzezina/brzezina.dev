# i18n content management approach

Type: grilling
Status: open
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

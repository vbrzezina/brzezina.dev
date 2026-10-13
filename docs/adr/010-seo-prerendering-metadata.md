# ADR-010: Static rendering, localized metadata and SEO files

**Status:** accepted
**Date:** 2026-10-13
**Decider:** Václav Brzezina

---

## Context

A review of `main` found that both page routes were rendered on every request (`Cache-Control: no-store`), because next-intl was reading the locale from request headers. `/cs` served an English title and description, and there was no canonical URL, Open Graph data, sitemap, robots.txt, favicon or structured data. The hero's content started at `opacity: 0` until JavaScript hydrated, which held back the largest contentful paint.

## Decision

1. **Static rendering.** `[locale]/layout.tsx` exports `generateStaticParams` (all locales) and `dynamicParams = false`; the layout and both pages call `setRequestLocale(locale)` first. The build output shows `●` (SSG) for `/[locale]` and `/[locale]/privacy`, and responses are CDN-cacheable.
2. **One place for page metadata.** `src/lib/seo.ts` (`pageMetadata`) produces title, description, canonical, hreflang, Open Graph and Twitter tags for a page in a locale. Metadata objects replace their parents', so every page goes through it. Copy lives in `messages/*.json` (`meta`, plus `privacy.metaTitle/metaDescription`). `metadataBase` comes from `site.url`.
3. **hreflang is declared once, in the page head.** next-intl's middleware `Link` header is turned off (`alternateLinks: false`): it derives its host from the request, so it would contradict the canonical origin on previews or a `www` host. `x-default` is `/` for the home page (the root redirects by `Accept-Language`) and the English URL for other pages.
4. **Files.** `app/robots.ts`, `app/sitemap.ts` (with hreflang alternates; new content pages are added to its `PATHS`), `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`, and a localized 1200×630 `[locale]/opengraph-image.tsx` (statically generated).
5. **Structured data.** The home page renders a server-side JSON-LD graph (`Person`, `ProfessionalService` with the IČO as an identifier, `WebSite`), built from data that is already public on the page (`src/lib/structuredData.ts`).
6. **Branded 404.** `[locale]/not-found.tsx` plus a `[locale]/[...rest]` catch-all that calls `notFound()`, so unknown paths below a valid locale render inside the locale layout (correct `lang`, nav, footer, `noindex`).
7. **Hero is visible without JavaScript.** `Reveal` has an `eager` mode: a CSS-only entrance animation instead of hidden-until-hydrated. The hero uses it. A `<noscript>` rule shows all other reveals when scripts don't run.
8. **Web app manifest** (`app/manifest.ts`), so the site is installable ("Add to Home Screen") with its own icon and no browser chrome. Chrome reports no installability errors. **There is deliberately no service worker**: no offline cache means a deploy is visible immediately and there is no stale-content failure mode; a test fails if one is ever registered. If offline support is wanted later (the CV is the obvious candidate), use Serwist with network-first pages. `theme-color` follows the OS colour scheme, because the in-page toggle can't change it after load.
9. **Icons from one source.** The mark is the logo's `$` (teal on navy), drawn as paths so it needs no font. `scripts/generate-icons.mjs` renders `icon.svg`, `favicon.ico`, `apple-icon.png` and the manifest's 192/512/maskable PNGs, so they can't drift apart. Re-run it after changing the glyph.
10. **Fonts include `latin-ext`.** Czech letters (č ř ě ů ž š) are outside the `latin` subset and silently fell back to a system font. The English page needs them too (the address "Střížkov"). Cost: about 49 KB of extra preloads on every page.

## Consequences

- Measured on a production build, desktop: LCP 1136 ms → 316 ms. Mobile (4× CPU, slow network): 3472 ms → 1248 ms. CLS stays 0.
- A new page needs `setRequestLocale`, a `pageMetadata` call, and an entry in `sitemap.ts`.
- The OG card uses the generator's default font (not Space Grotesk): bundling a font file for it was judged not worth it.
- The Czech `meta` copy should be read by a native speaker.

# i18n options for Next.js App Router static export

Type: research
Status: resolved

## Question

Next.js built-in `i18n` routing config does not work with `output: 'export'` (static export). What are the current best-practice alternatives for adding EN/CS bilingual routing to a Next.js App Router static export site?

Investigate:
1. `app/[locale]/` folder-based routing — how does it work, what are the tradeoffs for static export?
2. `next-intl` — does it support static export? Setup overview, known issues?
3. `next-i18next` — same questions
4. Any other viable approaches

Surface: which approach is most adopted today, any showstoppers for static export, recommended library with rationale, and whether the routing choice constrains or informs the CMS/translation file decision.

## Answer

### Context: what Next.js built-in i18n cannot do

Next.js's `i18n` config key in `next.config.js` (the Pages Router feature) is explicitly incompatible with `output: 'export'` — the build will throw `export-no-i18n`. The App Router has no built-in `i18n` config key at all; locale routing must be implemented at the file-system level.

---

### Option 1: `app/[locale]/` folder-based routing (no library)

The official Next.js docs (as of v16.x, last updated 2026-06-10) recommend this as the baseline approach:

- All routes live under `app/[locale]/`. The root layout exports `generateStaticParams` returning the list of locales — this is what causes Next.js to pre-render both `/en/...` and `/cs/...` trees at build time.
- Translation strings are loaded via a plain `getDictionary(locale)` utility that uses dynamic `import()` per locale. In Next.js 16+ the `next/root-params` module lets any Server Component read the `locale` segment without prop drilling.
- No third-party library required. Works perfectly with `output: 'export'`.
- **Tradeoffs:**
  - No automatic locale detection (no middleware in static export).
  - Root `/` needs a manual client-side or build-time redirect to `/en`.
  - No localized pathnames (e.g., `/cs/o-nas` vs `/en/about`) — all slugs are identical across locales.
  - ICU plural/number formatting must be wired up manually (via `Intl` APIs).
  - Type safety for translation keys requires manual effort.
  - SEO hreflang/canonical alternates require manual construction in metadata.

This is the right choice for minimal-dependency, very small translation surface (1–2 pages, <50 strings).

---

### Option 2: `next-intl` (recommended for this project)

**Static export support: yes, fully documented and officially maintained.**

`next-intl` is the most widely adopted App Router i18n library. It has explicit, documented support for `output: 'export'` with the following behaviour:

**Setup summary:**
1. `npm install next-intl`
2. Wrap `next.config.ts` with `createNextIntlPlugin` (the `withNextIntl` HOC).
3. Define `i18n/routing.ts` using `defineRouting({ locales: ['en', 'cs'], defaultLocale: 'en' })`.
4. Define `i18n/request.ts` using `getRequestConfig` — loads the locale from the `[locale]` segment and imports the matching JSON message file.
5. Structure: `app/[locale]/layout.tsx` wraps children with `NextIntlClientProvider`. Root layout `app/layout.tsx` is a minimal passthrough.
6. `generateStaticParams` is exported from `app/[locale]/layout.tsx` returning all locales.
7. No `middleware.ts` / `proxy.ts` file (middleware does not run in static export).

**Static export limitations (documented, not blocking):**
1. `localePrefix: 'always'` is required — all routes include the locale prefix (so `/en/about`, `/cs/o-nas` — but localized pathnames are not supported, see #3).
2. No server-side locale negotiation (`localeDetection: false` implied).
3. No `pathnames` (localized slug aliases) — slugs are uniform across locales.
4. Static rendering only — no dynamic server rendering.

**Root `/` redirect:** `app/page.tsx` must explicitly `redirect('/en')` (or whichever default locale).

**What next-intl adds over bare folder routing:**
- ICU message syntax (plurals, date/number/list formatting) with zero-config `Intl` integration.
- `useTranslations` / `getTranslations` hooks — ergonomic in both Server and Client Components.
- Type-safe message keys via `createMessagesDeclaration` pointing to the English JSON (TypeScript declaration auto-generated).
- `NextIntlClientProvider` — serialises only the required namespace's messages to the client, not the full file.
- `getPathname` utility for building hreflang/canonical links in sitemap and metadata.
- Active maintenance, excellent Next.js 15/16 compatibility, high-reputation docs.

**Translation file format:** flat or nested JSON with ICU syntax. The English file is the source of truth; Czech is a sibling. This is CMS-agnostic — any headless CMS that exports JSON (or can be scripted to) works. Local JSON files in `messages/` are the zero-dependency baseline.

---

### Option 3: `next-i18next`

**Not recommended for this project.**

`next-i18next` was designed for the Pages Router. It wraps `react-i18next` and depends on `i18next`. While the library is not formally deprecated, its App Router support is a community concern and it does not have an official static-export story. Maintenance focus has shifted to the Pages Router use case. For a new App Router + static export project in 2026, `next-i18next` is the wrong tool.

---

### Option 4: Other approaches

- **Paraglide-Next (`@inlang/paraglide-next`):** compile-time i18n — zero runtime overhead, messages become tree-shakeable JS constants. Supports App Router. Static export support exists but the ecosystem is smaller and migration tooling is less mature. Worth watching but not the obvious default.
- **Lingui:** mature, uses `.po`/`.po` message catalogues, good TypeScript support, App Router compatible. More complex setup than next-intl; better fit if the team already uses Lingui or needs professional translator workflows with `.po` files.
- **`next-international`:** lightweight, App Router native, but smaller community and less comprehensive than next-intl.
- **`gt-next` (General Translation):** AI-translation-first, interesting for auto-translating but not a fit for a manually-maintained bilingual site.

---

### Recommendation

**Use `next-intl` with `app/[locale]/` folder structure and `output: 'export'`.**

Rationale:
- Explicit, documented, tested support for `output: 'export'`.
- Best App Router DX: Server Component and Client Component hooks, type-safe keys, ICU plurals.
- JSON message files are the simplest possible translation storage — no CMS dependency, easy to version in git, easy to hand off to a translator.
- The static-export limitations (prefix-always, no server detection, no localized slugs) are acceptable: `/en/` and `/cs/` prefixes are standard SEO practice, and the portfolio has no need for locale-aliased slugs.
- Vercel hosts static exports natively; no middleware needed at the CDN level.

**Routing/CMS implications:**
- Translation files will be JSON in `messages/en.json` and `messages/cs.json`. This decision is independent of any headless CMS — if a CMS is adopted later, it can export to these same files.
- The `localePrefix: 'always'` constraint means canonical URLs are always `/en/...` and `/cs/...` — plan hreflang and sitemap accordingly.
- The contact form (serverless function) is unaffected — it does not participate in locale routing.

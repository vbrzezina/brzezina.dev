---
name: seo-audit
description: Audit brzezina.dev for SEO completeness and correctness. Checks metadata, Open Graph, JSON-LD, sitemap, robots.txt, hreflang, canonical URLs, Core Web Vitals, and Google Search Console integration. Run after adding or modifying pages, or before launching.
---

# SEO Audit Skill

Run this skill after adding pages, changing URL structure, or before launching to catch SEO gaps.

## Phase 1: Metadata audit (per page)

Check every page route: `/en`, `/en/about`, `/en/services`, `/en/work`, `/en/contact`, plus `/cs/*` equivalents.

### Required tags checklist

```bash
# Fetch rendered HTML and check tags
curl -s https://brzezina.dev/en | grep -E '<title>|<meta name="description"|og:|canonical'
```

Per page:
- [ ] `<title>` — unique, 50-60 chars, contains primary keyword
- [ ] `<meta name="description">` — unique, 150-160 chars, readable sentence
- [ ] `<link rel="canonical">` — matches exact URL of current page
- [ ] `<meta property="og:title">` — present
- [ ] `<meta property="og:description">` — present
- [ ] `<meta property="og:url">` — matches canonical
- [ ] `<meta property="og:image">` — present, 1200×630px minimum
- [ ] `<meta property="og:type">` — `website` for all pages
- [ ] `<link rel="alternate" hreflang="en">` — points to EN version
- [ ] `<link rel="alternate" hreflang="cs">` — points to CS version
- [ ] `<link rel="alternate" hreflang="x-default">` — points to EN version

### Validate with tools

- **Meta preview**: https://metatags.io — paste any page URL
- **Open Graph debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card validator**: https://cards-dev.twitter.com/validator

## Phase 2: JSON-LD structured data

Homepage must have a `Person` schema:

```bash
# Check JSON-LD is present in HTML
curl -s https://brzezina.dev/en | grep 'application/ld+json'
```

Validate at: https://search.google.com/test/rich-results

Required fields:
- [ ] `@type: "Person"`
- [ ] `name`: "Václav Brzezina"
- [ ] `jobTitle`: senior engineer positioning
- [ ] `url`: `https://brzezina.dev`
- [ ] `sameAs`: LinkedIn, GitHub URLs
- [ ] `knowsAbout`: TypeScript, React, Next.js, NestJS, AWS

## Phase 3: Sitemap and robots.txt

```bash
curl -s https://brzezina.dev/sitemap.xml
curl -s https://brzezina.dev/robots.txt
```

Sitemap checklist:
- [ ] All pages present in both locales (`/en/*` and `/cs/*`)
- [ ] `<xhtml:link>` hreflang alternates included per URL
- [ ] `<lastmod>` dates present
- [ ] URL: `https://brzezina.dev/sitemap.xml` referenced in robots.txt

Robots.txt checklist:
- [ ] `User-agent: *` with `Allow: /`
- [ ] `Sitemap: https://brzezina.dev/sitemap.xml`
- [ ] No accidental `Disallow:` rules blocking pages

## Phase 4: URL and crawlability

- [ ] Root `/` redirects to `/en` (not indexed as empty page)
- [ ] No duplicate content — `/en/about` and `/cs/about` differ (translations, not same page)
- [ ] No trailing slash inconsistency (`/en/about` vs `/en/about/`)
- [ ] All internal links use locale-prefixed paths

## Phase 5: Google Search Console

1. **Ownership verified** — meta tag present in `<head>`
2. **Sitemap submitted** — Settings → Sitemaps → Add sitemap URL
3. **Coverage report** — no Excluded or Error pages
4. **Core Web Vitals report** — all pages in "Good" range:
   - LCP < 2.5s
   - INP < 200ms
   - CLS < 0.1

## Phase 6: Core Web Vitals (Lighthouse)

```bash
# Run Lighthouse CLI
npx lighthouse https://brzezina.dev/en --only-categories=performance,seo --output=html
```

Or use Chrome DevTools → Lighthouse tab.

Target scores:
- SEO: 100
- Performance: 90+
- Accessibility: 100 (see a11y-audit skill)

## Phase 7: i18n SEO specifics

- [ ] Each locale has distinct `<html lang="">` attribute
- [ ] No `x-robots-tag: noindex` on CS pages
- [ ] Canonical on Czech pages points to the Czech URL (not EN)
- [ ] `hreflang="x-default"` always points to `/en`

## Reporting

List each gap as:

```
Page: /en
Issue: og:image missing
Impact: Medium — no image preview when shared on LinkedIn (recruiter use case)
Fix: Add 1200×630 OG image; set in generateMetadata() openGraph.images array
```

## Pass criteria

- All pages have unique title + description
- All hreflang alternates present and cross-linked
- Sitemap accepted in Search Console with 0 errors
- Lighthouse SEO score: 100 on all pages
- JSON-LD Person schema validates in Rich Results Test

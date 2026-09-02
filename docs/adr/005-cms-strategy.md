# ADR-005: CMS strategy

**Status:** accepted  
**Date:** 2026-08-18  
**Decider:** Václav Brzezina

---

## Context

The site has structured content: bio, experience entries, work projects, service descriptions, and translation strings. The question is how this content is stored and updated.

## Decision

**No CMS initially. Content lives as TypeScript files in `src/data/` (structured data) and JSON files in `messages/` (translatable strings). Keystatic is the designated upgrade path when editing friction materialises.**

## Alternatives considered

### Contentful / Sanity / DatoCMS
**Rejected.** Full headless CMSes are disproportionate for a solo portfolio:
- Monthly cost (Contentful free tier has limits; Sanity free tier is minimal)
- A content modelling and API integration effort for 5–10 content types
- Build pipeline complexity: fetch at build time or use ISR
- For a site updated a few times per year, the overhead exceeds the benefit

### Decap CMS (formerly Netlify CMS)
**Rejected.** Git-based editorial UI that runs in-browser. Works with static export. But: React 18 + App Router compatibility is uncertain; the project is on Vercel, not Netlify; the UI is dated; the project no longer has an active corporate backer.

### Tina CMS
**Rejected.** Git-based with a real-time visual editor. Interesting project but: relatively new, more complex to configure than Keystatic, requires a Tina Cloud account for the dashboard.

### Keystatic (upgrade path)
**Not rejected — deferred.** Git-based headless CMS by Thinkmill. Reads/writes files in the repo (Markdown/MDX/YAML/JSON). Integrates with Next.js App Router. No database, no API keys, no monthly cost. The editorial UI is a local admin panel at `/keystatic`. Can be added to the existing repo structure without changing the content format — JSON files written by Keystatic are the same JSON files `next-intl` reads. This is the natural upgrade path if Václav finds editing `messages/cs.json` manually to be friction.

## Why no-CMS now

- The content surface is small: ~100–200 translation strings, ~5 experience entries, ~3–5 work projects
- Content changes are infrequent (updates every few months)
- TypeScript data files give type safety and co-location with the code that renders them
- JSON message files can be edited directly in VS Code or any editor
- No external dependency, no build-time API calls, no auth tokens to manage

## Consequences

- Václav must edit `src/data/*.ts` and `messages/cs.json` in a code editor to update content
- The structured data format must be designed with Keystatic compatibility in mind (YAML/JSON frontmatter rather than arbitrary TypeScript objects) so migration is non-breaking
- If the site grows to include a blog, the no-CMS approach will likely hit friction — that is the natural trigger for Keystatic adoption

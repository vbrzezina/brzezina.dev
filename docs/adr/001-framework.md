# ADR-001: Framework — Next.js App Router

**Status:** accepted  
**Date:** 2026-08-17  
**Decider:** Václav Brzezina

---

## Context

New portfolio site. No previous site existed. Requirements: TypeScript, React, SSR/SSG capable, Vercel hosting, bilingual routing (EN/CS), contact form serverless function, good SEO, public GitHub repo.

## Decision

**Next.js 15+ with App Router and TypeScript.**

## Alternatives considered

| Option | Reason rejected |
|--------|----------------|
| Vite + TanStack Router | No SSR/SSG out of the box; contact form would need a separate backend; SEO metadata API less ergonomic |
| Remix | Strong SSR story but smaller ecosystem; less familiar; Vercel support exists but Next.js is the primary Vercel use case |
| Astro | Excellent for static content-heavy sites; the bilingual routing, contact form API route, and React-heavy component surface make Next.js a more natural fit |
| Gatsby | Declining ecosystem; GraphQL data layer is unnecessary overhead for a portfolio; slower builds |
| SvelteKit | Would require full stack switch away from React; not aligned with the TypeScript/React positioning of the portfolio |

## Why Next.js

- App Router provides file-system routing, layout nesting, and Server Components out of the box
- Native support for API route handlers (serverless functions on Vercel) — needed for the contact form
- `generateStaticParams` makes bilingual static pre-rendering straightforward
- Vercel is purpose-built for Next.js — zero-config deploy, preview URLs, edge network
- The portfolio itself demonstrates the stack the owner sells as a contractor

## Consequences

- Locked into React and the App Router mental model (`'use client'` / `'use server'` boundary)
- `output: 'export'` (pure static) is possible but disables API routes — see ADR-003
- Must use `app/[locale]/` folder routing for i18n — see ADR-004

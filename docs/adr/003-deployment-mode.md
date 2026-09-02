# ADR-003: Deployment mode — Vercel-native SSG vs static export

**Status:** open  
**Date:** 2026-08-18  
**Decider:** Václav Brzezina (pending HITL confirmation)

---

## Context

The original assumption was `output: 'export'` — a pure static HTML+JS bundle, hostable on any CDN. The problem surfaced when the contact form was designed: `app/api/contact/route.ts` is a Next.js API route handler, which requires a Node.js runtime and does not work with `output: 'export'`.

Two options remain.

---

## Option A — Drop `output: 'export'`, use Vercel-native SSG (recommended)

Remove `output: 'export'` from `next.config.ts`. Vercel's build system auto-provisions:

- Pages with no dynamic data: pre-rendered as static HTML at build time (SSG) — served from Vercel's edge CDN, identical performance to static export
- API routes (`app/api/*`): deployed as Vercel Functions (serverless Node.js)
- ISR available if needed later at zero config change

**What changes for visitors:** nothing. Pages are still statically served from the CDN. The contact form API runs on Vercel's infrastructure without a cold-start penalty for low-traffic functions.

**What changes for i18n:** `next-intl` can use `generateStaticParams` to pre-render all locale trees at build time — identical to static export behaviour. The `localePrefix: 'always'` constraint remains if middleware-based locale detection is not needed.

**Portability tradeoff:** loses the ability to deploy to a non-Vercel CDN (Cloudflare Pages, S3, Netlify) without modification. Given the repo is already on GitHub + Vercel and the decision was made for Vercel hosting from the start, this is acceptable.

---

## Option B — Keep `output: 'export'`, use external form service

- Keep pure static export; no API routes
- Replace the contact form route handler with an external service (Formspree, Netlify Forms, Basin, etc.)
- **Blocker:** Formspree free tier caps at 50 submissions/month — insufficient per research in ADR-006
- Loses full control over form submission UX, email format, and spam handling
- Does not address the root constraint; just moves the problem to a third party

---

## Current state

The codebase currently has no `output: 'export'` in `next.config.ts` — Vercel-native deployment is the implicit default. The contact form placeholder exists at `src/components/sections/Contact.tsx` using a `setTimeout` stub; the actual API route has not been built yet.

## Recommendation

**Option A.** Vercel-native SSG with API routes. The static-export constraint was inherited from an early assumption about deployment flexibility that is not relevant for this project — Vercel is the confirmed host, the stack is Next.js, and the contact form is a first-class requirement.

## Decision needed

Confirm Option A (remove any `output: 'export'` config if present, proceed with Vercel-native). This unblocks ADR-004 (i18n) and ADR-006 (mailer).

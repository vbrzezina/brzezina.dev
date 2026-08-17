# Static export vs Vercel-native SSG deployment

Type: grilling
Status: in_progress
Assignee: claude

## Question

The original assumption was `output: 'export'` (pure static HTML export). However, this disables Next.js API route handlers — meaning the contact form serverless function (`app/api/contact/route.ts`) cannot be deployed with static export.

Two options:

**Option A — Drop `output: 'export'`, use Vercel-native deployment (recommended)**
- Remove `output: 'export'` from `next.config.ts`
- Vercel auto-provisions: SSG pages pre-rendered at build, API routes as Vercel Functions, ISR available if needed later
- Contact form route handler works as-is
- i18n static rendering still works (next-intl's `generateStaticParams` pre-renders all locale trees at build time)
- No behavioural difference for visitors — pages are still statically served from Vercel's CDN

**Option B — Keep `output: 'export'`, use external form service**
- Keep pure static export
- Replace contact form route handler with Formspree, Netlify Forms, or similar external service
- But: Formspree free tier is 50 submissions/month (deal-breaker per research ticket 03)
- Loses full control over form submission UX and email format

Resolve: confirm Option A (drop static export, use Vercel-native SSG) and update the map Notes accordingly.

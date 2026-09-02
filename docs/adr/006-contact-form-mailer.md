# ADR-006: Contact form and mailer

**Status:** open — depends on ADR-003 (deployment mode)  
**Date:** 2026-08-18  
**Decider:** Václav Brzezina

---

## Context

The contact form is a first-class requirement — it is how clients and headhunters reach Václav. The current implementation is a `setTimeout` stub; no actual email is sent. The approach depends on whether `output: 'export'` (static) or Vercel-native SSG is confirmed.

---

## Recommended approach (Option A in ADR-003 confirmed)

**`app/api/contact/route.ts` + Resend SDK.**

- Next.js App Router route handler receives POST from the contact form
- Validates input server-side (name, email, message — required; email format)
- Sends email via Resend API to Václav's address
- Returns `200` on success or `4xx/5xx` with structured error
- No SMTP credentials, no Gmail fragility, no cold-start connection setup
- Single env var: `RESEND_API_KEY`

**Why Resend:**
- Free tier: 3,000 emails/month, 100/day — portfolio traffic will never approach this
- HTTPS-native (REST API call) — no SMTP port issues, no warm-up concerns
- First-class TypeScript SDK with typed response
- SPF/DKIM handled through Resend's domain verification — email deliverability is Resend's problem, not ours
- Used by a large portion of the Next.js ecosystem; documentation quality is high

**Alternatives evaluated:**
| Option | Issue |
|--------|-------|
| Formspree | Free tier: 50 submissions/month — will trip on any minor attention event |
| Netlify Forms | Requires Netlify hosting; project is on Vercel |
| AWS SES | Requires existing AWS footprint and SES domain verification; setup overhead unjustified |
| Nodemailer + Gmail | Gmail OAuth or app password — fragile, subject to Google policy changes, not HTTPS-native |
| SendGrid | More complex setup, pricing less generous at free tier |

---

## If static export is confirmed (Option B in ADR-003)

Resend cannot be used via a route handler (no server runtime). Options narrow to:

- **Basin / Formcarry / Web3Forms** — newer Formspree alternatives with more generous free tiers (Basin: 250/month, Web3Forms: 250/month). Acceptable volume. Lose full UX control and email format customisation.
- **Netlify Functions** — would require a dual-platform deployment or separate API microservice; over-engineered.

This path is not recommended — see ADR-003 Option A.

---

## Current state

- Form component exists at `src/components/sections/Contact.tsx` with `handleSubmit` using a `setTimeout` stub
- No `app/api/contact/route.ts` yet
- No `RESEND_API_KEY` env var

## What needs to happen next

1. Confirm deployment mode (ADR-003)
2. Create `app/api/contact/route.ts` with Resend integration
3. Add `RESEND_API_KEY` to Vercel project env vars (preview + production)
4. Wire the form's `fetch('/api/contact', ...)` call to replace the stub
5. Add server-side validation and error response handling
6. Add rate limiting (simple in-memory or Vercel's native IP limiting) to prevent abuse

# ADR-006: Contact form and mailer

**Status:** accepted  
**Date:** 2026-08-18 · resolved 2026-10-13  
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

## Resolution (2026-10-13)

Implemented as `src/app/api/contact/route.ts`:

- **Resend SDK** (`resend` v6, `emails.send` with a 10 s `AbortSignal`). A plain `fetch` was tried first to avoid the SDK's inbound and webhook dependencies (`postal-mime`, `standardwebhooks`). The owner preferred the SDK for its typed payloads, `{ data, error }` results and upstream-maintained API changes.
- **Fixed recipient.** `to` comes only from `CONTACT_TO_EMAIL`, and the visitor's address goes in `reply_to`, so the endpoint can never be used to mail third parties. The body is plain text only, so nothing the visitor typed is rendered as HTML.
- **Env:** `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are required; without them the route returns `503` and the form shows its error state. `CONTACT_FROM_EMAIL` is optional and defaults to `contact@brzezina.dev`. See `.env.example`.
- **Sender display name:** `"<visitor's name> via brzezina.dev" <contact@brzezina.dev>`, so the inbox shows who wrote. Mail can't be sent *from* the visitor's own address, because it would fail SPF/DMARC on their domain, so their address goes in Reply-To.
- **Validation:** server-side, mirroring the client: name ≤ 120 chars (control characters stripped, single line), email ≤ 254, message ≤ 5000, body ≤ 16 kB (`413`).
- **Abuse controls:**
  - same-origin check on `Origin` (`403`);
  - a honeypot field, which gets a silent `200` without sending;
  - a best-effort per-instance rate limit of 5 per IP per 10 minutes (`429`);
  - Resend's daily cap as the backstop.
- **Provider failure:** returns `502`, logged as `[contact] …`. The form keeps the typed message and offers a `mailto:` fallback.
- **Privacy policy:** names Resend as the processor and adds it to the US transfers paragraph.
- **Hardening (2026-10-13, after a review):**
  - the body limit is enforced while streaming (a chunked request has no `Content-Length`);
  - the origin check compares against the forwarded host first, so it keeps working behind a proxy;
  - the honeypot field is named `contact_trap` (a name like `website` is autofilled by password managers, which silently dropped real messages) and each hit is logged;
  - limits and the email pattern live in `src/lib/contact.ts`, shared with the form, which now sets `maxLength` and shows distinct copy for rate-limited and rejected submissions;
  - the email pattern rejects `< > " , ;`, so `x<a@b.cc>` can't reach `Reply-To`.

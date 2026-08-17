# Contact form mailer for Vercel serverless functions

Type: research
Status: resolved

## Question

What are the best options for sending email from a Vercel serverless function (Node.js runtime) for a portfolio contact form?

Evaluate:
1. **Resend** — pricing, free tier, DX, Next.js ecosystem fit, cold-start impact
2. **Formspree** — no-code form backend, free tier, tradeoffs vs custom serverless function
3. **Nodemailer + SMTP** (e.g. Gmail, Zoho) — viability for personal portfolio
4. **AWS SES** — cost, complexity, already in tech stack

Key constraints: public GitHub repo (no secrets in code), Vercel env vars for credentials, personal portfolio (very low volume), simple form (name, email, message).

Surface: recommended approach with rationale and any deal-breakers.

## Answer

### Context recap
Personal portfolio, public GitHub repo, Vercel hosting (Node.js serverless functions), secrets only in Vercel env vars. Volume: single-digit or dozens of contact form submissions per month.

---

### Option 1 — Resend (RECOMMENDED)

**What it is:** HTTP email API purpose-built for developers. Official `resend` npm package. First-class Next.js and Vercel support.

**Free tier (as of 2025):** 3,000 transactional emails/month, 100/day ceiling. For a personal portfolio this is effectively unlimited — a 100/day cap is never reached by contact form traffic.

**Paid plans:** Pro/Scale/Enterprise tiers remove the daily cap and add volume; pricing is per-email at roughly $0.20–$0.80 per 1,000 emails depending on tier, with a flat monthly base. Irrelevant at portfolio scale.

**DX:** Minimal setup — one environment variable (`RESEND_API_KEY`). SDK is tiny, fully typed TypeScript, works inside a Next.js App Router Route Handler in ~10 lines. No persistent TCP connection, no SMTP handshake — pure HTTPS POST, so it is serverless-native and cold-start safe.

**Next.js fit:** Excellent. Resend ships an official guide for Next.js API routes and App Router route handlers. Compatible with `output: 'export'` sites that add a separate serverless function (e.g., `app/api/contact/route.ts` deployed on Vercel even when the rest of the site is statically exported).

**Domain requirement:** You must verify your sending domain (DNS TXT/CNAME records). For a personal portfolio you would send `from: contact@brzezina.dev` — a 5-minute DNS setup. There is no sandbox restriction once the domain is verified.

**Deal-breakers:** None for this use case.

---

### Option 2 — Formspree

**What it is:** Managed form backend — you post your HTML form directly to a Formspree endpoint; they handle submission storage, spam filtering, and email notification. No serverless function needed on your side.

**Free tier (2025):** 50 submissions/month on the free plan. Paid plans start ~$10/month for higher volume and custom redirects.

**Tradeoffs vs. custom function:**
- Pro: zero backend code, works with static export without writing any route handler.
- Con: 50 submissions/month free cap is very tight (a few spam bots can burn through it); you lose control over the email format and UX during submission; the "from" address is Formspree's domain, not yours; requires an outbound POST to a third-party endpoint from the browser (no server-side validation, CORS considerations).
- Con: it couples the contact form to a SaaS with its own pricing trajectory; switching later means changing the form action.

**Verdict:** The 50-submission free cap is a practical deal-breaker unless you pay. Also, rolling a custom route handler (which you would do anyway for Resend) gives you far more control for essentially zero extra effort given the stack.

---

### Option 3 — Nodemailer + SMTP (Gmail / Zoho / Fastmail)

**What it is:** Node.js SMTP client library; pairs with any SMTP provider's credentials.

**Viability for personal portfolio on Vercel serverless:**

- **Gmail:** Google deprecated basic ("less secure app") password auth in 2022. Gmail SMTP now requires OAuth2 — which means a Google Cloud project, a client ID/secret, and a refresh token stored in env vars. The refresh token expires (typically 6 months of disuse or when Google revokes it); when it expires the contact form silently breaks. This is a maintenance trap for a personal site. The alternative — a Google "App Password" with 2FA — technically still works as of 2025 but is tied to the personal Google account security posture and not recommended for automated sending.

- **Zoho / Fastmail / other SMTP:** More stable than Gmail; Zoho's free plan allows SMTP with a plain username/password credential. However, Nodemailer opens a persistent TCP connection for SMTP, which is mismatched with the ephemeral, stateless nature of serverless functions. Each invocation creates a new SMTP connection (TLS handshake + auth round-trip), adding 200–500 ms of cold-path latency. For a contact form this is acceptable but not elegant.

- **Bundle size:** Nodemailer is ~200 KB unpacked. Not a concern for a serverless function but worth noting.

- **Overall verdict:** Works, but every option introduces friction that Resend eliminates. Gmail is fragile. Generic SMTP is more stable but adds TCP handshake overhead and requires maintaining credentials for a separate mail service.

---

### Option 4 — AWS SES

**What it is:** Amazon's bulk/transactional email service. Very cheap at scale (~$0.10 per 1,000 emails), no base monthly fee.

**Free tier:** 62,000 emails/month when sent from an EC2 instance; only 3,000/month when invoked from outside AWS (e.g., Vercel serverless). The 3,000/month limit matches Resend's free tier.

**Complexity vs. benefit:**

- Requires: AWS account, IAM user with SES permissions (or better, an IAM role — not straightforward from Vercel), domain verification in SES (similar DNS steps to Resend), production access request to exit the SES sandbox (new accounts are sandboxed and can only send to verified addresses — requires manual AWS support request), and using either `@aws-sdk/client-ses` + Nodemailer SES transport or direct SES API calls.
- The IAM key approach stores `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in Vercel env vars — workable but heavier than a single `RESEND_API_KEY`.
- The sandbox exit process adds a day or more of delay at setup time.

**Verdict:** AWS SES makes sense if you are already deep in AWS infrastructure (e.g., deploying other services there and using IAM roles). For a standalone Vercel portfolio site with no other AWS footprint, the setup overhead and sandbox policy are a poor fit. The per-email cost advantage is irrelevant at single-digit monthly volume.

---

### Recommendation: Resend

**Use Resend.** It is the correct tool for this situation:

1. Free tier (3,000/month, 100/day) covers lifetime portfolio contact volume.
2. Zero cold-start penalty — HTTPS POST, no persistent connection.
3. Single env var (`RESEND_API_KEY`), no OAuth dance.
4. Typed SDK, official Next.js App Router example, works identically in local `next dev` and Vercel production.
5. Domain verified once; no recurring credential rotation.
6. No third-party JS in the browser (unlike Formspree or embedded form services).

**Implementation sketch:**

```ts
// app/api/contact/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  const { error } = await resend.emails.send({
    from: 'Contact Form <contact@brzezina.dev>',
    to: 'v@brzezina.dev',
    replyTo: email,
    subject: `New message from ${name}`,
    text: message,
  });
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ ok: true });
}
```

One Vercel env var, one DNS record, done.

**Note on static export:** `output: 'export'` disables Next.js API routes. If static export is kept, two options: (a) switch to `output: undefined` (server mode) for Vercel — recommended since Vercel handles serverless routing natively; or (b) keep static export and deploy the contact API as a separate Vercel serverless function outside the Next.js build. Option (a) is simpler and has no downside on Vercel.

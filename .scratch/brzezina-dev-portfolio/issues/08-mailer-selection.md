# Contact form mailer selection

Type: grilling
Status: resolved
Blocked by: 03

## Question

Which mailer service should be used for the contact form Vercel serverless function?

Depends on research from "Contact form mailer for Vercel serverless functions".

Constraints: public repo, Vercel env vars for secrets, very low volume, personal portfolio.

Resolve: select and commit to one approach with rationale.

## Answer

**Resend** — confirmed by the owner on 2026-10-13 ("we have Resend available now"). Implemented in `src/app/api/contact/route.ts` via a plain `fetch` to the Resend API (no SDK); env `RESEND_API_KEY` + `CONTACT_TO_EMAIL`. Details in `docs/adr/006-contact-form-mailer.md`.

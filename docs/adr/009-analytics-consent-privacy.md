# ADR-009: Analytics, cookie consent and privacy policy

**Status:** accepted
**Date:** 2026-10-13
**Decider:** Václav Brzezina

---

## Context

The confirmed stack includes Vercel Analytics, GA4 via Google Tag Manager, and Google Search Console. The site is run by a Czech sole trader (IČO), collects personal data through the contact form, and targets EU visitors — so GDPR, the ePrivacy rules (Czech Electronic Communications Act §89(3), opt-in since 2022) and Civil Code §435 (business identification on the website) apply.

## Decision

1. **No non-essential storage by default.** next-intl's `NEXT_LOCALE` cookie is disabled (`localeCookie: false`) — the locale is always in the URL. Theme and consent choices live in `localStorage` (strictly necessary, user-requested).
2. **Vercel Web Analytics and Speed Insights for everyone** — cookieless, aggregate (page views; Core Web Vitals), no consent needed. Both are named in the privacy policy's analytics section.
3. **GA4 only through GTM, and GTM only after opt-in.** Nothing from Google loads before the visitor clicks *Accept* — no script, no requests. Consent Mode v2 defaults (`denied` for analytics and all ad signals) are pushed before the container boots, followed by `analytics_storage: granted`. Ad signals are never granted.
4. **Consent banner:** non-modal card, Accept and Reject with equal visual weight, privacy link inline. Choice remembered for 12 months. "Cookie settings" in the footer reopens it; withdrawing updates Consent Mode and deletes `_ga` cookies.
5. **Configuration by environment:** `NEXT_PUBLIC_GTM_ID` (validated `GTM-[A-Z0-9]+`). Without it nothing loads and no banner renders — so previews and local builds are tracking-free.
6. **Privacy policy** at `/[locale]/privacy` (EN/CS), linked from the footer, the contact form and the banner. Covers the form, hosting logs, both analytics tools, storage table, US transfers, rights and the ÚOOÚ complaint route.
7. **Business identification** (`legal` in `src/data/site.ts`) renders in the Contact section (05) aside and the privacy policy controller section. Civil Code §435 requires it to be available on the website, not on every page, so it is not repeated in the footer.
8. **No Terms of use** — no accounts, purchases or user content; engagement terms belong in contracts.

## Alternatives considered

- **Vercel Analytics only (no GA4):** no banner at all. Rejected by the owner — GA4/GTM is wanted.
- **Consent Mode v2 "advanced" (load GTM before consent, cookieless pings):** more data, but EU regulators are sceptical of pre-consent pings. Rejected for the stricter "basic" pattern.
- **Third-party CMP (Cookiebot, CookieYes …):** heavy for one optional tool, adds its own script and branding. Rejected.

## Consequences

- Search Console must be verified via DNS (no meta tag, no script).
- Adding any new non-essential tool means extending the banner copy, the privacy policy table and this ADR.
- Vercel Web Analytics and Speed Insights must each be enabled in the Vercel dashboard; locally their scripts 404 harmlessly.
- `site.contactEmail` (`vaclav@brzezina.dev`) needs a working mailbox or forward before launch.

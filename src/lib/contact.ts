/** Contact form rules shared by the form (src/components/sections/Contact.tsx) and the API route. */

export const CONTACT_LIMITS = { name: 120, email: 254, message: 5000 } as const;

/** One @, a dotted domain, and none of the characters that could smuggle a second address or markup. */
export const EMAIL_PATTERN = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]{2,}$/;

/**
 * Honeypot field name. Deliberately unlike anything a password manager recognises ("website", "url",
 * "company"): autofill filling it would make the server silently drop a real message.
 */
export const HONEYPOT_FIELD = 'contact_trap';

/**
 * Machine-readable errors returned by the route, mapped to copy by the form. `rate_limited` is not produced by the
 * route itself: it is what a Vercel firewall rate-limit rule (the place to add one) would answer with, and the form
 * already has copy for it.
 */
export type ContactError = 'invalid' | 'origin' | 'rate_limited' | 'not_configured' | 'send_failed';

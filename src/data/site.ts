/** Site-wide constants. No translatable strings — copy lives in messages/*.json. */

export const SECTION_IDS = ['about', 'experience', 'services', 'work', 'contact'] as const;

export const site = {
  /** Canonical origin — used for metadataBase, canonical/hreflang URLs, the sitemap and structured data. */
  url: 'https://brzezina.dev',
  githubUrl: 'https://github.com/vbrzezina',
  githubLabel: 'github.com/vbrzezina',
  linkedinUrl: 'https://www.linkedin.com/in/vaclav-brzezina/',
  linkedinLabel: 'linkedin.com/in/vaclav-brzezina',
  repoUrl: 'https://github.com/vbrzezina/brzezina.dev',
  cvUrl: '/cv.pdf',
  /** Saved filename for `download` — ASCII so it survives every OS and mail client. */
  cvFileName: 'Vaclav-Brzezina-CV.pdf',
  // Route handler: src/app/api/contact/route.ts (Resend). Needs RESEND_API_KEY + CONTACT_TO_EMAIL.
  contactEndpoint: '/api/contact',
  // Needs a mailbox or forwarding set up on the domain before going live.
  contactEmail: 'vaclav@brzezina.dev',
  phone: '+420 604 716 317',
  phoneHref: 'tel:+420604716317',
} as const;

/**
 * Business identification (Czech Civil Code §435 — required on the website of anyone trading under an IČO;
 * the website as a whole, not every page). Shown in the Contact section and on the privacy page.
 */
export const legal = {
  name: 'Václav Brzezina',
  ico: '04162358',
  address: 'Makedonská 629/2, Střížkov, 190 00 Praha 9',
} as const;

export const hasLegalIdentity = Boolean(legal.ico && legal.address);

/** Google Tag Manager container — set NEXT_PUBLIC_GTM_ID in Vercel. Without it nothing loads and no banner shows. */
const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID ?? '';
export const gtmId = /^GTM-[A-Z0-9]+$/.test(rawGtmId) ? rawGtmId : null;

/** Past clients shown in the hero proof strip. */
export const CLIENTS = ['SAP', 'Burberry', 'Walmart', 'PSA', 'Veolia', 'Carvago', 'Logio'] as const;

/** Values for the hero `whoami` card; labels are translated. */
export const WHOAMI = {
  stack: ['TypeScript', 'React', 'NestJS', 'AWS'],
  speaks: ['EN', 'CS'],
} as const;

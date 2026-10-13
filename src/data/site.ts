/** Site-wide constants. No translatable strings — copy lives in messages/*.json. */

export const SECTION_IDS = ['about', 'experience', 'services', 'work', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const site = {
  githubUrl: 'https://github.com/vbrzezina',
  githubLabel: 'github.com/vbrzezina',
  linkedinUrl: 'https://www.linkedin.com/in/vaclav-brzezina/',
  linkedinLabel: 'linkedin.com/in/vaclav-brzezina',
  repoUrl: 'https://github.com/vbrzezina/brzezina.dev',
  // The PDF itself still needs adding to public/ (see redesign spec §8).
  cvUrl: '/cv.pdf',
  // Route handler not implemented yet (tickets 08/10) — until then submissions fail visibly.
  contactEndpoint: '/api/contact',
  // Needs a mailbox or forwarding set up on the domain before going live.
  contactEmail: 'vaclav@brzezina.dev',
} as const;

/**
 * Business identification (Czech Civil Code §435 — required on the website of anyone trading under an IČO).
 * Rendered in the footer and on the privacy page only once `ico` and `address` are filled in.
 */
export const legal = {
  name: 'Václav Brzezina',
  ico: '', // TODO: IČO
  address: '', // TODO: registered business address (místo podnikání)
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

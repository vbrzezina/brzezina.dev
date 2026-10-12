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
} as const;

/** Past clients shown in the hero proof strip. */
export const CLIENTS = ['Burberry', 'Walmart', 'PSA', 'Veolia', 'Carvago', 'Logio'] as const;

/** Values for the hero `whoami` card; labels are translated. */
export const WHOAMI = {
  stack: ['TypeScript', 'React', 'NestJS', 'AWS'],
  speaks: ['EN', 'CS'],
} as const;

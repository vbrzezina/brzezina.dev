/** Site-wide constants. No translatable strings — copy lives in messages/*.json. */

export const SECTION_IDS = ['about', 'experience', 'services', 'work', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const site = {
  githubUrl: 'https://github.com/vbrzezina',
  githubLabel: 'github.com/vbrzezina',
  repoUrl: 'https://github.com/vbrzezina/brzezina.dev',
  // TODO: point at the PDF once it is added to public/ (see redesign spec §8).
  cvUrl: '#',
} as const;

/** Past clients shown in the hero proof strip. */
export const CLIENTS = ['Burberry', 'Walmart', 'PSA', 'Veolia', 'Carvago', 'Logio'] as const;

/** Values for the hero `whoami` card; labels are translated. */
export const WHOAMI = {
  stack: ['TypeScript', 'React', 'NestJS', 'AWS'],
  speaks: ['EN', 'CS', 'SK'],
} as const;

import { site } from './site';

/** Portfolio entries. Descriptions live in messages `work.*`. */

export const FEATURED_PROJECT = {
  id: 'brzezina-dev',
  title: 'brzezina.dev',
  url: site.repoUrl,
  stack: ['Next.js', 'TypeScript', 'Emotion', 'Radix UI', 'next-intl'],
} as const;

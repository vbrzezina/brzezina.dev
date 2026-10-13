import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { routing } from '@/i18n/routing';

/** Pages below the locale prefix; '' is the home page. Add new content pages here (e.g. blog posts). */
const PATHS = [
  { path: '', priority: 1 },
  { path: '/privacy', priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PATHS.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified,
      priority,
      alternates: {
        languages: {
          en: `${site.url}/en${path}`,
          cs: `${site.url}/cs${path}`,
          'x-default': path ? `${site.url}/en${path}` : `${site.url}/`,
        },
      },
    })),
  );
}

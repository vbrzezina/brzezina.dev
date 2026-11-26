import type { MetadataRoute } from 'next';
import lastModified from '@/data/lastModified.json';
import { site } from '@/data/site';
import { routing } from '@/i18n/routing';

/**
 * Pages below the locale prefix; '' is the home page. Add new content pages here (e.g. blog posts), and
 * to PAGES in scripts/lastmod.mjs so their <lastmod> follows their content.
 */
const PATHS = [
  { path: '', priority: 1 },
  { path: '/privacy', priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      // Date of the page's last content change, kept by scripts/lastmod.mjs — not the build date,
      // which would tell crawlers every page changed on every deploy.
      lastModified: lastModified[path].date,
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

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  // The locale is always in the URL, so no cookie is needed to remember it.
  // Keeping the site free of non-essential cookies means the consent banner only ever covers analytics.
  localeCookie: false,
  // hreflang is declared once, in each page's metadata (src/lib/seo.ts), with canonical URLs.
  // The middleware's own Link header derives its host from the request, so it would disagree
  // with the canonical origin on previews or a www host.
  alternateLinks: false,
});

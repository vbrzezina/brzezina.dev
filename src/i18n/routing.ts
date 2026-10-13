import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  // The locale is always in the URL, so no cookie is needed to remember it.
  // Keeping the site free of non-essential cookies means the consent banner only ever covers analytics.
  localeCookie: false,
});

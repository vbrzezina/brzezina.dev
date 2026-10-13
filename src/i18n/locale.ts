import { notFound } from 'next/navigation';
import { hasLocale, type Locale } from 'next-intl';
import { routing } from './routing';

/** Awaits a route's `locale` param and narrows it to a supported locale — or renders the 404. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

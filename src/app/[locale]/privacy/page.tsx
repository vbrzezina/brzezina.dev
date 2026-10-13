import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContentPage } from '@/components/layout/ContentPage';
import { resolveLocale } from '@/i18n/locale';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return pageMetadata({ locale, path: '/privacy', title: t('metaTitle'), description: t('metaDescription') });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const home = `/${locale}`;

  return (
    <ContentPage homeHref={home}>
      <PrivacyPolicy />
    </ContentPage>
  );
}

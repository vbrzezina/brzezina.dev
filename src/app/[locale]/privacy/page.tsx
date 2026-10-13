import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContentPage } from '@/components/layout/ContentPage';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const home = `/${locale}`;

  return (
    <ContentPage homeHref={home}>
      <PrivacyPolicy />
    </ContentPage>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/nav/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
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
    <>
      <SiteNav homeHref={home} />
      <main id="main" tabIndex={-1}>
        <PrivacyPolicy />
      </main>
      <SiteFooter homeHref={home} />
    </>
  );
}

import { useLocale, useTranslations } from 'next-intl';
import { ContentPage } from '@/components/layout/ContentPage';
import { NotFoundContent } from '@/components/layout/NotFoundContent';

/** Shown for any unknown path below a valid locale (see the [...rest] catch-all). */
export default function LocaleNotFound() {
  const locale = useLocale();
  const t = useTranslations('notFound');

  return (
    <ContentPage homeHref={`/${locale}`}>
      <NotFoundContent title={t('title')} body={t('body')} homeLabel={t('home')} />
    </ContentPage>
  );
}

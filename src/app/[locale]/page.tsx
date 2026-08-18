import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('hero');

  return (
    <main>
      <section className="scroll-section">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>{t('heading')}</h1>
        <p>{t('subheading')}</p>
      </section>
    </main>
  );
}

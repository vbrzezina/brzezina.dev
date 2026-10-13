import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { SERVICES } from '@/data/services';
import { homeStructuredData } from '@/lib/structuredData';
import { SiteNav } from '@/components/nav/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Contact } from '@/components/sections/Contact';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: 'meta' });
  const services = await getTranslations({ locale, namespace: 'services.items' });

  return (
    <>
      <JsonLd
        data={homeStructuredData({
          locale,
          description: meta('description'),
          jobTitle: meta('jobTitle'),
          serviceNames: SERVICES.map(({ id }) => services(`${id}.title`)),
          knowsAbout: ['TypeScript', 'React', 'Next.js', 'Node.js', 'NestJS', 'GraphQL', 'AWS Lambda', 'AWS CDK', 'PostgreSQL'],
        })}
      />
      <SiteNav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Services />
        <Work />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

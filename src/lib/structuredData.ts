import { legal, site } from '@/data/site';

interface StructuredDataInput {
  locale: string;
  description: string;
  jobTitle: string;
  serviceNames: string[];
  knowsAbout: readonly string[];
}

/**
 * schema.org graph for the home page: the person, the sole-trader business they run, and the site.
 * Everything here is already public on the page (contact section, privacy policy, footer links).
 */
export function homeStructuredData({ locale, description, jobTitle, serviceNames, knowsAbout }: StructuredDataInput) {
  const home = `${site.url}/${locale}`;
  const address = {
    '@type': 'PostalAddress',
    streetAddress: 'Makedonská 629/2',
    addressLocality: 'Praha 9',
    postalCode: '190 00',
    addressCountry: 'CZ',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: legal.name,
        jobTitle,
        description,
        url: home,
        email: `mailto:${site.contactEmail}`,
        telephone: site.phone.replace(/\s/g, ''),
        sameAs: [site.githubUrl, site.linkedinUrl],
        knowsAbout,
        knowsLanguage: ['en', 'cs'],
        worksFor: { '@id': `${site.url}/#business` },
        address: { '@type': 'PostalAddress', addressLocality: 'Praha', addressCountry: 'CZ' },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#business`,
        name: `${legal.name} — software development`,
        url: home,
        founder: { '@id': `${site.url}/#person` },
        identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: legal.ico },
        address,
        email: site.contactEmail,
        telephone: site.phone.replace(/\s/g, ''),
        areaServed: ['CZ', 'Europe'],
        availableLanguage: ['en', 'cs'],
        makesOffer: serviceNames.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.url.replace('https://', ''),
        inLanguage: ['en', 'cs'],
        publisher: { '@id': `${site.url}/#person` },
      },
    ],
  };
}

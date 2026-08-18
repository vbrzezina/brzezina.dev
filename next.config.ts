import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  // output: 'export', // Uncomment when ticket 10 resolves to static export
};

export default withNextIntl(nextConfig);

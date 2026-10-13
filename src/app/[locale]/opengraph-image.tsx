import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { site } from '@/data/site';
import { routing } from '@/i18n/routing';

export const alt = 'Václav Brzezina — brzezina.dev';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TEAL = '#38e0d3';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Social preview card (1200×630), localized, in the site's dark blueprint style. */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: '#eef3f8',
          background: '#050e19',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontFamily: 'monospace' }}>
          <span style={{ color: TEAL, marginRight: 14 }}>$</span>
          <span>{site.url.replace('https://', '')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>Václav Brzezina</div>
          <div style={{ marginTop: 28, fontSize: 40, color: TEAL, fontFamily: 'monospace' }}>{t('ogRole')}</div>
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#a9b4c2' }}>{t('ogTagline')}</div>
      </div>
    ),
    size,
  );
}

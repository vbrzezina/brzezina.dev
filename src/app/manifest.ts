import type { MetadataRoute } from 'next';
import { legal } from '@/data/site';

/**
 * Web app manifest: makes the site installable ("Add to Home Screen") with its own icon and no browser UI.
 * There is deliberately no service worker, so nothing is cached offline and a deploy shows up immediately.
 *
 * One manifest serves both locales, so the text is English; the installed app opens `/`, which redirects
 * to the visitor's language like any other first visit.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: legal.name,
    short_name: 'brzezina.dev',
    description: 'Senior TypeScript and React engineer in Prague, available for freelance and contract work.',
    lang: 'en',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    // Splash screen and (Android) status bar while it launches: the dark canvas, the site's primary mode.
    background_color: '#050e19',
    theme_color: '#07101f',
    categories: ['business', 'portfolio'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Full-bleed, with the mark inside the central safe zone, so any platform mask keeps it whole.
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Long-press the installed icon.
    shortcuts: [
      { name: 'Download CV', short_name: 'CV', url: '/cv.pdf' },
      { name: 'Get in touch', short_name: 'Contact', url: '/#contact' },
    ],
  };
}

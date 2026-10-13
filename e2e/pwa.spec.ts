import { expect, test } from '@playwright/test';
import { LOCALES } from './helpers';

test.describe('web app manifest', () => {
  test('is served as a manifest and has what installability needs', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/manifest+json');
    const manifest = await response.json();
    expect(manifest).toMatchObject({
      id: '/',
      name: 'Václav Brzezina',
      start_url: '/',
      scope: '/',
      display: 'standalone',
    });
    expect(manifest.short_name.length).toBeLessThanOrEqual(12); // longer names are truncated under the icon
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('has icons that exist and are the size they declare, including a maskable one', async ({ page }) => {
    await page.goto('/en');
    const manifest = await (await page.request.get('/manifest.webmanifest')).json();

    expect(manifest.icons.some((i: { sizes: string }) => i.sizes === '192x192')).toBe(true);
    expect(manifest.icons.some((i: { sizes: string }) => i.sizes === '512x512')).toBe(true);
    expect(manifest.icons.some((i: { purpose: string }) => i.purpose === 'maskable')).toBe(true);

    for (const icon of manifest.icons) {
      const actual = await page.evaluate(async (src) => {
        const response = await fetch(src);
        const bitmap = await createImageBitmap(await response.blob());
        return { status: response.status, size: `${bitmap.width}x${bitmap.height}` };
      }, icon.src);
      expect(actual, icon.src).toEqual({ status: 200, size: icon.sizes });
    }
  });

  test('is accepted by the browser with no parse errors', async ({ page }) => {
    await page.goto('/en');
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Page.enable');

    const { errors } = await cdp.send('Page.getAppManifest');
    expect(errors).toEqual([]);
  });

  for (const locale of LOCALES) {
    test(`/${locale} links the manifest and tints the browser UI to the site`, async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
      const colours = await page
        .locator('meta[name="theme-color"]')
        .evaluateAll((metas) =>
          metas.map((meta) => ({ media: meta.getAttribute('media'), content: meta.getAttribute('content') })),
        );
      expect(colours).toEqual([
        { media: '(prefers-color-scheme: dark)', content: '#07101f' },
        { media: '(prefers-color-scheme: light)', content: '#fefefb' },
      ]);
    });
  }

  test('does not register a service worker (no offline caching, by decision)', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const registrations = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length);
    expect(registrations).toBe(0);
  });
});

import { expect, test } from '@playwright/test';
import { collectConsoleErrors, LOCALES } from './helpers';

for (const locale of LOCALES) {
  test.describe(`/${locale}`, () => {
    test('renders the home page with every section and no console errors', async ({ page }) => {
      const errors = collectConsoleErrors(page);
      const response = await page.goto(`/${locale}`);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Václav Brzezina');
      for (const id of ['about', 'experience', 'services', 'work', 'contact']) {
        await expect(page.locator(`#${id}`)).toBeAttached();
      }
      expect(errors).toEqual([]);
    });

    test('renders the privacy policy', async ({ page }) => {
      const errors = collectConsoleErrors(page);
      const response = await page.goto(`/${locale}/privacy`);

      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('table')).toBeVisible(); // the storage table
      expect(errors).toEqual([]);
    });

    test('sets no cookies', async ({ page, context }) => {
      await page.goto(`/${locale}`);
      expect(await context.cookies()).toEqual([]);
    });
  });
}

test('the Czech page has Czech metadata, not the English title', async ({ page }) => {
  await page.goto('/en');
  const english = await page.title();
  await page.goto('/cs');

  expect(await page.title()).not.toBe(english);
});

test('the root redirects by browser language', async ({ browser }) => {
  const czech = await browser.newContext({
    locale: 'cs-CZ',
    extraHTTPHeaders: { 'accept-language': 'cs-CZ,cs;q=0.9' },
  });
  const page = await czech.newPage();
  await page.goto('/');
  expect(new URL(page.url()).pathname).toBe('/cs');
  await czech.close();

  const english = await browser.newPage();
  await english.goto('/');
  expect(new URL(english.url()).pathname).toBe('/en');
});

test.describe('unknown paths', () => {
  for (const path of ['/en/nope', '/cs/nope', '/foo.bar', '/en/privacy/extra']) {
    test(`${path} is a 404`, async ({ page }) => {
      expect((await page.goto(path))?.status()).toBe(404);
    });
  }
});

test('the CV downloads under a friendly file name', async ({ page }) => {
  await page.goto('/en');
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('header a[download]').click()]);

  expect(download.suggestedFilename()).toBe('Vaclav-Brzezina-CV.pdf');
});

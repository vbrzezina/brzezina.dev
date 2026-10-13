import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { LOCALES, useTheme } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

for (const locale of LOCALES) {
  for (const path of ['', '/privacy']) {
    for (const theme of ['dark', 'light'] as const) {
      for (const viewport of [
        { width: 1440, height: 900 },
        { width: 390, height: 844 },
      ]) {
        test(`/${locale}${path} has no axe violations (${theme}, ${viewport.width}px)`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await useTheme(page, theme);
          await page.goto(`/${locale}${path}`);
          await page.waitForLoadState('networkidle');

          const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
          expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
        });
      }
    }
  }
}

test('the mobile menu has no axe violations while open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test('the skip link is the first tab stop and moves focus to main content', async ({ page }) => {
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

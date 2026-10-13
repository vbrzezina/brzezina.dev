import type { Page } from '@playwright/test';

export const LOCALES = ['en', 'cs'] as const;

/**
 * Console errors that matter. The /_vercel/* scripts (Web Analytics, Speed Insights) only exist on Vercel:
 * elsewhere they 404 with an HTML body, which the browser reports as a failed load or, with
 * `X-Content-Type-Options: nosniff`, a refused script. Neither says anything about the site.
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    if (/Failed to load resource.*404/.test(message.text())) return;
    if (message.text().includes('/_vercel/')) return;
    errors.push(message.text());
  });
  return errors;
}

/** Sets the stored theme before the first paint. */
export async function useTheme(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
}

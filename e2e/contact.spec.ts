import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Every request to the mailer is stubbed: no test here can send an email. */
async function stubContact(page: Page, status: number, body: object = { ok: status === 200 }) {
  const requests: unknown[] = [];
  await page.route('**/api/contact', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  return requests;
}

async function fillForm(page: Page, message = 'We are hiring a senior engineer.') {
  await page.getByLabel('Name').fill('Jana Nováková');
  await page.getByLabel('Email').fill('jana@firma.cz');
  await page.getByLabel('Message').fill(message);
}

/** Alerts inside the form. Next also keeps a role="alert" route announcer on every page, which is not ours. */
const alerts = (page: Page) => page.locator('#contact').getByRole('alert');

test.beforeEach(async ({ page }) => {
  await page.goto('/en');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  // The section fades in over 700ms; contrast (and any visual assertion) must wait for it to settle.
  await page.waitForFunction(() =>
    [...document.querySelectorAll('#contact [data-reveal]')].every((el) => getComputedStyle(el).opacity === '1'),
  );
});

test('an empty submit announces every error and focuses the first invalid field', async ({ page }) => {
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(alerts(page)).toHaveCount(3);
  const name = page.getByLabel('Name');
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  const describedBy = await name.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${describedBy}"]`)).toHaveText('Please enter your name');
});

test('an invalid field shows a red focus ring, a valid one the accent ring', async ({ page }) => {
  await page.getByRole('button', { name: 'Send message' }).click();
  const invalid = await page.getByLabel('Name').evaluate((el) => getComputedStyle(el).outlineColor);
  await page.getByLabel('Name').fill('Jana');
  await page.getByLabel('Name').focus();
  const valid = await page.getByLabel('Name').evaluate((el) => getComputedStyle(el).outlineColor);

  expect(invalid).not.toBe(valid);
  expect(valid).toBe(
    await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()),
  );
});

test('a successful send shows the confirmation, then returns focus to the form for the next message', async ({
  page,
}) => {
  const requests = await stubContact(page, 200);
  await fillForm(page);
  await page.getByRole('button', { name: 'Send message' }).click();

  const status = page.getByRole('status').filter({ hasText: 'Message sent' });
  await expect(status).toBeVisible();
  await expect(status).toBeFocused();
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({ name: 'Jana Nováková', email: 'jana@firma.cz', contact_trap: '' });

  await page.getByRole('button', { name: 'Send another message' }).click();
  await expect(page.getByLabel('Name')).toBeFocused();
  await expect(page.getByLabel('Name')).toHaveValue('');
});

test('a failed send keeps the message, offers the email address, and leaves focus on the button', async ({ page }) => {
  await stubContact(page, 502, { ok: false, error: 'send_failed' });
  await fillForm(page, 'Keep this text.');
  const submit = page.getByRole('button', { name: 'Send message' });
  await submit.focus();
  await page.keyboard.press('Enter');

  const alert = alerts(page);
  await expect(alert).toContainText('Your message couldn’t be sent.');
  await expect(alert.getByRole('link')).toHaveAttribute('href', 'mailto:vaclav@brzezina.dev');
  await expect(page.getByLabel('Message')).toHaveValue('Keep this text.');
  await expect(submit).toBeFocused();
});

test('a rate-limited send says to wait rather than "try again" immediately', async ({ page }) => {
  await stubContact(page, 429, { ok: false, error: 'rate_limited' });
  await fillForm(page);
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(alerts(page)).toContainText('Too many messages');
});

test('the fields enforce the same length limits as the server', async ({ page }) => {
  expect(await page.getByLabel('Name').getAttribute('maxlength')).toBe('120');
  expect(await page.getByLabel('Email').getAttribute('maxlength')).toBe('254');
  expect(await page.getByLabel('Message').getAttribute('maxlength')).toBe('5000');
});

test('the form has no axe violations in its error and failure states', async ({ page }) => {
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(alerts(page)).toHaveCount(3);
  let { violations } = await new AxeBuilder({ page }).include('#contact').analyze();
  expect(violations.map((v) => v.id)).toEqual([]);

  await stubContact(page, 502, { ok: false });
  await fillForm(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(alerts(page)).toContainText('couldn’t be sent');
  ({ violations } = await new AxeBuilder({ page }).include('#contact').analyze());
  expect(violations.map((v) => v.id)).toEqual([]);
});

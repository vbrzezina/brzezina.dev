import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST } from './route';

const valid = { name: 'Jana Nováková', email: 'jana@firma.cz', message: 'Hledáme seniora.', contact_trap: '' };

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
        host: 'localhost:3000',
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

const json = async (res: Response) => res.json();

beforeEach(() => {
  send.mockReset().mockResolvedValue({ data: { id: 'email_1' }, error: null });
  process.env.RESEND_API_KEY = 're_test';
  process.env.CONTACT_TO_EMAIL = 'inbox@example.com';
  delete process.env.CONTACT_FROM_EMAIL;
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
});

describe('POST /api/contact', () => {
  describe('sending', () => {
    it('sends a plain-text email to the fixed recipient, with the visitor in replyTo', async () => {
      const res = await post(valid);

      expect(res.status).toBe(200);
      expect(await json(res)).toEqual({ ok: true });
      expect(send).toHaveBeenCalledTimes(1);
      const [payload] = send.mock.calls[0];
      expect(payload).toMatchObject({
        to: ['inbox@example.com'],
        replyTo: 'jana@firma.cz',
        from: '"Jana Nováková via brzezina.dev" <contact@brzezina.dev>',
        subject: 'brzezina.dev — message from Jana Nováková',
      });
      expect(payload.text).toContain('Hledáme seniora.');
      expect(payload).not.toHaveProperty('html');
    });

    it('never lets the visitor choose the recipient', async () => {
      await post({ ...valid, to: 'victim@example.com', cc: 'victim@example.com', bcc: 'victim@example.com' });

      const [payload] = send.mock.calls[0];
      expect(payload.to).toEqual(['inbox@example.com']);
      expect(payload).not.toHaveProperty('cc');
      expect(payload).not.toHaveProperty('bcc');
    });

    it('strips characters that could break out of the sender display name or the subject', async () => {
      await post({ ...valid, name: 'Eve "<evil@x.com>" \\ \r\nBcc: victim@example.com' });

      const [payload] = send.mock.calls[0];
      expect(payload.from).toMatch(/^"[^"<>\\\r\n]+ via brzezina\.dev" <contact@brzezina\.dev>$/);
      expect(payload.subject).not.toMatch(/[\r\n]/);
    });

    it('uses only the address part of CONTACT_FROM_EMAIL', async () => {
      process.env.CONTACT_FROM_EMAIL = 'Someone <hello@brzezina.dev>';
      await post(valid);

      expect(send.mock.calls[0][0].from).toMatch(/<hello@brzezina\.dev>$/);
    });
  });

  describe('validation', () => {
    it.each([
      ['a blank name', { ...valid, name: '   ' }],
      ['a name over 120 characters', { ...valid, name: 'x'.repeat(121) }],
      ['an invalid email', { ...valid, email: 'jana@firma' }],
      ['an email with markup', { ...valid, email: 'x<a@b.cc>' }],
      ['two addresses in the email', { ...valid, email: 'a@b.cc,c@d.ee' }],
      ['a blank message', { ...valid, message: '  ' }],
      ['a message over 5000 characters', { ...valid, message: 'x'.repeat(5001) }],
      ['a non-string field', { ...valid, name: 42 }],
    ])('rejects %s', async (_label, body) => {
      const res = await post(body);

      expect(res.status).toBe(400);
      expect(await json(res)).toEqual({ ok: false, error: 'invalid' });
      expect(send).not.toHaveBeenCalled();
    });

    it.each(['{nope', '[]', 'null', '"text"', ''])('rejects a body that is not a JSON object: %j', async (body) => {
      expect((await post(body)).status).toBe(400);
      expect(send).not.toHaveBeenCalled();
    });

    it('accepts a message of exactly 5000 characters', async () => {
      expect((await post({ ...valid, message: 'x'.repeat(5000) })).status).toBe(200);
    });
  });

  describe('abuse controls', () => {
    it('rejects a post from another origin', async () => {
      const res = await post(valid, { origin: 'https://evil.example' });

      expect(res.status).toBe(403);
      expect(send).not.toHaveBeenCalled();
    });

    it.each(['null', 'not a url'])('rejects an unusable Origin header: %s', async (origin) => {
      expect((await post(valid, { origin })).status).toBe(403);
    });

    it('compares Origin with the Host header the visitor used', async () => {
      const headers = { host: 'brzezina.dev' };

      expect((await post(valid, { ...headers, origin: 'https://brzezina.dev' })).status).toBe(200);
      expect((await post(valid, { ...headers, origin: 'https://www.brzezina.dev' })).status).toBe(403);
    });

    it('accepts a request without an Origin header (not a browser form post)', async () => {
      expect((await post(valid, { origin: '' })).status).toBe(200);
    });

    it('silently drops a submission that fills the honeypot, and says nothing is wrong', async () => {
      const res = await post({ ...valid, contact_trap: 'http://spam.example' });

      expect(res.status).toBe(200);
      expect(await json(res)).toEqual({ ok: true });
      expect(send).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('honeypot'));
    });

    it('does not treat the old honeypot name ("website") as a trap', async () => {
      await post({ ...valid, website: 'https://brzezina.dev' });

      expect(send).toHaveBeenCalledTimes(1);
    });
  });

  describe('failures', () => {
    it('answers 503 and logs when the mailer is not configured', async () => {
      delete process.env.RESEND_API_KEY;
      const res = await post(valid);

      expect(res.status).toBe(503);
      expect(await json(res)).toEqual({ ok: false, error: 'not_configured' });
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[contact]'));
    });

    it('answers 502 when the provider returns an error, and never claims success', async () => {
      send.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'domain not verified' } });
      const res = await post(valid);

      expect(res.status).toBe(502);
      expect(await json(res)).toEqual({ ok: false, error: 'send_failed' });
    });

    it('answers 502 when the request to the provider throws', async () => {
      send.mockRejectedValue(new Error('network down'));

      expect((await post(valid)).status).toBe(502);
    });
  });
});

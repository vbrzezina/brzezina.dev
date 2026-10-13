import { describe, expect, it } from 'vitest';
import { EMAIL_PATTERN, HONEYPOT_FIELD } from './contact';

describe('EMAIL_PATTERN', () => {
  it.each(['jana@firma.cz', 'v.brzezina@gmail.com', 'a+b@sub.example.co.uk', 'x@y.io'])('accepts %s', (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(true);
  });

  it.each([
    'x<a@b.cc>',
    'a@b.cc,c@d.ee',
    'a@b.cc;c@d.ee',
    '"a"@b.cc',
    'a@b',
    'a@b.c',
    'no-at-sign.cz',
    '@b.cc',
    'a b@c.dd',
  ])('rejects %s', (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(false);
  });
});

describe('contact constants', () => {
  it('keeps the honeypot name away from names password managers autofill', () => {
    expect(HONEYPOT_FIELD).not.toMatch(/website|url|company|organi[sz]ation|homepage|address|email|phone/i);
  });
});

import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_LIMITS as LIMITS, EMAIL_PATTERN, HONEYPOT_FIELD, type ContactError } from '@/lib/contact';

/*
 * Contact form → Resend (https://resend.com/docs/send-with-nextjs).
 * The recipient is fixed server-side, which means the endpoint can only ever email the site owner —
 * the visitor's address goes in Reply-To, never in To.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY     required — a "sending access" key, scoped to the brzezina.dev domain
 *   CONTACT_TO_EMAIL   required — where messages are delivered
 *   CONTACT_FROM_EMAIL optional — sender address on the domain verified in Resend. The display name
 *                      is always the visitor's ("Jane Novák via brzezina.dev"), so the inbox shows who wrote.
 */

const DEFAULT_FROM = 'contact@brzezina.dev';


// Best-effort per-instance rate limit. Fluid compute reuses instances, so this blunts a burst from
// one address; it is not a global guarantee — Resend's daily cap is the backstop.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 1000) {
    for (const [key, times] of recent) if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
  }
  return hits.length > MAX_PER_WINDOW;
}

function sameOrigin(origin: string, host: string): boolean {
  try {
    return new URL(origin).host === host;
  } catch {
    return false; // "null" (sandboxed frames, some redirects) or garbage
  }
}

/**
 * The visitor can't be the sender — mail "from" their domain would fail SPF/DMARC — so their name
 * goes in the display name on our verified address, and their address goes in Reply-To.
 */
function senderFor(name: string): string {
  const configured = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const address = configured.match(/<([^>]+)>/)?.[1] ?? configured.trim();
  const displayName = name.replace(/["\\<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 64).trim();
  return `"${displayName} via brzezina.dev" <${address}>`;
}

/**
 * Reads the JSON body but gives up past `maxBytes`. A Content-Length check alone can't stop a chunked
 * request, which declares no length.
 */
async function readJson(request: NextRequest, maxBytes: number): Promise<unknown | typeof TOO_LARGE> {
  const reader = request.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      return TOO_LARGE;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

const TOO_LARGE = Symbol('too_large');

/** The host the visitor typed: behind a proxy that's the forwarded one, not the server's bound address. */
function requestHost(request: NextRequest): string {
  return request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host;
}

function fail(status: number, error: ContactError) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Collapse whitespace and strip control characters — for values that end up in a subject line. */
function singleLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function POST(request: NextRequest) {
  // Browsers always send Origin on a cross-origin POST; reject posts from other sites.
  const origin = request.headers.get('origin');
  if (origin && !sameOrigin(origin, requestHost(request))) return fail(403, 'origin');

  const parsed = await readJson(request, LIMITS.body);
  if (parsed === TOO_LARGE) return fail(413, 'too_large');
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail(400, 'invalid');
  const body = parsed as Record<string, unknown>;

  // Honeypot: a field people never see. Bots that fill it get a success they can't tell apart.
  // Logged, so a real visitor swallowed by it (an autofill quirk) shows up instead of vanishing.
  const trap = body[HONEYPOT_FIELD];
  if (typeof trap === 'string' && trap.trim() !== '') {
    console.info('[contact] honeypot filled, message dropped');
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === 'string' ? singleLine(body.name) : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (
    !name ||
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    !EMAIL_PATTERN.test(email) ||
    !message ||
    message.length > LIMITS.message
  ) {
    return fail(400, 'invalid');
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip, Date.now())) return fail(429, 'rate_limited');

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return fail(503, 'not_configured');
  }

  // Plain text only: nothing the visitor typed is ever interpreted as HTML.
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
    '',
    '—',
    'Sent from the contact form on brzezina.dev.',
  ].join('\n');

  try {
    const { error } = await new Resend(apiKey).emails.send(
      {
        from: senderFor(name),
        to: [to],
        replyTo: email,
        subject: `brzezina.dev — message from ${name}`,
        text,
      },
      { signal: AbortSignal.timeout(10_000) },
    );
    if (error) {
      console.error('[contact] Resend rejected the email', error);
      return fail(502, 'send_failed');
    }
  } catch (error) {
    console.error('[contact] Resend request failed', error);
    return fail(502, 'send_failed');
  }

  return NextResponse.json({ ok: true });
}

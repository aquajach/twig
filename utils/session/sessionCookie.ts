import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE_NAME = 'twig_session';

const SESSION_LABEL = 'twig-v1';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function expectedSessionToken(): string {
  const secret = process.env.SESSION_SIGNING_SECRET;
  if (!secret) {
    throw new Error('SESSION_SIGNING_SECRET is not set');
  }
  return createHmac('sha256', secret).update(SESSION_LABEL).digest('base64url');
}

export function passcodesMatch(candidate: string, expected: string | undefined): boolean {
  if (expected === undefined || expected === '') return false;
  const a = Buffer.from(candidate, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sessionTokenValid(received: string | undefined): boolean {
  if (!received) return false;
  let expected: string;
  try {
    expected = expectedSessionToken();
  } catch {
    return false;
  }
  const recv = Buffer.from(received, 'utf8');
  const exp = Buffer.from(expected, 'utf8');
  if (recv.length !== exp.length) return false;
  return timingSafeEqual(recv, exp);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  };
}

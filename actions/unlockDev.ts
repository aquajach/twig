'use server';

import { passcodesMatch } from '@/utils/session/sessionCookie';

export type UnlockDevResult = { ok: true } | { ok: false; error: string };

export async function unlockDev(passcode: string): Promise<UnlockDevResult> {
  if (typeof passcode !== 'string' || passcode === '') {
    return { ok: false, error: 'Passcode required.' };
  }
  const expected = process.env.DEV_PASSCODE;
  if (!expected) {
    return { ok: false, error: 'DEV_PASSCODE not configured on server.' };
  }
  if (!passcodesMatch(passcode, expected)) {
    return { ok: false, error: 'Invalid passcode.' };
  }
  return { ok: true };
}

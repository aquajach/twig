'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  expectedSessionToken,
  passcodesMatch,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/utils/session/sessionCookie';

export type LoginState = { error: string } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const candidate = formData.get('passcode');
  if (typeof candidate !== 'string' || candidate === '') {
    return { error: 'Please enter a passcode.' };
  }

  if (!passcodesMatch(candidate, process.env.INVITE_PASSCODE)) {
    return { error: 'Invalid passcode.' };
  }

  let token: string;
  try {
    token = expectedSessionToken();
  } catch {
    return { error: 'Server misconfiguration.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());

  redirect('/');
}

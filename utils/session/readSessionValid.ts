import 'server-only';

import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, sessionTokenValid } from '@/utils/session/sessionCookie';

export async function readSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  return sessionTokenValid(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

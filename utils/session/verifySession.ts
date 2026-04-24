import 'server-only';

import { redirect } from 'next/navigation';
import { readSessionValid } from './readSessionValid';

/**
 * Redirects to the login page when the session cookie is missing or invalid.
 */
export async function verifySession(): Promise<void> {
  if (!(await readSessionValid())) {
    redirect('/login');
  }
}

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { type LoginState, login } from '../actions/login';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(login, null);
  const passcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passcodeRef.current?.focus();
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-lg font-medium">Enter invite passcode</h1>
      <form action={formAction} className="flex flex-col gap-2 max-w-sm">
        <input
          ref={passcodeRef}
          name="passcode"
          type="password"
          autoComplete="current-password"
          className="border p-2"
          disabled={isPending}
        />
        {state?.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}
        <button type="submit" className="border px-4 py-2 w-fit" disabled={isPending}>
          {isPending ? 'Checking…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from 'react-aria-components/Button';
import { Form } from 'react-aria-components/Form';
import { Input } from 'react-aria-components/Input';
import { TextField } from 'react-aria-components/TextField';
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
      <Form action={formAction} className="flex flex-col gap-2 max-w-sm">
        <TextField name="passcode" aria-label="Passcode" isDisabled={isPending}>
          <Input ref={passcodeRef} type="password" autoComplete="current-password" className="border p-2" />
        </TextField>
        {state?.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" isDisabled={isPending} className="border px-4 py-2 w-fit">
          {isPending ? 'Checking…' : 'Continue'}
        </Button>
      </Form>
    </main>
  );
}

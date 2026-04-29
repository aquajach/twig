'use client';

import { useState } from 'react';
import { Input, Label, TextField } from 'react-aria-components';
import { Button } from 'react-aria-components/Button';
import { cn } from '@/utils/cn';
import { LionNav } from './lion-components/LionNav';
import { PasswordVisibilityButton } from './lion-components/PasswordVisibilityButton';
import { lionButton } from './lion-design-system/lionButton';
import { lionInput } from './lion-design-system/lionInput';
import { lionLabel } from './lion-design-system/lionLabel';
import type { MockedPageProps } from './registry';

type ViewState = 'login' | 'login-error' | 'login-success' | 'login-empty';

export function LionBankEBanking({ state, dispatch }: MockedPageProps) {
  const [view, setView] = useState<ViewState>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginFixed = Boolean(state.loginFixed);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === '' && password === '') {
      setView('login-empty');
      return;
    }
    dispatch('login-submit');
    setView(loginFixed ? 'login-success' : 'login-error');
  }

  if (view === 'login-success') {
    return (
      <div className="flex h-full flex-col bg-lionbank-bg text-lionbank-fg">
        <LionNav />
        <div className="w-80 p-6 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-lg font-semibold mb-2">Welcome, Test User</h2>
          <p className="text-sm">You are now logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-lionbank-bg text-lionbank-fg">
      <LionNav />
      <div
        className="flex h-full p-12 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/office.webp)' }}
      >
        <div className="container flex items-center justify-end">
          <form onSubmit={handleSubmit} className="w-80 bg-lionbank-bg p-6 flex flex-col gap-8">
            <h2 className="text-lg font-semibold text-lionbank-brand mb-1">Lion Bank E-Banking</h2>

            <div className="flex flex-col gap-3">
              <TextField
                className="flex flex-col"
                type="text"
                value={username}
                onChange={setUsername}
                autoComplete="off"
              >
                <Label className={lionLabel()}>Username</Label>
                <Input className={lionInput()} />
              </TextField>

              <TextField
                className="flex flex-col"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                autoComplete="off"
              >
                <Label className={lionLabel()}>Password</Label>
                <div className="relative">
                  <Input className={cn(lionInput(), 'w-full pr-11')} />
                  <PasswordVisibilityButton
                    isVisible={showPassword}
                    onToggle={() => setShowPassword((visible) => !visible)}
                  />
                </div>
              </TextField>
              {view === 'login-error' && (
                <div className="text-sm text-lionbank-danger">Login failed. Error code: ERR-LB-4012</div>
              )}
              {view === 'login-empty' && (
                <div className="text-sm text-lionbank-danger">Please enter a username and password</div>
              )}
            </div>

            <Button type="submit" className={cn(lionButton({ variant: 'primary' }), 'w-full')}>
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

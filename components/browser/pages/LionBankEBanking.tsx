'use client';

import { useState } from 'react';
import { Input, Label, TextField } from 'react-aria-components';
import { Button } from 'react-aria-components/Button';
import { cn } from '@/utils/cn';
import { LionNav } from './lion-components/LionNav';
import { PasswordVisibilityButton } from './lion-components/PasswordVisibilityButton';
import { LionAssetAllocationChart } from './lion-design-system/lionAssetAllocationChart';
import { lionButton } from './lion-design-system/lionButton';
import { lionInput } from './lion-design-system/lionInput';
import { lionLabel } from './lion-design-system/lionLabel';
import { lionPanel } from './lion-design-system/lionPanel';
import { lionSectionTitle } from './lion-design-system/lionSectionTitle';
import {
  lionTable,
  lionTableCell,
  lionTableHead,
  lionTableHeaderCell,
  lionTableRow,
} from './lion-design-system/lionTable';
import type { MockedPageProps } from './registry';

type ViewState = 'login' | 'login-error' | 'login-success' | 'login-empty';

export function LionBankEBanking({ state, dispatch }: MockedPageProps) {
  const [view, setView] = useState<ViewState>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginFixed = Boolean(state.loginFixed);
  const loginRemember = Boolean(state.loginRemember);
  const chartImplemented = Boolean(state.chartImplemented);
  const chartOffBrand = Boolean(state.chartOffBrand);

  const allocations = [
    { name: '現金', value: 420000 },
    { name: '股票', value: 980000 },
    { name: '債券', value: 360000 },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === '' || password === '') {
      setView('login-empty');
      return;
    }
    dispatch('login-submit');
    setView(loginFixed ? 'login-success' : 'login-error');
  }

  if (view === 'login-success' || loginRemember) {
    return (
      <div className="flex h-full flex-col bg-lionbank-bg text-lionbank-fg">
        <LionNav isLoggedIn={true} />
        <div className="flex-1 overflow-y-auto px-4 py-12 bg-lionbank-brand-lighter flex flex-col gap-12 items-stretch">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-lionbank-brand">歡迎，TEST</h1>
          </div>
          <div className="container mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3">
            <section className="lg:col-span-2 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className={lionSectionTitle()}>資產概覽</h2>
                <div className={cn(lionPanel(), 'flex items-center justify-between')}>
                  <div>總資產</div>
                  <div className="text-2xl">HKD 123,456.00</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className={lionSectionTitle()}>常用戶口</h2>
                <div className="flex flex-col gap-0.5">
                  <div className={cn(lionPanel(), 'flex items-center justify-between')}>
                    <div className="text-sm flex flex-col gap-0.5">
                      <div>港元儲蓄戶口</div>
                      <div>932 1228 9893</div>
                    </div>
                    <div className="text-lg">HKD 56,456.00</div>
                  </div>
                  <div className={cn(lionPanel(), 'flex items-center justify-between')}>
                    <div className="text-sm flex flex-col gap-0.5">
                      <div>人民幣儲蓄戶口</div>
                      <div>932 1228 9894</div>
                    </div>
                    <div className="text-lg">CNY 56,456.00</div>
                  </div>
                  <div className={cn(lionPanel(), 'flex items-center justify-between')}>
                    <div className="text-sm flex flex-col gap-0.5">
                      <div>美元投資戶口</div>
                      <div>932 1228 9895</div>
                    </div>
                    <div className="text-lg">USD 56,456.00</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-1 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className={lionSectionTitle()}>資產配置</h2>
                <div className={cn(lionPanel(), 'flex flex-col gap-2')}>
                  <table className={lionTable()}>
                    <thead className={lionTableHead()}>
                      <tr>
                        <th className={lionTableHeaderCell()}>類別</th>
                        <th className={lionTableHeaderCell()}>比例</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={lionTableRow()}>
                        <td className={lionTableCell()}>現金</td>
                        <td className={lionTableCell()}>23.9%</td>
                      </tr>
                      <tr className={lionTableRow()}>
                        <td className={lionTableCell()}>股票</td>
                        <td className={lionTableCell()}>55.7%</td>
                      </tr>
                      <tr className={lionTableRow()}>
                        <td className={lionTableCell()}>債券</td>
                        <td className={lionTableCell()}>20.4%</td>
                      </tr>
                    </tbody>
                  </table>

                  {chartImplemented ? (
                    <div className="h-72">
                      <LionAssetAllocationChart data={allocations} interactive isOnBrand={!chartOffBrand} />
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-lionbank-bg text-lionbank-fg">
      <LionNav isLoggedIn={false} />
      <div
        className="flex h-full p-12 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/office.webp)' }}
      >
        <div className="container flex items-center justify-end">
          <form onSubmit={handleSubmit} className="w-80 bg-lionbank-bg p-6 flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-lionbank-brand mb-1">登入獅銀理財</h2>

            <div className="flex flex-col gap-3">
              <TextField
                className="flex flex-col"
                type="text"
                value={username}
                onChange={setUsername}
                autoComplete="off"
              >
                <Label className={lionLabel()}>用戶名稱</Label>
                <Input className={lionInput()} />
              </TextField>

              <TextField
                className="flex flex-col"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                autoComplete="off"
              >
                <Label className={lionLabel()}>密碼</Label>
                <div className="relative">
                  <Input className={cn(lionInput(), 'w-full pr-11')} />
                  <PasswordVisibilityButton
                    isVisible={showPassword}
                    onToggle={() => setShowPassword((visible) => !visible)}
                  />
                </div>
              </TextField>
              {view === 'login-error' && (
                <div className="text-sm text-lionbank-danger">登入失敗。錯誤代碼: ERR-LB-4012</div>
              )}
              {view === 'login-empty' && <div className="text-sm text-lionbank-danger">請輸入用戶名稱和密碼</div>}
            </div>

            <Button type="submit" className={cn(lionButton({ variant: 'primary' }), 'w-full')}>
              登入
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

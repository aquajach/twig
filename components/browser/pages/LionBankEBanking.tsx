'use client';

import { useState } from 'react';
import { Input, Label, TextField } from 'react-aria-components';
import { Button } from 'react-aria-components/Button';
import { cn } from '@/utils/cn';
import { LionNav } from './lion-components/LionNav';
import { PasswordVisibilityButton } from './lion-components/PasswordVisibilityButton';
import { LionAssetAllocationChart } from './lion-design-system/lionAssetAllocationChart';
import { lionButton } from './lion-design-system/lionButton';
import { LionChartFrame } from './lion-design-system/lionChartFrame';
import { lionInput } from './lion-design-system/lionInput';
import { lionKeyValueRow } from './lion-design-system/lionKeyValueRow';
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
  const chartImplemented = Boolean(state.chartImplemented);
  const chartOffBrand = Boolean(state.chartOffBrand);

  const allocations = [
    { name: '現金', value: 420000 },
    { name: '股票', value: 980000 },
    { name: '債券', value: 360000 },
  ];
  const onBrandSequence = ['#5B3D15', '#B19062', '#222222'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === '' || password === '') {
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
            <section className={cn(lionPanel(), 'lg:col-span-1')}>
              <h2 className={lionSectionTitle()}>賬戶總覽</h2>
              <div className="mt-3">
                <div className={lionKeyValueRow({ emphasis: 'strong' })}>
                  <span>總資產</span>
                  <span>HKD 1,760,000</span>
                </div>
                <div className={lionKeyValueRow()}>
                  <span>可用現金</span>
                  <span>HKD 420,000</span>
                </div>
                <div className={lionKeyValueRow()}>
                  <span>投資賬戶</span>
                  <span>2 個</span>
                </div>
              </div>
            </section>

            <section className={cn(lionPanel({ variant: 'muted' }), 'lg:col-span-2')}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className={lionSectionTitle()}>持倉清單</h2>
              </div>
              <table className={lionTable()}>
                <thead className={lionTableHead()}>
                  <tr>
                    <th className={lionTableHeaderCell()}>資產類別</th>
                    <th className={lionTableHeaderCell()}>金額</th>
                    <th className={lionTableHeaderCell()}>比例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={lionTableRow()}>
                    <td className={lionTableCell()}>現金</td>
                    <td className={lionTableCell()}>HKD 420,000</td>
                    <td className={lionTableCell()}>23.9%</td>
                  </tr>
                  <tr className={lionTableRow()}>
                    <td className={lionTableCell()}>股票</td>
                    <td className={lionTableCell()}>HKD 980,000</td>
                    <td className={lionTableCell()}>55.7%</td>
                  </tr>
                  <tr className={lionTableRow()}>
                    <td className={lionTableCell()}>債券</td>
                    <td className={lionTableCell()}>HKD 360,000</td>
                    <td className={lionTableCell()}>20.4%</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {chartImplemented ? (
              <LionChartFrame className="lg:col-span-3" title="資產配置圖表">
                <LionAssetAllocationChart data={allocations} interactive isOnBrand={!chartOffBrand} />
              </LionChartFrame>
            ) : null}
          </div>
          <div className="mx-auto mt-4 flex max-w-6xl justify-end">
            <Button type="button" onPress={() => dispatch('refresh-home')} className={lionButton({ variant: 'quiet' })}>
              重新整理
            </Button>
          </div>
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

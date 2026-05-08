'use client';

import type { FikmaScreenComponentProps } from '@/components/browser/pages/fikma-screens/types';
import { LionAssetAllocationChart } from '@/components/browser/pages/lion-design-system/lionAssetAllocationChart';
import { cn } from '@/utils/cn';
import { lionPanel } from '../lion-design-system/lionPanel';
import { lionSectionTitle } from '../lion-design-system/lionSectionTitle';
import {
  lionTable,
  lionTableCell,
  lionTableHead,
  lionTableHeaderCell,
  lionTableRow,
} from '../lion-design-system/lionTable';

const MOCK_DATA = [
  { name: '現金', value: 420000 },
  { name: '股票', value: 980000 },
  { name: '債券', value: 360000 },
];

export function AssetAllocationPieMockupScreen({ props }: FikmaScreenComponentProps) {
  const chartOffBrand = props.chartOffBrand === true;
  return (
    <div className="h-full w-full bg-lionbank-brand-lighter p-3">
      <section className="flex flex-col gap-8">
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
            <div className="h-72">
              <LionAssetAllocationChart data={MOCK_DATA} interactive={false} isOnBrand={!chartOffBrand} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

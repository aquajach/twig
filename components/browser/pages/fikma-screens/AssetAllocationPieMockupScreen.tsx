'use client';

import type { FikmaScreenComponentProps } from '@/components/browser/pages/fikma-screens/types';
import { LionAssetAllocationChart } from '@/components/browser/pages/lion-design-system/lionAssetAllocationChart';
import { LionChartFrame } from '@/components/browser/pages/lion-design-system/lionChartFrame';

const MOCK_DATA = [
  { name: '現金', value: 420000 },
  { name: '股票', value: 980000 },
  { name: '債券', value: 360000 },
];

export function AssetAllocationPieMockupScreen({ props }: FikmaScreenComponentProps) {
  const chartOffBrand = props.chartOffBrand === true;
  return (
    <div className="h-full w-full bg-lionbank-bg p-3">
      <LionChartFrame title="資產配置圖表" className="h-full">
        <LionAssetAllocationChart data={MOCK_DATA} interactive={false} isOnBrand={!chartOffBrand} />
      </LionChartFrame>
    </div>
  );
}

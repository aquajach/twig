'use client';

import type { FikmaScreenComponentProps } from '@/components/browser/pages/fikma-screens/types';
import { LionAssetAllocationChart } from '@/components/browser/pages/lion-design-system/lionAssetAllocationChart';
import { LionChartFrame } from '@/components/browser/pages/lion-design-system/lionChartFrame';

const MOCK_DATA = [
  { name: '現金', value: 420000 },
  { name: '股票', value: 980000 },
  { name: '債券', value: 360000 },
];

const ON_BRAND_SEQUENCE = ['#8a1538', '#b63a5d', '#d7758f'];

export function AssetAllocationPieMockupScreen({ props }: FikmaScreenComponentProps) {
  const chartOffBrand = props.chartOffBrand === true;
  return (
    <div className="h-full w-full bg-lionbank-bg p-3">
      <LionChartFrame
        title="Asset Allocation"
        subtitle={chartOffBrand ? 'Off-brand preview' : 'Brand-aligned preview'}
        className="h-full"
      >
        <LionAssetAllocationChart
          data={MOCK_DATA}
          interactive={false}
          colorSequence={chartOffBrand ? undefined : ON_BRAND_SEQUENCE}
        />
      </LionChartFrame>
    </div>
  );
}

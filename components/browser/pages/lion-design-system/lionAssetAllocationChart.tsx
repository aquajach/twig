'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

type AssetAllocationDatum = {
  name: string;
  value: number;
};

type LionAssetAllocationChartProps = {
  data: AssetAllocationDatum[];
  interactive: boolean;
  colorSequence?: string[];
};

export function LionAssetAllocationChart({ data, interactive, colorSequence }: LionAssetAllocationChartProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const chart = echarts.init(el);
    chart.setOption({
      ...(colorSequence ? { color: colorSequence } : {}),
      tooltip: {
        show: interactive,
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      legend: {
        bottom: 0,
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: true,
          silent: !interactive,
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 1,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 11,
          },
          data,
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [data, interactive, colorSequence]);

  return <div ref={rootRef} className="h-full w-full" />;
}

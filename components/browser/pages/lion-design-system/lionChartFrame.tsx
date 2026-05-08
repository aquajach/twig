import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { lionPanel } from './lionPanel';
import { lionSectionTitle } from './lionSectionTitle';

type LionChartFrameProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function LionChartFrame({ title, children, className }: LionChartFrameProps) {
  return (
    <section className={cn(lionPanel(), className)}>
      <header className="mb-3 border-b border-lionbank-brand-lighter pb-2">
        <h3 className={lionSectionTitle()}>{title}</h3>
      </header>
      <div className="h-72">{children}</div>
    </section>
  );
}

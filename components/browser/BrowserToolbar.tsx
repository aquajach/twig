'use client';

import { Button } from 'react-aria-components/Button';
import { AppIcon, getAppLabel } from '@/components/appsConfig';

type BrowserToolbarProps = {
  pageTitle: string | null;
  onHome: () => void;
  onReload: () => void;
};

export function BrowserToolbar({ pageTitle, onHome, onReload }: BrowserToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-4 h-12 border-b border-divider">
      <div className="flex flex-row items-center gap-2 mr-4">
        <AppIcon id="browser" className="h-4 w-4" />
        <h2 className="text-sm font-semibold text-text-primary">{getAppLabel('browser')}</h2>
      </div>
      <Button
        aria-label="Home"
        onPress={onHome}
        className="size-9 flex items-center justify-center rounded-[var(--radius-control)] text-text-secondary outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors"
      >
        ⌂
      </Button>
      <Button
        aria-label="Reload"
        onPress={onReload}
        className="size-9 flex items-center justify-center rounded-[var(--radius-control)] text-text-secondary outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors"
      >
        ↻
      </Button>
      <div className="flex-1 min-w-0 rounded-[var(--radius-control)] bg-background/50 border border-divider px-3 py-1.5 text-sm text-text-secondary truncate">
        {pageTitle ?? 'Quick Access'}
      </div>
    </div>
  );
}

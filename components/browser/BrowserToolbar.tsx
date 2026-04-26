'use client';

import { Button } from 'react-aria-components/Button';

type BrowserToolbarProps = {
  pageTitle: string | null;
  onHome: () => void;
  onReload: () => void;
};

export function BrowserToolbar({ pageTitle, onHome, onReload }: BrowserToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-divider">
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

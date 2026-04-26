'use client';

import { Button } from 'react-aria-components/Button';
import { pageRegistry } from './pages/registry';

type QuickAccessProps = {
  onNavigate: (pageId: string) => void;
};

export function QuickAccess({ onNavigate }: QuickAccessProps) {
  return (
    <div className="flex flex-col items-center pt-16 px-6">
      <h1 className="text-lg font-semibold text-text-primary mb-8">Quick Access</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {pageRegistry.map((page) => (
          <Button
            key={page.id}
            onPress={() => onNavigate(page.id)}
            className="cursor-pointer flex flex-col items-center justify-center gap-2 w-28 h-28 rounded-[var(--radius-container)] bg-surface-solid border border-divider outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors"
          >
            <span className="text-3xl">{page.icon}</span>
            <span className="text-xs text-text-secondary text-center leading-tight px-2">{page.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

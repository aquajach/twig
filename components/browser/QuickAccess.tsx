'use client';

import { Button } from 'react-aria-components/Button';
import { useGameStore } from '@/stores/useGameStore';
import { pageRegistry } from './pages/registry';
import { QUICK_LINKS_HEADING_ZH_HANT } from './quickLinksZhHant';

type QuickAccessProps = {
  onNavigate: (pageId: string) => void;
};

export function QuickAccess({ onNavigate }: QuickAccessProps) {
  const unlockedIds = useGameStore((s) => s.unlockedBrowserPages);
  const unlocked = new Set(unlockedIds);
  const visiblePages = pageRegistry.filter((p) => unlocked.has(p.id));

  return (
    <div className="flex flex-col items-center pt-16 px-6">
      <h1 lang="zh-Hant" className="text-lg font-semibold text-text-primary mb-8">
        {QUICK_LINKS_HEADING_ZH_HANT}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {visiblePages.map((page) => (
          <Button
            key={page.id}
            onPress={() => onNavigate(page.id)}
            className="cursor-pointer flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-5 rounded-[var(--radius-container)] bg-surface-solid border border-divider outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors px-2"
          >
            <span className="flex size-12 shrink-0 items-center justify-center [&_img]:h-12 [&_img]:w-12 [&_img]:max-h-12 [&_img]:max-w-12 [&_img]:object-contain">
              {page.icon}
            </span>
            <span className="flex w-full min-h-0 shrink-0 justify-center px-0">
              <span className="line-clamp-1 w-full text-center text-xs text-text-secondary leading-snug">
                {page.title}
              </span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

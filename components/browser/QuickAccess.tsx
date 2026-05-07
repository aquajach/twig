'use client';

import { Button } from 'react-aria-components/Button';
import { pageRegistry } from './pages/registry';
import { QUICK_LINKS_HEADING_ZH_HANT } from './quickLinksZhHant';

type QuickAccessProps = {
  onNavigate: (pageId: string) => void;
};

export function QuickAccess({ onNavigate }: QuickAccessProps) {
  return (
    <div className="flex flex-col items-center pt-16 px-6">
      <h1 lang="zh-Hant" className="text-lg font-semibold text-text-primary mb-8">
        {QUICK_LINKS_HEADING_ZH_HANT}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {pageRegistry.map((page) => (
          <Button
            key={page.id}
            onPress={() => onNavigate(page.id)}
            className="cursor-pointer flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-[var(--radius-container)] bg-surface-solid border border-divider outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors"
          >
            <span className="flex size-12 shrink-0 items-center justify-center [&_img]:h-12 [&_img]:w-12 [&_img]:max-h-12 [&_img]:max-w-12 [&_img]:object-contain">
              {page.icon}
            </span>
            <span className="flex h-10 w-full shrink-0 flex-col justify-center px-2">
              <span className="line-clamp-2 text-center text-xs text-text-secondary leading-snug">{page.title}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

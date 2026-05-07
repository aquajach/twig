'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-aria-components/Button';
import { cn } from '@/utils/cn';
import type { MockedPageProps } from './registry';

type Screen = {
  id: string;
  name: string;
  src: string;
};

const DEFAULT_SCREENS: Screen[] = [
  { id: 'welcome', name: 'Welcome splash', src: '' },
  { id: 'flow', name: 'Main flow', src: '' },
  { id: 'edge', name: 'Edge cases', src: '' },
];

function parseScreens(raw: unknown): Screen[] | null {
  if (!Array.isArray(raw)) return null;
  const out: Screen[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === 'string' ? o.id : null;
    const name = typeof o.name === 'string' ? o.name : null;
    const src = typeof o.src === 'string' ? o.src : '';
    if (id && name) out.push({ id, name, src });
  }
  return out.length ? out : null;
}

function pickSeedId(screens: Screen[], activeScreenId: unknown): string {
  if (typeof activeScreenId === 'string' && screens.some((s) => s.id === activeScreenId)) {
    return activeScreenId;
  }
  return screens[0]?.id ?? '';
}

export function Fikma({ state, dispatch: _dispatch }: MockedPageProps) {
  const screens = useMemo(() => parseScreens(state.screens) ?? DEFAULT_SCREENS, [state.screens]);

  const [selectedId, setSelectedId] = useState<string>(() => pickSeedId(screens, state.activeScreenId));

  useEffect(() => {
    setSelectedId((prev) => {
      if (prev && screens.some((s) => s.id === prev)) return prev;
      return pickSeedId(screens, state.activeScreenId);
    });
  }, [screens, state.activeScreenId]);

  const selected = screens.find((s) => s.id === selectedId) ?? screens[0];
  const canShowImage = Boolean(selected?.src) && typeof selected.src === 'string' && selected.src.startsWith('/');

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-solid text-text-primary border-t border-divider">
      <div className="flex shrink-0 items-center gap-2 border-b border-divider px-3 py-2">
        <Image src="/fikma-logo.svg" alt="" width={22} height={22} className="shrink-0" />
        <span className="truncate text-sm font-semibold tracking-tight text-text-primary">Fikma</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <nav
          aria-label="Mockup pages"
          className="flex w-52 shrink-0 flex-col gap-px border-r border-divider bg-surface-hover/30 p-2"
        >
          {screens.map((screen) => {
            const isSelected = selectedId === screen.id;
            return (
              <Button
                key={screen.id}
                onPress={() => setSelectedId(screen.id)}
                className={cn(
                  'cursor-pointer rounded-[var(--radius-container)] px-3 py-2 text-left outline-none transition-colors',
                  'text-sm text-text-primary',
                  'data-[hovered]:bg-surface-hover',
                  'data-[pressed]:bg-surface-active',
                  isSelected && 'bg-surface-solid border border-divider shadow-sm',
                  !isSelected && 'border border-transparent',
                )}
              >
                {screen.name}
              </Button>
            );
          })}
        </nav>
        <div className="min-w-0 flex-1 overflow-auto bg-zinc-950/40 p-6">
          <div className="mx-auto flex h-full min-h-[240px] max-w-3xl flex-col rounded-[var(--radius-container)] border border-divider bg-surface-solid shadow-sm">
            <div className="border-b border-divider px-3 py-2">
              <p className="text-xs font-medium text-text-secondary truncate">{selected?.name ?? '—'}</p>
            </div>
            <div className="relative flex min-h-[min(60vh,480px)] flex-1 items-center justify-center bg-zinc-900/50 p-4">
              {canShowImage ? (
                <div className="relative h-full w-full min-h-[200px] overflow-hidden rounded-lg border border-divider bg-black/20">
                  <Image
                    src={selected.src}
                    alt={`${selected.name} mockup`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width:768px) 100vw, 672px"
                  />
                </div>
              ) : (
                <div className="flex max-w-xs flex-col items-center gap-2 rounded-lg border border-dashed border-divider px-6 py-8 text-center">
                  <p className="text-sm text-text-secondary">No mockup image for this page</p>
                  <p className="text-xs text-text-disabled">
                    Set a public path via game state (<code className="text-[11px]">screens[].src</code>, e.g.{' '}
                    <code className="text-[11px]">/your-mock.png</code>)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

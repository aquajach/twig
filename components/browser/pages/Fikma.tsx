'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-aria-components/Button';
import { getFikmaScreen } from '@/components/browser/pages/fikma-screens/registry';
import type { FikmaScreenState } from '@/components/browser/pages/fikma-screens/types';
import { cn } from '@/utils/cn';
import type { MockedPageProps } from './registry';

/** Only screens pushed by story state (e.g. after Andy shares a mockup). No placeholder list. */
function parseScreens(raw: unknown): FikmaScreenState[] {
  if (!Array.isArray(raw)) return [];
  const out: FikmaScreenState[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === 'string' ? o.id : null;
    const name = typeof o.name === 'string' ? o.name : null;
    const screenKey = typeof o.screenKey === 'string' ? o.screenKey.trim() : '';
    const props =
      o.props && typeof o.props === 'object' && !Array.isArray(o.props)
        ? (o.props as Record<string, unknown>)
        : undefined;
    if (id && name && screenKey) out.push({ id, name, screenKey, props });
  }
  return out;
}

function pickSeedId(screens: FikmaScreenState[], activeScreenId: unknown): string {
  if (screens.length === 0) return '';
  if (typeof activeScreenId === 'string' && screens.some((s) => s.id === activeScreenId)) {
    return activeScreenId;
  }
  return screens[0]?.id ?? '';
}

export function Fikma({ state, dispatch: _dispatch }: MockedPageProps) {
  const screens = useMemo(() => parseScreens(state.screens), [state.screens]);

  const [selectedId, setSelectedId] = useState<string>(() => pickSeedId(screens, state.activeScreenId));

  useEffect(() => {
    setSelectedId((prev) => {
      if (screens.length === 0) return '';
      if (prev && screens.some((s) => s.id === prev)) return prev;
      return pickSeedId(screens, state.activeScreenId);
    });
  }, [screens, state.activeScreenId]);

  const selected = screens.find((s) => s.id === selectedId);

  if (screens.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-surface-solid text-text-primary border-t border-divider">
        <div className="flex shrink-0 items-center gap-2 border-b border-divider px-3 py-2">
          <Image src="/fikma-logo.svg" alt="" width={22} height={22} className="shrink-0" />
          <span className="truncate text-sm font-semibold tracking-tight text-text-primary">Fikma</span>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-zinc-950/40 p-6">
          <p className="text-sm text-text-secondary">No designs</p>
        </div>
      </div>
    );
  }

  const active = selected ?? screens[0];
  const Screen = getFikmaScreen(active.screenKey);

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
              <p className="text-xs font-medium text-text-secondary truncate">{active.name}</p>
            </div>
            <div className="relative flex min-h-[min(60vh,480px)] flex-1 items-center justify-center bg-zinc-900/50 p-4">
              {Screen ? (
                <Screen props={active.props ?? {}} />
              ) : (
                <div className="flex max-w-md flex-col items-center gap-2 px-6 py-8 text-center">
                  <p className="text-sm text-text-secondary">Unknown screen</p>
                  <p className="text-xs font-mono text-text-disabled">screenKey: {active.screenKey}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

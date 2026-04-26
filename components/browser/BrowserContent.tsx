'use client';

import { useCallback } from 'react';
import { evaluate } from '@/engine/evaluate';
import { useGameStore } from '@/stores/useGameStore';
import { getPage } from './pages/registry';

type BrowserContentProps = {
  pageId: string;
  reloadKey: number;
};

const EMPTY_STATE: Record<string, unknown> = {};

export function BrowserContent({ pageId, reloadKey }: BrowserContentProps) {
  const page = getPage(pageId);
  const pageState = useGameStore((s) => s.browserPageStates[pageId] ?? EMPTY_STATE);

  const dispatch = useCallback(
    (actionId: string) => {
      evaluate({ type: 'browser_action', pageId, actionId });
    },
    [pageId],
  );

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center text-text-disabled text-sm">
        Page not found
      </div>
    );
  }

  const Page = page.component;
  return <Page key={reloadKey} state={pageState} dispatch={dispatch} />;
}

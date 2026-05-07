'use client';

import { useCallback } from 'react';
import { evaluate } from '@/engine/evaluate';
import { useGameStore } from '@/stores/useGameStore';
import { BrowserContent } from './BrowserContent';
import { BrowserToolbar } from './BrowserToolbar';
import { getPage } from './pages/registry';
import { QuickAccess } from './QuickAccess';

export function BrowserApp() {
  const currentPageId = useGameStore((s) => s.currentBrowserPageId);
  const setCurrentPageId = useGameStore((s) => s.setCurrentBrowserPageId);
  const currentPage = currentPageId ? getPage(currentPageId) : null;

  const handleNavigate = useCallback(
    (pageId: string) => {
      setCurrentPageId(pageId);
      evaluate({ type: 'browser_page_visited', pageId });
    },
    [setCurrentPageId],
  );

  const handleHome = useCallback(() => {
    setCurrentPageId(null);
  }, [setCurrentPageId]);

  return (
    <div className="flex flex-col h-full">
      <BrowserToolbar pageTitle={currentPage?.title ?? null} onHome={handleHome} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {currentPageId ? <BrowserContent pageId={currentPageId} /> : <QuickAccess onNavigate={handleNavigate} />}
      </div>
    </div>
  );
}

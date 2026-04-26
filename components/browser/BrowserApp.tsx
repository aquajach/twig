'use client';

import { useCallback, useState } from 'react';
import { evaluate } from '@/engine/evaluate';
import { useGameStore } from '@/stores/useGameStore';
import { BrowserContent } from './BrowserContent';
import { BrowserToolbar } from './BrowserToolbar';
import { QuickAccess } from './QuickAccess';
import { getPage } from './pages/registry';

export function BrowserApp() {
  const currentPageId = useGameStore((s) => s.currentBrowserPageId);
  const setCurrentPageId = useGameStore((s) => s.setCurrentBrowserPageId);
  const [reloadKey, setReloadKey] = useState(0);

  const currentPage = currentPageId ? getPage(currentPageId) : null;

  const handleNavigate = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    setReloadKey(0);
    evaluate({ type: 'browser_page_visited', pageId });
  }, [setCurrentPageId]);

  const handleHome = useCallback(() => {
    setCurrentPageId(null);
  }, [setCurrentPageId]);

  const handleReload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <BrowserToolbar
        pageTitle={currentPage?.title ?? null}
        onHome={handleHome}
        onReload={handleReload}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {currentPageId ? (
          <BrowserContent pageId={currentPageId} reloadKey={reloadKey} />
        ) : (
          <QuickAccess onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
}

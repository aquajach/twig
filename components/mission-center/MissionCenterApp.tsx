'use client';

import { Button } from 'react-aria-components/Button';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components/Tabs';
import { initializeEngine } from '@/engine/evaluate';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { MemosTab } from './MemosTab';
import { TasksTab } from './TasksTab';

const tabClass =
  'cursor-pointer px-4 py-2 text-sm text-text-secondary outline-none border-b-2 border-transparent data-[hovered]:text-text-primary data-[selected]:text-text-primary data-[selected]:border-accent transition-colors';

function handleResetGame() {
  const confirmed = window.confirm(
    'Reset the game? This will erase all progress, conversations, and collected memos. This cannot be undone.',
  );
  if (!confirmed) return;
  useGameStore.getState().reset();
  useChatStore.getState().reset();
  useWindowStore.getState().reset();
  initializeEngine();
}

export function MissionCenterApp() {
  return (
    <Tabs className="flex flex-col h-full">
      <div className="px-4 pt-3 border-b border-divider">
        <TabList aria-label="Mission Center sections" className="flex gap-1">
          <Tab id="tasks" className={tabClass}>
            Tasks
          </Tab>
          <Tab id="memos" className={tabClass}>
            Memos
          </Tab>
        </TabList>
      </div>

      <TabPanel id="tasks" className="flex-1 min-h-0 outline-none">
        <TasksTab />
      </TabPanel>
      <TabPanel id="memos" className="flex-1 min-h-0 outline-none">
        <MemosTab />
      </TabPanel>

      <div className="border-t border-divider px-6 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-text-disabled mb-2">Danger zone</div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            Reset the game to clear all progress and start over from scratch.
          </p>
          <Button
            onPress={handleResetGame}
            className="cursor-pointer shrink-0 rounded-control px-3 py-1.5 text-xs font-medium text-[var(--lionbank-danger)] outline-none ring-1 ring-[var(--lionbank-danger)]/40 data-[hovered]:bg-[var(--lionbank-danger)]/10 data-[pressed]:scale-95 transition"
          >
            Reset game
          </Button>
        </div>
      </div>
    </Tabs>
  );
}

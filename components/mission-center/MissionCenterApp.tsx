'use client';

import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components/Tabs';
import { AppIcon, getAppLabel } from '@/components/appsConfig';
import { MemosTab } from './MemosTab';
import { TasksTab } from './TasksTab';

const tabClass =
  'cursor-pointer px-4 py-2 text-sm text-text-secondary outline-none border-b-2 border-transparent data-[hovered]:text-text-primary data-[selected]:text-text-primary data-[selected]:border-accent transition-colors';

export function MissionCenterApp() {
  return (
    <Tabs className="flex flex-col h-full">
      <div className="px-4 flex flex-row border-b border-divider gap-4">
        <div className="flex flex-row items-center gap-2 h-12">
          <AppIcon id="mission-center" className="h-4 w-4" />
          <h2 className="text-sm font-semibold text-text-primary">{getAppLabel('mission-center')}</h2>
        </div>
        <div className="px-4 pt-3">
          <TabList aria-label="Mission Center sections" className="flex gap-1">
            <Tab id="tasks" className={tabClass}>
              Tasks
            </Tab>
            <Tab id="memos" className={tabClass}>
              Memos
            </Tab>
          </TabList>
        </div>
      </div>

      <TabPanel id="tasks" className="flex-1 min-h-0 outline-none">
        <TasksTab />
      </TabPanel>
      <TabPanel id="memos" className="flex-1 min-h-0 outline-none">
        <MemosTab />
      </TabPanel>
    </Tabs>
  );
}

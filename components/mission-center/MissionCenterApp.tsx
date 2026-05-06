'use client';

import { AppIcon, getAppLabel } from '@/components/appsConfig';
import { MemosTab } from './MemosTab';
import { TasksTab } from './TasksTab';

export function MissionCenterApp() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 flex flex-row items-center border-b border-divider h-12 shrink-0 gap-2">
        <AppIcon id="mission-center" className="h-4 w-4" />
        <h2 className="text-sm font-semibold text-text-primary">{getAppLabel('mission-center')}</h2>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <TasksTab />
        </div>
        <aside className="w-[320px] shrink-0 min-h-0 border-l border-divider flex flex-col" aria-label="Achievements">
          <MemosTab />
        </aside>
      </div>
    </div>
  );
}

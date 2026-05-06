'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Button } from 'react-aria-components/Button';
import { APPS, DEFAULT_APP_ICON_CLASSNAME } from '@/components/appsConfig';
import { TASKBAR_LAUNCHER_BUTTON_WIDTH_PX, TASKBAR_LAUNCHER_GAP_PX } from '@/components/taskbarLayout';
import { useChatStore } from '@/stores/useChatStore';
import { useToastStore } from '@/stores/useToastStore';
import { type AppId, useWindowStore } from '@/stores/useWindowStore';
import { TaskbarMenu } from './TaskbarMenu';

function useWeTalkUnread(): number {
  const histories = useChatStore((s) => s.histories);
  const lastRead = useChatStore((s) => s.lastReadTimestamp);
  let count = 0;
  for (const npcId of Object.keys(histories)) {
    const msgs = histories[npcId];
    const ts = lastRead[npcId] ?? 0;
    for (const m of msgs) {
      if (m.role === 'npc' && m.timestamp > ts) count++;
    }
  }
  return count;
}

export function Taskbar() {
  const { activeApp, openApp, minimizeApp } = useWindowStore();
  const badges = useToastStore((s) => s.badges);
  const clearBadge = useToastStore((s) => s.clearBadge);
  const weTalkUnread = useWeTalkUnread();

  const handlePress = (appId: AppId, isActive: boolean) => {
    if (isActive) {
      minimizeApp();
    } else {
      openApp(appId);
      clearBadge(appId);
    }
  };

  return (
    <nav
      className="relative z-10 flex items-center justify-center px-4 h-[60px] shrink-0 bg-taskbar backdrop-blur-xl border-t border-divider"
      style={{ gap: TASKBAR_LAUNCHER_GAP_PX }}
    >
      {APPS.map(({ id, label, Icon }) => {
        const isActive = activeApp === id;
        const badge = id === 'wetalk' ? weTalkUnread : (badges[id] ?? 0);
        return (
          <Button
            key={id}
            aria-label={label}
            onPress={() => handlePress(id, isActive)}
            style={{ width: TASKBAR_LAUNCHER_BUTTON_WIDTH_PX }}
            className={`group relative flex h-[52px] shrink-0 items-center justify-center gap-2.5 rounded-[var(--radius-container)] px-3 transition-all outline-none ${
              isActive
                ? 'bg-surface-hover text-accent ring ring-specular'
                : 'text-text-secondary data-[hovered]:bg-surface-active data-[hovered]:ring ring-specular data-[pressed]:ring-0'
            }`}
          >
            <div className="relative h-10 w-6">
              <div className="absolute inset-0 flex items-center justify-center transition-transform group-data-[pressed]:scale-80 not-group-data-[pressed]:ease-bounce not-group-data-[pressed]:duration-450">
                <Icon className={DEFAULT_APP_ICON_CLASSNAME} />
              </div>
              <AnimatePresence>
                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', duration: 0.25, bounce: 0.3 }}
                    className="absolute top-0 -right-2 min-w-[16px] h-[16px] rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-sm/50"
                  >
                    {badge > 99 ? '99+' : badge}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                animate={{ width: isActive ? 16 : 8, opacity: isActive ? 1 : 0.6 }}
                transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full ${isActive ? 'bg-accent' : 'bg-text-disabled'}`}
              />
            </div>
            <span className="min-w-0 truncate text-sm leading-none font-bold">{label}</span>
          </Button>
        );
      })}
      <TaskbarMenu />
    </nav>
  );
}

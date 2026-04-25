'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Button } from 'react-aria-components/Button';
import { type AppId, useWindowStore } from '@/stores/useWindowStore';

const apps: { id: AppId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'wetalk',
    label: 'WeTalk',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M2 6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4l-4 4v-4H6a4 4 0 0 1-4-4V6Z"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'browser',
    label: 'Browser',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="2" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'mission-center',
    label: 'Missions',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Taskbar() {
  const { activeApp, openApp, minimizeApp } = useWindowStore();

  return (
    <nav className="relative z-10 flex items-center justify-center gap-2 px-4 h-[60px] shrink-0 bg-taskbar backdrop-blur-xl border-t border-divider">
      {apps.map((app) => {
        const isActive = activeApp === app.id;
        return (
          <Button
            key={app.id}
            aria-label={app.label}
            onPress={() => (isActive ? minimizeApp() : openApp(app.id))}
            className={`group flex flex-col items-center justify-center gap-0.5 size-[52px] rounded-[var(--radius-container)] px-3 transition-all outline-none ${
              isActive
                ? 'bg-surface-hover text-accent ring ring-specular'
                : 'text-text-secondary data-[hovered]:bg-surface-active data-[hovered]:ring ring-specular data-[pressed]:ring-0'
            }`}
          >
            <div className="transition-transform group-data-[pressed]:scale-80 not-group-data-[pressed]:ease-bounce not-group-data-[pressed]:duration-450">
              {app.icon}
            </div>
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ width: 3, opacity: 0 }}
                  animate={{ width: 16, opacity: 1 }}
                  exit={{ width: 3, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                  className="absolute bottom-1.5 h-[3px] rounded-full bg-accent"
                />
              )}
            </AnimatePresence>
          </Button>
        );
      })}
    </nav>
  );
}

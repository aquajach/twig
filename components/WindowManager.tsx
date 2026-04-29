'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { AppId } from '@/stores/useWindowStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { BrowserApp } from './browser/BrowserApp';
import { MissionCenterApp } from './mission-center/MissionCenterApp';
import { WeTalkApp } from './wetalk/WeTalkApp';

const apps: { id: AppId; Component: React.ComponentType }[] = [
  { id: 'wetalk', Component: WeTalkApp },
  { id: 'browser', Component: BrowserApp },
  { id: 'mission-center', Component: MissionCenterApp },
];

const duration = 0.3;
const spring = { type: 'spring' as const, duration, bounce: 0 };
const appOrder = apps.map((app) => app.id);
const TASKBAR_ITEM_WIDTH = 112;
const TASKBAR_ITEM_GAP = 8;
const TASKBAR_ITEM_STRIDE = TASKBAR_ITEM_WIDTH + TASKBAR_ITEM_GAP;

type TransitionContext = {
  activeApp: AppId | null;
  previousActiveApp: AppId | null;
};

function getSwitchDirection(from: AppId | null, to: AppId | null) {
  if (!from || !to) {
    return 0;
  }

  return appOrder.indexOf(to) > appOrder.indexOf(from) ? 1 : -1;
}

function getTaskbarItemOrigin(app: AppId) {
  const index = appOrder.indexOf(app);
  const centerIndex = (appOrder.length - 1) / 2;
  const offset = (index - centerIndex) * TASKBAR_ITEM_STRIDE;

  return `calc(50% + ${offset}px) 100%`;
}

function getPaneVariants(id: AppId) {
  return {
    initial: ({ activeApp, previousActiveApp }: TransitionContext) => {
      const switchDirection = getSwitchDirection(previousActiveApp, activeApp);

      return switchDirection === 0
        ? { scale: 0, translateX: '0%' }
        : { scale: 1, translateX: `${switchDirection * 100}%` };
    },
    animate: {
      scale: 1,
      translateX: '0%',
      zIndex: 1,
      pointerEvents: 'auto',
    },
    exit: ({ activeApp }: TransitionContext) => {
      if (activeApp === null) {
        return { scale: 0, translateX: '0%', zIndex: 1, pointerEvents: 'none' };
      }

      const switchDirection = getSwitchDirection(id, activeApp);

      return { scale: 1, translateX: `${switchDirection * -100}%`, zIndex: 0, pointerEvents: 'none' };
    },
  };
}

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const previousActiveAppRef = useRef<AppId | null>(null);
  const previousActiveApp = previousActiveAppRef.current;
  const activeAppConfig = apps.find((app) => app.id === activeApp);
  const ActiveApp = activeAppConfig?.Component;
  const transitionContext: TransitionContext = { activeApp, previousActiveApp };

  useEffect(() => {
    previousActiveAppRef.current = activeApp;
  }, [activeApp]);

  return (
    <div className="relative flex-1 min-h-0">
      <AnimatePresence custom={transitionContext}>
        {activeAppConfig && ActiveApp && (
          <motion.div
            key={activeAppConfig.id}
            style={{
              transformOrigin: getTaskbarItemOrigin(activeAppConfig.id),
            }}
            custom={transitionContext}
            variants={getPaneVariants(activeAppConfig.id)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={spring}
            className="absolute inset-0 overflow-hidden shadow-lg/80"
          >
            <div className="absolute inset-0 backdrop-blur-2xl bg-background/80" />
            <svg className="absolute inset-0 h-full w-full opacity-[0.03] pointer-events-none" aria-hidden="true">
              <filter id={`noise-${activeAppConfig.id}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter={`url(#noise-${activeAppConfig.id})`} />
            </svg>
            <div className="relative h-full">
              <ActiveApp />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

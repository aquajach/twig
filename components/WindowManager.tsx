'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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

function getPanePosition(id: AppId, activeApp: AppId | null) {
  if (!activeApp) {
    return { scale: 0, translateX: '0%' };
  }

  const switchDirection = getSwitchDirection(id, activeApp);

  return { scale: 1, translateX: `${switchDirection * -100}%` };
}

function getPaneVariants(id: AppId) {
  return {
    initial: {
      scale: 0,
      translateX: '0%',
      zIndex: 0,
      pointerEvents: 'none',
    },
    animate: ({ activeApp, previousActiveApp }: TransitionContext) => {
      if (activeApp === id) {
        return {
          scale: 1,
          translateX: '0%',
          zIndex: 1,
          pointerEvents: 'auto',
        };
      }

      if (previousActiveApp === id) {
        if (!activeApp) {
          return {
            scale: 0,
            translateX: '0%',
            zIndex: 1,
            pointerEvents: 'none',
          };
        }

        return {
          scale: 1,
          translateX: `${getSwitchDirection(id, activeApp) * -100}%`,
          zIndex: 0,
          pointerEvents: 'none',
        };
      }

      return {
        ...getPanePosition(id, activeApp),
        zIndex: 0,
        pointerEvents: 'none',
      };
    },
  };
}

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const previousActiveAppRef = useRef<AppId | null>(null);
  const [transitioningApp, setTransitioningApp] = useState<AppId | null>(null);
  const previousActiveApp =
    previousActiveAppRef.current !== activeApp ? previousActiveAppRef.current : transitioningApp;
  const transitionContext: TransitionContext = { activeApp, previousActiveApp };

  useEffect(() => {
    setTransitioningApp(previousActiveAppRef.current !== activeApp ? previousActiveAppRef.current : null);
    previousActiveAppRef.current = activeApp;
  }, [activeApp]);

  return (
    <div className="relative flex-1 min-h-0">
      {apps.map(({ id, Component }) => {
        const isActive = activeApp === id;
        const isSwitchingApps = activeApp !== null && previousActiveApp !== null && activeApp !== previousActiveApp;
        const isVisible = isActive || (previousActiveApp === id && (activeApp === null || isSwitchingApps));

        return (
          <motion.div
            key={id}
            style={{
              transformOrigin: getTaskbarItemOrigin(id),
              visibility: isVisible ? 'visible' : 'hidden',
            }}
            custom={transitionContext}
            variants={getPaneVariants(id)}
            initial="initial"
            animate="animate"
            transition={spring}
            onAnimationComplete={() => {
              if (transitioningApp === id) {
                setTransitioningApp(null);
              }
            }}
            inert={!isActive}
            aria-hidden={!isActive}
            className="absolute inset-0 overflow-hidden shadow-lg/80"
          >
            <div className="absolute inset-0 backdrop-blur-2xl bg-background/80" />
            <div className="relative h-full">
              <Component />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { TASKBAR_LAUNCHER_STRIDE_PX } from '@/components/taskbarLayout';
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

const spring = { type: 'spring' as const, duration: 0.3, bounce: 0 };
const instant = { duration: 0 };
const appOrder = apps.map((app) => app.id);

type PaneAnimationState = {
  isVisible: boolean;
  scale: number;
  translateX: string;
  zIndex: number;
  pointerEvents: 'auto' | 'none';
  shouldAnimate: boolean;
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
  const offset = (index - centerIndex) * TASKBAR_LAUNCHER_STRIDE_PX;

  return `calc(50% + ${offset}px) 100%`;
}

function getHiddenPaneState(): PaneAnimationState {
  return {
    isVisible: false,
    scale: 0,
    translateX: '0%',
    zIndex: 0,
    pointerEvents: 'none',
    shouldAnimate: false,
  };
}

function getActivePaneState(): PaneAnimationState {
  return {
    isVisible: true,
    scale: 1,
    translateX: '0%',
    zIndex: 1,
    pointerEvents: 'auto',
    shouldAnimate: true,
  };
}

function getMinimizingPaneState(): PaneAnimationState {
  return {
    isVisible: true,
    scale: 0,
    translateX: '0%',
    zIndex: 1,
    pointerEvents: 'none',
    shouldAnimate: true,
  };
}

function getSwitchingOutPaneState(id: AppId, activeApp: AppId): PaneAnimationState {
  return {
    isVisible: true,
    scale: 1,
    translateX: `${getSwitchDirection(id, activeApp) * -100}%`,
    zIndex: 0,
    pointerEvents: 'none',
    shouldAnimate: true,
  };
}

function getSwitchingInStartPaneState(previousActiveApp: AppId, activeApp: AppId): PaneAnimationState {
  return {
    isVisible: true,
    scale: 1,
    translateX: `${getSwitchDirection(previousActiveApp, activeApp) * 100}%`,
    zIndex: 1,
    pointerEvents: 'auto',
    shouldAnimate: false,
  };
}

function getInitialPaneStates(activeApp: AppId | null): Record<AppId, PaneAnimationState> {
  return Object.fromEntries(
    apps.map(({ id }) => [id, activeApp === id ? getActivePaneState() : getHiddenPaneState()]),
  ) as Record<AppId, PaneAnimationState>;
}

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const previousActiveAppRef = useRef<AppId | null>(null);
  const [paneStates, setPaneStates] = useState(() => getInitialPaneStates(activeApp));

  useEffect(() => {
    const previousActiveApp = previousActiveAppRef.current;

    if (previousActiveApp === activeApp) {
      return;
    }

    let animationFrame: number | null = null;

    if (previousActiveApp && activeApp) {
      setPaneStates((current) => ({
        ...current,
        [previousActiveApp]: getSwitchingOutPaneState(previousActiveApp, activeApp),
        [activeApp]: getSwitchingInStartPaneState(previousActiveApp, activeApp),
      }));

      animationFrame = requestAnimationFrame(() => {
        setPaneStates((current) => ({
          ...current,
          [activeApp]: getActivePaneState(),
        }));
      });
    } else {
      setPaneStates((current) => {
        const next = { ...current };

        if (previousActiveApp) {
          next[previousActiveApp] = getMinimizingPaneState();
        }

        if (activeApp) {
          next[activeApp] = getActivePaneState();
        }

        return next;
      });
    }

    previousActiveAppRef.current = activeApp;

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [activeApp]);

  return (
    <div className="relative flex-1 min-h-0">
      {apps.map(({ id, Component }) => {
        const isActive = activeApp === id;
        const paneState = paneStates[id];

        return (
          <motion.div
            key={id}
            style={{
              transformOrigin: getTaskbarItemOrigin(id),
              visibility: paneState.isVisible ? 'visible' : 'hidden',
            }}
            initial={false}
            animate={{
              scale: paneState.scale,
              translateX: paneState.translateX,
              zIndex: paneState.zIndex,
              pointerEvents: paneState.pointerEvents,
            }}
            transition={paneState.shouldAnimate ? spring : instant}
            onAnimationComplete={() => {
              setPaneStates((current) =>
                activeApp === id || !current[id].isVisible
                  ? current
                  : {
                      ...current,
                      [id]: getHiddenPaneState(),
                    },
              );
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

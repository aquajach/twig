'use client';

import { type AnimationPlaybackControls, animate, motion, useMotionValue } from 'motion/react';
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
const TASKBAR_ITEM_SIZE = 52;
const TASKBAR_ITEM_GAP = 8;
const TASKBAR_ITEM_STRIDE = TASKBAR_ITEM_SIZE + TASKBAR_ITEM_GAP;

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

function AppPane({
  id,
  Component,
  activeApp,
  previousActiveApp,
}: {
  id: AppId;
  Component: React.ComponentType;
  activeApp: AppId | null;
  previousActiveApp: AppId | null;
}) {
  const isActive = activeApp === id;
  const wasActive = useRef(false);
  const scale = useMotionValue(0);
  const translateX = useMotionValue('0%');
  const transformOrigin = getTaskbarItemOrigin(id);
  const animation = useRef<AnimationPlaybackControls | null>(null);
  const isSwitchingAway = wasActive.current && activeApp !== null;
  const zIndex = isActive ? 1 : isSwitchingAway ? -1 : 0;

  useEffect(() => {
    animation.current?.stop();
    const switchDirection = getSwitchDirection(previousActiveApp, activeApp);

    if (isActive) {
      translateX.jump(switchDirection === 0 ? '0%' : `${switchDirection * 100}%`);

      if (switchDirection === 0) {
        scale.jump(0);
        animation.current = animate(scale, 1, spring);
      } else {
        scale.jump(1);
        animation.current = animate(translateX, '0%', spring);
      }
    } else if (wasActive.current) {
      if (activeApp === null) {
        animation.current = animate(scale, 0, spring);
      } else {
        scale.jump(1);
        animation.current = animate(translateX, `${switchDirection * -100}%`, spring);
      }
    }

    wasActive.current = isActive;
  }, [isActive, activeApp, previousActiveApp, scale, translateX]);

  return (
    <motion.div
      style={{
        transformOrigin,
        zIndex,
        scale,
        translateX,
      }}
      className={`absolute inset-0 overflow-hidden shadow-lg/80 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="absolute inset-0 backdrop-blur-2xl bg-background/80" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.03] pointer-events-none" aria-hidden="true">
        <filter id={`noise-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${id})`} />
      </svg>
      <div className="relative h-full">
        <Component />
      </div>
    </motion.div>
  );
}

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const previousActiveAppRef = useRef<AppId | null>(null);
  const previousActiveApp = previousActiveAppRef.current;

  useEffect(() => {
    previousActiveAppRef.current = activeApp;
  }, [activeApp]);

  return (
    <div className="relative flex-1 min-h-0">
      {apps.map(({ id, Component }) => (
        <AppPane key={id} id={id} Component={Component} activeApp={activeApp} previousActiveApp={previousActiveApp} />
      ))}
    </div>
  );
}

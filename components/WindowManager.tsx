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
const RADIUS = '8px';
const RADIUS_FLAT = '0px';

function AppPane({ id, Component, activeApp }: { id: AppId; Component: React.ComponentType; activeApp: AppId | null }) {
  const isActive = activeApp === id;
  const wasActive = useRef(false);
  const zIndex = useMotionValue(0);
  const scale = useMotionValue(0);
  const translateY = useMotionValue('0%');
  const borderRadius = useMotionValue(RADIUS);
  const animation = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    animation.current?.stop();

    if (isActive) {
      scale.jump(0);
      translateY.jump('0%');
      borderRadius.jump(RADIUS);
      zIndex.set(1);

      animation.current = animate(scale, 1, spring);
      animate(borderRadius, RADIUS_FLAT, { duration: 0.1, delay: duration * 0.9, ease: 'easeOut' });
    } else if (wasActive.current) {
      if (activeApp === null) {
        zIndex.set(0);
        animation.current = animate(scale, 0, spring);
        animate(borderRadius, RADIUS, { duration: 0.1, ease: 'easeIn' });
      } else {
        zIndex.set(-1);
        animation.current = animate(scale, 0.98, spring);
        animate(translateY, '-100%', { duration: duration * 0.5, ease: 'easeIn' });
        animate(borderRadius, RADIUS, { duration: 0.1, ease: 'easeIn' });
      }
    }

    wasActive.current = isActive;
  }, [isActive, activeApp, zIndex, scale, translateY, borderRadius]);

  return (
    <motion.div
      style={{
        transformOrigin: 'bottom center',
        pointerEvents: isActive ? 'auto' : 'none',
        zIndex,
        scale,
        translateY,
        borderRadius,
      }}
      className="absolute inset-0 overflow-hidden shadow-lg/80"
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

  return (
    <div className="relative flex-1 min-h-0">
      {apps.map(({ id, Component }) => (
        <AppPane key={id} id={id} Component={Component} activeApp={activeApp} />
      ))}
    </div>
  );
}

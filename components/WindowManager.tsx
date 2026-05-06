'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { motion } from 'motion/react';
import type { AppId } from '@/stores/useWindowStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { BrowserApp } from './browser/BrowserApp';
import { MissionCenterApp } from './mission-center/MissionCenterApp';
import { WeTalkApp } from './wetalk/WeTalkApp';

/** Keep in sync with `taskbarLayout.ts` launcher button width + gap. */
const TASKBAR_LAUNCHER_STRIDE_PX = 120 + 8;

function taskbarLauncherOriginOffsetXpx(appIndex: number, launcherCount: number): number {
  return (appIndex - (launcherCount - 1) / 2) * TASKBAR_LAUNCHER_STRIDE_PX;
}

const apps: { id: AppId; Component: ComponentType }[] = [
  { id: 'wetalk', Component: WeTalkApp },
  { id: 'browser', Component: BrowserApp },
  { id: 'mission-center', Component: MissionCenterApp },
];

const scaleTransition = {
  type: 'tween' as const,
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/** Slightly past scale tween so the mask releases after open finishes. */
const OPEN_NEIGHBOR_MASK_MS = Math.round(scaleTransition.duration * 1000) + 40;

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const n = apps.length;
  const panelFractionPct = 100 / n;

  const frozenIndexRef = useRef(0);
  const slideIndex =
    activeApp !== null ? Math.max(0, apps.findIndex((a) => a.id === activeApp)) : frozenIndexRef.current;

  const prevActiveRef = useRef(activeApp);
  const scaleOpenFromTaskbarPendingRef = useRef(false);
  const [maskNeighborPanelsDuringOpen, setMaskNeighborPanelsDuringOpen] = useState(false);

  /** After minimize, carousel `x` still matches last app; snap so scale-up matches newly opened launcher. */
  const openingFromTaskbarSync = prevActiveRef.current === null && activeApp !== null;

  /** Tray→open scale still tweening; switching apps mid-flight fights the carousel — snap scale to 1 this frame. */
  const interruptScaleForAppSwitch =
    activeApp !== null &&
    prevActiveRef.current !== null &&
    prevActiveRef.current !== activeApp &&
    scaleOpenFromTaskbarPendingRef.current;

  const outerScaleTransition = interruptScaleForAppSwitch ? { type: 'tween' as const, duration: 0 } : scaleTransition;

  useEffect(() => {
    if (activeApp !== null) {
      const i = apps.findIndex((a) => a.id === activeApp);
      if (i >= 0) frozenIndexRef.current = i;
    }
  }, [activeApp]);

  useEffect(() => {
    const prev = prevActiveRef.current;

    if (activeApp === null) {
      setMaskNeighborPanelsDuringOpen(false);
      scaleOpenFromTaskbarPendingRef.current = false;
      prevActiveRef.current = null;
      return;
    }

    if (prev === null) {
      setMaskNeighborPanelsDuringOpen(true);
      scaleOpenFromTaskbarPendingRef.current = true;
      const t = window.setTimeout(() => {
        setMaskNeighborPanelsDuringOpen(false);
        scaleOpenFromTaskbarPendingRef.current = false;
      }, OPEN_NEIGHBOR_MASK_MS);
      prevActiveRef.current = activeApp;
      return () => window.clearTimeout(t);
    }

    if (prev !== activeApp) {
      setMaskNeighborPanelsDuringOpen(false);
      scaleOpenFromTaskbarPendingRef.current = false;
    }

    prevActiveRef.current = activeApp;
  }, [activeApp]);

  const originXpx = taskbarLauncherOriginOffsetXpx(slideIndex, n);
  const transformOrigin = `calc(50% + ${originXpx}px) 100%`;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: activeApp !== null ? 1 : 0 }}
        transition={outerScaleTransition}
        style={{ transformOrigin }}
      >
        <motion.div
          className="flex h-full"
          style={{ width: `${n * 100}%` }}
          initial={false}
          animate={{ x: `-${slideIndex * panelFractionPct}%` }}
          transition={openingFromTaskbarSync ? { duration: 0 } : scaleTransition}
        >
          {apps.map(({ id, Component: AppComponent }, i) => {
            const isActive = activeApp === id;
            const hideNeighborsWhileMinimized =
              activeApp === null && i !== slideIndex ? 'pointer-events-none invisible opacity-0' : '';
            /** Scale-up from taskbar squeezes the whole strip; hide off-target panels briefly. Cleared on app switch. */
            const hideNeighborsWhileOpening =
              maskNeighborPanelsDuringOpen &&
              activeApp !== null &&
              !isActive &&
              !interruptScaleForAppSwitch
                ? 'pointer-events-none invisible opacity-0'
                : '';
            const panelHiddenClass = [hideNeighborsWhileMinimized, hideNeighborsWhileOpening]
              .filter(Boolean)
              .join(' ');
            return (
              <div
                key={id}
                className={`relative h-full shrink-0 overflow-hidden shadow-lg/80 ${panelHiddenClass}${
                  activeApp !== null && !isActive ? ' pointer-events-none' : ''
                }`}
                style={{ width: `${panelFractionPct}%` }}
                aria-hidden={!isActive}
                inert={activeApp === null || !isActive ? true : undefined}
              >
                <div className="absolute inset-0 backdrop-blur-2xl bg-background/80" />
                <div className="relative h-full">
                  <AppComponent />
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}

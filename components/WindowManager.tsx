'use client';

import { cubicBezier, reverseEasing } from 'motion';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { APPS } from '@/components/appsConfig';
import { useWindowStore } from '@/stores/useWindowStore';

/** Keep in sync with `taskbarLayout.ts` launcher button width + gap. */
const TASKBAR_LAUNCHER_STRIDE_PX = 120 + 8;

function taskbarLauncherOriginOffsetXpx(appIndex: number, launcherCount: number): number {
  return (appIndex - (launcherCount - 1) / 2) * TASKBAR_LAUNCHER_STRIDE_PX;
}

const easeOutCubicish = cubicBezier(0.33, 1, 0.68, 1);
const easeInCubicish = reverseEasing(easeOutCubicish);

const SCALE_DURATION = 0.35;

const scaleTransitionOpen = {
  type: 'tween' as const,
  duration: SCALE_DURATION,
  ease: easeOutCubicish,
};

const scaleTransitionMinimize = {
  type: 'tween' as const,
  duration: SCALE_DURATION,
  ease: easeInCubicish,
};

const carouselTransition = {
  type: 'tween' as const,
  duration: SCALE_DURATION,
  ease: easeOutCubicish,
};

/** Past scale tween; keeps scale-open bookkeeping aligned with carousel mask timing. */
const OPEN_NEIGHBOR_MASK_MS = Math.round(SCALE_DURATION * 1000) + 40;

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const n = APPS.length;
  const panelFractionPct = 100 / n;

  const frozenIndexRef = useRef(0);
  const slideIndex =
    activeApp !== null
      ? Math.max(
          0,
          APPS.findIndex((a) => a.id === activeApp),
        )
      : frozenIndexRef.current;

  const prevActiveRef = useRef(activeApp);
  const scaleOpenFromTaskbarPendingRef = useRef(false);
  const [carouselSlideAnimating, setCarouselSlideAnimating] = useState(false);

  /** After minimize, carousel `x` still matches last app; snap so scale-up matches newly opened launcher. */
  const openingFromTaskbarSync = prevActiveRef.current === null && activeApp !== null;
  const openingTraySnapRef = useRef(openingFromTaskbarSync);
  openingTraySnapRef.current = openingFromTaskbarSync;

  /** Tray→open scale still tweening; switching apps mid-flight fights the carousel — snap scale to 1 this frame. */
  const interruptScaleForAppSwitch =
    activeApp !== null &&
    prevActiveRef.current !== null &&
    prevActiveRef.current !== activeApp &&
    scaleOpenFromTaskbarPendingRef.current;

  /** While switching apps (`activeApp` just changed but ref not updated yet) or carousel is sliding, adjacent panels stay visible for the tween. Otherwise hide them — stops flashes when spamming tray open/minimize during scale. */
  const peekNeighborsWhileOpen =
    activeApp !== null && (carouselSlideAnimating || (!!prevActiveRef.current && prevActiveRef.current !== activeApp));

  const outerScaleTransition = interruptScaleForAppSwitch
    ? { type: 'tween' as const, duration: 0 }
    : activeApp !== null
      ? scaleTransitionOpen
      : scaleTransitionMinimize;

  useEffect(() => {
    if (activeApp !== null) {
      const i = APPS.findIndex((a) => a.id === activeApp);
      if (i >= 0) frozenIndexRef.current = i;
    }
  }, [activeApp]);

  useEffect(() => {
    const prev = prevActiveRef.current;

    if (activeApp === null) {
      scaleOpenFromTaskbarPendingRef.current = false;
      prevActiveRef.current = null;
      return;
    }

    if (prev === null) {
      scaleOpenFromTaskbarPendingRef.current = true;
      const t = window.setTimeout(() => {
        scaleOpenFromTaskbarPendingRef.current = false;
      }, OPEN_NEIGHBOR_MASK_MS);
      prevActiveRef.current = activeApp;
      return () => window.clearTimeout(t);
    }

    if (prev !== activeApp) {
      scaleOpenFromTaskbarPendingRef.current = false;
    }

    prevActiveRef.current = activeApp;
  }, [activeApp]);

  const originXpx = taskbarLauncherOriginOffsetXpx(slideIndex, n);
  const transformOrigin = `calc(50% + ${originXpx}px) 100%`;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden isolate"
        initial={false}
        animate={{ scale: activeApp !== null ? 1 : 0 }}
        transition={outerScaleTransition}
        style={{ transformOrigin, contain: 'paint' }}
      >
        <motion.div
          className="flex h-full min-h-0"
          style={{ width: `${n * 100}%` }}
          initial={false}
          animate={{ x: `-${slideIndex * panelFractionPct}%` }}
          transition={openingFromTaskbarSync ? { duration: 0 } : carouselTransition}
          onAnimationStart={() => {
            if (!openingTraySnapRef.current) setCarouselSlideAnimating(true);
          }}
          onAnimationComplete={() => setCarouselSlideAnimating(false)}
        >
          {APPS.map(({ id, Component: AppComponent }, i) => {
            const isActive = activeApp === id;
            const hideNeighborsWhileMinimized =
              activeApp === null && i !== slideIndex ? 'pointer-events-none invisible opacity-0' : '';
            const hideOffSlideWhileOpen =
              activeApp !== null && !peekNeighborsWhileOpen && i !== slideIndex
                ? 'pointer-events-none invisible opacity-0'
                : '';

            const panelHiddenClass = [hideNeighborsWhileMinimized, hideOffSlideWhileOpen].filter(Boolean).join(' ');
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

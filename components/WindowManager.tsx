'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { AppId } from '@/stores/useWindowStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { BrowserApp } from './browser/BrowserApp';
import { MissionCenterApp } from './mission-center/MissionCenterApp';
import { WeTalkApp } from './wetalk/WeTalkApp';

const appComponents: Record<AppId, React.ComponentType> = {
  wetalk: WeTalkApp,
  browser: BrowserApp,
  'mission-center': MissionCenterApp,
};

const spring = { type: 'spring' as const, duration: 0.35, bounce: 0 };
const RADIUS = '8px';
const RADIUS_FLAT = '0px';

export function WindowManager() {
  const activeApp = useWindowStore((s) => s.activeApp);
  const App = activeApp ? appComponents[activeApp] : null;
  const prevApp = useRef(activeApp);

  const toDesktop = activeApp === null;

  useEffect(() => {
    prevApp.current = activeApp;
  });

  return (
    <div className="relative flex-1 min-h-0">
      <AnimatePresence mode="popLayout" custom={toDesktop}>
        {activeApp ? (
          <motion.div
            key={activeApp}
            initial={{ scale: 0, borderRadius: RADIUS }}
            animate={{
              scale: 1,
              borderRadius: RADIUS_FLAT,
              transition: {
                scale: spring,
                borderRadius: { duration: 0.1, delay: 0.25, ease: 'easeOut' },
              },
            }}
            exit="exit"
            variants={{
              exit: (minimize: boolean) =>
                minimize
                  ? {
                      scale: 0,
                      borderRadius: RADIUS,
                      transition: {
                        scale: spring,
                        borderRadius: { duration: 0.1, delay: 0, ease: 'easeIn' },
                      },
                    }
                  : {
                      opacity: 0,
                      borderRadius: RADIUS,
                      transition: {
                        opacity: spring,
                        borderRadius: { duration: 0.1, delay: 0, ease: 'easeIn' },
                      },
                    },
            }}
            style={{ transformOrigin: 'bottom center' }}
            className="absolute inset-0 overflow-hidden shadow-lg/40"
          >
            <div className="absolute inset-0 backdrop-blur-2xl bg-background/80" />
            <svg className="absolute inset-0 h-full w-full opacity-[0.03] pointer-events-none" aria-hidden="true">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>

            <div className="relative h-full">{App && <App />}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

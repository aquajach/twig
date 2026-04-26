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

const duration = 0.3;

const spring = { type: 'spring' as const, duration, bounce: 0 };
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
            initial={{ scale: 0, borderRadius: RADIUS, translateX: 50 }}
            animate={{
              scale: 1,
              translateX: 0,
              borderRadius: RADIUS_FLAT,
              transition: {
                scale: spring,
                borderRadius: { duration: 0.1, delay: duration * 0.9, ease: 'easeOut' },
              },
            }}
            exit="exit"
            variants={{
              exit: (minimize: boolean) =>
                minimize
                  ? {
                      scale: 0,
                      translateX: 50,
                      borderRadius: RADIUS,
                      transition: {
                        scale: spring,
                        borderRadius: { duration: 0.1, delay: 0, ease: 'easeIn' },
                      },
                    }
                  : {
                      zIndex: -1,
                      borderRadius: RADIUS,
                      scale: 0.98,
                      translateY: '-100%',
                      transition: {
                        scale: spring,
                        translateY: { duration: duration * 0.5, delay: 0, ease: 'easeIn' },
                        borderRadius: { duration: 0.1, delay: 0, ease: 'easeIn' },
                      },
                    },
            }}
            style={{ transformOrigin: 'bottom center' }}
            className="absolute inset-0 overflow-hidden shadow-lg/80"
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

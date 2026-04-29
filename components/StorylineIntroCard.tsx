'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useStorylineIntroStore } from '@/stores/useStorylineIntroStore';

const LABEL_TYPE_MS = 100;
const HEADING_TYPE_MS = 100;
const INITIAL_TYPING_DELAY_MS = 1000;
const BETWEEN_LINES_MS = 1500;
const HOLD_DONE_MS = 3000;

export function StorylineIntroCard() {
  const intro = useStorylineIntroStore((s) => s.current);
  const clear = useStorylineIntroStore((s) => s.clear);
  const [typedLabel, setTypedLabel] = useState('');
  const [typedHeading, setTypedHeading] = useState('');
  const [activeLine, setActiveLine] = useState<'label' | 'heading' | null>(null);

  useEffect(() => {
    if (!intro) {
      setTypedLabel('');
      setTypedHeading('');
      setActiveLine(null);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const typeText = (text: string, speedMs: number, onUpdate: (value: string) => void, onDone: () => void) => {
      let index = 0;
      const tick = () => {
        if (cancelled) return;
        index += 1;
        onUpdate(text.slice(0, index));
        if (index >= text.length) {
          onDone();
          return;
        }
        timeoutId = setTimeout(tick, speedMs);
      };
      timeoutId = setTimeout(tick, speedMs);
    };

    setTypedLabel('');
    setTypedHeading('');
    setActiveLine('label');
    timeoutId = setTimeout(() => {
      typeText(intro.label, LABEL_TYPE_MS, setTypedLabel, () => {
        setActiveLine(null);
        timeoutId = setTimeout(() => {
          setActiveLine('heading');
          typeText(intro.heading, HEADING_TYPE_MS, setTypedHeading, () => {
            timeoutId = setTimeout(() => {
              setActiveLine(null);
              clear();
            }, HOLD_DONE_MS);
          });
        }, BETWEEN_LINES_MS);
      });
    }, INITIAL_TYPING_DELAY_MS);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [clear, intro]);

  return (
    <AnimatePresence>
      {intro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-40 grid place-items-center px-4"
        >
          <motion.div
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.99 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
            className="w-full max-w-xl rounded-xl bg-black/40 px-16 py-12 backdrop-blur-md"
          >
            <div className="font-semibold text-xl text-accent">
              {typedLabel}
              {activeLine === 'label' && (
                <span className="ml-0.5 inline-block h-[1em] w-[0.1em] animate-caret-blink bg-white/80" />
              )}
            </div>
            <div className="text-4xl text-text-primary">
              {typedHeading}
              {activeLine === 'heading' && (
                <span className="ml-0.5 inline-block h-[1em] w-[0.12em] animate-caret-blink bg-white align-baseline" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

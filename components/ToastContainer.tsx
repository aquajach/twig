'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Button } from 'react-aria-components/Button';
import { useToastStore } from '@/stores/useToastStore';
import { useWindowStore } from '@/stores/useWindowStore';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-2 px-3 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)]"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.32, bounce: 0.2 }}
            className="pointer-events-auto w-full max-w-md"
          >
            <Button
              onPress={() => {
                openApp(t.app);
                dismiss(t.id);
              }}
              className="w-full flex flex-col items-stretch text-left gap-0.5 rounded-[var(--radius-container)] bg-[var(--accent)] px-3 py-2.5 shadow-lg outline-none data-[hovered]:bg-[var(--accent-hover)] data-[pressed]:brightness-90"
            >
              <div className="text-xs font-medium text-black/70">{t.title}</div>
              {t.body ? <div className="text-sm text-black line-clamp-2">{t.body}</div> : null}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

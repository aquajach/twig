'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Button } from 'react-aria-components/Button';
import { LuBell, LuCircleCheckBig, LuMessageCircle, LuStar } from 'react-icons/lu';
import { type ToastVariant, useToastStore } from '@/stores/useToastStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { cn } from '@/utils/cn';

type IconComponent = typeof LuMessageCircle;

const toastIcons: Record<ToastVariant, IconComponent> = {
  chat: LuMessageCircle,
  mission_new: LuStar,
  mission_complete: LuCircleCheckBig,
  default: LuBell,
};

/** WeTalk / chat — app accent surface with dark text. */
const accentToast = {
  surface: 'bg-[var(--accent)] shadow-lg data-[hovered]:bg-[var(--accent-hover)] data-[pressed]:brightness-90',
  title: 'text-black/70',
  body: 'text-black',
} as const;

/** Info semantic — generic engine notifications (reference “info” blue). */
const infoToast = {
  surface: 'bg-blue-600 text-white shadow-blue-900/25 data-[hovered]:bg-blue-500 data-[pressed]:brightness-[0.92]',
  title: 'text-white/85',
  body: 'text-white',
} as const;

const toastVariantClasses: Record<ToastVariant, { surface: string; title: string; body: string }> = {
  chat: accentToast,
  mission_new: {
    surface:
      'bg-amber-300 text-amber-950 shadow-amber-900/20 data-[hovered]:bg-amber-200 data-[pressed]:brightness-[0.97]',
    title: 'text-amber-950/90',
    body: 'text-amber-950',
  },
  mission_complete: {
    surface:
      'bg-emerald-400 text-emerald-950 shadow-emerald-900/20 data-[hovered]:bg-emerald-300 data-[pressed]:brightness-[0.97]',
    title: 'text-emerald-950/90',
    body: 'text-emerald-950',
  },
  default: infoToast,
};

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
        {toasts.map((t) => {
          const vis = toastVariantClasses[t.variant];
          const Icon = toastIcons[t.variant];
          return (
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
                className={cn(
                  'flex w-full flex-col gap-0.5 text-left rounded-[var(--radius-container)] px-3 py-2.5 outline-none',
                  vis.surface,
                )}
              >
                <div className="flex min-w-0 flex-row items-start gap-1.5">
                  <Icon className={cn('size-[18px] shrink-0', vis.title)} aria-hidden />
                  <div className={cn('min-w-0 flex-1 text-sm font-medium leading-snug', vis.title)}>{t.title}</div>
                </div>
                {t.body ? <div className={cn('mt-0.5 text-sm line-clamp-2', vis.body)}>{t.body}</div> : null}
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

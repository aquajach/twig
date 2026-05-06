'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Button } from 'react-aria-components/Button';
import { createPortal } from 'react-dom';
import { initializeEngine } from '@/engine/evaluate';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { useWindowStore } from '@/stores/useWindowStore';

const menuIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const backIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M10 6 4 12l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const reloadIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 11a8 8 0 1 0-2.34 5.66"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const resetIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function MenuItem({
  icon,
  label,
  variant = 'default',
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'danger';
  onPress: () => void;
}) {
  return (
    <Button
      onPress={onPress}
      className={`grid w-max cursor-pointer grid-cols-[24px_max-content] items-center gap-4 rounded-xl px-5 py-4 text-left text-base outline-none transition data-[hovered]:bg-white/10 data-[pressed]:scale-[0.99] ${
        variant === 'danger' ? 'text-danger data-[hovered]:bg-danger-hover' : 'text-text-primary'
      }`}
    >
      <span className={variant === 'danger' ? 'text-danger' : 'text-text-primary'}>{icon}</span>
      <span className="font-normal">{label}</span>
    </Button>
  );
}

export function TaskbarMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBackToGame = () => {
    setIsMenuOpen(false);
  };

  const handleReloadGame = () => {
    window.location.reload();
  };

  const handleResetGame = () => {
    const confirmed = window.confirm(
      'Reset the game? This will erase all progress, conversations, and collected memos. This cannot be undone.',
    );
    if (!confirmed) return;
    useGameStore.getState().reset();
    useChatStore.getState().reset();
    useWindowStore.getState().reset();
    initializeEngine();
    setIsMenuOpen(false);
  };

  return (
    <>
      <Button
        aria-label="Game menu"
        onPress={() => setIsMenuOpen((open) => !open)}
        className="absolute top-1 right-1 bottom-1 aspect-square flex items-center justify-center rounded-[var(--radius-container)] text-text-secondary outline-none transition-all data-[hovered]:bg-surface-active data-[hovered]:ring ring-specular data-[pressed]:scale-95 data-[pressed]:ring-0"
      >
        {menuIcon}
      </Button>
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/65 p-6 backdrop-blur-md"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ type: 'spring', duration: 0.25, bounce: 0.1 }}
                  className="grid w-max grid-cols-[max-content] gap-2"
                >
                  <MenuItem onPress={handleBackToGame} label="Back to game" icon={backIcon} />
                  <MenuItem onPress={handleReloadGame} label="Reload game" icon={reloadIcon} />
                  <div className="mx-2 my-1 h-px bg-white/10" />
                  <MenuItem onPress={handleResetGame} label="Reset game" variant="danger" icon={resetIcon} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

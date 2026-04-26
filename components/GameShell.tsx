'use client';

import { useEffect } from 'react';
import { initializeEngine } from '@/engine/evaluate';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';

export function GameShell() {
  useEffect(() => {
    initializeEngine();
  }, []);

  return (
    <div className="game-shell relative flex flex-col h-dvh w-dvw overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: 'url(/desktop.jpg)' }} />

      <WindowManager />
      <Taskbar />
    </div>
  );
}

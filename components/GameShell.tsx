'use client';

import { useEffect } from 'react';
import { initializeEngine } from '@/engine/evaluate';
import { StorylineIntroCard } from './StorylineIntroCard';
import { Taskbar } from './Taskbar';
import { ToastContainer } from './ToastContainer';
import { WindowManager } from './WindowManager';

export function GameShell() {
  useEffect(() => {
    initializeEngine();
  }, []);

  return (
    <div className="game-shell flex flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: 'url(/desktop.jpg)' }} />

      <WindowManager />
      <Taskbar />
      <StorylineIntroCard />
      <ToastContainer />
    </div>
  );
}

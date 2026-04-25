import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppId = 'wetalk' | 'browser' | 'mission-center';

type WindowState = {
  activeApp: AppId | null;
  openApp: (app: AppId) => void;
  minimizeApp: () => void;
};

export const useWindowStore = create<WindowState>()(
  persist(
    (set) => ({
      activeApp: null,
      openApp: (app) => set({ activeApp: app }),
      minimizeApp: () => set({ activeApp: null }),
    }),
    { name: 'twig-window' },
  ),
);

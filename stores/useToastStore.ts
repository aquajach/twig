import { create } from 'zustand';
import { npcs } from '@/data/npcs';
import { useChatStore } from '@/stores/useChatStore';
import type { AppId } from '@/stores/useWindowStore';
import { useWindowStore } from '@/stores/useWindowStore';

export type ToastItem = {
  id: string;
  app: AppId;
  title: string;
  body?: string;
};

type ToastStore = {
  toasts: ToastItem[];
  push: (item: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;

  badges: Partial<Record<AppId, number>>;
  incrementBadge: (app: AppId) => void;
  clearBadge: (app: AppId) => void;

  reset: () => void;
};

const TOAST_TTL_MS = 3000;

let idCounter = 0;

function nextId(): string {
  idCounter += 1;
  return `toast-${idCounter}`;
}

const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

function clearDismiss(id: string): void {
  const t = dismissTimers.get(id);
  if (t !== undefined) {
    clearTimeout(t);
    dismissTimers.delete(id);
  }
}

function previewText(text: string, max = 100): string {
  const t = text.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  push: (item) => {
    const id = nextId();
    set((s) => ({ toasts: [...s.toasts, { ...item, id }] }));
    const timer = setTimeout(() => {
      dismissTimers.delete(id);
      get().dismiss(id);
    }, TOAST_TTL_MS);
    dismissTimers.set(id, timer);
  },

  dismiss: (id) => {
    clearDismiss(id);
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  badges: {},

  incrementBadge: (app) => set((s) => ({ badges: { ...s.badges, [app]: (s.badges[app] ?? 0) + 1 } })),

  clearBadge: (app) =>
    set((s) => {
      if (!s.badges[app]) return s;
      const { [app]: _, ...rest } = s.badges;
      return { badges: rest };
    }),

  reset: () => {
    for (const t of get().toasts) clearDismiss(t.id);
    set({ toasts: [], badges: {} });
  },
}));

/** Toast when an NPC message arrives and the user is not viewing the sender's chat. */
export function notifyWeTalkIfInBackground(npcId: string, message: string): void {
  const isViewingSender =
    useWindowStore.getState().activeApp === 'wetalk' && useChatStore.getState().activeNpcId === npcId;
  if (isViewingSender) return;
  const store = useToastStore.getState();
  const npc = npcs[npcId];
  const title = npc?.name ?? 'WeTalk';
  store.push({ app: 'wetalk', title, body: previewText(message) });
  store.incrementBadge('wetalk');
}

export function showEngineNotification(p: { app: AppId; title: string; body?: string }): void {
  const store = useToastStore.getState();
  store.push({
    app: p.app,
    title: p.title,
    body: p.body ? previewText(p.body) : undefined,
  });
  if (useWindowStore.getState().activeApp !== p.app) {
    store.incrementBadge(p.app);
  }
}

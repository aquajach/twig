import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatMessage = {
  role: 'player' | 'npc';
  content: string;
  timestamp: number;
};

type ChatStore = {
  histories: Record<string, ChatMessage[]>;

  addMessage: (npcId: string, message: ChatMessage) => void;
  getHistory: (npcId: string) => ChatMessage[];
  getLastMessage: (npcId: string) => ChatMessage | undefined;

  lastReadTimestamp: Record<string, number>;
  markRead: (npcId: string) => void;
  getUnreadCount: (npcId: string) => number;

  reset: () => void;
};

const initialState = {
  histories: {} as Record<string, ChatMessage[]>,
  lastReadTimestamp: {} as Record<string, number>,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addMessage: (npcId, message) =>
        set((s) => ({
          histories: {
            ...s.histories,
            [npcId]: [...(s.histories[npcId] ?? []), message],
          },
        })),

      getHistory: (npcId) => get().histories[npcId] ?? [],

      getLastMessage: (npcId) => {
        const history = get().histories[npcId];
        return history?.[history.length - 1];
      },

      markRead: (npcId) =>
        set((s) => ({
          lastReadTimestamp: { ...s.lastReadTimestamp, [npcId]: Date.now() },
        })),

      getUnreadCount: (npcId) => {
        const state = get();
        const history = state.histories[npcId] ?? [];
        const lastRead = state.lastReadTimestamp[npcId] ?? 0;
        return history.filter((m) => m.role === 'npc' && m.timestamp > lastRead).length;
      },

      reset: () => set(initialState),
    }),
    { name: 'twig-chat' },
  ),
);

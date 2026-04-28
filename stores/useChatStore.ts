import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWindowStore } from '@/stores/useWindowStore';

export type ChatMessage = {
  role: 'player' | 'npc';
  content: string;
  timestamp: number;
};

export type CachedSuggestions = {
  forTimestamp: number;
  replies: string[];
};

type ChatStore = {
  histories: Record<string, ChatMessage[]>;

  addMessage: (npcId: string, message: ChatMessage) => void;
  getHistory: (npcId: string) => ChatMessage[];
  getLastMessage: (npcId: string) => ChatMessage | undefined;

  lastReadTimestamp: Record<string, number>;
  markRead: (npcId: string) => void;
  getUnreadCount: (npcId: string) => number;

  activeNpcId: string | null;
  setActiveNpcId: (npcId: string | null) => void;

  suggestions: Record<string, CachedSuggestions>;
  setSuggestions: (npcId: string, forTimestamp: number, replies: string[]) => void;
  clearSuggestions: (npcId: string) => void;
  getSuggestions: (npcId: string) => CachedSuggestions | undefined;

  reset: () => void;
};

const initialState = {
  histories: {} as Record<string, ChatMessage[]>,
  lastReadTimestamp: {} as Record<string, number>,
  suggestions: {} as Record<string, CachedSuggestions>,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addMessage: (npcId, message) =>
        set((s) => {
          const histories = {
            ...s.histories,
            [npcId]: [...(s.histories[npcId] ?? []), message],
          };
          const isViewingSender =
            message.role === 'npc' && useWindowStore.getState().activeApp === 'wetalk' && s.activeNpcId === npcId;
          if (isViewingSender) {
            return {
              histories,
              lastReadTimestamp: { ...s.lastReadTimestamp, [npcId]: message.timestamp },
            };
          }
          return { histories };
        }),

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

      activeNpcId: null,
      setActiveNpcId: (npcId) => set({ activeNpcId: npcId }),

      suggestions: {},

      setSuggestions: (npcId, forTimestamp, replies) =>
        set((s) => ({
          suggestions: { ...s.suggestions, [npcId]: { forTimestamp, replies } },
        })),

      clearSuggestions: (npcId) =>
        set((s) => {
          const { [npcId]: _, ...rest } = s.suggestions;
          return { suggestions: rest };
        }),

      getSuggestions: (npcId) => get().suggestions[npcId],

      reset: () => set(initialState),
    }),
    { name: 'twig-chat', partialize: (s) => ({ histories: s.histories, lastReadTimestamp: s.lastReadTimestamp }) },
  ),
);

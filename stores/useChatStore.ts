import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWindowStore } from '@/stores/useWindowStore';

export type ChatTextMessage = {
  kind: 'text';
  role: 'player' | 'npc';
  content: string;
  timestamp: number;
};

export type ChatLinkMessage = {
  kind: 'link';
  role: 'npc';
  link: {
    label: string;
    pageId: string;
  };
  timestamp: number;
};

export type ChatMessage = ChatTextMessage | ChatLinkMessage;

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

function normalizeMessage(raw: unknown): ChatMessage | null {
  if (!raw || typeof raw !== 'object') return null;
  const maybe = raw as Record<string, unknown>;
  const role = maybe.role === 'player' ? 'player' : maybe.role === 'npc' ? 'npc' : null;
  if (!role) return null;
  const timestamp = typeof maybe.timestamp === 'number' ? maybe.timestamp : Date.now();
  if (maybe.kind === 'link') {
    const link = maybe.link;
    if (!link || typeof link !== 'object') return null;
    const label = typeof (link as { label?: unknown }).label === 'string' ? (link as { label: string }).label : '';
    const pageId = typeof (link as { pageId?: unknown }).pageId === 'string' ? (link as { pageId: string }).pageId : '';
    if (!label || !pageId || role !== 'npc') return null;
    return { kind: 'link', role, link: { label, pageId }, timestamp };
  }
  const content = typeof maybe.content === 'string' ? maybe.content : '';
  return { kind: 'text', role, content, timestamp };
}

function normalizeHistories(raw: unknown): Record<string, ChatMessage[]> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, ChatMessage[]> = {};
  for (const [npcId, history] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(history)) continue;
    const normalized = history.map(normalizeMessage).filter((msg): msg is ChatMessage => msg !== null);
    out[npcId] = normalized;
  }
  return out;
}

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
    {
      name: 'twig-chat',
      version: 2,
      partialize: (s) => ({ histories: s.histories, lastReadTimestamp: s.lastReadTimestamp }),
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Record<string, unknown>;
        return {
          ...p,
          histories: normalizeHistories(p.histories),
          lastReadTimestamp:
            p.lastReadTimestamp && typeof p.lastReadTimestamp === 'object'
              ? (p.lastReadTimestamp as Record<string, number>)
              : {},
        };
      },
    },
  ),
);

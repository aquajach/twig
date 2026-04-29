import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, MemoDefinition, StorylineRuntime, TaskDefinition, TaskStatus } from '@/engine/types';
import { useToastStore } from '@/stores/useToastStore';

type GameStore = GameState & {
  npcContextKeys: Record<string, string[]>;

  initStoryline: (id: string, status?: StorylineRuntime['status']) => void;
  activateStoryline: (id: string) => void;
  advanceStep: (storylineId: string) => void;
  completeStoryline: (storylineId: string) => void;

  createTask: (task: TaskDefinition) => void;
  setTaskStatus: (taskId: string, status: TaskStatus) => void;

  addMemo: (memo: MemoDefinition) => void;

  unlockNpc: (npcId: string) => void;

  setFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;

  addNpcContextKey: (npcId: string, contextKey: string) => void;
  getNpcContextKeys: (npcId: string) => string[];

  updateBrowserPageState: (pageId: string, state: Record<string, unknown>) => void;
  getBrowserPageState: (pageId: string) => Record<string, unknown>;
  setCurrentBrowserPageId: (pageId: string | null) => void;

  getStoryline: (id: string) => StorylineRuntime | undefined;

  reset: () => void;
};

const initialState: GameState & { npcContextKeys: Record<string, string[]> } = {
  storylines: {},
  tasks: {},
  taskDefinitions: {},
  memos: [],
  memoDefinitions: {},
  unlockedNpcs: [],
  flags: [],
  browserPageStates: {},
  currentBrowserPageId: null,
  npcContextKeys: {},
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initStoryline: (id, status = 'locked') =>
        set((s) => {
          if (s.storylines[id]) return s;
          return {
            storylines: {
              ...s.storylines,
              [id]: { status, currentStepIndex: 0 },
            },
          };
        }),

      activateStoryline: (id) =>
        set((s) => ({
          storylines: {
            ...s.storylines,
            [id]: { status: 'active', currentStepIndex: s.storylines[id]?.currentStepIndex ?? 0 },
          },
        })),

      advanceStep: (storylineId) =>
        set((s) => {
          const runtime = s.storylines[storylineId];
          if (!runtime || runtime.status !== 'active') return s;
          return {
            storylines: {
              ...s.storylines,
              [storylineId]: {
                ...runtime,
                currentStepIndex: runtime.currentStepIndex + 1,
              },
            },
          };
        }),

      completeStoryline: (storylineId) =>
        set((s) => {
          const runtime = s.storylines[storylineId];
          if (!runtime) return s;
          return {
            storylines: {
              ...s.storylines,
              [storylineId]: { ...runtime, status: 'completed' },
            },
          };
        }),

      createTask: (task) =>
        set((s) => {
          if (s.tasks[task.id] !== undefined) return s;
          return {
            tasks: { ...s.tasks, [task.id]: 'active' },
            taskDefinitions: { ...s.taskDefinitions, [task.id]: task },
          };
        }),

      setTaskStatus: (taskId, status) => set((s) => ({ tasks: { ...s.tasks, [taskId]: status } })),

      addMemo: (memo) =>
        set((s) => {
          if (s.memos.includes(memo.id)) return s;
          return {
            memos: [...s.memos, memo.id],
            memoDefinitions: { ...s.memoDefinitions, [memo.id]: memo },
          };
        }),

      unlockNpc: (npcId) =>
        set((s) => {
          if (s.unlockedNpcs.includes(npcId)) return s;
          return { unlockedNpcs: [...s.unlockedNpcs, npcId] };
        }),

      setFlag: (flag) =>
        set((s) => {
          if (s.flags.includes(flag)) return s;
          return { flags: [...s.flags, flag] };
        }),

      hasFlag: (flag) => get().flags.includes(flag),

      addNpcContextKey: (npcId, contextKey) =>
        set((s) => {
          const existing = s.npcContextKeys[npcId] ?? [];
          if (existing.includes(contextKey)) return s;
          return {
            npcContextKeys: {
              ...s.npcContextKeys,
              [npcId]: [...existing, contextKey],
            },
          };
        }),

      updateBrowserPageState: (pageId, state) =>
        set((s) => ({
          browserPageStates: {
            ...s.browserPageStates,
            [pageId]: { ...s.browserPageStates[pageId], ...state },
          },
        })),

      getBrowserPageState: (pageId) => get().browserPageStates[pageId] ?? {},

      setCurrentBrowserPageId: (pageId) => set({ currentBrowserPageId: pageId }),

      getNpcContextKeys: (npcId) => get().npcContextKeys[npcId] ?? [],

      getStoryline: (id) => get().storylines[id],

      reset: () => {
        useToastStore.getState().reset();
        set(initialState);
      },
    }),
    { name: 'twig-game' },
  ),
);

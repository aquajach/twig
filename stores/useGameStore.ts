import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, MemoDefinition, StorylineRuntime, TaskDefinition, TaskStatus } from '@/engine/types';
import { useToastStore } from '@/stores/useToastStore';

type GameStore = GameState & {
  npcContextKeys: Record<string, string[]>;

  initStoryline: (id: string, status?: StorylineRuntime['status']) => void;
  activateStoryline: (id: string) => void;
  completeStoryline: (storylineId: string) => void;
  addFiredStep: (storylineId: string, stepId: string) => void;
  addSatisfiedEventId: (storylineId: string, eventNodeId: string) => void;
  removeSatisfiedEventId: (storylineId: string, eventNodeId: string) => void;

  createTask: (task: TaskDefinition) => void;
  setTaskStatus: (taskId: string, status: TaskStatus) => void;

  addMemo: (memo: MemoDefinition) => void;

  unlockNpc: (npcId: string) => void;

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
              [id]: { status, firedStepIds: [], satisfiedEventIds: [] },
            },
          };
        }),

      activateStoryline: (id) =>
        set((s) => {
          const prev = s.storylines[id];
          return {
            storylines: {
              ...s.storylines,
              [id]: {
                status: 'active',
                firedStepIds: prev?.firedStepIds ?? [],
                satisfiedEventIds: prev?.satisfiedEventIds ?? [],
              },
            },
          };
        }),

      addFiredStep: (storylineId, stepId) =>
        set((s) => {
          const runtime = s.storylines[storylineId];
          if (!runtime || runtime.firedStepIds.includes(stepId)) return s;
          return {
            storylines: {
              ...s.storylines,
              [storylineId]: {
                ...runtime,
                firedStepIds: [...runtime.firedStepIds, stepId],
              },
            },
          };
        }),

      addSatisfiedEventId: (storylineId, eventNodeId) =>
        set((s) => {
          const runtime = s.storylines[storylineId];
          if (!runtime || runtime.satisfiedEventIds.includes(eventNodeId)) return s;
          return {
            storylines: {
              ...s.storylines,
              [storylineId]: {
                ...runtime,
                satisfiedEventIds: [...runtime.satisfiedEventIds, eventNodeId],
              },
            },
          };
        }),

      removeSatisfiedEventId: (storylineId, eventNodeId) =>
        set((s) => {
          const runtime = s.storylines[storylineId];
          if (!runtime || !runtime.satisfiedEventIds.includes(eventNodeId)) return s;
          return {
            storylines: {
              ...s.storylines,
              [storylineId]: {
                ...runtime,
                satisfiedEventIds: runtime.satisfiedEventIds.filter((id) => id !== eventNodeId),
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
    {
      name: 'twig-game',
      version: 2,
      migrate: (persisted, version) => {
        type P = GameState & { npcContextKeys: Record<string, string[]> } & { flags?: string[] };
        let s = { ...(persisted as object) } as P;
        if (version === 0) {
          const storylines: Record<string, StorylineRuntime> = {};
          for (const [id, r] of Object.entries(s.storylines ?? {})) {
            if (r && typeof r === 'object' && 'currentStepIndex' in r) {
              const old = r as StorylineRuntime & { currentStepIndex?: number };
              storylines[id] = {
                status: old.status,
                firedStepIds: [],
                satisfiedEventIds: [],
              };
            } else {
              storylines[id] = r as StorylineRuntime;
            }
          }
          s = { ...s, storylines };
        }
        if (version < 2) {
          const { flags: _removed, ...rest } = s;
          return rest as GameState & { npcContextKeys: Record<string, string[]> };
        }
        return s;
      },
    },
  ),
);

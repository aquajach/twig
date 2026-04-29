import type { AppId } from '@/stores/useWindowStore';

export type { AppId };

// --- Storyline ---

export type StorylineStatus = 'locked' | 'active' | 'completed';

export type Storyline = {
  id: string;
  title: string;
  initialStatus?: StorylineStatus;
  introCard?: {
    label: string;
  };
  steps: StorylineStep[];
};

export type StorylineStep = {
  id: string;
  description: string;
  trigger: Trigger;
  conditions?: Condition[];
  effects: SideEffect[];
};

// --- Triggers ---

export type Trigger =
  | { type: 'game_start' }
  | { type: 'chat_message_sent'; npcId: string; keywords?: string[] }
  | { type: 'chat_message_received'; npcId: string; keywords?: string[] }
  | { type: 'npc_chat_opened'; npcId: string }
  | { type: 'browser_page_visited'; pageId: string }
  | { type: 'browser_action'; pageId: string; actionId: string }
  | { type: 'task_completed'; taskId: string }
  | { type: 'storyline_completed'; storylineId: string }
  | { type: 'manual' };

// --- Conditions ---

export type Condition =
  | { type: 'storyline_status'; storylineId: string; status: StorylineStatus }
  | { type: 'storyline_at_step'; storylineId: string; stepId: string }
  | { type: 'storyline_past_step'; storylineId: string; stepId: string }
  | { type: 'task_status'; taskId: string; status: TaskStatus }
  | { type: 'npc_unlocked'; npcId: string }
  | { type: 'flag_set'; flag: string };

// --- Side Effects ---

export type SideEffect =
  | { type: 'unlock_npc'; npcId: string }
  | { type: 'send_npc_message'; npcId: string; content: string }
  | { type: 'show_notification'; app: AppId; title: string; body?: string }
  | { type: 'create_task'; task: TaskDefinition }
  | { type: 'complete_task'; taskId: string }
  | { type: 'grant_memo'; memo: MemoDefinition }
  | { type: 'set_browser_page'; pageId: string }
  | {
      type: 'update_browser_page_state';
      pageId: string;
      state: Record<string, unknown>;
    }
  | { type: 'set_flag'; flag: string }
  | { type: 'activate_storyline'; storylineId: string }
  | { type: 'update_npc_context'; npcId: string; contextKey: string };

// --- Tasks ---

export type TaskStatus = 'hidden' | 'active' | 'completed';

export type TaskDefinition = {
  id: string;
  storylineId: string;
  title: string;
  description: string;
};

// --- Memos ---

export type MemoDefinition = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

// --- Game State ---

export type StorylineRuntime = {
  status: StorylineStatus;
  currentStepIndex: number;
};

export type GameState = {
  storylines: Record<string, StorylineRuntime>;
  tasks: Record<string, TaskStatus>;
  taskDefinitions: Record<string, TaskDefinition>;
  memos: string[];
  memoDefinitions: Record<string, MemoDefinition>;
  unlockedNpcs: string[];
  flags: string[];
  browserPageStates: Record<string, Record<string, unknown>>;
  currentBrowserPageId: string | null;
};

// --- NPCs ---

export type NpcDefinition = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  basePersonality: string;
  roleKnowledge: string;
  contextSegments: Record<string, string>;
};

// --- Game Events ---

export type GameEvent =
  | { type: 'game_start' }
  | { type: 'chat_message_sent'; npcId: string; content: string }
  | { type: 'chat_message_received'; npcId: string; content: string }
  | { type: 'npc_chat_opened'; npcId: string }
  | { type: 'browser_page_visited'; pageId: string }
  | { type: 'browser_action'; pageId: string; actionId: string }
  | { type: 'task_completed'; taskId: string }
  | { type: 'storyline_completed'; storylineId: string };

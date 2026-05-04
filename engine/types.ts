import type { AppId } from '@/stores/useWindowStore';

export type { AppId };

// --- Storyline graph (DAG) ---

export type StorylineStatus = 'locked' | 'active' | 'completed';

export type StorylineGraph = {
  id: string;
  title: string;
  initialStatus?: StorylineStatus;
  introCard?: {
    label: string;
  };
  nodes: Record<string, GraphNode>;
};

export type GraphNode =
  | StepNode
  | EventBlockNode
  | ConditionNode
  | TaskNode
  | UnlockNpcNode
  | ContextNode
  | MemoNode
  | NotificationNode
  | NpcMessageNode
  | BrowserStateNode
  | StorylineRefNode;

export type Layout = { x: number; y: number };

/** Map key is the node id; no `id` field on the node. */
export type StepNode = {
  type: 'step';
  description?: string;
  triggeredBy?: string[];
  conditions?: string[];
  createTask?: string[];
  completeTask?: string[];
  unlockContext?: string[];
  grantMemo?: string[];
  notify?: string[];
  sendMessage?: string[];
  setPage?: string[];
  updatePageState?: string[];
  activateStoryline?: string[];
  unlock_npc?: string[];
  layout?: Layout;
};

/** One graph node type per `Trigger` variant (no JSON blob). */
export type EvtGameStartNode = { type: 'evt_game_start'; layout?: Layout };
export type EvtManualNode = { type: 'evt_manual'; layout?: Layout };
export type EvtChatMessageSentNode = {
  type: 'evt_chat_message_sent';
  npcId: string;
  keywords?: string[];
  layout?: Layout;
};
export type EvtChatMessageReceivedNode = {
  type: 'evt_chat_message_received';
  npcId: string;
  keywords?: string[];
  layout?: Layout;
};
export type EvtNpcChatOpenedNode = { type: 'evt_npc_chat_opened'; npcId: string; layout?: Layout };
export type EvtBrowserPageVisitedNode = { type: 'evt_browser_page_visited'; pageId: string; layout?: Layout };
export type EvtBrowserActionNode = {
  type: 'evt_browser_action';
  pageId: string;
  actionId: string;
  layout?: Layout;
};
export type EvtTaskCompletedNode = { type: 'evt_task_completed'; taskId: string; layout?: Layout };
export type EvtStorylineCompletedNode = {
  type: 'evt_storyline_completed';
  storylineId: string;
  layout?: Layout;
};

export type EventBlockNode =
  | EvtGameStartNode
  | EvtManualNode
  | EvtChatMessageSentNode
  | EvtChatMessageReceivedNode
  | EvtNpcChatOpenedNode
  | EvtBrowserPageVisitedNode
  | EvtBrowserActionNode
  | EvtTaskCompletedNode
  | EvtStorylineCompletedNode;

export type ConditionNode = { type: 'condition'; condition: Condition; layout?: Layout };
export type TaskNode = { type: 'task'; task: Omit<TaskDefinition, 'storylineId'>; layout?: Layout };
export type UnlockNpcNode = { type: 'unlock_npc'; npcId: string; layout?: Layout };
type NpcSegmentsMap = typeof import('@/data/npcSegments').npcSegments;
type NpcSegmentNpcId = keyof NpcSegmentsMap;

/** Context segment string ids are keyed per NPC in `data/npcSegments.ts`. */
export type ContextNode = {
  [K in NpcSegmentNpcId]: {
    type: 'context';
    npcId: K;
    contextKey: keyof NpcSegmentsMap[K] & string;
    layout?: Layout;
  };
}[NpcSegmentNpcId];
export type MemoNode = { type: 'memo'; memo: MemoDefinition; layout?: Layout };
export type NotificationNode = { type: 'notification'; app: AppId; title: string; body?: string; layout?: Layout };
export type NpcMessageNode = { type: 'npc_message'; npcId: string; content: string; layout?: Layout };
export type BrowserStateNode = {
  type: 'browser_state';
  pageId: string;
  mode: 'set' | 'update';
  state?: Record<string, unknown>;
  layout?: Layout;
};
export type StorylineRefNode = { type: 'storyline_ref'; storylineId: string; layout?: Layout };

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
  | { type: 'task_status'; taskId: string; status: TaskStatus }
  | { type: 'npc_unlocked'; npcId: string };

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

/** Arrays for zustand persist JSON; treat as sets of ids. */
export type StorylineRuntime = {
  status: StorylineStatus;
  firedStepIds: string[];
  satisfiedEventIds: string[];
};

export type GameState = {
  storylines: Record<string, StorylineRuntime>;
  tasks: Record<string, TaskStatus>;
  taskDefinitions: Record<string, TaskDefinition>;
  memos: string[];
  memoDefinitions: Record<string, MemoDefinition>;
  unlockedNpcs: string[];
  browserPageStates: Record<string, Record<string, unknown>>;
  currentBrowserPageId: string | null;
};

// --- NPCs ---

export type NpcDefinition<Id extends string> = {
  id: Id;
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

// --- Validation ---

export type ValidationSeverity = 'error' | 'warning';

export type ValidationError = {
  severity: ValidationSeverity;
  nodeId?: string;
  field?: string;
  message: string;
};

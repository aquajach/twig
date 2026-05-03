import type { StorylineFlowNodeType } from '@/components/editor/nodes/storyline-flow-node';

/** Graph handle visuals: trigger edges vs effect edges only. */
export const editorHandle = {
  trigger: '!h-2.5 !w-2.5 !bg-slate-500',
  effect: '!h-2.5 !w-2.5 !bg-emerald-600',
} as const;

export const editorHandlePos = {
  right: { top: '50%', right: -8 } as const,
  left: { top: '50%', left: -8 } as const,
} as const;

/** `nodrag` = React Flow: do not treat pointer interaction as node drag (e.g. text selection in fields). */
export const editorField = {
  label: 'nodrag block text-zinc-400',
  input: 'nodrag block w-full rounded bg-zinc-900 p-1',
  textarea: 'nodrag block w-full resize-y rounded bg-zinc-900 p-1',
  textareaMono: 'nodrag block w-full resize-y rounded bg-zinc-900 p-1 font-mono',
  select: 'nodrag block w-full rounded bg-zinc-900 p-1',
  helper: 'nodrag text-zinc-500',
} as const;

const evtTitle = 'text-amber-200';

/** Title row styles keyed by the same `type` string React Flow passes on each node. */
export const editorNodeTitle = {
  step: 'text-sky-300',
  task: 'text-yellow-200',
  condition: 'text-amber-200',
  context: 'text-pink-200',
  memo: 'text-zinc-200',
  notification: 'text-red-200',
  npc_message: 'text-purple-200',
  browser_state: 'text-blue-200',
  storyline_ref: 'text-green-200',
  unlock_npc: 'text-cyan-200',
  evt_game_start: evtTitle,
  evt_manual: evtTitle,
  evt_chat_message_sent: evtTitle,
  evt_chat_message_received: evtTitle,
  evt_npc_chat_opened: evtTitle,
  evt_browser_page_visited: evtTitle,
  evt_browser_action: evtTitle,
  evt_task_completed: evtTitle,
  evt_storyline_completed: evtTitle,
} as const satisfies Record<StorylineFlowNodeType, string>;

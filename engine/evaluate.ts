import { eventBlockNodeToTrigger, isEventBlockNode } from '@/engine/event-blocks';
import { executeSideEffect } from '@/engine/effects';
import { allStorylines } from '@/engine/storylines';
import { validateGraph } from '@/engine/validate';
import type { Condition, GameEvent, SideEffect, StorylineGraph, StorylineRuntime, Trigger } from '@/engine/types';
import { useGameStore } from '@/stores/useGameStore';

function getGraph(storylineId: string): StorylineGraph | undefined {
  return allStorylines.find((g) => g.id === storylineId);
}

function triggerMatches(trigger: Trigger, event: GameEvent): boolean {
  if (trigger.type === 'manual') return false;
  if (trigger.type === 'game_start') return event.type === 'game_start';
  if (trigger.type !== event.type) return false;

  switch (trigger.type) {
    case 'chat_message_sent':
    case 'chat_message_received': {
      const e = event as typeof trigger & { content: string };
      if (trigger.npcId !== e.npcId) return false;
      if (trigger.keywords?.length) {
        const lower = e.content.toLowerCase();
        return trigger.keywords.some((kw) => lower.includes(kw.toLowerCase()));
      }
      return true;
    }

    case 'npc_chat_opened': {
      const e = event as typeof trigger;
      return trigger.npcId === e.npcId;
    }

    case 'browser_page_visited': {
      const e = event as typeof trigger;
      return trigger.pageId === e.pageId;
    }

    case 'browser_action': {
      const e = event as typeof trigger;
      return trigger.pageId === e.pageId && trigger.actionId === e.actionId;
    }

    case 'task_completed': {
      const e = event as typeof trigger;
      return trigger.taskId === e.taskId;
    }

    case 'storyline_completed': {
      const e = event as typeof trigger;
      return trigger.storylineId === e.storylineId;
    }

    default:
      return false;
  }
}

function predecessorStepIds(graph: StorylineGraph, stepId: string): Set<string> {
  const acc = new Set<string>();
  const start = graph.nodes[stepId];
  if (start?.type !== 'step') return acc;
  const stack = [...(start.triggeredBy ?? [])];
  while (stack.length) {
    const id = stack.pop()!;
    const n = graph.nodes[id];
    if (n?.type === 'step' && id !== stepId) {
      if (!acc.has(id)) {
        acc.add(id);
        stack.push(...(n.triggeredBy ?? []));
      }
    }
  }
  return acc;
}

function evaluateCondition(_graph: StorylineGraph, condition: Condition): boolean {
  const state = useGameStore.getState();

  switch (condition.type) {
    case 'storyline_status': {
      const runtime = state.storylines[condition.storylineId];
      return runtime?.status === condition.status;
    }

    case 'storyline_at_step': {
      const g = getGraph(condition.storylineId);
      if (!g) return false;
      const rt = state.storylines[condition.storylineId];
      if (!rt || rt.firedStepIds.includes(condition.stepId)) return false;
      const preds = predecessorStepIds(g, condition.stepId);
      return [...preds].every((p) => rt.firedStepIds.includes(p));
    }

    case 'task_status':
      return state.tasks[condition.taskId] === condition.status;

    case 'npc_unlocked':
      return state.unlockedNpcs.includes(condition.npcId);
  }
}

function conditionNodePasses(graph: StorylineGraph, conditionNodeId: string): boolean {
  const n = graph.nodes[conditionNodeId];
  if (!n || n.type !== 'condition') return false;
  return evaluateCondition(graph, n.condition);
}

function triggeredByIdSatisfied(
  graph: StorylineGraph,
  depId: string,
  rt: StorylineRuntime,
): boolean {
  const node = graph.nodes[depId];
  if (!node) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[engine] missing triggeredBy node "${depId}"`);
    }
    return false;
  }
  if (isEventBlockNode(node)) return rt.satisfiedEventIds.includes(depId);
  if (node.type === 'step') return rt.firedStepIds.includes(depId);
  if (node.type === 'task') {
    return useGameStore.getState().tasks[node.task.id] === 'completed';
  }
  return false;
}

function stepCanFire(graph: StorylineGraph, stepId: string, rt: StorylineRuntime): boolean {
  if (rt.firedStepIds.includes(stepId)) return false;
  const node = graph.nodes[stepId];
  if (!node || node.type !== 'step') return false;
  const tb = node.triggeredBy ?? [];
  if (tb.length === 0) return true;
  if (!tb.every((id) => triggeredByIdSatisfied(graph, id, rt))) return false;
  const conds = node.conditions ?? [];
  return conds.every((cid) => conditionNodePasses(graph, cid));
}

function nodeToSideEffects(
  graph: StorylineGraph,
  storylineId: string,
  nodeId: string,
  field:
    | 'createTask'
    | 'completeTask'
    | 'unlockContext'
    | 'unlock_npc'
    | 'grantMemo'
    | 'notify'
    | 'sendMessage'
    | 'setPage'
    | 'updatePageState'
    | 'activateStoryline',
): SideEffect[] {
  const n = graph.nodes[nodeId];
  if (!n) return [];

  switch (field) {
    case 'createTask': {
      if (n.type !== 'task') return [];
      const t = n.task;
      return [
        {
          type: 'create_task',
          task: { ...t, storylineId },
        },
      ];
    }
    case 'completeTask': {
      if (n.type !== 'task') return [];
      return [{ type: 'complete_task', taskId: n.task.id }];
    }
    case 'unlockContext': {
      if (n.type !== 'context') return [];
      return [{ type: 'update_npc_context', npcId: n.npcId, contextKey: n.contextKey }];
    }
    case 'unlock_npc': {
      if (n.type !== 'unlock_npc') return [];
      return [{ type: 'unlock_npc', npcId: n.npcId }];
    }
    case 'grantMemo': {
      if (n.type !== 'memo') return [];
      return [{ type: 'grant_memo', memo: n.memo }];
    }
    case 'notify': {
      if (n.type !== 'notification') return [];
      return [{ type: 'show_notification', app: n.app, title: n.title, body: n.body }];
    }
    case 'sendMessage': {
      if (n.type !== 'npc_message') return [];
      return [{ type: 'send_npc_message', npcId: n.npcId, content: n.content }];
    }
    case 'setPage': {
      if (n.type !== 'browser_state' || n.mode !== 'set') return [];
      return [{ type: 'set_browser_page', pageId: n.pageId }];
    }
    case 'updatePageState': {
      if (n.type !== 'browser_state' || n.mode !== 'update') return [];
      return [
        {
          type: 'update_browser_page_state',
          pageId: n.pageId,
          state: n.state ?? {},
        },
      ];
    }
    case 'activateStoryline': {
      if (n.type !== 'storyline_ref') return [];
      return [{ type: 'activate_storyline', storylineId: n.storylineId }];
    }
    default:
      return [];
  }
}

function fireStep(graph: StorylineGraph, stepId: string, syntheticQueue: GameEvent[]): void {
  const state = useGameStore.getState();
  const storylineId = graph.id;
  const node = graph.nodes[stepId];
  if (!node || node.type !== 'step') return;

  const runIds = (ids: string[] | undefined, field: Parameters<typeof nodeToSideEffects>[3]) => {
    for (const id of ids ?? []) {
      for (const eff of nodeToSideEffects(graph, storylineId, id, field)) {
        executeSideEffect(eff);
        if (eff.type === 'complete_task') {
          syntheticQueue.push({ type: 'task_completed', taskId: eff.taskId });
        }
      }
    }
  };

  runIds(node.createTask, 'createTask');
  runIds(node.completeTask, 'completeTask');
  runIds(node.unlockContext, 'unlockContext');
  runIds(node.unlock_npc, 'unlock_npc');
  runIds(node.grantMemo, 'grantMemo');
  runIds(node.notify, 'notify');
  runIds(node.sendMessage, 'sendMessage');
  runIds(node.setPage, 'setPage');
  runIds(node.updatePageState, 'updatePageState');
  runIds(node.activateStoryline, 'activateStoryline');

  state.addFiredStep(storylineId, stepId);

  // Same GameEvent can occur twice (two logins). Clear satisfaction so the next match re-fires.
  if (storylineId === 'ebankingLoginBug') {
    if (stepId === 'got-error') {
      state.removeSatisfiedEventId(storylineId, 'evt-login-submit');
    }
    if (stepId === 'verified-fix') {
      state.removeSatisfiedEventId(storylineId, 'evt-login-submit');
    }
  }
}

function matchEvents(graph: StorylineGraph, event: GameEvent): void {
  const state = useGameStore.getState();
  const rt = state.storylines[graph.id];
  if (!rt || rt.status !== 'active') return;

  for (const [nodeId, node] of Object.entries(graph.nodes)) {
    if (!isEventBlockNode(node)) continue;
    if (rt.satisfiedEventIds.includes(nodeId)) continue;
    if (triggerMatches(eventBlockNodeToTrigger(node), event)) {
      state.addSatisfiedEventId(graph.id, nodeId);
    }
  }
}

function allTaskNodesCompleted(graph: StorylineGraph): boolean {
  const state = useGameStore.getState();
  const taskIds: string[] = [];
  for (const node of Object.values(graph.nodes)) {
    if (node.type === 'task') taskIds.push(node.task.id);
  }
  if (taskIds.length === 0) return false;
  return taskIds.every((id) => state.tasks[id] === 'completed');
}

function allStepNodesFired(graph: StorylineGraph, rt: StorylineRuntime): boolean {
  for (const [id, node] of Object.entries(graph.nodes)) {
    if (node.type === 'step' && !rt.firedStepIds.includes(id)) return false;
  }
  return true;
}

function maybeCompleteStoryline(graph: StorylineGraph): void {
  const state = useGameStore.getState();
  const rt = state.storylines[graph.id];
  if (!rt || rt.status !== 'active') return;
  if (allTaskNodesCompleted(graph) && allStepNodesFired(graph, rt)) {
    state.completeStoryline(graph.id);
  }
}

function consumeEvents(initial: GameEvent[]): void {
  const queue = [...initial];
  while (queue.length > 0) {
    const ev = queue.shift()!;
    for (const graph of allStorylines) {
      matchEvents(graph, ev);
    }

    let firedOne = true;
    while (firedOne) {
      firedOne = false;
      for (const graph of allStorylines) {
        const rt = useGameStore.getState().storylines[graph.id];
        if (!rt || rt.status !== 'active') continue;
        for (const nodeId of Object.keys(graph.nodes)) {
          if (graph.nodes[nodeId]?.type !== 'step') continue;
          if (!stepCanFire(graph, nodeId, rt)) continue;
          fireStep(graph, nodeId, queue);
          firedOne = true;
          break;
        }
        if (firedOne) break;
      }
    }

    for (const graph of allStorylines) {
      maybeCompleteStoryline(graph);
    }
  }
}

/** Satisfy every `manual` Event node in active storylines (bootstrap). */
function satisfyManualEventNodes(): void {
  const state = useGameStore.getState();
  for (const graph of allStorylines) {
    const rt = state.storylines[graph.id];
    if (!rt || rt.status !== 'active') continue;
    for (const [nodeId, node] of Object.entries(graph.nodes)) {
      if (node.type === 'evt_manual') {
        state.addSatisfiedEventId(graph.id, nodeId);
      }
    }
  }
}

export function evaluate(event: GameEvent): void {
  consumeEvents([event]);
}

export function initializeEngine(): void {
  const ids = new Set(allStorylines.map((g) => g.id));
  for (const graph of allStorylines) {
    const errs = validateGraph(graph, ids);
    if (errs.length && process.env.NODE_ENV !== 'production') {
      console.warn(`[engine] storyline "${graph.id}" validation:`, errs);
    }
  }

  const state = useGameStore.getState();

  for (const graph of allStorylines) {
    if (!state.storylines[graph.id]) {
      const status = graph.id === 'gameStart' ? 'active' : (graph.initialStatus ?? 'locked');
      state.initStoryline(graph.id, status);
    }
  }

  satisfyManualEventNodes();
  consumeEvents([{ type: 'game_start' }]);
}

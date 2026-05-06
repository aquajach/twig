import type { EventBlockNode, GraphNode, Trigger } from '@/engine/types';

export const EVENT_BLOCK_NODE_TYPES = [
  'evt_game_start',
  'evt_manual',
  'evt_chat_message_sent',
  'evt_chat_message_received',
  'evt_intent_sent',
  'evt_intent_received',
  'evt_npc_chat_opened',
  'evt_browser_page_visited',
  'evt_browser_action',
  'evt_task_completed',
  'evt_storyline_completed',
] as const;

export type EventBlockNodeType = (typeof EVENT_BLOCK_NODE_TYPES)[number];

export function isEventBlockNodeType(t: string | undefined): t is EventBlockNodeType {
  return EVENT_BLOCK_NODE_TYPES.some((x) => x === t);
}

export function isEventBlockNode(node: GraphNode): node is EventBlockNode {
  return isEventBlockNodeType(node.type);
}

export function eventBlockNodeToTrigger(node: EventBlockNode, nodeId?: string): Trigger {
  switch (node.type) {
    case 'evt_game_start':
      return { type: 'game_start' };
    case 'evt_manual':
      return { type: 'manual' };
    case 'evt_chat_message_sent':
      return {
        type: 'chat_message_sent',
        npcId: node.npcId,
        ...(node.keywords?.length ? { keywords: node.keywords } : {}),
      };
    case 'evt_chat_message_received':
      return {
        type: 'chat_message_received',
        npcId: node.npcId,
        ...(node.keywords?.length ? { keywords: node.keywords } : {}),
      };
    case 'evt_intent_sent':
      if (!nodeId) throw new Error('eventBlockNodeToTrigger: nodeId is required for evt_intent_sent');
      return {
        type: 'intent_sent',
        npcId: node.npcId,
        statementId: nodeId,
      };
    case 'evt_intent_received':
      if (!nodeId) throw new Error('eventBlockNodeToTrigger: nodeId is required for evt_intent_received');
      return {
        type: 'intent_received',
        npcId: node.npcId,
        statementId: nodeId,
      };
    case 'evt_npc_chat_opened':
      return { type: 'npc_chat_opened', npcId: node.npcId };
    case 'evt_browser_page_visited':
      return { type: 'browser_page_visited', pageId: node.pageId };
    case 'evt_browser_action':
      return { type: 'browser_action', pageId: node.pageId, actionId: node.actionId };
    case 'evt_task_completed':
      return { type: 'task_completed', taskId: node.taskId };
    case 'evt_storyline_completed':
      return { type: 'storyline_completed', storylineId: node.storylineId };
    default: {
      const _x: never = node;
      return _x;
    }
  }
}

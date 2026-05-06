import { npcSegments } from '@/data/npcSegments';
import { npcs } from '@/data/npcs';
import { eventBlockNodeToTrigger, isEventBlockNode, isEventBlockNodeType } from '@/engine/event-blocks';
import type {
  BrowserStateNode,
  Condition,
  GraphNode,
  StepNode,
  StorylineGraph,
  Trigger,
  ValidationError,
} from '@/engine/types';

const STEP_CONNECTOR_FIELDS = [
  'triggeredBy',
  'conditions',
  'createTask',
  'completeTask',
  'unlockContext',
  'unlock_npc',
  'grantMemo',
  'notify',
  'sendMessage',
  'setPage',
  'updatePageState',
  'activateStoryline',
] as const;

type StepConnectorField = (typeof STEP_CONNECTOR_FIELDS)[number];

function stepConnectorIds(node: StepNode, field: StepConnectorField): string[] | undefined {
  switch (field) {
    case 'triggeredBy':
      return node.triggeredBy;
    case 'conditions':
      return node.conditions;
    case 'createTask':
      return node.createTask;
    case 'completeTask':
      return node.completeTask;
    case 'unlockContext':
      return node.unlockContext;
    case 'unlock_npc':
      return node.unlock_npc;
    case 'grantMemo':
      return node.grantMemo;
    case 'notify':
      return node.notify;
    case 'sendMessage':
      return node.sendMessage;
    case 'setPage':
      return node.setPage;
    case 'updatePageState':
      return node.updatePageState;
    case 'activateStoryline':
      return node.activateStoryline;
    default: {
      const _exhaustive: never = field;
      return _exhaustive;
    }
  }
}

function allowedTriggeredByTarget(t: string | undefined): boolean {
  return t === 'step' || t === 'task' || isEventBlockNodeType(t);
}

function allowedConditionTarget(t: string | undefined): boolean {
  return t === 'condition';
}

function allowedEventEnabledByTarget(t: string | undefined): boolean {
  return t === 'step' || t === 'task' || isEventBlockNodeType(t);
}

function allowedRefTarget(field: (typeof STEP_CONNECTOR_FIELDS)[number], t: string | undefined): boolean {
  switch (field) {
    case 'createTask':
    case 'completeTask':
      return t === 'task';
    case 'unlockContext':
      return t === 'context';
    case 'unlock_npc':
      return t === 'unlock_npc';
    case 'grantMemo':
      return t === 'memo';
    case 'notify':
      return t === 'notification';
    case 'sendMessage':
      return t === 'npc_message';
    case 'setPage':
    case 'updatePageState':
      return t === 'browser_state';
    case 'activateStoryline':
      return t === 'storyline_ref';
    default:
      return false;
  }
}

function validateTriggerShape(trigger: Trigger, path: string, errors: ValidationError[]): void {
  switch (trigger.type) {
    case 'game_start':
    case 'manual':
      return;
    case 'chat_message_sent':
    case 'chat_message_received':
      if (!trigger.npcId) errors.push({ severity: 'error', field: path, message: 'missing npcId' });
      return;
    case 'intent_sent':
    case 'intent_received':
      if (!trigger.npcId) errors.push({ severity: 'error', field: path, message: 'missing npcId' });
      if (!trigger.statementId) errors.push({ severity: 'error', field: path, message: 'missing statementId' });
      return;
    case 'npc_chat_opened':
      if (!trigger.npcId) errors.push({ severity: 'error', field: path, message: 'missing npcId' });
      return;
    case 'browser_page_visited':
      if (!trigger.pageId) errors.push({ severity: 'error', field: path, message: 'missing pageId' });
      return;
    case 'browser_action':
      if (!trigger.pageId || !trigger.actionId) {
        errors.push({ severity: 'error', field: path, message: 'browser_action needs pageId and actionId' });
      }
      return;
    case 'task_completed':
      if (!trigger.taskId) errors.push({ severity: 'error', field: path, message: 'missing taskId' });
      return;
    case 'storyline_completed':
      if (!trigger.storylineId) {
        errors.push({ severity: 'error', field: path, message: 'missing storylineId' });
      }
      return;
  }
}

function validateConditionShape(condition: Condition, path: string, errors: ValidationError[]): void {
  switch (condition.type) {
    case 'storyline_status':
      if (!condition.storylineId) errors.push({ severity: 'error', field: path, message: 'missing storylineId' });
      return;
    case 'storyline_at_step':
      if (!condition.storylineId || !condition.stepId) {
        errors.push({ severity: 'error', field: path, message: 'missing storylineId or stepId' });
      }
      return;
    case 'task_status':
      if (!condition.taskId) errors.push({ severity: 'error', field: path, message: 'missing taskId' });
      return;
    case 'npc_unlocked':
      if (!condition.npcId) errors.push({ severity: 'error', field: path, message: 'missing npcId' });
      return;
  }
}

function validateNodeSchema(id: string, node: GraphNode, errors: ValidationError[]): void {
  if (isEventBlockNode(node)) {
    validateTriggerShape(eventBlockNodeToTrigger(node, id), `${id}`, errors);
    return;
  }
  switch (node.type) {
    case 'step':
      return;
    case 'condition':
      validateConditionShape(node.condition, `${id}.condition`, errors);
      return;
    case 'task':
      if (!node.task?.id || !node.task.title) {
        errors.push({ severity: 'error', nodeId: id, message: 'task node needs task.id and task.title' });
      }
      return;
    case 'context':
      if (!node.npcId || !node.contextKey) {
        errors.push({ severity: 'error', nodeId: id, message: 'context needs npcId and contextKey' });
      }
      return;
    case 'memo':
      if (!node.memo?.id || !node.memo.title) {
        errors.push({ severity: 'error', nodeId: id, message: 'memo node needs memo.id and memo.title' });
      }
      return;
    case 'notification':
      if (!node.app || !node.title) {
        errors.push({ severity: 'error', nodeId: id, message: 'notification needs app and title' });
      }
      return;
    case 'npc_message':
      if (!node.npcId || !node.content) {
        errors.push({ severity: 'error', nodeId: id, message: 'npc_message needs npcId and content' });
      }
      return;
    case 'browser_state':
      if (!node.pageId || (node.mode !== 'set' && node.mode !== 'update')) {
        errors.push({ severity: 'error', nodeId: id, message: 'browser_state needs pageId and mode' });
      }
      return;
    case 'storyline_ref':
      if (!node.storylineId) {
        errors.push({ severity: 'error', nodeId: id, message: 'storyline_ref needs storylineId' });
      }
      return;
    case 'unlock_npc':
      if (!node.npcId) {
        errors.push({ severity: 'error', nodeId: id, message: 'unlock_npc needs npcId' });
      }
      return;
  }
}

function collectNpcIdsFromTrigger(trigger: Trigger): string[] {
  switch (trigger.type) {
    case 'chat_message_sent':
    case 'chat_message_received':
    case 'intent_sent':
    case 'intent_received':
    case 'npc_chat_opened':
      return [trigger.npcId];
    default:
      return [];
  }
}

function collectNpcIdsFromCondition(condition: Condition): string[] {
  switch (condition.type) {
    case 'npc_unlocked':
      return [condition.npcId];
    default:
      return [];
  }
}

function validateNpcReferences(
  graph: StorylineGraph,
  errors: ValidationError[],
  segmentMaps: Record<string, Record<string, string>>,
): void {
  const known = new Set(Object.keys(npcs));
  for (const [id, node] of Object.entries(graph.nodes)) {
    if (node.type === 'context' || node.type === 'npc_message' || node.type === 'unlock_npc') {
      if (!known.has(node.npcId)) {
        errors.push({ severity: 'error', nodeId: id, message: `unknown npcId "${node.npcId}"` });
      }
    }
    if (node.type === 'context' && known.has(node.npcId)) {
      const segs = segmentMaps[node.npcId];
      if (segs && !(node.contextKey in segs)) {
        errors.push({
          severity: 'error',
          nodeId: id,
          message: `unknown contextKey "${node.contextKey}" for npc "${node.npcId}"`,
        });
      }
    }
    if (isEventBlockNode(node)) {
      for (const npcId of collectNpcIdsFromTrigger(eventBlockNodeToTrigger(node, id))) {
        if (!known.has(npcId)) {
          errors.push({ severity: 'error', nodeId: id, message: `unknown npcId in trigger "${npcId}"` });
        }
      }
    }
    if (node.type === 'condition') {
      for (const npcId of collectNpcIdsFromCondition(node.condition)) {
        if (!known.has(npcId)) {
          errors.push({ severity: 'error', nodeId: id, message: `unknown npcId in condition "${npcId}"` });
        }
      }
    }
  }
}

function validateReferenceMatrix(graph: StorylineGraph, errors: ValidationError[]): void {
  const nodes = graph.nodes;
  for (const [eventId, node] of Object.entries(nodes)) {
    if (!isEventBlockNode(node)) continue;
    for (const ref of node.enabledBy ?? []) {
      const t = nodes[ref]?.type;
      if (!allowedEventEnabledByTarget(t)) {
        errors.push({
          severity: 'error',
          nodeId: eventId,
          field: 'enabledBy',
          message: `invalid enabledBy ref "${ref}" (type ${t})`,
        });
      }
    }
    for (const ref of node.enabledConditions ?? []) {
      const t = nodes[ref]?.type;
      if (!allowedConditionTarget(t)) {
        errors.push({
          severity: 'error',
          nodeId: eventId,
          field: 'enabledConditions',
          message: `invalid enabledConditions ref "${ref}"`,
        });
      }
    }
  }
  for (const [stepId, node] of Object.entries(nodes)) {
    if (node.type !== 'step') continue;
    const tb = node.triggeredBy ?? [];
    for (const ref of tb) {
      const t = nodes[ref]?.type;
      if (!allowedTriggeredByTarget(t)) {
        errors.push({
          severity: 'error',
          nodeId: stepId,
          field: 'triggeredBy',
          message: `invalid triggeredBy ref "${ref}" (type ${t})`,
        });
      }
    }
    for (const ref of node.conditions ?? []) {
      const t = nodes[ref]?.type;
      if (!allowedConditionTarget(t)) {
        errors.push({
          severity: 'error',
          nodeId: stepId,
          field: 'conditions',
          message: `invalid conditions ref "${ref}"`,
        });
      }
    }
    for (const field of STEP_CONNECTOR_FIELDS) {
      if (field === 'triggeredBy' || field === 'conditions') continue;
      const ids = stepConnectorIds(node, field);
      if (!ids) continue;
      for (const ref of ids) {
        const t = nodes[ref]?.type;
        if (!allowedRefTarget(field, t)) {
          errors.push({
            severity: 'error',
            nodeId: stepId,
            field,
            message: `invalid ref "${ref}" for ${field} (type ${t})`,
          });
        }
        if ((field === 'setPage' || field === 'updatePageState') && nodes[ref]?.type === 'browser_state') {
          const bs = nodes[ref] as BrowserStateNode;
          if (field === 'setPage' && bs.mode !== 'set') {
            errors.push({
              severity: 'error',
              nodeId: stepId,
              field,
              message: 'setPage requires browser_state mode "set"',
            });
          }
          if (field === 'updatePageState' && bs.mode !== 'update') {
            errors.push({
              severity: 'error',
              nodeId: stepId,
              field,
              message: 'updatePageState requires browser_state mode "update"',
            });
          }
        }
      }
    }
  }
}

function validateReferentialIntegrity(graph: StorylineGraph, errors: ValidationError[]): void {
  const nodes = graph.nodes;
  for (const [eventId, node] of Object.entries(nodes)) {
    if (!isEventBlockNode(node)) continue;
    const collect = (ids: string[] | undefined, field: string) => {
      for (const ref of ids ?? []) {
        if (!nodes[ref]) {
          errors.push({ severity: 'error', nodeId: eventId, field, message: `missing node "${ref}"` });
        }
      }
    };
    collect(node.enabledBy, 'enabledBy');
    collect(node.enabledConditions, 'enabledConditions');
  }
  for (const [stepId, node] of Object.entries(nodes)) {
    if (node.type !== 'step') continue;
    const collect = (ids: string[] | undefined, field: string) => {
      for (const ref of ids ?? []) {
        if (!nodes[ref]) {
          errors.push({ severity: 'error', nodeId: stepId, field, message: `missing node "${ref}"` });
        }
      }
    };
    collect(node.triggeredBy, 'triggeredBy');
    collect(node.conditions, 'conditions');
    for (const field of STEP_CONNECTOR_FIELDS) {
      if (field === 'triggeredBy' || field === 'conditions') continue;
      collect(stepConnectorIds(node, field), field);
    }
  }
}

function validateAcyclicity(graph: StorylineGraph, errors: ValidationError[]): void {
  const nodes = graph.nodes;
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const dfs = (stepId: string, stack: string[]): void => {
    if (visited.has(stepId)) return;
    if (visiting.has(stepId)) {
      errors.push({
        severity: 'error',
        nodeId: stepId,
        message: `trigger cycle: ${[...stack, stepId].join(' -> ')}`,
      });
      return;
    }
    visiting.add(stepId);
    const n = nodes[stepId];
    if (n?.type === 'step') {
      for (const dep of n.triggeredBy ?? []) {
        if (nodes[dep]?.type === 'step') dfs(dep, [...stack, stepId]);
      }
    }
    visiting.delete(stepId);
    visited.add(stepId);
  };

  for (const id of Object.keys(nodes)) {
    if (nodes[id]?.type === 'step') dfs(id, []);
  }
}

function validateRegistry(graph: StorylineGraph, allStorylineIds: Set<string>, errors: ValidationError[]): void {
  for (const [id, node] of Object.entries(graph.nodes)) {
    if (node.type === 'storyline_ref' && !allStorylineIds.has(node.storylineId)) {
      errors.push({
        severity: 'error',
        nodeId: id,
        message: `unknown storyline ref "${node.storylineId}"`,
      });
    }
  }
}

export function validateGraph(
  graph: StorylineGraph,
  allStorylineIds: Set<string>,
  options?: { segmentMaps?: Record<string, Record<string, string>> },
): ValidationError[] {
  const errors: ValidationError[] = [];
  const segmentMaps = options?.segmentMaps ?? (npcSegments as Record<string, Record<string, string>>);

  if (!graph.id || !graph.title) {
    errors.push({ severity: 'error', message: 'graph needs id and title' });
  }
  if (!graph.nodes || typeof graph.nodes !== 'object') {
    errors.push({ severity: 'error', message: 'graph.nodes required' });
    return errors;
  }

  for (const [id, node] of Object.entries(graph.nodes)) {
    validateNodeSchema(id, node, errors);
  }

  validateReferentialIntegrity(graph, errors);
  validateReferenceMatrix(graph, errors);
  validateNpcReferences(graph, errors, segmentMaps);
  validateAcyclicity(graph, errors);
  validateRegistry(graph, allStorylineIds, errors);

  return errors;
}

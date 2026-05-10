import type { Edge, Node } from '@xyflow/react';
import {
  EFFECT_NODE_TARGET_HANDLE,
  EVENT_ENABLED_TARGET_HANDLE,
  EVENT_GRAPH_ENABLE_FIELDS,
  isStepEffectSourceHandle,
  STEP_DEPS_TARGET_HANDLE,
  STEP_EFFECT_EDGE_PREFIX,
  STEP_EFFECTS_SOURCE_HANDLE,
  STEP_GRAPH_EFFECT_FIELDS,
  STEP_GRAPH_TRIGGER_FIELDS,
  type StepGraphEffectField,
  TASK_EFFECT_COMPLETE_HANDLE,
  TASK_EFFECT_CREATE_HANDLE,
} from '@/components/editor/step-link-fields';
import { BROWSER_PAGE_IDS, BROWSER_PAGE_LABELS } from '@/data/browserPages';
import { npcs } from '@/data/npcs';
import { EVENT_BLOCK_NODE_TYPES, isEventBlockNode } from '@/engine/event-blocks';
import type {
  AppId,
  BrowserStateNode,
  Condition,
  ContextNode,
  EventBlockNode,
  GraphNode,
  StepNode,
  StorylineGraph,
  StorylineStatus,
} from '@/engine/types';

const DEFAULT_CONDITION_JSON = JSON.stringify({ type: 'npc_unlocked', npcId: 'manager' } satisfies Condition);

export type ContextSegmentReference = { storylineId: string; nodeId: string };

export type StorylineEditorUiContextValue = {
  npcIds: { label: string; value: string }[];
  browserPageIds: { label: string; value: string }[];
  allStorylineIds: { label: string; value: string }[];
  contextSegments: Record<string, Record<string, string>>;
  contextReferences: Record<string, Record<string, ContextSegmentReference[]>>;
  refreshContextSegments: () => Promise<void>;
};

function pickStr(d: Record<string, unknown>, key: string, fallback = ''): string {
  const v = d[key];
  return typeof v === 'string' ? v : fallback;
}

function parseConditionJson(text: string): Condition {
  try {
    const o = JSON.parse(text) as Condition;
    if (o && typeof o === 'object' && 'type' in o) return o;
  } catch {
    // fall through
  }
  return { type: 'npc_unlocked', npcId: 'manager' };
}

function stringifyJson(value: unknown, fallback: string): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

function optionalKeywordsFromFlow(d: Record<string, unknown>): string[] | undefined {
  const raw = pickStr(d, 'keywordsText');
  const parts = raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function eventBlockGraphNodeToFlowData(node: EventBlockNode): Record<string, unknown> {
  switch (node.type) {
    case 'evt_game_start':
    case 'evt_manual':
      return {};
    case 'evt_chat_message_sent':
    case 'evt_chat_message_received':
      return {
        npcId: node.npcId,
        keywordsText: node.keywords?.length ? node.keywords.join(', ') : '',
      };
    case 'evt_intent_sent':
    case 'evt_intent_received':
      return {
        npcId: node.npcId,
        statementText: node.statementText,
      };
    case 'evt_npc_chat_opened':
      return { npcId: node.npcId };
    case 'evt_browser_page_visited':
      return { pageId: node.pageId };
    case 'evt_browser_action':
      return { pageId: node.pageId, actionId: node.actionId };
    case 'evt_task_completed':
      return { taskId: node.taskId };
    case 'evt_storyline_completed':
      return { storylineId: node.storylineId };
    default: {
      const _x: never = node;
      return _x;
    }
  }
}

function dedupeSortedSources(sources: string[]): string[] | undefined {
  const u = [...new Set(sources)].sort();
  return u.length ? u : undefined;
}

function collectLegacyNumberedLinkTargetsFromEdges(
  edges: Edge[],
  targetId: string,
  field: 'triggeredBy' | 'conditions' | 'enabledBy' | 'enabledConditions',
): string[] | undefined {
  const pairs = edges
    .filter((e) => e.target === targetId && e.targetHandle?.startsWith(`${field}_`))
    .map((e) => {
      const h = e.targetHandle ?? '';
      const idx = Number.parseInt(h.slice(field.length + 1), 10);
      return { idx, source: e.source };
    })
    .filter((x) => !Number.isNaN(x.idx))
    .sort((a, b) => a.idx - b.idx);
  if (!pairs.length) return undefined;
  const out: string[] = [];
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].idx !== i) break;
    out.push(pairs[i].source);
  }
  return out.length ? out : undefined;
}

function emptyEffectBuckets(): Record<StepGraphEffectField, string[]> {
  return {
    createTask: [],
    completeTask: [],
    unlockContext: [],
    unlock_npc: [],
    unlock_browser_page: [],
    grantMemo: [],
    notify: [],
    sendMessage: [],
    wetalkLink: [],
    setPage: [],
    updatePageState: [],
    activateStoryline: [],
  };
}

/** Infer step effect array field from inverted edge: step (source) → effect node (target). */
function inferEffectFieldFromInvertedEdge(
  tgtNode: Node,
  targetHandle: string | null | undefined,
): StepGraphEffectField | null {
  const t = tgtNode.type ?? '';
  const th = targetHandle ?? '';
  if (t === 'task') {
    if (th === TASK_EFFECT_COMPLETE_HANDLE) return 'completeTask';
    if (th === TASK_EFFECT_CREATE_HANDLE) return 'createTask';
    return null;
  }
  if (th && th !== EFFECT_NODE_TARGET_HANDLE) return null;
  const d = (tgtNode.data ?? {}) as Record<string, unknown>;
  switch (t) {
    case 'unlock_npc':
      return 'unlock_npc';
    case 'unlock_browser_page':
      return 'unlock_browser_page';
    case 'context':
      return 'unlockContext';
    case 'memo':
      return 'grantMemo';
    case 'notification':
      return 'notify';
    case 'npc_message':
      return 'sendMessage';
    case 'wetalk_link':
      return 'wetalkLink';
    case 'browser_state':
      return pickStr(d, 'mode', 'set') === 'update' ? 'updatePageState' : 'setPage';
    case 'storyline_ref':
      return 'activateStoryline';
    default:
      return null;
  }
}

function collectEffectEdgesFromStep(edges: Edge[], stepId: string): Edge[] {
  const legacy: { edge: Edge; idx: number }[] = [];
  const modern: Edge[] = [];
  const p = `${STEP_EFFECT_EDGE_PREFIX}_`;
  for (const e of edges) {
    if (e.source !== stepId || !e.sourceHandle) continue;
    if (!isStepEffectSourceHandle(e.sourceHandle)) continue;
    if (e.sourceHandle === STEP_EFFECTS_SOURCE_HANDLE) {
      modern.push(e);
      continue;
    }
    if (e.sourceHandle.startsWith(p)) {
      const idx = Number.parseInt(e.sourceHandle.slice(p.length), 10);
      if (!Number.isNaN(idx)) legacy.push({ edge: e, idx });
    }
  }
  legacy.sort((a, b) => a.idx - b.idx);
  modern.sort((a, b) => a.target.localeCompare(b.target));
  return [...legacy.map((x) => x.edge), ...modern];
}

function assignStepEffectFieldsFromEdges(target: StepNode, stepId: string, nodes: Node[], edges: Edge[]): void {
  const ordered = collectEffectEdgesFromStep(edges, stepId);
  const buckets = emptyEffectBuckets();
  for (const e of ordered) {
    const tgt = nodes.find((n) => n.id === e.target);
    if (!tgt) continue;
    const field = inferEffectFieldFromInvertedEdge(tgt, e.targetHandle);
    if (!field) continue;
    buckets[field].push(e.target);
  }
  for (const field of STEP_GRAPH_EFFECT_FIELDS) {
    const arr = buckets[field];
    if (!arr.length) continue;
    switch (field) {
      case 'createTask':
        target.createTask = arr;
        break;
      case 'completeTask':
        target.completeTask = arr;
        break;
      case 'unlockContext':
        target.unlockContext = arr;
        break;
      case 'unlock_npc':
        target.unlock_npc = arr;
        break;
      case 'unlock_browser_page':
        target.unlock_browser_page = arr;
        break;
      case 'grantMemo':
        target.grantMemo = arr;
        break;
      case 'notify':
        target.notify = arr;
        break;
      case 'sendMessage':
        target.sendMessage = arr;
        break;
      case 'wetalkLink':
        target.wetalkLink = arr;
        break;
      case 'setPage':
        target.setPage = arr;
        break;
      case 'updatePageState':
        target.updatePageState = arr;
        break;
      case 'activateStoryline':
        target.activateStoryline = arr;
        break;
    }
  }
}

function assignStepLinkFieldsFromEdges(target: StepNode, stepId: string, nodes: Node[], edges: Edge[]): void {
  const intoDepsPort = edges.filter(
    (e) =>
      e.target === stepId &&
      (e.targetHandle === STEP_DEPS_TARGET_HANDLE ||
        e.targetHandle === 'triggeredBy' ||
        e.targetHandle === 'conditions'),
  );
  if (intoDepsPort.length) {
    const tb: string[] = [];
    const cond: string[] = [];
    for (const e of intoDepsPort) {
      if (e.targetHandle === 'conditions') cond.push(e.source);
      else if (e.targetHandle === 'triggeredBy') tb.push(e.source);
      else {
        const src = nodes.find((n) => n.id === e.source);
        if (!src) continue;
        if (src.type === 'condition') cond.push(e.source);
        else tb.push(e.source);
      }
    }
    const tbu = dedupeSortedSources(tb);
    const cdu = dedupeSortedSources(cond);
    if (tbu) target.triggeredBy = tbu;
    if (cdu) target.conditions = cdu;
  } else {
    for (const field of STEP_GRAPH_TRIGGER_FIELDS) {
      const arr = collectLegacyNumberedLinkTargetsFromEdges(edges, stepId, field);
      if (!arr?.length) continue;
      if (field === 'triggeredBy') target.triggeredBy = arr;
      else target.conditions = arr;
    }
  }
  assignStepEffectFieldsFromEdges(target, stepId, nodes, edges);
}

function emptyEnableBuckets(): Record<(typeof EVENT_GRAPH_ENABLE_FIELDS)[number], string[]> {
  return {
    enabledBy: [],
    enabledConditions: [],
  };
}

function assignEventEnableFieldsFromEdges(target: EventBlockNode, eventId: string, nodes: Node[], edges: Edge[]): void {
  const intoEnabledPort = edges.filter(
    (e) =>
      e.target === eventId &&
      (e.targetHandle === EVENT_ENABLED_TARGET_HANDLE ||
        e.targetHandle === 'enabledBy' ||
        e.targetHandle === 'enabledConditions'),
  );
  if (intoEnabledPort.length) {
    const buckets = emptyEnableBuckets();
    for (const e of intoEnabledPort) {
      if (e.targetHandle === 'enabledConditions') buckets.enabledConditions.push(e.source);
      else if (e.targetHandle === 'enabledBy') buckets.enabledBy.push(e.source);
      else {
        const src = nodes.find((n) => n.id === e.source);
        if (!src) continue;
        if (src.type === 'condition') buckets.enabledConditions.push(e.source);
        else buckets.enabledBy.push(e.source);
      }
    }
    const enabledBy = dedupeSortedSources(buckets.enabledBy);
    const enabledConditions = dedupeSortedSources(buckets.enabledConditions);
    if (enabledBy) target.enabledBy = enabledBy;
    if (enabledConditions) target.enabledConditions = enabledConditions;
    return;
  }
  for (const field of EVENT_GRAPH_ENABLE_FIELDS) {
    const arr = collectLegacyNumberedLinkTargetsFromEdges(edges, eventId, field);
    if (!arr?.length) continue;
    if (field === 'enabledBy') target.enabledBy = arr;
    else target.enabledConditions = arr;
  }
}

export function buildStorylineEditorUiContext(
  allStorylineIdOptions: { label: string; value: string }[],
  bundle: {
    contextSegments: Record<string, Record<string, string>>;
    contextReferences: Record<string, Record<string, ContextSegmentReference[]>>;
  },
  refreshContextSegments: () => Promise<void>,
): StorylineEditorUiContextValue {
  return {
    npcIds: Object.values(npcs).map((n) => ({ label: `${n.name} (${n.id})`, value: n.id })),
    browserPageIds: BROWSER_PAGE_IDS.map((id) => ({
      label: `${BROWSER_PAGE_LABELS[id]} (${id})`,
      value: id,
    })),
    allStorylineIds: allStorylineIdOptions,
    contextSegments: bundle.contextSegments,
    contextReferences: bundle.contextReferences,
    refreshContextSegments,
  };
}

function graphNodeToFlowData(node: GraphNode): Record<string, unknown> {
  if (isEventBlockNode(node)) {
    return eventBlockGraphNodeToFlowData(node);
  }
  switch (node.type) {
    case 'step':
      return {
        description: node.description ?? '',
      };
    case 'condition':
      return { conditionJson: stringifyJson(node.condition, DEFAULT_CONDITION_JSON) };
    case 'task':
      return {
        title: node.task.title,
        description: node.task.description,
      };
    case 'context':
      return { npcId: node.npcId, contextKey: node.contextKey };
    case 'memo':
      return {
        memoTitle: node.memo.title,
        memoDescription: node.memo.description,
        memoIcon: node.memo.icon ?? '',
      };
    case 'notification':
      return { app: node.app, title: node.title, body: node.body ?? '' };
    case 'npc_message':
      return { npcId: node.npcId, content: node.content };
    case 'wetalk_link':
      return { npcId: node.npcId, linkLabel: node.linkLabel, pageId: node.pageId };
    case 'browser_state':
      return {
        pageId: node.pageId,
        mode: node.mode,
        stateJson: node.state ? stringifyJson(node.state, '{}') : '{}',
      };
    case 'storyline_ref':
      return { storylineId: node.storylineId };
    case 'unlock_npc':
      return { npcId: node.npcId };
    case 'unlock_browser_page':
      return { pageId: node.pageId };
    default:
      return {};
  }
}

function buildEdgesFromGraph(graph: StorylineGraph): Edge[] {
  const edges: Edge[] = [];
  for (const [nodeId, node] of Object.entries(graph.nodes)) {
    if (node.type === 'step') {
      for (const field of STEP_GRAPH_TRIGGER_FIELDS) {
        const refs = node[field];
        if (!Array.isArray(refs)) continue;
        refs.forEach((refId, i) => {
          edges.push({
            id: `e-${nodeId}-${field}-${i}-${refId}`,
            source: refId,
            target: nodeId,
            sourceHandle: 'out',
            targetHandle: STEP_DEPS_TARGET_HANDLE,
          });
        });
      }
    }
    if (isEventBlockNode(node)) {
      for (const field of EVENT_GRAPH_ENABLE_FIELDS) {
        const refs = node[field];
        if (!Array.isArray(refs)) continue;
        refs.forEach((refId, i) => {
          edges.push({
            id: `e-${nodeId}-${field}-${i}-${refId}`,
            source: refId,
            target: nodeId,
            sourceHandle: 'out',
            targetHandle: EVENT_ENABLED_TARGET_HANDLE,
          });
        });
      }
    }
    if (node.type !== 'step') continue;
    const stepId = nodeId;
    const stepNode = node;
    for (const field of STEP_GRAPH_EFFECT_FIELDS) {
      const refs = stepNode[field];
      if (!Array.isArray(refs)) continue;
      for (const refId of refs) {
        const refGn = graph.nodes[refId];
        const edge: Edge = {
          id: `e-${stepId}-effect-${field}-${refId}`,
          source: stepId,
          target: refId,
          sourceHandle: STEP_EFFECTS_SOURCE_HANDLE,
        };
        // Tasks have two target handles (create / complete); other effect nodes use a single target
        // handle with no id — omit targetHandle so React Flow matches the first target (see getHandle in @xyflow/system).
        if (refGn?.type === 'task') {
          edge.targetHandle = field === 'completeTask' ? TASK_EFFECT_COMPLETE_HANDLE : TASK_EFFECT_CREATE_HANDLE;
        }
        edges.push(edge);
      }
    }
  }
  return edges;
}

export function graphToFlowElements(graph: StorylineGraph): { nodes: Node[]; edges: Edge[] } {
  const rawNodes: Node[] = Object.entries(graph.nodes).map(([id, gn]) => {
    const layout = gn.layout ?? { x: 40, y: 40 };
    return {
      id,
      type: gn.type,
      position: { x: layout.x, y: layout.y },
      data: graphNodeToFlowData(gn),
    };
  });
  const nodes = rawNodes;
  const edges = buildEdgesFromGraph(graph);
  return { nodes, edges };
}

export function flowNodeToGraphNode(node: Node, nodes: Node[], edges: Edge[]): GraphNode {
  const d = (node.data ?? {}) as Record<string, unknown>;
  const id = node.id;
  const type = node.type ?? 'step';

  switch (type) {
    case 'step': {
      const s: StepNode = {
        type: 'step',
        description: pickStr(d, 'description') || undefined,
      };
      assignStepLinkFieldsFromEdges(s, id, nodes, edges);
      return s;
    }
    case 'evt_game_start': {
      const n: EventBlockNode = { type: 'evt_game_start' };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_manual': {
      const n: EventBlockNode = { type: 'evt_manual' };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_chat_message_sent': {
      const kw = optionalKeywordsFromFlow(d);
      const n: EventBlockNode = {
        type: 'evt_chat_message_sent',
        npcId: pickStr(d, 'npcId'),
        ...(kw ? { keywords: kw } : {}),
      };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_chat_message_received': {
      const kw = optionalKeywordsFromFlow(d);
      const n: EventBlockNode = {
        type: 'evt_chat_message_received',
        npcId: pickStr(d, 'npcId'),
        ...(kw ? { keywords: kw } : {}),
      };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_intent_sent': {
      const n: EventBlockNode = {
        type: 'evt_intent_sent',
        npcId: pickStr(d, 'npcId'),
        statementText: pickStr(d, 'statementText'),
      };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_intent_received': {
      const n: EventBlockNode = {
        type: 'evt_intent_received',
        npcId: pickStr(d, 'npcId'),
        statementText: pickStr(d, 'statementText'),
      };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_npc_chat_opened': {
      const n: EventBlockNode = { type: 'evt_npc_chat_opened', npcId: pickStr(d, 'npcId') };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_browser_page_visited': {
      const n: EventBlockNode = { type: 'evt_browser_page_visited', pageId: pickStr(d, 'pageId') };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_browser_action': {
      const n: EventBlockNode = {
        type: 'evt_browser_action',
        pageId: pickStr(d, 'pageId'),
        actionId: pickStr(d, 'actionId'),
      };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_task_completed': {
      const n: EventBlockNode = { type: 'evt_task_completed', taskId: pickStr(d, 'taskId') };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'evt_storyline_completed': {
      const n: EventBlockNode = { type: 'evt_storyline_completed', storylineId: pickStr(d, 'storylineId') };
      assignEventEnableFieldsFromEdges(n, id, nodes, edges);
      return n;
    }
    case 'condition':
      return {
        type: 'condition',
        condition: parseConditionJson(pickStr(d, 'conditionJson', DEFAULT_CONDITION_JSON)),
      };
    case 'task':
      return {
        type: 'task',
        task: {
          id,
          title: pickStr(d, 'title', id),
          description: pickStr(d, 'description', ''),
        },
      };
    case 'context':
      return {
        type: 'context',
        npcId: pickStr(d, 'npcId'),
        contextKey: pickStr(d, 'contextKey'),
      } as ContextNode;
    case 'memo':
      return {
        type: 'memo',
        memo: {
          id,
          title: pickStr(d, 'memoTitle', id),
          description: pickStr(d, 'memoDescription', ''),
          icon: pickStr(d, 'memoIcon') || undefined,
        },
      };
    case 'notification':
      return {
        type: 'notification',
        app: pickStr(d, 'app', 'wetalk') as AppId,
        title: pickStr(d, 'title', ''),
        body: pickStr(d, 'body') || undefined,
      };
    case 'npc_message':
      return { type: 'npc_message', npcId: pickStr(d, 'npcId'), content: pickStr(d, 'content') };
    case 'wetalk_link':
      return {
        type: 'wetalk_link',
        npcId: pickStr(d, 'npcId'),
        linkLabel: pickStr(d, 'linkLabel'),
        pageId: pickStr(d, 'pageId'),
      };
    case 'browser_state': {
      let state: Record<string, unknown> | undefined;
      try {
        const parsed = JSON.parse(pickStr(d, 'stateJson', '{}')) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          state = parsed as Record<string, unknown>;
        }
      } catch {
        state = undefined;
      }
      const mode = pickStr(d, 'mode', 'set') === 'update' ? 'update' : 'set';
      const n: BrowserStateNode = {
        type: 'browser_state',
        pageId: pickStr(d, 'pageId'),
        mode,
      };
      if (state && Object.keys(state).length) n.state = state;
      return n;
    }
    case 'storyline_ref':
      return { type: 'storyline_ref', storylineId: pickStr(d, 'storylineId') };
    case 'unlock_npc':
      return { type: 'unlock_npc', npcId: pickStr(d, 'npcId') };
    case 'unlock_browser_page':
      return { type: 'unlock_browser_page', pageId: pickStr(d, 'pageId') };
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

export type StorylineGraphMeta = {
  id: string;
  title: string;
  initialStatus?: StorylineStatus;
  introCard?: { label: string };
};

export function flowElementsToStorylineGraph(nodes: Node[], edges: Edge[], meta: StorylineGraphMeta): StorylineGraph {
  const graphNodes: Record<string, GraphNode> = {};
  for (const n of nodes) {
    const gn = flowNodeToGraphNode(n, nodes, edges);
    graphNodes[n.id] = {
      ...gn,
      layout: { x: n.position.x, y: n.position.y },
    };
  }
  const graph: StorylineGraph = {
    id: meta.id,
    title: meta.title,
    nodes: graphNodes,
  };
  if (meta.initialStatus) graph.initialStatus = meta.initialStatus;
  if (meta.introCard?.label) graph.introCard = { label: meta.introCard.label };
  return graph;
}

const ADDABLE_TYPES = [
  'step',
  ...EVENT_BLOCK_NODE_TYPES,
  'condition',
  'task',
  'unlock_npc',
  'unlock_browser_page',
  'context',
  'memo',
  'notification',
  'npc_message',
  'wetalk_link',
  'browser_state',
  'storyline_ref',
] as const;

export type AddableStorylineNodeType = (typeof ADDABLE_TYPES)[number];

export function defaultDataForNodeType(type: AddableStorylineNodeType): Record<string, unknown> {
  switch (type) {
    case 'step':
      return { description: '' };
    case 'evt_game_start':
    case 'evt_manual':
      return {};
    case 'evt_chat_message_sent':
    case 'evt_chat_message_received':
      return { npcId: '', keywordsText: '' };
    case 'evt_intent_sent':
    case 'evt_intent_received':
      return { npcId: '', statementText: '' };
    case 'evt_npc_chat_opened':
      return { npcId: '' };
    case 'evt_browser_page_visited':
      return { pageId: '' };
    case 'evt_browser_action':
      return { pageId: '', actionId: '' };
    case 'evt_task_completed':
      return { taskId: '' };
    case 'evt_storyline_completed':
      return { storylineId: '' };
    case 'condition':
      return { conditionJson: DEFAULT_CONDITION_JSON };
    case 'task':
      return { title: 'Task', description: '' };
    case 'unlock_npc':
      return { npcId: '' };
    case 'unlock_browser_page':
      return { pageId: '' };
    case 'context':
      return { npcId: '', contextKey: '' };
    case 'memo':
      return { memoTitle: 'Memo', memoDescription: '', memoIcon: '' };
    case 'notification':
      return { app: 'wetalk', title: '', body: '' };
    case 'npc_message':
      return { npcId: '', content: '' };
    case 'wetalk_link':
      return { npcId: '', linkLabel: '', pageId: '' };
    case 'browser_state':
      return { pageId: '', mode: 'set', stateJson: '{}' };
    case 'storyline_ref':
      return { storylineId: '' };
  }
}

export { ADDABLE_TYPES };

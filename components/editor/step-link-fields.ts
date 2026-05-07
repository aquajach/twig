/** Step fields on disk for triggers vs conditions; the editor uses one left port and splits by source node type. */
export const STEP_GRAPH_TRIGGER_FIELDS = ['triggeredBy', 'conditions'] as const;
export const EVENT_GRAPH_ENABLE_FIELDS = ['enabledBy', 'enabledConditions'] as const;

/** Single left target on the step for all trigger + condition wires (`out` from deps → here). */
export const STEP_DEPS_TARGET_HANDLE = 'stepDeps';

/** Step effect arrays on disk; the editor uses one right source handle `stepEffects` → effect nodes (multiple edges). */
export const STEP_GRAPH_EFFECT_FIELDS = [
  'createTask',
  'completeTask',
  'unlockContext',
  'unlock_npc',
  'grantMemo',
  'notify',
  'sendMessage',
  'wetalkLink',
  'setPage',
  'updatePageState',
  'activateStoryline',
] as const;

export const STEP_GRAPH_LINK_FIELDS = [...STEP_GRAPH_TRIGGER_FIELDS, ...STEP_GRAPH_EFFECT_FIELDS] as const;

export type StepGraphTriggerField = (typeof STEP_GRAPH_TRIGGER_FIELDS)[number];
export type StepGraphEffectField = (typeof STEP_GRAPH_EFFECT_FIELDS)[number];
export type StepGraphLinkField = (typeof STEP_GRAPH_LINK_FIELDS)[number];
export type EventGraphEnableField = (typeof EVENT_GRAPH_ENABLE_FIELDS)[number];

/** Single right source on the step for all effect edges. */
export const STEP_EFFECTS_SOURCE_HANDLE = 'stepEffects';
export const EVENT_ENABLED_TARGET_HANDLE = 'eventEnabled';

/** Legacy numbered source handles (`effect_0`, …) from older editor graphs. */
export const STEP_EFFECT_EDGE_PREFIX = 'effect';

export function isStepEffectSourceHandle(handle: string | null | undefined): boolean {
  if (!handle) return false;
  if (handle === STEP_EFFECTS_SOURCE_HANDLE) return true;
  const p = `${STEP_EFFECT_EDGE_PREFIX}_`;
  if (!handle.startsWith(p)) return false;
  return /^\d+$/.test(handle.slice(p.length));
}

/** Target handle on most effect nodes (incoming from a step). */
export const EFFECT_NODE_TARGET_HANDLE = 'in';

/** Task node: which create/complete array this edge belongs to. */
export const TASK_EFFECT_CREATE_HANDLE = 'create';
export const TASK_EFFECT_COMPLETE_HANDLE = 'complete';

export function isStepTriggerTargetHandle(handle: string): boolean {
  if (handle === STEP_DEPS_TARGET_HANDLE || handle === 'triggeredBy' || handle === 'conditions') return true;
  // Legacy: `triggeredBy_0`, `conditions_1`, …
  return STEP_GRAPH_TRIGGER_FIELDS.some((f) => {
    if (!handle.startsWith(`${f}_`)) return false;
    return /^\d+$/.test(handle.slice(f.length + 1));
  });
}

export function isStepLinkTargetHandle(handle: string | null | undefined): boolean {
  if (!handle) return false;
  return isStepTriggerTargetHandle(handle);
}

export function isEventEnabledTargetHandle(handle: string | null | undefined): boolean {
  if (!handle) return false;
  if (handle === EVENT_ENABLED_TARGET_HANDLE || handle === 'enabledBy' || handle === 'enabledConditions') return true;
  return EVENT_GRAPH_ENABLE_FIELDS.some((f) => {
    if (!handle.startsWith(`${f}_`)) return false;
    return /^\d+$/.test(handle.slice(f.length + 1));
  });
}

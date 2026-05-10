'use client';

import { Handle, Position } from '@xyflow/react';
import type { CSSProperties, ReactNode } from 'react';
import { PiCaretDoubleRightDuotone, PiFlowArrowDuotone, PiLightningDuotone } from 'react-icons/pi';
import {
  EVENT_ENABLED_TARGET_HANDLE,
  STEP_DEPS_TARGET_HANDLE,
  STEP_EFFECTS_SOURCE_HANDLE,
} from '@/components/editor/step-link-fields';
import { cn } from '@/utils/cn';
import { editorHandle, editorHandlePos, editorNodeTitle } from './editor-node-styles';
import { type StorylineFlowNodeType, storylineFlowNodeTypeLabel } from './storyline-flow-node';
import { storylineNodeAddGroup } from './storyline-node-category';

function StorylineNodeCategoryIcon({ type }: { type: StorylineFlowNodeType }) {
  const g = storylineNodeAddGroup(type);
  const Icon = g === 'flow' ? PiFlowArrowDuotone : g === 'events' ? PiLightningDuotone : PiCaretDoubleRightDuotone;
  return <Icon className="inline shrink-0" size={16} aria-hidden />;
}

export function EditorNodeShell({
  selected,
  type,
  className,
  children,
}: {
  selected: boolean;
  type: StorylineFlowNodeType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-md bg-surface text-sm min-w-20 p-2 flex flex-col gap-2',
        selected ? 'ring-2 ring-accent' : null,
        className,
      )}
    >
      <div className={cn('flex items-center gap-1.5 font-semibold', editorNodeTitle[type])}>
        <StorylineNodeCategoryIcon type={type} />
        <span>{storylineFlowNodeTypeLabel(type)}</span>
      </div>
      {children}
    </div>
  );
}

export { editorHandle, editorHandlePos };

export function SourceOutHandle({ title, style = editorHandlePos.right }: { title?: string; style?: CSSProperties }) {
  return (
    <Handle
      type="source"
      position={Position.Right}
      id="out"
      className={editorHandle.trigger}
      style={style}
      title={title}
    />
  );
}

export function StepCompletionOutHandle() {
  return (
    <Handle
      type="source"
      position={Position.Right}
      id="out"
      className={editorHandle.trigger}
      style={editorHandlePos.right}
      title="When this step has fired; connect into another step's stepDeps (triggeredBy)"
    />
  );
}

export function StepDepsTargetHandle() {
  return (
    <Handle
      type="target"
      position={Position.Left}
      id={STEP_DEPS_TARGET_HANDLE}
      className={editorHandle.trigger}
      style={editorHandlePos.left}
      title="Steps, tasks, events, or condition nodes: connect out here (conditions vs triggers split by source type)"
    />
  );
}

export function StepEffectsSourceHandle() {
  return (
    <Handle
      type="source"
      position={Position.Right}
      id={STEP_EFFECTS_SOURCE_HANDLE}
      className={editorHandle.effect}
      style={editorHandlePos.right}
      title="Side-effect nodes or task create/complete (multiple wires allowed)"
    />
  );
}

export function EventEnabledTargetHandle() {
  return (
    <Handle
      type="target"
      position={Position.Left}
      id={EVENT_ENABLED_TARGET_HANDLE}
      className={editorHandle.trigger}
      style={editorHandlePos.left}
      title="Steps, tasks, events, or condition nodes: connect out here to enable this event"
    />
  );
}

export function TaskCreateTargetHandle() {
  return (
    <Handle
      type="target"
      position={Position.Left}
      id="create"
      className={editorHandle.effect}
      style={editorHandlePos.left}
      title="From step effect → createTask"
    />
  );
}

export function TaskCompleteTargetHandle() {
  return (
    <Handle
      type="target"
      position={Position.Left}
      id="complete"
      className={editorHandle.effect}
      style={editorHandlePos.left}
      title="From step effect → completeTask"
    />
  );
}

export function TaskCompletionOutHandle() {
  return (
    <Handle
      type="source"
      position={Position.Right}
      id="out"
      className={editorHandle.trigger}
      style={editorHandlePos.right}
      title="When this task is completed; connect into another step's stepDeps (triggeredBy)"
    />
  );
}

export function EffectTargetHandle({ title }: { title: string }) {
  return (
    <Handle
      type="target"
      position={Position.Left}
      className={editorHandle.effect}
      style={editorHandlePos.left}
      title={title}
    />
  );
}

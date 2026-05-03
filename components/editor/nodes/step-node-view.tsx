'use client';

import { usePatchNodeData } from '@/components/editor/use-patch-node-data';
import { cn } from '@/utils/cn';
import {
  EditorNodeShell,
  StepCompletionOutHandle,
  StepDepsTargetHandle,
  StepEffectsSourceHandle,
} from './editor-node-primitives';
import { editorField } from './editor-node-styles';
import type { StorylineNodeProps } from './storyline-flow-node';

export function StepNodeView({ id, data, selected, type }: StorylineNodeProps<'step'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const description = typeof d.description === 'string' ? d.description : '';

  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        description
        <textarea
          className={editorField.textarea}
          rows={2}
          value={description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </label>
      <div className="relative flex w-full items-center justify-between gap-4">
        <div className="relative flex items-center">
          <StepDepsTargetHandle />
          <span className={cn(editorField.helper)}>Prerequisites</span>
        </div>
        <div className="relative flex items-center">
          <span className={cn(editorField.helper)}>Done?</span>
          <StepCompletionOutHandle />
        </div>
      </div>
      <div className="relative flex items-center justify-end">
        <span className={cn(editorField.helper)}>Effects</span>
        <StepEffectsSourceHandle />
      </div>
    </EditorNodeShell>
  );
}

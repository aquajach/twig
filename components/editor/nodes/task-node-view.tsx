'use client';

import { usePatchNodeData } from '@/components/editor/use-patch-node-data';
import {
  EditorNodeShell,
  TaskCompleteTargetHandle,
  TaskCompletionOutHandle,
  TaskCreateTargetHandle,
} from './editor-node-primitives';
import { editorField } from './editor-node-styles';
import type { StorylineNodeProps } from './storyline-flow-node';

export function TaskNodeView({ id, data, selected, type }: StorylineNodeProps<'task'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        title
        <input
          className={editorField.input}
          value={typeof d.title === 'string' ? d.title : ''}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </label>
      <label className={editorField.label}>
        description
        <textarea
          className={editorField.textarea}
          rows={2}
          value={typeof d.description === 'string' ? d.description : ''}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </label>
      <div className="relative flex w-full items-center justify-between gap-4">
        <div className="relative flex items-center">
          <span className={editorField.helper}>Create task</span>
          <TaskCreateTargetHandle />
        </div>
      </div>
      <div className="relative flex w-full items-center justify-between gap-4">
        <div className="relative flex items-center">
          <span className={editorField.helper}>Complete task</span>
          <TaskCompleteTargetHandle />
        </div>
        <div className="relative flex items-center">
          <span className={editorField.helper}>Done?</span>
          <TaskCompletionOutHandle />
        </div>
      </div>
    </EditorNodeShell>
  );
}

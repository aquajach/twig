'use client';

import { usePatchNodeData } from '@/components/editor/use-patch-node-data';
import { EditorNodeShell, SourceOutHandle } from './editor-node-primitives';
import { editorField, editorHandlePos } from './editor-node-styles';
import type { StorylineNodeProps } from './storyline-flow-node';

type JsonFieldProps = StorylineNodeProps<'condition'> & { field: string; rows: number };

function JsonFieldNode({ id, data, selected, type, field, rows }: JsonFieldProps) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const text = typeof d[field] === 'string' ? (d[field] as string) : '';
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <textarea
        className={editorField.textareaMono}
        rows={rows}
        value={text}
        spellCheck={false}
        onChange={(e) => patch({ [field]: e.target.value })}
      />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function ConditionNodeView(props: StorylineNodeProps<'condition'>) {
  return <JsonFieldNode {...props} field="conditionJson" rows={4} />;
}

'use client';

import { ContextSegmentPickerModal } from '@/components/editor/context-segment-picker-modal';
import { useEditorUi } from '@/components/editor/editor-ui-context';
import { usePatchNodeData } from '@/components/editor/use-patch-node-data';
import { cn } from '@/utils/cn';
import { EditorNodeShell, EffectTargetHandle } from './editor-node-primitives';
import { editorField } from './editor-node-styles';
import type { StorylineNodeProps } from './storyline-flow-node';

export function ContextNodeView({ id, data, selected, type }: StorylineNodeProps<'context'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const ui = useEditorUi();
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (unlockContext)" />
      <select
        className={editorField.select}
        value={typeof d.npcId === 'string' ? d.npcId : ''}
        onChange={(e) => patch({ npcId: e.target.value })}
      >
        <option value="">NPC…</option>
        {ui.npcIds.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ContextSegmentPickerModal
        npcId={typeof d.npcId === 'string' ? d.npcId : ''}
        contextKey={typeof d.contextKey === 'string' ? d.contextKey : ''}
        patch={patch}
      />
    </EditorNodeShell>
  );
}

export function MemoNodeView({ id, data, selected, type }: StorylineNodeProps<'memo'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (grantMemo)" />
      <input
        className={editorField.input}
        placeholder="title"
        value={typeof d.memoTitle === 'string' ? d.memoTitle : ''}
        onChange={(e) => patch({ memoTitle: e.target.value })}
      />
      <textarea
        className={editorField.textarea}
        rows={2}
        placeholder="description"
        value={typeof d.memoDescription === 'string' ? d.memoDescription : ''}
        onChange={(e) => patch({ memoDescription: e.target.value })}
      />
      <input
        className={cn('mt-1', editorField.input)}
        placeholder="icon (optional)"
        value={typeof d.memoIcon === 'string' ? d.memoIcon : ''}
        onChange={(e) => patch({ memoIcon: e.target.value })}
      />
    </EditorNodeShell>
  );
}

export function NotificationNodeView({ id, data, selected, type }: StorylineNodeProps<'notification'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (notify)" />
      <select
        className={editorField.select}
        value={typeof d.app === 'string' ? d.app : 'wetalk'}
        onChange={(e) => patch({ app: e.target.value })}
      >
        <option value="wetalk">WeTalk</option>
        <option value="browser">Browser</option>
        <option value="mission-center">Mission Center</option>
      </select>
      <input
        className={editorField.input}
        placeholder="title"
        value={typeof d.title === 'string' ? d.title : ''}
        onChange={(e) => patch({ title: e.target.value })}
      />
      <input
        className={editorField.input}
        placeholder="body"
        value={typeof d.body === 'string' ? d.body : ''}
        onChange={(e) => patch({ body: e.target.value })}
      />
    </EditorNodeShell>
  );
}

export function NpcMessageNodeView({ id, data, selected, type }: StorylineNodeProps<'npc_message'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const ui = useEditorUi();
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (sendMessage)" />
      <select
        className={editorField.select}
        value={typeof d.npcId === 'string' ? d.npcId : ''}
        onChange={(e) => patch({ npcId: e.target.value })}
      >
        <option value="">NPC…</option>
        {ui.npcIds.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <textarea
        className={editorField.textarea}
        rows={3}
        placeholder="content"
        value={typeof d.content === 'string' ? d.content : ''}
        onChange={(e) => patch({ content: e.target.value })}
      />
    </EditorNodeShell>
  );
}

export function BrowserStateNodeView({ id, data, selected, type }: StorylineNodeProps<'browser_state'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (setPage / updatePageState)" />
      <input
        className={editorField.input}
        placeholder="page id"
        value={typeof d.pageId === 'string' ? d.pageId : ''}
        onChange={(e) => patch({ pageId: e.target.value })}
      />
      <select
        className={editorField.select}
        value={typeof d.mode === 'string' ? d.mode : 'set'}
        onChange={(e) => patch({ mode: e.target.value })}
      >
        <option value="set">set</option>
        <option value="update">update</option>
      </select>
      <textarea
        className={editorField.textareaMono}
        rows={3}
        placeholder="state JSON"
        value={typeof d.stateJson === 'string' ? d.stateJson : '{}'}
        onChange={(e) => patch({ stateJson: e.target.value })}
      />
    </EditorNodeShell>
  );
}

export function WetalkLinkNodeView({ id, data, selected, type }: StorylineNodeProps<'wetalk_link'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const ui = useEditorUi();
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (wetalkLink)" />
      <select
        className={editorField.select}
        value={typeof d.npcId === 'string' ? d.npcId : ''}
        onChange={(e) => patch({ npcId: e.target.value })}
      >
        <option value="">NPC…</option>
        {ui.npcIds.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <input
        className={editorField.input}
        placeholder="link label"
        value={typeof d.linkLabel === 'string' ? d.linkLabel : ''}
        onChange={(e) => patch({ linkLabel: e.target.value })}
      />
      <input
        className={editorField.input}
        placeholder="page id"
        value={typeof d.pageId === 'string' ? d.pageId : ''}
        onChange={(e) => patch({ pageId: e.target.value })}
      />
    </EditorNodeShell>
  );
}

export function StorylineRefNodeView({ id, data, selected, type }: StorylineNodeProps<'storyline_ref'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const ui = useEditorUi();
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (activateStoryline)" />
      <select
        className={editorField.select}
        value={typeof d.storylineId === 'string' ? d.storylineId : ''}
        onChange={(e) => patch({ storylineId: e.target.value })}
      >
        <option value="">Storyline…</option>
        {ui.allStorylineIds.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </EditorNodeShell>
  );
}

export function UnlockNpcNodeView({ id, data, selected, type }: StorylineNodeProps<'unlock_npc'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  const ui = useEditorUi();
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <EffectTargetHandle title="From step effect (unlock_npc)" />
      <select
        className={editorField.select}
        value={typeof d.npcId === 'string' ? d.npcId : ''}
        onChange={(e) => patch({ npcId: e.target.value })}
      >
        <option value="">NPC…</option>
        {ui.npcIds.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </EditorNodeShell>
  );
}

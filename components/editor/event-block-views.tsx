'use client';

import { useEditorUi } from '@/components/editor/editor-ui-context';
import {
  EditorNodeShell,
  EventEnabledTargetHandle,
  SourceOutHandle,
} from '@/components/editor/nodes/editor-node-primitives';
import { editorField, editorHandlePos } from '@/components/editor/nodes/editor-node-styles';
import type { StorylineNodeProps } from '@/components/editor/nodes/storyline-flow-node';
import { usePatchNodeData } from '@/components/editor/use-patch-node-data';
import { cn } from '@/utils/cn';

function EventEnabledRow() {
  return (
    <div className="relative flex w-full items-center">
      <EventEnabledTargetHandle />
      <span className={cn(editorField.helper)}>Enabled</span>
    </div>
  );
}

export function EvtGameStartNodeView({ selected, type }: StorylineNodeProps<'evt_game_start'>) {
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <p className={editorField.helper}>Listens for game_start.</p>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtManualNodeView({ selected, type }: StorylineNodeProps<'evt_manual'>) {
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <p className={editorField.helper}>Satisfied when the storyline becomes active.</p>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtChatMessageSentNodeView({ id, data, selected, type }: StorylineNodeProps<'evt_chat_message_sent'>) {
  const patch = usePatchNodeData(id);
  const ui = useEditorUi();
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        NPC
        <select
          className={editorField.select}
          value={typeof d.npcId === 'string' ? d.npcId : ''}
          onChange={(e) => patch({ npcId: e.target.value })}
        >
          <option value="">…</option>
          {ui.npcIds.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className={editorField.label}>
        keywords (comma)
        <input
          className={editorField.input}
          value={typeof d.keywordsText === 'string' ? d.keywordsText : ''}
          onChange={(e) => patch({ keywordsText: e.target.value })}
        />
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtChatMessageReceivedNodeView({
  id,
  data,
  selected,
  type,
}: StorylineNodeProps<'evt_chat_message_received'>) {
  const patch = usePatchNodeData(id);
  const ui = useEditorUi();
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        NPC
        <select
          className={editorField.select}
          value={typeof d.npcId === 'string' ? d.npcId : ''}
          onChange={(e) => patch({ npcId: e.target.value })}
        >
          <option value="">…</option>
          {ui.npcIds.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className={editorField.label}>
        keywords (comma)
        <input
          className={editorField.input}
          value={typeof d.keywordsText === 'string' ? d.keywordsText : ''}
          onChange={(e) => patch({ keywordsText: e.target.value })}
        />
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

function IntentEventFields({ id, data }: { id: string; data: Record<string, unknown> }) {
  const patch = usePatchNodeData(id);
  const ui = useEditorUi();
  return (
    <>
      <label className={editorField.label}>
        NPC
        <select
          className={editorField.select}
          value={typeof data.npcId === 'string' ? data.npcId : ''}
          onChange={(e) => patch({ npcId: e.target.value })}
        >
          <option value="">…</option>
          {ui.npcIds.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className={editorField.label}>
        truth statement
        <textarea
          className={editorField.input}
          rows={4}
          value={typeof data.statementText === 'string' ? data.statementText : ''}
          onChange={(e) => patch({ statementText: e.target.value })}
        />
      </label>
    </>
  );
}

export function EvtIntentSentNodeView({ id, data, selected, type }: StorylineNodeProps<'evt_intent_sent'>) {
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <IntentEventFields id={id} data={d} />
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtIntentReceivedNodeView({ id, data, selected, type }: StorylineNodeProps<'evt_intent_received'>) {
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <IntentEventFields id={id} data={d} />
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtNpcChatOpenedNodeView({ id, data, selected, type }: StorylineNodeProps<'evt_npc_chat_opened'>) {
  const patch = usePatchNodeData(id);
  const ui = useEditorUi();
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        NPC
        <select
          className={editorField.select}
          value={typeof d.npcId === 'string' ? d.npcId : ''}
          onChange={(e) => patch({ npcId: e.target.value })}
        >
          <option value="">…</option>
          {ui.npcIds.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtBrowserPageVisitedNodeView({
  id,
  data,
  selected,
  type,
}: StorylineNodeProps<'evt_browser_page_visited'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        page id
        <input
          className={editorField.input}
          value={typeof d.pageId === 'string' ? d.pageId : ''}
          onChange={(e) => patch({ pageId: e.target.value })}
        />
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtBrowserActionNodeView({ id, data, selected, type }: StorylineNodeProps<'evt_browser_action'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        page id
        <input
          className={editorField.input}
          value={typeof d.pageId === 'string' ? d.pageId : ''}
          onChange={(e) => patch({ pageId: e.target.value })}
        />
      </label>
      <label className={editorField.label}>
        action id
        <input
          className={editorField.input}
          value={typeof d.actionId === 'string' ? d.actionId : ''}
          onChange={(e) => patch({ actionId: e.target.value })}
        />
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtTaskCompletedNodeView({ id, data, selected, type }: StorylineNodeProps<'evt_task_completed'>) {
  const patch = usePatchNodeData(id);
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        task id
        <input
          className={editorField.input}
          value={typeof d.taskId === 'string' ? d.taskId : ''}
          onChange={(e) => patch({ taskId: e.target.value })}
        />
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export function EvtStorylineCompletedNodeView({
  id,
  data,
  selected,
  type,
}: StorylineNodeProps<'evt_storyline_completed'>) {
  const patch = usePatchNodeData(id);
  const ui = useEditorUi();
  const d = (data ?? {}) as Record<string, unknown>;
  return (
    <EditorNodeShell selected={!!selected} type={type}>
      <label className={editorField.label}>
        storyline
        <select
          className={editorField.select}
          value={typeof d.storylineId === 'string' ? d.storylineId : ''}
          onChange={(e) => patch({ storylineId: e.target.value })}
        >
          <option value="">…</option>
          {ui.allStorylineIds.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <EventEnabledRow />
      <SourceOutHandle style={editorHandlePos.right} />
    </EditorNodeShell>
  );
}

export const eventBlockNodeTypes = {
  evt_game_start: EvtGameStartNodeView,
  evt_manual: EvtManualNodeView,
  evt_chat_message_sent: EvtChatMessageSentNodeView,
  evt_chat_message_received: EvtChatMessageReceivedNodeView,
  evt_intent_sent: EvtIntentSentNodeView,
  evt_intent_received: EvtIntentReceivedNodeView,
  evt_npc_chat_opened: EvtNpcChatOpenedNodeView,
  evt_browser_page_visited: EvtBrowserPageVisitedNodeView,
  evt_browser_action: EvtBrowserActionNodeView,
  evt_task_completed: EvtTaskCompletedNodeView,
  evt_storyline_completed: EvtStorylineCompletedNodeView,
};

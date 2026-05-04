'use client';

import type { Selection } from '@react-types/shared';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  TextArea,
  TextField,
} from 'react-aria-components';
import { LuExternalLink, LuPlus, LuTrash } from 'react-icons/lu';
import {
  editorButton,
  editorDialogTitle,
  editorModalActions,
  editorModalBase,
  editorModalFieldLabel,
  editorModalOverlay,
  editorModalSection,
} from '@/components/editor/editor-dialog-styles';
import { useEditorUi } from '@/components/editor/editor-ui-context';
import { cn } from '@/utils/cn';
import { editorField } from './nodes/editor-node-styles';

type ContextSegmentPickerModalProps = {
  npcId: string;
  contextKey: string;
  patch: (partial: Record<string, unknown>) => void;
};

function selectionFirstKey(sel: Selection): string | undefined {
  if (sel === 'all') return undefined;
  const first = sel instanceof Set ? [...sel][0] : [...sel][0];
  return typeof first === 'string' ? first : undefined;
}

export function ContextSegmentPickerModal({ npcId, contextKey, patch }: ContextSegmentPickerModalProps) {
  const ui = useEditorUi();

  const refsForNpc = ui.contextReferences[npcId] ?? {};

  const refresh = useCallback(async () => {
    await ui.refreshContextSegments();
  }, [ui]);

  const [open, setOpen] = useState(false);
  const [segmentsLocal, setSegmentsLocal] = useState<Record<string, string>>({});
  const [editFocusKey, setEditFocusKey] = useState<string | null>(null);
  const [draftId, setDraftId] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !npcId) {
      return;
    }
    const src = ui.contextSegments[npcId] ?? {};
    setSegmentsLocal({ ...src });
    setError(null);
    const ck = contextKey.trim();
    if (ck && src[ck] !== undefined) {
      setEditFocusKey(ck);
      setDraftId(ck);
      setDraftContent(src[ck]);
    } else {
      setEditFocusKey(null);
      setDraftId('');
      setDraftContent('');
    }
  }, [open, npcId, contextKey, ui.contextSegments]);

  const disabled = !npcId;
  const label = contextKey.trim() ? contextKey : 'Pick segment…';

  const selectKey = (key: string) => {
    const text = segmentsLocal[key] ?? ui.contextSegments[npcId]?.[key] ?? '';
    setEditFocusKey(key);
    setDraftId(key);
    setDraftContent(text);
    patch({ contextKey: key });
  };

  const handleNew = () => {
    setEditFocusKey(null);
    setDraftId('');
    setDraftContent('');
    setError(null);
  };

  const mergeDraft = (): Record<string, string> => {
    const id = draftId.trim();
    if (!id) throw new Error('Segment id is required.');
    const next = { ...segmentsLocal };
    if (editFocusKey && editFocusKey !== id) {
      delete next[editFocusKey];
    }
    next[id] = draftContent;
    return next;
  };

  const handleSaveMap = async () => {
    if (!npcId) return;
    setError(null);
    setSaving(true);
    try {
      const next = mergeDraft();
      const res = await fetch(`/api/editor/context-segments/${npcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segments: next }),
      });
      const j = (await res.json()) as {
        ok?: boolean;
        error?: string;
        blocked?: { contextKey: string; refs: { storylineId: string; nodeId: string }[] }[];
        updatedStorylineIds?: string[];
      };
      if (!res.ok) {
        if (j.blocked?.length) {
          const b = j.blocked[0];
          setError(
            `Cannot remove "${b.contextKey}" — used in ${b.refs.map((r) => `${r.storylineId}/${r.nodeId}`).join(', ')}`,
          );
        } else {
          setError(j.error ?? `Save failed (${res.status})`);
        }
        return;
      }
      setSegmentsLocal(next);
      await refresh();
      const newId = draftId.trim();
      if (newId !== contextKey) {
        patch({ contextKey: newId });
      }
      setEditFocusKey(newId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!npcId || !editFocusKey) return;
    const refs = refsForNpc[editFocusKey];
    if (refs?.length) {
      setError(`Cannot delete — referenced by ${refs.length} context node(s).`);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const next = { ...segmentsLocal };
      delete next[editFocusKey];
      const res = await fetch(`/api/editor/context-segments/${npcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segments: next }),
      });
      const j = (await res.json()) as {
        error?: string;
        blocked?: { contextKey: string; refs: { storylineId: string; nodeId: string }[] }[];
      };
      if (!res.ok) {
        if (j.blocked?.length) {
          const b = j.blocked[0];
          setError(
            `Cannot remove "${b.contextKey}" — used in ${b.refs.map((r) => `${r.storylineId}/${r.nodeId}`).join(', ')}`,
          );
        } else {
          setError(j.error ?? `Delete failed (${res.status})`);
        }
        return;
      }
      setSegmentsLocal(next);
      await refresh();
      handleNew();
      if (contextKey === editFocusKey) {
        patch({ contextKey: '' });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const keys = Object.keys(segmentsLocal).sort((a, b) => a.localeCompare(b));

  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <Button
        isDisabled={disabled}
        className={cn(
          editorButton(),
          'nodrag flex w-full min-w-0 items-center justify-between gap-2 text-sm text-left',
        )}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <LuExternalLink aria-hidden />
      </Button>
      <ModalOverlay isDismissable className={editorModalOverlay()}>
        <Modal className={editorModalBase()}>
          <Dialog className="flex max-h-[inherit] flex-col outline-none">
            <div className={cn(editorModalSection(), 'shrink-0 pb-3 pt-4')}>
              <Heading slot="title" className={editorDialogTitle()}>
                Context segments
              </Heading>
              <p className="text-sm text-text-secondary">NPC: {npcId || '(none)'}</p>
            </div>
            <div className="min-h-0 flex-1 gap-3 overflow-hidden flex flex-col md:flex-row">
              <div className={cn(editorModalSection(), 'min-h-0 overflow-y-auto py-3')}>
                <span className={editorModalFieldLabel()}>Segments</span>
                <ListBox
                  aria-label="Context segment ids"
                  selectionMode="single"
                  selectedKeys={editFocusKey ? new Set([editFocusKey]) : new Set()}
                  onSelectionChange={(sel) => {
                    const k = selectionFirstKey(sel);
                    if (k) selectKey(k);
                  }}
                  className="flex-1 outline-none overflow-y-auto"
                >
                  {keys.map((k) => (
                    <ListBoxItem
                      key={k}
                      id={k}
                      textValue={k}
                      className="cursor-pointer rounded px-2.5 py-1.5 text-sm data-[hovered]:bg-surface-hover data-[selected]:bg-surface-hover data-[selected]:after:bg-accent relative after:absolute after:block after:left-0 after:top-1/6 after:rounded after:h-2/3 after:w-1"
                    >
                      {k}
                    </ListBoxItem>
                  ))}
                </ListBox>
                <Button type="button" className={editorButton()} onPress={handleNew}>
                  <LuPlus /> New segment
                </Button>
              </div>
              <div className={cn(editorModalSection(), 'min-h-0 overflow-y-auto py-3 flex-1')}>
                <TextField value={draftId} onChange={setDraftId} className="flex flex-col gap-1">
                  <Label className={editorModalFieldLabel()}>Segment id</Label>
                  <Input className={editorField.input} />
                </TextField>
                <TextField value={draftContent} onChange={setDraftContent} className="mt-2 flex min-h-0 flex-col gap-1">
                  <Label className={editorModalFieldLabel()}>Content</Label>
                  <TextArea className={editorField.textarea} placeholder="Prompt text for this context…" rows={12} />
                </TextField>
              </div>
            </div>
            {error ? <p className="px-4 text-sm text-red-300">{error}</p> : null}
            <div className={editorModalActions()}>
              <Button
                type="button"
                className={editorButton()}
                isDisabled={saving || !editFocusKey}
                onPress={() => void handleDelete()}
              >
                <LuTrash />
                Delete
              </Button>
              <Button
                type="button"
                className={editorButton({ variant: 'primary' })}
                isDisabled={saving || !npcId}
                onPress={() => void handleSaveMap()}
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

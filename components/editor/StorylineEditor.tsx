'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StorylineFlowCanvas, type StorylineFlowCanvasHandle } from '@/components/editor/StorylineFlowCanvas';
import type { StorylineGraph, StorylineStatus, ValidationError } from '@/engine/types';
import { validateGraph } from '@/engine/validate';

export function StorylineEditor(props: {
  storylineId: string;
  initialGraph: StorylineGraph;
  allStorylineOptions: { label: string; value: string }[];
}) {
  const { initialGraph, storylineId, allStorylineOptions } = props;
  const [title, setTitle] = useState(initialGraph.title);
  const [initialStatus, setInitialStatus] = useState<string>(initialGraph.initialStatus ?? '');
  const [introLabel, setIntroLabel] = useState(initialGraph.introCard?.label ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [saving, setSaving] = useState(false);
  const flowRef = useRef<StorylineFlowCanvasHandle | null>(null);

  const buildMetaFromForm = useCallback(
    () => ({
      id: storylineId,
      title: title.trim() || storylineId,
      initialStatus: (initialStatus || undefined) as StorylineStatus | undefined,
      introCard: introLabel.trim() ? { label: introLabel.trim() } : undefined,
    }),
    [storylineId, title, initialStatus, introLabel],
  );

  const getMeta = useCallback(() => buildMetaFromForm(), [buildMetaFromForm]);

  const handleSave = async () => {
    setMessage(null);
    setErrors([]);
    const snap = flowRef.current?.getGraph();
    if (!snap) {
      setMessage('Editor not ready.');
      return;
    }
    const graph = snap;
    const ids = new Set(allStorylineOptions.map((o) => o.value));
    const errs = validateGraph(graph, ids);
    setErrors(errs);
    const hard = errs.filter((e) => e.severity === 'error');
    if (hard.length) {
      setMessage('Fix validation errors before save.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/editor/storylines/${storylineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graph),
      });
      if (!res.ok) {
        const j = (await res.json()) as { errors?: ValidationError[]; error?: string };
        setErrors(j.errors ?? []);
        setMessage(j.error ?? `Save failed (${res.status})`);
        return;
      }
      setMessage('Saved.');
    } finally {
      setSaving(false);
    }
  };

  const flowProps = useMemo(
    () => ({
      initialGraph,
      allStorylineOptions,
      getMeta,
    }),
    [initialGraph, allStorylineOptions, getMeta],
  );

  return (
    <div className="flex flex-col gap-4 p-4 text-zinc-100">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/storylines" className="text-sky-400 underline">
          ← List
        </Link>
        <h1 className="text-xl font-semibold">{storylineId}</h1>
        <button
          type="button"
          className="rounded bg-sky-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {message ? <span className="text-sm text-zinc-400">{message}</span> : null}
      </div>
      <div className="grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Title
          <input
            className="rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-zinc-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Initial status
          <select
            className="rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-zinc-100"
            value={initialStatus}
            onChange={(e) => setInitialStatus(e.target.value)}
          >
            <option value="">(default)</option>
            <option value="locked">locked</option>
            <option value="active">active</option>
            <option value="completed">completed</option>
          </select>
        </label>
        <label className="col-span-full flex flex-col gap-1 text-sm">
          Intro card label
          <input
            className="rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-zinc-100"
            value={introLabel}
            onChange={(e) => setIntroLabel(e.target.value)}
          />
        </label>
      </div>
      {errors.length > 0 ? (
        <ul className="max-h-40 list-disc overflow-auto rounded border border-red-900/60 bg-red-950/40 px-6 py-2 text-sm text-red-200">
          {errors.map((e) => (
            <li key={`${e.severity}:${e.nodeId ?? 'graph'}:${e.field ?? ''}:${e.message}`}>
              {e.nodeId ? `[${e.nodeId}] ` : ''}
              {e.message}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="h-[calc(100vh-260px)] min-h-[400px] w-full rounded border border-zinc-700 bg-zinc-950">
        <StorylineFlowCanvas key={storylineId} ref={flowRef} {...flowProps} />
      </div>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ContextSegmentReference } from '@/components/editor/flow-adapter';
import { StorylineEditor } from '@/components/editor/StorylineEditor';
import type { StorylineGraph } from '@/engine/types';

export default function StorylineEditorPage() {
  const params = useParams();
  const storylineId = typeof params?.storylineId === 'string' ? params.storylineId : '';
  const [graph, setGraph] = useState<StorylineGraph | null>(null);
  const [list, setList] = useState<{ label: string; value: string }[]>([]);
  const [contextBundle, setContextBundle] = useState<{
    contextSegments: Record<string, Record<string, string>>;
    contextReferences: Record<string, Record<string, ContextSegmentReference[]>>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storylineId) return;
    let cancelled = false;
    void (async () => {
      try {
        const [listRes, graphRes, ctxRes] = await Promise.all([
          fetch('/api/editor/storylines'),
          fetch(`/api/editor/storylines/${storylineId}`),
          fetch('/api/editor/context-segments'),
        ]);
        if (!listRes.ok || !graphRes.ok || !ctxRes.ok) {
          if (!cancelled) setError(`HTTP ${graphRes.status}`);
          return;
        }
        const listJson = (await listRes.json()) as { id: string; title: string }[];
        const graphJson = (await graphRes.json()) as StorylineGraph;
        const ctxJson = (await ctxRes.json()) as {
          segments: Record<string, Record<string, string>>;
          references: Record<string, Record<string, ContextSegmentReference[]>>;
        };
        if (!cancelled) {
          setList(listJson.map((r) => ({ label: r.title, value: r.id })));
          setGraph(graphJson);
          setContextBundle({
            contextSegments: ctxJson.segments,
            contextReferences: ctxJson.references,
          });
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'fetch failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storylineId]);

  if (!storylineId) {
    return <div className="p-6 text-zinc-400">Missing storyline id.</div>;
  }

  if (error) {
    return <div className="p-6 text-red-300">{error}</div>;
  }

  if (!graph || !contextBundle) {
    return <div className="p-6 text-zinc-400">Loading…</div>;
  }

  return (
    <StorylineEditor
      key={storylineId}
      storylineId={storylineId}
      initialGraph={graph}
      allStorylineOptions={list}
      initialContextBundle={contextBundle}
    />
  );
}

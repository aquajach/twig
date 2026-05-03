'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Row = { id: string; title: string; filePath: string };

const NEW_ID_RE = /^[a-z][a-zA-Z0-9]*$/;

export default function StorylineListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/editor/storylines');
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          return;
        }
        const data = (await res.json()) as Row[];
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'fetch failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createNew() {
    setCreateError(null);
    const id = newId.trim();
    if (!id) {
      setCreateError('Enter an id (lowerCamelCase, e.g. myQuest).');
      return;
    }
    if (!NEW_ID_RE.test(id)) {
      setCreateError('Id must start with a letter (a–z), then letters or digits only.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/editor/storylines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: newTitle.trim() || undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
      if (!res.ok) {
        setCreateError(body.error ?? `HTTP ${res.status}`);
        return;
      }
      router.push(`/storylines/${id}`);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setCreating(false);
    }
  }

  if (error) {
    return (
      <div className="p-6 text-red-300">
        <p>Could not load storylines: {error}</p>
        <p className="mt-2 text-sm text-zinc-500">Editor routes only work in development (NODE_ENV !== production).</p>
      </div>
    );
  }

  if (!rows) {
    return <div className="p-6 text-zinc-400">Loading…</div>;
  }

  return (
    <div className="p-6 text-zinc-100">
      <h1 className="text-2xl font-semibold">Storyline editor</h1>
      <p className="mt-2 text-sm text-zinc-400">Dev-only. Graphs are saved under engine/storylines/.</p>
      <div className="mt-6 flex max-w-lg flex-col gap-3 rounded border border-zinc-700 bg-zinc-900/50 p-4">
        <p className="text-sm font-medium text-zinc-300">Create new</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs text-zinc-400">
            Id
            <input
              className="rounded border border-zinc-600 bg-zinc-950 px-2 py-1.5 font-mono text-sm text-zinc-100"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="lowerCamelCase"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs text-zinc-400">
            Title <span className="font-normal text-zinc-500">(optional)</span>
            <input
              className="rounded border border-zinc-600 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="defaults to id"
              autoComplete="off"
            />
          </label>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createNew()}
            className="shrink-0 rounded bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create new'}
          </button>
        </div>
        {createError ? <p className="text-sm text-red-300">{createError}</p> : null}
      </div>
      <ul className="mt-6 max-w-lg space-y-2">
        {rows.map((r) => (
          <li key={r.id}>
            <Link href={`/storylines/${r.id}`} className="text-sky-400 underline hover:text-sky-300">
              {r.title}
            </Link>
            <span className="ml-2 font-mono text-xs text-zinc-500">{r.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useGameStore } from '@/stores/useGameStore';

export function MemosTab() {
  const memos = useGameStore((s) => s.memos);
  const memoDefinitions = useGameStore((s) => s.memoDefinitions);

  const collected = memos.map((id) => memoDefinitions[id]).filter((m): m is NonNullable<typeof m> => m !== undefined);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-4">
      <h2 className="text-sm font-semibold text-text-primary mb-4">成就</h2>
      {collected.length === 0 ? (
        <p className="text-sm text-text-disabled">No achievements unlocked yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {collected.map((memo) => (
            <div
              key={memo.id}
              className="rounded-md bg-surface-solid p-4 ring-1 ring-divider flex flex-col items-center text-center gap-2"
            >
              <div className="text-3xl" aria-hidden="true">
                {memo.icon ?? '🏅'}
              </div>
              <div className="text-sm font-medium text-text-primary">{memo.title}</div>
              <div className="text-xs text-text-secondary">{memo.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

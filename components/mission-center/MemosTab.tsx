'use client';

import { allStorylines } from '@/engine/storylines';
import type { MemoDefinition } from '@/engine/types';
import { useGameStore } from '@/stores/useGameStore';

/** Memos declared in storyline graphs, stable order, deduped by id. */
const allStorylineMemos: readonly MemoDefinition[] = (() => {
  const byId = new Map<string, MemoDefinition>();
  for (const g of allStorylines) {
    for (const node of Object.values(g.nodes)) {
      if (node.type === 'memo') byId.set(node.memo.id, node.memo);
    }
  }
  return [...byId.values()];
})();

export function MemosTab() {
  const memos = useGameStore((s) => s.memos);
  const memoDefinitions = useGameStore((s) => s.memoDefinitions);
  const collectedSet = new Set(memos);

  const graphIds = new Set(allStorylineMemos.map((m) => m.id));
  const strayCollected = memos
    .filter((id) => !graphIds.has(id))
    .map((id) => memoDefinitions[id])
    .filter((m): m is MemoDefinition => m !== undefined);

  const unlockIndex = new Map(memos.map((id, i) => [id, i]));
  const storylineIndex = new Map(allStorylineMemos.map((m, i) => [m.id, i]));

  const displayMemos = [...allStorylineMemos, ...strayCollected].sort((a, b) => {
    const aUnlocked = collectedSet.has(a.id);
    const bUnlocked = collectedSet.has(b.id);
    if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
    if (aUnlocked) {
      return (unlockIndex.get(a.id) ?? 0) - (unlockIndex.get(b.id) ?? 0);
    }
    return (storylineIndex.get(a.id) ?? 0) - (storylineIndex.get(b.id) ?? 0);
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-4">
      <h2 className="text-sm font-semibold text-text-primary mb-4">成就</h2>
      {displayMemos.length === 0 ? (
        <p className="text-sm text-text-disabled">No achievements defined yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {displayMemos.map((memo) => {
            const unlocked = collectedSet.has(memo.id);
            return (
              <div
                key={memo.id}
                className={
                  'rounded-md bg-surface-solid p-4 ring-1 ring-divider flex flex-row items-center gap-3 h-20 ' +
                  (unlocked ? '' : 'opacity-80 pointer-events-none select-none')
                }
              >
                <div
                  className="size-12 shrink-0 flex items-center justify-center rounded-lg bg-surface-hover ring-1 ring-divider text-3xl leading-none"
                  aria-hidden="true"
                >
                  <span className={unlocked ? undefined : 'brightness-0 opacity-60'}>{memo.icon ?? '🏅'}</span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start justify-center text-left gap-1 overflow-hidden">
                  {unlocked ? (
                    <>
                      <div className="text-sm font-medium text-text-primary line-clamp-2">{memo.title}</div>
                      <div className="text-xs text-text-secondary line-clamp-2">{memo.description}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium text-text-disabled line-clamp-2">???</div>
                      <div className="text-xs text-text-disabled line-clamp-2">繼續遊戲以解鎖</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

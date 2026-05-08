/**
 * Dev-only snapshot helpers. Saves/loads the persisted Zustand state
 * (game, chat, window) so storyline iteration doesn't require replaying
 * from scratch after every prompt tweak.
 *
 * Strategy: read/write the raw localStorage envelopes that
 * `zustand/middleware`'s persist already manages, then reload so each
 * store rehydrates cleanly.
 */

const SNAPSHOT_VERSION = 1;
const STORAGE_KEYS = ['twig-game', 'twig-chat', 'twig-window'] as const;

type SnapshotPayload = {
  __twigSnapshot: typeof SNAPSHOT_VERSION;
  savedAt: string;
  stores: Partial<Record<(typeof STORAGE_KEYS)[number], unknown>>;
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function buildSnapshot(): SnapshotPayload {
  if (!isBrowser()) {
    throw new Error('buildSnapshot must run in the browser');
  }
  const stores: SnapshotPayload['stores'] = {};
  for (const key of STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw == null) continue;
    try {
      stores[key] = JSON.parse(raw);
    } catch {
      // ignore unparsable entries
    }
  }
  return {
    __twigSnapshot: SNAPSHOT_VERSION,
    savedAt: new Date().toISOString(),
    stores,
  };
}

export function downloadSnapshot(): void {
  const snapshot = buildSnapshot();
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = snapshot.savedAt.replace(/[:.]/g, '-');
  a.href = url;
  a.download = `twig-snapshot-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function applySnapshot(payload: unknown): void {
  if (!isBrowser()) {
    throw new Error('applySnapshot must run in the browser');
  }
  if (!payload || typeof payload !== 'object') {
    throw new Error('Snapshot is not a JSON object');
  }
  const snap = payload as Partial<SnapshotPayload>;
  if (snap.__twigSnapshot !== SNAPSHOT_VERSION) {
    throw new Error(`Unsupported snapshot version: ${snap.__twigSnapshot}`);
  }
  if (!snap.stores || typeof snap.stores !== 'object') {
    throw new Error('Snapshot is missing "stores"');
  }
  for (const key of STORAGE_KEYS) {
    const value = snap.stores[key];
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

export async function loadSnapshotFromFile(file: File): Promise<void> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  applySnapshot(parsed);
}

/** Known mocked browser app page ids (keep in sync with `components/browser/pages/registry.tsx`). */
export const BROWSER_PAGE_IDS = ['lion-bank-ebanking', 'fikma'] as const;

export type BrowserPageId = (typeof BROWSER_PAGE_IDS)[number];

/** Display titles for editor / tooling (keep in sync with registry `title` fields). */
export const BROWSER_PAGE_LABELS: Record<BrowserPageId, string> = {
  'lion-bank-ebanking': '獅銀理財 (TEST)',
  fikma: 'Fikma',
};

const SET = new Set<string>(BROWSER_PAGE_IDS);

export function isBrowserPageId(id: string): id is BrowserPageId {
  return SET.has(id);
}

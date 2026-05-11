/** Known mocked browser app page ids (keep in sync with `components/browser/pages/registry.tsx`). */
export const BROWSER_PAGE_IDS = [
  'lion-bank-ebanking',
  'fikma',
  'news-ref-aurora',
  'news-ref-globe',
  'news-ref-pulse',
  'lion-intranet-ceo-post',
] as const;

export type BrowserPageId = (typeof BROWSER_PAGE_IDS)[number];

/** Display titles for editor / tooling (keep in sync with registry `title` fields). */
export const BROWSER_PAGE_LABELS: Record<BrowserPageId, string> = {
  'lion-bank-ebanking': '獅銀理財 (TEST)',
  fikma: 'Fikma',
  'news-ref-aurora': '極光通訊',
  'news-ref-globe': '環球紀事',
  'news-ref-pulse': '脈動市場',
  'lion-intranet-ceo-post': '獅銀 CEO 帖文',
};

const SET = new Set<string>(BROWSER_PAGE_IDS);

export function isBrowserPageId(id: string): id is BrowserPageId {
  return SET.has(id);
}

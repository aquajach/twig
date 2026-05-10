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
  'news-ref-aurora': '參考新聞｜Aurora Wire',
  'news-ref-globe': '參考新聞｜Globe Ledger',
  'news-ref-pulse': '參考新聞｜Pulse Markets',
  'lion-intranet-ceo-post': '獅銀內聯網｜CEO 帖文',
};

const SET = new Set<string>(BROWSER_PAGE_IDS);

export function isBrowserPageId(id: string): id is BrowserPageId {
  return SET.has(id);
}

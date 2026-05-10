'use client';

import { Button } from 'react-aria-components/Button';
import type { FikmaScreenComponentProps } from '@/components/browser/pages/fikma-screens/types';
import { cn } from '@/utils/cn';
import { lionPanel } from '../lion-design-system/lionPanel';

function readBool(props: Record<string, unknown>, key: string): boolean {
  return props[key] === true;
}

export function NewsArticleMockupScreen({ props }: FikmaScreenComponentProps) {
  const title = typeof props.title === 'string' ? props.title : '財經頭條';
  const body =
    typeof props.body === 'string' ? props.body : '正文內容會喺呢度顯示，方便用戶喺網銀首頁快速掌握今日重點。';

  const showDate = readBool(props, 'showDate');
  const showTickerLink = readBool(props, 'showTickerLink');
  const showMiniChart = readBool(props, 'showMiniChart');
  const showReactions = readBool(props, 'showReactions');
  const showComments = readBool(props, 'showComments');
  const showAuthor = readBool(props, 'showAuthor');
  const showCategoryChips = readBool(props, 'showCategoryChips');
  const showShareButton = readBool(props, 'showShareButton');

  return (
    <div className="h-full w-full bg-lionbank-brand-lighter p-4">
      <div className={cn(lionPanel(), 'mx-auto flex max-w-xl flex-col gap-4')}>
        {showCategoryChips ? (
          <div className="flex flex-wrap gap-2">
            {['市場', '港股', '宏觀'].map((t) => (
              <span key={t} className="rounded-full bg-lionbank-brand/15 px-2.5 py-0.5 text-xs text-lionbank-brand">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          {showDate ? <time dateTime="2026-05-11">2026年5月11日</time> : null}
          {showDate && showAuthor ? <span aria-hidden>·</span> : null}
          {showAuthor ? <span className="text-text-primary">獅銀編輯部</span> : null}
        </div>

        <h2 className="text-lg font-bold leading-snug text-text-primary">{title}</h2>

        {showTickerLink ? (
          <div>
            <Button className="cursor-pointer rounded-md border border-divider bg-surface-solid px-2 py-1 font-mono text-xs text-lionbank-brand outline-none data-[hovered]:bg-surface-hover">
              0941.HK ↗
            </Button>
          </div>
        ) : null}

        {showMiniChart ? (
          <div className="rounded-md border border-divider bg-zinc-900/40 p-2">
            <p className="mb-1 text-xs text-text-secondary">相關股份 · 五日（示意）</p>
            <svg
              viewBox="0 0 280 40"
              className="h-10 w-full text-lionbank-brand"
              role="img"
              aria-label="示意價格走勢線"
            >
              <title>示意價格走勢</title>
              <path d="M0 30 L 70 12 L 140 22 L 210 8 L 280 18" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        ) : null}

        <p className="text-sm leading-relaxed text-text-primary">{body}</p>

        {showReactions ? (
          <div className="flex gap-2">
            {['👍', '👀', '🔖'].map((x) => (
              <Button
                key={x}
                className="cursor-pointer rounded-full border border-divider bg-surface-solid px-3 py-1 text-sm outline-none data-[hovered]:bg-surface-hover"
              >
                {x}
              </Button>
            ))}
          </div>
        ) : null}

        {showShareButton ? (
          <div>
            <Button className="cursor-pointer rounded-md border border-lionbank-brand/40 bg-lionbank-brand/10 px-3 py-1.5 text-xs font-medium text-lionbank-brand outline-none data-[hovered]:bg-lionbank-brand/20">
              分享
            </Button>
          </div>
        ) : null}

        {showComments ? (
          <div className="border-t border-divider pt-3">
            <p className="mb-2 text-xs font-medium text-text-secondary">留言</p>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="rounded-md bg-surface-hover/50 px-2 py-1.5">好清晰，想知會唔會有推送。</li>
              <li className="rounded-md bg-surface-hover/50 px-2 py-1.5">可唔可以加多個風險提示。</li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

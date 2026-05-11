'use client';

import { Button } from 'react-aria-components/Button';
import type { FikmaScreenComponentProps } from '@/components/browser/pages/fikma-screens/types';
import { cn } from '@/utils/cn';
import { lionPanel } from '../lion-design-system/lionPanel';

function readBool(props: Record<string, unknown>, key: string): boolean {
  return props[key] === true;
}

export function NewsArticleMockupScreen({ props }: FikmaScreenComponentProps) {
  const showDate = readBool(props, 'showDate');
  const showTickerLink = readBool(props, 'showTickerLink');
  const showMiniChart = readBool(props, 'showMiniChart');
  const showReactions = readBool(props, 'showReactions');
  const showComments = readBool(props, 'showComments');
  const showAuthor = readBool(props, 'showAuthor');
  const showCategoryChips = readBool(props, 'showCategoryChips');
  const showShareButton = readBool(props, 'showShareButton');

  return (
    <div className="h-full w-full bg-lionbank-brand-lighter p-4 text-lionbank-fg">
      <div className={cn(lionPanel(), 'mx-auto flex max-w-xl flex-col gap-4')}>
        <h1 className="text-2xl font-bold leading-snug text-lionbank-brand">冥空科技宣布進軍人工智慧晶片 股價飆升</h1>

        {(showDate || showAuthor) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-lionbank-secondary">
            {showDate ? <time dateTime="2026-05-11">2026年5月11日</time> : null}
            {showAuthor ? <span>獅銀編輯部</span> : null}
          </div>
        )}

        {showCategoryChips ? (
          <div className="flex flex-wrap gap-2">
            {['科技', '港股', '人工智慧'].map((t) => (
              <span key={t} className="rounded-full bg-lionbank-brand/15 px-2.5 py-0.5 text-xs text-lionbank-brand">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {showTickerLink ? (
          <div>
            <Button className="cursor-pointer rounded-md border border-divider bg-surface-solid px-2 py-1 font-mono text-xs text-lionbank-brand outline-none data-[hovered]:bg-surface-hover">
              98989.HK ↗
            </Button>
          </div>
        ) : null}

        {showMiniChart ? (
          <div className="rounded-md border border-white/10 bg-zinc-900/40 p-2 text-text-secondary [&_svg]:text-lionbank-brand-light">
            <p className="mb-1 text-xs">相關股份 · 五日（示意）</p>
            <svg viewBox="0 0 280 40" className="h-10 w-full" role="img" aria-label="示意價格走勢線">
              <title>示意價格走勢</title>
              <path d="M0 30 L 70 12 L 140 22 L 210 8 L 280 18" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        ) : null}

        <p className="text-base leading-relaxed text-lionbank-fg">
          冥空科技（代號：98989.HK）今日在香港交易所的股價大幅上漲，單日漲幅超過15%，創下近三年來最大單日漲幅。消息人士指出，該公司宣布將投入50億港元研發新一代人工智慧晶片，以滿足全球對算力的需求。
        </p>
        <p className="text-base leading-relaxed text-lionbank-fg">
          市場分析師認為，這一舉措可能使冥空科技在未來五年內成為亞洲區域最具競爭力的半導體企業之一。投資者情緒高漲，交易量在短短數小時內翻倍。
        </p>
        <p className="text-base leading-relaxed text-lionbank-fg">
          冥空科技董事長在記者會上表示：「我們相信人工智慧將是未來十年的核心驅動力，而晶片是這場革命的基石。」
        </p>
        <p className="text-base leading-relaxed text-lionbank-fg">
          本行認為，冥空科技的股價短期內受益於利好消息，但中長期走勢仍取決於研發成果與市場競爭格局。
        </p>
        <p className="text-base leading-relaxed text-lionbank-fg">
          短期動能： 公告消息已推升股價，短期內可能持續受益於投資人情緒。
        </p>
        <p className="text-base leading-relaxed text-lionbank-fg">
          中期挑戰： 晶片研發需大量資金與技術突破，存在執行風險。
        </p>
        <p className="text-base leading-relaxed text-lionbank-fg">
          長期潛力： 若研發成功，冥空科技有望成為亞洲人工智慧晶片市場的重要玩家。
        </p>
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
          <div className="border-t border-lionbank-brand-lighter pt-3">
            <p className="mb-2 text-xs font-medium text-lionbank-secondary">留言</p>
            <ul className="space-y-2 text-xs text-lionbank-secondary">
              <li className="rounded-md bg-surface-hover/50 px-2 py-1.5">
                雖然短期內股價大漲，但仍需觀察研發成果是否能真正落地。
              </li>
              <li className="rounded-md bg-surface-hover/50 px-2 py-1.5">
                希望不要只是炒作，畢竟晶片研發不是一朝一夕的事。
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

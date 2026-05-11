'use client';

import type { MockedPageProps } from '@/components/browser/pages/registry';
import { cn } from '@/utils/cn';

/** Reference layout A: dateline, author row, category chips. */
export function NewsRefAurora({ state }: MockedPageProps) {
  const accent = typeof state.accent === 'string' ? state.accent : 'from-amber-500/20 to-orange-600/10';
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <header className={cn('border-b border-zinc-800 bg-gradient-to-r px-4 py-3', accent)}>
        <p className="text-xs font-medium text-amber-200/90">極光通訊</p>
      </header>
      <article className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-base text-zinc-500">
          <time dateTime="2026-05-10">2026年5月10日 07:30</time>
          <span aria-hidden>·</span>
          <span className="text-zinc-400">編輯部</span>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {['宏觀', '利率', '港股'].map((t) => (
            <span key={t} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-base text-zinc-300">
              {t}
            </span>
          ))}
        </div>
        <h1 className="mb-8 text-4xl font-light tracking-tight">央行訊號偏鷹，亞洲債息短線抽高</h1>
        <p className="text-xl mb-6 text-zinc-300">
          香港訊 —
          亞洲主要央行近期釋出偏鷹派訊號，市場解讀貨幣政策可能維持緊縮更久。受此影響，區內債市出現快速反應，短端利率顯著上揚，長債孳息曲線略為陡峭化。交易員指出，資金正重新定價風險溢價，短線波動加劇。
        </p>
        <p className="text-xl mb-6 text-zinc-300">
          策略師分析，若利率環境持續偏高，銀行板塊的息口敏感度將成為焦點，尤其是內銀股的淨息差表現。另一方面，高息股可能因資金輪動而受惠，防禦型產業如公用事業與電訊股亦有望吸引避險資金。
        </p>
        <p className="text-xl mb-6 text-zinc-300">
          此外，部分基金經理認為，亞洲市場的外資流入可能暫時放緩，因美元走強與美債收益率上升，削弱新興市場資產吸引力。外匯市場亦出現波動，部分亞幣承壓，資金短線回流至避險資產。
        </p>
        <p className="text-xl mb-6 text-zinc-300">
          展望後市，分析師提醒投資人需密切關注央行後續政策訊號，以及美國通膨與就業數據的最新走勢。若全球利率環境維持高檔，亞洲市場可能面臨更長時間的資金再平衡過程。
        </p>
      </article>
    </div>
  );
}

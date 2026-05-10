'use client';

import { Button } from 'react-aria-components/Button';
import type { MockedPageProps } from '@/components/browser/pages/registry';
import { cn } from '@/utils/cn';

/** Reference layout A: dateline, author row, category chips. */
export function NewsRefAurora({ state }: MockedPageProps) {
  const accent = typeof state.accent === 'string' ? state.accent : 'from-amber-500/20 to-orange-600/10';
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <header className={cn('border-b border-zinc-800 bg-gradient-to-r px-4 py-3', accent)}>
        <p className="text-xs font-medium uppercase tracking-widest text-amber-200/90">Aurora Wire</p>
      </header>
      <article className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <time dateTime="2026-05-10">2026年5月10日 07:30</time>
          <span aria-hidden>·</span>
          <span className="text-zinc-400">編輯部</span>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {['宏觀', '利率', '港股'].map((t) => (
            <span key={t} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300">
              {t}
            </span>
          ))}
        </div>
        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight">央行訊號偏鷹，亞洲債息短線抽高</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          交易員指資金重新定價風險溢價，區內長債孳息曲線略為陡峭化。策略師建議留意內銀板塊對息口敏感度，以及高息股資金輪動。
        </p>
        <div className="mt-8 border-t border-zinc-800 pt-4">
          <Button className="cursor-pointer text-sm text-amber-400 outline-none data-[hovered]:underline">
            追蹤作者
          </Button>
        </div>
      </article>
    </div>
  );
}

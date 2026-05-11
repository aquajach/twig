'use client';

import { Button } from 'react-aria-components/Button';
import type { MockedPageProps } from '@/components/browser/pages/registry';

/** Reference layout C: share affordance, comment preview list. */
export function NewsRefPulse({ state }: MockedPageProps) {
  const comments =
    Array.isArray(state.comments) && state.comments.every((c) => typeof c === 'string')
      ? (state.comments as string[])
      : ['好文，想知會唔會加埋推送？', '圖表可以再大一啲嗎？', '來源係邊個團隊？'];
  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <div className="border-b border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-violet-700">脈動市場</p>
          <Button className="cursor-pointer rounded-md border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-800 outline-none data-[hovered]:bg-violet-100">
            分享
          </Button>
        </div>
      </div>
      <article className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold leading-tight">虛擬資產 ETF 成交回升，散戶重新入場？</h1>
        <p className="mb-8 text-sm leading-relaxed text-zinc-700">
          券商數據顯示細額買盤增加，但槓桿產品比例仍低。分析認為監管訊號清晰化之前，波幅交易主導短期格調。
        </p>
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-zinc-800">留言 · 128</h2>
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c} className="border-b border-zinc-100 pb-3 text-sm text-zinc-600 last:border-0">
                {c}
              </li>
            ))}
          </ul>
          <Button className="mt-4 w-full cursor-pointer rounded-lg bg-zinc-900 py-2 text-sm text-white outline-none data-[hovered]:bg-zinc-800">
            發表留言
          </Button>
        </section>
      </article>
    </div>
  );
}

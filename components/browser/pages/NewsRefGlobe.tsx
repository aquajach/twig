'use client';

import { Button } from 'react-aria-components/Button';
import type { MockedPageProps } from '@/components/browser/pages/registry';

/** Reference layout B: ticker link, inline sparkline strip, reaction row. */
export function NewsRefGlobe({ state }: MockedPageProps) {
  const line = typeof state.spark === 'string' ? state.spark : 'M0 40 Q 80 10 160 35 T 320 25';
  return (
    <div className="min-h-full bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 bg-slate-800/80 px-4 py-2">
        <p className="text-xs text-slate-400">Globe Ledger · Markets desk</p>
      </div>
      <article className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-semibold">滙控走勢：成交縮但沽壓有限</h1>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <Button className="cursor-pointer rounded-md bg-emerald-600/20 px-2 py-1 font-mono text-emerald-300 outline-none data-[hovered]:bg-emerald-600/30">
            0005.HK →
          </Button>
          <span className="text-slate-500">即市</span>
        </div>
        <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
          <p className="mb-1 text-xs text-slate-500">五日走勢（示意）</p>
          <svg viewBox="0 0 320 48" className="h-12 w-full text-emerald-400" aria-hidden role="presentation">
            <path d={line} fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          大行指板塊輪動加快，資金偏向防守性配置。短線波幅可能擴大，宜留意北水流向同期指倉位變化。
        </p>
        <div className="mt-8 flex gap-2">
          {['👍 1.2k', '💬', '📌'].map((x) => (
            <Button
              key={x}
              className="cursor-pointer rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs outline-none data-[hovered]:border-slate-500"
            >
              {x}
            </Button>
          ))}
        </div>
      </article>
    </div>
  );
}

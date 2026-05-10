'use client';

import type { MockedPageProps } from '@/components/browser/pages/registry';

export function LionIntranetCeoPost({ state }: MockedPageProps) {
  const heading = typeof state.heading === 'string' ? state.heading : '致數碼銀行團隊';
  return (
    <div className="min-h-full bg-[#f4f6f8] text-zinc-900">
      <div className="border-b border-zinc-200 bg-white px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-800/80">Lion Bank Intranet</p>
        <h1 className="mt-1 text-lg font-semibold">CEO 辦公室 · 內部通函</h1>
      </div>
      <article className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="text-xl font-bold text-zinc-950">{heading}</h2>
        <p className="mt-2 text-sm text-zinc-500">2026年5月11日</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-zinc-700">
          <p>
            各位同事，過去幾週我們在網上銀行體驗上有三件值得記低嘅里程碑。首先，我哋快速修復咗影響客戶登入嘅事故，感謝團隊跨部門協作。
          </p>
          <p>其次，用戶期待已久嘅總覽資產配置圖表已經順利上線，呢個係產品同工程長線傾好需求之後嘅成果。</p>
          <p>最後，我哋亦完成咗下季財經新聞單篇展示嘅設計方向梳理，為之後同內容團隊整合鋪好路。</p>
          <p className="font-medium text-zinc-900">多謝大家保持專業同速度，繼續以客為先。</p>
        </div>
      </article>
    </div>
  );
}

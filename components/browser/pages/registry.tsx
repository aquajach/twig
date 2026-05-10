import Image from 'next/image';
import type { ComponentType, ReactElement } from 'react';
import { Fikma } from './Fikma';
import { LionBankEBanking } from './LionBankEBanking';
import { LionIntranetCeoPost } from './LionIntranetCeoPost';
import { NewsRefAurora } from './NewsRefAurora';
import { NewsRefGlobe } from './NewsRefGlobe';
import { NewsRefPulse } from './NewsRefPulse';

export type MockedPageProps = {
  state: Record<string, unknown>;
  dispatch: (actionId: string, payload?: unknown) => void;
};

export type MockedPage = {
  id: string;
  title: string;
  icon: ReactElement;
  component: ComponentType<MockedPageProps>;
  initialState: Record<string, unknown>;
};

export const pageRegistry: MockedPage[] = [
  {
    id: 'lion-bank-ebanking',
    title: '獅銀理財 (TEST)',
    icon: <Image src="/lion-bank-logo.svg" alt="Lion Bank" width={48} height={48} />,
    component: LionBankEBanking,
    initialState: {},
  },
  {
    id: 'fikma',
    title: 'Fikma',
    icon: <Image src="/fikma-logo.svg" alt="Fikma" width={48} height={48} />,
    component: Fikma,
    initialState: {},
  },
  {
    id: 'news-ref-aurora',
    title: '參考新聞｜Aurora Wire',
    icon: <span className="text-4xl leading-none">🌅</span>,
    component: NewsRefAurora,
    initialState: {},
  },
  {
    id: 'news-ref-globe',
    title: '參考新聞｜Globe Ledger',
    icon: <span className="text-4xl leading-none">🌐</span>,
    component: NewsRefGlobe,
    initialState: {},
  },
  {
    id: 'news-ref-pulse',
    title: '參考新聞｜Pulse Markets',
    icon: <span className="text-4xl leading-none">📈</span>,
    component: NewsRefPulse,
    initialState: {},
  },
  {
    id: 'lion-intranet-ceo-post',
    title: '獅銀內聯網｜CEO 帖文',
    icon: <span className="text-4xl leading-none">🏛️</span>,
    component: LionIntranetCeoPost,
    initialState: {},
  },
];

export function getPage(pageId: string): MockedPage | undefined {
  return pageRegistry.find((p) => p.id === pageId);
}

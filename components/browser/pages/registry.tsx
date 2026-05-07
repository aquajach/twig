import Image from 'next/image';
import type { ComponentType, ReactElement } from 'react';
import { Fikma } from './Fikma';
import { LionBankEBanking } from './LionBankEBanking';

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
];

export function getPage(pageId: string): MockedPage | undefined {
  return pageRegistry.find((p) => p.id === pageId);
}

import Image from 'next/image';
import type { FC } from 'react';

export const LionNav: FC = () => (
  <nav className="flex flex-col items-center p-4">
    <div className="container flex items-center justify-between">
      <Image src="/lion-bank-logo-with-text.svg" alt="Lion Bank" width={94} height={30} />
      <div className="font-bold text-lionbank-danger">測試環境</div>
    </div>
  </nav>
);

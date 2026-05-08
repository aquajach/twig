import Image from 'next/image';
import type { FC } from 'react';
import { lionTab } from '../lion-design-system/lionTab';

export const LionNav: FC<{
  isLoggedIn: boolean;
}> = ({ isLoggedIn }) => (
  <nav className="flex flex-col items-center px-4">
    <div className="container flex items-center">
      <div className="flex items-center flex-1 gap-4">
        <div className="py-4">
          <Image src="/lion-bank-logo-with-text.svg" alt="Lion Bank" width={94} height={30} />
        </div>
        <div className="flex-1 flex items-end self-stretch">
          {isLoggedIn ? (
            <>
              <div className={lionTab({ isSelected: true })}>首頁</div>
              <div className={lionTab()}>戶口</div>
              <div className={lionTab()}>付款</div>
              <div className={lionTab()}>投資</div>
              <div className={lionTab()}>信用卡及貸款</div>
            </>
          ) : null}
        </div>
      </div>
      <div className="font-bold text-lionbank-danger">測試環境</div>
    </div>
  </nav>
);

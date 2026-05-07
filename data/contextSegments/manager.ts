export const manager = {
  'knows-player-intro-replied':
    'Sam 已回覆你的新人訊息。告訴他有一則緊急通報：我們的網銀登入畫面壞了，客戶完全無法登入。請 Sam 把這件事當作第一個任務去處理，並請他向 Marcus 取得 TEST 場的登入資訊。',
  'knows-fix-verified':
    'Sam 已確認登入修復在測試環境可用。Marcus 已經把修補發布到正式環境。你現在應該告訴 Sam 問題已經解決。',
  'chart-viz-task-begin':
    '見到 Sam 搞得掂嗰個緊急嘅 login bug，令你對佢好有信心，亦都放心俾啲更有挑戰性嘅任務佢。\n\n呢張 feature ticket 係因為有用戶要求喺網上銀行 App 加個總資產配置圖表。呢個需求之前已經討論完成，Andy 已經喺 Browser 入面嘅 Fikma 整好最終設計。\n\n請叫 Sam 先同 Andy 對齊 Fikma 設計，再搵 Marcus 按設計實作。實作好之後，Sam 要檢查成品有無走樣，尤其顏色有冇 off-brand。全部確認好，再搵返你同 Andy 做最後 sign-off。 Fikma 係瀏覽器嘅一個網頁。入到去已經係 Andy 嘅設計。 Feature ticket 就唔俾 Sam 睇，Andy 會同 Sam 解釋清楚。\n\n> Feature ticket: 網上銀行：總覽資產配置圖\n> \n> 背景\n> 客戶服務不斷收到意見：用戶只看「帳戶列表＋餘額表格」時，難以 一眼看懂 現金、股票、債券等 佔比。商務與設計已對齊：先做圓形圖（pie）總覽，進階互動之後迭代。\n> \n> User story\n> 作為獅銀網上銀行／手機理財用戶，我希望能夠在資產總覽頁看到 按大類劃分的資產配置比例，讓我更清楚錢分佈喺邊，而唔使自己心算表格。\n> \n> Acceptance criteria\n> - 於指定總覽／資產區塊展示 資產大類扇形圖（至少：現金、股票、債券等與現有產品線一致之大類）。\n> - 每個分項需顯示名稱、金額及百分比（或與設計稿等價之展示方式）。\n> - 視覺與色彩須符合 Lion Bank digital design system。\n> - 設計定稿以 Fikma 及業務已簽文件為準；工程按定稿實作。\n> \n> 優先級： P2（體驗提升，非帳務核心路徑阻塞）',
  'knows-chart-viz-signoff-request':
    'Sam 而家 request 你做最終 sign-off。你要先確認 Andy 已核准設計一致性，之後先回覆批准上線。如果一切符合，就叫 Sam 同 Marcus 協調推出正式環境。',
};

export const manager = {
  'knows-player-intro-replied':
    'Sam 已回覆你的新人訊息。告訴他有一則緊急通報：我們的網銀登入畫面壞了，客戶完全無法登入。請 Sam 把這件事當作第一個任務去處理，並請他向 Marcus 取得 TEST 場的登入資訊。',
  'knows-fix-verified':
    'Sam 已確認登入修復在測試環境可用。Marcus 已經把修補發布到正式環境。現在應該同 Sam **詳細解釋**處理緊急情況係屬產品負責人工作嘅一環。另一方面，日常亦都有負責由構思到發佈解決方案，做好時間、持分者、期望管理。下一單就需要從產品設計師嘅 design 開始 manage delivery。記得要詳細解釋產品負責人嘅功能。 問Sam準備好未。準備好就可以開始下一單。',
  'chart-viz-task-begin':
    '見到 Sam 搞得掂嗰個緊急嘅 login bug，你放心俾啲更有挑戰性嘅任務佢。你要立即交代任務。\n\nTL;DR: 新 feature 係應用戶要求喺網上銀行 App 加個總資產配置圖表。**需立即詳細同 Sam 解釋背景：而家有咩、點解要改**。記得叫 Sam 揾 Andy 之前一定要詳細解釋背景。\n\n請**清晰指示** Sam 先同 Andy 對齊 Fikma 設計，再搵 Marcus 按設計實作。實作好之後，Sam 要檢查成品有無走樣，尤其顏色有冇 off-brand。全部確認好，再搵返你做最後 sign-off。\n\n> Feature: 網上銀行：總覽資產配置圖\n> \n> 背景\n> 客戶服務不斷收到意見：用戶只看「帳戶列表＋餘額表格」時，難以 一眼看懂 現金、股票、債券等 佔比。商務與設計已對齊：先做圓形圖（pie）總覽，進階互動之後迭代。\n> \n> User story\n> 作為獅銀網上銀行／手機理財用戶，我希望能夠在資產總覽頁看到 按大類劃分的資產配置比例，讓我更清楚錢分佈喺邊，而唔使自己心算表格。\n> \n> Acceptance criteria\n> - 於指定總覽／資產區塊展示 資產大類扇形圖（至少：現金、股票、債券等與現有產品線一致之大類）。\n> - 每個分項需顯示名稱、金額及百分比（或與設計稿等價之展示方式）。\n> - 視覺與色彩須符合 Lion Bank digital design system。\n> - 設計定稿以 Fikma 及業務已簽文件為準；工程按定稿實作。\n> \n> 優先級： P2（體驗提升，非帳務核心路徑阻塞）',
  'knows-chart-viz-signoff-request':
    'Sam 而家 request 你做最終 sign-off。可以批准上線。叫 Sam 同 Marcus 協調推出正式環境。',
  'news-task-begin':
    'Sam 啱啱同 Marcus 收尾咗圖表上線。你要交代下一單係下季先做嘅「網銀首頁財經新聞」單篇 headline 區，業務只係有顯示新聞嘅方向，未有 UI 規格。內容來源係內部另一個團隊，Marcus 之前做過一啲探索。你要叫 Sam 用瀏覽器入面三個參考新聞頁做 benchmark，再同 Andy 喺 Fikma 砌一個單篇新聞稿 mockup，邊睇邊加元素。最後要 Sam 口頭同你匯報設計重點先當完成。完成後你會喺內聯網轉發 CEO 嘅總結帖俾佢。',
};

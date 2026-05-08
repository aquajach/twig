export const dev = {
  'knows-player-needs-credentials':
    "Sam 正在調查網銀測試站的登入故障。如果他詢問登入資訊，就提供：使用者名稱 'test'、密碼 '1234'。不要主動提供登入資訊，等他先開口。",
  'knows-error-code':
    'Sam 已嘗試登入，你在日誌中看到了，也回報了來自網銀登入頁的錯誤碼 ERR-LB-4012。你現在調查程式碼，發現問題是驗證服務設定中的 API Token 已過期。告訴 Sam 你已找到問題，是 auth service config 的過期 token，並且已把修復推到 TEST 場，請他試下。先唔好提發布到 production，等 Sam 確認 TEST 場可用先講下一步。',
  'knows-fix-verified':
    'Sam 已確認登入修復在測試環境可用。你已即時將 fix 發布到正式環境（已完成，唔係將會做）。下一個回覆要直接話俾 Sam 知 fix 已上 production，請佢通知 Sarah。唔好用「我諗下」、「我會」、「等陣」等字眼，要用完成式。',
  'knows-chart-viz-implementation-brief':
    'Sam 俾咗 Andy 嘅 Fikma 定稿(獅銀網上理財入面有個圓形圖)俾你 implement。你未了解係咩同需要做咩，所以要簡短向 Sam 確認細節。',
  'knows-chart-viz-off-brand-found':
    '你已經交咗第一版資產配置圖表到 TEST 場，但顏色未跟足品牌。當 Sam 指出 off-brand 顏色時，你要承認問題並即刻修正，然後請 Sam 再檢查。',
  'knows-chart-viz-fixed': '你已修正資產配置圖表嘅 off-brand 顏色，TEST 場版本已更新。請 Sam 搵 Sarah 做最後核准。',
  'knows-chart-viz-release-ready':
    'Sarah 已核准圖表功能。當 Sam 要求推出時，你要回覆已安排發佈到正式環境，並請 Sam 通知團隊收尾。',
  'knows-chart-viz-details':
    'Sam 同你解釋咗要 implement 總資產分佈圓形圖。你明白而家用戶只看「帳戶列表＋餘額表格」時，難以 一眼看懂 現金、股票、債券等 佔比。\n\n你明白用户能夠在資產總覽頁看到 按大類劃分的資產配置比例，就可以更清楚錢分佈喺邊，而唔使自己心算表格。',
  'knows-chart-viz-full-req':
    '你而家有齊 Fikma 上面嘅設計同明白 implementation 方向，啱啱就 push 咗上 TEST 場，問 Sam 睇下。Sam OK 就可以交俾 Sarah 過目。',
};

export const dev = {
  'knows-player-needs-credentials':
    "Sam 正在調查網銀測試站的登入故障。如果他詢問登入資訊，就提供：使用者名稱 'test'、密碼 '1234'。不要主動提供登入資訊，等他先開口。",
  'knows-error-code':
    'Sam 已嘗試登入，你在日誌中看到了，也回報了來自網銀登入頁的錯誤碼 ERR-LB-4012。你現在調查程式碼，發現問題是驗證服務設定中的 API Token 已過期。告訴 Sam 你已找到問題，是 auth service config 的過期 token，並且已把修復推到 TEST 場。等 Sam 確認可用後，再說你會立刻發布修補。',
  'knows-fix-verified':
    'Sam 已確認登入修復在測試環境可用。你現在應該告訴他你已將 fix 發布到正式環境。結束這段對話，問題已解決，請 Sam 把好消息告訴 Sarah。',
  'knows-chart-viz-implementation-brief':
    'Sam 會轉交 Andy 嘅 Fikma 定稿俾你做實作。你要簡短確認會跟設計交付，並表示會先更新 TEST 場俾 Sam 驗收。',
  'knows-chart-viz-off-brand-found':
    '你已經交咗第一版資產配置圖表到 TEST 場，但顏色未跟足品牌。當 Sam 指出 off-brand 顏色時，你要承認問題並即刻修正，然後請 Sam 再檢查。',
  'knows-chart-viz-fixed':
    '你已修正資產配置圖表嘅 off-brand 顏色，TEST 場版本已更新。請 Sam 搵 Andy 同 Sarah 做最後核准。',
  'knows-chart-viz-release-ready':
    'Andy 同 Sarah 已核准圖表功能。當 Sam 要求推出時，你要回覆已安排發佈到正式環境，並請 Sam 通知團隊收尾。',
};

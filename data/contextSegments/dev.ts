export const dev = {
  'knows-player-needs-credentials':
    "Sam 正在調查網銀測試站的登入故障。如果他詢問憑證，就提供：使用者名稱 'test'、密碼 '1234'。不要主動提供憑證，等他先開口。",
  'knows-error-code':
    'Sam 已嘗試登入，你在日誌中看到了，也回報了來自網銀登入頁的錯誤碼 ERR-LB-4012。你現在調查程式碼，發現問題是驗證服務設定中的 API Token 已過期。告訴 Sam 你已找到問題，是 auth service config 的過期 token，並且已把修復推到 TEST 場。等 Sam 確認可用後，再說你會立刻發布修補。',
  'knows-fix-verified':
    'Sam 已確認登入修復在測試環境可用。你現在應該告訴他你已將 fix 發布到正式環境。結束這段對話，問題已解決，請 Sam 把好消息告訴 Sarah。',
};

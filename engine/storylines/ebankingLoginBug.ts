import type { StorylineGraph } from '@/engine/types';

export const ebankingLoginBug: StorylineGraph = {
  id: 'ebankingLoginBug',
  title: '網銀登入錯誤',
  nodes: {
    'unlock-started-dev': {
      type: 'unlock_npc',
      npcId: 'dev',
      layout: {
        x: -1305,
        y: -405,
      },
    },
    'ebanking-login-bug-started': {
      type: 'step',
      description: '網銀登入錯誤劇情開始',
      createTask: ['task-get-credentials', 'task-investigate-login'],
      unlockContext: ['ctx-dev-credentials', 'ctx-manager-intro'],
      unlock_npc: ['unlock-started-dev'],
      layout: {
        x: -1629.0587098106926,
        y: -639.8858958290442,
      },
    },
    'ctx-manager-intro': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'knows-player-intro-replied',
      layout: {
        x: -1305,
        y: -315,
      },
    },
    'ctx-dev-credentials': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-player-needs-credentials',
      layout: {
        x: -1305,
        y: -195,
      },
    },
    'task-investigate-login': {
      type: 'task',
      task: {
        id: 'task-investigate-login',
        title: '調查登入錯誤',
        description: '在瀏覽器開啟網銀測試站並嘗試登入。',
      },
      layout: {
        x: -1168.4460145047883,
        y: -1091.8657930999457,
      },
    },
    'task-get-credentials': {
      type: 'task',
      task: {
        id: 'task-get-credentials',
        title: '向工程師取得測試憑證',
        description: '向資深工程師詢問網銀測試登入憑證。',
      },
      layout: {
        x: -610.6360727088099,
        y: -1090.797749026483,
      },
    },
    'evt-got-credentials': {
      type: 'evt_chat_message_received',
      npcId: 'dev',
      keywords: ['test', '1234', 'credential', 'login'],
      layout: {
        x: -1170,
        y: -840,
      },
    },
    'got-credentials': {
      type: 'step',
      description: '工程師回覆測試用帳號與密碼',
      triggeredBy: ['ebanking-login-bug-started', 'evt-got-credentials'],
      completeTask: ['task-get-credentials'],
      layout: {
        x: -855,
        y: -645,
      },
    },
    'evt-login-submit': {
      type: 'evt_browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
      layout: {
        x: -615,
        y: -840,
      },
    },
    'task-report-error-code': {
      type: 'task',
      task: {
        id: 'task-report-error-code',
        title: '向工程師回報錯誤碼',
        description: '把登入頁上的錯誤碼告訴資深工程師。',
      },
      layout: {
        x: 26.84387059408772,
        y: -1080.0087570822097,
      },
    },
    'got-error': {
      type: 'step',
      description: '玩家送出登入表單並看到錯誤碼',
      triggeredBy: ['evt-login-submit', 'got-credentials'],
      createTask: ['task-report-error-code'],
      completeTask: ['task-investigate-login'],
      layout: {
        x: -346.9013901360007,
        y: -643.3323205595957,
      },
    },
    'evt-report-error-sent': {
      type: 'evt_chat_message_sent',
      npcId: 'dev',
      keywords: ['ERR-LB-4012', '4012'],
      layout: {
        x: 30,
        y: -825,
      },
    },
    'ctx-dev-error-code': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-error-code',
      layout: {
        x: 675,
        y: -420,
      },
    },
    'reported-error': {
      type: 'step',
      description: '玩家把錯誤碼訊息告知工程師',
      triggeredBy: ['evt-report-error-sent', 'got-error'],
      completeTask: ['task-report-error-code'],
      unlockContext: ['ctx-dev-error-code'],
      layout: {
        x: 315,
        y: -645,
      },
    },
    'bs-login-fixed': {
      type: 'browser_state',
      pageId: 'lion-bank-ebanking',
      mode: 'update',
      state: {
        loginFixed: true,
      },
      layout: {
        x: -510,
        y: 795,
      },
    },
    'task-test-login-fix': {
      type: 'task',
      task: {
        id: 'task-test-login-fix',
        title: '驗證修復是否有效',
        description: '回到網銀測試站再次嘗試登入。',
      },
      layout: {
        x: -495,
        y: 45,
      },
    },
    'dev-fixes-bug': {
      type: 'step',
      description: '工程師回覆已找到並修好錯誤',
      triggeredBy: ['n-e60247ef0876', 'reported-error'],
      createTask: ['task-test-login-fix'],
      updatePageState: ['bs-login-fixed'],
      layout: {
        x: -825,
        y: 480,
      },
    },
    'task-confirm-fix': {
      type: 'task',
      task: {
        id: 'task-confirm-fix',
        title: '向工程師確認修復',
        description: '告訴工程師登入現在已恢復正常。',
      },
      layout: {
        x: 255,
        y: 45,
      },
    },
    'verified-fix': {
      type: 'step',
      description: '玩家在修復後成功登入',
      triggeredBy: ['dev-fixes-bug', 'n-3fa8a08706a4'],
      createTask: ['task-confirm-fix'],
      completeTask: ['task-test-login-fix'],
      layout: {
        x: -150,
        y: 480,
      },
    },
    'ctx-dev-fix-verified': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-fix-verified',
      layout: {
        x: 930,
        y: 780,
      },
    },
    'ctx-manager-fix-verified': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'knows-fix-verified',
      layout: {
        x: 945,
        y: 930,
      },
    },
    'confirmed-fix': {
      type: 'step',
      description: '玩家告知工程師登入已可正常使用',
      triggeredBy: ['n-3e769d48cdab', 'verified-fix'],
      completeTask: ['task-confirm-fix'],
      unlockContext: ['ctx-dev-fix-verified', 'ctx-manager-fix-verified'],
      grantMemo: ['memo-first-bug-fix'],
      layout: {
        x: 600,
        y: 480,
      },
    },
    'memo-first-bug-fix': {
      type: 'memo',
      memo: {
        id: 'memo-first-bug-fix',
        title: '除蟲達人',
        description: '你已順利完成首次正式環境錯誤修復的分類與驗證。',
        icon: '🐛',
      },
      layout: {
        x: 915,
        y: 525,
      },
    },
    'n-3fa8a08706a4': {
      type: 'evt_browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
      enabledBy: ['dev-fixes-bug'],
      layout: {
        x: -495,
        y: 285,
      },
    },
    'n-3e769d48cdab': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText: '玩家表示登入目前可用',
      enabledBy: ['dev-fixes-bug'],
      layout: {
        x: 255,
        y: 285,
      },
    },
    'n-e60247ef0876': {
      type: 'evt_intent_received',
      npcId: 'dev',
      statementText: 'NPC 表示他已修復錯誤',
      enabledBy: ['reported-error'],
      layout: {
        x: -1290,
        y: 510,
      },
    },
    'n-7fab830b6bad': {
      type: 'storyline_ref',
      storylineId: 'chartViz',
      layout: {
        x: 1365,
        y: 795,
      },
    },
    'n-177f7d6f9f16': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      enabledBy: ['confirmed-fix'],
      layout: {
        x: 900,
        y: 120,
      },
    },
    'n-ce9c6ef1ac5f': {
      type: 'step',
      triggeredBy: ['n-177f7d6f9f16'],
      activateStoryline: ['n-7fab830b6bad'],
      layout: {
        x: 1185,
        y: 315,
      },
    },
  },
  introCard: {
    label: 'Issue 1',
  },
};

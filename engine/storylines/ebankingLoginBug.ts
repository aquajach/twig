import type { StorylineGraph } from '@/engine/types';

export const ebankingLoginBug: StorylineGraph = {
  id: 'ebankingLoginBug',
  title: 'E-Banking Login Bug',
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
      description: 'E-Banking Login Bug started',
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
        title: 'Investigate the login error',
        description: 'Open the e-banking test site in the Browser and try to log in.',
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
        title: 'Get test credentials from developer',
        description: 'Ask the senior developer for the e-banking test login credentials.',
      },
      layout: {
        x: -610.6360727088099,
        y: -1090.797749026483,
      },
    },
    'evt-got-credentials': {
      type: 'evt_chat_message_received',
      npcId: 'dev',
      keywords: ['testuser', 'password', 'credential', 'login'],
      layout: {
        x: -1170,
        y: -840,
      },
    },
    'got-credentials': {
      type: 'step',
      description: 'Developer responds with test username and password',
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
        title: 'Report error code to developer',
        description: 'Tell the senior developer about the error code from the login page.',
      },
      layout: {
        x: 26.84387059408772,
        y: -1080.0087570822097,
      },
    },
    'got-error': {
      type: 'step',
      description: 'Player submits login form and sees the error code',
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
      description: 'Player messages developer with the error code',
      triggeredBy: ['evt-report-error-sent', 'got-error'],
      completeTask: ['task-report-error-code'],
      unlockContext: ['ctx-dev-error-code'],
      layout: {
        x: 315,
        y: -645,
      },
    },
    'evt-dev-fix-reply': {
      type: 'evt_chat_message_received',
      npcId: 'dev',
      keywords: ['fix', 'fixed', 'found', 'deploy'],
      enabledBy: ['reported-error'],
      layout: {
        x: -1290,
        y: 525,
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
        title: 'Verify the fix works',
        description: 'Go back to the e-banking test site and try logging in again.',
      },
      layout: {
        x: -495,
        y: 45,
      },
    },
    'dev-fixes-bug': {
      type: 'step',
      description: 'Developer responds confirming they found and fixed the bug',
      triggeredBy: ['evt-dev-fix-reply', 'reported-error'],
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
        title: 'Confirm the fix with developer',
        description: 'Let the developer know the login is working now.',
      },
      layout: {
        x: 255,
        y: 45,
      },
    },
    'verified-fix': {
      type: 'step',
      description: 'Player logs in successfully after the fix',
      triggeredBy: ['dev-fixes-bug', 'n-3fa8a08706a4'],
      createTask: ['task-confirm-fix'],
      completeTask: ['task-test-login-fix'],
      layout: {
        x: -150,
        y: 480,
      },
    },
    'evt-confirm-fix-sent': {
      type: 'evt_chat_message_sent',
      npcId: 'dev',
      keywords: ['work', 'works', 'success', 'fixed', 'login', 'good', 'confirm'],
      enabledBy: ['dev-fixes-bug'],
      layout: {
        x: 255,
        y: 300,
      },
    },
    'ctx-dev-fix-verified': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-fix-verified',
      layout: {
        x: 930,
        y: 675,
      },
    },
    'ctx-manager-fix-verified': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'knows-fix-verified',
      layout: {
        x: 930,
        y: 795,
      },
    },
    'confirmed-fix': {
      type: 'step',
      description: 'Player tells developer the login works',
      triggeredBy: ['evt-confirm-fix-sent', 'verified-fix'],
      completeTask: ['task-confirm-fix'],
      unlockContext: ['ctx-dev-fix-verified', 'ctx-manager-fix-verified'],
      layout: {
        x: 600,
        y: 480,
      },
    },
    'evt-patch-announce': {
      type: 'evt_chat_message_received',
      npcId: 'dev',
      keywords: ['production', 'live'],
      enabledBy: ['confirmed-fix'],
      layout: {
        x: 1005,
        y: 345,
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
        x: 1770,
        y: 690,
      },
    },
    'patch-announced': {
      type: 'step',
      description: 'Developer responds confirming they will release a patch',
      triggeredBy: ['confirmed-fix', 'evt-patch-announce'],
      grantMemo: ['memo-first-bug-fix'],
      layout: {
        x: 1410,
        y: 495,
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
  },
  introCard: {
    label: 'Issue 1',
  },
};

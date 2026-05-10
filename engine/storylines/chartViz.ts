import type { StorylineGraph } from '@/engine/types';

export const chartViz: StorylineGraph = {
  id: 'chartViz',
  title: '圖表視覺化',
  nodes: {
    'step-chartviz-start': {
      type: 'step',
      description: '設定Andy context 並新增任務。',
      triggeredBy: ['n-21853acc863e'],
      createTask: ['task-align-andy'],
      unlockContext: ['ctx-andy-chartviz-brief'],
      layout: {
        x: -1575,
        y: -795,
      },
    },
    'unlock-andy': {
      type: 'unlock_npc',
      npcId: 'andy',
      layout: {
        x: -1830,
        y: -480,
      },
    },
    'ctx-manager-chartviz-begin': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'chart-viz-task-begin',
      layout: {
        x: -1830,
        y: -360,
      },
    },
    'ctx-andy-chartviz-brief': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-chart-viz-brief',
      layout: {
        x: -1380,
        y: -390,
      },
    },
    'task-align-andy': {
      type: 'task',
      task: {
        id: 'task-align-andy',
        title: '和 Andy 對齊需求',
        description: '向 Andy 確認資產配置圓形圖設計並打開 Fikma 定稿。',
      },
      layout: {
        x: -1095,
        y: -1245,
      },
    },
    'step-andy-briefed': {
      type: 'step',
      description: '玩家發信息給Andy。',
      triggeredBy: ['n-94f22225004d', 'step-chartviz-start'],
      createTask: ['task-handoff-marcus', 'task-signoff-manager'],
      completeTask: ['task-align-andy'],
      unlockContext: ['ctx-andy-mockup-ready'],
      wetalkLink: ['link-andy-fikma'],
      updatePageState: ['bs-fikma-chart-mockup'],
      layout: {
        x: -1005,
        y: -705,
      },
    },
    'ctx-andy-mockup-ready': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-mockup-share-ready',
      layout: {
        x: -630,
        y: -240,
      },
    },
    'link-andy-fikma': {
      type: 'wetalk_link',
      npcId: 'andy',
      linkLabel: '獅銀理財資產分配圖 | Fikma',
      pageId: 'fikma',
      layout: {
        x: -630,
        y: -420,
      },
    },
    'bs-fikma-chart-mockup': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        activeScreenId: 'chart-final',
        screens: [
          {
            id: 'chart-final',
            name: 'Asset Allocation Pie',
            screenKey: 'asset-allocation-pie-mockup',
            props: {
              chartOffBrand: false,
            },
          },
        ],
      },
      layout: {
        x: -390,
        y: -525,
      },
    },
    'task-handoff-marcus': {
      type: 'task',
      task: {
        id: 'task-handoff-marcus',
        title: '將設計轉交 Marcus',
        description: '向 Marcus 交代 Fikma 上設計及解釋圖表方案。',
      },
      layout: {
        x: -390,
        y: -1125,
      },
    },
    'step-dev-briefed': {
      type: 'step',
      triggeredBy: ['n-c511f98cc8de', 'step-andy-briefed'],
      completeTask: ['task-handoff-marcus'],
      unlockContext: ['ctx-dev-chartviz-brief'],
      layout: {
        x: 105,
        y: -525,
      },
    },
    'ctx-dev-chartviz-brief': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-implementation-brief',
      layout: {
        x: 405,
        y: -420,
      },
    },
    'evt-dev-test-ready': {
      type: 'evt_intent_received',
      npcId: 'dev',
      statementText: 'NPC 表示 chart feature 已更新到 TEST 場',
      enabledBy: ['n-f395921e24dd'],
      layout: {
        x: 345,
        y: -1365,
      },
    },
    'step-dev-delivered-offbrand': {
      type: 'step',
      triggeredBy: ['evt-dev-test-ready'],
      unlockContext: ['ctx-dev-offbrand-found', 'ctx-manager-signoff'],
      updatePageState: ['bs-lion-chart-offbrand'],
      layout: {
        x: 585,
        y: -975,
      },
    },
    'bs-lion-chart-offbrand': {
      type: 'browser_state',
      pageId: 'lion-bank-ebanking',
      mode: 'update',
      state: {
        loginFixed: true,
        chartImplemented: true,
        chartOffBrand: true,
      },
      layout: {
        x: 885,
        y: -525,
      },
    },
    'ctx-dev-offbrand-found': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-off-brand-found',
      layout: {
        x: 885,
        y: -300,
      },
    },
    'memo-chart-brand-guard': {
      type: 'memo',
      memo: {
        id: 'memo-chart-brand-guard',
        title: '品牌色守門員',
        description: '你喺驗收時發現圖表用咗 off-brand 顏色，同 Marcus 指出問題並推動修正。',
        icon: '👁',
      },
      layout: {
        x: 1635,
        y: -1875,
      },
    },
    'step-dev-fixed-color': {
      type: 'step',
      triggeredBy: ['n-fecf948c50f3', 'step-dev-delivered-offbrand'],
      unlockContext: ['ctx-dev-chart-fixed'],
      grantMemo: ['memo-chart-brand-guard'],
      updatePageState: ['bs-lion-chart-fixed'],
      layout: {
        x: 1065,
        y: -1800,
      },
    },
    'bs-lion-chart-fixed': {
      type: 'browser_state',
      pageId: 'lion-bank-ebanking',
      mode: 'update',
      state: {
        loginFixed: true,
        chartImplemented: true,
        chartOffBrand: false,
      },
      layout: {
        x: 1395,
        y: -1755,
      },
    },
    'ctx-dev-chart-fixed': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-fixed',
      layout: {
        x: 1410,
        y: -1890,
      },
    },
    'ctx-manager-signoff': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'knows-chart-viz-signoff-request',
      layout: {
        x: 885,
        y: -165,
      },
    },
    'task-signoff-manager': {
      type: 'task',
      task: {
        id: 'task-signoff-manager',
        title: '實作完成後請 Sarah 核准功能',
        description: '請 Sarah 確認功能可交付。',
      },
      layout: {
        x: 1620,
        y: -1245,
      },
    },
    'step-manager-approved': {
      type: 'step',
      triggeredBy: ['n-c79304f74e78', 'step-dev-delivered-offbrand'],
      createTask: ['task-release-chart'],
      completeTask: ['task-signoff-manager'],
      unlockContext: ['ctx-dev-release-ready'],
      layout: {
        x: 1905,
        y: -780,
      },
    },
    'ctx-dev-release-ready': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-release-ready',
      layout: {
        x: 2205,
        y: -405,
      },
    },
    'task-release-chart': {
      type: 'task',
      task: {
        id: 'task-release-chart',
        title: '推出圖表功能',
        description: '與 Marcus 協調把資產配置圖表推出正式環境。',
      },
      layout: {
        x: 2865,
        y: -1155,
      },
    },
    'step-release-done': {
      type: 'step',
      triggeredBy: ['n-1fdabf7febe4', 'step-manager-approved'],
      completeTask: ['task-release-chart'],
      layout: {
        x: 2730,
        y: -705,
      },
    },
    'n-94f22225004d': {
      type: 'evt_chat_message_sent',
      npcId: 'andy',
      layout: {
        x: -1290,
        y: -810,
      },
    },
    'n-c511f98cc8de': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText: 'Player 向 NPC 表示設計已在 Fikma，可以開始實現chart visualization feature。',
      layout: {
        x: -150,
        y: -765,
      },
    },
    'n-c1223360f608': {
      type: 'step',
      triggeredBy: ['n-1b87d4501cb2'],
      unlockContext: ['n-9cfea70886d4'],
      layout: {
        x: 105,
        y: -345,
      },
    },
    'n-1b87d4501cb2': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText: 'Player 向 NPC 解釋資產分配圖表細節',
      enabledBy: ['step-andy-briefed'],
      layout: {
        x: -150,
        y: -120,
      },
    },
    'n-9cfea70886d4': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-details',
      layout: {
        x: 405,
        y: -240,
      },
    },
    'n-f395921e24dd': {
      type: 'step',
      description: 'Marcus sees Fikma and knows requirement',
      triggeredBy: ['n-c1223360f608', 'step-dev-briefed'],
      unlockContext: ['n-f4e1260fe0fa'],
      layout: {
        x: 105,
        y: -1215,
      },
    },
    'n-f4e1260fe0fa': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-full-req',
      layout: {
        x: 345,
        y: -1050,
      },
    },
    'n-fecf948c50f3': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText: 'Player 向NPC 提出他所作的版本顏色跟Fikma 裡的不對。',
      enabledBy: ['step-dev-delivered-offbrand'],
      layout: {
        x: 795,
        y: -1905,
      },
    },
    'n-c79304f74e78': {
      type: 'evt_intent_sent',
      npcId: 'manager',
      statementText: 'Player 向 NPC 請求sign-off/approval/核准。',
      enabledBy: ['step-dev-delivered-offbrand'],
      layout: {
        x: 1605,
        y: -615,
      },
    },
    'n-1fdabf7febe4': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText: 'Player 向 NPC 表示 feature deploy/release 請求。',
      enabledBy: ['step-manager-approved'],
      layout: {
        x: 2490,
        y: -525,
      },
    },
    'n-21853acc863e': {
      type: 'step',
      description: '圖表視覺化劇情開始',
      unlockContext: ['ctx-manager-chartviz-begin'],
      unlock_npc: ['unlock-andy'],
      layout: {
        x: -2130,
        y: -735,
      },
    },
  },
  introCard: {
    label: 'Issue 2',
  },
};

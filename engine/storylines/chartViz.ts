import type { StorylineGraph } from '@/engine/types';

export const chartViz: StorylineGraph = {
  id: 'chartViz',
  title: '圖表視覺化',
  nodes: {
    'unlock-andy': {
      type: 'unlock_npc',
      npcId: 'andy',
      layout: {
        x: -1830,
        y: -480,
      },
    },
    'ctx-andy-chartviz-brief': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-chart-viz-brief',
      layout: {
        x: -1830,
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
    'unlock-page-fikma': {
      type: 'unlock_browser_page',
      pageId: 'fikma',
      layout: {
        x: -1125,
        y: -210,
      },
    },
    'step-andy-briefed': {
      type: 'step',
      description: '玩家發信息給Andy。',
      triggeredBy: ['n-21853acc863e', 'n-94f22225004d'],
      createTask: ['task-handoff-marcus', 'task-signoff-manager'],
      completeTask: ['task-align-andy'],
      unlockContext: ['ctx-andy-mockup-ready'],
      unlock_browser_page: ['unlock-page-fikma'],
      wetalkLink: ['link-andy-fikma'],
      updatePageState: ['bs-fikma-chart-mockup'],
      layout: {
        x: -1470,
        y: -735,
      },
    },
    'ctx-andy-mockup-ready': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-mockup-share-ready',
      layout: {
        x: -1125,
        y: -330,
      },
    },
    'link-andy-fikma': {
      type: 'wetalk_link',
      npcId: 'andy',
      linkLabel: '獅銀理財資產分配圖 | Fikma',
      pageId: 'fikma',
      layout: {
        x: -1125,
        y: -495,
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
        x: -1125,
        y: -135,
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
        x: -450,
        y: -1080,
      },
    },
    'step-dev-briefed': {
      type: 'step',
      triggeredBy: ['n-c511f98cc8de', 'step-andy-briefed'],
      unlockContext: ['ctx-dev-chartviz-brief'],
      layout: {
        x: -195,
        y: -510,
      },
    },
    'ctx-dev-chartviz-brief': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-implementation-brief',
      layout: {
        x: 60,
        y: -330,
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
      description: 'Player request chart feature release',
      triggeredBy: ['n-1fdabf7febe4', 'step-manager-approved'],
      completeTask: ['task-release-chart'],
      layout: {
        x: 2730,
        y: -705,
      },
    },
    'evt-marcus-chart-released-confirmed': {
      type: 'evt_intent_received',
      npcId: 'dev',
      statementText:
        'NPC confirms the chart visualization feature has been released to production and tells Sam to sync with Sarah Chen on the next initiative.',
      enabledBy: ['step-release-done'],
      layout: {
        x: 3000,
        y: -855,
      },
    },
    'ctx-dev-chart-released-handoff': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-released-handoff',
      layout: {
        x: 3540,
        y: -540,
      },
    },
    'step-chart-released-handoff': {
      type: 'step',
      description: 'Marcus confirms chart shipped; Sam should check in with Sarah',
      triggeredBy: ['evt-marcus-chart-released-confirmed', 'step-release-done'],
      unlockContext: ['ctx-dev-chart-released-handoff'],
      layout: {
        x: 3255,
        y: -705,
      },
    },
    'evt-sarah-follow-up-after-chart': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      enabledBy: ['step-chart-released-handoff'],
      layout: {
        x: 3540,
        y: -855,
      },
    },
    'ctx-manager-news-task-begin': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'news-task-begin',
      layout: {
        x: 4140,
        y: -540,
      },
    },
    'ref-storyline-news': {
      type: 'storyline_ref',
      storylineId: 'news',
      layout: {
        x: 4140,
        y: -405,
      },
    },
    'step-activate-news-storyline': {
      type: 'step',
      triggeredBy: ['evt-sarah-follow-up-after-chart', 'step-chart-released-handoff'],
      unlockContext: ['ctx-manager-news-task-begin'],
      activateStoryline: ['ref-storyline-news'],
      layout: {
        x: 3825,
        y: -705,
      },
    },
    'n-94f22225004d': {
      type: 'evt_chat_message_sent',
      npcId: 'andy',
      layout: {
        x: -1770,
        y: -975,
      },
    },
    'n-c511f98cc8de': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText:
        "Player mentions Fikma or Andy's design to NPC, or in more details, Andy prepared a design mockup on Fikma regarding the chart visualization feature.",
      layout: {
        x: -450,
        y: -765,
      },
    },
    'n-c1223360f608': {
      type: 'step',
      triggeredBy: ['n-1b87d4501cb2'],
      unlockContext: ['n-9cfea70886d4'],
      layout: {
        x: -195,
        y: -210,
      },
    },
    'n-1b87d4501cb2': {
      type: 'evt_intent_sent',
      npcId: 'dev',
      statementText: 'Player explains/insinuates feature (or in more details, chart visualization) to NPC.',
      enabledBy: ['step-andy-briefed'],
      layout: {
        x: -465,
        y: -105,
      },
    },
    'n-9cfea70886d4': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-details',
      layout: {
        x: 90,
        y: -15,
      },
    },
    'n-f395921e24dd': {
      type: 'step',
      description: 'Marcus sees Fikma and knows requirement',
      triggeredBy: ['n-c1223360f608', 'step-dev-briefed'],
      completeTask: ['task-handoff-marcus'],
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
      createTask: ['task-align-andy'],
      unlockContext: ['ctx-andy-chartviz-brief'],
      unlock_npc: ['unlock-andy'],
      layout: {
        x: -2130,
        y: -735,
      },
    },
    'n-37d0c0b1f393': {
      type: 'npc_message',
      npcId: 'andy',
      content:
        'Hello, welcome onboard 🦁. 呢個 link 係我 design 嘅 UI 樣板。Sarah 啱啱同咗我剛話你會嚟揾我。同你講下成個 feature 嘅來龍去脈先',
      layout: {
        x: -1125,
        y: 75,
      },
    },
    'n-df0eb023ab7c': {
      type: 'step',
      description: 'Andy 2nd reply',
      triggeredBy: ['step-andy-briefed'],
      sendMessage: ['n-37d0c0b1f393'],
      layout: {
        x: -1470,
        y: -375,
      },
    },
  },
  introCard: {
    label: 'Issue 2',
  },
};

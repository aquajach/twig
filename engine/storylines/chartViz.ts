import type { StorylineGraph } from '@/engine/types';

export const chartViz: StorylineGraph = {
  id: 'chartViz',
  title: '圖表視覺化',
  nodes: {
    'step-chartviz-start': {
      type: 'step',
      createTask: ['task-align-andy'],
      unlockContext: ['ctx-andy-chartviz-brief', 'ctx-manager-chartviz-begin'],
      unlock_npc: ['unlock-andy'],
      sendMessage: ['msg-manager-kickoff'],
      layout: {
        x: -1665,
        y: -705,
      },
    },
    'unlock-andy': {
      type: 'unlock_npc',
      npcId: 'andy',
      layout: {
        x: -1155,
        y: -435,
      },
    },
    'msg-manager-kickoff': {
      type: 'npc_message',
      npcId: 'manager',
      content: 'Issue 2 到你手。先去 Fikma 同 Andy 對齊設計，然後搵 Marcus 跟進實作。',
      layout: {
        x: -1155,
        y: -345,
      },
    },
    'ctx-manager-chartviz-begin': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'chart-viz-task-begin',
      layout: {
        x: -1380,
        y: -255,
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
        description: '向 Andy 確認資產配置扇形圖設計並打開 Fikma 定稿。',
      },
      layout: {
        x: -1095,
        y: -1245,
      },
    },
    'evt-andy-asset-allocation': {
      type: 'evt_chat_message_sent',
      npcId: 'andy',
      keywords: ['資產配置'],
      layout: {
        x: -1095,
        y: -945,
      },
    },
    'evt-andy-pie-chart': {
      type: 'evt_chat_message_sent',
      npcId: 'andy',
      keywords: ['扇形圖'],
      layout: {
        x: -840,
        y: -945,
      },
    },
    'step-andy-briefed': {
      type: 'step',
      triggeredBy: ['evt-andy-asset-allocation', 'evt-andy-pie-chart', 'step-chartviz-start'],
      createTask: ['task-handoff-marcus'],
      completeTask: ['task-align-andy'],
      unlockContext: ['ctx-andy-mockup-ready'],
      wetalkLink: ['link-andy-fikma'],
      updatePageState: ['bs-fikma-chart-mockup'],
      layout: {
        x: -660,
        y: -705,
      },
    },
    'ctx-andy-mockup-ready': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-mockup-share-ready',
      layout: {
        x: -420,
        y: -405,
      },
    },
    'link-andy-fikma': {
      type: 'wetalk_link',
      npcId: 'andy',
      linkLabel: 'Open Fikma final mockup',
      pageId: 'fikma',
      layout: {
        x: -390,
        y: -645,
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
            props: { chartOffBrand: false },
          },
        ],
      },
      layout: {
        x: -390,
        y: -870,
      },
    },
    'task-handoff-marcus': {
      type: 'task',
      task: {
        id: 'task-handoff-marcus',
        title: '將設計轉交 Marcus',
        description: '向 Marcus 解釋功能並按 Fikma 定稿安排實作。',
      },
      layout: {
        x: -390,
        y: -1125,
      },
    },
    'evt-dev-briefed': {
      type: 'evt_chat_message_sent',
      npcId: 'dev',
      keywords: ['Fikma', '資產配置'],
      layout: {
        x: -150,
        y: -945,
      },
    },
    'step-dev-briefed': {
      type: 'step',
      triggeredBy: ['evt-dev-briefed', 'step-andy-briefed'],
      createTask: ['task-test-chart-build'],
      completeTask: ['task-handoff-marcus'],
      unlockContext: ['ctx-dev-chartviz-brief'],
      layout: {
        x: 90,
        y: -705,
      },
    },
    'ctx-dev-chartviz-brief': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-implementation-brief',
      layout: {
        x: 330,
        y: -285,
      },
    },
    'task-test-chart-build': {
      type: 'task',
      task: {
        id: 'task-test-chart-build',
        title: '驗收圖表功能',
        description: '去 TEST 場檢查新資產配置圖表是否按設計實作。',
      },
      layout: {
        x: 330,
        y: -1065,
      },
    },
    'evt-dev-test-ready': {
      type: 'evt_intent_received',
      npcId: 'dev',
      statementText: 'NPC 表示 chart feature 已更新到 TEST 場',
      enabledBy: ['step-dev-briefed'],
      layout: {
        x: 330,
        y: -825,
      },
    },
    'step-dev-delivered-offbrand': {
      type: 'step',
      triggeredBy: ['evt-dev-test-ready', 'step-dev-briefed'],
      createTask: ['task-request-color-fix'],
      completeTask: ['task-test-chart-build'],
      unlockContext: ['ctx-dev-offbrand-found'],
      updatePageState: ['bs-lion-chart-offbrand'],
      layout: {
        x: 600,
        y: -705,
      },
    },
    'step-chartviz-ready-for-review': {
      type: 'step',
      triggeredBy: ['step-dev-delivered-offbrand'],
      createTask: ['task-signoff-andy', 'task-signoff-manager'],
      completeTask: ['task-request-color-fix'],
      unlockContext: ['ctx-andy-signoff', 'ctx-manager-signoff'],
      layout: {
        x: 885,
        y: -720,
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
    'task-request-color-fix': {
      type: 'task',
      task: {
        id: 'task-request-color-fix',
        title: '（選擇）要求修正 off-brand 顏色',
        description:
          '如發現 TEST 場圖表顏色唔跟品牌，同 Marcus 指出並要求修正——做到會解锁成就；跳過依然可以請 Andy／Sarah sign-off。',
      },
      layout: {
        x: 855,
        y: -1230,
      },
    },
    'evt-dev-color-fix-request': {
      type: 'evt_chat_message_sent',
      npcId: 'dev',
      keywords: ['off-brand', '顏色', '品牌'],
      layout: {
        x: 1170,
        y: -810,
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
        x: 1695,
        y: -210,
      },
    },
    'step-dev-fixed-color': {
      type: 'step',
      triggeredBy: ['evt-dev-color-fix-request', 'step-dev-delivered-offbrand'],
      completeTask: ['task-request-color-fix'],
      unlockContext: ['ctx-dev-chart-fixed'],
      grantMemo: ['memo-chart-brand-guard'],
      updatePageState: ['bs-lion-chart-fixed'],
      layout: {
        x: 1410,
        y: -540,
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
        x: 1545,
        y: -975,
      },
    },
    'ctx-dev-chart-fixed': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-fixed',
      layout: {
        x: 1680,
        y: -345,
      },
    },
    'ctx-andy-signoff': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-signoff-request',
      layout: {
        x: 1215,
        y: -315,
      },
    },
    'ctx-manager-signoff': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'knows-chart-viz-signoff-request',
      layout: {
        x: 1215,
        y: -180,
      },
    },
    'task-signoff-andy': {
      type: 'task',
      task: {
        id: 'task-signoff-andy',
        title: '請 Andy 核准設計',
        description: '請 Andy 在 TEST 場檢查圖表實作並做 design sign-off。',
      },
      layout: {
        x: 1545,
        y: -1230,
      },
    },
    'task-signoff-manager': {
      type: 'task',
      task: {
        id: 'task-signoff-manager',
        title: '請 Sarah 核准功能',
        description: '請 Sarah 確認功能可交付。',
      },
      layout: {
        x: 1800,
        y: -1230,
      },
    },
    'evt-andy-approved': {
      type: 'evt_chat_message_sent',
      npcId: 'andy',
      keywords: ['核准', 'approved', 'sign-off'],
      layout: {
        x: 1800,
        y: -960,
      },
    },
    'step-andy-approved': {
      type: 'step',
      triggeredBy: ['evt-andy-approved', 'step-chartviz-ready-for-review'],
      completeTask: ['task-signoff-andy'],
      layout: {
        x: 2010,
        y: -705,
      },
    },
    'evt-manager-approved': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      keywords: ['核准', 'approved', 'sign-off'],
      layout: {
        x: 2055,
        y: -960,
      },
    },
    'step-manager-approved': {
      type: 'step',
      triggeredBy: ['evt-manager-approved', 'step-chartviz-ready-for-review'],
      createTask: ['task-release-chart'],
      completeTask: ['task-signoff-manager'],
      unlockContext: ['ctx-dev-release-ready'],
      layout: {
        x: 2250,
        y: -705,
      },
    },
    'ctx-dev-release-ready': {
      type: 'context',
      npcId: 'dev',
      contextKey: 'knows-chart-viz-release-ready',
      layout: {
        x: 2490,
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
        x: 2490,
        y: -1050,
      },
    },
    'evt-dev-release': {
      type: 'evt_chat_message_sent',
      npcId: 'dev',
      keywords: ['推出', 'production', '正式'],
      layout: {
        x: 2490,
        y: -795,
      },
    },
    'step-release-done': {
      type: 'step',
      triggeredBy: ['evt-dev-release', 'step-andy-approved', 'step-manager-approved'],
      completeTask: ['task-release-chart'],
      sendMessage: ['msg-manager-wrapup'],
      layout: {
        x: 2730,
        y: -705,
      },
    },
    'msg-manager-wrapup': {
      type: 'npc_message',
      npcId: 'manager',
      content: 'Nice work，Issue 2 已完成並上線，收尾啦。',
      layout: {
        x: 2970,
        y: -705,
      },
    },
  },
  introCard: {
    label: 'Issue 2',
  },
};

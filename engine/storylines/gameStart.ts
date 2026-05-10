import type { StorylineGraph } from '@/engine/types';

export const gameStart: StorylineGraph = {
  id: 'gameStart',
  title: '遊戲開始',
  nodes: {
    'unlock-init-manager': {
      type: 'unlock_npc',
      npcId: 'manager',
      layout: {
        x: -330,
        y: 300,
      },
    },
    'unlock-page-lion-ebanking': {
      type: 'unlock_browser_page',
      pageId: 'lion-bank-ebanking',
      layout: {
        x: -330,
        y: 570,
      },
    },
    init: {
      type: 'step',
      description: '首次載入時初始化遊戲世界',
      unlock_npc: ['unlock-init-manager'],
      unlock_browser_page: ['unlock-page-lion-ebanking'],
      sendMessage: ['nm-welcome'],
      layout: {
        x: -600,
        y: 90,
      },
    },
    'nm-welcome': {
      type: 'npc_message',
      npcId: 'manager',
      content:
        '早晨啊。好高興你今日 onboard 獅銀。期待同你一齊合作。得嘅時候 send 個 message 俾我等我介紹第一個任務俾你',
      layout: {
        x: -330,
        y: 390,
      },
    },
    'evt-manager-reply': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      layout: {
        x: 45,
        y: -60,
      },
    },
    'ref-ebanking': {
      type: 'storyline_ref',
      storylineId: 'ebankingLoginBug',
      layout: {
        x: 570,
        y: 285,
      },
    },
    'manager-intro-replied': {
      type: 'step',
      description: '玩家在收到新人訊息後回覆主管',
      triggeredBy: ['evt-manager-reply', 'init'],
      activateStoryline: ['ref-ebanking'],
      layout: {
        x: 300,
        y: 90,
      },
    },
  },
  initialStatus: 'active',
};

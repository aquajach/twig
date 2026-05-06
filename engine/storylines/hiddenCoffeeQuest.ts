import type { StorylineGraph } from '@/engine/types';

export const hiddenCoffeeQuest: StorylineGraph = {
  id: 'hiddenCoffeeQuest',
  title: '???',
  nodes: {
    'evt-coffee': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      keywords: ['coffee', 'cafe', 'caffeine'],
      layout: {
        x: -186.58836826522037,
        y: 216.30487851240122,
      },
    },
    'memo-coffee-lover': {
      type: 'memo',
      memo: {
        id: 'coffee-lover',
        title: '咖啡行家',
        description: '發現了主管對咖啡的痴迷。',
        icon: '☕',
      },
      layout: {
        x: 392.6472471835194,
        y: 283.14084294386055,
      },
    },
    'mention-coffee': {
      type: 'step',
      description: 'Player mentions coffee to the manager',
      triggeredBy: ['evt-coffee'],
      grantMemo: ['memo-coffee-lover'],
      layout: {
        x: 102,
        y: 108,
      },
    },
  },
  initialStatus: 'active',
};

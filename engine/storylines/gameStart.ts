import type { StorylineGraph } from '@/engine/types';

export const gameStart: StorylineGraph = {
  id: 'gameStart',
  title: 'Game Start',
  nodes: {
    'unlock-init-manager': {
      type: 'unlock_npc',
      npcId: 'manager',
      layout: {
        x: -334.4756637290336,
        y: 487.99235844884396,
      },
    },
    init: {
      type: 'step',
      description: 'Bootstrap the game world on first load',
      unlock_npc: ['unlock-init-manager'],
      layout: {
        x: -592.9327936033667,
        y: 96.28621939485475,
      },
    },
    'nm-welcome': {
      type: 'npc_message',
      npcId: 'manager',
      content:
        "Welcome aboard! Glad to have you on the team. We're excited to work with you. Ping me so we can start working on your first task.",
      layout: {
        x: 106.62450458982812,
        y: 475.3566765438765,
      },
    },
    'manager-reports-bug': {
      type: 'step',
      description: 'Manager messages player about the onboarding',
      triggeredBy: ['init'],
      sendMessage: ['nm-welcome'],
      layout: {
        x: -145.23069681201898,
        y: 92.39172878393009,
      },
    },
    'evt-manager-reply': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      layout: {
        x: 91.35282267189115,
        y: -53.73203020030951,
      },
    },
    'ref-ebanking': {
      type: 'storyline_ref',
      storylineId: 'ebankingLoginBug',
      layout: {
        x: 672.9241703945282,
        y: 300.30635877477516,
      },
    },
    'manager-intro-replied': {
      type: 'step',
      description: 'Player replies to manager after receiving the onboarding message',
      triggeredBy: ['evt-manager-reply', 'manager-reports-bug'],
      activateStoryline: ['ref-ebanking'],
      layout: {
        x: 379.80107497977474,
        y: 94.14869835499704,
      },
    },
  },
};

import type { StorylineGraph } from '@/engine/types';

export const gameStart: StorylineGraph = {
  id: 'gameStart',
  title: 'Game Start',
  nodes: {
    'unlock-init-manager': {
      type: 'unlock_npc',
      npcId: 'manager',
      layout: {
        x: -330,
        y: 300,
      },
    },
    init: {
      type: 'step',
      description: 'Bootstrap the game world on first load',
      unlock_npc: ['unlock-init-manager'],
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
        "Welcome aboard! Glad to have you on the team. We're excited to work with you. Ping me so we can start working on your first task.",
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
      description: 'Player replies to manager after receiving the onboarding message',
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

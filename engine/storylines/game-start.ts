import type { Storyline } from '@/engine/types';

export const gameStart: Storyline = {
  id: 'game-start',
  title: 'Game Start',
  steps: [
    {
      id: 'init',
      description: 'Bootstrap the game world on first load',
      trigger: { type: 'manual' },
      effects: [{ type: 'unlock_npc', npcId: 'manager' }],
    },
    {
      id: 'manager-reports-bug',
      description: 'Manager messages player about the broken login',
      trigger: { type: 'manual' },
      effects: [
        {
          type: 'send_npc_message',
          npcId: 'manager',
          content:
            "Welcome aboard! Glad to have you on the team. We're excited to work with you. Ping me so we can start working on your first task.",
        },
      ],
    },
    {
      id: 'manager-intro-replied',
      description: 'Player replies to manager after receiving the onboarding message',
      trigger: { type: 'chat_message_sent', npcId: 'manager' },
      effects: [{ type: 'activate_storyline', storylineId: 'ebanking-login-bug' }],
    },
  ],
};

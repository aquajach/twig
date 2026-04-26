import type { Storyline } from '@/engine/types';

export const gameStart: Storyline = {
  id: 'game-start',
  title: 'Game Start',
  steps: [
    {
      id: 'init',
      description: 'Bootstrap the game world on first load',
      trigger: { type: 'manual' },
      effects: [
        { type: 'unlock_npc', npcId: 'manager' },
        { type: 'activate_storyline', storylineId: 'ebanking-login-bug' },
      ],
    },
  ],
};

import type { Storyline } from '@/engine/types';

export const hiddenCoffeeQuest: Storyline = {
  id: 'hidden-coffee-quest',
  title: '???',
  initialStatus: 'active',
  steps: [
    {
      id: 'mention-coffee',
      description: 'Player mentions coffee to the manager',
      trigger: {
        type: 'chat_message_sent',
        npcId: 'manager',
        keywords: ['coffee', 'cafe', 'caffeine'],
      },
      effects: [
        {
          type: 'grant_memo',
          memo: {
            id: 'coffee-lover',
            title: 'Coffee Connoisseur',
            description: "Discovered the manager's secret coffee obsession.",
          },
        },
      ],
    },
  ],
};

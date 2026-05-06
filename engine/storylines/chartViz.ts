import type { StorylineGraph } from '@/engine/types';

export const chartViz: StorylineGraph = {
  id: 'chartViz',
  title: 'Chart Visualization',
  nodes: {
    'n-2da09d667cae': {
      type: 'step',
      createTask: ['n-f50ed7e50c54'],
      unlockContext: ['n-2e9c4d2a6573'],
      sendMessage: ['n-7a8427f175df'],
      layout: {
        x: -225,
        y: -195,
      },
    },
    'n-7a8427f175df': {
      type: 'npc_message',
      npcId: 'manager',
      content: "Good job on fixing the login. Now let's do something more challenging.",
      layout: {
        x: 30,
        y: -15,
      },
    },
    'n-2e9c4d2a6573': {
      type: 'context',
      npcId: 'manager',
      contextKey: 'chart-viz-task-begin',
      layout: {
        x: 30,
        y: 150,
      },
    },
    'n-f50ed7e50c54': {
      type: 'task',
      task: {
        id: 'n-f50ed7e50c54',
        title: 'Talk to Priya',
        description: 'Get data visualization mockup from Priya',
      },
      layout: {
        x: 30,
        y: -450,
      },
    },
  },
  introCard: {
    label: 'Issue 2',
  },
};

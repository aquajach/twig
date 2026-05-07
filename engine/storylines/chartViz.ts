import type { StorylineGraph } from '@/engine/types';

export const chartViz: StorylineGraph = {
  id: 'chartViz',
  title: '圖表視覺化',
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
      content: '登入都 fix 得幾快喎。我有下一個挑戰俾你',
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
        title: '和 Priya 對齊需求',
        description: '向 Priya 取得資料視覺化 mockup',
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

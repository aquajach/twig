import type { SideEffect } from '@/engine/types';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';

export function executeSideEffect(effect: SideEffect): void {
  const game = useGameStore.getState();
  const chat = useChatStore.getState();

  switch (effect.type) {
    case 'unlock_npc':
      game.unlockNpc(effect.npcId);
      break;

    case 'send_npc_message':
      chat.addMessage(effect.npcId, {
        role: 'npc',
        content: effect.content,
        timestamp: Date.now(),
      });
      break;

    case 'show_notification':
      // Layer 8 will implement the notification UI.
      // For now, log so engine tests can verify the effect fires.
      console.log('[notification]', effect.app, effect.title, effect.body);
      break;

    case 'create_task':
      game.createTask(effect.task);
      break;

    case 'complete_task':
      game.setTaskStatus(effect.taskId, 'completed');
      break;

    case 'grant_memo':
      game.addMemo(effect.memo);
      break;

    case 'set_browser_page':
      // Browser page navigation state will be managed in Layer 6.
      console.log('[browser]', 'navigate', effect.pageId);
      break;

    case 'update_browser_page_state':
      // Browser page state will be managed in Layer 6.
      console.log('[browser]', 'updateState', effect.pageId, effect.state);
      break;

    case 'set_flag':
      game.setFlag(effect.flag);
      break;

    case 'activate_storyline':
      game.activateStoryline(effect.storylineId);
      break;

    case 'update_npc_context':
      game.addNpcContextKey(effect.npcId, effect.contextKey);
      break;
  }
}

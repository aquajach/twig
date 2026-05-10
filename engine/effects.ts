import type { GameEvent, SideEffect } from '@/engine/types';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { useStorylineIntroStore } from '@/stores/useStorylineIntroStore';
import { notifyWeTalkIfInBackground, showEngineNotification, useToastStore } from '@/stores/useToastStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { allStorylines } from './storylines';

/** Sets task to completed and shows Mission Center toast only if it was not already completed. */
export function completeTaskIfIncomplete(taskId: string): GameEvent[] | false {
  const game = useGameStore.getState();
  if (game.tasks[taskId] === 'completed') return false;
  const taskDef = game.taskDefinitions[taskId];
  game.setTaskStatus(taskId, 'completed');
  showEngineNotification({
    app: 'mission-center',
    title: '任務完成',
    body: taskDef?.title ?? taskId,
    variant: 'mission_complete',
  });
  return [{ type: 'task_completed', taskId }];
}

/** @returns synthetic events to enqueue after the effect, or `false` when none. */
export function executeSideEffect(effect: SideEffect): GameEvent[] | false {
  const game = useGameStore.getState();
  const chat = useChatStore.getState();

  switch (effect.type) {
    case 'unlock_npc':
      game.unlockNpc(effect.npcId);
      return false;

    case 'unlock_browser_page':
      game.unlockBrowserPage(effect.pageId);
      return false;

    case 'send_npc_message':
      chat.addMessage(effect.npcId, {
        kind: 'text',
        role: 'npc',
        content: effect.content,
        timestamp: Date.now(),
      });
      notifyWeTalkIfInBackground(effect.npcId, effect.content);
      return false;

    case 'send_wetalk_link':
      chat.addMessage(effect.npcId, {
        kind: 'link',
        role: 'npc',
        link: {
          label: effect.linkLabel,
          pageId: effect.pageId,
        },
        timestamp: Date.now(),
      });
      notifyWeTalkIfInBackground(effect.npcId, effect.linkLabel);
      return false;

    case 'show_notification':
      showEngineNotification({
        app: effect.app,
        title: effect.title,
        body: effect.body,
      });
      return false;

    case 'create_task':
      game.createTask(effect.task);
      showEngineNotification({
        app: 'mission-center',
        title: '新任務',
        body: effect.task.title,
        variant: 'mission_new',
      });
      return false;

    case 'complete_task':
      return completeTaskIfIncomplete(effect.taskId);

    case 'grant_memo':
      game.addMemo(effect.memo);
      if (useWindowStore.getState().activeApp !== 'mission-center') {
        useToastStore.getState().incrementBadge('mission-center');
      }
      return false;

    case 'set_browser_page':
      game.setCurrentBrowserPageId(effect.pageId);
      return false;

    case 'update_browser_page_state':
      game.updateBrowserPageState(effect.pageId, effect.state);
      return false;

    case 'activate_storyline':
      {
        const wasAlreadyStarted = (() => {
          const status = game.getStoryline(effect.storylineId)?.status;
          return status === 'active' || status === 'completed';
        })();
        if (!wasAlreadyStarted) {
          const storyline = allStorylines.find((s) => s.id === effect.storylineId);
          if (storyline?.introCard) {
            useStorylineIntroStore.getState().show({
              label: storyline.introCard.label,
              heading: storyline.title,
            });
          }
        }
      }
      game.activateStoryline(effect.storylineId);
      return false;

    case 'set_storyline_status':
      game.setStorylineStatus(effect.storylineId, effect.status);
      return false;

    case 'update_npc_context':
      game.addNpcContextKey(effect.npcId, effect.contextKey);
      return false;
  }
}

import type { SideEffect } from "@/engine/types";
import { useChatStore } from "@/stores/useChatStore";
import { useGameStore } from "@/stores/useGameStore";
import {
  notifyWeTalkIfInBackground,
  showEngineNotification,
  useToastStore,
} from "@/stores/useToastStore";
import { useWindowStore } from "@/stores/useWindowStore";

export function executeSideEffect(effect: SideEffect): void {
  const game = useGameStore.getState();
  const chat = useChatStore.getState();

  switch (effect.type) {
    case "unlock_npc":
      game.unlockNpc(effect.npcId);
      break;

    case "send_npc_message":
      chat.addMessage(effect.npcId, {
        role: "npc",
        content: effect.content,
        timestamp: Date.now(),
      });
      notifyWeTalkIfInBackground(effect.npcId, effect.content);
      break;

    case "show_notification":
      showEngineNotification({
        app: effect.app,
        title: effect.title,
        body: effect.body,
      });
      break;

    case "create_task":
      game.createTask(effect.task);
      showEngineNotification({
        app: "mission-center",
        title: "You have a new mission.",
        body: effect.task.title,
      });
      break;

    case "complete_task": {
      const taskDef = game.taskDefinitions[effect.taskId];
      game.setTaskStatus(effect.taskId, "completed");
      showEngineNotification({
        app: "mission-center",
        title: "Mission completed.",
        body: taskDef?.title ?? effect.taskId,
      });
      break;
    }

    case "grant_memo":
      game.addMemo(effect.memo);
      if (useWindowStore.getState().activeApp !== "mission-center") {
        useToastStore.getState().incrementBadge("mission-center");
      }
      break;

    case "set_browser_page":
      game.setCurrentBrowserPageId(effect.pageId);
      break;

    case "update_browser_page_state":
      game.updateBrowserPageState(effect.pageId, effect.state);
      break;

    case "set_flag":
      game.setFlag(effect.flag);
      break;

    case "activate_storyline":
      game.activateStoryline(effect.storylineId);
      break;

    case "update_npc_context":
      game.addNpcContextKey(effect.npcId, effect.contextKey);
      break;
  }
}

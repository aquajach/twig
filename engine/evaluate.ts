import { executeSideEffect } from '@/engine/effects';
import { allStorylines } from '@/engine/storylines';
import type { Condition, GameEvent, Storyline, StorylineStep, Trigger } from '@/engine/types';
import { useGameStore } from '@/stores/useGameStore';

function triggerMatches(trigger: Trigger, event: GameEvent): boolean {
  if (trigger.type === 'game_start' || trigger.type === 'manual') return false;
  if (trigger.type !== event.type) return false;

  switch (trigger.type) {
    case 'chat_message_sent':
    case 'chat_message_received': {
      const e = event as typeof trigger & { content: string };
      if (trigger.npcId !== e.npcId) return false;
      if (trigger.keywords?.length) {
        const lower = e.content.toLowerCase();
        return trigger.keywords.some((kw) => lower.includes(kw.toLowerCase()));
      }
      return true;
    }

    case 'npc_chat_opened': {
      const e = event as typeof trigger;
      return trigger.npcId === e.npcId;
    }

    case 'browser_page_visited': {
      const e = event as typeof trigger;
      return trigger.pageId === e.pageId;
    }

    case 'browser_action': {
      const e = event as typeof trigger;
      return trigger.pageId === e.pageId && trigger.actionId === e.actionId;
    }

    case 'task_completed': {
      const e = event as typeof trigger;
      return trigger.taskId === e.taskId;
    }

    case 'storyline_completed': {
      const e = event as typeof trigger;
      return trigger.storylineId === e.storylineId;
    }
  }
}

function conditionPasses(condition: Condition): boolean {
  const state = useGameStore.getState();

  switch (condition.type) {
    case 'storyline_status': {
      const runtime = state.storylines[condition.storylineId];
      return runtime?.status === condition.status;
    }

    case 'storyline_at_step': {
      const runtime = state.storylines[condition.storylineId];
      if (!runtime || runtime.status !== 'active') return false;
      const storyline = allStorylines.find((s) => s.id === condition.storylineId);
      if (!storyline) return false;
      const currentStep = storyline.steps[runtime.currentStepIndex];
      return currentStep?.id === condition.stepId;
    }

    case 'storyline_past_step': {
      const runtime = state.storylines[condition.storylineId];
      if (!runtime) return false;
      const storyline = allStorylines.find((s) => s.id === condition.storylineId);
      if (!storyline) return false;
      const stepIndex = storyline.steps.findIndex((s) => s.id === condition.stepId);
      if (stepIndex === -1) return false;
      return runtime.currentStepIndex > stepIndex;
    }

    case 'task_status':
      return state.tasks[condition.taskId] === condition.status;

    case 'npc_unlocked':
      return state.unlockedNpcs.includes(condition.npcId);

    case 'flag_set':
      return state.flags.includes(condition.flag);
  }
}

function advanceStep(storyline: Storyline, step: StorylineStep): void {
  const state = useGameStore.getState();
  const runtime = state.storylines[storyline.id];
  if (!runtime) return;

  for (const effect of step.effects) {
    executeSideEffect(effect);
  }

  const isLastStep = runtime.currentStepIndex >= storyline.steps.length - 1;

  if (isLastStep) {
    state.completeStoryline(storyline.id);
  } else {
    state.advanceStep(storyline.id);
  }

  processManualTriggers();
}

function processManualTriggers(): void {
  const state = useGameStore.getState();

  for (const storyline of allStorylines) {
    const runtime = state.storylines[storyline.id];
    if (!runtime || runtime.status !== 'active') continue;

    const step = storyline.steps[runtime.currentStepIndex];
    if (!step || step.trigger.type !== 'manual') continue;

    const conditionsPass = !step.conditions?.length || step.conditions.every((c) => conditionPasses(c));
    if (!conditionsPass) continue;

    advanceStep(storyline, step);
    return; // re-enter via recursion in advanceStep if more manuals chain
  }
}

export function evaluate(event: GameEvent): void {
  const state = useGameStore.getState();

  for (const storyline of allStorylines) {
    const runtime = state.storylines[storyline.id];
    if (!runtime || runtime.status !== 'active') continue;

    const step = storyline.steps[runtime.currentStepIndex];
    if (!step) continue;

    if (!triggerMatches(step.trigger, event)) continue;

    const conditionsPass = !step.conditions?.length || step.conditions.every((c) => conditionPasses(c));
    if (!conditionsPass) continue;

    advanceStep(storyline, step);
  }
}

export function initializeEngine(): void {
  const state = useGameStore.getState();

  for (const storyline of allStorylines) {
    if (!state.storylines[storyline.id]) {
      const status = storyline.id === 'game-start' ? 'active' : (storyline.initialStatus ?? 'locked');
      state.initStoryline(storyline.id, status);
    }
  }

  processManualTriggers();
}

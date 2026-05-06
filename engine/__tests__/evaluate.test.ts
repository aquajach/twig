import { beforeEach, describe, expect, it } from 'vitest';
import { evaluate, initializeEngine } from '@/engine/evaluate';
import { allStorylines } from '@/engine/storylines';
import type { StorylineGraph } from '@/engine/types';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';

beforeEach(() => {
  useGameStore.getState().reset();
  useChatStore.getState().reset();
});

describe('initializeEngine', () => {
  it('bootstraps gameStart and cascades into ebankingLoginBug', () => {
    initializeEngine();

    const state = useGameStore.getState();

    expect(state.storylines.gameStart.status).toBe('active');
    expect(state.storylines.gameStart.firedStepIds).toEqual(['init', 'manager-reports-bug']);

    expect(state.storylines.ebankingLoginBug.status).toBe('locked');
    expect(state.storylines.ebankingLoginBug.firedStepIds).toEqual([]);

    expect(state.unlockedNpcs).toContain('manager');
    expect(state.unlockedNpcs).not.toContain('dev');

    const managerHistory = useChatStore.getState().getHistory('manager');
    expect(managerHistory).toHaveLength(1);
    expect(managerHistory[0].role).toBe('npc');
    expect(managerHistory[0].content).toContain('Welcome');

    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    const afterHandoff = useGameStore.getState();
    expect(afterHandoff.storylines.ebankingLoginBug.status).toBe('active');
    expect(afterHandoff.storylines.ebankingLoginBug.firedStepIds).toEqual(['ebanking-login-bug-started']);
    expect(afterHandoff.unlockedNpcs).toContain('dev');
    expect(afterHandoff.tasks['investigate-login']).toBe('active');

    expect(state.storylines.hiddenCoffeeQuest.status).toBe('active');
    expect(state.storylines.hiddenCoffeeQuest.firedStepIds).toEqual([]);
  });
});

describe('trigger matching', () => {
  beforeEach(() => {
    initializeEngine();
  });

  it('advances ebanking after dev credentials message', () => {
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser and password',
    });

    const runtime = useGameStore.getState().storylines.ebankingLoginBug;
    expect(runtime.firedStepIds).toContain('got-credentials');
  });

  it('does not advance credentials step without keywords', () => {
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Sure, let me check.',
    });

    const runtime = useGameStore.getState().storylines.ebankingLoginBug;
    expect(runtime.firedStepIds).not.toContain('got-credentials');
  });

  it('matches chat_message_sent to manager and activates handoff step', () => {
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi Sarah' });

    const state = useGameStore.getState();
    expect(state.storylines.gameStart.firedStepIds).toContain('manager-intro-replied');
    expect(state.storylines.ebankingLoginBug.status).toBe('active');
  });

  it('matches credential keywords case-insensitively', () => {
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Your TESTUSER is ready with the PASSWORD',
    });

    expect(useGameStore.getState().storylines.ebankingLoginBug.firedStepIds).toContain('got-credentials');
    expect(useGameStore.getState().tasks['get-credentials']).toBe('completed');
  });
});

describe('conditions', () => {
  beforeEach(() => {
    initializeEngine();
  });

  it('blocks reported-error when got-error has not fired yet', () => {
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser and password',
    });

    const before = useGameStore.getState().storylines.ebankingLoginBug.firedStepIds;

    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'The error code is ERR-LB-4012',
    });

    const after = useGameStore.getState().storylines.ebankingLoginBug.firedStepIds;
    expect(after).toEqual(before);
  });

  it('allows reported-error after got-error and matching dev message', () => {
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser and password',
    });
    evaluate({
      type: 'browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
    });

    expect(useGameStore.getState().storylines.ebankingLoginBug.firedStepIds).toContain('got-error');

    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'The error code is ERR-LB-4012',
    });

    expect(useGameStore.getState().storylines.ebankingLoginBug.firedStepIds).toContain('reported-error');
    expect(useGameStore.getState().tasks['report-error-code']).toBe('completed');
  });
});

describe('storyline completion', () => {
  it('completes the full ebankingLoginBug storyline', () => {
    initializeEngine();

    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser / password',
    });
    evaluate({
      type: 'browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
    });
    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'Error code is ERR-LB-4012',
    });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Found it, pushing a fix now',
    });
    evaluate({
      type: 'browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
    });
    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'Login works now!',
    });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: "Great, I'll deploy the patch to production now",
    });

    const state = useGameStore.getState();
    expect(state.storylines.ebankingLoginBug.status).toBe('completed');
    expect(state.memos).toContain('first-bug-fix');
    expect(state.tasks['investigate-login']).toBe('completed');
    expect(state.tasks['confirm-fix-with-dev']).toBe('completed');
  });
});

describe('hiddenCoffeeQuest', () => {
  it('grants memo when player mentions coffee to manager', () => {
    initializeEngine();

    evaluate({
      type: 'chat_message_sent',
      npcId: 'manager',
      content: 'Do you want some coffee?',
    });

    const state = useGameStore.getState();
    expect(state.storylines.hiddenCoffeeQuest.status).toBe('active');
    expect(state.storylines.hiddenCoffeeQuest.firedStepIds).toContain('mention-coffee');
    expect(state.memos).toContain('coffee-lover');
  });

  it('does not trigger on wrong NPC', () => {
    initializeEngine();

    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'Do you want some coffee?',
    });

    const state = useGameStore.getState();
    expect(state.storylines.hiddenCoffeeQuest.firedStepIds).not.toContain('mention-coffee');
    expect(state.memos).not.toContain('coffee-lover');
  });
});

describe('event enabled port', () => {
  const testGraph: StorylineGraph = {
    id: 'eventEnabledPortTest',
    title: 'Event Enabled Port Test',
    initialStatus: 'active',
    nodes: {
      'evt-enable': {
        type: 'evt_chat_message_sent',
        npcId: 'manager',
        keywords: ['unlock'],
      },
      'step-enable': {
        type: 'step',
        triggeredBy: ['evt-enable'],
      },
      'evt-target': {
        type: 'evt_chat_message_sent',
        npcId: 'manager',
        keywords: ['coffee'],
        enabledBy: ['step-enable'],
      },
      'step-target': {
        type: 'step',
        triggeredBy: ['evt-target'],
      },
      'evt-manual': {
        type: 'evt_manual',
        enabledBy: ['step-enable'],
      },
      'step-manual': {
        type: 'step',
        triggeredBy: ['evt-manual'],
      },
      'cond-enabled': {
        type: 'condition',
        condition: { type: 'npc_unlocked', npcId: 'manager' },
      },
      'evt-cond-target': {
        type: 'evt_chat_message_sent',
        npcId: 'manager',
        keywords: ['cond'],
        enabledConditions: ['cond-enabled'],
      },
      'step-cond-target': {
        type: 'step',
        triggeredBy: ['evt-cond-target'],
      },
    },
  };

  beforeEach(() => {
    if (!allStorylines.some((g) => g.id === testGraph.id)) {
      allStorylines.push(testGraph);
    }
  });

  it('skips matching for disabled events until enabled', () => {
    initializeEngine();

    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'coffee' });

    let runtime = useGameStore.getState().storylines[testGraph.id];
    expect(runtime.firedStepIds).not.toContain('step-target');

    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'unlock' });
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'coffee' });

    runtime = useGameStore.getState().storylines[testGraph.id];
    expect(runtime.firedStepIds).toContain('step-enable');
    expect(runtime.firedStepIds).toContain('step-target');
  });

  it('applies enabledConditions to event matching', () => {
    initializeEngine();
    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'cond' });

    const runtime = useGameStore.getState().storylines[testGraph.id];
    expect(runtime.firedStepIds).toContain('step-cond-target');
  });

  it('gates manual events and satisfies them once enabled', () => {
    initializeEngine();

    let runtime = useGameStore.getState().storylines[testGraph.id];
    expect(runtime.firedStepIds).not.toContain('step-manual');

    evaluate({ type: 'chat_message_sent', npcId: 'manager', content: 'unlock' });

    runtime = useGameStore.getState().storylines[testGraph.id];
    expect(runtime.firedStepIds).toContain('step-enable');
    expect(runtime.firedStepIds).toContain('step-manual');
  });
});

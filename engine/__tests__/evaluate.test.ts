import { beforeEach, describe, expect, it } from 'vitest';
import { evaluate, initializeEngine } from '@/engine/evaluate';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';

beforeEach(() => {
  useGameStore.getState().reset();
  useChatStore.getState().reset();
});

describe('initializeEngine', () => {
  it('bootstraps game-start and cascades into ebanking-login-bug', () => {
    initializeEngine();

    const state = useGameStore.getState();

    // game-start should have completed (single manual step)
    expect(state.storylines['game-start'].status).toBe('completed');

    // ebanking-login-bug activated and its manual step 0 fired
    expect(state.storylines['ebanking-login-bug'].status).toBe('active');
    expect(state.storylines['ebanking-login-bug'].currentStepIndex).toBe(1);

    // Side effects from step 0: manager unlocked, dev unlocked, task created, message sent
    expect(state.unlockedNpcs).toContain('manager');
    expect(state.unlockedNpcs).toContain('dev');
    expect(state.tasks['investigate-login']).toBe('active');

    const managerHistory = useChatStore.getState().getHistory('manager');
    expect(managerHistory).toHaveLength(1);
    expect(managerHistory[0].role).toBe('npc');
    expect(managerHistory[0].content).toContain('e-banking');

    // hidden-coffee-quest should be active and waiting
    expect(state.storylines['hidden-coffee-quest'].status).toBe('active');
    expect(state.storylines['hidden-coffee-quest'].currentStepIndex).toBe(0);
  });
});

describe('trigger matching', () => {
  beforeEach(() => {
    initializeEngine();
  });

  it('advances on npc_chat_opened with correct npcId', () => {
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });

    const runtime = useGameStore.getState().storylines['ebanking-login-bug'];
    expect(runtime.currentStepIndex).toBe(2);
  });

  it('does not advance on npc_chat_opened with wrong npcId', () => {
    evaluate({ type: 'npc_chat_opened', npcId: 'manager' });

    const runtime = useGameStore.getState().storylines['ebanking-login-bug'];
    expect(runtime.currentStepIndex).toBe(1);
  });

  it('matches chat_message_sent and fires effects', () => {
    // Advance past step 1 (contact-developer)
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });
    // Step 2: any message to dev
    evaluate({ type: 'chat_message_sent', npcId: 'dev', content: 'Hi there' });

    const state = useGameStore.getState();
    expect(state.storylines['ebanking-login-bug'].currentStepIndex).toBe(3);
    expect(state.npcContextKeys['dev']).toContain('knows-player-needs-credentials');
    expect(state.tasks['get-credentials']).toBe('active');
  });

  it('matches keyword triggers case-insensitively', () => {
    // Advance to step 3 (got-credentials)
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });
    evaluate({ type: 'chat_message_sent', npcId: 'dev', content: 'Hi' });

    // Step 3 expects keywords from dev's response
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Your TESTUSER is ready with the PASSWORD',
    });

    const state = useGameStore.getState();
    expect(state.storylines['ebanking-login-bug'].currentStepIndex).toBe(4);
    expect(state.tasks['get-credentials']).toBe('completed');
  });

  it('does not match when keywords are absent', () => {
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });
    evaluate({ type: 'chat_message_sent', npcId: 'dev', content: 'Hi' });

    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Sure, let me check.',
    });

    const state = useGameStore.getState();
    // Should still be at step 3
    expect(state.storylines['ebanking-login-bug'].currentStepIndex).toBe(3);
  });
});

describe('conditions', () => {
  beforeEach(() => {
    initializeEngine();
  });

  it('blocks trigger when condition fails (flag_set)', () => {
    // Fast-forward to step 6 (reported-error) which requires flag 'seen-error-code'
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });
    evaluate({ type: 'chat_message_sent', npcId: 'dev', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser and password',
    });
    evaluate({
      type: 'browser_page_visited',
      pageId: 'lion-bank-ebanking',
    });

    // Now at step 5 (got-error). Skip submitting the form, so flag won't be set.
    // Try to send error code directly — step 6 condition should block.
    const before = useGameStore.getState().storylines['ebanking-login-bug'].currentStepIndex;

    // This shouldn't match step 5's trigger (browser_action) either
    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'The error code is ERR-LB-4012',
    });

    const after = useGameStore.getState().storylines['ebanking-login-bug'].currentStepIndex;
    expect(after).toBe(before);
  });

  it('allows trigger when condition passes (flag_set)', () => {
    // Full path to step 6
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });
    evaluate({ type: 'chat_message_sent', npcId: 'dev', content: 'Hi' });
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser and password',
    });
    evaluate({
      type: 'browser_page_visited',
      pageId: 'lion-bank-ebanking',
    });
    evaluate({
      type: 'browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
    });

    // Flag should be set now
    expect(useGameStore.getState().flags).toContain('seen-error-code');
    expect(useGameStore.getState().storylines['ebanking-login-bug'].currentStepIndex).toBe(6);

    // Now report the error
    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'The error code is ERR-LB-4012',
    });

    expect(useGameStore.getState().storylines['ebanking-login-bug'].currentStepIndex).toBe(7);
    expect(useGameStore.getState().tasks['report-error-code']).toBe('completed');
  });
});

describe('storyline completion', () => {
  it('completes the full ebanking-login-bug storyline', () => {
    initializeEngine();

    // Step 1: open dev chat
    evaluate({ type: 'npc_chat_opened', npcId: 'dev' });
    // Step 2: message dev
    evaluate({ type: 'chat_message_sent', npcId: 'dev', content: 'Hi' });
    // Step 3: dev replies with credentials
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Use testuser / password',
    });
    // Step 4: visit e-banking
    evaluate({
      type: 'browser_page_visited',
      pageId: 'lion-bank-ebanking',
    });
    // Step 5: submit login
    evaluate({
      type: 'browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
    });
    // Step 6: report error
    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'Error code is ERR-LB-4012',
    });
    // Step 7: dev fixes it
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: 'Found it, pushing a fix now',
    });
    // Step 8: retest login
    evaluate({
      type: 'browser_action',
      pageId: 'lion-bank-ebanking',
      actionId: 'login-submit',
    });
    // Step 9: confirm fix
    evaluate({
      type: 'chat_message_sent',
      npcId: 'dev',
      content: 'Login works now!',
    });
    // Step 10: dev announces patch
    evaluate({
      type: 'chat_message_received',
      npcId: 'dev',
      content: "Great, I'll deploy the patch to production now",
    });

    const state = useGameStore.getState();
    expect(state.storylines['ebanking-login-bug'].status).toBe('completed');
    expect(state.memos).toContain('first-bug-fix');
    expect(state.tasks['investigate-login']).toBe('completed');
    expect(state.tasks['confirm-fix-with-dev']).toBe('completed');
  });
});

describe('hidden-coffee-quest', () => {
  it('grants memo when player mentions coffee to manager', () => {
    initializeEngine();

    evaluate({
      type: 'chat_message_sent',
      npcId: 'manager',
      content: 'Do you want some coffee?',
    });

    const state = useGameStore.getState();
    expect(state.storylines['hidden-coffee-quest'].status).toBe('completed');
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
    expect(state.storylines['hidden-coffee-quest'].currentStepIndex).toBe(0);
    expect(state.memos).not.toContain('coffee-lover');
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToastStore } from '@/stores/useToastStore';
import { useWindowStore } from '@/stores/useWindowStore';

beforeEach(() => {
  useGameStore.getState().reset();
  useChatStore.getState().reset();
  useWindowStore.getState().reset();
});

describe('useGameStore.createTask', () => {
  it('stores the full task definition for later display', () => {
    useGameStore.getState().createTask({
      id: 'task-1',
      storylineId: 'demo',
      title: 'Do the thing',
      description: 'A thing must be done.',
    });

    const state = useGameStore.getState();
    expect(state.tasks['task-1']).toBe('active');
    expect(state.taskDefinitions['task-1']).toEqual({
      id: 'task-1',
      storylineId: 'demo',
      title: 'Do the thing',
      description: 'A thing must be done.',
    });
  });

  it('does not overwrite an existing task definition', () => {
    const game = useGameStore.getState();
    game.createTask({ id: 't', storylineId: 's', title: 'first', description: '' });
    game.createTask({ id: 't', storylineId: 's', title: 'second', description: '' });
    expect(useGameStore.getState().taskDefinitions.t.title).toBe('first');
  });
});

describe('useGameStore.addMemo', () => {
  it('stores the full memo definition for later display', () => {
    useGameStore.getState().addMemo({
      id: 'memo-1',
      title: 'Trophy',
      description: 'Earned a thing.',
      icon: '🏆',
    });

    const state = useGameStore.getState();
    expect(state.memos).toContain('memo-1');
    expect(state.memoDefinitions['memo-1']).toEqual({
      id: 'memo-1',
      title: 'Trophy',
      description: 'Earned a thing.',
      icon: '🏆',
    });
  });
});

describe('store reset methods', () => {
  it('useGameStore.reset clears tasks, definitions, and memos', () => {
    const game = useGameStore.getState();
    game.createTask({ id: 't', storylineId: 's', title: 'x', description: '' });
    game.addMemo({ id: 'm', title: 'M', description: 'd' });

    game.reset();

    const state = useGameStore.getState();
    expect(state.tasks).toEqual({});
    expect(state.taskDefinitions).toEqual({});
    expect(state.memos).toEqual([]);
    expect(state.memoDefinitions).toEqual({});
  });

  it('useGameStore.reset clears notification badges', () => {
    useToastStore.getState().incrementBadge('wetalk');
    useToastStore.getState().incrementBadge('mission-center');

    useGameStore.getState().reset();

    expect(useToastStore.getState().badges).toEqual({});
  });

  it('useWindowStore.reset clears the active app', () => {
    useWindowStore.getState().openApp('mission-center');
    expect(useWindowStore.getState().activeApp).toBe('mission-center');

    useWindowStore.getState().reset();
    expect(useWindowStore.getState().activeApp).toBeNull();
  });
});

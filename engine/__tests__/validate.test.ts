import { describe, expect, it } from 'vitest';
import { validateGraph } from '@/engine/validate';
import type { StorylineGraph } from '../types';

describe('validateGraph', () => {
  it('flags unknown contextKey for a known npc', () => {
    const graph = {
      id: 't',
      title: 'T',
      nodes: {
        c: { type: 'context' as const, npcId: 'manager', contextKey: 'definitely-not-a-defined-segment' },
      },
    };
    const errs = validateGraph(graph as StorylineGraph, new Set());
    expect(errs.some((e) => e.severity === 'error' && e.message.includes('unknown contextKey'))).toBe(true);
  });

  it('flags invalid event enabled references', () => {
    const graph: StorylineGraph = {
      id: 't2',
      title: 'T2',
      nodes: {
        event: { type: 'evt_game_start', enabledBy: ['cond'], enabledConditions: ['task'] },
        cond: { type: 'condition', condition: { type: 'npc_unlocked', npcId: 'manager' } },
        task: { type: 'task', task: { id: 'task', title: 'Task', description: '' } },
      },
    };
    const errs = validateGraph(graph, new Set());
    expect(errs.some((e) => e.severity === 'error' && e.field === 'enabledBy')).toBe(true);
    expect(errs.some((e) => e.severity === 'error' && e.field === 'enabledConditions')).toBe(true);
  });
});

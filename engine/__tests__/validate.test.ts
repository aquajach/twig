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
});

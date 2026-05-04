import fs from 'node:fs';
import path from 'node:path';
import { parseStorylineFile, writeStorylineFile } from '@/engine/codec';
import {
  type ContextSegmentRef,
  collectContextSegmentReferences,
  parseNpcContextSegmentsFile,
  writeNpcContextSegmentsFile,
} from '@/engine/contextSegmentsCodec';
import type { GraphNode, StorylineGraph } from '@/engine/types';
import { validateGraph } from '@/engine/validate';

const CONTEXT_SEGMENTS_DIR = path.join(process.cwd(), 'data', 'contextSegments');
const STORYLINES_DIR = path.join(process.cwd(), 'engine', 'storylines');

export function listContextSegmentNpcIds(): string[] {
  if (!fs.existsSync(CONTEXT_SEGMENTS_DIR)) return [];
  return fs
    .readdirSync(CONTEXT_SEGMENTS_DIR)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => path.basename(f, '.ts'));
}

export function loadAllSegmentMaps(): Record<string, Record<string, string>> {
  const ids = listContextSegmentNpcIds();
  const out: Record<string, Record<string, string>> = {};
  for (const id of ids) {
    const fp = path.join(CONTEXT_SEGMENTS_DIR, `${id}.ts`);
    out[id] = parseNpcContextSegmentsFile(fp);
  }
  return out;
}

export function loadAllStorylineGraphs(allStorylineIds: Set<string>): { storylineId: string; graph: StorylineGraph }[] {
  const files = fs.readdirSync(STORYLINES_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  const out: { storylineId: string; graph: StorylineGraph }[] = [];
  for (const f of files) {
    const storylineId = path.basename(f, '.ts');
    const fp = path.join(STORYLINES_DIR, f);
    out.push({ storylineId, graph: parseStorylineFile(fp, allStorylineIds) });
  }
  return out;
}

export function buildReferenceIndex(allStorylineIds: Set<string>): Record<string, Record<string, ContextSegmentRef[]>> {
  const loaded = loadAllStorylineGraphs(allStorylineIds);
  return collectContextSegmentReferences(loaded.map(({ storylineId, graph }) => ({ storylineId, nodes: graph.nodes })));
}

/** Apply contextKey rename for one npc across all storyline files on disk. */
export function propagateContextKeyRename(
  npcId: string,
  oldKey: string,
  newKey: string,
  allStorylineIds: Set<string>,
): string[] {
  const updated: string[] = [];
  const files = fs.readdirSync(STORYLINES_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  for (const f of files) {
    const storylineId = path.basename(f, '.ts');
    const fp = path.join(STORYLINES_DIR, f);
    const graph = parseStorylineFile(fp, allStorylineIds);
    let changed = false;
    const nodes = { ...graph.nodes };
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.type === 'context' && node.npcId === npcId && node.contextKey === oldKey) {
        nodes[nodeId] = { ...node, contextKey: newKey } as GraphNode;
        changed = true;
      }
    }
    if (changed) {
      const next: StorylineGraph = { ...graph, nodes };
      writeStorylineFile(fp, next);
      updated.push(storylineId);
    }
  }
  return updated;
}

export type PutNpcSegmentsResult =
  | { ok: true; updatedStorylineIds: string[] }
  | {
      ok: false;
      error: 'delete_blocked';
      blocked: { contextKey: string; refs: ContextSegmentRef[] }[];
    };

/**
 * Writes segment file for one NPC. Detects single-key rename (same value) and propagates to storylines.
 * Blocks removal of a key that is still referenced (unless rename migration cleared refs first).
 */
export function putNpcContextSegments(
  npcId: string,
  newMap: Record<string, string>,
  allStorylineIds: Set<string>,
): PutNpcSegmentsResult {
  const filePath = path.join(CONTEXT_SEGMENTS_DIR, `${npcId}.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Unknown NPC segment file: ${npcId}`);
  }

  const oldMap = parseNpcContextSegmentsFile(filePath);
  const oldKeys = new Set(Object.keys(oldMap));
  const newKeys = new Set(Object.keys(newMap));
  const removed = [...oldKeys].filter((k) => !newKeys.has(k));
  const added = [...newKeys].filter((k) => !oldKeys.has(k));

  let updatedStorylineIds: string[] = [];

  if (removed.length === 1 && added.length === 1) {
    const [rk] = removed;
    const [ak] = added;
    if (oldMap[rk] === newMap[ak]) {
      updatedStorylineIds = propagateContextKeyRename(npcId, rk, ak, allStorylineIds);
      writeNpcContextSegmentsFile(filePath, npcId, newMap);
      validateAllStorylinesOrThrow(allStorylineIds);
      return { ok: true, updatedStorylineIds };
    }
  }

  const refs = buildReferenceIndex(allStorylineIds);
  const npcRefs = refs[npcId] ?? {};
  const blocked: { contextKey: string; refs: ContextSegmentRef[] }[] = [];
  for (const k of removed) {
    const r = npcRefs[k];
    if (r?.length) blocked.push({ contextKey: k, refs: r });
  }
  if (blocked.length) {
    return { ok: false, error: 'delete_blocked', blocked };
  }

  writeNpcContextSegmentsFile(filePath, npcId, newMap);
  validateAllStorylinesOrThrow(allStorylineIds);
  return { ok: true, updatedStorylineIds };
}

function validateAllStorylinesOrThrow(allStorylineIds: Set<string>): void {
  const segmentMaps = loadAllSegmentMaps();
  const files = fs.readdirSync(STORYLINES_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  for (const f of files) {
    const fp = path.join(STORYLINES_DIR, f);
    const graph = parseStorylineFile(fp, allStorylineIds, { skipValidate: true });
    const errs = validateGraph(graph, allStorylineIds, { segmentMaps }).filter((e) => e.severity === 'error');
    if (errs.length) {
      throw new Error(`Validation failed for ${path.basename(f)}: ${errs.map((e) => e.message).join('; ')}`);
    }
  }
}

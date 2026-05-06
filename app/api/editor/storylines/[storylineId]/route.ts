import fs from 'node:fs';
import path from 'node:path';
import { parseStorylineFile, writeStorylineFile } from '@/engine/codec';
import { allStorylines } from '@/engine/storylines';
import type { StorylineGraph } from '@/engine/types';
import { validateGraph } from '@/engine/validate';

function editorForbidden(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Editor API is disabled in production' }, { status: 403 });
  }
  return null;
}

const STORYLINES_DIR = path.join(process.cwd(), 'engine', 'storylines');

export async function GET(_req: Request, ctx: { params: Promise<{ storylineId: string }> }) {
  const denied = editorForbidden();
  if (denied) return denied;

  const { storylineId } = await ctx.params;
  const filePath = path.join(STORYLINES_DIR, `${storylineId}.ts`);
  if (!fs.existsSync(filePath)) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const ids = new Set(allStorylines.map((g) => g.id));
  const graph = parseStorylineFile(filePath, ids);
  return Response.json(graph);
}

export async function PUT(req: Request, ctx: { params: Promise<{ storylineId: string }> }) {
  const denied = editorForbidden();
  if (denied) return denied;

  const { storylineId } = await ctx.params;
  const filePath = path.join(STORYLINES_DIR, `${storylineId}.ts`);
  if (!fs.existsSync(filePath)) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const body = (await req.json()) as StorylineGraph;
  if (!body || body.id !== storylineId) {
    return Response.json({ error: 'Body.id must match route storylineId' }, { status: 400 });
  }

  const ids = new Set(allStorylines.map((g) => g.id));
  const errs = validateGraph(body, ids).filter((e) => e.severity === 'error');
  if (errs.length) {
    return Response.json({ errors: errs }, { status: 400 });
  }

  writeStorylineFile(filePath, body);
  return Response.json({ ok: true });
}

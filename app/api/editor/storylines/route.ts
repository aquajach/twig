import fs from 'node:fs';
import path from 'node:path';
import { allStorylines } from '@/engine/storylines';
import { fileBaseToExportName, writeStorylineFile } from '@/engine/codec';
import type { StorylineGraph } from '@/engine/types';
import { validateGraph } from '@/engine/validate';

function editorForbidden(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Editor API is disabled in production' }, { status: 403 });
  }
  return null;
}

const STORYLINES_DIR = path.join(process.cwd(), 'engine', 'storylines');
const INDEX_FILE = path.join(STORYLINES_DIR, 'index.ts');

export async function GET() {
  const denied = editorForbidden();
  if (denied) return denied;

  const list = allStorylines.map((s) => ({
    id: s.id,
    title: s.title,
    filePath: `engine/storylines/${s.id}.ts`,
  }));
  return Response.json(list);
}

export async function POST(req: Request) {
  const denied = editorForbidden();
  if (denied) return denied;

  const body = (await req.json()) as { id?: string; title?: string };
  const id = body.id?.trim();
  if (!id || !/^[a-z][a-zA-Z0-9]*$/.test(id)) {
    return Response.json({ error: 'Invalid id (use lowerCamelCase: start with a–z, then letters or digits)' }, { status: 400 });
  }

  const filePath = path.join(STORYLINES_DIR, `${id}.ts`);
  if (fs.existsSync(filePath)) {
    return Response.json({ error: 'Storyline file already exists' }, { status: 409 });
  }

  const title = body.title?.trim() || id;
  const graph: StorylineGraph = { id, title, nodes: {} };
  const ids = new Set(allStorylines.map((g) => g.id));
  ids.add(id);
  const errs = validateGraph(graph, ids).filter((e) => e.severity === 'error');
  if (errs.length) {
    return Response.json({ errors: errs }, { status: 400 });
  }

  writeStorylineFile(filePath, graph);

  const exportName = fileBaseToExportName(id);
  const importLine = `import { ${exportName} } from './${id}';`;
  let indexSrc = fs.readFileSync(INDEX_FILE, 'utf8');
  if (indexSrc.includes(`'./${id}'`)) {
    return Response.json(
      { ok: true, id, message: 'File created; index already imports this storyline.' },
      { status: 201 },
    );
  }
  indexSrc = indexSrc.replace(
    '\n\nexport const allStorylines:',
    `\n${importLine}\n\nexport const allStorylines:`,
  );
  indexSrc = indexSrc.replace(
    'export const allStorylines: StorylineGraph[] = [',
    `export const allStorylines: StorylineGraph[] = [${exportName}, `,
  );
  fs.writeFileSync(INDEX_FILE, indexSrc, 'utf8');

  return Response.json({ ok: true, id, filePath: `engine/storylines/${id}.ts` });
}

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { type ObjectLiteralExpression, type VariableDeclaration, Project, SyntaxKind } from 'ts-morph';
import type { StorylineGraph } from '@/engine/types';
import { validateGraph } from '@/engine/validate';

/** File basename (e.g. `gameStart` or `my-graph`) → valid TS export identifier. */
export function fileBaseToExportName(base: string): string {
  return base
    .split('-')
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join('');
}

function getStorylineObjectLiteral(decl: VariableDeclaration): ObjectLiteralExpression | undefined {
  const init = decl.getInitializer();
  if (!init) return undefined;
  const asObj = init.asKind(SyntaxKind.ObjectLiteralExpression);
  if (asObj) return asObj;
  const asCast = init.asKind(SyntaxKind.AsExpression);
  if (asCast) {
    return asCast.getExpression().asKind(SyntaxKind.ObjectLiteralExpression);
  }
  return undefined;
}

export function parseStorylineFile(
  filePath: string,
  allStorylineIds: Set<string> = new Set(),
): StorylineGraph {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const project = new Project({ useInMemoryFileSystem: true });
  const sf = project.createSourceFile(path.basename(filePath), sourceText);
  const decl = sf.getVariableDeclarations().find((d) => d.getTypeNode()?.getText() === 'StorylineGraph');
  if (!decl) {
    throw new Error(`No StorylineGraph export in ${filePath}`);
  }
  const init = getStorylineObjectLiteral(decl);
  if (!init) {
    throw new Error(`StorylineGraph export must use an object literal (optionally wrapped in "as StorylineGraph") in ${filePath}`);
  }
  const graph = new Function(`return (${init.getText()})`)() as StorylineGraph;
  const errs = validateGraph(graph, allStorylineIds);
  if (errs.length && process.env.NODE_ENV !== 'production') {
    console.warn(`[codec] validate ${filePath}:`, errs);
  }
  return graph;
}

export function writeStorylineFile(filePath: string, graph: StorylineGraph): void {
  const base = path.basename(filePath, '.ts');
  const exportName = fileBaseToExportName(base);
  const json = JSON.stringify(graph, null, 2);
  const content = `import type { StorylineGraph } from '@/engine/types';\n\nexport const ${exportName}: StorylineGraph = ${json};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  try {
    execSync(`npx biome check --write "${filePath}"`, {
      stdio: 'pipe',
      cwd: process.cwd(),
    });
  } catch {
    // biome may fail in constrained environments
  }
}

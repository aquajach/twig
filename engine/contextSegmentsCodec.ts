import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { type ObjectLiteralExpression, Project, SyntaxKind, type VariableDeclaration } from 'ts-morph';
import type { GraphNode } from '@/engine/types';

function getObjectLiteralFromDecl(decl: VariableDeclaration): ObjectLiteralExpression | undefined {
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

/** Parse `export const <npcId> = { ... }` from a context segment file. */
export function parseNpcContextSegmentsFile(filePath: string): Record<string, string> {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const npcId = path.basename(filePath, '.ts');
  const project = new Project({ useInMemoryFileSystem: true });
  const sf = project.createSourceFile(path.basename(filePath), sourceText);
  const decl = sf.getVariableDeclaration(npcId);
  if (!decl) {
    throw new Error(`No export const ${npcId} in ${filePath}`);
  }
  const init = getObjectLiteralFromDecl(decl);
  if (!init) {
    throw new Error(`Segment export must use an object literal in ${filePath}`);
  }
  return new Function(`return (${init.getText()})`)() as Record<string, string>;
}

export function writeNpcContextSegmentsFile(filePath: string, npcId: string, data: Record<string, string>): void {
  const json = JSON.stringify(data, null, 2);
  const content = `export const ${npcId} = ${json};\n`;
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

export type ContextSegmentRef = { storylineId: string; nodeId: string };

/** All references to a given (npcId, contextKey) from context nodes across graphs. */
export function collectContextSegmentReferences(
  nodesByGraph: { storylineId: string; nodes: Record<string, GraphNode> }[],
): Record<string, Record<string, ContextSegmentRef[]>> {
  const out: Record<string, Record<string, ContextSegmentRef[]>> = {};
  for (const { storylineId, nodes } of nodesByGraph) {
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.type !== 'context') continue;
      const { npcId, contextKey } = node;
      if (!out[npcId]) out[npcId] = {};
      if (!out[npcId][contextKey]) out[npcId][contextKey] = [];
      out[npcId][contextKey].push({ storylineId, nodeId });
    }
  }
  return out;
}
